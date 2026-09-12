import React, { useState, useMemo, useEffect } from 'react';
import { 
  Keyboard, 
  X, 
  Search, 
  Navigation, 
  Layers, 
  Terminal, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Command,
  HelpCircle,
  Zap,
  CornerDownLeft,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { ExamTab } from '../types';
import { NAV_ITEMS_CONFIG } from '../data/appConfig';

export interface ShortcutItem {
  id: string;
  category: 'global' | 'navigation' | 'flashcards' | 'practical' | 'search';
  title: string;
  description: string;
  keys: string[];
  context: string;
  targetTab?: ExamTab;
}

const ALL_SHORTCUTS: ShortcutItem[] = [
  // Global & System
  {
    id: 'toggle-shortcuts',
    category: 'global',
    title: 'Keyboard Shortcuts Cheat Sheet',
    description: 'Toggle this keyboard shortcuts and efficiency dialog anywhere',
    keys: ['Shift', '?'],
    context: 'Anywhere in App',
  },
  {
    id: 'quick-search',
    category: 'global',
    title: 'Global Quick Search',
    description: 'Instant search across CEH topics, commands, labs, tools, and flashcards',
    keys: ['⌘', 'K'],
    context: 'Anywhere in App',
  },
  {
    id: 'close-modals',
    category: 'global',
    title: 'Dismiss / Close Active View',
    description: 'Close open dialogs, search modal, user guide, or exit Zen Mode',
    keys: ['Esc'],
    context: 'Active Modals / Zen Mode',
  },

  // Direct Tab Navigation (1-9)
  {
    id: 'nav-written',
    category: 'navigation',
    title: '1: Written Exam Blueprint',
    description: 'Jump to 9-domain written blueprint, labs, notes, and scratchpad',
    keys: ['1'],
    context: 'Main View Switcher',
    targetTab: 'written',
  },
  {
    id: 'nav-practical',
    category: 'navigation',
    title: '2: Practical Hands-On Exam',
    description: 'Jump to The Big Three cheat sheets and 4 practical exam pillars',
    keys: ['2'],
    context: 'Main View Switcher',
    targetTab: 'practical',
  },
  {
    id: 'nav-darkweb',
    category: 'navigation',
    title: '3: Dark Web Self-Study Blueprint',
    description: 'Jump to Tor protocol mechanics, threat intel scripts, and handshake logs',
    keys: ['3'],
    context: 'Main View Switcher',
    targetTab: 'darkweb',
  },
  {
    id: 'nav-progress',
    category: 'navigation',
    title: '4: Domain Progress & Mastery Rings',
    description: 'Jump to circular domain readiness metrics, lab completions, and statistics',
    keys: ['4'],
    context: 'Main View Switcher',
    targetTab: 'progress',
  },
  {
    id: 'nav-tools',
    category: 'navigation',
    title: '5: Security Tools Checklist',
    description: 'Jump to the curated inventory of CLI and GUI hacking utilities',
    keys: ['5'],
    context: 'Main View Switcher',
    targetTab: 'tools',
  },
  {
    id: 'nav-methodology',
    category: 'navigation',
    title: '6: Programmer Lab & Living Commands',
    description: 'Jump to multi-language syntax analyzer and living command sheet',
    keys: ['6'],
    context: 'Main View Switcher',
    targetTab: 'methodology',
  },
  {
    id: 'nav-tests',
    category: 'navigation',
    title: '7: 6-Hour Exam Simulator',
    description: 'Jump to 20-challenge timed practical lab and domain practice quizzes',
    keys: ['7'],
    context: 'Main View Switcher',
    targetTab: 'tests',
  },
  {
    id: 'nav-flashcards',
    category: 'navigation',
    title: '8: Study Flashcards & Manager',
    description: 'Jump to interactive spaced-repetition cards and deck creator',
    keys: ['8'],
    context: 'Main View Switcher',
    targetTab: 'flashcards',
  },
  {
    id: 'nav-installation',
    category: 'navigation',
    title: '9: Native Platform Packaging',
    description: 'Jump to standalone Android, iOS, Windows, macOS, and PWA setup',
    keys: ['9'],
    context: 'Main View Switcher',
    targetTab: 'installation',
  },

  // Flashcards Mode
  {
    id: 'fc-flip',
    category: 'flashcards',
    title: 'Flip Flashcard Front / Back',
    description: 'Toggle between question and answer with blueprint technical notes',
    keys: ['Space'],
    context: 'Flashcard Deck View',
  },
  {
    id: 'fc-next',
    category: 'flashcards',
    title: 'Next Flashcard',
    description: 'Advance to next card in the active category or custom deck',
    keys: ['→'],
    context: 'Flashcard Deck View',
  },
  {
    id: 'fc-prev',
    category: 'flashcards',
    title: 'Previous Flashcard',
    description: 'Return to previous card in the active category or custom deck',
    keys: ['←'],
    context: 'Flashcard Deck View',
  },
  {
    id: 'fc-mastered',
    category: 'flashcards',
    title: 'Toggle Mastered / Needs Review',
    description: 'Mark active card as mastered or flag it for spaced-repetition review',
    keys: ['M'],
    context: 'Flashcard Deck View',
  },
  {
    id: 'fc-shuffle',
    category: 'flashcards',
    title: 'Shuffle Cards Randomly',
    description: 'Randomize card order to prevent rote positional memorization',
    keys: ['S'],
    context: 'Flashcard Deck View',
  },
  {
    id: 'fc-hint',
    category: 'flashcards',
    title: 'Toggle Memory Hint',
    description: 'Reveal or hide high-yield blueprint hint before flipping',
    keys: ['H'],
    context: 'Flashcard Deck View',
  },
  {
    id: 'fc-audio',
    category: 'flashcards',
    title: 'Listen to Card Audio (TTS)',
    description: 'Read card front or back aloud using native system speech synthesis',
    keys: ['A'],
    context: 'Flashcard Deck View',
  },

  // Practical & Zen Mode
  {
    id: 'practical-zen',
    category: 'practical',
    title: 'Toggle Terminal Zen Mode',
    description: 'Switch to distraction-free, full-screen interactive simulated terminal',
    keys: ['Z'],
    context: 'Practical Exam Tab',
  },
  {
    id: 'practical-exit-zen',
    category: 'practical',
    title: 'Exit Zen Mode',
    description: 'Return to standard multi-pillar practical dashboard navigation',
    keys: ['Esc'],
    context: 'Inside Zen Mode',
  },
  {
    id: 'zen-history',
    category: 'practical',
    title: 'Command History Previous / Next',
    description: 'Recall previously entered commands in the simulated lab shell',
    keys: ['↑', '↓'],
    context: 'Zen Mode Terminal',
  },
  {
    id: 'zen-exec',
    category: 'practical',
    title: 'Execute Command / Submit Flag',
    description: 'Run entered diagnostic or attack command against challenge target',
    keys: ['Enter'],
    context: 'Zen Mode Terminal',
  },

  // Quick Search Dialog
  {
    id: 'search-navigate',
    category: 'search',
    title: 'Navigate Search Results',
    description: 'Cycle selection through indexed topics, tools, commands, and notes',
    keys: ['↑', '↓'],
    context: 'Inside Search Modal',
  },
  {
    id: 'search-select',
    category: 'search',
    title: 'Open Selected Result',
    description: 'Jump directly to the relevant tab and component for selected item',
    keys: ['Enter'],
    context: 'Inside Search Modal',
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Shortcuts', count: ALL_SHORTCUTS.length },
  { id: 'global', label: 'Global & System', count: ALL_SHORTCUTS.filter(s => s.category === 'global').length },
  { id: 'navigation', label: 'Direct Tab Switch (1-9)', count: ALL_SHORTCUTS.filter(s => s.category === 'navigation').length },
  { id: 'flashcards', label: 'Study Flashcards', count: ALL_SHORTCUTS.filter(s => s.category === 'flashcards').length },
  { id: 'practical', label: 'Practical & Zen Terminal', count: ALL_SHORTCUTS.filter(s => s.category === 'practical').length },
  { id: 'search', label: 'Quick Search', count: ALL_SHORTCUTS.filter(s => s.category === 'search').length },
] as const;

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: ExamTab) => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handle ESC key inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Filter shortcuts
  const filteredShortcuts = useMemo(() => {
    return ALL_SHORTCUTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchContext = item.context.toLowerCase().includes(q);
        const matchKeys = item.keys.some(k => k.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchContext && !matchKeys) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div 
      id="keyboard-shortcuts-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="keyboard-shortcuts-modal-container"
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Keyboard Shortcuts & Navigation
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/30">
                  Shift + /
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Speed up study workflows, flashcard drilling, and exam lab navigation
              </p>
            </div>
          </div>

          <button
            id="btn-close-shortcuts-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
            title="Close shortcuts (Esc)"
          >
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
              Esc
            </kbd>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-shortcuts"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shortcuts (e.g., 'flip', 'search', 'zen', 'flashcard', '1')..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-shortcut-cat-${tab.id}`}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shortcuts List Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-800/40">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Keyboard className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No shortcuts matched your search.</p>
              <p className="text-xs text-slate-500">Try searching for generic terms like "tab", "card", or "zen".</p>
            </div>
          ) : (
            filteredShortcuts.map((item) => {
              const isNavigableTab = item.targetTab && onNavigateToTab;

              return (
                <div
                  key={item.id}
                  id={`shortcut-row-${item.id}`}
                  className={`pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl transition-all ${
                    isNavigableTab 
                      ? 'hover:bg-slate-800/60 cursor-pointer group' 
                      : 'hover:bg-slate-800/30'
                  }`}
                  onClick={() => {
                    if (isNavigableTab && item.targetTab) {
                      onNavigateToTab(item.targetTab);
                      onClose();
                    }
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 border border-slate-800 text-slate-400">
                        {item.context}
                      </span>
                      {isNavigableTab && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-3 h-3" />
                          <span>Click to jump</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>

                  {/* Key Combo Display */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                    {item.keys.map((key, kIdx) => (
                      <React.Fragment key={kIdx}>
                        <kbd className="min-w-[28px] h-7 px-2.5 rounded-lg bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-700/90 text-slate-200 font-mono text-xs font-bold flex items-center justify-center shadow-md shadow-black/40 tracking-wider">
                          {key === 'Space' ? (
                            <span className="flex items-center gap-1">
                              <span>Space</span>
                            </span>
                          ) : key === 'Enter' ? (
                            <span className="flex items-center gap-1">
                              <CornerDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Enter</span>
                            </span>
                          ) : key === '→' ? (
                            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                          ) : key === '←' ? (
                            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                          ) : key === '↑' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                          ) : key === '↓' ? (
                            <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                          ) : key === '⌘' ? (
                            <span className="text-emerald-400">⌘/Ctrl</span>
                          ) : (
                            key
                          )}
                        </kbd>
                        {kIdx < item.keys.length - 1 && (
                          <span className="text-slate-500 text-xs font-bold font-mono">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Tips & Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px]">
              <strong>Pro-tip:</strong> Number keys <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">1</kbd> through <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">9</kbd> jump to any view when not typing in form inputs.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Press <kbd className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">Shift + /</kbd> anytime</span>
            <span>•</span>
            <span><kbd className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
