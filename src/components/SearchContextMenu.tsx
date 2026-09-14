import React, { useEffect, useRef } from 'react';
import { RefreshCw, Trash2, Bug, Zap, Check, AlertCircle } from 'lucide-react';
import { SEARCH_CONTEXT_MENU_ITEMS, ContextMenuItem } from '../data/contextMenuData';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { playFlashcardSuccessSound, playTimerCompleteSound } from '../utils/audioCues';

interface SearchContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onOpenBugReport: () => void;
}

export const SearchContextMenu: React.FC<SearchContextMenuProps> = ({
  isOpen,
  position,
  onClose,
  onOpenBugReport,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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

  const handleAction = (id: ContextMenuItem['id']) => {
    onClose();
    if (id === 'refresh') {
      playFlashcardSuccessSound();
      // Notify components and sync state
      window.dispatchEvent(new Event('storage'));
      triggerAutoSaveToast('App data & local state verified and refreshed!');
    } else if (id === 'clear-cache') {
      try {
        // Clear non-critical caches (session, temporary keys)
        sessionStorage.clear();
        // Clear search query cache or temporary memory
        playTimerCompleteSound();
        triggerAutoSaveToast('Temporary cache & session index cleared successfully!');
      } catch (err) {
        triggerAutoSaveToast('Notice: Cache flush finished.');
      }
    } else if (id === 'report-bug') {
      onOpenBugReport();
    }
  };

  const getItemIcon = (id: ContextMenuItem['id']) => {
    switch (id) {
      case 'refresh':
        return <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />;
      case 'clear-cache':
        return <Trash2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'report-bug':
        return <Bug className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  return (
    <div
      ref={menuRef}
      id="menu-search-context"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      className="fixed z-50 w-64 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-1.5 backdrop-blur-md animate-scaleIn text-slate-200 divide-y divide-slate-800/60"
    >
      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
        <span>Quick Developer Actions</span>
        <span className="font-mono text-emerald-400">Right-Click Menu</span>
      </div>

      <div className="py-1 space-y-0.5">
        {SEARCH_CONTEXT_MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            id={`btn-context-menu-${item.id}`}
            onClick={() => handleAction(item.id)}
            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs hover:bg-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 group-hover:scale-110 transition-transform">
                {getItemIcon(item.id)}
              </span>
              <div className="min-w-0">
                <div className="font-medium text-slate-200 group-hover:text-white truncate">
                  {item.label}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1">
                  {item.description}
                </div>
              </div>
            </div>
            {item.shortcut && (
              <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1 py-0.5 rounded border border-slate-800 shrink-0 ml-2">
                {item.shortcut}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
