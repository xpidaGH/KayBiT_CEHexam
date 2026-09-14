import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  Sparkles, 
  Search, 
  FileText, 
  PenLine, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  PieChart, 
  FileCode,
  RotateCcw,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { EXAM_DOMAINS_PROGRESS } from '../data/progressData';
import { ExamDomainProgress } from '../types';
import { STORAGE_KEYS } from '../data/appConfig';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { exportProgressAndBookmarksMarkdown } from '../utils/exportMarkdownReport';

// Domain-tailored starter templates matching CEH v13 Blueprint objectives
const DOMAIN_STARTER_TEMPLATES: Record<string, string> = {
  'domain-1': `# Domain 1: Information Security & Ethical Hacking Overview (6% Weight)

## 1. Rules of Engagement (RoE) & Scope Boundaries
- RoE Mandate: Always secure signed written consent specifying test IP ranges and forbidden targets.
- Black Box vs White Box vs Gray Box:
  - Black Box: Zero knowledge, mirrors external adversary, high reconnaissance footprint.
  - White Box: Full architectural/source disclosure, fastest vulnerability verification.
  - Gray Box: Partial insider knowledge (e.g. employee credentials without admin rights).

## 2. Cyber Law & Compliance Statutes
- CFAA (18 U.S.C. § 1030): Prohibits intentional unauthorized computer access and exceeding authorization.
- Regulatory Standards:
  - PCI-DSS: Requirement 11.3 mandates annual internal/external penetration testing.
  - HIPAA Security Rule: Mandates technical safeguards for ePHI transmission and storage.
  - GDPR: Requires 72-hour notification for personal data breaches.

## 3. Kill Chain & Frameworks
- Lockheed Martin Kill Chain: Recon -> Weaponization -> Delivery -> Exploitation -> Installation -> C2 -> Actions on Objectives.
- MITRE ATT&CK: Tactics (Why/Goals) vs Techniques (How) vs Procedures (Specific tools).

## Personal Study Notes & Key Definitions:
- `,

  'domain-2': `# Domain 2: Reconnaissance & Footprinting (21% High Weight)

## 1. Passive OSINT Techniques & Search Dorks
- Google Dorking Operators:
  - site:target.com filetype:pdf confidential
  - inurl:login OR inurl:admin
  - intitle:"index of" "parent directory"
- Public Tools: Shodan (IoT/port indexing), Censys, theHarvester, Maltego, Wayback Machine.

## 2. DNS Enumeration & Zone Transfers
- Full Zone Transfer Syntax:
  - dig axfr @ns1.target.com target.com
  - host -l target.com ns1.target.com
- Key DNS Record Types: A (IPv4), AAAA (IPv6), MX (Mail), NS (Nameserver), SOA (Zone master), TXT (SPF/DKIM).

## 3. Active Network Scanning (Nmap Flag Reference)
- TCP SYN Stealth (-sS): Half-open scan (SYN -> SYN/ACK -> RST). Default, stealthy, fast.
- TCP Connect (-sT): Full 3-way handshake (SYN -> SYN/ACK -> ACK). High logging footprint.
- FIN (-sF), NULL (-sN), Xmas (-sX): Set specific flags. Open/filtered = no response; Closed = RST (RFC 793). Fails on Windows.
- UDP Scan (-sU): Open/filtered = no response; Closed = ICMP Port Unreachable.
- OS & Version Detection: -sV (version probes), -O (OS fingerprinting), -A (aggressive: OS + version + script + traceroute).

## 4. Critical Service Ports
- DNS: 53 | DHCP: 67/68 | TFTP: 69 | Kerberos: 88 | NetBIOS: 137-139 | SMB: 445 | SNMP: 161/162 | LDAP: 389/636

## Personal Study Notes & CLI Flags:
- `,

  'domain-3': `# Domain 3: System Hacking & Attack Techniques (17% High Weight)

## 1. Password Cracking & Cryptographic Hashes
- Windows Password Storage:
  - SAM Hive: C:\\Windows\\System32\\config\\SAM (Local accounts).
  - NTDS.dit: C:\\Windows\\NTDS\\NTDS.dit (Active Directory domain database).
  - Hash format: LM (deprecated 14-char split) vs NTLM (MD4 of UTF-16LE password).
- Cracking Commands:
  - John the Ripper: john --wordlist=rockyou.txt --format=NT hashes.txt
  - Hashcat: hashcat -m 1000 -a 0 ntlm_hashes.txt rockyou.txt

## 2. Privilege Escalation Vectors
- Linux Escalation:
  - SUID Binaries: find / -perm -4000 -type f 2>/dev/null
  - Sudo Rights: sudo -l (check for unconstrained script execution or GTFOBins)
  - Cronjobs: Inspect /etc/crontab and world-writable scheduled scripts.
- Windows Escalation:
  - Token Impersonation: SeImpersonatePrivilege -> JuicyPotato / SweetPotato / PrintSpoofer.
  - Unquoted Service Paths: Look for spaces in service binaries lacking quotation marks.

## 3. Post-Exploitation & Maintaining Access
- Meterpreter Commands: getuid, sysinfo, hashdump, migrate <pid>, keyscan_start / keyscan_dump.
- Windows Event Log IDs:
  - 4624 (Successful Logon), 4625 (Failed Logon), 4720 (User Created), 1102 (Audit Log Cleared).

## Personal Study Notes & Key Flags:
- `,

  'domain-4': `# Domain 4: Network & Perimeter Hacking (14% Weight)

## 1. Sniffing & Layer 2 Attacks
- ARP Poisoning / Spoofing:
  - Tool: arpspoof -i eth0 -t <victim_ip> <gateway_ip>
  - Ettercap: ettercap -T -q -M arp:remote /target// /gateway//
- Switch Flooding (macof): Floods CAM table to force switch into fail-open hub mode.
- VLAN Hopping: Switch Spoofing (DTP negotiation) and Double Tagging (802.1Q).

## 2. Wireshark Filter Syntax
- Credentials & HTTP: http.request.method == "POST" || http contains "password"
- Handshakes & Scans: tcp.flags.syn == 1 && tcp.flags.ack == 0
- DNS Queries: dns.flags.response == 0

## 3. Firewall & IDS/IPS Evasion
- Fragmentation: Nmap -f (8-byte fragments) or --mtu 16 / 24.
- Decoy Scanning: Nmap -D RND:5,ME <target_ip>
- Firewalking: Sending packets with TTL expiring precisely 1 hop behind firewall to map open ACL ports.

## 4. Denial of Service (DoS/DDoS)
- SYN Flood: hping3 -S -p 80 --flood --rand-source <target_ip>
- Slowloris: Holds thousands of concurrent HTTP connections open via incomplete GET headers.
- Amplification Attacks: NTP monlist (Port 123), DNS ANY (Port 53), SNMP (Port 161).

## Personal Study Notes & Packet Behavior:
- `,

  'domain-5': `# Domain 5: Web Application Hacking (16% High Weight)

## 1. OWASP Top 10 High Yields
- SQL Injection (SQLi):
  - In-Band (Union-based): ' UNION SELECT null, username, password FROM users--
  - Blind Boolean: ' AND 1=1-- vs ' AND 1=2--
  - Blind Time-Based: '; IF (1=1) WAITFOR DELAY '0:0:5'--
  - SQLMap CLI: sqlmap -u "http://target/item.php?id=1" --dbs --batch
- Cross-Site Scripting (XSS):
  - Reflected (Non-persistent via search URL query).
  - Stored (Persistent in database comments/reviews).
  - DOM-based (Client-side JavaScript sink vulnerability).
- Command Injection: Unescaped inputs in PHP exec(), system(), shell_exec().
- SSRF (Server-Side Request Forgery):
  - Cloud Metadata Query: http://169.254.169.254/latest/meta-data/iam/security-credentials/

## 2. Web Defense Controls
- SQLi Defense: Parameterized queries (Prepared Statements), ORM frameworks, input sanitization.
- XSS Defense: Context-aware output encoding (HTML, JavaScript, Attribute) + Content Security Policy (CSP).

## Personal Study Notes & SQLMap Payloads:
- `,

  'domain-6': `# Domain 6: Wireless Network Hacking (6% Weight)

## 1. 802.11 Protocol & Encryption Evolution
- WEP: 64/128-bit key, 24-bit IV (weak, susceptible to IV collisions), RC4 stream cipher.
- WPA: TKIP (Temporal Key Integrity Protocol), 48-bit IV, still utilizes RC4.
- WPA2: AES-CCMP (Counter Mode with Cipher Block Chaining Message Authentication Code Protocol).
- WPA3: Simultaneous Authentication of Equals (SAE - Dragonfly handshake), protects against offline dictionary attacks.

## 2. 4-Way Handshake & Attack Workflow
- Aircrack-ng Suite:
  - 1. Monitor mode: airmon-ng start wlan0
  - 2. Reconnaissance: airodump-ng wlan0mon
  - 3. Capture targeted AP: airodump-ng -c <channel> --bssid <bssid> -w capture wlan0mon
  - 4. Deauthenticate client: aireplay-ng -0 5 -a <bssid> -c <client_mac> wlan0mon
  - 5. Crack handshake: aircrack-ng -w /usr/share/wordlists/rockyou.txt -b <bssid> capture-01.cap
- PMKID Attack: Clientless attack targeting RSN IE in Access Point beacon frames (hcxdumptool + hashcat mode 22000).

## 3. Bluetooth Vectors
- Bluejacking (Unsolicited text message/contact card).
- Bluesnarfing (Unauthorized theft of contacts, messages, calendar).
- Bluebugging (Full remote AT-command control of telephony).

## Personal Study Notes & Wireless Tools:
- `,

  'domain-7': `# Domain 7: Mobile, IoT & Operational Technology (OT) (8% Weight)

## 1. Mobile Platform Architecture
- Android: Linux kernel, ART/Dalvik VM runtime, APK format (classes.dex, AndroidManifest.xml).
  - Auditing: apktool d target.apk (decompiles resources), jadx-gui (reads decompiled Java).
- iOS: Darwin/Mach-O binary architecture, IPA archive, sandboxed data containers.
  - Security: Secure Enclave, code signing enforcement, App Transport Security (ATS).

## 2. Operational Technology (OT) & SCADA/ICS
- Architecture Levels (Purdue Model):
  - Level 0: Physical field sensors and actuators.
  - Level 1: Programmable Logic Controllers (PLCs) & Remote Terminal Units (RTUs).
  - Level 2: Human Machine Interfaces (HMIs) & Supervisory Control.
- Key Industrial Protocols:
  - Modbus TCP: Port 502, completely cleartext, function codes 01 (Read Coils), 03 (Read Holding Registers).
  - DNP3: Port 20000 | BACnet (Building automation): Port 47808 | MQTT: Port 1883.

## 3. IoT Attack Surface
- OWASP IoT Top 10: Insecure default credentials, lack of transport encryption, weak update mechanism, unhardened hardware interfaces (UART, JTAG, SPI).

## Personal Study Notes & Hardware Concepts:
- `,

  'domain-8': `# Domain 8: Cloud Computing & Container Security (6% Weight)

## 1. Cloud Shared Responsibility Model
- IaaS (Infrastructure as a Service - AWS EC2): Customer manages OS, patches, runtime, app, data. CSP manages physical datacenter and hypervisor.
- PaaS (Platform as a Service - AWS Elastic Beanstalk): Customer manages code and data. CSP manages OS, patching, and hardware.
- SaaS (Software as a Service - Google Workspace, Office 365): Customer manages users, access, data. CSP manages everything else.

## 2. Cloud IAM & Storage Misconfigurations
- S3 Bucket Auditing:
  - Permissions: "AllUsers" (public internet) vs "AuthenticatedUsers" (any AWS account holder worldwide).
  - AWS CLI Command: aws s3 ls s3://target-bucket-name --no-sign-request
- Cloud Metadata Service (IMDS):
  - IMDSv1: Simple HTTP GET to 169.254.169.254 (vulnerable to standard SSRF).
  - IMDSv2: Requires HTTP PUT to acquire session token header before querying.

## 3. Container & Docker Security
- Breakout vector: Exposing /var/run/docker.sock inside unprivileged container grants root control over host daemon.
- Privileged Containers: Flag --privileged disables SELinux/AppArmor containment.

## Personal Study Notes & Cloud CLI Commands:
- `,

  'domain-9': `# Domain 9: Cryptography & Steganography (6% Weight)

## 1. Symmetric vs Asymmetric Ciphers
- Symmetric Encryption (Same shared key for encryption & decryption):
  - Block Ciphers: AES (128/192/256-bit), 3DES (168-bit, 3x 56-bit keys), Blowfish, Twofish.
  - Stream Ciphers: RC4 (deprecated, bit-by-bit XOR with keystream), ChaCha20.
  - Block Modes:
    - ECB (Electronic Codebook): No IV, identical plaintext yields identical ciphertext (leaks image patterns).
    - CBC (Cipher Block Chaining): Uses IV + XOR with previous ciphertext block.
    - GCM (Galois/Counter Mode): Provides Authenticated Encryption with Associated Data (AEAD).
- Asymmetric Encryption (Public key encrypts, private key decrypts):
  - Algorithms: RSA (factoring large prime products), ECC (Elliptic Curve Cryptography - smaller key sizes), Diffie-Hellman (key exchange only).

## 2. Hashing & Integrity
- MD5 (128-bit, vulnerable to collision attacks).
- SHA-1 (160-bit, collision proven via SHAttered).
- SHA-2 (SHA-256, SHA-512) & SHA-3 (Keccak permutation).
- HMAC: Hash-based Message Authentication Code combining secret key with hash.

## 3. Steganography
- LSB (Least Significant Bit): Hides secret bits in the lowest-order bit of image pixel RGB values without visible distortion.
- Steghide Commands:
  - Embed: steghide embed -cf carrier.jpg -ef secret.txt
  - Extract: steghide extract -sf carrier.jpg

## Personal Study Notes & Cryptographic Math:
- `
};

interface WrittenDomainScratchpadProps {
  initialDomainId?: string;
  onNavigateToDomainProgress?: () => void;
}

export const WrittenDomainScratchpad: React.FC<WrittenDomainScratchpadProps> = ({
  initialDomainId = 'domain-2',
  onNavigateToDomainProgress,
}) => {
  // --- Persistent Storage State ---
  const [domainNotes, setDomainNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WRITTEN_DOMAIN_NOTES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed reading domain notes from localStorage', err);
    }
    // Migration fallback: if legacy general note exists, seed domain-1
    const legacyNotes = localStorage.getItem(STORAGE_KEYS.WRITTEN_NOTES);
    if (legacyNotes) {
      return { 'domain-1': legacyNotes };
    }
    return {};
  });

  const [selectedDomainId, setSelectedDomainId] = useState<string>(initialDomainId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Auto-saved');

  const isInitialMount = useRef(true);

  // Current selected domain object
  const currentDomain: ExamDomainProgress = useMemo(() => {
    return EXAM_DOMAINS_PROGRESS.find((d) => d.id === selectedDomainId) || EXAM_DOMAINS_PROGRESS[0];
  }, [selectedDomainId]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WRITTEN_DOMAIN_NOTES, JSON.stringify(domainNotes));
      const now = new Date();
      setLastSavedTime(`Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        triggerAutoSaveToast(`Scratchpad (${currentDomain.name.slice(0, 18)}...)`);
      }
    } catch (err) {
      console.error('Failed saving domain notes to localStorage', err);
    }
  }, [domainNotes, currentDomain.name]);

  // Current note text for selected domain
  const currentText = domainNotes[currentDomain.id] || '';

  // Web Speech API Voice Dictation State
  const [isRecordingSpeech, setIsRecordingSpeech] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition capability on mount
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
    }
  }, []);

  const startSpeechRecording = () => {
    setSpeechError(null);
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSpeechSupported(false);
      setSpeechError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecordingSpeech(true);
        setSpeechTranscript('');
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentResult = '';
        for (let i = 0; i < event.results.length; i++) {
          currentResult += event.results[i][0].transcript;
        }
        setSpeechTranscript(currentResult);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          setSpeechError(`Voice Error: ${event.error}`);
        }
        setIsRecordingSpeech(false);
      };

      recognition.onend = () => {
        setIsRecordingSpeech(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setSpeechError('Microphone permission denied or device not found.');
      setIsRecordingSpeech(false);
    }
  };

  const stopSpeechRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecordingSpeech(false);
  };

  const handleAppendSpeechToNotes = () => {
    if (!speechTranscript.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const spokenBlock = `\n\n### 🎙️ Spoken Summary (${timeStr})\n${speechTranscript.trim()}\n`;
    handleUpdateNote(currentText + spokenBlock);
    setSpeechTranscript('');
    stopSpeechRecording();
    triggerAutoSaveToast('Transcribed speech summary inserted into notes!');
  };

  // Stats
  const wordCount = useMemo(() => {
    const trimmed = currentText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [currentText]);

  const charCount = currentText.length;
  const lineCount = currentText ? currentText.split('\n').length : 0;

  // Overview stats across all 9 domains
  const domainsWithNotesCount = useMemo(() => {
    return Object.keys(domainNotes).filter((k) => (domainNotes[k] || '').trim().length > 0).length;
  }, [domainNotes]);

  const totalWordsAcrossAll = useMemo(() => {
    return Object.values(domainNotes).reduce((acc, text) => {
      const trimmed = (text || '').trim();
      return acc + (trimmed ? trimmed.split(/\s+/).length : 0);
    }, 0);
  }, [domainNotes]);

  // Filtered domains in sidebar
  const filteredDomains = useMemo(() => {
    if (!searchQuery.trim()) return EXAM_DOMAINS_PROGRESS;
    const q = searchQuery.toLowerCase();
    return EXAM_DOMAINS_PROGRESS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        `domain ${d.domainNumber}`.includes(q) ||
        (domainNotes[d.id] || '').toLowerCase().includes(q)
    );
  }, [searchQuery, domainNotes]);

  // Handlers
  const handleUpdateNote = (val: string) => {
    setDomainNotes((prev) => ({
      ...prev,
      [currentDomain.id]: val,
    }));
  };

  const handleCopyCurrent = () => {
    if (!currentText) return;
    try {
      navigator.clipboard.writeText(currentText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = currentText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedState('current');
    setTimeout(() => setCopiedState(null), 2000);
  };

  const handleInsertTemplate = (append = false) => {
    const template = DOMAIN_STARTER_TEMPLATES[currentDomain.id] || `# Domain ${currentDomain.domainNumber}: ${currentDomain.name}\n\n## Key Concepts & Port Numbers:\n- \n\n## Critical Tools:\n- `;
    if (!currentText.trim() || !append) {
      handleUpdateNote(template);
    } else {
      handleUpdateNote(currentText + '\n\n' + template);
    }
  };

  const handleClearNote = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    handleUpdateNote('');
    setConfirmClear(false);
  };

  const handleExportAllNotes = () => {
    const header = `# KayBiT CEH v13 Complete Written Exam Study Scratchpad
Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Total Domains Documented: ${domainsWithNotesCount} / 9
Total Words: ${totalWordsAcrossAll}

================================================================================
`;
    const body = EXAM_DOMAINS_PROGRESS.map((d) => {
      const note = domainNotes[d.id] || '_No notes recorded for this domain yet._';
      return `\n\n## [Domain ${d.domainNumber} - ${d.blueprintWeight}% Exam Weight] ${d.name}\nSummary: ${d.summary}\n\n${note}\n--------------------------------------------------------------------------------`;
    }).join('');

    const fullExport = header + body;

    // Trigger file download
    const blob = new Blob([fullExport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CEH_v13_Written_Domain_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedState('export');
    setTimeout(() => setCopiedState(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Global Stats */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <PenLine className="w-3.5 h-3.5" />
            <span>Local Domain Scratchpad</span>
          </div>
          <h2 className="text-xl font-bold text-white">Domain-Specific Study Scratchpad</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Jot down rapid cheat-sheet notes, port numbers, CLI flags, and memorization mnemonics categorized across all 9 official CEH v13 Blueprint domains. Automatically persists to your browser&apos;s localStorage.
          </p>
        </div>

        {/* Global Progress Indicators */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="block text-[10px] uppercase font-mono text-slate-500 font-semibold">Coverage</span>
            <span className="font-mono text-sm font-extrabold text-emerald-400">
              {domainsWithNotesCount} / 9 Domains
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="block text-[10px] uppercase font-mono text-slate-500 font-semibold">Total Notes</span>
            <span className="font-mono text-sm font-extrabold text-teal-300">
              {totalWordsAcrossAll} Words
            </span>
          </div>

          <button
            id="btn-export-all-domain-notes"
            type="button"
            onClick={handleExportAllNotes}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
            title="Download all 9 domain study notes as a Markdown file (.md)"
          >
            {copiedState === 'export' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Exported All Notes!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export All (9 Domains)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Domain Navigator, Right Scratchpad Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Domain Picker Navigation (4 Columns) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-domains"
              type="text"
              placeholder="Search domains or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Domain List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredDomains.map((dom) => {
              const isSelected = dom.id === selectedDomainId;
              const noteText = (domainNotes[dom.id] || '').trim();
              const hasNotes = noteText.length > 0;
              const domWords = hasNotes ? noteText.split(/\s+/).length : 0;

              return (
                <button
                  key={dom.id}
                  id={`domain-scratchpad-tab-${dom.id}`}
                  onClick={() => {
                    setSelectedDomainId(dom.id);
                    setConfirmClear(false);
                  }}
                  className={`w-full p-3.5 rounded-xl text-left transition-all border flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: dom.color }}
                      />
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        Domain {dom.domainNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold"
                        style={{
                          backgroundColor: `${dom.color}15`,
                          color: dom.color,
                          border: `1px solid ${dom.color}30`,
                        }}
                      >
                        {dom.blueprintWeight}% Exam
                      </span>
                      {hasNotes && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{domWords}w</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{dom.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{dom.summary}</p>
                </button>
              );
            })}

            {filteredDomains.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                No matching domains found. Clear search to view all.
              </div>
            )}
          </div>

          {/* Shortcut to Progress Tracker */}
          {onNavigateToDomainProgress && (
            <button
              onClick={onNavigateToDomainProgress}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <PieChart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open 9-Domain Progress Tracker &rarr;</span>
            </button>
          )}
        </div>

        {/* Right: Selected Domain Canvas (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            {/* Domain Context Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentDomain.color }}
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Domain {currentDomain.domainNumber} • Blueprint v13
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded font-mono"
                    style={{
                      backgroundColor: `${currentDomain.color}15`,
                      color: currentDomain.color,
                      border: `1px solid ${currentDomain.color}40`,
                    }}
                  >
                    {currentDomain.blueprintWeight}% Exam Weight
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white">{currentDomain.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{currentDomain.summary}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Voice Dictation (Web Speech API) */}
                <button
                  id="btn-voice-dictate"
                  type="button"
                  onClick={isRecordingSpeech ? stopSpeechRecording : startSpeechRecording}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-sm ${
                    isRecordingSpeech
                      ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 animate-pulse'
                      : 'bg-slate-950 hover:bg-slate-800 text-rose-300 hover:text-rose-200 border-rose-500/30'
                  }`}
                  title={
                    !speechSupported
                      ? 'Web Speech API is not supported in this browser'
                      : isRecordingSpeech
                      ? 'Click to stop recording spoken summary'
                      : 'Record spoken study summary (Speech-to-Text)'
                  }
                >
                  {isRecordingSpeech ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-white" />
                      <span>Stop Dictation</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      <span>Record Voice Summary</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-insert-template"
                  type="button"
                  onClick={() => handleInsertTemplate(currentText.trim().length > 0)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  title="Insert or append high-yield CEH study template"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentText.trim().length > 0 ? 'Append Template' : 'Insert Starter Template'}</span>
                </button>

                <button
                  id="btn-copy-domain-notes"
                  type="button"
                  onClick={handleCopyCurrent}
                  disabled={!currentText.trim()}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    !currentText.trim()
                      ? 'opacity-40 cursor-not-allowed bg-slate-950 text-slate-500 border-slate-800'
                      : copiedState === 'current'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                  title="Copy current domain notes to clipboard"
                >
                  {copiedState === 'current' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Notes</span>
                    </>
                  )}
                </button>

                {currentText.trim() && (
                  <button
                    id="btn-clear-domain-notes"
                    type="button"
                    onClick={handleClearNote}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      confirmClear
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-slate-950 hover:bg-red-500/15 text-slate-400 hover:text-red-400 border-slate-800'
                    }`}
                    title={confirmClear ? 'Click again to confirm clearing notes' : 'Clear notes for this domain'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{confirmClear ? 'Confirm Delete?' : 'Clear'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Voice Dictation Active Recording / Transcript Preview Banner */}
            {(isRecordingSpeech || speechTranscript || speechError) && (
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2 shadow-lg animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isRecordingSpeech ? 'bg-rose-500 animate-ping' : 'bg-slate-500'}`} />
                    <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-rose-400" />
                      <span>{isRecordingSpeech ? 'Listening (Web Speech API Active)... Speak your summary' : 'Voice Dictation Paused'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {speechTranscript && (
                      <button
                        type="button"
                        onClick={handleAppendSpeechToNotes}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
                      >
                        <Check className="w-3 h-3" />
                        <span>Insert into Note</span>
                      </button>
                    )}
                    {isRecordingSpeech ? (
                      <button
                        type="button"
                        onClick={stopSpeechRecording}
                        className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-colors"
                      >
                        Stop
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setSpeechTranscript(''); setSpeechError(null); }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>

                {speechError ? (
                  <p className="text-xs text-rose-400 font-mono">{speechError}</p>
                ) : (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed min-h-[44px]">
                    {speechTranscript ? (
                      <span>&ldquo;{speechTranscript}&rdquo;</span>
                    ) : (
                      <span className="text-slate-500 italic">Listening for spoken summary... speak clearly into your microphone.</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Note Editor Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Markdown & Plaintext Scratchpad:</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} chars</span>
                  <span>•</span>
                  <span>{lineCount} lines</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{lastSavedTime}</span>
                </div>
              </div>

              <textarea
                id={`textarea-domain-notes-${currentDomain.id}`}
                rows={18}
                value={currentText}
                onChange={(e) => handleUpdateNote(e.target.value)}
                placeholder={`Jot down personal study notes, key terms, formulas, and CLI flags for Domain ${currentDomain.domainNumber}: ${currentDomain.name}...\n\nClick 'Insert Starter Template' above for pre-formatted CEH v13 review topics!`}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono leading-relaxed placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y shadow-inner"
              />
            </div>

            {/* Bottom Helper Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Synchronized with localStorage ({STORAGE_KEYS.WRITTEN_DOMAIN_NOTES})</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Tips: Use Markdown headers (##), bullet points (-), or code blocks (```)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
