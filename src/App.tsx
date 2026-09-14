/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ExamTab } from './types';
import { Navbar } from './components/Navbar';
import { UserGuideModal } from './components/UserGuideModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { WrittenExamView } from './components/WrittenExamView';
import { PracticalExamView } from './components/PracticalExamView';
import { DarkWebBlueprintView } from './components/DarkWebBlueprintView';
import { ToolsChecklistView } from './components/ToolsChecklistView';
import { ProgrammerMethodologyView } from './components/ProgrammerMethodologyView';
import { PracticeTestsView } from './components/PracticeTestsView';
import { InstallationView } from './components/InstallationView';
import { DomainProgressTracker } from './components/DomainProgressTracker';
import { FlashcardsView } from './components/FlashcardsView';
import { BookmarksView } from './components/BookmarksView';
import { FocusModeBar } from './components/FocusModeBar';
import { SettingsModal } from './components/SettingsModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { Footer } from './components/Footer';
import { AutoSaveToast } from './components/AutoSaveToast';
import { ShareViewDropdown } from './components/ShareViewDropdown';
import { PinnedSnippetsPopover } from './components/PinnedSnippetsPopover';
import { QuickCopyDropdown } from './components/QuickCopyDropdown';
import { StarViewButton } from './components/StarViewButton';
import { SearchContextMenu } from './components/SearchContextMenu';
import { BugReportModal } from './components/BugReportModal';
import { APP_CONFIG, STORAGE_KEYS, NAV_ITEMS_CONFIG } from './data/appConfig';
import { 
  ChevronRight,
  Sparkles,
  Search,
  Keyboard,
  Maximize2,
  Focus
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ExamTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    if (saved && ['written', 'practical', 'darkweb', 'progress', 'tools', 'methodology', 'tests', 'installation', 'flashcards', 'bookmarks'].includes(saved)) {
      return saved as ExamTab;
    }
    return 'written';
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE) || 'en';
  });

  const [theme, setTheme] = useState<'midnight' | 'deep-slate'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APP_THEME);
    return saved === 'deep-slate' ? 'deep-slate' : 'midnight';
  });

  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.FOCUS_MODE) === 'true';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isBugReportOpen, setIsBugReportOpen] = useState<boolean>(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBackgroundSyncActive, setIsBackgroundSyncActive] = useState<boolean>(false);

  // Background process activity heartbeat (AI search index synchronization & storage updates)
  useEffect(() => {
    const handleSyncPulse = () => {
      setIsBackgroundSyncActive(true);
      setTimeout(() => setIsBackgroundSyncActive(false), 3000);
    };

    window.addEventListener('auto-save-toast', handleSyncPulse);
    window.addEventListener('bookmarks-updated', handleSyncPulse);
    window.addEventListener('storage', handleSyncPulse);

    // Periodic faint background indexing pulse (every 18 seconds)
    const interval = setInterval(() => {
      setIsBackgroundSyncActive(true);
      setTimeout(() => setIsBackgroundSyncActive(false), 2200);
    }, 18000);

    return () => {
      window.removeEventListener('auto-save-toast', handleSyncPulse);
      window.removeEventListener('bookmarks-updated', handleSyncPulse);
      window.removeEventListener('storage', handleSyncPulse);
      clearInterval(interval);
    };
  }, []);

  // Sync Focus Mode to localStorage and dispatch event
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOCUS_MODE, String(isFocusMode));
  }, [isFocusMode]);

  // Global keyboard shortcuts:
  // - Shift+/ or '?' : Open Keyboard Shortcuts Modal
  // - Ctrl+K or Cmd+K : Open Global Quick Search
  // - Esc : Close active modal or exit Focus / Zen Mode
  // - F/f : Toggle Global Focus Mode
  // - B/b or 0 : Direct navigation to My Bookmarks tab
  // - 1-9 (or Alt+1-9) : Direct navigation across views
  // - Z/z : Toggle Practical Zen Mode (when on practical tab)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.tagName === 'SELECT' ||
        (activeEl as HTMLElement).isContentEditable
      );

      // 1. Search shortcut (⌘K or Ctrl+K) - works anywhere
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // 2. Keyboard shortcuts modal (Shift+/ or '?')
      // Must not trigger if user is actively typing inside an input/textarea
      if (!isInputActive) {
        if (e.key === '?' || (e.shiftKey && (e.key === '/' || e.code === 'Slash'))) {
          e.preventDefault();
          setIsShortcutsOpen((prev) => !prev);
          return;
        }
      }

      // 3. Escape key closes open modals or exits focus mode
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          e.preventDefault();
          setIsSettingsOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          e.preventDefault();
          setIsShortcutsOpen(false);
          return;
        }
        if (isSearchOpen) {
          e.preventDefault();
          setIsSearchOpen(false);
          return;
        }
        if (isUserGuideOpen) {
          e.preventDefault();
          setIsUserGuideOpen(false);
          return;
        }
        if (isFocusMode) {
          e.preventDefault();
          setIsFocusMode(false);
          return;
        }
      }

      // 4. Global Focus Mode toggle ('F' or 'f' when not typing)
      if (!isInputActive && (e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsFocusMode((prev) => !prev);
        return;
      }

      // 5. 'B' or 'b' or '0' jumps to My Bookmarks tab
      if (!isInputActive && !isShortcutsOpen && !isSearchOpen && !isUserGuideOpen && !isSettingsOpen) {
        if (((e.key === 'b' || e.key === 'B') && !e.ctrlKey && !e.metaKey && !e.altKey) || e.key === '0') {
          e.preventDefault();
          setActiveTab('bookmarks');
          return;
        }
      }

      // 6. Number navigation 1-9 (or Alt+1-9) when no modals are open
      if (!isInputActive && !isShortcutsOpen && !isSearchOpen && !isUserGuideOpen && !isSettingsOpen) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= NAV_ITEMS_CONFIG.length && (e.altKey || (!e.ctrlKey && !e.metaKey && !e.shiftKey))) {
          const target = NAV_ITEMS_CONFIG[num - 1];
          if (target) {
            e.preventDefault();
            setActiveTab(target.id);
            return;
          }
        }

        // 7. 'Z' key to toggle Practical Zen mode
        if ((e.key === 'z' || e.key === 'Z') && !e.ctrlKey && !e.metaKey && !e.altKey && activeTab === 'practical') {
          e.preventDefault();
          setIsZenMode((prev) => !prev);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, isSearchOpen, isUserGuideOpen, isSettingsOpen, isFocusMode, activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_THEME, theme);
  }, [theme]);

  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  const activeNavConfig = NAV_ITEMS_CONFIG.find((item) => item.id === activeTab);
  const inPracticalZen = isZenMode && activeTab === 'practical';
  const isMinimalUI = inPracticalZen || isFocusMode;

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'midnight' ? 'deep-slate' : 'midnight'));
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200 ${
      theme === 'deep-slate' ? 'bg-slate-900 theme-deep-slate' : 'bg-slate-950 theme-midnight'
    }`}>
      {/* Focus Mode Sticky Top Bar */}
      {isFocusMode && !inPracticalZen && (
        <FocusModeBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onExitFocusMode={() => setIsFocusMode(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Standard Main Navigation (Hidden in Zen Mode or Focus Mode) */}
      {!isMinimalUI && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
          onOpenGlobalSearch={() => setIsSearchOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          isFocusMode={isFocusMode}
          onToggleFocusMode={() => setIsFocusMode(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto ${
        inPracticalZen 
          ? 'p-0' 
          : isFocusMode 
            ? 'max-w-7xl px-3 sm:px-5 lg:px-6 py-4 space-y-5' 
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6'
      }`}>
        {/* Dynamic Context Header Bar with Quick Search Trigger (Hidden in Zen Mode & Focus Mode) */}
        {!isMinimalUI && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400 font-mono font-bold uppercase">{APP_CONFIG.appName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-300 font-medium">{activeNavConfig?.label}</span>
              {activeNavConfig?.description && (
                <span className="text-slate-500 hidden md:inline">• {activeNavConfig.description}</span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              {/* Primary Search Button with subtle hover glow animation, right-click context menu, and background activity indicator */}
              <button
                id="btn-context-search"
                onClick={() => setIsSearchOpen(true)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenuPosition({ x: e.clientX, y: e.clientY });
                  setIsContextMenuOpen(true);
                }}
                className="relative flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 hover:border-emerald-500/60 text-[11px] font-medium transition-all duration-300 group hover:shadow-[0_0_16px_rgba(16,185,129,0.35)]"
                title="Lookup Commands & Topics (⌘K / Ctrl+K) • Right-click for Developer Actions"
              >
                <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none -z-10" />
                <Search className="w-3 h-3 text-emerald-400 group-hover:scale-110 group-hover:text-emerald-300 transition-all" />
                <span>Lookup Commands & Topics</span>

                {/* Subtle visual indicator pulsing faintly during background indexing / data sync */}
                <span
                  className="relative flex items-center justify-center w-2 h-2 ml-0.5"
                  title={isBackgroundSyncActive ? "Background AI search index & data syncing active" : "AI search index synced and ready"}
                >
                  {isBackgroundSyncActive && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-300 ${
                      isBackgroundSyncActive
                        ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                        : 'bg-emerald-500/40'
                    }`}
                  />
                </span>

                <kbd className="hidden sm:inline text-[9px] bg-slate-900 text-slate-400 border border-slate-700 px-1 rounded font-mono group-hover:border-emerald-500/40 group-hover:text-emerald-300 transition-colors">
                  ⌘K
                </kbd>
              </button>

              {/* Star Button next to #btn-context-search to instantly bookmark current view or search query result */}
              <StarViewButton activeTab={activeTab} />

              {/* Quick Copy Button with hover/click menu for primary tab command or URL */}
              <QuickCopyDropdown activeTab={activeTab} />

              {/* Secondary Focus Mode Toggle Button */}
              <button
                id="btn-context-focus-mode"
                onClick={() => setIsFocusMode((prev) => !prev)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 text-[11px] font-medium transition-all group"
                title="Toggle Focus Mode (Press 'F' or click to focus without distractions)"
              >
                <Maximize2 className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Focus Mode</span>
                <kbd className="text-[9px] bg-slate-900 text-slate-400 border border-slate-700 px-1 rounded font-mono">
                  F
                </kbd>
              </button>

              {/* Share Current View Dropdown */}
              <ShareViewDropdown activeTab={activeTab} />

              {/* User Pinned Snippets & Quick-Links Popover */}
              <PinnedSnippetsPopover onNavigateTab={(tab) => setActiveTab(tab)} />

              {/* Keyboard Shortcuts Trigger */}
              <button
                id="btn-context-shortcuts"
                onClick={() => setIsShortcutsOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 text-[11px] font-medium transition-all group"
                title="Keyboard Shortcuts & Navigation (Shift+/ or ?)"
              >
                <Keyboard className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline">Shortcuts</span>
                <kbd className="text-[9px] bg-slate-900 text-slate-400 border border-slate-700 px-1 rounded font-mono">
                  ?
                </kbd>
              </button>

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hidden lg:flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Offline Ready</span>
              </div>
              <button
                id="btn-quick-practice"
                onClick={() => setActiveTab('tests')}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 ml-auto sm:ml-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Launch 6h Simulator</span>
              </button>
            </div>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'written' && <WrittenExamView onNavigateToProgress={() => setActiveTab('progress')} />}
        {activeTab === 'practical' && (
          <PracticalExamView 
            isZenMode={isZenMode}
            onToggleZenMode={(val) => setIsZenMode(val)}
            onNavigateToSimulator={() => setActiveTab('tests')}
          />
        )}
        {activeTab === 'darkweb' && <DarkWebBlueprintView />}
        {activeTab === 'progress' && <DomainProgressTracker />}
        {activeTab === 'tools' && <ToolsChecklistView />}
        {activeTab === 'methodology' && <ProgrammerMethodologyView />}
        {activeTab === 'tests' && <PracticeTestsView />}
        {activeTab === 'flashcards' && <FlashcardsView />}
        {activeTab === 'bookmarks' && <BookmarksView onNavigateTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'installation' && <InstallationView />}
      </main>

      {/* Multi-Language & Programming Curriculum Footer (Hidden in Zen Mode or Focus Mode) */}
      {!isMinimalUI && (
        <Footer
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* Settings & Audio Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
      />

      {/* Comprehensive Multilingual User Guide Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Instant Global Search Modal Across Notes & Methodology */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsSearchOpen(false);
        }}
      />

      {/* Keyboard Shortcuts & Navigation Cheat Sheet Modal (Shift+/) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
          setIsShortcutsOpen(false);
        }}
      />
      {/* Developer Context Menu for Search Button */}
      <SearchContextMenu
        isOpen={isContextMenuOpen}
        position={contextMenuPosition}
        onClose={() => setIsContextMenuOpen(false)}
        onOpenBugReport={() => setIsBugReportOpen(true)}
      />

      {/* Developer Diagnostics & Bug Report Modal */}
      <BugReportModal
        isOpen={isBugReportOpen}
        onClose={() => setIsBugReportOpen(false)}
        activeTab={activeTab}
      />

      {/* Global Auto-Save Notification Toast */}
      <AutoSaveToast />
    </div>
  );
}
