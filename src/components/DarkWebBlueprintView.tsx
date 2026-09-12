import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  Shield, 
  Lock, 
  Unlock, 
  Terminal, 
  Copy, 
  Check, 
  AlertTriangle, 
  Cpu, 
  Server, 
  Eye, 
  EyeOff, 
  Network, 
  Play, 
  RotateCcw, 
  Download, 
  ChevronRight, 
  HelpCircle, 
  FileCode, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ExternalLink,
  ArrowRight,
  Zap,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import { CircularProgressRing } from './CircularProgressRing';
import { 
  NETWORK_SPECTRUM_TIERS, 
  ONION_CIRCUIT_STEPS, 
  DARK_WEB_STUDY_OBJECTIVES, 
  TOR_SCRAPER_SCRIPTS, 
  SAMPLE_TOR_CONSENSUS_SNIPPET 
} from '../data/darkWebData';
import { STORAGE_KEYS } from '../data/appConfig';

export const DarkWebBlueprintView: React.FC = () => {
  // Navigation sub-tabs inside Dark Web module
  const [activeSubSection, setActiveSubSection] = useState<'spectrum' | 'handshake' | 'dashboard' | 'scraper'>('spectrum');

  // Sub-Tab 1: Spectrum tier selected for deep dive
  const [selectedTierId, setSelectedTierId] = useState<string>('dark-web');

  // Sub-Tab 2: Interactive Circuit Handshake Step
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSimulatingCircuit, setIsSimulatingCircuit] = useState<boolean>(false);

  // Sub-Tab 3: LocalStorage Dashboard State
  const [completedObjectives, setCompletedObjectives] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kaybit_ceh_darkweb_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [userCustomNotes, setUserCustomNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('kaybit_ceh_darkweb_notes') || '';
    } catch {
      return '';
    }
  });
  const [notesSaveStatus, setNotesSaveStatus] = useState<boolean>(false);

  // Sub-Tab 4: Scraper Script Language & Live Parser Simulator
  const [selectedScriptLang, setSelectedScriptLang] = useState<string>('Python');
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [simulatorInputText, setSimulatorInputText] = useState<string>(SAMPLE_TOR_CONSENSUS_SNIPPET);
  const [extractedIps, setExtractedIps] = useState<string[]>([]);
  const [simulatorRan, setSimulatorRan] = useState<boolean>(false);
  const [copiedIptables, setCopiedIptables] = useState<boolean>(false);

  // Persist completed objectives
  useEffect(() => {
    try {
      localStorage.setItem('kaybit_ceh_darkweb_progress', JSON.stringify(completedObjectives));
    } catch (e) {
      console.error('Failed to save dark web progress to localStorage', e);
    }
  }, [completedObjectives]);

  // Persist user notes
  const handleSaveNotes = () => {
    try {
      localStorage.setItem('kaybit_ceh_darkweb_notes', userCustomNotes);
      setNotesSaveStatus(true);
      setTimeout(() => setNotesSaveStatus(false), 2000);
    } catch (e) {
      console.error('Failed to save dark web notes', e);
    }
  };

  // Toggle objective checkbox
  const toggleObjective = (id: string) => {
    setCompletedObjectives((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Circuit simulator auto-play
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulatingCircuit) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= ONION_CIRCUIT_STEPS.length - 1) {
            setIsSimulatingCircuit(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isSimulatingCircuit]);

  // Handle Regex extraction in live simulator
  const handleRunSimulatorRegex = () => {
    // Strict IPv4 dotted quad regex
    const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const matches = simulatorInputText.match(ipv4Regex) || [];
    
    // Filter private/loopback/bogon addresses
    const validPublicIps = Array.from(new Set(matches)).filter((ip) => {
      const parts = ip.split('.').map(Number);
      // Filter 127.x.x.x
      if (parts[0] === 127) return false;
      // Filter 10.x.x.x
      if (parts[0] === 10) return false;
      // Filter 172.16.x.x - 172.31.x.x
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
      // Filter 192.168.x.x
      if (parts[0] === 192 && parts[1] === 168) return false;
      // Filter 0.x.x.x
      if (parts[0] === 0) return false;
      return true;
    });

    setExtractedIps(validPublicIps);
    setSimulatorRan(true);
  };

  // Generate Iptables rules from extracted IPs
  const generatedIptablesRules = useMemo(() => {
    if (extractedIps.length === 0) return '';
    const rules = [
      '# Generated Netfilter / Iptables Tor Exit Node Blocklist',
      '# Total active indicators: ' + extractedIps.length,
      'iptables -N TOR_EXIT_BLACKLIST 2>/dev/null || iptables -F TOR_EXIT_BLACKLIST',
      ...extractedIps.map(ip => `iptables -A TOR_EXIT_BLACKLIST -s ${ip} -j DROP -m comment --comment "Tor_Exit"`),
      'iptables -I INPUT -j TOR_EXIT_BLACKLIST'
    ];
    return rules.join('\n');
  }, [extractedIps]);

  const copyToClipboard = (text: string, scriptId?: string) => {
    navigator.clipboard.writeText(text);
    if (scriptId) {
      setCopiedScriptId(scriptId);
      setTimeout(() => setCopiedScriptId(null), 2000);
    }
  };

  const copyIptables = () => {
    if (!generatedIptablesRules) return;
    navigator.clipboard.writeText(generatedIptablesRules);
    setCopiedIptables(true);
    setTimeout(() => setCopiedIptables(false), 2000);
  };

  // Selected script details
  const activeScript = TOR_SCRAPER_SCRIPTS.find(s => s.language === selectedScriptLang) || TOR_SCRAPER_SCRIPTS[0];

  // Selected spectrum tier
  const activeTier = NETWORK_SPECTRUM_TIERS.find(t => t.id === selectedTierId) || NETWORK_SPECTRUM_TIERS[2];

  // Progress metrics for Sub-Tab 3
  const totalObjectives = DARK_WEB_STUDY_OBJECTIVES.length;
  const completedCount = Object.values(completedObjectives).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalObjectives) * 100);

  return (
    <div id="dark-web-blueprint-root" className="space-y-6 animate-in fade-in duration-200">
      {/* Top Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-purple-400" />
                <span>CEH v13 Blueprint Core</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Network Spectrum & Threat Intel
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Domains 01, 02, 06 & 07
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Dark Web Self-Study Reference Blueprint
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Master the exact architectural boundaries between Clear Web, Deep Web, and Dark Web,
              the step-by-step cryptographic pathing of Tor onion routing sessions, and build automated
              threat intelligence exit-node scrapers in Python, Bash, Go, and Rust.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-lg font-mono font-bold text-emerald-400">3 Tiers</div>
              <div className="text-[11px] text-slate-400 font-medium">Network Spectrum</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-lg font-mono font-bold text-purple-400">3-Hop</div>
              <div className="text-[11px] text-slate-400 font-medium">Onion Circuit</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-lg font-mono font-bold text-cyan-400">4 Scripts</div>
              <div className="text-[11px] text-slate-400 font-medium">Intel Scrapers</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-lg font-mono font-bold text-amber-400">{progressPercent}%</div>
              <div className="text-[11px] text-slate-400 font-medium">Objectives Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/80 text-xs scrollbar-none">
        <button
          id="btn-sub-spectrum"
          onClick={() => setActiveSubSection('spectrum')}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeSubSection === 'spectrum'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
          }`}
        >
          <Globe className="w-4 h-4 text-purple-400" />
          <span>1. Theoretical Blueprint Breakdown</span>
        </button>

        <button
          id="btn-sub-handshake"
          onClick={() => setActiveSubSection('handshake')}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeSubSection === 'handshake'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
          }`}
        >
          <Network className="w-4 h-4 text-emerald-400" />
          <span>2. Onion Routing Handshake Mechanics</span>
        </button>

        <button
          id="btn-sub-dashboard"
          onClick={() => setActiveSubSection('dashboard')}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeSubSection === 'dashboard'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>3. Injectable Bootstrap & LocalStorage Dashboard</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            {completedCount}/{totalObjectives}
          </span>
        </button>

        <button
          id="btn-sub-scraper"
          onClick={() => setActiveSubSection('scraper')}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap border ${
            activeSubSection === 'scraper'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
          }`}
        >
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>4. Automated Tor Exit Node Scraper</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
            Live Lab
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: THEORETICAL BLUEPRINT BREAKDOWN */}
      {/* ========================================================================= */}
      {activeSubSection === 'spectrum' && (
        <div className="space-y-6">
          {/* Top 3-Card Spectrum Delineation Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NETWORK_SPECTRUM_TIERS.map((tier) => {
              const isSelected = tier.id === selectedTierId;
              const isDark = tier.id === 'dark-web';
              const isDeep = tier.id === 'deep-web';
              const isClear = tier.id === 'clear-web';

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                    isSelected
                      ? isDark 
                        ? 'bg-purple-950/40 border-purple-500/70 shadow-lg shadow-purple-950/50' 
                        : isDeep
                          ? 'bg-blue-950/40 border-blue-500/70 shadow-lg shadow-blue-950/50'
                          : 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border ${
                        isDark 
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' 
                          : isDeep
                            ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {tier.estimatedVolume}
                      </span>
                      {isSelected && (
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Active View
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {isDark && <Lock className="w-4 h-4 text-purple-400" />}
                        {isDeep && <Server className="w-4 h-4 text-blue-400" />}
                        {isClear && <Globe className="w-4 h-4 text-emerald-400" />}
                        <span>{tier.name}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{tier.commonAlias}</p>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <span className="text-slate-500 font-mono">DNS:</span>
                        <span className="line-clamp-2">{tier.dnsMechanism}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-slate-500 font-mono">Access:</span>
                        <span className="line-clamp-2">{tier.accessMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Click to expand deep dive</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Breakdown Card for the Selected Tier */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Tier Analysis
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400">{activeTier.estimatedVolume}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {activeTier.name} — Technical Architecture & Exam Scope
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {activeTier.portsAndProtocols.map((port, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono text-xs">
                    {port}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Comparative Attributes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Indexing & DNS Mechanics */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Search Engine Crawler & Indexing Mechanism</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeTier.indexingMechanism}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>DNS Resolution & Name Server Mapping</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeTier.dnsMechanism}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-purple-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Encryption & Cryptographic Handshake</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeTier.encryptionSecurity}
                  </p>
                </div>
              </div>

              {/* Right Column: Characteristics & Real-World Examples */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Core Technical Characteristics</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeTier.coreCharacteristics.map((char, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed">{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-blue-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Real-World Endpoints & Data Scope</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {activeTier.realWorldExamples.join(' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* CEH Exam Traps Warning Box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>CEH EXAM TRAPS & GOTCHAS: HIGH-FREQUENCY QUESTION PATTERNS</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeTier.cehExamTraps.map((trap, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0 font-mono">[{tIdx + 1}]</span>
                    <span className="leading-relaxed">{trap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparative Darknet Technologies: Tor vs I2P vs Freenet */}
            {activeTier.id === 'dark-web' && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-400" />
                    <span>Darknet Technology Matrix: Tor vs I2P vs Freenet</span>
                  </h4>
                  <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Routing Engine Comparison
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Tor */}
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                      <span>Tor (The Onion Router)</span>
                    </div>
                    <p className="text-slate-300">
                      <strong>Routing Architecture:</strong> Circuit-switched Onion Routing (3-hop circuits: Guard → Middle → Exit).
                    </p>
                    <p className="text-slate-400">
                      <strong>Primary Purpose:</strong> Out-proxying anonymously onto the Clear Web via Exit Nodes, as well as native .onion hidden services.
                    </p>
                    <p className="text-slate-400">
                      <strong>Directory Management:</strong> Centralized Directory Authorities that sign and distribute a shared consensus document.
                    </p>
                  </div>

                  {/* I2P */}
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
                      <span>I2P (Invisible Internet Project)</span>
                    </div>
                    <p className="text-slate-300">
                      <strong>Routing Architecture:</strong> Packet-switched <em>Garlic Routing</em> (bundles multiple messages into encrypted cloves) with unidirectional inbound and outbound tunnels.
                    </p>
                    <p className="text-slate-400">
                      <strong>Primary Purpose:</strong> Internal-only darknet ("network within a network") optimized for hidden eepsites, decentralized email (I2P-Bote), and P2P storage.
                    </p>
                    <p className="text-slate-400">
                      <strong>Directory Management:</strong> Fully decentralized distributed database (netDb) using Kademlia DHT.
                    </p>
                  </div>

                  {/* Freenet */}
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                      <span>Freenet / Hyphanet</span>
                    </div>
                    <p className="text-slate-300">
                      <strong>Routing Architecture:</strong> Decentralized peer-to-peer distributed data store with dynamic small-world routing.
                    </p>
                    <p className="text-slate-400">
                      <strong>Primary Purpose:</strong> Censorship-resistant static publishing and permanent encrypted file hosting; no live interactive sessions.
                    </p>
                    <p className="text-slate-400">
                      <strong>Cryptographic Keys:</strong> Content Hash Keys (CHK), Signed Subspace Keys (SSK), and Updatable Subspace Keys (USK).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ADVANCED ONION ROUTING HANDSHAKE MECHANICS */}
      {/* ========================================================================= */}
      {activeSubSection === 'handshake' && (
        <div className="space-y-6">
          {/* Interactive Circuit Flow Visualizer */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  CEH Exam Core: Cryptographic Pathing & Packet Inspection
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Tor Session Packet Traversal & Handshake Mechanics
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-auto-simulate-circuit"
                  onClick={() => setIsSimulatingCircuit(!isSimulatingCircuit)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    isSimulatingCircuit
                      ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isSimulatingCircuit ? 'Pause Simulation' : 'Auto Step-Through'}</span>
                </button>

                <button
                  id="btn-reset-circuit-step"
                  onClick={() => {
                    setIsSimulatingCircuit(false);
                    setActiveStepIndex(0);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                  title="Reset to Step 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stepper Node Flow Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {ONION_CIRCUIT_STEPS.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;

                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => {
                      setIsSimulatingCircuit(false);
                      setActiveStepIndex(idx);
                    }}
                    className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                      isActive
                        ? 'bg-purple-950/60 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                        : isPassed
                          ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                          : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        Step {step.stepNumber}
                      </span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">{step.phase}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate mt-1">{step.cellType}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Step Deep Dive Box */}
            {(() => {
              const curStep = ONION_CIRCUIT_STEPS[activeStepIndex];
              return (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-6 animate-in fade-in duration-150">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                        <span>Phase {curStep.stepNumber} of 6</span>
                        <span>•</span>
                        <span className="font-bold text-white">{curStep.phase}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                        Cell Type: <span className="font-mono text-emerald-400">{curStep.cellType}</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {curStep.source}
                      </span>
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                      <span className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {curStep.destination}
                      </span>
                    </div>
                  </div>

                  {/* Packet Peeling & Action Description */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1.5">
                          Cryptographic Operation & Cell Payload
                        </h4>
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300">
                          {curStep.action}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-1.5">
                          Detailed Engineering Rationale
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {curStep.explanation}
                        </p>
                      </div>
                    </div>

                    {/* CEH Visibility Matrix: What Does This Node Know? */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Node Knowledge & Visibility Matrix (CEH Focus)</span>
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500">Current Node: {curStep.destination}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            curStep.whatNodeKnows.knowsClientIP 
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          }`}>
                            <span>Knows Originating Client IP?</span>
                            <span className="font-mono font-bold">
                              {curStep.whatNodeKnows.knowsClientIP ? 'YES (Exposed)' : 'NO (Hidden)'}
                            </span>
                          </div>

                          <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                            curStep.whatNodeKnows.knowsTargetDestination 
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          }`}>
                            <span>Knows Target Destination?</span>
                            <span className="font-mono font-bold">
                              {curStep.whatNodeKnows.knowsTargetDestination ? 'YES (Known)' : 'NO (Blind)'}
                            </span>
                          </div>

                          <div className={`p-2.5 rounded-lg border flex items-center justify-between sm:col-span-2 ${
                            curStep.whatNodeKnows.canReadPayload 
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          }`}>
                            <div className="flex items-center gap-2">
                              {curStep.whatNodeKnows.canReadPayload ? <Unlock className="w-4 h-4 text-rose-400" /> : <Lock className="w-4 h-4 text-emerald-400" />}
                              <span>Can Sniff Raw Application Payload?</span>
                            </div>
                            <span className="font-mono font-bold">
                              {curStep.whatNodeKnows.canReadPayload ? 'YES (If HTTP Port 80!)' : 'NO (Multi-Layer Encrypted)'}
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
                          <strong className="text-slate-200">Security Significance: </strong>
                          {curStep.securityImpact}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Crucial CEH Exam Callout on Exit Node Sniffing */}
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-rose-300 text-sm">
                  CRITICAL CEH EXAM BULLET: The Exit Node Vulnerability Trap
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  A common misconception tested on the CEH exam is that Tor guarantees complete end-to-end encryption for any website.
                  <strong> It does not!</strong> Tor only encrypts traffic <em>inside</em> the 3-hop Tor circuit. 
                  When the Exit Node transmits packets to the target server, if the website uses unencrypted <strong>HTTP (Port 80)</strong>, 
                  the Exit Node operator can capture usernames, passwords, cookies, and session tokens via Wireshark or perform SSL stripping.
                  <strong> Only end-to-end HTTPS (Port 443) protects the payload from the Exit Node operator.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: INJECTABLE BOOTSTRAP & LOCALSTORAGE DASHBOARD */}
      {/* ========================================================================= */}
      {activeSubSection === 'dashboard' && (
        <div className="space-y-6">
          {/* Dashboard Summary Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Persistent Self-Study Engine (HTML5 LocalStorage)
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Dark Web Knowledge Readiness & Verification Tracker
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track your mastery of network spectrum boundaries, cell mechanics, and threat intelligence. 
                  Saved automatically to your browser cache.
                </p>
              </div>

              {/* Progress Ring / Bar */}
              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-cyan-400">{completedCount} / {totalObjectives}</div>
                  <div className="text-[11px] text-slate-400">Objectives Verified</div>
                </div>
                <CircularProgressRing
                  percentage={progressPercent}
                  size={64}
                  strokeWidth={5}
                  color="#22d3ee"
                  trackColor="#1e293b"
                />
              </div>
            </div>

            {/* Checklist Objectives List */}
            <div className="space-y-4">
              {DARK_WEB_STUDY_OBJECTIVES.map((obj, oIdx) => {
                const isDone = !!completedObjectives[obj.id];
                const isAnswerRevealed = !!revealedAnswers[obj.id];

                return (
                  <div
                    key={obj.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isDone 
                        ? 'bg-slate-950/70 border-emerald-500/40' 
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <button
                          id={`check-obj-${obj.id}`}
                          onClick={() => toggleObjective(obj.id)}
                          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-all shrink-0 ${
                            isDone 
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' 
                              : 'bg-slate-800 border border-slate-700 text-transparent hover:border-slate-500'
                          }`}
                          title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              Objective {oIdx + 1}
                            </span>
                            <span className="text-xs font-mono text-cyan-400 font-semibold">
                              {obj.cehSignificance}
                            </span>
                          </div>

                          <h4 className={`text-sm font-bold transition-colors ${
                            isDone ? 'text-emerald-300' : 'text-slate-100'
                          }`}>
                            {obj.title}
                          </h4>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {obj.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setRevealedAnswers(prev => ({
                            ...prev,
                            [obj.id]: !prev[obj.id]
                          }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors shrink-0 flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{isAnswerRevealed ? 'Hide Rationale' : 'Test Question'}</span>
                      </button>
                    </div>

                    {/* Expandable Verification Question & Exam Answer */}
                    {isAnswerRevealed && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 bg-slate-900/60 p-3 rounded-lg animate-in fade-in duration-150">
                        <div>
                          <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                            CEH Verification Question:
                          </span>
                          <p className="text-xs font-semibold text-slate-200 mt-0.5">
                            {obj.verificationQuestion}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-300 leading-relaxed font-mono">
                          <span className="text-slate-400 font-bold block mb-1">Official Exam Rationale:</span>
                          {obj.verifiedAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Notes Scratchpad Section (Persistent) */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">Student Personal Dark Web Notes & Snippets</h4>
                </div>
                <button
                  id="btn-save-darkweb-notes"
                  onClick={handleSaveNotes}
                  className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{notesSaveStatus ? 'Saved to LocalStorage!' : 'Save Notes'}</span>
                </button>
              </div>

              <textarea
                value={userCustomNotes}
                onChange={(e) => setUserCustomNotes(e.target.value)}
                placeholder="Write your custom exam mnemonics, Tor proxy configurations (e.g. SOCKS5 127.0.0.1:9050), or threat intel queries here..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: AUTOMATED TOR EXIT NODE IP THREAT INTEL SCRAPER */}
      {/* ========================================================================= */}
      {activeSubSection === 'scraper' && (
        <div className="space-y-6">
          {/* Scraper Overview Header */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Threat Intelligence Engineering Lab
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Automated Tor Exit Node IP Scraper & Firewall Rule Generator
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Query live official Tor Directory Consensus feeds, isolate IP addresses with regular expressions,
                  and export high-speed drop rules for iptables, ipset, and SIEM feeds.
                </p>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {TOR_SCRAPER_SCRIPTS.map((script) => (
                  <button
                    key={script.language}
                    onClick={() => setSelectedScriptLang(script.language)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      selectedScriptLang === script.language
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {script.language}
                  </button>
                ))}
              </div>
            </div>

            {/* Script Metadata Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-mono block text-[10px]">EXECUTION SPEED:</span>
                <span className="font-mono font-bold text-emerald-400">{activeScript.speedRating}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-mono block text-[10px]">COMPLEXITY:</span>
                <span className="font-mono font-bold text-amber-400">{activeScript.executionComplexity}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-mono block text-[10px]">FILENAME:</span>
                <span className="font-mono font-bold text-slate-200">{activeScript.filename}</span>
              </div>
            </div>

            {/* Regex Pattern Explainer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Strict IPv4 Dotted-Quad Regular Expression (0.0.0.0 to 255.255.255.255)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">RFC 791 Compliant</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-xs text-emerald-400 overflow-x-auto select-all">
                {activeScript.regexPattern}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This expression strictly bounds every octet to integers 0-255 (<code className="text-slate-300">25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?</code>), 
                preventing malformed strings or false-positive integers from entering the security boundary.
              </p>
            </div>

            {/* Code Viewer with Copy Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">
                  Source Code: {activeScript.filename}
                </span>
                <button
                  id={`btn-copy-script-${activeScript.id}`}
                  onClick={() => copyToClipboard(activeScript.code, activeScript.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    copiedScriptId === activeScript.id
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedScriptId === activeScript.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Script</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-[380px] leading-relaxed">
                <code>{activeScript.code}</code>
              </pre>
            </div>

            {/* Execution Instructions */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-300">
                Setup & Execution Commands:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                {activeScript.usageInstructions.map((cmd, cIdx) => (
                  <li key={cIdx} className="p-2 rounded bg-slate-900 border border-slate-800/70 text-emerald-300">
                    $ {cmd}
                  </li>
                ))}
              </ul>
            </div>

            {/* ========================================================================= */}
            {/* LIVE IN-BROWSER REGEX PARSER SIMULATOR */}
            {/* ========================================================================= */}
            <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/40 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Interactive In-Browser Tor Consensus Parser Simulator</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-run-consensus-regex"
                    onClick={handleRunSimulatorRegex}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Execute Regex Parser</span>
                  </button>

                  <button
                    onClick={() => {
                      setSimulatorInputText(SAMPLE_TOR_CONSENSUS_SNIPPET);
                      setExtractedIps([]);
                      setSimulatorRan(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs border border-slate-700"
                    title="Reset sample text"
                  >
                    Reset Sample
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Input Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>Raw Directory Consensus Descriptors:</span>
                    <span className="text-[10px] text-slate-500">Editable Test Stream</span>
                  </label>
                  <textarea
                    value={simulatorInputText}
                    onChange={(e) => setSimulatorInputText(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Right: Extracted IPs & Iptables generation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      Harvested Exit Nodes: <strong className="text-amber-400">{extractedIps.length}</strong>
                    </span>
                    {generatedIptablesRules && (
                      <button
                        id="btn-copy-iptables-rules"
                        onClick={copyIptables}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedIptables ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIptables ? 'Copied!' : 'Copy Iptables Rules'}</span>
                      </button>
                    )}
                  </div>

                  {simulatorRan ? (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 h-[175px] overflow-y-auto font-mono text-xs space-y-1.5">
                      {extractedIps.length === 0 ? (
                        <div className="text-slate-500 py-8 text-center">
                          No valid public IPv4 addresses identified matching consensus regex.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1.5">
                            {extractedIps.map((ip) => (
                              <span key={ip} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                                {ip}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                            <strong>Note:</strong> Bogon and RFC 1918 private IPs (e.g. 10.0.0.5, 127.0.0.1) were automatically discarded by the validation filter.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 h-[175px] flex flex-col items-center justify-center text-center text-xs text-slate-500">
                      <Terminal className="w-6 h-6 text-slate-600 mb-2" />
                      <span>Click &quot;Execute Regex Parser&quot; to extract and validate exit node IPs.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Generated Iptables / Nftables preview box */}
              {generatedIptablesRules && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-mono text-emerald-400">Generated Netfilter Iptables Rules:</span>
                  <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[140px]">
                    <code>{generatedIptablesRules}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

