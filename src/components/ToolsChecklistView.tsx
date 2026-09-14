import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Search, 
  Filter, 
  Terminal, 
  Monitor, 
  Copy, 
  Check, 
  Download, 
  Sparkles,
  Info,
  Play,
  Layers,
  Zap
} from 'lucide-react';
import { EC_COUNCIL_EXAM_TOOLS } from '../data/toolsChecklistData';
import { ExamTool } from '../types';
import { TOOL_CATEGORIES, TOOL_TYPES, STORAGE_KEYS } from '../data/appConfig';
import { LinuxCliSimulator } from './LinuxCliSimulator';

export const ToolsChecklistView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'terminal' | 'checklist'>('both');
  const [cliInputPreload, setCliInputPreload] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Persistent checked tool IDs in localStorage using centralized key
  const [checkedTools, setCheckedTools] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKED_TOOLS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKED_TOOLS, JSON.stringify(checkedTools));
  }, [checkedTools]);

  const toggleCheck = (id: string) => {
    setCheckedTools((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendToTerminal = (command: string) => {
    setCliInputPreload(command);
    if (activeTab === 'checklist') {
      setActiveTab('terminal');
    }
    // Smooth scroll to terminal if in combined view
    const elem = document.getElementById('cli-terminal-input');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elem.focus();
    }
  };

  const filteredTools = EC_COUNCIL_EXAM_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.purpose.toLowerCase().includes(search.toLowerCase()) ||
      tool.quickSyntax.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesType =
      selectedType === 'All' ||
      (selectedType === 'CLI' && (tool.type === 'CLI' || tool.type === 'Both')) ||
      (selectedType === 'GUI' && (tool.type === 'GUI' || tool.type === 'Both'));

    return matchesSearch && matchesCategory && matchesType;
  });

  const checkedCount = Object.values(checkedTools).filter(Boolean).length;
  const totalCount = EC_COUNCIL_EXAM_TOOLS.length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  // Generate unified apt script for uninstalled tools
  const handleCopyAptScript = () => {
    const uninstalled = EC_COUNCIL_EXAM_TOOLS.filter((t) => !checkedTools[t.id]);
    const aptPkgs = uninstalled
      .filter((t) => t.kaliInstallCmd.includes('apt install -y'))
      .map((t) => {
        const match = t.kaliInstallCmd.match(/apt install -y ([\w\s-]+)/);
        return match ? match[1].trim() : '';
      })
      .filter(Boolean)
      .join(' ');

    const script = `sudo apt update && sudo apt install -y ${aptPkgs}`;
    handleCopy(script);
  };

  return (
    <div className="space-y-6">
      {/* View Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            id="tab-tools-both"
            onClick={() => setActiveTab('both')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'both'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Combined (Terminal + Checklist)</span>
          </button>

          <button
            id="tab-tools-terminal"
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'terminal'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Interactive Kali CLI Simulator</span>
          </button>

          <button
            id="tab-tools-checklist"
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'checklist'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Exam Tools Audit ({checkedCount}/{totalCount})</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono hidden md:flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>CEH v13 Practical Terminal Ready</span>
        </div>
      </div>

      {/* CLI SIMULATOR SECTION */}
      {(activeTab === 'both' || activeTab === 'terminal') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
                Interactive In-Browser CEH Command-Line Sandbox
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Practice typing nmap, sqlmap, hydra, enum4linux, steghide
            </span>
          </div>

          <LinuxCliSimulator initialCommand={cliInputPreload} />
        </div>
      )}

      {/* CHECKLIST SECTION */}
      {(activeTab === 'both' || activeTab === 'checklist') && (
        <div className="space-y-6">
          {/* Header & Progress Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <CheckSquare className="w-3.5 h-3.5" />
                  EC-Council Exam Machine Environment Audit
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Curated Exam Environment Tools Checklist
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  These exact GUI and CLI tools are pre-installed inside the official EC-Council exam operating system.
                  Install and test them in your local sandbox to eliminate syntax hesitation during your 6-hour practical test.
                </p>
              </div>

              <button
                id="btn-copy-apt-script"
                onClick={handleCopyAptScript}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all shrink-0"
              >
                {copiedText?.includes('apt install') ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied Kali Apt Script!</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" />
                    <span>Copy Kali Apt-Get All Script</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress bar */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-2">
                  <span>Environment Readiness:</span>
                  <strong className="text-emerald-400 font-mono">{checkedCount} / {totalCount} Tools Tested</strong>
                </span>
                <span className="font-mono text-emerald-400">{progressPercent}% Ready</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools by name, flag, or syntax (e.g. nmap, sqlmap, john)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                {TOOL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                {TOOL_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                No tools found matching your search query or filter.
              </div>
            ) : (
              filteredTools.map((tool) => {
                const isChecked = !!checkedTools[tool.id];

                return (
                  <div
                    key={tool.id}
                    id={`tool-card-${tool.id}`}
                    className={`p-5 rounded-2xl transition-all border flex flex-col justify-between ${
                      isChecked
                        ? 'bg-slate-900/90 border-emerald-500/50 shadow-sm shadow-emerald-950/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <button
                          onClick={() => toggleCheck(tool.id)}
                          className="flex items-center gap-2.5 text-left group"
                        >
                          <div className="p-1 text-emerald-400">
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-500 group-hover:text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h3 className={`text-base font-bold ${isChecked ? 'text-emerald-300' : 'text-white'}`}>
                              {tool.name}
                            </h3>
                            <span className="text-[10px] text-slate-400">{tool.category}</span>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {tool.type}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {tool.examPresence}
                          </span>
                        </div>
                      </div>

                      {/* Purpose */}
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {tool.purpose}
                      </p>

                      {/* Quick Syntax */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono text-slate-400">Quick Syntax:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSendToTerminal(tool.quickSyntax)}
                              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                              title="Test command in Kali CLI Simulator"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Test in CLI</span>
                            </button>
                            <button
                              onClick={() => handleCopy(tool.quickSyntax)}
                              className="flex items-center gap-1 hover:text-white"
                              title="Copy syntax"
                            >
                              {copiedText === tool.quickSyntax ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>
                        <code className="block p-2.5 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300 break-all border border-slate-800/80">
                          {tool.quickSyntax}
                        </code>
                      </div>

                      {/* Kali Install Command */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-mono text-slate-400">Install / Execution:</span>
                          <button
                            onClick={() => handleCopy(tool.kaliInstallCmd)}
                            className="flex items-center gap-1 hover:text-white"
                            title="Copy command"
                          >
                            {copiedText === tool.kaliInstallCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>Copy</span>
                          </button>
                        </div>
                        <code className="block p-2 rounded-lg bg-slate-950 text-[11px] font-mono text-teal-300 break-all border border-slate-800/80">
                          {tool.kaliInstallCmd}
                        </code>
                      </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-amber-300 flex items-start gap-2 mt-1">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug"><strong>Exam Pro-Tip:</strong> {tool.proTip}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
