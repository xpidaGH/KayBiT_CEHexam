import React, { useState, useMemo } from 'react';
import { X, Search, Globe, Download, Check, BookOpen, ExternalLink } from 'lucide-react';
import { USER_GUIDE_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onLanguageChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Fallback to English if translation key missing
  const currentGuide = useMemo(() => {
    return USER_GUIDE_TRANSLATIONS[selectedLanguage] || USER_GUIDE_TRANSLATIONS.en;
  }, [selectedLanguage]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return currentGuide.sections;
    const q = searchQuery.toLowerCase();
    return currentGuide.sections.filter(
      (sec) =>
        sec.heading.toLowerCase().includes(q) ||
        sec.content.toLowerCase().includes(q) ||
        sec.bulletPoints?.some((bp) => bp.toLowerCase().includes(q))
    );
  }, [currentGuide, searchQuery]);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    let md = `# ${currentGuide.title}\n\n`;
    currentGuide.sections.forEach((sec) => {
      md += `## ${sec.heading}\n\n${sec.content}\n\n`;
      if (sec.bulletPoints) {
        sec.bulletPoints.forEach((bp) => {
          md += `- ${bp}\n`;
        });
        md += '\n';
      }
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="user-guide-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="user-guide-modal-container"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-emerald-950/50 overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">{currentGuide.title}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                  {currentGuide.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Translations available for 18 internationalization languages | Updated {currentGuide.lastUpdated}
              </p>
            </div>
          </div>

          <button
            id="btn-close-user-guide"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Language selector, Search, and Copy */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-950/40 border-b border-slate-800 text-xs">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">Language:</span>
            <select
              id="guide-language-dropdown"
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} - {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="guide-search-input"
              type="text"
              placeholder="Search guide sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Copy Markdown */}
          <button
            id="btn-copy-guide-markdown"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors font-medium text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy as Markdown'}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm">
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p>No sections match your search "{searchQuery}".</p>
            </div>
          ) : (
            filteredSections.map((sec) => (
              <div
                key={sec.id}
                id={`guide-section-${sec.id}`}
                className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <h3 className="text-base font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                  <span>{sec.heading}</span>
                </h3>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm mb-3">
                  {sec.content}
                </p>

                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="space-y-1.5 border-l-2 border-slate-700 pl-3.5 mt-2">
                    {sec.bulletPoints.map((bp, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}

          {/* Quick links to source files */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">File References:</span>
              <span className="font-mono text-emerald-400">/USER_GUIDE.md</span>
              <span>•</span>
              <span className="font-mono text-emerald-400">/INSTALLATION.md</span>
              <span>•</span>
              <span className="font-mono text-emerald-400">/README.md</span>
            </div>
            <div className="text-slate-500">
              Available 100% offline in native builds
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
          <span>Targeting CEH v13 Blueprint & CEH Practical 6-Hour Exam</span>
          <button
            id="btn-close-modal-bottom"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
