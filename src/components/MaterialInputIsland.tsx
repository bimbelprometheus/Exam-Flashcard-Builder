import React, { useState } from 'react';
import { Sparkles, FileText, BookOpen, Trash2, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { SAMPLE_PRESETS, PresetTopic } from '../data/samplePresets';

interface MaterialInputIslandProps {
  onGenerate: (text: string, focusTopic: string) => Promise<void>;
  isLoading: boolean;
}

export const MaterialInputIsland: React.FC<MaterialInputIslandProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [materialText, setMaterialText] = useState<string>(SAMPLE_PRESETS[0].text);
  const [focusTopic, setFocusTopic] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_PRESETS[0].id);

  const wordCount = materialText.trim() ? materialText.trim().split(/\s+/).length : 0;
  const charCount = materialText.length;

  const handleSelectPreset = (preset: PresetTopic) => {
    setSelectedPresetId(preset.id);
    setMaterialText(preset.text);
    setFocusTopic(preset.title);
  };

  const handleClear = () => {
    setMaterialText('');
    setFocusTopic('');
    setSelectedPresetId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialText.trim() || isLoading) return;
    onGenerate(materialText, focusTopic);
  };

  return (
    <section className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl transition-all">
      {/* Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Input Materi Pelajaran / Catatan Siswa
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tempelkan ringkasan materi bab buku, rangkuman, atau pilih contoh topik kurikulum berikut.
          </p>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Contoh:
          </span>
          {SAMPLE_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                id={`preset-btn-${preset.id}`}
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {preset.title.split(' ')[0]} {preset.title.split(' ')[1] || ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Optional Focus Topic */}
        <div>
          <label htmlFor="focus-topic-input" className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5">
            Topik / Judul Fokus (Opsional)
          </label>
          <input
            id="focus-topic-input"
            type="text"
            value={focusTopic}
            onChange={(e) => setFocusTopic(e.target.value)}
            placeholder="Contoh: Reaksi Terang Fotosintesis, Proklamasi 1945, Hukum II Newton..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-white/10 bg-black/25 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all"
          />
        </div>

        {/* Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="material-textarea" className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Isi Catatan / Teks Bab Materi
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>{wordCount} kata</span>
              <span>•</span>
              <span>{charCount} karakter</span>
              {materialText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-rose-400 hover:text-rose-300 font-sans font-medium flex items-center gap-1 ml-1"
                >
                  <Trash2 className="w-3 h-3" /> Bersihkan
                </button>
              )}
            </div>
          </div>

          <textarea
            id="material-textarea"
            rows={7}
            value={materialText}
            onChange={(e) => {
              setMaterialText(e.target.value);
              setSelectedPresetId('');
            }}
            placeholder="Ketik atau tempelkan materi pelajaran di sini (minimal 10 karakter)..."
            className="w-full p-4 text-sm rounded-xl border border-white/10 bg-black/30 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 transition-all font-sans leading-relaxed resize-y"
            required
          />
        </div>

        {/* Features Checklist Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 bg-white/5 p-3.5 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>5 Soal Pilihan Ganda (A-D) + Kunci + Pembahasan Mendalam</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>5 Flashcard Active Recall Interaktif (Flip 3D Transition)</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            id="generate-quiz-btn"
            disabled={isLoading || !materialText.trim() || charCount < 10}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100 disabled:shadow-none border border-indigo-400/30"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menganalisis & Membuat Kuis via Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE AI QUIZ & FLASHCARDS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
