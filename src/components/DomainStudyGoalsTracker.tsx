import React, { useState, useEffect, useMemo } from 'react';
import { 
  Target, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Sliders, 
  Shield, 
  Clock,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';
import { EXAM_DOMAINS_PROGRESS } from '../data/progressData';
import { STORAGE_KEYS } from '../data/appConfig';
import { CircularProgressRing } from './CircularProgressRing';

export interface StudyGoalSettings {
  frequency: 'daily' | 'weekly';
  targetCount: number;
  targetDomainId: string; // 'all' or 'domain-1' .. 'domain-9'
}

const DEFAULT_GOAL: StudyGoalSettings = {
  frequency: 'daily',
  targetCount: 5,
  targetDomainId: 'all',
};

interface DomainStudyGoalsTrackerProps {
  completedTasks: Record<string, boolean>;
}

export const DomainStudyGoalsTracker: React.FC<DomainStudyGoalsTrackerProps> = ({
  completedTasks
}) => {
  // Goal Settings
  const [goal, setGoal] = useState<StudyGoalSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDY_GOALS);
      if (saved) {
        return { ...DEFAULT_GOAL, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_GOAL;
  });

  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

  // Sync goal settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_GOALS, JSON.stringify(goal));
    } catch {
      // ignore
    }
  }, [goal]);

  // Track task completion timestamps in localStorage so daily/weekly counts are accurate
  const [taskTimestamps, setTaskTimestamps] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('kaybit_ceh_task_timestamps');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // If no timestamps recorded yet, seed current completed tasks with current time
    const initial: Record<string, number> = {};
    const now = Date.now();
    Object.keys(completedTasks).forEach(taskId => {
      if (completedTasks[taskId]) {
        initial[taskId] = now;
      }
    });
    return initial;
  });

  // Whenever completedTasks changes, record timestamps for newly completed tasks
  useEffect(() => {
    const updated = { ...taskTimestamps };
    let changed = false;
    const now = Date.now();

    Object.keys(completedTasks).forEach(taskId => {
      if (completedTasks[taskId] && !updated[taskId]) {
        updated[taskId] = now;
        changed = true;
      } else if (!completedTasks[taskId] && updated[taskId]) {
        delete updated[taskId];
        changed = true;
      }
    });

    if (changed) {
      setTaskTimestamps(updated);
      try {
        localStorage.setItem('kaybit_ceh_task_timestamps', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  }, [completedTasks]);

  // Compute tasks completed in current period (today or this week)
  const currentPeriodStats = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Start of week (Monday)
    const dayOfWeek = now.getDay() || 7; // Sunday = 7
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (dayOfWeek - 1)).getTime();

    const threshold = goal.frequency === 'daily' ? startOfToday : startOfWeek;

    // Filter relevant task IDs based on targetDomainId
    const domainTaskIds = new Set<string>();
    EXAM_DOMAINS_PROGRESS.forEach(domain => {
      if (goal.targetDomainId === 'all' || domain.id === goal.targetDomainId) {
        domain.tasks.forEach(task => domainTaskIds.add(task.id));
      }
    });

    // Count completed tasks matching timeframe & domain criteria
    let count = 0;
    Object.keys(completedTasks).forEach(taskId => {
      if (completedTasks[taskId] && domainTaskIds.has(taskId)) {
        const completedTime = taskTimestamps[taskId];
        // If completed in this timeframe or fallback to active if timestamp is recent
        if (!completedTime || completedTime >= threshold) {
          count++;
        }
      }
    });

    const target = goal.targetCount;
    const percentage = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;
    const remaining = Math.max(0, target - count);
    const isCompleted = count >= target;

    return {
      count,
      target,
      percentage,
      remaining,
      isCompleted,
      periodLabel: goal.frequency === 'daily' ? 'Today' : 'This Week',
    };
  }, [completedTasks, taskTimestamps, goal]);

  const targetDomainName = useMemo(() => {
    if (goal.targetDomainId === 'all') return 'All 9 Blueprint Domains';
    const found = EXAM_DOMAINS_PROGRESS.find(d => d.id === goal.targetDomainId);
    return found ? `Domain ${found.domainNumber}: ${found.name}` : 'Selected Domain';
  }, [goal.targetDomainId]);

  return (
    <div 
      id="ceh-study-goals-container"
      className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Section: Goal Status & Metrics */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              CEH Study Goal & Velocity Tracker
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
              {goal.frequency === 'daily' ? 'Daily Goal' : 'Weekly Goal'}
            </span>
            {currentPeriodStats.isCompleted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Target Reached!
              </span>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{targetDomainName}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {currentPeriodStats.isCompleted ? (
                <span className="text-emerald-400 font-medium">
                  Outstanding job! You hit your goal of {goal.targetCount} tasks {currentPeriodStats.periodLabel.toLowerCase()}.
                </span>
              ) : (
                <span>
                  Completed <strong className="text-white font-mono">{currentPeriodStats.count}</strong> of{' '}
                  <strong className="text-indigo-400 font-mono">{goal.targetCount}</strong> tasks {currentPeriodStats.periodLabel.toLowerCase()} •{' '}
                  <span className="text-amber-300">{currentPeriodStats.remaining} remaining</span> to stay on pace.
                </span>
              )}
            </p>
          </div>

          {/* Quick Config Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id="btn-toggle-goal-config"
              onClick={() => setIsConfiguring(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isConfiguring ? 'Hide Goal Settings' : 'Customize Study Goal'}</span>
            </button>

            {/* Quick frequency toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setGoal(prev => ({ ...prev, frequency: 'daily', targetCount: prev.frequency === 'weekly' ? 5 : prev.targetCount }))}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  goal.frequency === 'daily'
                    ? 'bg-indigo-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setGoal(prev => ({ ...prev, frequency: 'weekly', targetCount: prev.frequency === 'daily' ? 20 : prev.targetCount }))}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  goal.frequency === 'weekly'
                    ? 'bg-indigo-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Progress Ring & Target Details */}
        <div className="flex items-center gap-6 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 shrink-0 w-full lg:w-auto justify-center sm:justify-start">
          <CircularProgressRing
            percentage={currentPeriodStats.percentage}
            size={110}
            strokeWidth={9}
            color={currentPeriodStats.isCompleted ? '#10b981' : '#6366f1'}
            trackColor="#1e293b"
            showLabel={true}
            label={goal.frequency === 'daily' ? 'Daily Goal' : 'Weekly Goal'}
            sublabel={`${currentPeriodStats.count}/${currentPeriodStats.target}`}
          />

          <div className="space-y-2 min-w-[140px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Pace Rate:</span>
              <span className={`font-mono font-bold ${currentPeriodStats.isCompleted ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {currentPeriodStats.percentage}%
              </span>
            </div>

            <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  currentPeriodStats.isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-teal-400'
                }`}
                style={{ width: `${currentPeriodStats.percentage}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="text-slate-300 font-semibold">{currentPeriodStats.remaining} tasks</span> left to target
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Goal Customization Drawer */}
      {isConfiguring && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in duration-200">
          {/* Target Domain Selector */}
          <div className="space-y-1.5">
            <label htmlFor="select-goal-domain" className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Exam Domain Focus:</span>
            </label>
            <select
              id="select-goal-domain"
              value={goal.targetDomainId}
              onChange={(e) => setGoal(prev => ({ ...prev, targetDomainId: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">★ All 9 CEH Blueprint Domains (Holistic Mastery)</option>
              {EXAM_DOMAINS_PROGRESS.map(domain => (
                <option key={domain.id} value={domain.id}>
                  Domain {domain.domainNumber}: {domain.name} ({domain.blueprintWeight}%)
                </option>
              ))}
            </select>
          </div>

          {/* Target Count Stepper & Presets */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Tasks Quota ({goal.frequency}):</span>
              </span>
              <span className="font-mono font-bold text-indigo-400 text-sm">
                {goal.targetCount} tasks
              </span>
            </label>

            <div className="flex items-center gap-2">
              <input
                id="slider-goal-target"
                type="range"
                min="1"
                max={goal.frequency === 'daily' ? 15 : 40}
                step="1"
                value={goal.targetCount}
                onChange={(e) => setGoal(prev => ({ ...prev, targetCount: parseInt(e.target.value, 10) }))}
                className="flex-1 h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              {/* Quick Presets */}
              <div className="flex items-center gap-1">
                {(goal.frequency === 'daily' ? [3, 5, 8, 10] : [10, 20, 30]).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGoal(prev => ({ ...prev, targetCount: num }))}
                    className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                      goal.targetCount === num
                        ? 'bg-indigo-500 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
