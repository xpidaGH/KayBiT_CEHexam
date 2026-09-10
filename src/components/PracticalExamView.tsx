import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Radar, 
  Globe, 
  EyeOff, 
  FolderDown, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { BIG_THREE_REPOSITORIES, PRACTICAL_PILLARS, BigThreeRepo } from '../data/cehPracticalData';
import { PracticalPillar } from '../types';

interface PracticalExamViewProps {
  onNavigateToSimulator?: () => void;
}

export const PracticalExamView: React.FC<PracticalExamViewProps> = ({ onNavigateToSimulator }) => {
  const [activeSubTab, setActiveSubTab] = useState<'big-three' | 'pillars'>('pillars');
  const [selectedRepo, setSelectedRepo] = useState<BigThreeRepo>(BIG_THREE_REPOSITORIES[0]);
  const [selectedPillar, setSelectedPillar] = useState<PracticalPillar>(PRACTICAL_PILLARS[0]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radar':
        return <Radar className="w-4 h-4 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-teal-400" />;
      case 'Terminal':
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 'EyeOff':
        return <EyeOff className="w-4 h-4 text-amber-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Passing Criteria & Golden Rule Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Component 2: CEH Practical Exam Preparation
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                Pass Threshold: 14 / 20 Challenges (70%)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                Duration: 6 Hours
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Master the CEH Practical Live-Target Exam
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Open-notes, open-documentation, authentic 6-hour laboratory environment. You must achieve at least 
              <strong className="text-emerald-400"> 14 correct flags</strong> across scanning, web exploitation, system hacking, and traffic analysis.
            </p>
          </div>

          {/* Golden Rule Callout */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 max-w-sm shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1.5">
              <FolderDown className="w-4 h-4" />
              <span>THE GOLDEN RULE:</span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Always run full network scans <em>first</em>, pipe the output to text files on your desktop, and refer back to them to answer subsequent questions. Never rescan during the exam!
            </p>
            {onNavigateToSimulator && (
              <button
                id="btn-goto-simulator"
                onClick={onNavigateToSimulator}
                className="mt-3 w-full py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Launch 20-Challenge Simulation →
              </button>
            )}
          </div>
        </div>

        {/* Subtab Toggle */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            id="subtab-pillars"
            onClick={() => setActiveSubTab('pillars')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'pillars'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Target Areas to Practice (The 4 Pillars)</span>
          </button>

          <button
            id="subtab-big-three"
            onClick={() => setActiveSubTab('big-three')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'big-three'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>The "Big Three" Open-Source Cheat Sheets</span>
          </button>
        </div>
      </div>

      {/* VIEW A: The 4 Practical Pillars */}
      {activeSubTab === 'pillars' && (
        <div className="space-y-6">
          {/* Pillar Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICAL_PILLARS.map((pillar) => {
              const isSelected = selectedPillar.id === pillar.id;
              return (
                <button
                  key={pillar.id}
                  id={`pillar-card-${pillar.id}`}
                  onClick={() => setSelectedPillar(pillar)}
                  className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-1.5 rounded-lg bg-slate-800">
                        {getPillarIcon(pillar.iconName)}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {pillar.examWeight}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{pillar.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{pillar.summary}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Pillar Detailed View */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">{selectedPillar.examWeight} of Exam</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">Core Tools: {selectedPillar.coreTools.join(', ')}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{selectedPillar.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  {selectedPillar.whyItMatters}
                </p>
              </div>
            </div>

            {/* Essential Commands with Flag Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Essential Command Strings & Flag Syntax
              </h3>
              <div className="space-y-3">
                {selectedPillar.essentialCommands.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono text-emerald-300 font-semibold break-all mr-2">{item.cmd}</code>
                      <button
                        onClick={() => handleCopy(item.cmd)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 shrink-0"
                      >
                        {copiedText === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === item.cmd ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-300">{item.explanation}</p>
                    <p className="text-[11px] font-mono text-slate-500 border-t border-slate-900 pt-1.5">
                      <span className="text-teal-400 font-bold">Flag Details:</span> {item.flagDetails}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenario Walkthrough & Terminal Simulation */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Authentic Exam Scenario Walkthrough
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    <strong>Target:</strong> {selectedPillar.scenarioWalkthrough.target} | <strong>Objective:</strong> {selectedPillar.scenarioWalkthrough.objective}
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {selectedPillar.scenarioWalkthrough.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>

              {/* Sample Terminal Output */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">Expected Raw Terminal Response:</span>
                  <button
                    onClick={() => handleCopy(selectedPillar.scenarioWalkthrough.sampleTerminalOutput)}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {copiedText === selectedPillar.scenarioWalkthrough.sampleTerminalOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Output</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-lg bg-slate-900 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {selectedPillar.scenarioWalkthrough.sampleTerminalOutput}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: The Big Three Open-Source Cheat Sheets */}
      {activeSubTab === 'big-three' && (
        <div className="space-y-6">
          {/* Repo selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BIG_THREE_REPOSITORIES.map((repo) => {
              const isSelected = selectedRepo.id === repo.id;
              return (
                <button
                  key={repo.id}
                  id={`big-three-card-${repo.id}`}
                  onClick={() => setSelectedRepo(repo)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono text-teal-400 uppercase bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    Community Vetted
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2 mb-1">{repo.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{repo.corePhilosophy}</p>
                </button>
              );
            })}
          </div>

          {/* Repo details */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-mono text-teal-400 uppercase">{selectedRepo.authorRepo}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedRepo.name}</h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  <strong>Philosophy:</strong> {selectedRepo.corePhilosophy}
                </p>
              </div>

              <a
                href={selectedRepo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-medium transition-colors shrink-0"
              >
                <span>Browse Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Key Snippets */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Executable Cheat Sheet Snippets (Ready to Copy & Tweak)
              </h3>
              <div className="space-y-3">
                {selectedRepo.keySnippets.map((snip, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-300">{snip.label}</span>
                      <button
                        onClick={() => handleCopy(snip.code)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
                      >
                        {copiedText === snip.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === snip.code ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 text-xs text-emerald-300 font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800/80">
                      {snip.code}
                    </pre>
                    <p className="text-xs text-slate-400">{snip.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Tips */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Exam Day Best Practices</span>
              </h4>
              <ul className="space-y-1.5">
                {selectedRepo.examTips.map((tip, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
