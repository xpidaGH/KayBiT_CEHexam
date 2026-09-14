import React, { useState, useEffect, useRef } from 'react';
import { 
  Minimize2, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Play, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  FolderDown, 
  HelpCircle, 
  Sparkles, 
  CheckSquare, 
  Square,
  CornerDownLeft,
  ChevronDown
} from 'lucide-react';
import { PRACTICAL_PILLARS, BIG_THREE_REPOSITORIES } from '../data/cehPracticalData';
import { PracticalPillar } from '../types';
import { TERMINAL_THEMES, DEFAULT_TERMINAL_THEME, TerminalTheme } from '../data/terminalThemes';
import { TerminalThemeSelector } from './TerminalThemeSelector';
import { STORAGE_KEYS } from '../data/appConfig';

interface PracticalZenModeProps {
  onExitZenMode: () => void;
  initialPillarId?: string;
  terminalTheme?: TerminalTheme;
  onSelectTerminalTheme?: (theme: TerminalTheme) => void;
}

interface TerminalLog {
  id: string;
  command?: string;
  output: string;
  type: 'cmd' | 'output' | 'system' | 'error' | 'success';
}

export const PracticalZenMode: React.FC<PracticalZenModeProps> = ({
  onExitZenMode,
  initialPillarId = PRACTICAL_PILLARS[0].id,
  terminalTheme: propTheme,
  onSelectTerminalTheme,
}) => {
  // Terminal theme state
  const [internalTheme, setInternalTheme] = useState<TerminalTheme>(() => {
    if (propTheme) return propTheme;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TERMINAL_THEME);
      if (saved) {
        const found = TERMINAL_THEMES.find((t) => t.id === saved);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return DEFAULT_TERMINAL_THEME;
  });

  const activeTerminalTheme = propTheme || internalTheme;

  const handleThemeChange = (theme: TerminalTheme) => {
    setInternalTheme(theme);
    onSelectTerminalTheme?.(theme);
    try {
      localStorage.setItem(STORAGE_KEYS.TERMINAL_THEME, theme.id);
    } catch {
      // ignore
    }
  };

  // Active pillar state
  const [selectedPillarId, setSelectedPillarId] = useState<string>(initialPillarId);
  const currentPillar = PRACTICAL_PILLARS.find((p) => p.id === selectedPillarId) || PRACTICAL_PILLARS[0];

  // Checklist state per pillar
  const [completedSteps, setCompletedSteps] = useState<Record<string, Record<number, boolean>>>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Terminal input & history state
  const [commandInput, setCommandInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flag verification state
  const [flagInput, setFlagInput] = useState<string>('');
  const [flagFeedback, setFlagFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Initial welcome message in terminal
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      output: `╔════════════════════════════════════════════════════════════════════════════════════════╗\n║   CEH v13 PRACTICAL LAB CONSOLE • ZEN FOCUS ENVIRONMENT                               ║\n║   Target Network: 192.168.1.0/24 • Virtual Kali Attacker: 192.168.1.105 (Ready)        ║\n║   Open-Notes & Open-Documentation Mode • Focus: Lab Instructions & CLI Terminal        ║\n╚════════════════════════════════════════════════════════════════════════════════════════╝\nType 'help' to see quick lab utilities or click '▶ Run in Terminal' on any step on the left.`,
      type: 'system'
    }
  ]);

  // Handle escape key to exit Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExitZenMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitZenMode]);

  // Auto-scroll terminal to bottom on output update
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleStep = (pillarId: string, stepIndex: number) => {
    setCompletedSteps((prev) => {
      const pillarSteps = prev[pillarId] || {};
      return {
        ...prev,
        [pillarId]: {
          ...pillarSteps,
          [stepIndex]: !pillarSteps[stepIndex]
        }
      };
    });
  };

  // Realistic terminal command execution simulation
  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Add to history
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);
    setCommandInput('');

    // Handle clear
    if (trimmed.toLowerCase() === 'clear') {
      setTerminalLogs([]);
      return;
    }

    // Generate realistic outputs based on command content
    let simulatedOutput = '';
    let logType: TerminalLog['type'] = 'output';

    const lower = trimmed.toLowerCase();

    if (lower === 'help') {
      simulatedOutput = `Available CEH Practical Commands & Syntaxes in this Lab:\n  nmap -sS -sV -O <target>      TCP SYN Stealth Port & Version Scan\n  nmap -sn 192.168.1.0/24       Subnet ping sweep / host discovery\n  sqlmap -u "<url>" --dbs       Automated SQL injection database enum\n  hydra -L <users> -P <pass>    Service brute-forcing (SSH, FTP, HTTP)\n  enum4linux -a <target>        SMB & NetBIOS user and share enum\n  steghide extract -sf <file>   Extract hidden data from JPEG/BMP\n  tshark -r <pcap> -Y <filter>  Wireshark command-line packet inspection\n  john --format=NT <hashes>     Crack Windows NTLM SAM hashes\n  cat <file> | ls | whoami      Standard Unix file navigation\n  clear                         Clear terminal screen`;
      logType = 'system';
    } else if (lower.startsWith('nmap')) {
      if (lower.includes('-sn')) {
        simulatedOutput = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-11 22:30 EDT\nNmap scan report for 192.168.1.1 (Gateway)\nHost is up (0.00042s latency).\nNmap scan report for 192.168.1.10 (DC01.local.corp)\nHost is up (0.0012s latency).\nNmap scan report for 192.168.1.15 (Target-WebSRV)\nHost is up (0.00085s latency).\nNmap scan report for 192.168.1.20 (Storage-NAS)\nHost is up (0.0016s latency).\nNmap done: 256 IP addresses (4 hosts up) scanned in 2.34 seconds\n[+] Output saved to live_hosts.txt`;
        logType = 'success';
      } else {
        simulatedOutput = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-11 22:30 EDT\nNmap scan report for ${currentPillar.scenarioWalkthrough.target}\nHost is up (0.00089s latency).\nNot shown: 994 closed tcp ports (reset)\nPORT     STATE SERVICE     VERSION\n21/tcp   open  ftp         vsftpd 3.0.3 (Anonymous FTP allowed)\n22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu 3ubuntu0.1\n80/tcp   open  http        Apache httpd 2.4.52 ((Ubuntu))\n139/tcp  open  netbios-ssn Samba smbd 4.6.2\n445/tcp  open  netbios-ssn Samba smbd 4.6.2\n3306/tcp open  mysql       MySQL 8.0.32-commercial\nDevice type: general purpose\nRunning: Linux 5.4 - 5.15\nOS CPE: cpe:/o:linux:linux_kernel:5\nOS details: Linux 5.4 - 5.15\nNetwork Distance: 1 hop\nService Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel\n\nNmap done: 1 IP address (1 host up) scanned in 4.82 seconds`;
        logType = 'success';
      }
    } else if (lower.startsWith('sqlmap')) {
      simulatedOutput = `[*] starting @ 22:30:15\n[INFO] testing connection to the target URL\n[INFO] testing if GET parameter 'id' is dynamic\n[INFO] heuristics detected that parameter 'id' might be vulnerable\n[INFO] confirming boolean-based blind injection on 'id'\n[INFO] parameter 'id' is vulnerable. Back-end DBMS: MySQL >= 5.0\navailable databases [3]:\n[*] dvwa\n[*] information_schema\n[*] target_app\n\n[+] Fetching tables for database 'target_app'...\n[+] [3 tables]: users, order_logs, secrets_vault\n[+] Dump of 'secrets_vault':\n    | id | key_name   | secret_flag                             |\n    | 1  | admin_auth | flag{sqlmap_tables_dumped_db_v13}       |`;
      logType = 'success';
    } else if (lower.startsWith('hydra')) {
      simulatedOutput = `Hydra v9.5 (c) 2026 by van Hauser / THC - Starting attack\n[DATA] max 4 tasks per target, 1 target, 2048 login tries\n[STATUS] 242.00 tries/min, 484 tries in 00:02h, 1564 to do\n[22][ssh] host: ${currentPillar.scenarioWalkthrough.target}   login: admin   password: password123\n[STATUS] Attack finished: 1 valid password found. Credentials saved to hydra_cracked.txt`;
      logType = 'success';
    } else if (lower.startsWith('enum4linux')) {
      simulatedOutput = `Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ )\nTarget ........... ${currentPillar.scenarioWalkthrough.target}\nRID Range ........ 500-550,1000-1050\nUsername ......... ''\nPassword ......... ''\n\n[+] Got domain/workgroup name: WORKGROUP\n[+] Session Check: Server allows session using username '', password ''\n[+] Enumerating users using SID s-1-5-21-3456789-...\n    user:[Administrator] rid:[0x1f4]\n    user:[Guest] rid:[0x1f5]\n    user:[ceh_candidate] rid:[0x3e8]\n[+] Share Enumeration:\n    Disk: C$ (Default Share - Access Denied)\n    Disk: Shared_Documents (Permissions: READ/WRITE)\n    IPC$: IPC Service (Permissions: READ)\n[+] enum4linux complete.`;
      logType = 'success';
    } else if (lower.startsWith('steghide') || lower.includes('openstego') || lower.includes('zsteg')) {
      simulatedOutput = `Enter passphrase: ""\nwrote extracted data to "extracted_credentials.txt".\n\n$ cat extracted_credentials.txt\nConfidential Exfiltration Archive v2.1\nRoot Administrator Token: flag{steghide_passphrase_cracked_ceh}\nBackup SSH Key: id_rsa.backup`;
      logType = 'success';
    } else if (lower.startsWith('tshark') || lower.startsWith('wireshark')) {
      simulatedOutput = `Running as user "root" and group "root". This could be dangerous.\nCapturing on 'capture_exam.pcap'\n1 0.000000 192.168.1.105 -> 192.168.1.15 HTTP/1.1 POST /admin/login.php\n  POST /admin/login.php HTTP/1.1\\r\\n\n  User-Agent: Mozilla/5.0 (Kali Linux)\\r\\n\n  Form item: "user" = "auditor"\n  Form item: "pass" = "WinterExam2026!"\n  Flag parameter: "flag" = "flag{wireshark_cleartext_cred_intercepted}"`;
      logType = 'success';
    } else if (lower.startsWith('john') || lower.startsWith('hashcat')) {
      simulatedOutput = `Loaded 1 password hash (NT [MD4 128/128 AVX 4x3])\nWill run 4 OpenMP threads\nPress 'q' or Ctrl-C to abort\npassword123      (Administrator)\n1g 0:00:00:01 DONE (2026-09-11 22:31) 0.82g/s 102400p/s\n[+] Hash cracked: Administrator : password123 (NTLM Mode 1000)`;
      logType = 'success';
    } else if (lower === 'ls' || lower === 'dir') {
      simulatedOutput = `total 248\n-rw-r--r-- 1 kali kali   240 Sep 11 22:00 live_hosts.txt\n-rw-r--r-- 1 kali kali  1840 Sep 11 22:05 nmap_full_scan.nmap\n-rw-r--r-- 1 kali kali   512 Sep 11 22:10 hashes.txt\n-rw-r--r-- 1 kali kali 84120 Sep 11 22:15 capture_exam.pcap\n-rw-r--r-- 1 kali kali 45210 Sep 11 22:20 suspicious_photo.jpg\ndrwxr-xr-x 2 kali kali  4096 Sep 11 22:00 Desktop/CEH_PRACTICAL/`;
    } else if (lower.startsWith('cat')) {
      if (lower.includes('live_hosts')) {
        simulatedOutput = `192.168.1.1\n192.168.1.10\n192.168.1.15\n192.168.1.20`;
      } else if (lower.includes('hashes')) {
        simulatedOutput = `Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::\nceh_user:1000:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::`;
      } else {
        simulatedOutput = `Contents of ${trimmed.replace('cat', '').trim()}:\n# CEH Exam Target Data File\ntarget_ip=${currentPillar.scenarioWalkthrough.target}\nverified_objective=${currentPillar.scenarioWalkthrough.objective}`;
      }
    } else if (lower === 'whoami') {
      simulatedOutput = `kali (uid=1000 gid=1000 groups=1000(kali),27(sudo))`;
    } else if (lower === 'id') {
      simulatedOutput = `uid=1000(kali) gid=1000(kali) groups=1000(kali),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),109(netdev)`;
    } else if (lower === 'uname -a') {
      simulatedOutput = `Linux kali 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.27-1kali1 (2026-05-12) x86_64 GNU/Linux`;
    } else {
      simulatedOutput = `[+] Executing: ${trimmed}\n[*] Target responding: ${currentPillar.scenarioWalkthrough.target}\n[OK] Command executed successfully without errors. Simulated raw output matches exam requirements.`;
    }

    setTerminalLogs((prev) => [
      ...prev,
      { id: `cmd-${Date.now()}`, command: trimmed, output: simulatedOutput, type: logType }
    ]);
  };

  const handleRunCommandFromList = (cmdString: string) => {
    // Substitute real target if needed
    const runnable = cmdString.includes('192.168.1') 
      ? cmdString 
      : `${cmdString} ${currentPillar.scenarioWalkthrough.target}`;
    executeCommand(runnable);
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = flagInput.trim().toLowerCase();
    if (!cleaned) return;

    if (
      cleaned.includes('flag{') || 
      cleaned.includes('password') || 
      cleaned.includes('sqli') || 
      cleaned.includes('admin') ||
      cleaned.length >= 6
    ) {
      setFlagFeedback({
        text: `Flag verified! Excellent work on ${currentPillar.title}.`,
        success: true
      });
      // Also log success in the terminal
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `flag-${Date.now()}`,
          command: `submit-flag "${flagInput}"`,
          output: `[+] FLAG SUBMISSION SUCCESSFUL!\n    Challenge flag: ${flagInput}\n    Status: ACCEPTED (+1 point towards the 14/20 passing threshold)`,
          type: 'success'
        }
      ]);
    } else {
      setFlagFeedback({
        text: 'Flag incorrect or unrecognized format. Check the command output in the terminal.',
        success: false
      });
    }
  };

  const pillarSteps = completedSteps[currentPillar.id] || {};
  const completedCount = Object.values(pillarSteps).filter(Boolean).length;
  const totalSteps = currentPillar.scenarioWalkthrough.steps.length;

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Distraction-Free Control Bar */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Zen Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ZEN MODE ACTIVE</span>
          </div>

          {/* Scenario Selector Dropdown */}
          <div className="relative flex items-center">
            <label htmlFor="pillar-selector" className="sr-only">Select Practical Pillar</label>
            <select
              id="pillar-selector"
              value={selectedPillarId}
              onChange={(e) => {
                setSelectedPillarId(e.target.value);
                setFlagFeedback(null);
                setFlagInput('');
              }}
              className="bg-slate-950 border border-slate-700 text-xs text-white font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer pr-8"
            >
              {PRACTICAL_PILLARS.map((pillar) => (
                <option key={pillar.id} value={pillar.id}>
                  {pillar.title} ({pillar.examWeight} of Exam)
                </option>
              ))}
            </select>
          </div>

          {/* Target details pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-teal-400 font-bold">Target:</span>
            <span>{currentPillar.scenarioWalkthrough.target}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{completedCount}/{totalSteps} Steps Complete</span>
          </div>
        </div>

        {/* Right Exit Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-clear-term"
            onClick={() => setTerminalLogs([])}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            title="Clear terminal buffer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Clear CLI</span>
          </button>

          <button
            id="btn-exit-zen-mode"
            onClick={onExitZenMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm shadow-emerald-500/20"
            title="Exit Zen Mode and restore standard navigation (Escape key)"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Zen Mode</span>
            <kbd className="hidden sm:inline-block text-[10px] bg-emerald-600/30 text-emerald-950 border border-emerald-600/40 px-1 py-0.2 rounded font-mono">
              Esc
            </kbd>
          </button>
        </div>
      </header>

      {/* Main Split-Screen Zen Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 sm:p-4 overflow-hidden">
        {/* LEFT PANE: Lab Instructions & Guided Tasks (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Objective & Target Information Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  {currentPillar.examWeight} Practical Weight
                </span>
                <h1 className="text-base font-bold text-white mt-0.5">
                  {currentPillar.title}
                </h1>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold shrink-0">
                Live Lab Target
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1 font-mono">
              <div className="text-slate-300">
                <strong className="text-teal-400">Target Host:</strong> {currentPillar.scenarioWalkthrough.target}
              </div>
              <div className="text-slate-300">
                <strong className="text-teal-400">Lab Objective:</strong> {currentPillar.scenarioWalkthrough.objective}
              </div>
              <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-900">
                <strong>Core Tools:</strong> {currentPillar.coreTools.join(', ')}
              </div>
            </div>
          </div>

          {/* Step-by-Step Interactive Checklist */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lab Execution Steps ({completedCount}/{totalSteps})</span>
              </h2>
              <span className="text-[11px] text-slate-500">Check off as you complete</span>
            </div>

            <div className="space-y-2">
              {currentPillar.scenarioWalkthrough.steps.map((step, idx) => {
                const isChecked = !!pillarSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(currentPillar.id, idx)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-950'
                    }`}
                  >
                    <button
                      type="button"
                      id={`step-check-${currentPillar.id}-${idx}`}
                      className="mt-0.5 text-emerald-400 focus:outline-none shrink-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 hover:text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1 leading-relaxed">
                      <span className={`font-medium ${isChecked ? 'line-through text-slate-400' : ''}`}>
                        {step}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Essential Command Palette (Click to Run in Right Terminal) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <TerminalIcon className="w-4 h-4 text-teal-400" />
                <span>Essential Practice Commands</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-mono">One-click execution</span>
            </div>

            <div className="space-y-2.5">
              {currentPillar.essentialCommands.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono text-emerald-300 font-semibold break-all">
                      {item.cmd}
                    </code>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        id={`btn-run-cmd-${idx}`}
                        onClick={() => handleRunCommandFromList(item.cmd)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                        title="Execute in the right command terminal"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.cmd)}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] transition-colors"
                        title="Copy command"
                      >
                        {copiedText === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{item.explanation}</p>
                  <p className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                    <span className="text-teal-400 font-semibold">Flags:</span> {item.flagDetails}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Flag Verification Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Submit Lab Flag</span>
            </h2>
            <form onSubmit={handleFlagSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="e.g. flag{...} or discovered password"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                >
                  Verify
                </button>
              </div>
              {flagFeedback && (
                <div
                  className={`p-2 rounded-lg text-xs flex items-center gap-1.5 ${
                    flagFeedback.success
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                      : 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{flagFeedback.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* RIGHT PANE: Dedicated Command Terminal Simulator (7 Cols) */}
        <div 
          className="lg:col-span-7 flex flex-col rounded-xl border overflow-hidden shadow-2xl h-[calc(100vh-5rem)] transition-colors"
          style={{
            backgroundColor: activeTerminalTheme.bg,
            borderColor: activeTerminalTheme.border,
          }}
        >
          {/* Terminal Window Chrome */}
          <div 
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b select-none transition-colors"
            style={{
              backgroundColor: activeTerminalTheme.bg,
              borderColor: activeTerminalTheme.border,
            }}
          >
            <div className="flex items-center gap-2">
              {/* macOS / Linux style dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              </div>
              <span 
                className="text-xs font-mono ml-2 hidden sm:inline"
                style={{ color: activeTerminalTheme.comment }}
              >
                kali@ceh-practical:~ (bash)
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              {/* Terminal Color Scheme Selector */}
              <TerminalThemeSelector
                currentThemeId={activeTerminalTheme.id}
                onSelectTheme={handleThemeChange}
              />

              <span className="hidden md:flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>TTY1 • 192.168.1.105</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  const fullText = terminalLogs.map((l) => `${l.command ? `$ ${l.command}\n` : ''}${l.output}`).join('\n\n');
                  handleCopy(fullText);
                }}
                className="hover:text-white px-1.5 py-0.5 rounded text-[10px] border transition-colors"
                style={{
                  backgroundColor: activeTerminalTheme.surface,
                  borderColor: activeTerminalTheme.border,
                  color: activeTerminalTheme.comment,
                }}
                title="Copy full terminal session text"
              >
                Copy Output
              </button>
            </div>
          </div>

          {/* Terminal Output Log Area */}
          <div 
            className="flex-1 p-3.5 overflow-y-auto font-mono text-xs space-y-3 leading-relaxed transition-colors"
            style={{
              backgroundColor: activeTerminalTheme.surface,
              color: activeTerminalTheme.text,
            }}
          >
            {terminalLogs.map((log) => (
              <div key={log.id} className="space-y-1">
                {log.command && (
                  <div className="flex items-center gap-2 font-bold">
                    <span 
                      className="select-none text-xs"
                      style={{ color: activeTerminalTheme.comment }}
                    >
                      kali@ceh-lab:~$
                    </span>
                    <span style={{ color: activeTerminalTheme.accent }}>{log.command}</span>
                  </div>
                )}
                <pre
                  className="whitespace-pre-wrap font-mono text-xs leading-relaxed"
                  style={{
                    color:
                      log.type === 'system'
                        ? activeTerminalTheme.cyan
                        : log.type === 'success'
                        ? activeTerminalTheme.prompt
                        : log.type === 'error'
                        ? activeTerminalTheme.red
                        : activeTerminalTheme.text,
                  }}
                >
                  {log.output}
                </pre>
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Quick Terminal Command Chips */}
          <div 
            className="px-3 py-1.5 border-t flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none transition-colors"
            style={{
              backgroundColor: activeTerminalTheme.bg,
              borderColor: activeTerminalTheme.border,
            }}
          >
            <span className="text-[10px] uppercase font-bold shrink-0" style={{ color: activeTerminalTheme.comment }}>Presets:</span>
            <button
              type="button"
              onClick={() => executeCommand(`nmap -sS -sV ${currentPillar.scenarioWalkthrough.target}`)}
              className="px-2 py-0.5 rounded border shrink-0 transition-colors"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
                color: activeTerminalTheme.prompt,
              }}
            >
              $ nmap -sS
            </button>
            <button
              type="button"
              onClick={() => executeCommand('nmap -sn 192.168.1.0/24')}
              className="px-2 py-0.5 rounded border shrink-0 transition-colors"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
                color: activeTerminalTheme.cyan,
              }}
            >
              $ nmap sweep
            </button>
            <button
              type="button"
              onClick={() => executeCommand(`sqlmap -u "http://${currentPillar.scenarioWalkthrough.target}/index.php?id=1" --dbs`)}
              className="px-2 py-0.5 rounded border shrink-0 transition-colors"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
                color: activeTerminalTheme.yellow,
              }}
            >
              $ sqlmap --dbs
            </button>
            <button
              type="button"
              onClick={() => executeCommand(`hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://${currentPillar.scenarioWalkthrough.target}`)}
              className="px-2 py-0.5 rounded border shrink-0 transition-colors"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
                color: activeTerminalTheme.yellow,
              }}
            >
              $ hydra ssh
            </button>
            <button
              type="button"
              onClick={() => executeCommand(`enum4linux -a ${currentPillar.scenarioWalkthrough.target}`)}
              className="px-2 py-0.5 rounded border shrink-0 transition-colors"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
                color: activeTerminalTheme.accent,
              }}
            >
              $ enum4linux
            </button>
            <button
              type="button"
              onClick={() => executeCommand('steghide extract -sf suspicious_photo.jpg')}
              className="px-2 py-0.5 rounded border shrink-0 transition-colors"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
                color: activeTerminalTheme.red,
              }}
            >
              $ steghide
            </button>
            <button
              type="button"
              onClick={() => executeCommand('clear')}
              className="px-2 py-0.5 rounded border shrink-0 transition-colors ml-auto"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
                color: activeTerminalTheme.comment,
              }}
            >
              clear
            </button>
          </div>

          {/* Interactive Command Prompt Input Bar */}
          <div 
            className="p-2.5 border-t transition-colors"
            style={{
              backgroundColor: activeTerminalTheme.bg,
              borderColor: activeTerminalTheme.border,
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeCommand(commandInput);
              }}
              className="flex items-center gap-2 border rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-emerald-500 transition-colors"
              style={{
                backgroundColor: activeTerminalTheme.surface,
                borderColor: activeTerminalTheme.border,
              }}
            >
              <span 
                className="font-mono font-bold text-xs select-none"
                style={{ color: activeTerminalTheme.prompt }}
              >
                kali@ceh-lab:~$
              </span>
              <input
                ref={inputRef}
                id="zen-terminal-input"
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (commandHistory.length > 0) {
                      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                      setHistoryIndex(nextIndex);
                      setCommandInput(commandHistory[nextIndex]);
                    }
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (historyIndex > 0) {
                      const prevIndex = historyIndex - 1;
                      setHistoryIndex(prevIndex);
                      setCommandInput(commandHistory[prevIndex]);
                    } else if (historyIndex === 0) {
                      setHistoryIndex(-1);
                      setCommandInput('');
                    }
                  }
                }}
                placeholder="Type command here (e.g. nmap -sS 192.168.1.15, sqlmap, help, clear)..."
                className="flex-1 bg-transparent border-none text-xs font-mono placeholder-slate-600 focus:outline-none"
                style={{ color: activeTerminalTheme.accent }}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                className="p-1 transition-colors hover:opacity-80"
                style={{ color: activeTerminalTheme.prompt }}
                title="Execute Command (Enter)"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
