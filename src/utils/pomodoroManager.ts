import { PomodoroSettings, PomodoroTimerMode } from '../types';
import { STORAGE_KEYS } from '../data/appConfig';
import { playTimerCompleteSound, isAudioCuesEnabled } from './audioCues';
import { triggerAutoSaveToast } from './autoSaveEvent';

export interface PomodoroState {
  mode: PomodoroTimerMode;
  timeLeft: number;
  isRunning: boolean;
  targetEndTime: number | null; // epoch timestamp when timer will hit 0
  settings: PomodoroSettings;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  completedSessions: 0,
  totalMinutesStudied: 0,
  activeTopic: 'CEH Domain Study & Practical Labs',
};

const POMODORO_STATE_KEY = 'kaybit_ceh_pomodoro_live_state';

// Load saved state or default
export function getSavedPomodoroState(): PomodoroState {
  try {
    const saved = localStorage.getItem(POMODORO_STATE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      let timeLeft = parsed.timeLeft;
      let isRunning = parsed.isRunning;

      // If timer was running, calculate actual elapsed time!
      if (isRunning && parsed.targetEndTime) {
        const remaining = Math.max(0, Math.round((parsed.targetEndTime - Date.now()) / 1000));
        timeLeft = remaining;
        if (remaining <= 0) {
          isRunning = false;
        }
      }

      return {
        mode: parsed.mode || 'focus',
        timeLeft: typeof timeLeft === 'number' ? timeLeft : 25 * 60,
        isRunning: isRunning || false,
        targetEndTime: isRunning ? parsed.targetEndTime : null,
        settings: {
          ...DEFAULT_SETTINGS,
          ...(parsed.settings || {}),
        },
      };
    }
  } catch {
    // ignore
  }

  return {
    mode: 'focus',
    timeLeft: DEFAULT_SETTINGS.focusDurationMinutes * 60,
    isRunning: false,
    targetEndTime: null,
    settings: DEFAULT_SETTINGS,
  };
}

export function savePomodoroState(state: PomodoroState): void {
  try {
    localStorage.setItem(POMODORO_STATE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('pomodoro-state-changed', { detail: state }));
  } catch {
    // ignore
  }
}

export function getDurationForMode(mode: PomodoroTimerMode, settings: PomodoroSettings): number {
  switch (mode) {
    case 'focus':
      return settings.focusDurationMinutes * 60;
    case 'short-break':
      return settings.shortBreakMinutes * 60;
    case 'long-break':
      return settings.longBreakMinutes * 60;
  }
}
