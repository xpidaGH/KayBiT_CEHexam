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
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { Footer } from './components/Footer';
import { AutoSaveToast } from './components/AutoSaveToast';
import { APP_CONFIG, STORAGE_KEYS, NAV_ITEMS_CONFIG } from './data/appConfig';
import { 
  ChevronRight,
  Sparkles,
  Search,
  Keyboard
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ExamTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    if (saved && ['written', 'practical', 'darkweb', 'progress', 'tools', 'methodology', 'tests', 'installation', 'flashcards'].includes(saved)) {
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

  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Global keyboard shortcuts:
  // - Shift+/ or '?' : Open Keyboard Shortcuts Modal
  // - Ctrl+K or Cmd+K : Open Global Quick Search
  // - Esc : Close active modal
  // - 1-9 (or Alt+1-9) : Direct navigation across all 9 views
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

      // 3. Escape key closes open modals
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          e.preventDefault();
          setIsShortcutsOpen(false);
          return;
        }
      }

      // 4. Number navigation 1-9 (or Alt+1-9) when no modals are open
      if (!isInputActive && !isShortcutsOpen && !isSearchOpen && !isUserGuideOpen) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= NAV_ITEMS_CONFIG.length && (e.altKey || (!e.ctrlKey && !e.metaKey && !e.shiftKey))) {
          const target = NAV_ITEMS_CONFIG[num - 1];
          if (target) {
            e.preventDefault();
            setActiveTab(target.id);
            return;
          }
        }

        // 5. 'Z' key to toggle Practical Zen mode
        if ((e.key === 'z' || e.key === 'Z') && !e.ctrlKey && !e.metaKey && !e.altKey && activeTab === 'practical') {
          e.preventDefault();
          setIsZenMode((prev) => !prev);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, isSearchOpen, isUserGuideOpen, activeTab]);

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

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'midnight' ? 'deep-slate' : 'midnight'));
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200 ${
      theme === 'deep-slate' ? 'bg-slate-900 theme-deep-slate' : 'bg-slate-950 theme-midnight'
    }`}>
      {/* Top Main Navigation (Hidden in Zen Mode) */}
      {!inPracticalZen && (
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
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto ${inPracticalZen ? 'p-0' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6'}`}>
        {/* Dynamic Context Header Bar with Quick Search Trigger (Hidden in Zen Mode) */}
        {!inPracticalZen && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-emerald-400 font-mono font-bold uppercase">{APP_CONFIG.appName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-300 font-medium">{activeNavConfig?.label}</span>
              {activeNavConfig?.description && (
                <span className="text-slate-500 hidden md:inline">• {activeNavConfig.description}</span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                id="btn-context-search"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 text-[11px] font-medium transition-all group"
              >
                <Search className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Lookup Commands & Topics</span>
                <kbd className="hidden sm:inline text-[9px] bg-slate-900 text-slate-400 border border-slate-700 px-1 rounded font-mono">
                  ⌘K
                </kbd>
              </button>

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

              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Offline Ready</span>
              </div>
              <button
                id="btn-quick-practice"
                onClick={() => setActiveTab('tests')}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
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
        {activeTab === 'installation' && <InstallationView />}
      </main>

      {/* Multi-Language & Programming Curriculum Footer (Hidden in Zen Mode) */}
      {!inPracticalZen && (
        <Footer
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenUserGuide={() => setIsUserGuideOpen(true)}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

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
      {/* Global Auto-Save Notification Toast */}
      <AutoSaveToast />
    </div>
  );
}
