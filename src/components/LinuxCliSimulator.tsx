import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Shield,
  HelpCircle,
  Award,
  Zap,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronRight,
  Target
} from 'lucide-react';
import { TERMINAL_THEMES, DEFAULT_TERMINAL_THEME, TerminalTheme } from '../data/terminalThemes';
import { TerminalThemeSelector } from './TerminalThemeSelector';
import { STORAGE_KEYS } from '../data/appConfig';
import {
  playFlagCapturedSound,
  playFlashcardSuccessSound,
  isAudioCuesEnabled,
  setAudioCuesEnabled
} from '../utils/audioCues';

interface TerminalLog {
  id: string;
  command?: string;
  output: string;
  type: 'system' | 'output' | 'success' | 'error' | 'warning';
}

interface CliDrill {
  id: string;
  title: string;
  category: 'Recon' | 'Web' | 'Auth' | 'Enum' | 'PrivEsc' | 'Forensics';
  objective: string;
  recommendedCommand: string;
  acceptableKeywords: string[];
  targetHost: string;
  hint: string;
}

const COMMON_CEH_DRILLS: CliDrill[] = [
  {
    id: 'drill-1',
    title: 'SYN Stealth Scan & OS Detection',
    category: 'Recon',
    objective: 'Perform a TCP SYN stealth scan with version and OS detection against target 192.168.1.50.',
    recommendedCommand: 'nmap -sS -sV -O 192.168.1.50',
    acceptableKeywords: ['nmap', '-ss', '192.168.1.50'],
    targetHost: '192.168.1.50',
    hint: 'Use flags -sS (SYN scan), -sV (Version), and -O (OS) followed by the target IP.'
  },
  {
    id: 'drill-2',
    title: 'Automated SQL Injection Enumeration',
    category: 'Web',
    objective: 'Test dynamic parameter id for SQL injection and enumerate backend database names.',
    recommendedCommand: 'sqlmap -u "http://192.168.1.50/view.php?id=1" --dbs',
    acceptableKeywords: ['sqlmap', '--dbs'],
    targetHost: '192.168.1.50/view.php?id=1',
    hint: 'Syntax: sqlmap -u "<url>" --dbs'
  },
  {
    id: 'drill-3',
    title: 'SSH Dictionary Password Attack',
    category: 'Auth',
    objective: 'Launch a dictionary attack against SSH on 192.168.1.50 for user admin using rockyou.txt.',
    recommendedCommand: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.50',
    acceptableKeywords: ['hydra', 'rockyou.txt', 'ssh'],
    targetHost: '192.168.1.50:22',
    hint: 'Use hydra -l admin -P <wordlist_path> ssh://<target_ip>'
  },
  {
    id: 'drill-4',
    title: 'SMB & Windows RPC Enumeration',
    category: 'Enum',
    objective: 'Perform complete Null-Session and SMB enumeration on Windows target 192.168.1.50.',
    recommendedCommand: 'enum4linux -a 192.168.1.50',
    acceptableKeywords: ['enum4linux', '192.168.1.50'],
    targetHost: '192.168.1.50:445',
    hint: 'Use enum4linux with the -a (all tests) flag.'
  },
  {
    id: 'drill-5',
    title: 'Linux SUID Binary Escalation Audit',
    category: 'PrivEsc',
    objective: 'Find all executable files with SUID bit set to discover privilege escalation vectors.',
    recommendedCommand: 'find / -perm -u=s -type f 2>/dev/null',
    acceptableKeywords: ['find', '-perm', '-u=s'],
    targetHost: 'localhost (Target Box)',
    hint: 'find / -perm -u=s -type f 2>/dev/null'
  },
  {
    id: 'drill-6',
    title: 'JPEG Steganographic Data Extraction',
    category: 'Forensics',
    objective: 'Extract hidden sensitive payload embedded inside suspicious_evidence.jpg.',
    recommendedCommand: 'steghide extract -sf suspicious_evidence.jpg',
    acceptableKeywords: ['steghide', 'extract', '-sf'],
    targetHost: 'suspicious_evidence.jpg',
    hint: 'steghide extract -sf <filename>'
  }
];

const AUTOCOMPLETE_COMMANDS = [
  'nmap -sS -sV -O 192.168.1.50',
  'nmap -sn 192.168.1.0/24',
  'nmap -sC -sV -p- 192.168.1.50',
  'sqlmap -u "http://192.168.1.50/view.php?id=1" --dbs',
  'sqlmap -u "http://192.168.1.50/view.php?id=1" -D target_db --tables',
  'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.50',
  'hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ftp://192.168.1.50',
  'john --wordlist=/usr/share/wordlists/rockyou.txt --format=NT hashes.txt',
  'hashcat -m 1000 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt',
  'enum4linux -a 192.168.1.50',
  'smbclient -L //192.168.1.50 -N',
  'gobuster dir -u http://192.168.1.50 -w /usr/share/wordlists/dirb/common.txt',
  'nikto -h http://192.168.1.50',
  'steghide extract -sf suspicious_evidence.jpg',
  'binwalk -e firmware.bin',
  'sudo -l',
  'find / -perm -u=s -type f 2>/dev/null',
  'netstat -tulnp',
  'cat /etc/passwd',
  'cat /etc/shadow',
  'whoami',
  'ifconfig',
  'ip a',
  'help',
  'clear',
  'history'
];

interface LinuxCliSimulatorProps {
  initialCommand?: string;
  onToolSelect?: (toolName: string) => void;
  className?: string;
}

export const LinuxCliSimulator: React.FC<LinuxCliSimulatorProps> = ({
  initialCommand,
  onToolSelect,
  className = ''
}) => {
  // Terminal Theme
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>(() => {
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

  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => isAudioCuesEnabled());

  // Fullscreen / Expanded Mode
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Active Practice Drill
  const [activeDrillId, setActiveDrillId] = useState<string>('drill-1');
  const [completedDrills, setCompletedDrills] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kaybit_ceh_completed_cli_drills');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Terminal I/O State
  const [commandInput, setCommandInput] = useState<string>(initialCommand || '');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Initial Welcome Banner
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'welcome-1',
      output: `╔════════════════════════════════════════════════════════════════════════════════════════╗\n║   KALI LINUX 2026 • CEH EXAM TERMINAL SANDBOX (x86_64)                                 ║\n║   Virtual Lab Gateway: 192.168.1.1 • Local Attacker: 192.168.1.105 (Ready)             ║\n║   Practice typing real tools syntax: nmap, sqlmap, hydra, enum4linux, steghide, find   ║\n║   Features: Tab-Completion • History (↑/↓) • Interactive Practice Drills               ║\n╚════════════════════════════════════════════════════════════════════════════════════════╝\nType 'help' to see all supported tool syntax or pick a practice drill below.`,
      type: 'system'
    }
  ]);

  // Sync completed drills to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kaybit_ceh_completed_cli_drills', JSON.stringify(completedDrills));
    } catch {
      // ignore
    }
  }, [completedDrills]);

  // Listen for audio cues toggle event
  useEffect(() => {
    const handleAudioToggle = (e: CustomEvent<{ enabled: boolean }>) => {
      setAudioEnabled(e.detail.enabled);
    };
    window.addEventListener('audio-cues-toggle' as any, handleAudioToggle);
    return () => window.removeEventListener('audio-cues-toggle' as any, handleAudioToggle);
  }, []);

  // Set initial command if prop changed
  useEffect(() => {
    if (initialCommand) {
      setCommandInput(initialCommand);
      inputRef.current?.focus();
    }
  }, [initialCommand]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const activeDrill = useMemo(
    () => COMMON_CEH_DRILLS.find((d) => d.id === activeDrillId) || COMMON_CEH_DRILLS[0],
    [activeDrillId]
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    setAudioCuesEnabled(next);
  };

  const handleThemeChange = (theme: TerminalTheme) => {
    setTerminalTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEYS.TERMINAL_THEME, theme.id);
    } catch {
      // ignore
    }
  };

  // Execute typed command
  const handleExecute = (rawCmd?: string) => {
    const cmd = (rawCmd !== undefined ? rawCmd : commandInput).trim();
    if (!cmd) return;

    // Add to history
    setCommandHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);
    setCommandInput('');

    const lower = cmd.toLowerCase();

    // Check clear
    if (lower === 'clear') {
      setLogs([]);
      return;
    }

    let output = '';
    let logType: TerminalLog['type'] = 'output';

    // Verify if this matches current drill objective
    const matchesCurrentDrill = activeDrill.acceptableKeywords.every((kw) =>
      lower.includes(kw.toLowerCase())
    );

    if (matchesCurrentDrill && !completedDrills[activeDrill.id]) {
      setCompletedDrills((prev) => ({ ...prev, [activeDrill.id]: true }));
      playFlagCapturedSound();
    }

    // Realistic Output Generator
    if (lower === 'help') {
      output = `CEH Exam CLI Simulator — Core Kali Linux Utilities:\n
  [Network Recon]
    nmap -sS -sV -O <target>         TCP SYN stealth port scan + service OS detection
    nmap -sn 192.168.1.0/24          Subnet ping sweep / Host discovery
    nmap -sC -sV -p- <target>        Full 65,535 port scan with default NSE scripts
    netstat -tulnp                   List active listening ports and server daemons

  [Web Exploitation]
    sqlmap -u "<url>" --dbs          Automated SQL injection database enum
    sqlmap -u "<url>" -D db --tables Enumerate specific database tables
    gobuster dir -u <url> -w <dict>  Directory brute-forcing
    nikto -h <target>                Web vulnerability scanner

  [Authentication & Cracking]
    hydra -l admin -P rockyou.txt ssh://<target>   SSH service dictionary brute-force
    hydra -L users.txt -P rockyou.txt ftp://<tgt>  FTP credential spray
    john --wordlist=rockyou.txt --format=NT hashes NTLM SAM hash cracking
    hashcat -m 1000 -a 0 hashes.txt rockyou.txt    GPU-accelerated NTLM cracking

  [Enumeration & Forensics]
    enum4linux -a <target>           Windows/Samba user, share & RID enumeration
    smbclient -L //<target> -N       Anonymous null-session share listing
    steghide extract -sf <image.jpg> Extract secret payload from steganographic image
    binwalk -e <firmware>            Extract embedded files from binary blobs

  [Privilege Escalation]
    sudo -l                          Check current user sudo permissions
    find / -perm -u=s -type f        Locate SUID binaries for root escalation
    cat /etc/passwd | cat /etc/shadow View user definitions and password hashes

  [General Navigation]
    whoami | id | pwd | ls -la | ifconfig | ip a | clear | history`;
      logType = 'system';
    } else if (lower.startsWith('nmap')) {
      if (lower.includes('-sn')) {
        output = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-12 18:30 EDT
Nmap scan report for 192.168.1.1 (Gateway.local)
Host is up (0.00041s latency).
MAC Address: 00:50:56:EA:12:01 (VMware)
Nmap scan report for 192.168.1.15 (Target-DC01.local)
Host is up (0.00078s latency).
MAC Address: 00:0C:29:8B:4F:92 (VMware)
Nmap scan report for 192.168.1.50 (Target-WebSRV)
Host is up (0.00092s latency).
MAC Address: 00:0C:29:DF:88:1A (VMware)
Nmap done: 256 IP addresses (3 hosts up) scanned in 2.12 seconds
[+] 3 active hosts discovered on local subnet.`;
        logType = 'success';
      } else {
        output = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-12 18:31 EDT
Nmap scan report for 192.168.1.50
Host is up (0.00084s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 3.0.3 (Anonymous login enabled)
22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu 3ubuntu0.1
80/tcp   open  http        Apache httpd 2.4.52 ((Ubuntu) mod_wsgi/4.9.0 Python/3.10)
139/tcp  open  netbios-ssn Samba smbd 4.6.2
445/tcp  open  netbios-ssn Samba smbd 4.6.2
3306/tcp open  mysql       MySQL 8.0.32
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel:5.15

Device type: general purpose
Running: Linux 5.X
OS details: Linux 5.4 - 5.15
Network Distance: 1 hop

[+] Scan complete: 6 ports open. Ready for vulnerability analysis.`;
        logType = 'success';
      }
    } else if (lower.startsWith('sqlmap')) {
      output = `[*] starting @ 18:32:04 /2026/
[INFO] testing connection to the target URL
[INFO] checking if the target is protected by some kind of WAF/IPS
[INFO] testing if GET parameter 'id' is dynamic
[INFO] confirming boolean-based blind injection on parameter 'id'
[INFO] parameter 'id' is vulnerable. Do you want to keep testing the others? [y/N] N
sqlmap identified the following injection point(s) with a total of 42 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 8821=8821
    Type: UNION query
    Title: Generic UNION query (NULL) - 3 columns
    Payload: id=-1 UNION ALL SELECT NULL,CONCAT(0x7170707671,0x536563726574,0x7178767871),NULL-- -
---
[INFO] the back-end DBMS is MySQL >= 5.0.12
available databases [3]:
[*] information_schema
[*] ceh_flag_store
[*] production_db

[+] Target parameter confirmed injectable. Run with '-D ceh_flag_store --tables' to extract.`;
      logType = 'success';
    } else if (lower.startsWith('hydra')) {
      output = `Hydra v9.5 (c) 2026 by van Hauser / THC - Starting password attack
[DATA] max 4 tasks per target, 1 target, 2048 login tries
[STATUS] 312.00 tries/min, 624 tries in 00:02h, 1424 to do
[22][ssh] host: 192.168.1.50   login: admin   password: Password123!
[STATUS] Attack finished: 1 valid password found.
[+] Successful credential match: admin / Password123! saved to hydra_loot.txt`;
      logType = 'success';
    } else if (lower.startsWith('enum4linux')) {
      output = `Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ )
Target ........... 192.168.1.50
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''

[+] Got domain/workgroup name: CEH_CORP
[+] Session Check: Server allows NULL SESSION (username='', password='')
[+] Enumerating users using SID s-1-5-21-182379102-192837192-3847291:
    user:[Administrator] rid:[0x1f4] (Built-in domain administrator)
    user:[Guest] rid:[0x1f5] (Disabled)
    user:[backup_svc] rid:[0x3e8] (Description: System Automated Backup Account)
    user:[auditor] rid:[0x3e9] (Standard User)
[+] Share Enumeration:
    Disk: ADMIN$ (Default Administrative Share - Access Denied)
    Disk: C$ (System Drive - Access Denied)
    Disk: IPC$ (Remote IPC - Access Granted)
    Disk: Backups (Permissions: READ/WRITE - Anonymous Access Allowed!)
[+] enum4linux complete: Vulnerable null session and writable SMB share found!`;
      logType = 'success';
    } else if (lower.startsWith('find') && lower.includes('-u=s')) {
      output = `/usr/bin/passwd
/usr/bin/chfn
/usr/bin/chsh
/usr/bin/gpasswd
/usr/bin/newgrp
/usr/bin/su
/usr/bin/sudo
/usr/bin/mount
/usr/bin/umount
/usr/bin/pkexec
/usr/local/bin/custom_backup_tool (SUID: root - Perm: rwsr-xr-x)
/usr/bin/python3.10 (SUID: root - Perm: rwsr-xr-x) [!] VULNERABLE PRIV-ESC VECTOR!

[+] Found SUID Python binary! Exploit: python3.10 -c 'import os; os.setuid(0); os.system("/bin/bash")'`;
      logType = 'success';
    } else if (lower.startsWith('steghide')) {
      output = `Enter passphrase: 
wrote extracted data to "ceh_secret_flag.txt".
[+] Extracted Flag: FLAG{steg_ceh_audio_carrier_matrix_77}`;
      logType = 'success';
    } else if (lower.startsWith('whoami')) {
      output = `kali (uid=1000 gid=1000 groups=1000(kali),27(sudo),100(users))`;
      logType = 'output';
    } else if (lower === 'id') {
      output = `uid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users)`;
      logType = 'output';
    } else if (lower === 'pwd') {
      output = `/home/kali/ceh_labs`;
      logType = 'output';
    } else if (lower.startsWith('ls')) {
      output = `total 36
drwxr-xr-x 4 kali kali 4096 Sep 12 18:00 .
drwxr-xr-x 8 kali kali 4096 Sep 12 17:30 ..
-rw-r--r-- 1 kali kali 1420 Sep 12 17:45 live_hosts.txt
-rw-r--r-- 1 kali kali  890 Sep 12 17:50 hashes.txt
-rwxr-xr-x 1 kali kali 4892 Sep 12 18:00 exploit.py
-rw-r--r-- 1 kali kali 8920 Sep 12 18:01 suspicious_evidence.jpg
drwxr-xr-x 2 kali kali 4096 Sep 12 17:40 scans
drwxr-xr-x 2 kali kali 4096 Sep 12 17:42 wordlists`;
      logType = 'output';
    } else if (lower.startsWith('cat /etc/passwd')) {
      output = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
kali:x:1000:1000:Kali Linux Candidate,,,:/home/kali:/bin/bash
mysql:x:114:120:MySQL Server,,,:/nonexistent:/bin/false
backup_svc:x:1001:1001:Backup Service:/home/backup_svc:/bin/bash`;
      logType = 'output';
    } else if (lower.startsWith('cat /etc/shadow')) {
      output = `cat: /etc/shadow: Permission denied (Requires root privileges: try 'sudo cat /etc/shadow')`;
      logType = 'error';
    } else if (lower.startsWith('sudo cat /etc/shadow') || lower === 'sudo -l') {
      output = `Matching Defaults entries for kali on ceh-lab:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin

User kali may run the following commands on ceh-lab:
    (ALL : ALL) ALL
    (root) NOPASSWD: /usr/bin/nmap, /usr/bin/tcpdump, /usr/local/bin/custom_backup_tool`;
      logType = 'success';
    } else if (lower.startsWith('history')) {
      output = commandHistory
        .slice(0, 15)
        .reverse()
        .map((h, i) => `  ${i + 1}  ${h}`)
        .join('\n');
      logType = 'system';
    } else {
      output = `bash: ${cmd.split(' ')[0]}: command executed. Output piped to session buffer.
[Tip: Type 'help' to review supported CEH tools, or pick an Exam Practice Drill below.]`;
      logType = 'output';
    }

    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        command: cmd,
        output,
        type: logType
      }
    ]);
  };

  // Keyboard navigation for history & Tab autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIdx);
        setCommandInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCommandInput(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = commandInput.trim();
      if (!current) return;
      const match = AUTOCOMPLETE_COMMANDS.find((cmd) =>
        cmd.toLowerCase().startsWith(current.toLowerCase())
      );
      if (match) {
        setCommandInput(match);
      }
    }
  };

  const completedCount = Object.values(completedDrills).filter(Boolean).length;
  const drillsProgressPercent = Math.round((completedCount / COMMON_CEH_DRILLS.length) * 100);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 flex flex-col ${
        isExpanded
          ? 'fixed inset-4 z-50 shadow-2xl overflow-hidden'
          : 'relative shadow-xl overflow-hidden'
      } ${className}`}
      style={{
        backgroundColor: terminalTheme.bg,
        borderColor: terminalTheme.border
      }}
    >
      {/* Chrome Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b select-none transition-colors"
        style={{
          backgroundColor: terminalTheme.bg,
          borderColor: terminalTheme.border
        }}
      >
        <div className="flex items-center gap-3">
          {/* OS Window Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>

          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" style={{ color: terminalTheme.prompt }} />
            <span
              className="text-xs font-mono font-bold tracking-tight"
              style={{ color: terminalTheme.text }}
            >
              Kali Linux CEH Exam Sandbox (x86_64)
            </span>
            <span
              className="hidden md:inline text-[10px] px-2 py-0.5 rounded font-mono border"
              style={{
                backgroundColor: terminalTheme.surface,
                borderColor: terminalTheme.border,
                color: terminalTheme.comment
              }}
            >
              bash 5.2.15 • TTY1 • 192.168.1.105
            </span>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Selector */}
          <TerminalThemeSelector
            currentThemeId={terminalTheme.id}
            onSelectTheme={handleThemeChange}
          />

          {/* Audio Cues Toggle */}
          <button
            id="btn-terminal-audio-toggle"
            onClick={handleToggleAudio}
            className="p-1.5 rounded-lg border transition-colors"
            style={{
              backgroundColor: terminalTheme.surface,
              borderColor: terminalTheme.border,
              color: audioEnabled ? terminalTheme.prompt : terminalTheme.comment
            }}
            title={audioEnabled ? 'Terminal Audio Cues: Enabled (Click to Mute)' : 'Terminal Audio Cues: Muted (Click to Enable)'}
            aria-label="Toggle Audio Cues"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Button */}
          <button
            id="btn-terminal-clear"
            onClick={() => setLogs([])}
            className="px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors hover:opacity-80"
            style={{
              backgroundColor: terminalTheme.surface,
              borderColor: terminalTheme.border,
              color: terminalTheme.comment
            }}
            title="Clear terminal buffer"
          >
            clear
          </button>

          {/* Maximize / Expand Toggle */}
          <button
            id="btn-terminal-expand"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border transition-colors hover:opacity-80"
            style={{
              backgroundColor: terminalTheme.surface,
              borderColor: terminalTheme.border,
              color: terminalTheme.text
            }}
            title={isExpanded ? 'Restore window size' : 'Expand to full screen'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Guided Practice Drills Banner */}
      <div
        className="px-4 py-2.5 border-b text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
        style={{
          backgroundColor: terminalTheme.surface,
          borderColor: terminalTheme.border
        }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold" style={{ color: terminalTheme.accent }}>
            <Target className="w-3.5 h-3.5" />
            <span>Practice Drills ({completedCount}/{COMMON_CEH_DRILLS.length} Solved):</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {COMMON_CEH_DRILLS.map((drill) => {
              const isSelected = activeDrillId === drill.id;
              const isDone = completedDrills[drill.id];

              return (
                <button
                  key={drill.id}
                  id={`cli-drill-${drill.id}`}
                  onClick={() => {
                    setActiveDrillId(drill.id);
                    setCommandInput(drill.recommendedCommand);
                    inputRef.current?.focus();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1 border ${
                    isSelected
                      ? 'font-bold shadow-sm'
                      : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? terminalTheme.bg : terminalTheme.surface,
                    borderColor: isSelected ? terminalTheme.prompt : terminalTheme.border,
                    color: isDone ? terminalTheme.prompt : isSelected ? terminalTheme.text : terminalTheme.comment
                  }}
                >
                  {isDone ? (
                    <Check className="w-3 h-3" style={{ color: terminalTheme.prompt }} />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  )}
                  <span>{drill.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Insert Recommended Command Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCommandInput(activeDrill.recommendedCommand);
              inputRef.current?.focus();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: terminalTheme.bg,
              borderColor: terminalTheme.border,
              color: terminalTheme.cyan
            }}
            title="Populate terminal input with the drill's command"
          >
            <span>Fill Syntax</span>
            <kbd className="text-[10px] font-mono px-1 rounded bg-black/30 border border-white/10">
              Tab
            </kbd>
          </button>

          <button
            onClick={() => handleExecute(activeDrill.recommendedCommand)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
            style={{
              backgroundColor: terminalTheme.prompt,
              color: '#030712'
            }}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Auto Run</span>
          </button>
        </div>
      </div>

      {/* Active Drill Instruction Strip */}
      <div
        className="px-4 py-2 text-xs flex items-center justify-between gap-3 border-b"
        style={{
          backgroundColor: terminalTheme.bg,
          borderColor: terminalTheme.border
        }}
      >
        <div className="flex items-center gap-2 text-xs">
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border"
            style={{
              backgroundColor: terminalTheme.surface,
              borderColor: terminalTheme.border,
              color: terminalTheme.yellow
            }}
          >
            {activeDrill.category}
          </span>
          <span style={{ color: terminalTheme.text }}>
            <strong>Objective:</strong> {activeDrill.objective}
          </span>
        </div>
        <span
          className="hidden lg:inline text-[11px] font-mono"
          style={{ color: terminalTheme.comment }}
        >
          Target: {activeDrill.targetHost}
        </span>
      </div>

      {/* Terminal Output Log Area */}
      <div
        className="p-4 font-mono text-xs overflow-y-auto space-y-3 leading-relaxed transition-colors selection:bg-emerald-500 selection:text-slate-950"
        style={{
          backgroundColor: terminalTheme.surface,
          color: terminalTheme.text,
          minHeight: isExpanded ? 'calc(100vh - 16rem)' : '320px',
          maxHeight: isExpanded ? 'calc(100vh - 16rem)' : '380px'
        }}
      >
        {logs.map((log) => (
          <div key={log.id} className="space-y-1">
            {log.command && (
              <div className="flex items-center gap-2 font-bold">
                <span className="select-none" style={{ color: terminalTheme.comment }}>
                  kali@ceh-lab:~$
                </span>
                <span style={{ color: terminalTheme.accent }}>{log.command}</span>
              </div>
            )}
            <pre
              className="whitespace-pre-wrap font-mono text-xs leading-relaxed"
              style={{
                color:
                  log.type === 'system'
                    ? terminalTheme.cyan
                    : log.type === 'success'
                    ? terminalTheme.prompt
                    : log.type === 'error'
                    ? terminalTheme.red
                    : log.type === 'warning'
                    ? terminalTheme.yellow
                    : terminalTheme.text
              }}
            >
              {log.output}
            </pre>
          </div>
        ))}
        <div ref={terminalBottomRef} />
      </div>

      {/* Interactive Command Prompt Input Bar */}
      <div
        className="p-3 border-t transition-colors"
        style={{
          backgroundColor: terminalTheme.bg,
          borderColor: terminalTheme.border
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="flex items-center gap-2 border rounded-xl px-3.5 py-2 transition-all focus-within:ring-1 focus-within:ring-emerald-500"
          style={{
            backgroundColor: terminalTheme.surface,
            borderColor: terminalTheme.border
          }}
        >
          <span
            className="font-mono font-bold text-xs select-none shrink-0"
            style={{ color: terminalTheme.prompt }}
          >
            kali@ceh-lab:~$
          </span>
          <input
            ref={inputRef}
            id="cli-terminal-input"
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type CEH command here (e.g. nmap -sS -sV 192.168.1.50, sqlmap, hydra, help, clear)..."
            className="flex-1 bg-transparent border-none text-xs font-mono placeholder:text-slate-500 focus:outline-none"
            style={{ color: terminalTheme.accent }}
            autoComplete="off"
            spellCheck="false"
          />

          <button
            type="submit"
            className="p-1 rounded-lg transition-colors hover:opacity-80"
            style={{ color: terminalTheme.prompt }}
            title="Execute Command (Enter)"
            aria-label="Execute Command"
          >
            <Play className="w-4 h-4 fill-current" />
          </button>
        </form>

        {/* Quick Helper Subtext */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1 text-[11px] font-mono select-none"
          style={{ color: terminalTheme.comment }}
        >
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10 text-[10px]">
                Tab
              </kbd>{' '}
              Autocomplete
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10 text-[10px]">
                ↑/↓
              </kbd>{' '}
              History
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10 text-[10px]">
                Enter
              </kbd>{' '}
              Execute
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Recommended:</span>
            <button
              onClick={() => handleExecute('help')}
              className="hover:underline font-bold"
              style={{ color: terminalTheme.prompt }}
            >
              $ help
            </button>
            <span>•</span>
            <button
              onClick={() => handleExecute('clear')}
              className="hover:underline"
              style={{ color: terminalTheme.cyan }}
            >
              $ clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
