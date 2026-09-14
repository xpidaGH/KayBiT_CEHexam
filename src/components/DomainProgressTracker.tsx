import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  FlaskConical, 
  BookOpen, 
  RotateCcw, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  FileText,
  Activity,
  Flame
} from 'lucide-react';
import { EXAM_DOMAINS_PROGRESS } from '../data/progressData';
import { ExamDomainProgress, DomainTaskItem } from '../types';
import { STORAGE_KEYS } from '../data/appConfig';
import { CircularProgressRing } from './CircularProgressRing';
import { DomainStudyGoalsTracker } from './DomainStudyGoalsTracker';
import { PerformanceHeatmapDashboard } from './PerformanceHeatmapDashboard';
import { exportProgressAndBookmarksMarkdown } from '../utils/exportMarkdownReport';

export const DomainProgressTracker: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<'domains' | 'heatmap'>('domains');

  // --- Persistent Storage State ---
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOMAIN_PROGRESS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOMAIN_PROGRESS, JSON.stringify(completedTasks));
  }, [completedTasks]);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'high-weight' | 'in-progress' | 'completed'>('all');
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({
    'domain-2': true,
    'domain-3': true,
    'domain-5': true,
  });
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const toggleDomainAll = (domain: ExamDomainProgress) => {
    const allDone = domain.tasks.every((t) => completedTasks[t.id]);
    const updated = { ...completedTasks };
    domain.tasks.forEach((t) => {
      updated[t.id] = !allDone;
    });
    setCompletedTasks(updated);
    showNotification(allDone ? `Cleared all tasks in Domain ${domain.domainNumber}` : `Marked all tasks complete in Domain ${domain.domainNumber}`);
  };

  const toggleExpand = (domainId: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  // --- Calculations & Weighted Metrics ---
  const totalTasksCount = useMemo(() => {
    return EXAM_DOMAINS_PROGRESS.reduce((acc, d) => acc + d.tasks.length, 0);
  }, []);

  const totalCompletedTasksCount = useMemo(() => {
    return Object.values(completedTasks).filter(Boolean).length;
  }, [completedTasks]);

  const labStats = useMemo(() => {
    let totalLabs = 0;
    let completedLabs = 0;
    EXAM_DOMAINS_PROGRESS.forEach((d) => {
      d.tasks.forEach((t) => {
        if (t.type === 'lab') {
          totalLabs++;
          if (completedTasks[t.id]) completedLabs++;
        }
      });
    });
    return { totalLabs, completedLabs, percent: totalLabs ? Math.round((completedLabs / totalLabs) * 100) : 0 };
  }, [completedTasks]);

  const noteStats = useMemo(() => {
    let totalNotes = 0;
    let completedNotes = 0;
    EXAM_DOMAINS_PROGRESS.forEach((d) => {
      d.tasks.forEach((t) => {
        if (t.type === 'note') {
          totalNotes++;
          if (completedTasks[t.id]) completedNotes++;
        }
      });
    });
    return { totalNotes, completedNotes, percent: totalNotes ? Math.round((completedNotes / totalNotes) * 100) : 0 };
  }, [completedTasks]);

  // Weighted score based on blueprint percentages
  const overallWeightedScore = useMemo(() => {
    let weightedSum = 0;
    let totalWeight = 0;

    EXAM_DOMAINS_PROGRESS.forEach((d) => {
      const completedInDomain = d.tasks.filter((t) => completedTasks[t.id]).length;
      const domainRatio = d.tasks.length > 0 ? completedInDomain / d.tasks.length : 0;
      weightedSum += domainRatio * d.blueprintWeight;
      totalWeight += d.blueprintWeight;
    });

    return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;
  }, [completedTasks]);

  // Overall readiness status
  const readinessTier = useMemo(() => {
    if (overallWeightedScore >= 85) return { label: 'Exam Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' };
    if (overallWeightedScore >= 65) return { label: 'Solid Foundation', color: 'text-teal-400', bg: 'bg-teal-500/20 border-teal-500/40' };
    if (overallWeightedScore >= 35) return { label: 'In Progress', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40' };
    return { label: 'Getting Started', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' };
  }, [overallWeightedScore]);

  // Reset Progress
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all tracked progress for exam domains, labs, and notes?')) {
      setCompletedTasks({});
      showNotification('All progress has been reset.');
    }
  };

  // Export Progress JSON
  const handleExportProgress = () => {
    const dataStr = JSON.stringify({
      exportDate: new Date().toISOString(),
      weightedScore: overallWeightedScore,
      completedTasks,
    }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KayBiT_CEH_Domain_Progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Progress report exported as JSON.');
  };

  // Import Progress JSON
  const handleImportProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed.completedTasks === 'object') {
          setCompletedTasks(parsed.completedTasks);
          showNotification('Progress successfully imported!');
        } else {
          alert('Invalid progress report file format.');
        }
      } catch {
        alert('Failed to parse progress file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered Domains
  const filteredDomains = useMemo(() => {
    return EXAM_DOMAINS_PROGRESS.filter((domain) => {
      // Search matches
      const matchesSearch =
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.tasks.some(
          (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

      if (!matchesSearch) return false;

      const completedCount = domain.tasks.filter((t) => completedTasks[t.id]).length;
      const isComplete = completedCount === domain.tasks.length;
      const isInProgress = completedCount > 0 && !isComplete;

      if (filterMode === 'high-weight') return domain.blueprintWeight >= 14;
      if (filterMode === 'in-progress') return isInProgress;
      if (filterMode === 'completed') return isComplete;
      return true;
    });
  }, [searchQuery, filterMode, completedTasks]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/50 shadow-xl shadow-slate-950 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top View Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            id="subview-domains"
            onClick={() => setActiveSubView('domains')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubView === 'domains'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Blueprint Domains & Objectives (9 Domains)</span>
          </button>

          <button
            id="subview-heatmap"
            onClick={() => setActiveSubView('heatmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubView === 'heatmap'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Performance Heatmap & AI Smart Quiz</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              New
            </span>
          </button>
        </div>

        {/* Quick Markdown Export */}
        <button
          id="btn-export-markdown-summary"
          onClick={exportProgressAndBookmarksMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          title="Download your full study progress and all bookmarks as Markdown (.md)"
        >
          <FileText className="w-3.5 h-3.5 text-teal-400" />
          <span>Export Markdown Report (.md)</span>
        </button>
      </div>

      {activeSubView === 'heatmap' ? (
        <PerformanceHeatmapDashboard />
      ) : (
        <>
          {/* Hero Master Circular Progress Ring Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left info */}
              <div className="space-y-3 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  CEH v13 Blueprint Mastery Engine
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Exam Domain Progress & Lab Tracker
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Track your hands-on penetration testing labs, GitHub cheat sheets, and conceptual study notes 
                  across all 9 official CEH blueprint domains. Stored in your local storage for 100% offline study continuity.
                </p>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                  <button
                    id="btn-export-progress"
                    onClick={handleExportProgress}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                    title="Save backup of your progress to a JSON file"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    id="btn-export-markdown-action"
                    onClick={exportProgressAndBookmarksMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                    title="Download human-readable markdown revision report"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-400" />
                    <span>Export Markdown (.md)</span>
                  </button>

                  <label
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                    title="Restore progress from a previously saved JSON backup"
                  >
                    <Upload className="w-3.5 h-3.5 text-teal-400" />
                    <span>Import JSON</span>
                    <input type="file" accept=".json" onChange={handleImportProgress} className="hidden" />
                  </label>

                  <button
                    id="btn-reset-progress"
                    onClick={handleResetProgress}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-red-950/40 text-xs font-medium text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-900/50 transition-colors"
                    title="Reset all completed tasks"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

          {/* Center-Right: Large Master Circular Progress Ring */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shrink-0">
            <div className="flex flex-col items-center">
              <CircularProgressRing
                percentage={overallWeightedScore}
                size={160}
                strokeWidth={12}
                color="#10b981"
                trackColor="#1e293b"
                showLabel={true}
                label="Weighted Score"
                sublabel={`${totalCompletedTasksCount}/${totalTasksCount} Completed`}
              />
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="space-y-2.5 min-w-[170px]">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 font-medium">Readiness:</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${readinessTier.bg} ${readinessTier.color}`}>
                  {readinessTier.label}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Labs Done:</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {labStats.completedLabs} / {labStats.totalLabs}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${labStats.percent}%` }}></div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                    <span>Notes Reviewed:</span>
                  </span>
                  <span className="font-mono font-bold text-teal-400">
                    {noteStats.completedNotes} / {noteStats.totalNotes}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${noteStats.percent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CEH Daily & Weekly Study Goals Visualization */}
      <DomainStudyGoalsTracker completedTasks={completedTasks} />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-domain-search"
            type="text"
            placeholder="Search domain concepts, labs, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Filter:</span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            All 9 Domains
          </button>

          <button
            onClick={() => setFilterMode('high-weight')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterMode === 'high-weight'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            High Weight (≥14%)
          </button>

          <button
            onClick={() => setFilterMode('in-progress')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterMode === 'in-progress'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            In Progress
          </button>

          <button
            onClick={() => setFilterMode('completed')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterMode === 'completed'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDomains.map((domain) => {
          const completedInDomain = domain.tasks.filter((t) => completedTasks[t.id]).length;
          const domainPercent = domain.tasks.length > 0 ? Math.round((completedInDomain / domain.tasks.length) * 100) : 0;
          const isDomainComplete = domainPercent === 100;
          const isExpanded = !!expandedDomains[domain.id];

          return (
            <div
              key={domain.id}
              id={`card-${domain.id}`}
              className={`rounded-2xl border transition-all flex flex-col justify-between ${
                isDomainComplete
                  ? 'bg-slate-900/95 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.22)] ring-1 ring-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header with Circular Progress Ring */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        Domain {domain.domainNumber}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {domain.blueprintWeight}% Exam Weight
                      </span>
                      {isDomainComplete && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          100% Mastered
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {domain.name}
                    </h3>
                  </div>

                  {/* Individual Domain Circular Progress Ring */}
                  <div className="shrink-0">
                    <CircularProgressRing
                      percentage={domainPercent}
                      size={64}
                      strokeWidth={6}
                      color={domain.color}
                      trackColor="#0f172a"
                      showLabel={true}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {domain.summary}
                </p>

                {/* Progress Mini Summary */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">
                    Completed: <strong className="text-white font-mono">{completedInDomain}</strong> / {domain.tasks.length}
                  </span>

                  <button
                    onClick={() => toggleDomainAll(domain)}
                    className="text-[11px] font-medium text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    {isDomainComplete ? 'Clear All' : 'Mark All Done'}
                  </button>
                </div>
              </div>

              {/* Tasks List (Expandable) */}
              <div className="border-t border-slate-800/80 bg-slate-950/60 rounded-b-2xl">
                <button
                  onClick={() => toggleExpand(domain.id)}
                  className="w-full px-5 py-2.5 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span className="font-medium">
                    {isExpanded ? 'Hide' : 'Show'} Labs & Notes ({domain.tasks.length} Items)
                  </span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {domain.tasks.map((task: DomainTaskItem) => {
                      const isTaskDone = !!completedTasks[task.id];

                      return (
                        <div
                          key={task.id}
                          id={`task-item-${task.id}`}
                          onClick={() => toggleTask(task.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                            isTaskDone
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="pt-0.5 shrink-0">
                            {isTaskDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {task.type === 'lab' ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  <FlaskConical className="w-2.5 h-2.5" />
                                  LAB
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                                  <BookOpen className="w-2.5 h-2.5" />
                                  NOTE
                                </span>
                              )}
                              <h4 className={`text-xs font-semibold truncate ${isTaskDone ? 'text-emerald-200 line-through opacity-80' : 'text-slate-200'}`}>
                                {task.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};
