import React, { useState } from 'react';
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  LayoutGrid,
  CreditCard,
  Volume2,
} from 'lucide-react';
import { Flashcard } from '../types';

interface ActiveRecallFlashcardIslandProps {
  flashcards: Flashcard[];
  topicTitle: string;
}

export const ActiveRecallFlashcardIsland: React.FC<ActiveRecallFlashcardIslandProps> = ({
  flashcards,
  topicTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Sync if props change
  React.useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  }, [flashcards]);

  const currentCard = cards[currentIndex] || cards[0];
  const isMastered = currentCard ? masteredIds.has(currentCard.id) : false;

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleToggleMastery = (cardId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const masteredCount = masteredIds.size;
  const masteryPercentage = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 text-slate-100">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Active Recall Flashcards: {topicTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Latih daya ingat aktif dengan memprediksi jawaban sebelum membalik kartu.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'carousel'
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> 3D Flip
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid Semua
            </button>
          </div>

          <button
            onClick={handleShuffle}
            className="p-2.5 rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-md"
            title="Acak Urutan Kartu"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Mastery Bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Penguasaan Konsep: {masteredCount} dari {cards.length} kartu dikuasai
          </span>
          <span className="font-semibold text-indigo-400">{masteryPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
      </div>

      {/* VIEW MODE 1: 3D FLIP CAROUSEL */}
      {viewMode === 'carousel' && currentCard && (
        <div className="space-y-4">
          {/* Top Tag & Card Counter */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                Kartu {currentIndex + 1} dari {cards.length}
              </span>
              {currentCard.tag && (
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 font-medium border border-white/10">
                  {currentCard.tag}
                </span>
              )}
            </div>

            <button
              onClick={(e) => handleToggleMastery(currentCard.id, e)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isMastered
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-emerald-500/10 hover:text-emerald-300'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isMastered ? 'Sudah Dikuasai' : 'Tandai Sudah Paham'}
            </button>
          </div>

          {/* The 3D Flip Card Container */}
          <div
            className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none"
            onClick={handleFlip}
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD (Question / Recall Prompt) */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-indigo-500/40 via-purple-600/30 to-slate-900 rounded-3xl p-[1px] shadow-2xl">
                <div className="w-full h-full bg-slate-900/90 backdrop-blur-xl rounded-[1.4rem] p-6 sm:p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  <div className="flex items-center justify-between text-xs text-indigo-300 font-bold z-10">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      FRONT (PERTANYAAN ACTIVE RECALL)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleSpeak(currentCard.front, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-white/10"
                        title="Dengarkan Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center my-auto px-4 z-10">
                    <p className="text-base sm:text-xl font-bold text-white leading-relaxed tracking-wide font-sans">
                      {currentCard.front}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3 z-10">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                      <RotateCw className="w-3.5 h-3.5" /> Klik kartu untuk flip & lihat jawaban
                    </span>
                    <span className="hidden sm:inline font-mono text-[10px] uppercase text-slate-500">Tap to flip</span>
                  </div>
                </div>
              </div>

              {/* BACK OF CARD (Answer / Key Definition) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-500/40 via-teal-600/30 to-slate-900 rounded-3xl p-[1px] shadow-2xl">
                <div className="w-full h-full bg-slate-900/90 backdrop-blur-xl rounded-[1.4rem] p-6 sm:p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, #34d399 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  <div className="flex items-center justify-between text-xs text-emerald-300 font-bold z-10">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      BACK (JAWABAN / INTI KONSEP)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleSpeak(currentCard.back, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-white/10"
                        title="Dengarkan Audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center my-auto px-4 z-10">
                    <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                      {currentCard.back}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-white/10 pt-3 z-10">
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" /> Klik untuk kembali ke pertanyaan
                    </span>
                    <button
                      onClick={(e) => handleToggleMastery(currentCard.id, e)}
                      className={`text-xs px-3 py-1 rounded-lg font-bold border ${
                        isMastered
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isMastered ? '✓ Dikuasai' : '+ Tandai Paham'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-slate-300 hover:bg-white/10 transition-colors backdrop-blur-md"
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {cards.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === idx
                      ? 'w-6 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                      : masteredIds.has(c.id)
                      ? 'bg-emerald-400'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Ke Kartu ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
            >
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: GRID ALL CARDS */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, idx) => {
            const isCardMastered = masteredIds.has(card.id);
            return (
              <div
                key={card.id}
                className={`rounded-2xl border p-4 space-y-3 transition-all backdrop-blur-md ${
                  isCardMastered
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-white/10 bg-black/25 hover:bg-black/35'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      #{idx + 1}
                    </span>
                    {card.tag && (
                      <span className="text-slate-400 font-medium">{card.tag}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleMastery(card.id)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                      isCardMastered
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'text-slate-400 hover:text-emerald-300 border-white/10'
                    }`}
                  >
                    {isCardMastered ? '✓ Dikuasai' : 'Tandai Paham'}
                  </button>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                    PERTANYAAN (FRONT):
                  </div>
                  <p className="text-sm font-semibold text-white">{card.front}</p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    JAWABAN INTI (BACK):
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{card.back}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
