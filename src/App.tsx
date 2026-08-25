import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MaterialInputIsland } from './components/MaterialInputIsland';
import { InteractiveQuizIsland } from './components/InteractiveQuizIsland';
import { ActiveRecallFlashcardIsland } from './components/ActiveRecallFlashcardIsland';
import { EdgeExportModal } from './components/EdgeExportModal';
import { ExportSummaryModal } from './components/ExportSummaryModal';
import { QuizFlashcardPayload } from './types';
import { SAMPLE_PRESETS } from './data/samplePresets';
import {
  Sparkles,
  CheckCircle2,
  Layers,
  FileDown,
  Info,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Zap,
} from 'lucide-react';

export default function App() {
  const [quizData, setQuizData] = useState<QuizFlashcardPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards' | 'both'>('both');
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Initial load with default preset for instant preview
  useEffect(() => {
    handleGenerate(SAMPLE_PRESETS[0].text, SAMPLE_PRESETS[0].title);
  }, []);

  const handleGenerate = async (text: string, focusTopic: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          focusTopic,
          language: 'id',
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${response.status}: Gagal memproses kuis.`);
      }

      const result: QuizFlashcardPayload = await response.json();
      setQuizData(result);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage(err.message || 'Terjadi gangguan saat memproses materi dengan AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuizData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-frosted-radial text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        onOpenEdgeModal={() => setIsEdgeModalOpen(true)}
        onReset={handleReset}
        hasData={Boolean(quizData)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Banner Announcement */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 text-white rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-300" /> Astro Islands & Cloudflare Edge Runtime
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Generator Soal Kuis & Active Recall Flashcard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Otomatis menghasilkan 5 soal pilihan ganda dengan kunci + pembahasan, serta 5 flashcard active recall dengan transisi CSS 3D dari materi pelajaran apa pun.
            </p>
          </div>

          <button
            onClick={() => setIsEdgeModalOpen(true)}
            className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all shadow-md border border-white/15 backdrop-blur-md"
          >
            Lihat Arsitektur Edge
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-rose-300">Gagal Membuat Kuis</div>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 1. Input Island */}
        <MaterialInputIsland onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Loading Skeleton */}
        {isLoading && !quizData && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mx-auto flex items-center justify-center animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-100">
                Gemini 3.7 Flash Sedang Menganalisis Materi...
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Menyusun 5 soal evaluasi terstruktur dan 5 flashcard active recall dengan format JSON terstandarisasi.
              </p>
            </div>
          </div>
        )}

        {/* 2. Generated Output Section */}
        {quizData && (
          <div className="space-y-6 pt-2">
            {/* Topic Summary Card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Hasil Analisis Materi Pembelajaran
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {quizData.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {quizData.summary}
                </p>
              </div>

              {/* Action Buttons & Tab Switchers */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* View Mode Tabs */}
                <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-semibold backdrop-blur-md">
                  <button
                    onClick={() => setActiveTab('both')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      activeTab === 'both'
                        ? 'bg-white/15 text-white shadow-sm border border-white/10'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      activeTab === 'quiz'
                        ? 'bg-indigo-600 text-white shadow-sm border border-indigo-400/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 5 Kuis
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      activeTab === 'flashcards'
                        ? 'bg-purple-600 text-white shadow-sm border border-purple-400/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> 5 Flashcard
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm transition-all backdrop-blur-md"
                >
                  <FileDown className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Ekspor / Anki</span>
                </button>
              </div>
            </div>

            {/* Quiz Island */}
            {(activeTab === 'quiz' || activeTab === 'both') && (
              <InteractiveQuizIsland
                questions={quizData.multipleChoiceQuestions}
                topicTitle={quizData.title}
              />
            )}

            {/* Flashcard Island */}
            {(activeTab === 'flashcards' || activeTab === 'both') && (
              <ActiveRecallFlashcardIsland
                flashcards={quizData.flashcards}
                topicTitle={quizData.title}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md py-5 mt-12 text-center text-xs text-slate-400 space-y-1">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 AstroQuiz AI • Cloudflare Workers Edge Runtime</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Gemini 3.7 Flash Structured Outputs
            </span>
            <span>•</span>
            <span>Astro Islands Architecture</span>
          </div>
        </div>
      </footer>

      {/* Edge Code Modal */}
      <EdgeExportModal
        isOpen={isEdgeModalOpen}
        onClose={() => setIsEdgeModalOpen(false)}
      />

      {/* Export Summary Modal */}
      {quizData && (
        <ExportSummaryModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={quizData}
        />
      )}
    </div>
  );
}
