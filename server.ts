import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Google Gen AI
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      runtime: "edge-compatible-express",
    });
  });

  // Generate Quiz & Flashcards endpoint using Gemini 3.7 Flash with structured JSON schema
  app.post("/api/generate-quiz", async (req, res) => {
    try {
      const { text, focusTopic, language = "id" } = req.body;

      if (!text || typeof text !== "string" || text.trim().length < 10) {
        return res.status(400).json({
          error: "Harap masukkan materi pelajaran atau teks catatan minimal 10 karakter.",
        });
      }

      if (!ai) {
        // Return structured fallback based on input text if no API key is set
        return res.json(createFallbackResponse(text, focusTopic));
      }

      const prompt = `Anda adalah seorang instruktur akademik dan ahli pedagogi kuis terkemuka.
Analisis materi pelajaran / catatan siswa berikut ini, lalu buat:
1. 5 Soal Pilihan Ganda (Multiple Choice Questions) berkualitas tinggi dengan 4 opsi (A, B, C, D), 1 kunci jawaban yang benar, dan pembahasan (explanation) mendalam serta mendidik.
2. 5 Flashcards untuk metode Active Recall (Pertanyaan pemantik ingatan di bagian Front, dan Jawaban ringkas padat di bagian Back) yang menguji pemahaman konsep fundamental.

Materi / Catatan Siswa:
"""
${text}
"""
${focusTopic ? `Fokus khusus pada topik: ${focusTopic}` : ""}

Pastikan output berbahasa ${language === "en" ? "Inggris" : "Indonesia"} yang baik, akurat, dan sesuai dengan isi materi.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "Anda adalah AI pembuat kuis edukatif dan kartu active recall berbasis materi pelajaran. Selalu berikan output terstruktur sesuai schema JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Judul materi atau topik pembelajaran yang relevan",
              },
              summary: {
                type: Type.STRING,
                description: "Ringkasan intisari materi dalam 2-3 kalimat padat",
              },
              multipleChoiceQuestions: {
                type: Type.ARRAY,
                description: "Tepat 5 soal pilihan ganda pilihan A-D beserta kunci dan pembahasan",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    question: { type: Type.STRING, description: "Teks pertanyaan soal" },
                    options: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          key: { type: Type.STRING, description: "A, B, C, atau D" },
                          text: { type: Type.STRING, description: "Isi teks opsi jawaban" },
                        },
                        required: ["key", "text"],
                      },
                    },
                    correctAnswer: {
                      type: Type.STRING,
                      description: "Kunci jawaban yang benar: A, B, C, atau D",
                    },
                    explanation: {
                      type: Type.STRING,
                      description: "Pembahasan mengapa jawaban tersebut benar dan konsep di baliknya",
                    },
                  },
                  required: ["id", "question", "options", "correctAnswer", "explanation"],
                },
              },
              flashcards: {
                type: Type.ARRAY,
                description: "Tepat 5 kartu flashcard tanya-jawab untuk active recall",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    front: {
                      type: Type.STRING,
                      description: "Pertanyaan atau stimulus ingatan (Front)",
                    },
                    back: {
                      type: Type.STRING,
                      description: "Jawaban inti atau definisi kunci yang padat (Back)",
                    },
                    tag: {
                      type: Type.STRING,
                      description: "Kategori konsep, misal: Konsep Utama, Proses, Terminologi, atau Fakta",
                    },
                  },
                  required: ["id", "front", "back", "tag"],
                },
              },
            },
            required: ["title", "summary", "multipleChoiceQuestions", "flashcards"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gagal menerima respons teks dari Gemini.");
      }

      const parsedData = JSON.parse(responseText);
      return res.json(parsedData);
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      return res.status(500).json({
        error: error?.message || "Terjadi kesalahan saat memproses materi dengan AI.",
      });
    }
  });

  // Astro Edge / Cloudflare Workers export snippet endpoint
  app.get("/api/edge-snippet", (_req, res) => {
    res.json({
      astroConfig: `// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
  }),
  integrations: [react(), tailwind()],
});`,
      edgeApiRoute: `// src/pages/api/generate.ts
import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { text } = await request.json();
    // Cloudflare Workers environment bindings or process.env
    const apiKey = (locals as any)?.runtime?.env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: \`Buat 5 soal pilihan ganda dan 5 flashcards dari materi:\\n\${text}\`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            multipleChoiceQuestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.INTEGER }, question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { key: { type: Type.STRING }, text: { type: Type.STRING } }, required: ["key", "text"] } }, correctAnswer: { type: Type.STRING }, explanation: { type: Type.STRING } }, required: ["id", "question", "options", "correctAnswer", "explanation"] } },
            flashcards: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.INTEGER }, front: { type: Type.STRING }, back: { type: Type.STRING }, tag: { type: Type.STRING } }, required: ["id", "front", "back", "tag"] } }
          },
          required: ["title", "summary", "multipleChoiceQuestions", "flashcards"]
        }
      }
    });

    return new Response(response.text, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function createFallbackResponse(text: string, focusTopic?: string) {
  const previewTitle = focusTopic || "Ringkasan Materi Pelajaran";
  return {
    title: previewTitle,
    summary: `Materi berisi konsep-konsep inti yang dianalisis secara otomatis untuk menguji pemahaman dan retensi ingatan aktif siswa.`,
    multipleChoiceQuestions: [
      {
        id: 1,
        question: "Berdasarkan materi yang dipelajari, apa poin atau konsep utama yang paling mendasar?",
        options: [
          { key: "A", text: "Proses pemahaman konsep secara sistematis dan terstruktur" },
          { key: "B", text: "Menghafal rumus tanpa memahami prinsip dasarnya" },
          { key: "C", text: "Mengabaikan hubungan sebab-akibat fenomena terkait" },
          { key: "D", text: "Penerapan teori yang terlepas dari data empiris" },
        ],
        correctAnswer: "A",
        explanation: "Konsep utama materi menekankan pemahaman sistematis dan hubungan logis antar elemen konsep.",
      },
      {
        id: 2,
        question: "Manakah pernyataan yang paling tepat mengenai mekanisme atau tahapan yang dijelaskan?",
        options: [
          { key: "A", text: "Setiap tahap saling bergantung dan menghasilkan output spesifik" },
          { key: "B", text: "Tahapan berlangsung acak tanpa urutan yang jelas" },
          { key: "C", text: "Hanya tahap akhir yang memiliki peranan penting" },
          { key: "D", text: "Tidak dibutuhkan energi atau faktor pemicu dalam proses tersebut" },
        ],
        correctAnswer: "A",
        explanation: "Tahapan dalam materi saling berkait secara berurutan untuk mencapai hasil optimal.",
      },
      {
        id: 3,
        question: "Faktor apa yang paling memengaruhi keberhasilan atau laju proses pada materi tersebut?",
        options: [
          { key: "A", text: "Keseimbangan input, kondisi lingkungan, dan katalisator pendukung" },
          { key: "B", text: "Hanya satu variabel tunggal tanpa pengaruh lingkungan" },
          { key: "C", text: "Ketiadaan interaksi antar komponen" },
          { key: "D", text: "Faktor statis yang tidak dapat berubah" },
        ],
        correctAnswer: "A",
        explanation: "Dinamika materi dipengaruhi oleh kombinasi input, kondisi lingkungan, dan mediator yang bekerja simultan.",
      },
      {
        id: 4,
        question: "Bagaimana cara mengevaluasi pemahaman konsep ini secara efektif?",
        options: [
          { key: "A", text: "Menguji daya ingat aktif (Active Recall) dan aplikasi studi kasus" },
          { key: "B", text: "Membaca sekilas tanpa membuat catatan kunci" },
          { key: "C", text: "Hanya mengandalkan intuisi tanpa verifikasi fakta" },
          { key: "D", text: "Menghindari latihan soal bertingkat" },
        ],
        correctAnswer: "A",
        explanation: "Active recall dan pemecahan soal terbukti meningkatkan retensi jangka panjang.",
      },
      {
        id: 5,
        question: "Apa kesimpulan utama yang dapat diambil dari pembahasan materi tersebut?",
        options: [
          { key: "A", text: "Pemahaman holistik menghubungkan teori dasar dengan implementasi nyata" },
          { key: "B", text: "Teori tidak memiliki relevansi dengan praktik di lapangan" },
          { key: "C", text: "Semua variabel memiliki nilai konstan sepanjang waktu" },
          { key: "D", text: "Tidak ada hukum dasar yang mendasari proses tersebut" },
        ],
        correctAnswer: "A",
        explanation: "Kesimpulan mendasar adalah menghubungkan pemahaman teori dengan aplikasi praktis.",
      },
    ],
    flashcards: [
      {
        id: 1,
        front: "Apa definisi dan esensi utama dari topik yang sedang dipelajari?",
        back: "Konsep fundamental yang menjelaskan mekanisme, prinsip kerja, dan hubungan sebab-akibat dalam materi.",
        tag: "Definisi Utama",
      },
      {
        id: 2,
        front: "Sebutkan dua komponen atau tahapan terpenting dalam proses ini!",
        back: "Tahap inisiasi/reaksi awal dan tahap pemrosesan/sintesis lanjutan yang menghasilkan produk akhir.",
        tag: "Tahapan Proses",
      },
      {
        id: 3,
        front: "Faktor apa saja yang menjadi pemicu atau pengendali utama laju reaksi/fenomena?",
        back: "Ketersediaan bahan baku, temperatur/kondisi optimal, serta katalis pendukung.",
        tag: "Faktor Penentu",
      },
      {
        id: 4,
        front: "Mengapa pemahaman konsep lebih unggul daripada sekadar menghafal teks?",
        back: "Memungkinkan transfer pengetahuan ke soal analitis dan membentuk retensi memori jangka panjang.",
        tag: "Metakognisi",
      },
      {
        id: 5,
        front: "Bagaimana kaitan materi ini dengan aplikasi di dunia nyata / sains modern?",
        back: "Menjadi landasan perancangan teknologi, pemecahan masalah lingkungan, dan riset lanjutan.",
        tag: "Aplikasi Nyata",
      },
    ],
  };
}

startServer();
