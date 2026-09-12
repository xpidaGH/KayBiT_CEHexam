import React, { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { TERMINAL_THEMES, TerminalTheme } from '../data/terminalThemes';

interface TerminalThemeSelectorProps {
  currentThemeId: string;
  onSelectTheme: (theme: TerminalTheme) => void;
  className?: string;
}

export const TerminalThemeSelector: React.FC<TerminalThemeSelectorProps> = ({
  currentThemeId,
  onSelectTheme,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTheme = TERMINAL_THEMES.find(t => t.id === currentThemeId) || TERMINAL_THEMES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        id="btn-terminal-theme-picker"
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-mono transition-all shadow-sm group"
        title="Change terminal color scheme (Dracula, Gruvbox, Solarized, etc.)"
        aria-label="Change terminal color scheme"
        aria-expanded={isOpen}
      >
        <Palette className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline text-slate-400 text-[11px]">Theme:</span>
        <span className="font-semibold text-slate-200 text-[11px]">{activeTheme.name}</span>
        {/* Visual 3-color dot indicator */}
        <div className="flex items-center gap-0.5 ml-1">
          {activeTheme.swatch.slice(1, 4).map((color, idx) => (
            <span
              key={idx}
              className="w-2 h-2 rounded-full border border-black/40"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-mono text-xs"
          role="listbox"
        >
          <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
            <span>Terminal Schemes</span>
            <span className="text-teal-400 text-[9px] font-normal">7 Classic Palettes</span>
          </div>

          <div className="space-y-1">
            {TERMINAL_THEMES.map((theme) => {
              const isSelected = theme.id === activeTheme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-teal-500/15 border border-teal-500/40 text-white'
                      : 'hover:bg-slate-800/90 text-slate-300'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Swatch strip */}
                    <div 
                      className="w-5 h-5 rounded-md flex items-center justify-center border border-slate-700 shrink-0"
                      style={{ backgroundColor: theme.bg }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: theme.prompt }}>
                        $
                      </span>
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-200">{theme.name}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                          {theme.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <div className="flex items-center gap-0.5">
                      {theme.swatch.slice(1, 4).map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-black/50"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
