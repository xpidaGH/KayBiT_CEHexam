import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { ExamTab } from '../types';
import { NAV_ITEMS_CONFIG } from '../data/appConfig';
import { isBookmarked, toggleBookmark } from '../utils/bookmarkManager';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { playFlashcardSuccessSound } from '../utils/audioCues';

interface StarViewButtonProps {
  activeTab: ExamTab;
}

export const StarViewButton: React.FC<StarViewButtonProps> = ({ activeTab }) => {
  const bookmarkId = `view-${activeTab}`;
  const [isStarred, setIsStarred] = useState<boolean>(() => isBookmarked(bookmarkId));

  const activeNav = NAV_ITEMS_CONFIG.find((item) => item.id === activeTab);
  const tabTitle = activeNav?.label || activeTab;

  useEffect(() => {
    setIsStarred(isBookmarked(bookmarkId));

    const handleUpdate = () => {
      setIsStarred(isBookmarked(bookmarkId));
    };

    window.addEventListener('bookmarks-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bookmarks-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [activeTab, bookmarkId]);

  const handleToggleStar = () => {
    const newlyStarred = toggleBookmark({
      id: bookmarkId,
      type: 'cheatsheet',
      title: `${tabTitle} View`,
      category: 'Saved Views',
      sourceTab: activeTab,
      description: activeNav?.description || `Quick-access bookmark for the CEH v13 ${tabTitle} workspace.`,
      content: `Direct shortcut to ${tabTitle} (${activeTab}).`,
      tags: ['View', activeTab, 'Starred', 'Dashboard'],
      createdAt: new Date().toISOString(),
    });

    setIsStarred(newlyStarred);

    if (newlyStarred) {
      playFlashcardSuccessSound();
      triggerAutoSaveToast(`Starred "${tabTitle}" view to your Bookmarks dashboard!`);
    } else {
      triggerAutoSaveToast(`Removed "${tabTitle}" from Bookmarks.`);
    }
  };

  return (
    <button
      id="btn-context-star-view"
      onClick={handleToggleStar}
      title={isStarred ? `Unstar ${tabTitle} view` : `Star ${tabTitle} view for immediate dashboard access`}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all group ${
        isStarred
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
          : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-700/70'
      }`}
    >
      <Star
        className={`w-3 h-3 group-hover:scale-110 transition-transform ${
          isStarred
            ? 'text-amber-400 fill-amber-400'
            : 'text-slate-400 group-hover:text-amber-400'
        }`}
      />
      <span className="hidden sm:inline">{isStarred ? 'Starred' : 'Star'}</span>
    </button>
  );
};
