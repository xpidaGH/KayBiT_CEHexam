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
  Info
} from 'lucide-react';
import { EC_COUNCIL_EXAM_TOOLS } from '../data/toolsChecklistData';
import { ExamTool } from '../types';
import { TOOL_CATEGORIES, TOOL_TYPES, STORAGE_KEYS } from '../data/appConfig';

export const ToolsChecklistView: React.FC = () => {
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

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="tools-search-input"
            type="text"
            placeholder="Search tools, syntax, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Categories & Type */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category dropdown */}
          <select
            id="tools-category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {TOOL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Type dropdown */}
          <select
            id="tools-type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {TOOL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400">
            No tools match your query "{search}".
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
                      <button
                        onClick={() => handleCopy(tool.quickSyntax)}
                        className="flex items-center gap-1 hover:text-white"
                        title="Copy syntax"
                      >
                        {copiedText === tool.quickSyntax ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
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
  );
};
