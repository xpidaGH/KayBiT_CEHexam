import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldAlert, 
  Terminal, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  BookOpen,
  Volume2,
  VolumeX,
  Target,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Award,
  Zap
} from 'lucide-react';
import { PRACTICAL_PRACTICE_CHALLENGES, WRITTEN_PRACTICE_QUESTIONS } from '../data/cehPracticalData';
import { EXAM_DOMAINS_PROGRESS } from '../data/progressData';
import { PracticalChallenge, WrittenQuizQuestion } from '../types';
import { APP_CONFIG, STORAGE_KEYS } from '../data/appConfig';
import { PracticePerformanceChart } from './PracticePerformanceChart';
import { 
  playFlagCapturedSound, 
  playTimerCompleteSound, 
  playFlashcardSuccessSound, 
  playDeckMasteredFanfare,
  isAudioCuesEnabled, 
  setAudioCuesEnabled 
} from '../utils/audioCues';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';

export interface WeaknessTopicAnalysis {
  domainNumber: number;
  domainName: string;
  blueprintWeight: number;
  completionRate: number;
  uncompletedCount: number;
}

export const PracticeTestsView: React.FC = () => {
  const [examMode, setExamMode] = useState<'practical' | 'written' | 'weakness'>('practical');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => isAudioCuesEnabled());

  useEffect(() => {
    const handleAudioToggle = (e: CustomEvent<{ enabled: boolean }>) => {
      setAudioEnabled(e.detail.enabled);
    };
    window.addEventListener('audio-cues-toggle' as any, handleAudioToggle);
    return () => window.removeEventListener('audio-cues-toggle' as any, handleAudioToggle);
  }, []);

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setAudioCuesEnabled(next);
  };

  // --- PRACTICAL 20-CHALLENGE SIMULATOR STATE ---
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [flagInputs, setFlagInputs] = useState<Record<number, string>>({});
  const [solvedChallenges, setSolvedChallenges] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRACTICAL_SOLVED_FLAGS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<{ id: number; text: string; success: boolean } | null>(null);

  // 6-hour timer from centralized configuration
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRACTICAL_TIMER);
    return saved ? parseInt(saved, 10) : APP_CONFIG.examParameters.practicalDurationSeconds;
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRACTICAL_SOLVED_FLAGS, JSON.stringify(solvedChallenges));
  }, [solvedChallenges]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            playTimerCompleteSound();
            setIsTimerRunning(false);
            return 0;
          }
          const next = prev - 1;
          localStorage.setItem(STORAGE_KEYS.PRACTICAL_TIMER, next.toString());
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const currentChallenge: PracticalChallenge = PRACTICAL_PRACTICE_CHALLENGES[currentChallengeIdx];

  const handleFlagSubmit = (challenge: PracticalChallenge) => {
    const input = (flagInputs[challenge.id] || '').trim().toLowerCase();
    const correct = challenge.correctFlag.trim().toLowerCase();

    // Flexible match: exact or contains non-trivial substring
    if (input === correct || (input.length > 3 && (correct.includes(input) || input.includes(correct)))) {
      setSolvedChallenges((prev) => ({ ...prev, [challenge.id]: true }));
      setFeedbackMsg({
        id: challenge.id,
        text: 'Correct Flag! Challenge solved (+1 Point)',
        success: true,
      });
      playFlagCapturedSound();
    } else {
      setFeedbackMsg({
        id: challenge.id,
        text: 'Incorrect flag. Review your syntax or read the hint.',
        success: false,
      });
    }
  };

  const solvedCount = Object.values(solvedChallenges).filter(Boolean).length;
  const isPassing = solvedCount >= APP_CONFIG.examParameters.practicalPassingScore;

  // --- WRITTEN QUIZ STATE ---
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, number>>({});
  const [writtenRevealed, setWrittenRevealed] = useState<Record<number, boolean>>({});

  const handleSelectWritten = (qId: number, optIdx: number) => {
    if (writtenRevealed[qId]) return;
    setWrittenAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setWrittenRevealed((prev) => ({ ...prev, [qId]: true }));

    const question = WRITTEN_PRACTICE_QUESTIONS.find((q) => q.id === qId);
    if (question && question.correctIndex === optIdx) {
      playFlashcardSuccessSound();
    }
  };

  const writtenCorrectCount = WRITTEN_PRACTICE_QUESTIONS.filter(
    (q: WrittenQuizQuestion) => writtenAnswers[q.id] === q.correctIndex
  ).length;

  // --- DYNAMIC WEAKNESS REVISION ENGINE ---
  const [weaknessAnswers, setWeaknessAnswers] = useState<Record<string, number>>({});
  const [weaknessRevealed, setWeaknessRevealed] = useState<Record<string, boolean>>({});
  const [weaknessAnalysis, setWeaknessAnalysis] = useState<WeaknessTopicAnalysis[]>([]);
  const [weaknessQuestions, setWeaknessQuestions] = useState<Array<{
    id: string;
    domainNumber: number;
    domainName: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    examTip: string;
  }>>([]);

  const analyzeAndGenerateWeaknessTest = () => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEYS.DOMAIN_PROGRESS);
      const completedTasks: Record<string, boolean> = savedTasks ? JSON.parse(savedTasks) : {};

      // Analyze each domain from the official CEH Blueprint
      const analyzed: WeaknessTopicAnalysis[] = EXAM_DOMAINS_PROGRESS.map((domain) => {
        const total = domain.tasks.length;
        const completed = domain.tasks.filter((t) => completedTasks[t.id]).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          domainNumber: domain.domainNumber,
          domainName: domain.name,
          blueprintWeight: domain.blueprintWeight,
          completionRate: rate,
          uncompletedCount: total - completed,
        };
      });

      // Sort by lowest completion rate first, then by blueprint weight descending (high weight + low score = most critical)
      analyzed.sort((a, b) => {
        if (a.completionRate !== b.completionRate) {
          return a.completionRate - b.completionRate;
        }
        return b.blueprintWeight - a.blueprintWeight;
      });

      setWeaknessAnalysis(analyzed);

      // Target the lowest 3 domains
      const targetDomains = analyzed.slice(0, 3);
      const targetDomainNumbers = new Set(targetDomains.map((d) => d.domainNumber));

      // Curated bank for weak domain revision
      const WEAKNESS_QUESTION_BANK = [
        {
          id: 'w-d4-1',
          domainNumber: 4,
          domainName: 'Domain 4: System Hacking & Malware Threats',
          question: 'An attacker gains initial shell access on a Linux server and wants to search for SUID binaries owned by root. Which command accomplishes this without generating permission noise?',
          options: [
            'find / -perm -4000 -user root -type f 2>/dev/null',
            'ls -laR /etc/sudoers 2>/dev/null',
            'grep -rnw "root" /var/log/ 2>/dev/null',
            'chmod +s /bin/bash /usr/bin/python3'
          ],
          correctIndex: 0,
          explanation: '`find / -perm -4000 -user root -type f 2>/dev/null` specifically searches the entire filesystem for files with the 4000 (SUID) permission bit set owned by root, redirecting stderr to null.',
          examTip: 'High-frequency CEH Practical question. Know how to leverage SUID binaries on GTFOBins.'
        },
        {
          id: 'w-d6-1',
          domainNumber: 6,
          domainName: 'Domain 6: Web Application Hacking',
          question: 'During a web application security review, you notice the endpoint `https://target.com/profile?redirect=http://attacker.com/steal` accepts arbitrary external URLs and redirects the browser. What vulnerability is this?',
          options: [
            'Server-Side Request Forgery (SSRF)',
            'Unvalidated Redirects and Forwards (Open Redirect)',
            'Reflected Cross-Site Scripting (XSS)',
            'Insecure Direct Object References (IDOR)'
          ],
          correctIndex: 1,
          explanation: 'Open Redirect vulnerabilities occur when a web application accepts untrusted user input as a redirection target without proper whitelist validation, commonly chained in spear phishing campaigns.',
          examTip: 'Mitigate with domain whitelist validation and relative-path enforcement.'
        },
        {
          id: 'w-d5-1',
          domainNumber: 5,
          domainName: 'Domain 5: Network Sniffing & Evasion',
          question: 'An administrator needs to prevent ARP cache poisoning across their local enterprise network. Which layer-2 switch feature inspects ARP packets and discards invalid IP-to-MAC bindings?',
          options: [
            'Port Security with MAC sticky',
            'Dynamic ARP Inspection (DAI)',
            'BPDU Guard on access ports',
            'Spanning Tree Root Guard'
          ],
          correctIndex: 1,
          explanation: 'Dynamic ARP Inspection (DAI) uses the DHCP snooping binding table to validate ARP packets on untrusted switch ports, dropping poisoned gratuitous ARP broadcasts.',
          examTip: 'DAI depends strictly on DHCP Snooping being active on the VLAN.'
        },
        {
          id: 'w-d2-1',
          domainNumber: 2,
          domainName: 'Domain 2: Network & System Scanning',
          question: 'Which Nmap scan flag combines OS detection, version detection, script scanning, and traceroute in a single rapid command line pass?',
          options: [
            'nmap -sS -p- 192.168.1.1',
            'nmap -A -T4 192.168.1.1',
            'nmap -sU -sV 192.168.1.1',
            'nmap -O --osscan-guess 192.168.1.1'
          ],
          correctIndex: 1,
          explanation: 'The `-A` flag enables Aggressive scanning: OS detection (-O), version scanning (-sV), script scanning (-sC), and traceroute (--traceroute).',
          examTip: 'Crucial for initial triage on CEH Practical labs.'
        },
        {
          id: 'w-d8-1',
          domainNumber: 8,
          domainName: 'Domain 8: Cloud Computing & Cryptography',
          question: 'In asymmetric public-key cryptography, which key is used by a sender to verify the authenticity and non-repudiation of a digital signature created by the signer?',
          options: [
            'The sender\'s private key',
            'The sender\'s public key',
            'The signer\'s public key',
            'A shared Diffie-Hellman secret key'
          ],
          correctIndex: 2,
          explanation: 'Digital signatures are generated using the signer\'s private key and verified by anyone possessing the signer\'s public key.',
          examTip: 'Rule: Sign with Private Key -> Verify with Public Key; Encrypt with Public Key -> Decrypt with Private Key.'
        },
        {
          id: 'w-d3-1',
          domainNumber: 3,
          domainName: 'Domain 3: Vulnerability Assessment',
          question: 'Which automated vulnerability assessment phase determines whether identified vulnerabilities are exploitable through proof-of-concept verification?',
          options: [
            'Passive vulnerability identification',
            'Vulnerability penetration / exploitation testing',
            'Vulnerability remediation verification',
            'Risk classification matrix ranking'
          ],
          correctIndex: 1,
          explanation: 'Vulnerability assessments identify security weaknesses, while penetration testing moves into active exploitation to verify actual business risk and eliminate false positives.',
          examTip: 'Distinguish between vulnerability scanning (detection) vs penetration testing (exploitation).'
        }
      ];

      // Prioritize questions from targeted weak domains
      const filtered = WEAKNESS_QUESTION_BANK.filter((q) => targetDomainNumbers.has(q.domainNumber));
      const finalQuestions = filtered.length >= 4 ? filtered : WEAKNESS_QUESTION_BANK;

      setWeaknessQuestions(finalQuestions);
      setWeaknessAnswers({});
      setWeaknessRevealed({});
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    analyzeAndGenerateWeaknessTest();
  }, []);

  const handleSelectWeakness = (qId: string, optIdx: number) => {
    if (weaknessRevealed[qId]) return;
    setWeaknessAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setWeaknessRevealed((prev) => ({ ...prev, [qId]: true }));

    const question = weaknessQuestions.find((q) => q.id === qId);
    if (question && question.correctIndex === optIdx) {
      playFlashcardSuccessSound();
    }
  };

  const weaknessCorrectCount = weaknessQuestions.filter(
    (q) => weaknessAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* Historical Performance Overview Chart */}
      <PracticePerformanceChart
        currentSolvedFlags={solvedCount}
        currentWrittenScore={writtenCorrectCount}
      />

      {/* Mode Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="test-mode-practical"
            onClick={() => setExamMode('practical')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              examMode === 'practical'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>CEH Practical (20-Challenge Simulation)</span>
          </button>

          <button
            id="test-mode-written"
            onClick={() => setExamMode('written')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              examMode === 'written'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>CEH Written Domain Quiz</span>
          </button>

          {/* Dynamic Weakness Revision Mode */}
          <button
            id="test-mode-weakness"
            onClick={() => {
              setExamMode('weakness');
              analyzeAndGenerateWeaknessTest();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              examMode === 'weakness'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
            }`}
          >
            <Target className="w-4 h-4 text-rose-400" />
            <span>Weakness Revision Test</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Adaptive
            </span>
          </button>
        </div>

        {examMode === 'practical' && (
          <div className="flex items-center gap-3">
            {/* Audio cues toggle */}
            <button
              onClick={handleToggleAudio}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={audioEnabled ? 'Session Audio Cues: Enabled (Click to Mute)' : 'Session Audio Cues: Muted (Click to Enable)'}
              aria-label="Toggle Audio Cues"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-100">{formatTimer(secondsRemaining)}</span>
            </div>

            {/* Timer Controls */}
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setSecondsRemaining(APP_CONFIG.examParameters.practicalDurationSeconds);
                localStorage.setItem(
                  STORAGE_KEYS.PRACTICAL_TIMER,
                  APP_CONFIG.examParameters.practicalDurationSeconds.toString()
                );
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              title="Reset 6-Hour Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* MODE 1: CEH PRACTICAL 20 CHALLENGES */}
      {examMode === 'practical' && (
        <div className="space-y-6">
          {/* Score & Passing Status Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Current Exam Score:</span>
                <span className="text-lg font-extrabold font-mono text-emerald-400">
                  {solvedCount} / {APP_CONFIG.examParameters.practicalTotalChallenges} Solved
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pass Criterion: <strong>{APP_CONFIG.examParameters.practicalPassingScore} / {APP_CONFIG.examParameters.practicalTotalChallenges} ({APP_CONFIG.examParameters.writtenPassingScorePercentage}%)</strong> minimum required to obtain CEH (Practical).
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isPassing ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PASSING THRESHOLD MET ({solvedCount}/20)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <span>Need {APP_CONFIG.examParameters.practicalPassingScore - solvedCount} more flags to pass</span>
                </div>
              )}
            </div>
          </div>

          {/* 1 to 20 Question Selector Grid */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exam Challenges Navigator
              </span>
              <span className="text-[11px] text-slate-500">Click to jump between challenges</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-20 gap-1.5">
              {PRACTICAL_PRACTICE_CHALLENGES.map((ch: PracticalChallenge, idx: number) => {
                const isCurrent = currentChallengeIdx === idx;
                const isSolved = !!solvedChallenges[ch.id];

                let bgClass = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700';
                if (isSolved) {
                  bgClass = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
                } else if (isCurrent) {
                  bgClass = 'bg-teal-500/20 text-teal-300 border-teal-500 font-bold ring-1 ring-teal-500';
                }

                return (
                  <button
                    key={ch.id}
                    id={`nav-challenge-${ch.id}`}
                    onClick={() => {
                      setCurrentChallengeIdx(idx);
                      setFeedbackMsg(null);
                    }}
                    className={`h-9 rounded-lg border text-xs font-mono transition-all flex items-center justify-center ${bgClass}`}
                  >
                    {ch.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Challenge Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Challenge {currentChallenge.id} of {APP_CONFIG.examParameters.practicalTotalChallenges}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {currentChallenge.pillar}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{currentChallenge.title}</h2>
                <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
                  <span>Target: <strong className="text-emerald-400">{currentChallenge.targetInfo}</strong></span>
                </div>
              </div>

              {/* Solved badge */}
              {solvedChallenges[currentChallenge.id] && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Solved (+1 Pt)</span>
                </div>
              )}
            </div>

            {/* Scenario & Question */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed">
                <span className="font-semibold text-emerald-400 block mb-1">Scenario Brief:</span>
                {currentChallenge.scenario}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 text-xs sm:text-sm font-semibold text-white">
                <span className="text-teal-400 font-mono block mb-1">Objective Task:</span>
                {currentChallenge.task}
              </div>
            </div>

            {/* Flag Submission Field */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300 font-mono">
                Submit Flag or Recovered Credential:
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter flag string or recovered value..."
                  value={flagInputs[currentChallenge.id] || ''}
                  onChange={(e) =>
                    setFlagInputs({
                      ...flagInputs,
                      [currentChallenge.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFlagSubmit(currentChallenge);
                  }}
                  className="w-full sm:flex-1 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <button
                  id="btn-submit-flag"
                  onClick={() => handleFlagSubmit(currentChallenge)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                >
                  Submit Flag
                </button>
              </div>

              {/* Feedback Alert */}
              {feedbackMsg && feedbackMsg.id === currentChallenge.id && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    feedbackMsg.success
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {feedbackMsg.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{feedbackMsg.text}</span>
                </div>
              )}
            </div>

            {/* Hint & Solution Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setShowHint((prev) => ({
                      ...prev,
                      [currentChallenge.id]: !prev[currentChallenge.id],
                    }))
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint[currentChallenge.id] ? 'Hide Hint' : 'Show Hint'}</span>
                </button>

                <button
                  onClick={() =>
                    setShowSolution((prev) => ({
                      ...prev,
                      [currentChallenge.id]: !prev[currentChallenge.id],
                    }))
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-teal-400" />
                  <span>{showSolution[currentChallenge.id] ? 'Hide Solution' : 'View Full Solution & Commands'}</span>
                </button>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentChallengeIdx === 0}
                  onClick={() => {
                    setCurrentChallengeIdx(currentChallengeIdx - 1);
                    setFeedbackMsg(null);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                  title="Previous challenge"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  disabled={currentChallengeIdx === PRACTICAL_PRACTICE_CHALLENGES.length - 1}
                  onClick={() => {
                    setCurrentChallengeIdx(currentChallengeIdx + 1);
                    setFeedbackMsg(null);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                  title="Next challenge"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hint Drawer */}
            {showHint[currentChallenge.id] && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <strong className="block mb-1 text-amber-300 font-mono">Proctor / Methodology Hint:</strong>
                {currentChallenge.flagHint}
              </div>
            )}

            {/* Solution Drawer */}
            {showSolution[currentChallenge.id] && (
              <div className="p-5 rounded-xl bg-slate-950 border border-teal-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                    Official Solution Walkthrough
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    Flag: {currentChallenge.correctFlag}
                  </span>
                </div>
                <ul className="space-y-1.5 border-l-2 border-slate-800 pl-3">
                  {currentChallenge.solutionBreakdown.map((step: string, sIdx: number) => (
                    <li key={sIdx} className="text-xs text-slate-300">{step}</li>
                  ))}
                </ul>
                <div>
                  <span className="text-[11px] font-mono text-slate-500">Executable Verification Snippet:</span>
                  <pre className="mt-1 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                    {currentChallenge.codeSnippetExample}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: CEH WRITTEN DOMAIN QUIZ */}
      {examMode === 'written' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">CEH Written Practice Questions</h2>
              <p className="text-xs text-slate-400">
                Core domain concepts, protocol edge cases, and code vulnerability analysis.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              Score: {writtenCorrectCount} / {WRITTEN_PRACTICE_QUESTIONS.length}
            </div>
          </div>

          <div className="space-y-5">
            {WRITTEN_PRACTICE_QUESTIONS.map((q: WrittenQuizQuestion) => {
              const isAnswered = writtenRevealed[q.id];
              const selectedOpt = writtenAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {q.domain}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Q#{q.id}</span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    {q.question}
                  </p>

                  {q.codeVulnerabilityExample && (
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto">
                      {q.codeVulnerabilityExample}
                    </pre>
                  )}

                  <div className="space-y-2">
                    {q.options.map((opt: string, idx: number) => {
                      let optClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isAnswered) {
                        if (idx === q.correctIndex) {
                          optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                        } else if (selectedOpt === idx) {
                          optClass = 'bg-red-500/20 border-red-500 text-red-300';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleSelectWritten(q.id, idx)}
                          className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optClass}`}
                        >
                          <div>
                            <span className="font-mono text-slate-500 mr-2">[{String.fromCharCode(65 + idx)}]</span>
                            <span>{opt}</span>
                          </div>
                          {isAnswered && idx === q.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <span className="font-bold text-teal-400 font-mono">Why this is correct:</span>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- WEAKNESS REVISION TEST MODE --- */}
      {examMode === 'weakness' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Diagnostic Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5" />
                  <span>Dynamic Diagnostic Engine</span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Targeted Weakness Revision Test</span>
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Synthesizes tasks and historical performance from your Domain Progress Tracker. Questions below focus exclusively on domains with the lowest completion and highest failure probability.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={analyzeAndGenerateWeaknessTest}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  title="Re-analyze domain progress and generate fresh weakness questions"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Re-analyze</span>
                </button>

                <div className="text-xs font-mono font-bold text-rose-300 bg-slate-950 px-3 py-2 rounded-xl border border-rose-500/30">
                  Score: {weaknessCorrectCount} / {weaknessQuestions.length}
                </div>
              </div>
            </div>

            {/* Targeted Weakness Chips */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block mb-2">Detected Lowest Scoring Domains:</span>
              <div className="flex flex-wrap gap-2">
                {weaknessAnalysis.slice(0, 3).map((w) => (
                  <div
                    key={w.domainNumber}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/30 text-xs"
                  >
                    <span className="font-mono font-bold text-rose-400">Domain {w.domainNumber}</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{w.domainName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold">
                      {w.completionRate}% Mastery
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weakness Questions List */}
          <div className="space-y-5">
            {weaknessQuestions.map((q, qIndex) => {
              const isAnswered = weaknessRevealed[q.id];
              const selectedOpt = weaknessAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                      Domain {q.domainNumber} Weakness Drill
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Question {qIndex + 1} of {weaknessQuestions.length}</span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt: string, idx: number) => {
                      let optClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isAnswered) {
                        if (idx === q.correctIndex) {
                          optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                        } else if (selectedOpt === idx) {
                          optClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        } else {
                          optClass = 'bg-slate-950/50 border-slate-900 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleSelectWeakness(q.id, idx)}
                          className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optClass}`}
                        >
                          <div>
                            <span className="font-mono text-slate-500 mr-2">[{String.fromCharCode(65 + idx)}]</span>
                            <span>{opt}</span>
                          </div>
                          {isAnswered && idx === q.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Remediation Breakdown:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                      <p className="text-teal-400 font-mono text-[11px]">
                        💡 Blueprint Exam Strategy: {q.examTip}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
