import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Coffee, 
  Settings, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  SkipForward, 
  CheckCircle2, 
  X, 
  Clock, 
  Target, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { PomodoroTimerMode, PomodoroSettings } from '../types';
import { 
  PomodoroState, 
  getSavedPomodoroState, 
  savePomodoroState, 
  getDurationForMode 
} from '../utils/pomodoroManager';
import { playTimerCompleteSound } from '../utils/audioCues';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';

interface PomodoroStudyWidgetProps {
  onOpenSettingsModal?: () => void;
}

export const PomodoroStudyWidget: React.FC<PomodoroStudyWidgetProps> = () => {
  const [state, setState] = useState<PomodoroState>(() => getSavedPomodoroState());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isFloatingMinimized, setIsFloatingMinimized] = useState<boolean>(() => {
    return localStorage.getItem('kaybit_ceh_pomodoro_minimized') === 'true';
  });

  // Track state changes across tabs or windows
  useEffect(() => {
    const handleStateChange = (e: CustomEvent<PomodoroState>) => {
      setState(e.detail);
    };

    window.addEventListener('pomodoro-state-changed' as any, handleStateChange);
    return () => window.removeEventListener('pomodoro-state-changed' as any, handleStateChange);
  }, []);

  // Save minimized state
  useEffect(() => {
    localStorage.setItem('kaybit_ceh_pomodoro_minimized', String(isFloatingMinimized));
  }, [isFloatingMinimized]);

  // Main tick interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => {
          if (!prev.isRunning) return prev;
          const nextTime = Math.max(0, prev.timeLeft - 1);

          if (nextTime === 0) {
            // Timer finished!
            if (prev.settings.soundEnabled) {
              playTimerCompleteSound();
            }

            let nextMode: PomodoroTimerMode = 'focus';
            let nextCompleted = prev.settings.completedSessions;
            let nextTotalMinutes = prev.settings.totalMinutesStudied;

            if (prev.mode === 'focus') {
              nextCompleted += 1;
              nextTotalMinutes += prev.settings.focusDurationMinutes;
              triggerAutoSaveToast(`Pomodoro #${nextCompleted} Completed! Great focus session.`);

              // Check if long break interval is reached
              if (nextCompleted % prev.settings.longBreakInterval === 0) {
                nextMode = 'long-break';
              } else {
                nextMode = 'short-break';
              }
            } else {
              nextMode = 'focus';
              triggerAutoSaveToast('Break completed! Ready for the next focus sprint.');
            }

            const nextDuration = getDurationForMode(nextMode, prev.settings);
            const willAutoStart = nextMode === 'focus' ? prev.settings.autoStartPomodoros : prev.settings.autoStartBreaks;

            const nextState: PomodoroState = {
              mode: nextMode,
              timeLeft: nextDuration,
              isRunning: willAutoStart,
              targetEndTime: willAutoStart ? Date.now() + nextDuration * 1000 : null,
              settings: {
                ...prev.settings,
                completedSessions: nextCompleted,
                totalMinutesStudied: nextTotalMinutes,
              },
            };

            savePomodoroState(nextState);
            return nextState;
          }

          const updated: PomodoroState = {
            ...prev,
            timeLeft: nextTime,
          };
          // Persist every 5 ticks to avoid thrashing
          if (nextTime % 5 === 0) {
            savePomodoroState(updated);
          }
          return updated;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.timeLeft]);

  const handleTogglePlay = () => {
    setState(prev => {
      const willRun = !prev.isRunning;
      const targetEndTime = willRun ? Date.now() + prev.timeLeft * 1000 : null;
      const updated: PomodoroState = {
        ...prev,
        isRunning: willRun,
        targetEndTime,
      };
      savePomodoroState(updated);
      return updated;
    });
  };

  const handleReset = () => {
    const duration = getDurationForMode(state.mode, state.settings);
    const updated: PomodoroState = {
      ...state,
      timeLeft: duration,
      isRunning: false,
      targetEndTime: null,
    };
    setState(updated);
    savePomodoroState(updated);
  };

  const handleSkipNext = () => {
    let nextMode: PomodoroTimerMode = 'focus';
    if (state.mode === 'focus') {
      nextMode = (state.settings.completedSessions + 1) % state.settings.longBreakInterval === 0 ? 'long-break' : 'short-break';
    } else {
      nextMode = 'focus';
    }
    const nextDuration = getDurationForMode(nextMode, state.settings);
    const updated: PomodoroState = {
      ...state,
      mode: nextMode,
      timeLeft: nextDuration,
      isRunning: false,
      targetEndTime: null,
    };
    setState(updated);
    savePomodoroState(updated);
  };

  const handleAddFiveMinutes = () => {
    setState(prev => {
      const nextTime = prev.timeLeft + 5 * 60;
      const targetEndTime = prev.isRunning ? Date.now() + nextTime * 1000 : null;
      const updated: PomodoroState = {
        ...prev,
        timeLeft: nextTime,
        targetEndTime,
      };
      savePomodoroState(updated);
      triggerAutoSaveToast('+5 Minutes Added to Session!');
      return updated;
    });
  };

  const handleSwitchMode = (newMode: PomodoroTimerMode) => {
    const duration = getDurationForMode(newMode, state.settings);
    const updated: PomodoroState = {
      ...state,
      mode: newMode,
      timeLeft: duration,
      isRunning: false,
      targetEndTime: null,
    };
    setState(updated);
    savePomodoroState(updated);
  };

  const handleUpdateSettings = (partial: Partial<PomodoroSettings>) => {
    const newSettings = { ...state.settings, ...partial };
    const duration = getDurationForMode(state.mode, newSettings);
    const updated: PomodoroState = {
      ...state,
      timeLeft: state.isRunning ? state.timeLeft : duration,
      settings: newSettings,
    };
    setState(updated);
    savePomodoroState(updated);
    triggerAutoSaveToast('Study Timer settings updated!');
  };

  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalDuration = getDurationForMode(state.mode, state.settings);
  const progressPercent = Math.min(100, Math.round(((totalDuration - state.timeLeft) / totalDuration) * 100));

  return (
    <>
      {/* Floating Widget Container at bottom right */}
      <div 
        id="persistent-pomodoro-widget"
        className="fixed bottom-4 right-4 z-40 flex flex-col items-end"
      >
        {isFloatingMinimized ? (
          /* Minimized Pill View */
          <div 
            onClick={() => setIsFloatingMinimized(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer shadow-xl border backdrop-blur-md transition-all hover:scale-105 group ${
              state.isRunning
                ? 'bg-amber-500/90 text-slate-950 border-amber-400 font-bold ring-2 ring-amber-400/40 shadow-amber-500/20'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:border-emerald-500/50'
            }`}
            title="Click to expand Study Timer companion"
          >
            {state.mode === 'focus' ? (
              <Flame className={`w-4 h-4 ${state.isRunning ? 'text-slate-950 fill-current animate-pulse' : 'text-amber-400'}`} />
            ) : (
              <Coffee className="w-4 h-4 text-teal-400" />
            )}
            <span className="font-mono font-bold text-xs">{formattedTime}</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">
              ({state.mode === 'focus' ? 'Focus' : 'Break'})
            </span>
            <Maximize2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </div>
        ) : (
          /* Expanded Card View */
          <div className="w-72 sm:w-80 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-4 backdrop-blur-md text-slate-100 space-y-3">
            {/* Header with Title, Mode Badge & Minimize Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${state.mode === 'focus' ? 'bg-amber-500/20 text-amber-400' : 'bg-teal-500/20 text-teal-400'}`}>
                  {state.mode === 'focus' ? <Flame className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Study Timer</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-normal">
                      🍅 {state.settings.completedSessions}
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate max-w-[170px]" title={state.settings.activeTopic}>
                    {state.settings.activeTopic || 'Exam Prep'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsConfigOpen(prev => !prev)}
                  className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                    isConfigOpen ? 'text-emerald-400 bg-slate-800' : ''
                  }`}
                  title="Configure study intervals & sound"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsFloatingMinimized(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Minimize to corner pill"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl text-xs">
              <button
                onClick={() => handleSwitchMode('focus')}
                className={`py-1 rounded-lg font-medium transition-all text-[11px] ${
                  state.mode === 'focus'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Focus ({state.settings.focusDurationMinutes}m)
              </button>
              <button
                onClick={() => handleSwitchMode('short-break')}
                className={`py-1 rounded-lg font-medium transition-all text-[11px] ${
                  state.mode === 'short-break'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Short ({state.settings.shortBreakMinutes}m)
              </button>
              <button
                onClick={() => handleSwitchMode('long-break')}
                className={`py-1 rounded-lg font-medium transition-all text-[11px] ${
                  state.mode === 'long-break'
                    ? 'bg-indigo-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Long ({state.settings.longBreakMinutes}m)
              </button>
            </div>

            {/* Time Countdown & Circular Progress Bar */}
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="font-mono text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {formattedTime}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div 
                  className={`h-full transition-all duration-300 ${
                    state.mode === 'focus' ? 'bg-amber-400' : 'bg-teal-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-[10px] text-slate-400 px-1 font-mono">
                <span>{progressPercent}% passed</span>
                <span>{state.settings.totalMinutesStudied}m total today</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                id="btn-widget-pomodoro-play"
                onClick={handleTogglePlay}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  state.isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {state.isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>Start Session</span>
                  </>
                )}
              </button>

              <button
                onClick={handleAddFiveMinutes}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition-colors"
                title="Add 5 minutes to current timer"
              >
                +5m
              </button>

              <button
                onClick={handleSkipNext}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Skip to next session/break"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Reset timer to beginning"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick In-Widget Configuration Drawer */}
            {isConfigOpen && (
              <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Session Settings</span>
                  <button 
                    onClick={() => setIsConfigOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Focus Duration (minutes)</label>
                    <div className="flex gap-1">
                      {[15, 25, 45, 60].map(dur => (
                        <button
                          key={dur}
                          onClick={() => handleUpdateSettings({ focusDurationMinutes: dur })}
                          className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold border ${
                            state.settings.focusDurationMinutes === dur
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {dur}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Short Break (minutes)</label>
                    <div className="flex gap-1">
                      {[3, 5, 10].map(dur => (
                        <button
                          key={dur}
                          onClick={() => handleUpdateSettings({ shortBreakMinutes: dur })}
                          className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold border ${
                            state.settings.shortBreakMinutes === dur
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {dur}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-300">Completion Chime</span>
                    <button
                      onClick={() => handleUpdateSettings({ soundEnabled: !state.settings.soundEnabled })}
                      className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                        state.settings.soundEnabled
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {state.settings.soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      <span className="text-[10px]">{state.settings.soundEnabled ? 'Enabled' : 'Muted'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Active Study Topic</label>
                    <input
                      type="text"
                      value={state.settings.activeTopic || ''}
                      onChange={(e) => handleUpdateSettings({ activeTopic: e.target.value })}
                      placeholder="e.g. Nmap Flags & Wireshark..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
