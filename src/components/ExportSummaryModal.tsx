import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Layers } from 'lucide-react';
import { QuizFlashcardPayload } from '../types';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuizFlashcardPayload;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'markdown' | 'anki-tsv' | 'json'>('markdown');

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# ${data.title}\n\n`;
    md += `> **Ringkasan:** ${data.summary}\n\n`;
    md += `## 📝 5 Soal Pilihan Ganda\n\n`;

    data.multipleChoiceQuestions.forEach((q, idx) => {
      md += `### Soal ${idx + 1}\n${q.question}\n\n`;
      q.options.forEach((opt) => {
        md += `- **${opt.key}.** ${opt.text}\n`;
      });
      md += `\n**Kunci Jawaban:** Opsi ${q.correctAnswer}\n`;
      md += `**Pembahasan:** ${q.explanation}\n\n---\n\n`;
    });

    md += `## 📇 5 Flashcard Active Recall\n\n`;
    data.flashcards.forEach((fc, idx) => {
      md += `### Kartu ${idx + 1} [${fc.tag || 'Konsep'}]\n`;
      md += `**Tanya (Front):** ${fc.front}\n`;
      md += `**Jawab (Back):** ${fc.back}\n\n`;
    });

    return md;
  };

  const generateAnkiTsv = () => {
    let tsv = `# Anki Flashcards Export (Tab-separated)\n# Front\tBack\tTags\n`;
    data.flashcards.forEach((fc) => {
      tsv += `${fc.front.replace(/\t/g, ' ')}\t${fc.back.replace(/\t/g, ' ')}\t${(fc.tag || 'quiz-ai').replace(/\s+/g, '-')}\n`;
    });
    return tsv;
  };

  const generateJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const getContent = () => {
    switch (format) {
      case 'markdown':
        return generateMarkdown();
      case 'anki-tsv':
        return generateAnkiTsv();
      case 'json':
        return generateJson();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'markdown' ? 'md' : format === 'anki-tsv' ? 'tsv' : 'json';
    const blob = new Blob([getContent()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="backdrop-blur-2xl bg-slate-950/90 w-full max-w-2xl rounded-3xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[85vh] text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Ekspor Kuis & Flashcards: {data.title}
              </h3>
              <p className="text-xs text-slate-400">
                Simpan atau cetak untuk bahan belajar offline & aplikasi Anki.
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

        {/* Format Selector */}
        <div className="flex items-center gap-2 p-3 bg-black/40 border-b border-white/10 text-xs font-semibold">
          <button
            onClick={() => setFormat('markdown')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              format === 'markdown'
                ? 'bg-indigo-600 text-white shadow-sm border border-indigo-400/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            Markdown (.md)
          </button>
          <button
            onClick={() => setFormat('anki-tsv')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              format === 'anki-tsv'
                ? 'bg-indigo-600 text-white shadow-sm border border-indigo-400/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            Format Anki (.tsv)
          </button>
          <button
            onClick={() => setFormat('json')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              format === 'json'
                ? 'bg-indigo-600 text-white shadow-sm border border-indigo-400/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
            }`}
          >
            JSON Raw
          </button>
        </div>

        {/* Text Preview */}
        <div className="p-4 overflow-y-auto flex-1 bg-black/60 font-mono text-xs text-slate-200">
          <pre className="whitespace-pre-wrap leading-relaxed font-mono">{getContent()}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Salin ke Clipboard
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Berkas
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
