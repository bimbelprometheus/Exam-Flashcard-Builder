import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  Award,
  BookOpen,
  ArrowRight,
  Eye,
  Check,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface InteractiveQuizIslandProps {
  questions: QuizQuestion[];
  topicTitle: string;
}

export const InteractiveQuizIsland: React.FC<InteractiveQuizIslandProps> = ({
  questions,
  topicTitle,
}) => {
  // Map of question id -> selected option key ('A'|'B'|'C'|'D')
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showAllExplanations, setShowAllExplanations] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === questions.length && questions.length > 0;

  // Calculate score
  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount += 1;
    }
  });
  const scorePercentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const handleSelectOption = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    // If already answered, allow changing or keep locked (allowing change updates score instantly)
    const newAnswers = { ...userAnswers, [questionId]: optionKey };
    setUserAnswers(newAnswers);

    // If this just completed the quiz, trigger confetti if score >= 60%
    if (Object.keys(newAnswers).length === questions.length) {
      let finalCorrect = 0;
      questions.forEach((q) => {
        if (newAnswers[q.id] === q.correctAnswer) finalCorrect++;
      });
      if (finalCorrect / questions.length >= 0.6) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowAllExplanations(false);
    setActiveQuestionIndex(0);
  };

  const currentQ = questions[activeQuestionIndex] || questions[0];

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 text-slate-100">
      {/* Top Banner: Score & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Interactive Quiz: {topicTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Pilih opsi jawaban untuk mendapatkan skor instan, kunci, dan pembahasan.
          </p>
        </div>

        {/* Live Scorecard */}
        <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Skor Saat Ini</div>
            <div className="text-lg font-extrabold text-emerald-400">
              {scorePercentage}%{' '}
              <span className="text-xs font-normal text-slate-400">
                ({correctCount}/{questions.length} Benar)
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <button
            id="reset-quiz-btn"
            onClick={handleResetQuiz}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            title="Ulangi Kuis dari Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>
            Progres: {answeredCount} dari {questions.length} soal dijawab
          </span>
          <span>{Math.round((answeredCount / (questions.length || 1)) * 100)}% selesai</span>
        </div>
        <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${(answeredCount / (questions.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const isSelected = activeQuestionIndex === idx;
          const isAnswered = userAnswers[q.id] !== undefined;
          const isCorrect = userAnswers[q.id] === q.correctAnswer;

          let badgeColor = 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10';
          if (isAnswered) {
            badgeColor = isCorrect
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          }
          if (isSelected) {
            badgeColor += ' ring-2 ring-indigo-500 border-indigo-400 text-white font-bold bg-indigo-600/30';
          }

          return (
            <button
              key={q.id}
              id={`quiz-tab-q${idx + 1}`}
              onClick={() => setActiveQuestionIndex(idx)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${badgeColor}`}
            >
              Soal {idx + 1}
              {isAnswered && (
                <span className="ml-1 text-[10px]">
                  {isCorrect ? '✓' : '✗'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      {currentQ && (
        <div className="border border-white/10 rounded-2xl p-5 bg-black/25 backdrop-blur-md space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                No. {activeQuestionIndex + 1}
              </span>
              <span className="text-xs text-slate-400 font-medium">Pilihan Ganda</span>
            </div>

            {userAnswers[currentQ.id] !== undefined && (
              <div
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border ${
                  userAnswers[currentQ.id] === currentQ.correctAnswer
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {userAnswers[currentQ.id] === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Jawaban Tepat (+100)
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" /> Belum Tepat
                  </>
                )}
              </div>
            )}
          </div>

          {/* Question Text */}
          <p className="text-slate-100 font-medium text-base sm:text-lg leading-relaxed">
            {currentQ.question}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = userAnswers[currentQ.id] === opt.key;
              const hasAnsweredCurrent = userAnswers[currentQ.id] !== undefined;
              const isCorrectAnswer = opt.key === currentQ.correctAnswer;

              let optionStyle =
                'bg-white/5 border-white/10 text-slate-200 hover:border-indigo-500/50 hover:bg-white/10';
              let badgeStyle = 'bg-white/10 text-slate-300 border-white/10';

              if (hasAnsweredCurrent) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100 font-medium';
                  badgeStyle = 'bg-emerald-500 text-white border-emerald-400';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-500/20 border-rose-500/50 text-rose-200';
                  badgeStyle = 'bg-rose-500 text-white border-rose-400';
                } else {
                  optionStyle = 'bg-white/5 border-white/5 text-slate-500 opacity-50';
                  badgeStyle = 'bg-white/5 text-slate-500 border-white/5';
                }
              }

              return (
                <button
                  key={opt.key}
                  id={`q${currentQ.id}-option-${opt.key}`}
                  onClick={() => handleSelectOption(currentQ.id, opt.key)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${optionStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border ${badgeStyle}`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm pt-0.5 leading-snug flex-1">{opt.text}</span>
                  {hasAnsweredCurrent && isCorrectAnswer && (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 shrink-0">
                      <Check className="w-4 h-4" /> Kunci
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Reveals when answered or toggled) */}
          {(userAnswers[currentQ.id] !== undefined || showAllExplanations) && (
            <div className="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 transition-all backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Pembahasan & Kunci Jawaban (Opsi {currentQ.correctAnswer}):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation between questions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button
              disabled={activeQuestionIndex === 0}
              onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
              className="text-xs font-medium px-3.5 py-1.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none"
            >
              ← Soal Sebelumnya
            </button>

            <span className="text-xs text-slate-400 font-medium">
              {activeQuestionIndex + 1} / {questions.length}
            </span>

            {activeQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setActiveQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                }
                className="text-xs font-medium px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors inline-flex items-center gap-1 shadow-md shadow-indigo-600/30"
              >
                Soal Berikutnya →
              </button>
            ) : (
              <button
                onClick={() => setShowAllExplanations((prev) => !prev)}
                className="text-xs font-medium px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors inline-flex items-center gap-1 border border-white/10"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                {showAllExplanations ? 'Tutup Semua Pembahasan' : 'Buka Semua Pembahasan'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completion Trophy Alert */}
      {isAllAnswered && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-emerald-950/60 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30 border border-white/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Kuis Selesai! Skor Akhir: {scorePercentage}% ({correctCount}/{questions.length} Benar)
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {scorePercentage >= 80
                  ? 'Luar biasa! Penguasaan materi Anda sangat baik.'
                  : scorePercentage >= 60
                  ? 'Bagus! Coba review kembali pembahasan dan perdalam dengan Flashcard.'
                  : 'Tetap semangat! Gunakan flashcard active recall di bawah untuk menguatkan retensi.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetQuiz}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all shadow-sm shrink-0"
          >
            Coba Ulangi Kuis
          </button>
        </div>
      )}
    </div>
  );
};
