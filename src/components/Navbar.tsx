import React from 'react';
import { 
  Terminal, 
  BookOpen, 
  ShieldCheck, 
  CheckSquare, 
  Cpu, 
  Award, 
  Download, 
  FileText, 
  Globe,
  PieChart,
  Search,
  Lock
} from 'lucide-react';
import { ExamTab } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/translations';
import { NAV_ITEMS_CONFIG, APP_CONFIG } from '../data/appConfig';

interface NavbarProps {
  activeTab: ExamTab;
  setActiveTab: (tab: ExamTab) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  onOpenUserGuide: () => void;
  onOpenGlobalSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLanguage,
  setSelectedLanguage,
  onOpenUserGuide,
  onOpenGlobalSearch,
}) => {
  const getNavIcon = (id: ExamTab) => {
    switch (id) {
      case 'written':
        return <BookOpen className="w-4 h-4" />;
      case 'practical':
        return <ShieldCheck className="w-4 h-4" />;
      case 'darkweb':
        return <Lock className="w-4 h-4" />;
      case 'progress':
        return <PieChart className="w-4 h-4" />;
      case 'tools':
        return <CheckSquare className="w-4 h-4" />;
      case 'methodology':
        return <Cpu className="w-4 h-4" />;
      case 'tests':
        return <Award className="w-4 h-4" />;
      case 'installation':
        return <Download className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Branding */}
          <div 
            id="brand-header"
            onClick={() => setActiveTab('written')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-emerald-400/30">
              <Terminal className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-100 font-mono">
                  KayBiT<span className="text-emerald-400">_CEHexam</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {APP_CONFIG.blueprintVersion} Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{APP_CONFIG.title}</p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {NAV_ITEMS_CONFIG.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={item.description}
                >
                  {getNavIcon(item.id)}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isActive
                          ? 'bg-slate-950 text-emerald-300'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Search, Language dropdown & User Guide Modal button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Global Quick Search Button */}
            <button
              id="btn-global-search"
              onClick={onOpenGlobalSearch}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all group shadow-sm"
              title="Global Search topics, commands, notes, and tools (Ctrl+K or ⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-slate-300">Quick Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-slate-800/90 text-slate-400 border border-slate-700 rounded px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative flex items-center">
              <label htmlFor="language-select" className="sr-only">Select Language</label>
              <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition-colors">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent border-none text-slate-200 text-xs focus:ring-0 focus:outline-none cursor-pointer pr-1"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                      {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* User Guide Button */}
            <button
              id="btn-user-guide-modal"
              onClick={onOpenUserGuide}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
              title="Open the comprehensive student & educator user guide"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">User Guide</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          <button
            id="btn-mobile-search"
            onClick={onOpenGlobalSearch}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
          {NAV_ITEMS_CONFIG.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={`m-${item.id}`}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {getNavIcon(item.id)}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
