import React, { useState, useEffect, useMemo } from 'react';
import { 
  FlaskConical, 
  BookOpen, 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  ShieldAlert, 
  Clock, 
  ChevronRight,
  Code2,
  CheckCircle2,
  Circle,
  PieChart,
  PenLine,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { LAB_ENVIRONMENTS, GITHUB_REPO_NOTES, VIDEO_COURSES } from '../data/cehWrittenData';
import { LabEnvironment, GitHubRepoNote, VideoCourse } from '../types';
import { STORAGE_KEYS } from '../data/appConfig';
import { CircularProgressRing } from './CircularProgressRing';
import { WrittenDomainScratchpad } from './WrittenDomainScratchpad';
import { isBookmarked, toggleBookmark } from '../utils/bookmarkManager';

interface WrittenExamViewProps {
  onNavigateToProgress?: () => void;
}

export const WrittenExamView: React.FC<WrittenExamViewProps> = ({ onNavigateToProgress }) => {
  const [subTab, setSubTab] = useState<'labs' | 'notes' | 'videos' | 'scratchpad'>('labs');
  const [selectedLab, setSelectedLab] = useState<LabEnvironment>(LAB_ENVIRONMENTS[0]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepoNote>(GITHUB_REPO_NOTES[0]);
  const [selectedVideo, setSelectedVideo] = useState<VideoCourse>(VIDEO_COURSES[0]);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [targetScratchpadDomain, setTargetScratchpadDomain] = useState<string>('domain-2');
  
  // Completed labs & notes tracking
  const [completedLabs, setCompletedLabs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_LABS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [completedNotes, setCompletedNotes] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [, setBookmarkTick] = useState(0);

  useEffect(() => {
    const handleBookmarkChange = () => setBookmarkTick((prev) => prev + 1);
    window.addEventListener('bookmarks-updated', handleBookmarkChange);
    return () => window.removeEventListener('bookmarks-updated', handleBookmarkChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LABS, JSON.stringify(completedLabs));
  }, [completedLabs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_NOTES, JSON.stringify(completedNotes));
  }, [completedNotes]);

  const toggleLabComplete = (labId: string) => {
    setCompletedLabs((prev) => ({
      ...prev,
      [labId]: !prev[labId],
    }));
  };

  const toggleNoteComplete = (noteId: string) => {
    setCompletedNotes((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  const labCompletedCount = useMemo(() => {
    return Object.values(completedLabs).filter(Boolean).length;
  }, [completedLabs]);

  const noteCompletedCount = useMemo(() => {
    return Object.values(completedNotes).filter(Boolean).length;
  }, [completedNotes]);

  const totalTrackableItems = LAB_ENVIRONMENTS.length + GITHUB_REPO_NOTES.length;
  const totalCompletedItems = labCompletedCount + noteCompletedCount;
  const overallWrittenPercent = totalTrackableItems > 0 
    ? Math.round((totalCompletedItems / totalTrackableItems) * 100) 
    : 0;

  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.WRITTEN_NOTES) || '';
  });

  const domainNotesCount = useMemo(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRITTEN_DOMAIN_NOTES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.values(parsed).filter((v: any) => typeof v === 'string' && v.trim().length > 0).length;
      }
    } catch {}
    return 0;
  }, [subTab]);

  const handleOpenDomainScratchpad = (domainId: string) => {
    setTargetScratchpadDomain(domainId);
    setSubTab('scratchpad');
  };

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleSaveNotes = (text: string) => {
    setStudentNotes(text);
    localStorage.setItem(STORAGE_KEYS.WRITTEN_NOTES, text);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner for Written Exam with Circular Progress Ring */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Component 1: CEH Written Exam Preparation
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Master the CEH Written Exam (Blueprint v13)
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Prepare for 125 multiple-choice questions across 9 core domains. Bridge conceptual theory with live 
              hands-on labs, community-vetted GitHub markdown repositories, and embedded long-form video walkthroughs.
            </p>
          </div>

          {/* Mini Circular Progress Ring Widget */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4 shrink-0">
            <CircularProgressRing
              percentage={overallWrittenPercent}
              size={84}
              strokeWidth={7}
              color="#10b981"
              trackColor="#1e293b"
              showLabel={true}
              sublabel="Labs & Notes"
            />
            <div className="space-y-1.5 text-xs">
              <span className="text-slate-400 block font-medium">Study Completion:</span>
              <p className="font-mono text-emerald-400 font-bold text-sm">
                {totalCompletedItems} / {totalTrackableItems} Finished
              </p>
              {onNavigateToProgress && (
                <button
                  id="btn-goto-domain-tracker"
                  onClick={onNavigateToProgress}
                  className="flex items-center gap-1 text-[11px] font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <PieChart className="w-3 h-3" />
                  <span>Domain Tracker &rarr;</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            id="subtab-labs"
            onClick={() => setSubTab('labs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'labs'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Hands-on Labs ({labCompletedCount}/{LAB_ENVIRONMENTS.length})</span>
          </button>

          <button
            id="subtab-notes"
            onClick={() => setSubTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'notes'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Text Notes & Repos ({noteCompletedCount}/{GITHUB_REPO_NOTES.length})</span>
          </button>

          <button
            id="subtab-videos"
            onClick={() => setSubTab('videos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'videos'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Video Courses & Player Applet</span>
          </button>

          <button
            id="subtab-scratchpad"
            onClick={() => setSubTab('scratchpad')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'scratchpad'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <PenLine className="w-4 h-4" />
            <span>Domain Scratchpad ({domainNotesCount}/9 Domains)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Hands-on Labs & Environments */}
      {subTab === 'labs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LAB_ENVIRONMENTS.map((lab) => {
              const isSelected = selectedLab.id === lab.id;
              const isDone = !!completedLabs[lab.id];
              return (
                <button
                  key={lab.id}
                  id={`lab-card-${lab.id}`}
                  onClick={() => setSelectedLab(lab)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {lab.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isDone && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Done
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {lab.difficulty}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1 line-clamp-1">{lab.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{lab.tag}</p>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Lab Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">{selectedLab.tag}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedLab.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  {selectedLab.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  id={`btn-lab-domain-notes-${selectedLab.id}`}
                  type="button"
                  onClick={() => {
                    const targetDomain = selectedLab.category === 'cisco' ? 'domain-4' : selectedLab.category === 'local' ? 'domain-5' : 'domain-2';
                    handleOpenDomainScratchpad(targetDomain);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                  title="Jot notes for this lab's domain in the Domain Scratchpad"
                >
                  <PenLine className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Jot Domain Notes</span>
                </button>

                <button
                  id={`btn-bookmark-lab-${selectedLab.id}`}
                  type="button"
                  onClick={() => {
                    toggleBookmark({
                      id: `lab-${selectedLab.id}`,
                      type: 'lab',
                      title: selectedLab.title,
                      category: 'Lab Environment',
                      sourceTab: 'written',
                      sourceSubTab: 'labs',
                      targetId: selectedLab.id,
                      description: selectedLab.description,
                      content: selectedLab.setupInstructions.join('\n'),
                      notes: selectedLab.architecture,
                      tags: [selectedLab.tag, selectedLab.difficulty, 'Lab Guide'],
                      createdAt: new Date().toISOString(),
                    });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    isBookmarked(`lab-${selectedLab.id}`)
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={isBookmarked(`lab-${selectedLab.id}`) ? 'Saved in My Bookmarks' : 'Bookmark this lab setup for quick access'}
                >
                  {isBookmarked(`lab-${selectedLab.id}`) ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bookmarked</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Bookmark Lab</span>
                    </>
                  )}
                </button>

                <button
                  id={`btn-toggle-lab-${selectedLab.id}`}
                  onClick={() => toggleLabComplete(selectedLab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    completedLabs[selectedLab.id]
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {completedLabs[selectedLab.id] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Lab Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark Lab Complete</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedLab.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                >
                  <span>Launch / Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Architecture breakdown */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Lab Architecture & Network Isolation Strategy:</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                {selectedLab.architecture}
              </p>
            </div>

            {/* Step-by-Step Setup */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step-by-Step Deployment & Configuration
              </h4>
              <div className="space-y-2">
                {selectedLab.setupInstructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-800/60">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Vulnerabilities Demonstrated */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Key Code & Protocol Flaws Demonstrated:</span>
                </div>
                <ul className="space-y-1.5">
                  {selectedLab.keyVulnerabilitiesDemonstrated.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Commands */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-2">
                  <Code2 className="w-4 h-4" />
                  <span>Essential Practice Commands:</span>
                </div>
                {selectedLab.recommendedCommands.map((cmd, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 group">
                    <code className="text-xs text-emerald-300 font-mono truncate mr-2">{cmd}</code>
                    <button
                      onClick={() => handleCopy(cmd)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                      title="Copy command"
                    >
                      {copiedCmd === cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Text Notes & GitHub Repositories */}
      {subTab === 'notes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GITHUB_REPO_NOTES.map((repo) => {
              const isSelected = selectedRepo.id === repo.id;
              const isDone = !!completedNotes[repo.id];
              return (
                <button
                  key={repo.id}
                  id={`repo-card-${repo.id}`}
                  onClick={() => setSelectedRepo(repo)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded">
                      GitHub Markdown
                    </span>
                    {isDone && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Reviewed
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">{repo.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{repo.focus}</p>
                </button>
              );
            })}
          </div>

          {/* Repo Detail Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-mono text-teal-400 uppercase tracking-wider">{selectedRepo.authorRepo}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedRepo.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  Focus: {selectedRepo.focus}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  id={`btn-repo-domain-notes-${selectedRepo.id}`}
                  type="button"
                  onClick={() => {
                    const targetDomain = selectedRepo.id === 'mr-infect' ? 'domain-2' : selectedRepo.id === 'phirojshah' ? 'domain-3' : 'domain-4';
                    handleOpenDomainScratchpad(targetDomain);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                  title="Jot domain notes for this repository topic in the Domain Scratchpad"
                >
                  <PenLine className="w-3.5 h-3.5 text-teal-400" />
                  <span>Jot Domain Notes</span>
                </button>

                <button
                  id={`btn-bookmark-note-${selectedRepo.id}`}
                  type="button"
                  onClick={() => {
                    toggleBookmark({
                      id: `note-${selectedRepo.id}`,
                      type: 'note',
                      title: selectedRepo.title,
                      category: 'Written Notes',
                      sourceTab: 'written',
                      sourceSubTab: 'notes',
                      targetId: selectedRepo.id,
                      description: selectedRepo.focus,
                      content: selectedRepo.cheatSheetPreview,
                      tags: [selectedRepo.authorRepo, 'CEH v13', 'Written Blueprint'],
                      createdAt: new Date().toISOString(),
                    });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    isBookmarked(`note-${selectedRepo.id}`)
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={isBookmarked(`note-${selectedRepo.id}`) ? 'Saved in My Bookmarks' : 'Bookmark this note for quick access'}
                >
                  {isBookmarked(`note-${selectedRepo.id}`) ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Bookmarked</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Bookmark Note</span>
                    </>
                  )}
                </button>

                <button
                  id={`btn-toggle-note-${selectedRepo.id}`}
                  onClick={() => toggleNoteComplete(selectedRepo.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    completedNotes[selectedRepo.id]
                      ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {completedNotes[selectedRepo.id] ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Notes Reviewed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mark Notes Reviewed</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedRepo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-medium transition-colors"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Highlights */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Key Blueprint Domain Highlights
              </h4>
              <ul className="space-y-2">
                {selectedRepo.highlights.map((item, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5">
                    <ChevronRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cheat Sheet Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Markdown Blueprint Snapshot
                </span>
                <button
                  onClick={() => handleCopy(selectedRepo.cheatSheetPreview)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                >
                  {copiedCmd === selectedRepo.cheatSheetPreview ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Cheat Sheet</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {selectedRepo.cheatSheetPreview}
              </pre>
            </div>

            {/* Sample Commands */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Syntax Quick-Hits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedRepo.sampleCommands.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">{item.desc}</p>
                      <code className="text-xs font-mono text-teal-300 break-all">{item.cmd}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(item.cmd)}
                      className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 hover:text-white"
                    >
                      <span>Copy Syntax</span>
                      {copiedCmd === item.cmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Video Courses & Player Applet */}
      {subTab === 'videos' && (
        <div className="space-y-6">
          {/* Course Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VIDEO_COURSES.map((course) => {
              const isSelected = selectedVideo.id === course.id;
              return (
                <button
                  key={course.id}
                  id={`video-tab-${course.id}`}
                  onClick={() => setSelectedVideo(course)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {course.duration}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{course.provider}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{course.title}</h3>
                </button>
              );
            })}
          </div>

          {/* Embedded Responsive Player Applet */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h2 className="text-lg font-bold text-white">{selectedVideo.title}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Duration: {selectedVideo.duration}</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-white"
                    title="Open on YouTube in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <iframe
                id="ceh-video-player"
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Chapters & Student Notes Scratchpad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Chapters & Timestamps */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curated Domain Chapters & Jump Timestamps</span>
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedVideo.chapters.map((ch, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                    >
                      <span className="text-slate-300 font-medium">{ch.title}</span>
                      <span className="font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {ch.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Scratchpad (Persistent in localStorage) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" />
                    <span>Personal Student Video Notes</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleOpenDomainScratchpad('domain-2')}
                    className="flex items-center gap-1 text-[11px] text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                    title="Open the 9-domain comprehensive scratchpad"
                  >
                    <PenLine className="w-3 h-3" />
                    <span>Open Domain Scratchpad &rarr;</span>
                  </button>
                </div>
                <textarea
                  id="written-exam-notes-area"
                  rows={6}
                  placeholder="Record timestamps, tool flags, or conceptual questions while watching the masterclass walkthrough..."
                  value={studentNotes}
                  onChange={(e) => handleSaveNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Domain-Specific Study Scratchpad */}
      {subTab === 'scratchpad' && (
        <WrittenDomainScratchpad
          initialDomainId={targetScratchpadDomain}
          onNavigateToDomainProgress={onNavigateToProgress}
        />
      )}
    </div>
  );
};
