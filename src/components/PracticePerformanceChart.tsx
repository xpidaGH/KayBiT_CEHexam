import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  PlusCircle,
  Calendar,
  Sparkles,
  BarChart2,
  ShieldCheck,
  Target
} from 'lucide-react';
import { STORAGE_KEYS } from '../data/appConfig';
import { playFlashcardSuccessSound, playTimerCompleteSound } from '../utils/audioCues';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';

export interface TestAttempt {
  id: string;
  date: string;
  fullDate: string;
  timestamp: number;
  title: string;
  mode: 'practical' | 'written';
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  durationMinutes: number;
}

const DEFAULT_BASELINE_ATTEMPTS: TestAttempt[] = [
  {
    id: 'att-1',
    date: 'Aug 24',
    fullDate: '2026-08-24 14:30',
    timestamp: 1787600000000,
    title: 'Diagnostic Baseline Mock',
    mode: 'practical',
    score: 9,
    maxScore: 20,
    percentage: 45,
    passed: false,
    durationMinutes: 240
  },
  {
    id: 'att-2',
    date: 'Aug 29',
    fullDate: '2026-08-29 16:00',
    timestamp: 1788000000000,
    title: 'Written Domain Quiz Drill',
    mode: 'written',
    score: 12,
    maxScore: 20,
    percentage: 60,
    passed: false,
    durationMinutes: 45
  },
  {
    id: 'att-3',
    date: 'Sep 03',
    fullDate: '2026-09-03 11:20',
    timestamp: 1788400000000,
    title: 'Pillar 1 & 2 Timed Sprint',
    mode: 'practical',
    score: 13,
    maxScore: 20,
    percentage: 65,
    passed: false,
    durationMinutes: 180
  },
  {
    id: 'att-4',
    date: 'Sep 08',
    fullDate: '2026-09-08 15:40',
    timestamp: 1788800000000,
    title: '6-Hour Full Simulation #1',
    mode: 'practical',
    score: 15,
    maxScore: 20,
    percentage: 75,
    passed: true,
    durationMinutes: 310
  },
  {
    id: 'att-5',
    date: 'Sep 12',
    fullDate: '2026-09-12 18:00',
    timestamp: 1789200000000,
    title: 'Advanced Exploits & Flags Drill',
    mode: 'practical',
    score: 17,
    maxScore: 20,
    percentage: 85,
    passed: true,
    durationMinutes: 220
  }
];

interface PracticePerformanceChartProps {
  currentSolvedFlags?: number;
  currentWrittenScore?: number;
  onRecordCurrentScore?: () => void;
}

export const PracticePerformanceChart: React.FC<PracticePerformanceChartProps> = ({
  currentSolvedFlags = 0,
  currentWrittenScore = 0
}) => {
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEST_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_BASELINE_ATTEMPTS;
  });

  const [viewTab, setViewTab] = useState<'trend' | 'domains'>('trend');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEST_HISTORY, JSON.stringify(attempts));
    } catch {
      // ignore
    }
  }, [attempts]);

  // Record active practical simulator score
  const handleLogCurrentAttempt = (mode: 'practical' | 'written') => {
    const isPractical = mode === 'practical';
    const score = isPractical ? currentSolvedFlags : currentWrittenScore;
    const maxScore = isPractical ? 20 : 15;
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 70;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const fullDateStr = now.toISOString().replace('T', ' ').substring(0, 16);

    const newAttempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      date: dateStr,
      fullDate: fullDateStr,
      timestamp: Date.now(),
      title: isPractical
        ? `Practical Simulation (${score}/20 Flags)`
        : `Written Quiz (${score}/${maxScore} Qs)`,
      mode,
      score,
      maxScore,
      percentage,
      passed,
      durationMinutes: isPractical ? 180 : 30
    };

    setAttempts((prev) => [...prev, newAttempt]);
    triggerAutoSaveToast(`Logged Test Score (${percentage}%)`);
    playFlashcardSuccessSound();
  };

  const handleResetAttempts = () => {
    setAttempts(DEFAULT_BASELINE_ATTEMPTS);
    triggerAutoSaveToast('Reset to Standard Learning Curve');
  };

  // KPI Calculations
  const totalAttempts = attempts.length;
  const passedCount = attempts.filter((a) => a.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
  const highestScore = totalAttempts > 0 ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const averageScore =
    totalAttempts > 0
      ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts)
      : 0;

  // Domain breakdown mock distribution for second chart view
  const domainBreakdownData = useMemo(() => [
    { domain: 'Network Recon', mastery: 88, threshold: 70 },
    { domain: 'Scanning & Enum', mastery: 82, threshold: 70 },
    { domain: 'SQLi & Web App', mastery: 74, threshold: 70 },
    { domain: 'Password Cracking', mastery: 85, threshold: 70 },
    { domain: 'Forensics & Stego', mastery: 68, threshold: 70 }
  ], []);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TestAttempt;
      return (
        <div className="p-3 rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl text-xs font-mono space-y-1 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1">
            <span className="font-bold text-slate-200">{data.title || label}</span>
            <span className="text-[10px] text-slate-400">{data.date}</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-slate-400">Score:</span>
            <span className="font-bold text-emerald-400">
              {data.score} / {data.maxScore} ({data.percentage}%)
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">Status:</span>
            <span
              className={`font-bold ${data.passed ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {data.passed ? 'PASSED (≥70%)' : 'NEEDS REVIEW (<70%)'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Performance Analytics & Historical Progression
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Practice Test Score Trajectory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track exam readiness over time against EC-Council's mandatory 70% passing threshold.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Chart View Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewTab('trend')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                viewTab === 'trend'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Score Over Time</span>
            </button>

            <button
              onClick={() => setViewTab('domains')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                viewTab === 'domains'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Domain Breakdown</span>
            </button>
          </div>

          {/* Log Active Score Quick Button */}
          <button
            onClick={() => handleLogCurrentAttempt('practical')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 text-xs font-semibold transition-all"
            title="Log current 20-challenge practical score to historical timeline"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Practical Run ({currentSolvedFlags}/20)</span>
          </button>

          {/* Reset Baseline */}
          <button
            onClick={handleResetAttempts}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Reset history to standard learning curve"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Highest Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-black text-emerald-400">{highestScore}%</div>
          <p className="text-[11px] text-slate-500">Peak mock score achieved</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Score</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-mono font-black text-cyan-300">{averageScore}%</div>
          <p className="text-[11px] text-slate-500">Across {totalAttempts} test attempts</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Passing Benchmark</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-black text-slate-100">70%</div>
          <p className="text-[11px] text-slate-500">14 / 20 Flags required</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-mono font-black text-teal-300">{passRate}%</div>
          <p className="text-[11px] text-slate-500">{passedCount} of {totalAttempts} passed</p>
        </div>
      </div>

      {/* Primary Recharts Visualization */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {viewTab === 'trend'
                ? 'Historical Percentage Trajectory (Over Time)'
                : 'Domain Proficiency vs 70% Exam Requirement'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Your Score</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 bg-amber-400 border border-amber-400 border-dashed"></span>
              <span>70% Passing Line</span>
            </span>
          </div>
        </div>

        <div className="w-full h-72">
          {viewTab === 'trend' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={attempts}
                margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={70}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: '70% Passing Threshold',
                    fill: '#fbbf24',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                  activeDot={{ r: 6, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={domainBreakdownData}
                margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis
                  dataKey="domain"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#475569' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  formatter={(val: number | string | undefined) => [`${val}%`, 'Mastery Score']}
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: '70% Passing Target',
                    fill: '#fbbf24',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }}
                />
                <Bar dataKey="mastery" radius={[6, 6, 0, 0]}>
                  {domainBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.mastery >= 70 ? '#10b981' : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
