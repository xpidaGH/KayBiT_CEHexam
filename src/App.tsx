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
import { APP_CONFIG, STORAGE_KEYS, NAV_ITEMS_CONFIG } from './data/appConfig';
import { 
  Shield, 
  Terminal, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ExamTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    if (saved && ['written', 'practical', 'darkweb', 'progress', 'tools', 'methodology', 'tests', 'installation'].includes(saved)) {
      return saved as ExamTab;
    }
    return 'written';
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE) || 'en';
  });

  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open search anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, selectedLanguage);
  }, [selectedLanguage]);

  const activeNavConfig = NAV_ITEMS_CONFIG.find((item) => item.id === activeTab);

  const supportedLanguagesList = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 'Kotlin', 'Dart/Flutter', 
    'Bash/Shell', 'Rust', 'Go (Golang)', 'C++', 'C', 'PHP', 'Ruby', 'PowerShell', 
    'SQL', 'R', 'Scala', 'MATLAB', 'COBOL & Assembly'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
        onOpenGlobalSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Context Header Bar with Quick Search Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-emerald-400 font-mono font-bold uppercase">{APP_CONFIG.appName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-300 font-medium">{activeNavConfig?.label}</span>
            {activeNavConfig?.description && (
              <span className="text-slate-500 hidden md:inline">• {activeNavConfig.description}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
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

        {/* View Switcher */}
        {activeTab === 'written' && <WrittenExamView onNavigateToProgress={() => setActiveTab('progress')} />}
        {activeTab === 'practical' && <PracticalExamView />}
        {activeTab === 'darkweb' && <DarkWebBlueprintView />}
        {activeTab === 'progress' && <DomainProgressTracker />}
        {activeTab === 'tools' && <ToolsChecklistView />}
        {activeTab === 'methodology' && <ProgrammerMethodologyView />}
        {activeTab === 'tests' && <PracticeTestsView />}
        {activeTab === 'installation' && <InstallationView />}
      </main>

      {/* Multi-Language & Programming Curriculum Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono font-bold text-slate-300">
                {APP_CONFIG.appName} — {APP_CONFIG.title}
              </p>
              <p className="text-slate-500">
                Certified Ethical Hacker v13 Blueprint • Hands-on Labs & Living Automation Scripts
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-slate-400 hover:text-emerald-400 transition-colors underline flex items-center gap-1"
              >
                <Search className="w-3 h-3 text-emerald-400" />
                <span>Global Lookup (⌘K)</span>
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-slate-400 hover:text-emerald-400 transition-colors underline"
              >
                Domain Progress & Rings
              </button>
              <button
                onClick={() => setIsUserGuideOpen(true)}
                className="text-slate-400 hover:text-emerald-400 transition-colors underline"
              >
                Comprehensive User Guide
              </button>
              <button
                onClick={() => setActiveTab('installation')}
                className="text-slate-400 hover:text-emerald-400 transition-colors underline"
              >
                Native Platform Packaging
              </button>
              <button
                onClick={() => setActiveTab('methodology')}
                className="text-slate-400 hover:text-emerald-400 transition-colors underline"
              >
                Living Commands & Analyzer
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-900/80">
            <p className="text-[11px] text-slate-400 font-medium mb-1.5">
              Engineered for intermediate software developers in 20 core programming languages:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {supportedLanguagesList.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

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
    </div>
  );
}
