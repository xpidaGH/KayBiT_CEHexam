import React from 'react';
import { Search, Keyboard, BookOpen, Sparkles, Shield } from 'lucide-react';
import { ExamTab } from '../types';
import { 
  APP_CONFIG, 
  FOOTER_QUICK_LINKS, 
  SUPPORTED_CURRICULUM_LANGUAGES 
} from '../data/appConfig';
import { AmbientNoisePlayer } from './AmbientNoisePlayer';
import { PomodoroTimer } from './PomodoroTimer';

interface FooterProps {
  onOpenSearch: () => void;
  onOpenShortcuts: () => void;
  onOpenUserGuide: () => void;
  onNavigateTab: (tab: ExamTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSearch,
  onOpenShortcuts,
  onOpenUserGuide,
  onNavigateTab
}) => {
  return (
    <footer 
      id="app-global-footer"
      className="mt-auto border-t border-slate-900 bg-slate-950/95 py-8 text-xs text-slate-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Tier: App Identity & Ambient Noise Player */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-900">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-slate-200 text-sm flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                {APP_CONFIG.appName}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                {APP_CONFIG.blueprintVersion} Blueprint
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 font-medium text-xs">
                {APP_CONFIG.tagline}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Synthesizing rigorous offensive security methodologies, interactive lab automation, and AI-powered mnemonic recall across 20 programming languages.
            </p>
          </div>

          {/* Deep Work Controls: Pomodoro Timer & Ambient Audio Player */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Deep Work Audio & Session Management</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <PomodoroTimer />
              <AmbientNoisePlayer />
            </div>
          </div>
        </div>

        {/* Middle Tier: Interactive Navigation & Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quick Tab Jump Links */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              Quick Views:
            </span>
            {FOOTER_QUICK_LINKS.map((link) => (
              <button
                key={link.tab}
                id={`footer-nav-${link.tab}`}
                type="button"
                onClick={() => onNavigateTab(link.tab)}
                className="text-slate-400 hover:text-emerald-400 transition-colors underline decoration-slate-700 hover:decoration-emerald-400 underline-offset-2"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Modal Helpers */}
          <div className="flex items-center gap-4 text-xs flex-wrap">
            <button
              id="footer-btn-search"
              type="button"
              onClick={onOpenSearch}
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lookup (⌘K)</span>
            </button>
            <button
              id="footer-btn-shortcuts"
              type="button"
              onClick={onOpenShortcuts}
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shortcuts (Shift+/)</span>
            </button>
            <button
              id="footer-btn-guide"
              type="button"
              onClick={onOpenUserGuide}
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>User Guide</span>
            </button>
          </div>
        </div>

        {/* Bottom Tier: 20 Curriculum Languages Grid */}
        <div className="pt-4 border-t border-slate-900/80">
          <p className="text-[11px] text-slate-400 font-medium mb-2">
            Engineered for intermediate software developers in {SUPPORTED_CURRICULUM_LANGUAGES.length} core programming languages:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_CURRICULUM_LANGUAGES.map((lang) => (
              <span
                key={lang}
                className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
