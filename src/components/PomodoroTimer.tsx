import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Coffee, 
  Flame, 
  Bell, 
  BellOff,
  ChevronDown
} from 'lucide-react';
import { STORAGE_KEYS } from '../data/appConfig';

type PomodoroMode = 'focus' | 'short-break' | 'long-break';

interface ModeConfig {
  id: PomodoroMode;
  label: string;
  durationSeconds: number;
  badge: string;
}

const MODES: ModeConfig[] = [
  { id: 'focus', label: '25m Focus', durationSeconds: 25 * 60, badge: 'Deep Work' },
  { id: 'short-break', label: '5m Break', durationSeconds: 5 * 60, badge: 'Short Rest' },
  { id: 'long-break', label: '15m Break', durationSeconds: 15 * 60, badge: 'Recharge' },
];

/**
 * Procedural harmonic audio chime via Web Audio API when session ends
 */
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Pleasant two-tone chime (D5: 587.33Hz, then A5: 880Hz)
    const tones = [587.33, 880];
    tones.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.18);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.18);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + index * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.18 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.18);
      osc.stop(ctx.currentTime + index * 0.18 + 0.85);
    });
  } catch {
    // AudioContext blocked or not supported
  }
}

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POMODORO_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.completedSessions === 'number' ? parsed.completedSessions : 0;
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync session counter to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POMODORO_SETTINGS, JSON.stringify({
        completedSessions,
        lastMode: mode,
      }));
    } catch {
      // ignore
    }
  }, [completedSessions, mode]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  // Main tick interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (soundEnabled) {
        playChime();
      }

      if (mode === 'focus') {
        setCompletedSessions(prev => prev + 1);
        // Prompt transition to short break
        setMode('short-break');
        setTimeLeft(5 * 60);
      } else {
        // Transition back to focus
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, soundEnabled]);

  const currentModeConfig = MODES.find(m => m.id === mode) || MODES[0];

  const handleToggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentModeConfig.durationSeconds);
  };

  const handleSwitchMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    const targetConfig = MODES.find(m => m.id === newMode) || MODES[0];
    setTimeLeft(targetConfig.durationSeconds);
    setIsDropdownOpen(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalDuration = currentModeConfig.durationSeconds;
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <div
      id="pomodoro-timer-footer"
      className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-xs shadow-lg backdrop-blur-md"
      role="region"
      aria-label="Pomodoro Study Timer"
    >
      {/* Play/Pause Button */}
      <div className="flex items-center gap-2">
        <button
          id="btn-toggle-pomodoro"
          onClick={handleToggleTimer}
          className={`flex items-center justify-center w-8 h-8 rounded-lg font-medium transition-all ${
            isRunning
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50 scale-105'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80'
          }`}
          title={isRunning ? 'Pause 25m Pomodoro' : 'Start 25m Focus Session'}
          aria-label={isRunning ? 'Pause Pomodoro timer' : 'Start Pomodoro timer'}
        >
          {isRunning ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Mode Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="btn-pomodoro-mode"
            type="button"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-950 text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-medium transition-all"
            aria-expanded={isDropdownOpen}
          >
            {mode === 'focus' ? (
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Coffee className="w-3.5 h-3.5 text-teal-400" />
            )}
            <span className="font-mono font-bold text-slate-100">{formattedTime}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">({currentModeConfig.badge})</span>
            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div 
              className="absolute bottom-full mb-2 left-0 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
              role="menu"
            >
              <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                <span>Timer Intervals</span>
                <span className="text-amber-400 flex items-center gap-1 font-normal font-mono">
                  <Flame className="w-3 h-3" /> {completedSessions} done
                </span>
              </div>
              <div className="space-y-1">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSwitchMode(m.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      mode === m.id
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {m.id === 'focus' ? <Flame className="w-3.5 h-3.5 text-amber-400" /> : <Coffee className="w-3.5 h-3.5 text-teal-400" />}
                      <span className="text-xs font-medium">{m.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{m.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar & Reset Button */}
      <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2">
        <button
          id="btn-reset-pomodoro"
          type="button"
          onClick={handleResetTimer}
          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reset timer to beginning"
          aria-label="Reset Pomodoro Timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Chime sound toggle */}
        <button
          id="btn-toggle-pomodoro-sound"
          type="button"
          onClick={() => setSoundEnabled(prev => !prev)}
          className={`p-1 rounded-md hover:bg-slate-800 transition-colors ${
            soundEnabled ? 'text-amber-400 hover:text-amber-300' : 'text-slate-500 hover:text-slate-400'
          }`}
          title={soundEnabled ? 'Completion chime enabled' : 'Completion chime muted'}
          aria-label={soundEnabled ? 'Completion chime enabled' : 'Completion chime muted'}
        >
          {soundEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
        </button>

        {/* Mini session badge */}
        <div 
          className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400"
          title="Completed focus sessions in this cycle"
        >
          <span className="text-amber-400 font-bold">🍅 {completedSessions}</span>
        </div>
      </div>
    </div>
  );
};
