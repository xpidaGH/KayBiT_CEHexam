/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Minimize2, 
  Clock, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  ShieldCheck, 
  Lock, 
  PieChart, 
  CheckSquare, 
  Cpu, 
  Award, 
  Layers, 
  Bookmark, 
  Download,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { ExamTab } from '../types';
import { NAV_ITEMS_CONFIG } from '../data/appConfig';
import { isAudioCuesEnabled, setAudioCuesEnabled } from '../utils/audioCues';

interface FocusModeBarProps {
  activeTab: ExamTab;
  setActiveTab: (tab: ExamTab) => void;
  onExitFocusMode: () => void;
  onOpenSettings?: () => void;
}

export const FocusModeBar: React.FC<FocusModeBarProps> = ({
  activeTab,
  setActiveTab,
  onExitFocusMode,
  onOpenSettings,
}) => {
  // Focus Session Stopwatch
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => !isAudioCuesEnabled());

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    const handleAudioChange = () => {
      setIsAudioMuted(!isAudioCuesEnabled());
    };
    window.addEventListener('audio-cues-toggle', handleAudioChange);
    window.addEventListener('audio-settings-changed', handleAudioChange);
    return () => {
      window.removeEventListener('audio-cues-toggle', handleAudioChange);
      window.removeEventListener('audio-settings-changed', handleAudioChange);
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleToggleAudio = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    setAudioCuesEnabled(!nextState);
  };

  const getTabIcon = (id: ExamTab) => {
    switch (id) {
      case 'written':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'practical':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'darkweb':
        return <Lock className="w-3.5 h-3.5" />;
      case 'progress':
        return <PieChart className="w-3.5 h-3.5" />;
      case 'tools':
        return <CheckSquare className="w-3.5 h-3.5" />;
      case 'methodology':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'tests':
        return <Award className="w-3.5 h-3.5" />;
      case 'flashcards':
        return <Layers className="w-3.5 h-3.5" />;
      case 'bookmarks':
        return <Bookmark className="w-3.5 h-3.5" />;
      case 'installation':
        return <Download className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div 
      id="focus-mode-hud"
      className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/20 py-2 px-4 shadow-xl shadow-slate-950/60"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Mode Badge & Active View */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Focus Mode</span>
          </div>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            {NAV_ITEMS_CONFIG.find((i) => i.id === activeTab)?.label}
          </span>
        </div>

        {/* Center: Sleek Compact View Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {NAV_ITEMS_CONFIG.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`focus-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                }`}
                title={item.label}
              >
                {getTabIcon(item.id)}
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Stopwatch, Sound Toggle, Exit Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Stopwatch */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">{formatTime(secondsElapsed)}</span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-slate-400 hover:text-white p-0.5"
              title={isRunning ? 'Pause Focus Timer' : 'Resume Focus Timer'}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
            <button
              onClick={() => setSecondsElapsed(0)}
              className="text-slate-400 hover:text-white p-0.5"
              title="Reset Focus Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Sound Toggle */}
          <button
            id="btn-focus-audio-toggle"
            onClick={handleToggleAudio}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title={isAudioMuted ? 'Procedural Sound Effects Muted (Click to Unmute)' : 'Sound Effects Active (Click to Mute)'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>

          {/* Exit Focus Mode Button */}
          <button
            id="btn-exit-focus-mode"
            onClick={onExitFocusMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:text-white group"
            title="Exit Focus Mode (Press F or Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Exit Focus</span>
            <kbd className="hidden sm:inline text-[9px] font-mono bg-slate-900 text-slate-400 px-1 py-0.5 rounded border border-slate-700">
              F
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
};
