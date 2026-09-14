import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  ShieldCheck, 
  CheckSquare, 
  PieChart, 
  FlaskConical, 
  Code2, 
  ExternalLink,
  Sparkles,
  Command as CommandIcon,
  Layers,
  Wrench,
  Lock,
  Star
} from 'lucide-react';
import { ExamTab, GlobalSearchItem, SearchFilterCategory } from '../types';
import { 
  searchCEHItems, 
  POPULAR_SEARCH_SUGGESTIONS, 
  GLOBAL_SEARCH_INDEX 
} from '../data/searchIndex';
import { isBookmarked, toggleBookmark } from '../utils/bookmarkManager';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { playFlashcardSuccessSound } from '../utils/audioCues';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ExamTab) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilterCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkUpdateCounter, setBookmarkUpdateCounter] = useState<number>(0);

  const handleToggleStarResult = (item: GlobalSearchItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyBookmarked = isBookmarked(item.id);
    toggleBookmark({
      id: item.id,
      type: item.copyable ? 'command' : 'note',
      title: item.title,
      category: item.category,
      sourceTab: item.targetTab,
      description: item.description,
      content: item.copyable || item.contentSnippet || '',
      tags: [item.badge, item.targetTab],
      createdAt: new Date().toISOString(),
    });

    if (!alreadyBookmarked) {
      playFlashcardSuccessSound();
      triggerAutoSaveToast(`Starred "${item.title}" to Bookmarks!`);
    } else {
      triggerAutoSaveToast(`Removed "${item.title}" from Bookmarks.`);
    }

    setBookmarkUpdateCounter((prev) => prev + 1);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Compute search results
  const results = useMemo(() => {
    return searchCEHItems(query, activeFilter, 60);
  }, [query, activeFilter]);

  // Count items per category for filter badges
  const categoryCounts = useMemo(() => {
    const counts: Record<SearchFilterCategory, number> = {
      all: GLOBAL_SEARCH_INDEX.length,
      commands: 0,
      notes: 0,
      methodology: 0,
      labs: 0,
      tools: 0,
    };
    GLOBAL_SEARCH_INDEX.forEach((item) => {
      if (counts[item.filterCategory] !== undefined) {
        counts[item.filterCategory]++;
      }
    });
    return counts;
  }, []);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        if (results[selectedIndex]) {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const activeElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results.length]);

  const handleSelectResult = (item: GlobalSearchItem) => {
    onNavigateToTab(item.targetTab);
    onClose();
  };

  const handleCopySnippet = (item: GlobalSearchItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = item.copyable || item.contentSnippet || item.title;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getTargetTabInfo = (tab: ExamTab) => {
    switch (tab) {
      case 'written':
        return { label: 'Written Exam', icon: <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> };
      case 'practical':
        return { label: 'Practical Exam', icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> };
      case 'darkweb':
        return { label: 'Dark Web Blueprint', icon: <Lock className="w-3.5 h-3.5 text-purple-400" /> };
      case 'methodology':
        return { label: 'Methodology & Scripts', icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> };
      case 'tools':
        return { label: 'Tools Checklist', icon: <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> };
      case 'progress':
        return { label: 'Domain Tracker', icon: <PieChart className="w-3.5 h-3.5 text-teal-400" /> };
      case 'tests':
        return { label: 'Practice Tests', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> };
      default:
        return { label: tab, icon: <Layers className="w-3.5 h-3.5 text-slate-400" /> };
    }
  };

  const getBadgeStyle = (category: GlobalSearchItem['category']) => {
    switch (category) {
      case 'command':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'script':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'scenario':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'lab':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'tool':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'note':
      case 'topic':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="global-search-modal"
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, tools, notes, scripts (e.g. nmap, sqlmap, hydra, python)..."
            className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-500 text-sm sm:text-base focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Filter Category Tabs */}
        <div className="px-4 py-2 bg-slate-950/30 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => { setActiveFilter('all'); setSelectedIndex(0); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <span>All Items</span>
            <span className="text-[10px] opacity-75">({categoryCounts.all})</span>
          </button>

          <button
            onClick={() => { setActiveFilter('commands'); setSelectedIndex(0); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'commands'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Commands</span>
            <span className="text-[10px] opacity-75">({categoryCounts.commands})</span>
          </button>

          <button
            onClick={() => { setActiveFilter('notes'); setSelectedIndex(0); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'notes'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes & Repos</span>
            <span className="text-[10px] opacity-75">({categoryCounts.notes})</span>
          </button>

          <button
            onClick={() => { setActiveFilter('methodology'); setSelectedIndex(0); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'methodology'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Methodology & Scripts</span>
            <span className="text-[10px] opacity-75">({categoryCounts.methodology})</span>
          </button>

          <button
            onClick={() => { setActiveFilter('labs'); setSelectedIndex(0); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'labs'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Labs</span>
            <span className="text-[10px] opacity-75">({categoryCounts.labs})</span>
          </button>

          <button
            onClick={() => { setActiveFilter('tools'); setSelectedIndex(0); }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'tools'
                ? 'bg-emerald-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Tools</span>
            <span className="text-[10px] opacity-75">({categoryCounts.tools})</span>
          </button>
        </div>

        {/* Suggestion Chips (when query is empty) */}
        {!query && (
          <div className="p-4 bg-slate-900/60 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Popular CEH Command & Topic Lookups:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCH_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 text-xs font-mono transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[50vh] divide-y divide-slate-800/40"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">
                No matching topics, commands, or notes found
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching for a tool name (e.g. <span className="text-emerald-400 font-mono">nmap</span>, <span className="text-emerald-400 font-mono">sqlmap</span>, <span className="text-emerald-400 font-mono">tshark</span>), 
                an attack technique (e.g. <span className="text-emerald-400 font-mono">SUID</span>, <span className="text-emerald-400 font-mono">XSS</span>, <span className="text-emerald-400 font-mono">MITM</span>), 
                or a programming language (<span className="text-emerald-400 font-mono">Python</span>, <span className="text-emerald-400 font-mono">Go</span>, <span className="text-emerald-400 font-mono">Bash</span>).
              </p>
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              const tabInfo = getTargetTabInfo(item.targetTab);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md' 
                      : 'bg-slate-900/40 hover:bg-slate-800/50 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getBadgeStyle(item.category)}`}>
                        {item.badge}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                        {tabInfo.icon}
                        <span>{tabInfo.label}</span>
                      </div>
                      {item.toolOrLanguage && (
                        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-950/60">
                          {item.toolOrLanguage}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Quick Bookmark / Star Search Result */}
                      <button
                        id={`star-search-${item.id}`}
                        onClick={(e) => handleToggleStarResult(item, e)}
                        className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 border ${
                          isBookmarked(item.id)
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                        title={isBookmarked(item.id) ? "Remove from bookmarks" : "Star search result to study vault"}
                      >
                        <Star className={`w-3.5 h-3.5 ${isBookmarked(item.id) ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                        <span className="text-[10px] hidden sm:inline">{isBookmarked(item.id) ? 'Starred' : 'Star'}</span>
                      </button>

                      {item.copyable && (
                        <button
                          id={`copy-search-${item.id}`}
                          onClick={(e) => handleCopySnippet(item, e)}
                          className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 border ${
                            copiedId === item.id
                              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          }`}
                          title="Copy command to clipboard"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">Copy</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectResult(item);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all flex items-center gap-1"
                        title={`Jump to ${tabInfo.label}`}
                      >
                        <span className="text-[10px] hidden sm:inline">Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Code / Command Preview box */}
                  {item.contentSnippet && (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-emerald-300/90 overflow-x-auto select-all whitespace-pre-wrap">
                      {item.contentSnippet}
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 5).map((t, tidx) => (
                        <span key={tidx} className="text-[9px] font-mono text-slate-500 bg-slate-950/40 px-1.5 py-0.5 rounded">
                          #{t.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">↵</kbd>
              <span>Open Module</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">ESC</kbd>
              <span>Close</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Showing <span className="font-bold text-emerald-400">{results.length}</span> of {categoryCounts[activeFilter]} indexed items
          </div>
        </div>
      </div>
    </div>
  );
};
