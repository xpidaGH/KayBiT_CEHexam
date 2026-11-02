import React, { useEffect, useRef } from 'react';
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  BookOpen, 
  Terminal, 
  Heart, 
  Moon, 
  Zap 
} from 'lucide-react';
import { ThemeVariationId } from '../types';
import { THEME_VARIATIONS, applyTheme, getSavedTheme } from '../utils/themeManager';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { playFlashcardSuccessSound } from '../utils/audioCues';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId: ThemeVariationId;
  onSelectTheme: (themeId: ThemeVariationId) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  onSelectTheme,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChooseTheme = (themeId: ThemeVariationId, themeName: string) => {
    applyTheme(themeId);
    onSelectTheme(themeId);
    playFlashcardSuccessSound();
    triggerAutoSaveToast(`Theme changed to "${themeName}"!`);
    onClose();
  };

  const getThemeIcon = (id: ThemeVariationId) => {
    switch (id) {
      case 'editorial':
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case 'technical':
        return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'warm':
        return <Heart className="w-5 h-5 text-orange-400" />;
      case 'dark':
        return <Moon className="w-5 h-5 text-teal-400" />;
      case 'vibrant':
        return <Zap className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 id="theme-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>Theme Settings</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  5 UI Variations
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Select your preferred visual aesthetic. Changes apply instantly and persist across reload.
              </p>
            </div>
          </div>

          <button
            id="btn-close-theme-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close theme settings (Esc)"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid List */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-slate-800/40">
          {THEME_VARIATIONS.map((theme) => {
            const isSelected = activeThemeId === theme.id;
            return (
              <div
                key={theme.id}
                id={`theme-option-${theme.id}`}
                onClick={() => handleChooseTheme(theme.id, theme.name)}
                className={`pt-3.5 first:pt-0 cursor-pointer rounded-xl p-3.5 border transition-all duration-200 group ${
                  isSelected
                    ? 'bg-slate-800/80 border-emerald-500/80 shadow-lg ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/40 hover:bg-slate-800/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 group-hover:scale-105 transition-transform">
                      {getThemeIcon(theme.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-slate-100 group-hover:text-white transition-colors">
                          {theme.name}
                        </h3>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {theme.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {theme.fontCategory}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {theme.tagline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Swatch Previews */}
                  <div className="shrink-0 flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div 
                      className="w-4 h-4 rounded-full border border-black/20 shadow-inner" 
                      style={{ backgroundColor: theme.preview.bg }} 
                      title={`Background: ${theme.preview.bg}`}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-black/20 shadow-inner" 
                      style={{ backgroundColor: theme.preview.card }} 
                      title={`Card: ${theme.preview.card}`}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-black/20 shadow-inner" 
                      style={{ backgroundColor: theme.preview.accent }} 
                      title={`Accent: ${theme.preview.accent}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme choice is instantly saved to localStorage</span>
          </div>
          <button
            id="btn-close-theme-modal-footer"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
