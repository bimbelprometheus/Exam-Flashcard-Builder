import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Cloud, Code } from 'lucide-react';

interface EdgeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EdgeExportModal: React.FC<EdgeExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'astro-config' | 'api-route' | 'cloudflare-wrangler'>('api-route');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const astroConfigCode = `// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Konfigurasi Astro SSR untuk Cloudflare Workers Edge Runtime
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    runtime: {
      mode: 'off',
      type: 'pages',
    },
  }),
  integrations: [react(), tailwind()],
});`;

  const apiRouteCode = `// src/pages/api/generate-quiz.ts
import type { APIRoute } from 'astro';
import { GoogleGenAI, Type } from '@google/genai';

export const prerender = false; // Memastikan endpoint berjalan di Edge SSR

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { text, focusTopic } = await request.json();

    if (!text || text.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Teks materi minimal 10 karakter." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Akses Cloudflare Workers environment secret
    const runtimeEnv = (locals as any)?.runtime?.env;
    const apiKey = runtimeEnv?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY tidak ditemukan di environment Cloudflare." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: \`Analisis materi pelajaran ini dan buat 5 Soal Pilihan Ganda + Kunci + Pembahasan dan 5 Flashcard Active Recall:\\n\\n\${text}\`,
      config: {
        systemInstruction: "Anda adalah AI pembuat kuis edukatif terstruktur.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            multipleChoiceQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        key: { type: Type.STRING },
                        text: { type: Type.STRING }
                      },
                      required: ["key", "text"]
                    }
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation"]
              }
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  tag: { type: Type.STRING }
                },
                required: ["id", "front", "back", "tag"]
              }
            }
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
    return new Response(
      JSON.stringify({ error: err?.message || "Gagal memproses di Edge." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};`;

  const wranglerCode = `# wrangler.toml (Cloudflare Workers / Pages)
name = "astro-quiz-gemini-edge"
main = "./dist/_worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[vars]
# Variabel publik atau gunakan wrangler secret put GEMINI_API_KEY
`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'astro-config':
        return astroConfigCode;
      case 'api-route':
        return apiRouteCode;
      case 'cloudflare-wrangler':
        return wranglerCode;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="backdrop-blur-2xl bg-slate-950/90 w-full max-w-3xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Arsitektur Astro SSR + Cloudflare Workers Edge
              </h3>
              <p className="text-xs text-slate-400">
                Kompatibel dengan edge runtime & zero-client bloat Astro islands.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('api-route')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'api-route'
                ? 'border-indigo-400 text-indigo-300 bg-white/10 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            src/pages/api/generate-quiz.ts (Edge API)
          </button>
          <button
            onClick={() => setActiveTab('astro-config')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'astro-config'
                ? 'border-indigo-400 text-indigo-300 bg-white/10 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            astro.config.mjs (Cloudflare Adapter)
          </button>
          <button
            onClick={() => setActiveTab('cloudflare-wrangler')}
            className={`px-3.5 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cloudflare-wrangler'
                ? 'border-indigo-400 text-indigo-300 bg-white/10 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            wrangler.toml
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-black/60 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() => copyToClipboard(getActiveCode(), activeTab)}
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-semibold border border-white/15 shadow-sm transition-all"
          >
            {copiedKey === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Salin Kode
              </>
            )}
          </button>

          <pre className="leading-relaxed overflow-x-auto pr-16 whitespace-pre font-mono">
            {getActiveCode()}
          </pre>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <span className="font-semibold text-slate-200">Edge Runtime Keypoint:</span> Menggunakan{' '}
            <code className="bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded text-[11px] border border-white/10">nodejs_compat</code> flag dan Gemini 3.7 Flash structured JSON output.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
