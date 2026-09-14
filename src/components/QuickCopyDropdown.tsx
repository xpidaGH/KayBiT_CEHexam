import React, { useState, useRef, useEffect } from 'react';
import { Clipboard, Copy, Check, Terminal, Link, FileText, ChevronDown } from 'lucide-react';
import { ExamTab } from '../types';
import { TAB_COMMANDS_CONFIG, TabCommandInfo } from '../data/tabCommandsData';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { playFlashcardSuccessSound } from '../utils/audioCues';

interface QuickCopyDropdownProps {
  activeTab: ExamTab;
}

export const QuickCopyDropdown: React.FC<QuickCopyDropdownProps> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commandInfo: TabCommandInfo = TAB_COMMANDS_CONFIG[activeTab] || {
    tabId: activeTab,
    tabTitle: activeTab,
    primaryCommand: `ceh --tab ${activeTab}`,
    commandLabel: 'Tab CLI Command',
    commandDesc: 'Direct navigation command for current view',
    cliTool: 'bash',
  };

  const getTabUrl = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    return url.toString();
  };

  const tabUrl = getTabUrl();

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Close on outside click or Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
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

  const copyToClipboard = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      playFlashcardSuccessSound();
      triggerAutoSaveToast(`Copied ${label} to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block text-left"
    >
      <button
        id="btn-context-quick-copy"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Quick Copy (Primary Command & URL for Current Tab)"
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all group ${
          isOpen
            ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm'
            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-700/70'
        }`}
      >
        <Clipboard className="w-3 h-3 text-teal-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Quick Copy</span>
        <ChevronDown className={`w-2.5 h-2.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="popover-quick-copy-menu"
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-80 sm:w-88 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3.5 z-50 animate-fadeIn space-y-3 backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs font-bold text-white">
                Quick Copy: {commandInfo.tabTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono text-teal-400 uppercase bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/60">
              {commandInfo.cliTool}
            </span>
          </div>

          {/* Primary CLI Command */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {commandInfo.commandLabel}
              </span>
              <button
                id="btn-copy-tab-primary-command"
                onClick={() => copyToClipboard(commandInfo.primaryCommand, 'primary-cmd', 'CLI command')}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-mono border border-slate-700 transition-colors"
              >
                {copiedKey === 'primary-cmd' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div
              onClick={() => copyToClipboard(commandInfo.primaryCommand, 'primary-cmd', 'CLI command')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400/95 break-all cursor-pointer hover:border-teal-500/50 transition-colors group"
              title="Click to copy command"
            >
              <code>{commandInfo.primaryCommand}</code>
              <p className="text-[10px] font-sans text-slate-500 pt-1">
                {commandInfo.commandDesc}
              </p>
            </div>
          </div>

          {/* Secondary CLI Command (if available) */}
          {commandInfo.secondaryCommand && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {commandInfo.secondaryLabel || 'Alternative Command'}
                </span>
                <button
                  id="btn-copy-tab-secondary-command"
                  onClick={() => copyToClipboard(commandInfo.secondaryCommand!, 'secondary-cmd', 'alternative command')}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-mono border border-slate-700 transition-colors"
                >
                  {copiedKey === 'secondary-cmd' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div
                onClick={() => copyToClipboard(commandInfo.secondaryCommand!, 'secondary-cmd', 'alternative command')}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300/90 break-all cursor-pointer hover:border-cyan-500/50 transition-colors"
                title="Click to copy alternative syntax"
              >
                <code>{commandInfo.secondaryCommand}</code>
              </div>
            </div>
          )}

          {/* Direct Tab Link & Citation */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <button
              id="btn-copy-tab-direct-url"
              onClick={() => copyToClipboard(tabUrl, 'direct-url', 'Tab URL')}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 hover:text-white transition-colors text-left"
            >
              <span className="flex items-center gap-1.5">
                <Link className="w-3 h-3 text-teal-400" />
                <span>Copy Current Tab URL</span>
              </span>
              {copiedKey === 'direct-url' ? (
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3 text-slate-500" />
              )}
            </button>

            <button
              id="btn-copy-tab-citation"
              onClick={() => {
                const markdown = `[KayBiT CEH v13 Blueprint - ${commandInfo.tabTitle}](${tabUrl})`;
                copyToClipboard(markdown, 'markdown-cite', 'Markdown citation');
              }}
              className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 hover:text-white transition-colors text-left"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>Copy as Markdown Link</span>
              </span>
              {copiedKey === 'markdown-cite' ? (
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <Copy className="w-3 h-3 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
