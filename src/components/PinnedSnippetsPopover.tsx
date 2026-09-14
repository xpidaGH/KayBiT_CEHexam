import React, { useState, useEffect, useRef } from 'react';
import { Pin, Copy, Check, Trash2, Plus, ExternalLink, X, Terminal, Bookmark, Sparkles } from 'lucide-react';
import { ExamTab } from '../types';
import { STORAGE_KEYS } from '../data/appConfig';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { playFlashcardSuccessSound } from '../utils/audioCues';

export interface PinnedSnippet {
  id: string;
  title: string;
  command: string;
  category: 'command' | 'quicklink' | 'note';
  targetTab?: ExamTab;
  tag?: string;
  createdAt: number;
}

const DEFAULT_PINNED_SNIPPETS: PinnedSnippet[] = [
  {
    id: 'pin-nmap-1',
    title: 'Nmap Stealth Aggressive Full Port',
    command: 'nmap -sS -p- -T4 -A 192.168.1.100 -oN scan.txt',
    category: 'command',
    tag: 'Scanning',
    createdAt: Date.now() - 10000,
  },
  {
    id: 'pin-suid-2',
    title: 'Linux SUID Root Binary Discovery',
    command: 'find / -perm -4000 -user root -type f 2>/dev/null',
    category: 'command',
    tag: 'PrivEsc',
    createdAt: Date.now() - 9000,
  },
  {
    id: 'pin-wireshark-3',
    title: 'Wireshark POST & Cleartext Passwords',
    command: 'http.request.method == "POST" || tcp contains "password"',
    category: 'command',
    tag: 'Sniffing',
    createdAt: Date.now() - 8000,
  },
  {
    id: 'pin-hashcat-4',
    title: 'Hashcat NTLM Mode with RockYou',
    command: 'hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt',
    category: 'command',
    tag: 'Crypto',
    createdAt: Date.now() - 7000,
  },
  {
    id: 'pin-link-practical',
    title: 'Quick Link: 6-Hour Challenge Simulator',
    command: 'Jump directly to the 20-flag CEH Practical simulation',
    category: 'quicklink',
    targetTab: 'tests',
    tag: 'Simulation',
    createdAt: Date.now() - 6000,
  },
  {
    id: 'pin-link-tools',
    title: 'Quick Link: 65+ Pentest Tools Matrix',
    command: 'Browse categorized tools with syntax and flags',
    category: 'quicklink',
    targetTab: 'tools',
    tag: 'Checklist',
    createdAt: Date.now() - 5000,
  },
];

interface PinnedSnippetsPopoverProps {
  onNavigateTab: (tab: ExamTab) => void;
}

export const PinnedSnippetsPopover: React.FC<PinnedSnippetsPopoverProps> = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'command' | 'quicklink'>('all');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCommand, setNewCommand] = useState('');
  const [newCategory, setNewCategory] = useState<'command' | 'quicklink' | 'note'>('command');
  const containerRef = useRef<HTMLDivElement>(null);

  const [snippets, setSnippets] = useState<PinnedSnippet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PINNED_SNIPPETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_PINNED_SNIPPETS;
    } catch {
      return DEFAULT_PINNED_SNIPPETS;
    }
  });

  const saveSnippets = (updated: PinnedSnippet[]) => {
    setSnippets(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PINNED_SNIPPETS, JSON.stringify(updated));
    } catch {
      // storage error fallback
    }
  };

  // Close on outside click or Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsAddingCustom(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsAddingCustom(false);
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
  }, [isOpen]);

  const handleCopyCommand = async (snippet: PinnedSnippet) => {
    try {
      await navigator.clipboard.writeText(snippet.command);
      setCopiedId(snippet.id);
      playFlashcardSuccessSound();
      triggerAutoSaveToast(`Copied snippet: "${snippet.title}"`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleDeleteSnippet = (id: string) => {
    const filtered = snippets.filter((s) => s.id !== id);
    saveSnippets(filtered);
    triggerAutoSaveToast('Removed pinned item');
  };

  const handleAddCustomSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCommand.trim()) return;

    const newItem: PinnedSnippet = {
      id: `pin-custom-${Date.now()}`,
      title: newTitle.trim(),
      command: newCommand.trim(),
      category: newCategory,
      tag: newCategory === 'command' ? 'Custom' : 'QuickLink',
      createdAt: Date.now(),
    };

    saveSnippets([newItem, ...snippets]);
    setNewTitle('');
    setNewCommand('');
    setIsAddingCustom(false);
    triggerAutoSaveToast('Custom pinned snippet saved!');
  };

  const filteredSnippets = snippets.filter((s) => {
    const matchesCategory =
      activeCategoryFilter === 'all' || s.category === activeCategoryFilter;
    const matchesQuery =
      filterQuery.trim() === '' ||
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.command.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (s.tag && s.tag.toLowerCase().includes(filterQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        id="btn-context-pinned"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Pinned Command Snippets & Quick-Links"
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all group relative ${
          isOpen
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
            : snippets.length > 0
            ? 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 hover:text-amber-200 border-slate-700/70'
            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-700/70'
        }`}
      >
        <Pin className={`w-3 h-3 group-hover:scale-110 transition-transform ${
          snippets.length > 0 ? 'text-amber-400 fill-amber-400/20' : 'text-slate-400'
        }`} />
        <span className="hidden sm:inline">Pins</span>
        {snippets.length > 0 && (
          <span className="text-[9px] px-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold leading-none py-0.5">
            {snippets.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="popover-pinned-snippets"
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn space-y-3.5 backdrop-blur-md max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Pinned Commands & Quick-Links</span>
                  <span className="text-[10px] text-amber-400 font-mono">({snippets.length})</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Quick access clipboard for high-frequency commands
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="btn-add-pinned-snippet"
                onClick={() => setIsAddingCustom((prev) => !prev)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Add custom command snippet"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close pinned popover"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* New Custom Snippet Form (Collapsible) */}
          {isAddingCustom && (
            <form onSubmit={handleAddCustomSnippet} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 shrink-0 animate-fadeIn">
              <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                <span>Add Pinned Snippet</span>
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="text-slate-500 hover:text-slate-300 text-[10px]"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                placeholder="Title (e.g. SUID Exploit Search)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                required
              />
              <textarea
                placeholder="Command line syntax or note text..."
                value={newCommand}
                onChange={(e) => setNewCommand(e.target.value)}
                rows={2}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                required
              />
              <div className="flex items-center justify-between pt-1">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] rounded px-2 py-1 focus:outline-none"
                >
                  <option value="command">Terminal Command</option>
                  <option value="quicklink">Quick-Link</option>
                  <option value="note">Study Note</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  Save Pin
                </button>
              </div>
            </form>
          )}

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="text"
              placeholder="Search pinned commands..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="flex-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  activeCategoryFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('command')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  activeCategoryFilter === 'command'
                    ? 'bg-slate-800 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cmds
              </button>
            </div>
          </div>

          {/* Snippets Scrollable List */}
          <div className="overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/40">
            {filteredSnippets.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                No pinned snippets found matching your filter.
              </div>
            ) : (
              filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="pt-2 first:pt-0 group/item flex flex-col space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {snippet.category === 'command' ? (
                        <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <Bookmark className="w-3 h-3 text-cyan-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {snippet.title}
                      </span>
                      {snippet.tag && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-400 shrink-0">
                          {snippet.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover/item:opacity-100 transition-opacity">
                      {snippet.targetTab && (
                        <button
                          onClick={() => {
                            if (snippet.targetTab) {
                              onNavigateTab(snippet.targetTab);
                              setIsOpen(false);
                            }
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-teal-300 transition-colors"
                          title="Jump to tab"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyCommand(snippet)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Copy syntax"
                      >
                        {copiedId === snippet.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteSnippet(snippet.id)}
                        className="p-1 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Unpin snippet"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Command Line / Value Container */}
                  <div
                    onClick={() => handleCopyCommand(snippet)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-emerald-400/90 hover:text-emerald-300 break-all cursor-pointer transition-colors relative group/cmd select-all"
                    title="Click to copy syntax"
                  >
                    <code>{snippet.command}</code>
                    <div className="absolute right-1.5 top-1.5 opacity-0 group-hover/cmd:opacity-100 transition-opacity">
                      <span className="text-[9px] bg-slate-900 text-emerald-400 px-1 py-0.5 rounded border border-slate-700">
                        Copy
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
