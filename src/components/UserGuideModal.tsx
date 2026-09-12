import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  Globe, 
  Download, 
  Check, 
  BookOpen, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Info,
  Gauge
} from 'lucide-react';
import { USER_GUIDE_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

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
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Initialize Text-To-Speech hook
  const {
    isSupported: isTtsSupported,
    isPlaying,
    isPaused,
    availableVoices,
    activeVoice,
    rate,
    usingFallbackVoice,
    fallbackReason,
    speak,
    pause,
    resume,
    stop,
    setRate,
    setLanguage,
    selectVoice
  } = useTextToSpeech({
    defaultLanguage: selectedLanguage,
    defaultRate: 1.0
  });

  // Keep TTS language in sync with modal language
  useEffect(() => {
    setLanguage(selectedLanguage);
    stop();
  }, [selectedLanguage, setLanguage, stop]);

  // Clean up speech when closing modal
  const handleClose = () => {
    stop();
    onClose();
  };

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

  // Speak entire guide
  const handleSpeakFullGuide = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
      return;
    }

    setActiveSectionId('all');
    let fullText = `${currentGuide.title}. ${currentGuide.badge}. `;
    currentGuide.sections.forEach((sec) => {
      fullText += `${sec.heading}. ${sec.content}. `;
      if (sec.bulletPoints) {
        sec.bulletPoints.forEach((bp) => {
          fullText += `${bp}. `;
        });
      }
    });

    speak(fullText, selectedLanguage);
  };

  // Speak individual section
  const handleSpeakSection = (sec: typeof currentGuide.sections[0]) => {
    if (isPlaying && activeSectionId === sec.id) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
      return;
    }

    setActiveSectionId(sec.id);
    let sectionText = `${sec.heading}. ${sec.content}. `;
    if (sec.bulletPoints) {
      sec.bulletPoints.forEach((bp) => {
        sectionText += `${bp}. `;
      });
    }

    speak(sectionText, selectedLanguage);
  };

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

  // Filter voices that match or relate to current language
  const relevantVoices = useMemo(() => {
    if (!availableVoices || availableVoices.length === 0) return [];
    const prefix = selectedLanguage === 'wuu' ? 'zh' : selectedLanguage.toLowerCase();
    return availableVoices.filter(v => 
      v.lang.toLowerCase().startsWith(prefix) || 
      v.lang.toLowerCase().includes(prefix)
    );
  }, [availableVoices, selectedLanguage]);

  return (
    <div 
      id="user-guide-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
      onClick={handleClose}
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
                Translations and native speech synthesis available for 20 internationalization languages | Updated {currentGuide.lastUpdated}
              </p>
            </div>
          </div>

          <button
            id="btn-close-user-guide"
            onClick={handleClose}
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

        {/* TTS Native Audio Bar */}
        {isTtsSupported && (
          <div 
            id="tts-audio-player-bar"
            className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs text-slate-200"
          >
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                id="btn-tts-play-guide"
                type="button"
                onClick={handleSpeakFullGuide}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
                  isPlaying && !isPaused
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
                title="Read entire manual out loud with matched voice"
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Guide Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPaused ? 'Resume Audio' : 'Listen to Full Guide'}</span>
                  </>
                )}
              </button>

              {isPlaying && (
                <button
                  id="btn-tts-stop-guide"
                  type="button"
                  onClick={stop}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 text-xs transition-colors"
                  title="Stop audio playback"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop</span>
                </button>
              )}

              {/* Speed Rate selector */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                <Gauge className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] text-slate-400">Speed:</span>
                {[0.8, 1.0, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRate(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      rate === s ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Engine & Fallback Indicator */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="text-slate-400">Voice:</span>
                <span className="font-medium text-slate-200 truncate max-w-[170px]" title={activeVoice ? `${activeVoice.name} (${activeVoice.lang})` : 'System Default'}>
                  {activeVoice ? activeVoice.name : 'System Default'}
                </span>
                {activeVoice && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                    {activeVoice.lang}
                  </span>
                )}
              </div>

              {/* Fallback Notice for wuu -> zh or general fallback */}
              {usingFallbackVoice && fallbackReason && (
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px]"
                  title={fallbackReason}
                >
                  <Info className="w-3 h-3 shrink-0 text-amber-400" />
                  <span className="truncate max-w-[200px]">
                    {selectedLanguage === 'wuu' ? 'wuu -> zh engine fallback' : 'Voice fallback active'}
                  </span>
                </div>
              )}

              {/* Optional Voice Picker for this language */}
              {relevantVoices.length > 1 && (
                <select
                  value={activeVoice?.name || ''}
                  onChange={(e) => {
                    const chosen = relevantVoices.find(v => v.name === e.target.value);
                    if (chosen) selectVoice(chosen);
                  }}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none"
                  title="Choose system voice dialect"
                >
                  {relevantVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm">
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p>No sections match your search "{searchQuery}".</p>
            </div>
          ) : (
            filteredSections.map((sec) => {
              const isThisSectionPlaying = isPlaying && activeSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  id={`guide-section-${sec.id}`}
                  className={`p-5 rounded-xl border transition-all ${
                    isThisSectionPlaying
                      ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
                      <span>{sec.heading}</span>
                    </h3>

                    {/* Section Audio Speak Button */}
                    {isTtsSupported && (
                      <button
                        type="button"
                        onClick={() => handleSpeakSection(sec)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          isThisSectionPlaying
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700'
                        }`}
                        title={isThisSectionPlaying ? 'Pause section audio' : 'Listen to this section in selected language'}
                      >
                        {isThisSectionPlaying ? (
                          <>
                            <Pause className="w-3 h-3 text-amber-400" />
                            <span>{isPaused ? 'Resume' : 'Pause'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-emerald-400" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

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
              );
            })
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
          <span>Targeting CEH v13 Blueprint & CEH Practical 6-Hour Exam • 20 Language Guides Supported</span>
          <button
            id="btn-close-modal-bottom"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

