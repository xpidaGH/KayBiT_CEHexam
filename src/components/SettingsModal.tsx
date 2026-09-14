/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Clock, 
  Play, 
  Check, 
  Moon, 
  Sun, 
  Maximize2, 
  Sparkles, 
  ShieldCheck, 
  Bookmark, 
  RotateCcw,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { 
  getAudioSettings, 
  updateAudioSettings, 
  playFlashcardSuccessSound, 
  playDeckMasteredFanfare, 
  playTimerCompleteSound,
  playFlagCapturedSound 
} from '../utils/audioCues';
import { TerminalThemeSelector } from './TerminalThemeSelector';
import { TerminalTheme, TERMINAL_THEMES, DEFAULT_TERMINAL_THEME } from '../data/terminalThemes';
import { STORAGE_KEYS } from '../data/appConfig';
import { getBookmarks } from '../utils/bookmarkManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'midnight' | 'deep-slate';
  onToggleTheme: () => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  isFocusMode,
  onToggleFocusMode,
}) => {
  const [audioSettings, setAudioSettings] = useState(() => getAudioSettings());
  const [testedSound, setTestedSound] = useState<string | null>(null);
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TERMINAL_THEME);
      if (saved) {
        const found = TERMINAL_THEMES.find((t) => t.id === saved);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return DEFAULT_TERMINAL_THEME;
  });

  const [bookmarkCount, setBookmarkCount] = useState<number>(() => getBookmarks().length);

  useEffect(() => {
    const handleAudioUpdate = () => {
      setAudioSettings(getAudioSettings());
    };
    const handleBookmarkUpdate = () => {
      setBookmarkCount(getBookmarks().length);
    };

    window.addEventListener('audio-settings-changed', handleAudioUpdate);
    window.addEventListener('bookmarks-updated', handleBookmarkUpdate);
    return () => {
      window.removeEventListener('audio-settings-changed', handleAudioUpdate);
      window.removeEventListener('bookmarks-updated', handleBookmarkUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const handleToggleMasterAudio = () => {
    const nextMaster = !audioSettings.master;
    updateAudioSettings({ master: nextMaster });
    setAudioSettings((prev) => ({ ...prev, master: nextMaster }));
  };

  const handleToggleCompletionCues = () => {
    const nextCompletion = !audioSettings.completion;
    updateAudioSettings({ completion: nextCompletion });
    setAudioSettings((prev) => ({ ...prev, completion: nextCompletion }));
  };

  const handleToggleTimerAlerts = () => {
    const nextTimer = !audioSettings.timerAlerts;
    updateAudioSettings({ timerAlerts: nextTimer });
    setAudioSettings((prev) => ({ ...prev, timerAlerts: nextTimer }));
  };

  const handleSelectTerminalTheme = (themeItem: TerminalTheme) => {
    setTerminalTheme(themeItem);
    try {
      localStorage.setItem(STORAGE_KEYS.TERMINAL_THEME, themeItem.id);
    } catch {
      // ignore
    }
  };

  const testSound = (soundType: 'completion' | 'fanfare' | 'timer' | 'flag') => {
    setTestedSound(soundType);
    if (soundType === 'completion') {
      playFlashcardSuccessSound(true);
    } else if (soundType === 'fanfare') {
      playDeckMasteredFanfare(true);
    } else if (soundType === 'timer') {
      playTimerCompleteSound(true);
    } else if (soundType === 'flag') {
      playFlagCapturedSound(true);
    }
    setTimeout(() => setTestedSound(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="settings-modal"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">App Settings & Audio Controls</h2>
              <p className="text-xs text-slate-400">Configure global sounds, study environment, and interface defaults</p>
            </div>
          </div>
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Audio Cues & Sound Effects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Procedural Audio Cues & Sound Alerts</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synthesized via in-browser Web Audio API at safe acoustic decibels. Operates independently of system volume.
                </p>
              </div>

              {/* Master Audio Toggle */}
              <button
                id="btn-toggle-master-audio"
                type="button"
                onClick={handleToggleMasterAudio}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  audioSettings.master
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {audioSettings.master ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Audio Active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Audio Muted</span>
                  </>
                )}
              </button>
            </div>

            {/* Individual Sound Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Completion Cues */}
              <div className={`p-4 rounded-xl border transition-all ${
                audioSettings.master && audioSettings.completion
                  ? 'bg-slate-950/70 border-emerald-500/30 ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/40 border-slate-800 opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {audioSettings.master && audioSettings.completion ? (
                      <Bell className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <BellOff className="w-4 h-4 text-slate-500" />
                    )}
                    <span className="text-xs font-bold text-slate-200">Completion Cues</span>
                  </div>

                  <button
                    id="toggle-completion-cues"
                    type="button"
                    onClick={handleToggleCompletionCues}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                      audioSettings.completion ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        audioSettings.completion ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Plays uplifting chimes when mastering flashcards, domain milestones, and capturing flags in labs.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => testSound('completion')}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Play className="w-2.5 h-2.5 text-emerald-400" />
                    <span>{testedSound === 'completion' ? 'Playing...' : 'Test Chime'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => testSound('fanfare')}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Play className="w-2.5 h-2.5 text-teal-400" />
                    <span>{testedSound === 'fanfare' ? 'Playing...' : 'Test Fanfare'}</span>
                  </button>
                </div>
              </div>

              {/* Timer Alerts */}
              <div className={`p-4 rounded-xl border transition-all ${
                audioSettings.master && audioSettings.timerAlerts
                  ? 'bg-slate-950/70 border-emerald-500/30 ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/40 border-slate-800 opacity-70'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-slate-200">Timer Alerts</span>
                  </div>

                  <button
                    id="toggle-timer-alerts"
                    type="button"
                    onClick={handleToggleTimerAlerts}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                      audioSettings.timerAlerts ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        audioSettings.timerAlerts ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Plays dual-tone resonant bells when Pomodoro intervals, study sessions, or 6-hour test timers conclude.
                </p>
                <button
                  type="button"
                  onClick={() => testSound('timer')}
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <Play className="w-2.5 h-2.5 text-teal-400" />
                  <span>{testedSound === 'timer' ? 'Playing...' : 'Test Alert Bell'}</span>
                </button>
              </div>
            </div>

            {!audioSettings.master && (
              <p className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                ⚠️ All procedural sound cues are currently muted. You can unmute them anytime using the toggle above or the speaker button in the top navbar.
              </p>
            )}
          </div>

          <hr className="border-slate-800" />

          {/* Section 2: Study Environment & Focus Mode */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Study Session Environment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Focus Mode Preference */}
              {onToggleFocusMode && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Distraction-Free Focus Mode</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Hides headers, footers & non-essential UI. Shortcut: Press <kbd className="font-mono text-emerald-300">F</kbd>.
                    </p>
                  </div>
                  <button
                    id="btn-settings-toggle-focus"
                    type="button"
                    onClick={onToggleFocusMode}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                      isFocusMode
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {isFocusMode ? 'Active' : 'Enable'}
                  </button>
                </div>
              )}

              {/* Theme Preference */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    {theme === 'midnight' ? (
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>Visual Contrast Theme</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Currently using <strong>{theme === 'midnight' ? 'Midnight (OLED Dark)' : 'Deep Slate (Eye-Care)'}</strong>.
                  </p>
                </div>
                <button
                  id="btn-settings-toggle-theme"
                  type="button"
                  onClick={onToggleTheme}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Switch Theme
                </button>
              </div>
            </div>

            {/* Terminal Theme Selector */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">CLI Simulator Color Scheme:</span>
                <TerminalThemeSelector
                  currentThemeId={terminalTheme.id}
                  onSelectTheme={handleSelectTerminalTheme}
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Section 3: Data & Storage Quick Info */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                You have <strong>{bookmarkCount}</strong> saved study {bookmarkCount === 1 ? 'bookmark' : 'bookmarks'}.
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">Local Persistence Active</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
