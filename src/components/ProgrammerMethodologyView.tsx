import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  HelpCircle, 
  Code2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { 
  DEFAULT_LIVING_COMMANDS, 
  PROGRAMMER_AUTOMATION_SCRIPTS, 
  OUTPUT_ANALYSIS_SCENARIOS, 
  OutputAnalysisScenario 
} from '../data/programmerMethodologyData';
import { LivingCommandItem, ProgrammingScriptSnippet } from '../types';
import { STORAGE_KEYS, LIVING_COMMAND_DOMAINS, LIVING_COMMAND_ADD_OPTIONS } from '../data/appConfig';

export const ProgrammerMethodologyView: React.FC = () => {
  const [subTab, setSubTab] = useState<'living-sheet' | 'pacing-scripts' | 'focus-why'>('living-sheet');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Living Commands persistent state
  const [commands, setCommands] = useState<LivingCommandItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIVING_COMMANDS);
      return saved ? JSON.parse(saved) : DEFAULT_LIVING_COMMANDS;
    } catch {
      return DEFAULT_LIVING_COMMANDS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIVING_COMMANDS, JSON.stringify(commands));
  }, [commands]);

  // New Command form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState('#Recon');
  const [newTool, setNewTool] = useState('');
  const [newCmd, setNewCmd] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Script language state
  const [selectedScript, setSelectedScript] = useState<ProgrammingScriptSnippet>(
    PROGRAMMER_AUTOMATION_SCRIPTS[0]
  );

  // Terminal analyzer scenario state
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const activeScenario = OUTPUT_ANALYSIS_SCENARIOS[activeScenarioIdx];

  const handleCopy = (text: string, id?: string) => {
    const targetId = id || text;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
    setCopiedId(targetId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CopyButton = ({
    id,
    text,
    label = 'Copy to Clipboard',
    copiedLabel = 'Copied to Clipboard!',
    className = '',
    variant = 'outline',
    size = 'xs'
  }: {
    id: string;
    text: string;
    label?: string;
    copiedLabel?: string;
    className?: string;
    variant?: 'primary' | 'outline' | 'subtle' | 'ghost';
    size?: 'xs' | 'sm';
  }) => {
    const isCopied = copiedId === id;
    const base = 'inline-flex items-center gap-1.5 font-medium transition-all select-none focus:outline-none focus:ring-1 focus:ring-emerald-500';
    let sizeStyle = size === 'xs' ? 'px-2.5 py-1 text-xs rounded-lg' : 'px-3 py-1.5 text-xs rounded-lg';
    let variantStyle = '';

    if (variant === 'primary') {
      variantStyle = isCopied
        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
        : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30';
    } else if (variant === 'outline') {
      variantStyle = isCopied
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80';
    } else if (variant === 'subtle') {
      variantStyle = isCopied
        ? 'text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 px-2 py-0.5 rounded';
      sizeStyle = 'text-xs';
    } else if (variant === 'ghost') {
      variantStyle = isCopied
        ? 'text-emerald-400 font-semibold'
        : 'text-slate-400 hover:text-emerald-400';
      sizeStyle = 'p-1 text-xs';
    }

    return (
      <button
        id={`btn-copy-${id}`}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy(text, id);
        }}
        className={`${base} ${sizeStyle} ${variantStyle} ${className}`}
        title={isCopied ? copiedLabel : label}
        aria-label={isCopied ? copiedLabel : label}
      >
        {isCopied ? (
          <Check className={size === 'xs' ? 'w-3.5 h-3.5 text-emerald-400' : 'w-4 h-4 text-emerald-400'} />
        ) : (
          <Copy className={size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        )}
        <span>{isCopied ? copiedLabel : label}</span>
      </button>
    );
  };

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.trim() || !newCmd.trim()) return;

    const newItem: LivingCommandItem = {
      id: `custom-${Date.now()}`,
      domain: newDomain,
      tool: newTool.trim(),
      command: newCmd.trim(),
      description: newDesc.trim() || 'Custom student command',
      isCustom: true,
    };

    setCommands([newItem, ...commands]);
    setNewTool('');
    setNewCmd('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleDeleteCommand = (id: string) => {
    setCommands(commands.filter((c) => c.id !== id));
  };

  const handleExportMarkdown = () => {
    const domains = Array.from(new Set(commands.map((c) => c.domain)));
    let md = '# KayBiT CEH Living Command Sheet\n\n';
    md += '> Generated for CEH Practical & Written Exam Sessions\n\n';

    domains.forEach((dom) => {
      md += `## ${dom}\n\n`;
      const cmdsInDomain = commands.filter((c) => c.domain === dom);
      cmdsInDomain.forEach((item) => {
        md += `### ${item.tool}\n`;
        md += `_${item.description}_\n\n`;
        md += '```bash\n' + item.command + '\n```\n\n';
      });
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KayBiT_CEH_Living_Command_Sheet.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredCommands = commands.filter((c) => {
    if (selectedDomain === 'All') return true;
    return c.domain === selectedDomain;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Code2 className="w-3.5 h-3.5" />
            Recommended Study Methodology for Programmers
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Programmer Superpowers: Living Sheets, Pacing & Logic
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            As developers, you don't memorize static commands—you write loops, parse outputs, and understand system calls. 
            Use living markdown command sheets, write quick output-parsing wrappers in your language of choice, and train your eye on raw terminal responses.
          </p>
        </div>

        {/* Subtab Toggle */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <button
            id="methodology-subtab-living"
            onClick={() => setSubTab('living-sheet')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'living-sheet'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>1. Living Command Sheet</span>
          </button>

          <button
            id="methodology-subtab-pacing"
            onClick={() => setSubTab('pacing-scripts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'pacing-scripts'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>2. Simulate Pacing & Language Scripts</span>
          </button>

          <button
            id="methodology-subtab-why"
            onClick={() => setSubTab('focus-why')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'focus-why'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>3. Focus on the "Why" (Output Analyzer)</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: Living Command Sheet */}
      {subTab === 'living-sheet' && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Domain chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium mr-1">Domain:</span>
              {LIVING_COMMAND_DOMAINS.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                    selectedDomain === dom
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton
                id="copy-filtered-commands"
                text={filteredCommands.map((c) => `# [${c.domain}] ${c.tool}\n# ${c.description}\n${c.command}`).join('\n\n')}
                label={`Copy ${selectedDomain === 'All' ? 'All' : selectedDomain} Commands`}
                copiedLabel={`Copied ${filteredCommands.length} Commands!`}
                variant="outline"
                size="xs"
              />

              <button
                id="btn-add-custom-command"
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showAddForm ? 'Cancel' : 'Add Command'}</span>
              </button>

              <button
                id="btn-export-living-md"
                onClick={handleExportMarkdown}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown (.md)</span>
              </button>
            </div>
          </div>

          {/* Add Custom Command Form */}
          {showAddForm && (
            <form onSubmit={handleAddCommand} className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Custom Living Command</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Domain Category</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    {LIVING_COMMAND_ADD_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tool Identifier (e.g. nmap, sqlmap, custom-bash)</label>
                  <input
                    type="text"
                    required
                    placeholder="Tool name"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Executable Command String</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. nmap -sC -sV 10.10.10.5"
                  value={newCmd}
                  onChange={(e) => setNewCmd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description & When to Use in Exam</label>
                <input
                  type="text"
                  placeholder="Explain why and when to execute this command..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  Save to Living Sheet
                </button>
              </div>
            </form>
          )}

          {/* Commands List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommands.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {item.domain}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-300">{item.tool}</span>
                      {item.isCustom && (
                        <button
                          onClick={() => handleDeleteCommand(item.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete custom command"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{item.description}</p>
                </div>

                <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span>CLI Command</span>
                    </div>
                    <CopyButton
                      id={`cmd-${item.id}`}
                      text={item.command}
                      label="Copy to Clipboard"
                      copiedLabel="Copied to Clipboard!"
                      variant="outline"
                      size="xs"
                    />
                  </div>
                  <div
                    onClick={() => handleCopy(item.command, `cmd-${item.id}`)}
                    title="Click to copy command to clipboard"
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <code className="text-xs font-mono text-emerald-300 break-all select-all">
                      <span className="text-emerald-600 mr-1.5 select-none">$</span>
                      {item.command}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: Simulate Pacing & Language Scripts */}
      {subTab === 'pacing-scripts' && (
        <div className="space-y-6">
          {/* Pacing Advice Box */}
          <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Simulate the Pacing: 6 Hours = 360 Minutes (18 Minutes / Question)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The 6-hour timeline is generous, but candidates fail when they get stuck down a 45-minute rabbit hole on a single broken exploit script. 
              Write quick language wrappers to parse XML scan files, ping multiple ports simultaneously, and search big output files rather than doing manual terminal scans.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {PROGRAMMER_AUTOMATION_SCRIPTS.map((s) => {
              const isSelected = selectedScript.language === s.language;
              return (
                <button
                  key={s.language}
                  onClick={() => setSelectedScript(s)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {s.language}
                </button>
              );
            })}
          </div>

          {/* Script Details Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span>{selectedScript.language}</span>
                  <span>•</span>
                  <span>{selectedScript.filename}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedScript.purpose}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">{selectedScript.notes}</p>
              </div>

              <CopyButton
                id={`script-header-${selectedScript.language}`}
                text={selectedScript.code}
                label="Copy Script to Clipboard"
                copiedLabel="Copied Script to Clipboard!"
                variant="primary"
                size="sm"
              />
            </div>

            {/* Quick Terminal Execution Command */}
            {selectedScript.runCommand && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono text-emerald-400 font-medium">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Quick Terminal Execution Command ({selectedScript.language})</span>
                  </div>
                  <CopyButton
                    id={`script-run-${selectedScript.language}`}
                    text={selectedScript.runCommand}
                    label="Copy to Clipboard"
                    copiedLabel="Copied to Clipboard!"
                    variant="outline"
                    size="xs"
                  />
                </div>
                <div
                  onClick={() => handleCopy(selectedScript.runCommand!, `script-run-${selectedScript.language}`)}
                  title="Click to copy CLI run command to clipboard"
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/90 text-xs font-mono text-emerald-300 break-all cursor-pointer hover:border-emerald-500/40 transition-colors"
                >
                  <span className="text-emerald-600 mr-1.5 select-none">$</span>
                  {selectedScript.runCommand}
                </div>
              </div>
            )}

            {/* Code Viewer */}
            <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">{selectedScript.filename}</span>
                  <span className="text-slate-500 font-sans">({selectedScript.language} automation script)</span>
                </div>
                <CopyButton
                  id={`script-code-body-${selectedScript.language}`}
                  text={selectedScript.code}
                  label="Copy to Clipboard"
                  copiedLabel="Copied to Clipboard!"
                  variant="outline"
                  size="xs"
                />
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed max-h-[500px]">
                {selectedScript.code}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Focus on the "Why" (Output Analyzer) */}
      {subTab === 'focus-why' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <Lightbulb className="w-4 h-4" />
              <span>Interpreting Raw Terminal Responses (True Positive vs Timeout vs Firewall)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In the practical exam, tools rarely work like magic on the first attempt. You must train your developer instinct to read error codes, connection resets, and banner warnings to diagnose what the target environment is doing.
            </p>
          </div>

          {/* Scenario Selector Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {OUTPUT_ANALYSIS_SCENARIOS.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => {
                  setActiveScenarioIdx(i);
                  setSelectedOption(null);
                  setRevealed(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeScenarioIdx === i
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                Scenario {i + 1}: {sc.title}
              </button>
            ))}
          </div>

          {/* Active Scenario Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  Tool: {activeScenario.tool}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{activeScenario.title}</h3>
              </div>
            </div>

            {/* Raw Terminal Output */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 font-mono ml-1">
                    Raw Terminal Capture ({activeScenario.tool})
                  </span>
                </div>
                <CopyButton
                  id={`terminal-output-${activeScenario.id}`}
                  text={activeScenario.terminalOutput}
                  label="Copy to Clipboard"
                  copiedLabel="Copied to Clipboard!"
                  variant="outline"
                  size="xs"
                />
              </div>
              <pre
                onClick={() => handleCopy(activeScenario.terminalOutput, `terminal-output-${activeScenario.id}`)}
                title="Click to copy raw terminal capture"
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed cursor-pointer hover:border-slate-700 transition-colors"
              >
                {activeScenario.terminalOutput}
              </pre>
            </div>

            {/* Question */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-100">{activeScenario.question}</p>
              <div className="space-y-2">
                {activeScenario.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                  if (revealed) {
                    if (idx === activeScenario.correctIndex) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                    } else if (selectedOption === idx) {
                      btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                    }
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-slate-800 border-teal-500 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !revealed && setSelectedOption(idx)}
                      disabled={revealed}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                    >
                      <span className="font-mono text-slate-500 mr-2">[{String.fromCharCode(65 + idx)}]</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Check Button & Explanation */}
            {!revealed ? (
              <button
                id="btn-verify-output-answer"
                onClick={() => setRevealed(true)}
                disabled={selectedOption === null}
                className="px-4 py-2 rounded-xl bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors"
              >
                Verify Diagnostic
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-400">Verdict:</span>
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {activeScenario.verdict}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{activeScenario.explanation}</p>
                <div className="pt-2 border-t border-slate-850 text-xs text-amber-300">
                  <strong>Recommended Pro Action:</strong> {activeScenario.proAction}
                </div>

                {/* Pro Command Execution Block */}
                {activeScenario.proCommand && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1.5 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Recommended Remediation Command</span>
                      </div>
                      <CopyButton
                        id={`pro-command-${activeScenario.id}`}
                        text={activeScenario.proCommand}
                        label="Copy to Clipboard"
                        copiedLabel="Copied to Clipboard!"
                        variant="outline"
                        size="xs"
                      />
                    </div>
                    <div
                      onClick={() => handleCopy(activeScenario.proCommand!, `pro-command-${activeScenario.id}`)}
                      title="Click to copy remediation command to clipboard"
                      className="p-2 rounded bg-slate-950 text-xs font-mono text-emerald-300 break-all border border-slate-800 cursor-pointer hover:border-emerald-500/40 transition-colors"
                    >
                      <span className="text-emerald-600 mr-1.5 select-none">$</span>
                      {activeScenario.proCommand}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <CopyButton
                    id={`scenario-notes-${activeScenario.id}`}
                    text={`[CEH Output Analysis: ${activeScenario.title}]\nTool: ${activeScenario.tool}\nVerdict: ${activeScenario.verdict}\n\nExplanation:\n${activeScenario.explanation}\n\nPro Action:\n${activeScenario.proAction}${activeScenario.proCommand ? `\n\nCommand:\n${activeScenario.proCommand}` : ''}`}
                    label="Copy Diagnostic Notes"
                    copiedLabel="Copied Diagnostic Notes!"
                    variant="subtle"
                    size="xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
