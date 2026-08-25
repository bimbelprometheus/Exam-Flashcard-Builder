import React from 'react';
import { Sparkles, Zap, Code2, BookOpenCheck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onOpenEdgeModal: () => void;
  onReset: () => void;
  hasData: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEdgeModal, onReset, hasData }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-xl bg-slate-950/40 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-white/20">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-white tracking-tight text-lg sm:text-xl">
                AstroQuiz AI
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini 3.7 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Astro SSR • Cloudflare Workers Edge Runtime
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            id="edge-code-btn"
            onClick={onOpenEdgeModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 transition-all border border-white/10 shadow-sm backdrop-blur-md"
            title="Lihat Kode Astro SSR & Cloudflare Workers Edge"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Astro Edge Code</span>
            <span className="sm:hidden">Edge</span>
          </button>

          {hasData && (
            <button
              id="reset-material-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Materi Baru</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
