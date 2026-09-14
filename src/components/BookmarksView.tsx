/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Download, 
  Terminal, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Code2, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  Tag
} from 'lucide-react';
import { StudyBookmark, ExamTab } from '../types';
import { 
  getBookmarks, 
  removeBookmark, 
  clearAllBookmarks, 
  restoreStarterBookmarks, 
  exportBookmarksAsMarkdown, 
  exportBookmarksAsJson 
} from '../utils/bookmarkManager';
import { LinuxCliSimulator } from './LinuxCliSimulator';

interface BookmarksViewProps {
  onNavigateTab?: (tab: ExamTab, subTab?: string, targetId?: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ onNavigateTab }) => {
  const [bookmarks, setBookmarks] = useState<StudyBookmark[]>(() => getBookmarks());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCommandsCopied, setAllCommandsCopied] = useState<boolean>(false);
  const [showCliForCommand, setShowCliForCommand] = useState<string | null>(null);

  // Sync state whenever bookmarks are modified in other views or components
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number; bookmarks: StudyBookmark[] }>;
      if (customEvent.detail?.bookmarks) {
        setBookmarks(customEvent.detail.bookmarks);
      } else {
        setBookmarks(getBookmarks());
      }
    };

    window.addEventListener('bookmarks-updated', handleUpdate);
    return () => window.removeEventListener('bookmarks-updated', handleUpdate);
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllCommands = () => {
    const commandStrings = bookmarks
      .filter((b) => b.content)
      .map((b) => `# [${b.title}]\n${b.content}`)
      .join('\n\n');
    
    if (!commandStrings) return;
    navigator.clipboard.writeText(commandStrings);
    setAllCommandsCopied(true);
    setTimeout(() => setAllCommandsCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = exportBookmarksAsMarkdown();
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kaybit-ceh-bookmarks-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonContent = exportBookmarksAsJson();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kaybit-ceh-bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    removeBookmark(id);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved study bookmarks? This cannot be undone.')) {
      clearAllBookmarks();
    }
  };

  // Filtered bookmarks list
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.type !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) || false;
        const matchesContent = item.content?.toLowerCase().includes(query) || false;
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(query)) || false;
        return matchesTitle || matchesCategory || matchesDesc || matchesContent || matchesTags;
      }

      return true;
    });
  }, [bookmarks, selectedCategory, searchQuery]);

  // Counts by type
  const counts = useMemo(() => {
    return {
      all: bookmarks.length,
      note: bookmarks.filter((b) => b.type === 'note').length,
      cheatsheet: bookmarks.filter((b) => b.type === 'cheatsheet').length,
      command: bookmarks.filter((b) => b.type === 'command').length,
      pillar: bookmarks.filter((b) => b.type === 'pillar').length,
      lab: bookmarks.filter((b) => b.type === 'lab').length,
    };
  }, [bookmarks]);

  const getTypeBadge = (type: StudyBookmark['type']) => {
    switch (type) {
      case 'note':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <FileText className="w-3 h-3" />
            Note
          </span>
        );
      case 'cheatsheet':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Layers className="w-3 h-3" />
            Cheat Sheet
          </span>
        );
      case 'command':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Terminal className="w-3 h-3" />
            Command
          </span>
        );
      case 'pillar':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-3 h-3" />
            Exam Pillar
          </span>
        );
      case 'lab':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Code2 className="w-3 h-3" />
            Lab Env
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Personalized Revision Vault
              </span>
              <span className="text-xs font-mono text-slate-400">
                {bookmarks.length} {bookmarks.length === 1 ? 'Item' : 'Items'} Saved
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              My Saved CEH Bookmarks & Quick Access
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Curate your most crucial exam command syntaxes, markdown repository notes, lab setups, and practical cheat sheets into a single high-speed revision stream.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-copy-all-commands"
              type="button"
              onClick={handleCopyAllCommands}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              title="Concatenate and copy all bookmarked command strings to clipboard"
            >
              {allCommandsCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{allCommandsCopied ? 'All Copied!' : 'Copy All Commands'}</span>
            </button>

            <button
              id="btn-export-md"
              type="button"
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              title="Download bookmarks as formatted Markdown file"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export (.md)</span>
            </button>

            <button
              id="btn-export-json"
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              title="Export bookmarks as JSON data"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export (.json)</span>
            </button>

            {bookmarks.length > 0 && (
              <button
                id="btn-clear-bookmarks"
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                title="Clear all saved bookmarks"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            {bookmarks.length === 0 && (
              <button
                id="btn-restore-starter-bookmarks"
                type="button"
                onClick={restoreStarterBookmarks}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load Recommended Bookmarks</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-bookmark-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved commands, notes, tools, or tags..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'command', label: 'Commands', count: counts.command },
              { id: 'cheatsheet', label: 'Cheat Sheets', count: counts.cheatsheet },
              { id: 'note', label: 'Notes', count: counts.note },
              { id: 'pillar', label: 'Pillars', count: counts.pillar },
              { id: 'lab', label: 'Labs', count: counts.lab },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`filter-bookmark-${tab.id}`}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === tab.id ? 'bg-slate-950 text-emerald-300' : 'bg-slate-900 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookmarks.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                id={`bookmark-card-${item.id}`}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
              >
                <div>
                  {/* Card Header: Type, Category & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(item.type)}
                      <span className="text-xs font-mono text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.content && (
                        <button
                          id={`btn-copy-bookmark-${item.id}`}
                          onClick={() => handleCopy(item.id, item.content || '')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          title="Copy command or snippet"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        id={`btn-remove-bookmark-${item.id}`}
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Remove from bookmarks"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Content (Code / Command / Notes Snapshot) */}
                  {item.content && (
                    <div className="mt-3 relative">
                      <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap selection:bg-emerald-500 selection:text-slate-950">
                        {item.content}
                      </pre>
                    </div>
                  )}

                  {/* Notes / Flag details */}
                  {item.notes && (
                    <p className="text-[11px] font-mono text-slate-400 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-teal-400 font-bold">Exam Note:</span> {item.notes}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          <Tag className="w-2.5 h-2.5 text-emerald-400" />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Navigation & CLI simulation launcher */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.type === 'command' && item.content && (
                      <button
                        id={`btn-cli-test-${item.id}`}
                        type="button"
                        onClick={() => setShowCliForCommand(showCliForCommand === item.id ? null : item.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium transition-colors"
                        title="Simulate this command directly in the Kali CLI terminal"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>{showCliForCommand === item.id ? 'Close Terminal' : 'Test in CLI'}</span>
                      </button>
                    )}

                    {onNavigateTab && (
                      <button
                        id={`btn-jump-source-${item.id}`}
                        type="button"
                        onClick={() => onNavigateTab(item.sourceTab, item.sourceSubTab, item.targetId)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors"
                        title={`Navigate directly to ${item.sourceTab}`}
                      >
                        <span>Jump to Source</span>
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline CLI Simulator Drawer for Testing Command */}
                {showCliForCommand === item.id && item.content && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <LinuxCliSimulator
                      initialCommand={item.content.split('\n')[0].replace(/^#.*/, '').trim()}
                      className="border border-slate-800 shadow-xl"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Bookmarks in This View</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {searchQuery
              ? `No saved items match your search for "${searchQuery}". Try a different keyword or reset filters.`
              : 'You haven\'t saved any items yet. Bookmark essential commands from the 4 Practical Pillars or notes from Written Exam blueprint to quickly access them here.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={restoreStarterBookmarks}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Curated Exam Bookmarks</span>
            </button>
            {onNavigateTab && (
              <>
                <button
                  onClick={() => onNavigateTab('practical', 'pillars')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Browse Cheat Sheets</span>
                </button>
                <button
                  onClick={() => onNavigateTab('written', 'notes')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Browse Written Notes</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
