import { ExamDomainProgress } from '../types';

export const EXAM_DOMAINS_PROGRESS: ExamDomainProgress[] = [
  {
    id: 'domain-1',
    domainNumber: 1,
    name: 'Information Security & Ethical Hacking Overview',
    blueprintWeight: 6,
    color: '#10b981', // emerald-500
    summary: 'Cyber law frameworks, Rules of Engagement (RoE), ethical hacking methodologies, and compliance standards (CFAA, GDPR, HIPAA, PCI-DSS).',
    tasks: [
      {
        id: 'd1-lab-1',
        title: 'Cisco NetAcad Ethics & Authorized Scope Lab',
        type: 'lab',
        description: 'Practice establishing Rules of Engagement (RoE), defining testing boundaries, and generating authorization paperwork.',
      },
      {
        id: 'd1-note-1',
        title: 'CFAA 18 U.S.C. § 1030 & Cyber Crime Statutes',
        type: 'note',
        description: 'Understand federal and international laws distinguishing white-hat penetration testing from unlawful tampering.',
      },
      {
        id: 'd1-note-2',
        title: 'Cyber Kill Chain vs. MITRE ATT&CK Matrix',
        type: 'note',
        description: 'Map Lockheed Martin Kill Chain phases to MITRE ATT&CK tactics, techniques, and procedures (TTPs).',
      },
      {
        id: 'd1-note-3',
        title: 'Security Compliance Standards (PCI-DSS, HIPAA, NIST)',
        type: 'note',
        description: 'Review mandatory auditing requirements, vulnerability management cycles, and remediation reporting.',
      },
    ],
  },
  {
    id: 'domain-2',
    domainNumber: 2,
    name: 'Reconnaissance & Footprinting',
    blueprintWeight: 21,
    color: '#06b6d4', // cyan-500
    summary: 'High-weight domain covering passive OSINT, active Nmap scanning, DNS enumeration, WHOIS lookups, and network topology discovery.',
    tasks: [
      {
        id: 'd2-lab-1',
        title: 'Nmap Comprehensive Port & Version Sweep Lab',
        type: 'lab',
        description: 'Execute stealth SYN (-sS), service version (-sV), and OS detection (-O) sweeps across target class C subnets.',
      },
      {
        id: 'd2-lab-2',
        title: 'DNS AXFR Full Zone Transfer Lab',
        type: 'lab',
        description: 'Use `dig axfr @target-dns target.com` and `host -l` to harvest unmasked subdomains and mail exchange servers.',
      },
      {
        id: 'd2-lab-3',
        title: 'TryHackMe Passive Reconnaissance Room',
        type: 'lab',
        description: 'Practice OSINT collection using Shodan, Censys, theHarvester, and Wayback Machine data.',
      },
      {
        id: 'd2-note-1',
        title: 'Advanced Google Dorking & Search Operators Reference',
        type: 'note',
        description: 'Study `site:`, `filetype:env`, `inurl:`, and `intitle:` search queries used for sensitive credential discovery.',
      },
      {
        id: 'd2-note-2',
        title: 'Network Scanning Flags & 3-Way Handshake Behaviors',
        type: 'note',
        description: 'Master packet response tables: SYN/ACK on open ports, RST on closed ports for SYN, FIN, NULL, and Xmas scans.',
      },
    ],
  },
  {
    id: 'domain-3',
    domainNumber: 3,
    name: 'System Hacking & Attack Techniques',
    blueprintWeight: 17,
    color: '#3b82f6', // blue-500
    summary: 'Gaining access, privilege escalation, Windows SAM registry extraction, Linux SUID/sudo exploits, and maintaining persistent backdoors.',
    tasks: [
      {
        id: 'd3-lab-1',
        title: 'Linux SUID & PATH Hijacking Privilege Escalation Lab',
        type: 'lab',
        description: 'Exploit custom binaries with SUID bits set using `/tmp` PATH hijacking to achieve root execution.',
      },
      {
        id: 'd3-lab-2',
        title: 'Windows SAM Dumping & John the Ripper Cracking Lab',
        type: 'lab',
        description: 'Extract SYSTEM and SAM registry hives and crack NTLM password hashes using John and Hashcat mode 1000.',
      },
      {
        id: 'd3-lab-3',
        title: 'Metasploit Msfvenom Reverse TCP Staged Payload Lab',
        type: 'lab',
        description: 'Craft staged reverse TCP Meterpreter binaries and catch connections with `exploit/multi/handler`.',
      },
      {
        id: 'd3-note-1',
        title: 'Windows Token Impersonation & Potato Exploits',
        type: 'note',
        description: 'Study RottenPotato, JuicyPotato, and SweetPotato abusing SeImpersonatePrivilege on IIS services.',
      },
      {
        id: 'd3-note-2',
        title: 'Pass-the-Hash (PtH) & Kerberoasting Techniques',
        type: 'note',
        description: 'Analyze Kerberos ticket-granting service (TGS) extraction and offline SPN ticket cracking with hashcat.',
      },
    ],
  },
  {
    id: 'domain-4',
    domainNumber: 4,
    name: 'Network & Perimeter Hacking',
    blueprintWeight: 14,
    color: '#8b5cf6', // violet-500
    summary: 'Packet sniffing, ARP poisoning, firewalking, IDS/IPS evasion, Wireshark filter syntax, and Denial of Service mechanics.',
    tasks: [
      {
        id: 'd4-lab-1',
        title: 'Cisco Ettercap ARP Spoofing & Credential Interception Lab',
        type: 'lab',
        description: 'Poison target ARP caches using gratuitous ARP replies to route traffic through attacker gateway.',
      },
      {
        id: 'd4-lab-2',
        title: 'Wireshark PCAP Decryption & Traffic Analysis Lab',
        type: 'lab',
        description: 'Filter pcap streams using `http.request.method == POST` and extract plaintext FTP / HTTP login strings.',
      },
      {
        id: 'd4-lab-3',
        title: 'Snort Rule Evasion & Packet Fragmentation Lab',
        type: 'lab',
        description: 'Use Fragroute and Nmap `-f` MTU fragmentation to bypass signature-based intrusion detection systems.',
      },
      {
        id: 'd4-note-1',
        title: 'DoS/DDoS Vectors (SYN Flood, Slowloris, Smurf)',
        type: 'note',
        description: 'Examine SYN cookies, ICMP broadcast amplification, and incomplete HTTP header exhaustion attacks.',
      },
      {
        id: 'd4-note-2',
        title: 'VLAN Hopping & Switch CAM Table Flooding (macof)',
        type: 'note',
        description: 'Understand switch failover to hub mode when MAC tables overflow, allowing switched packet interception.',
      },
    ],
  },
  {
    id: 'domain-5',
    domainNumber: 5,
    name: 'Web Application Hacking',
    blueprintWeight: 16,
    color: '#f59e0b', // amber-500
    summary: 'OWASP Top 10 vulnerabilities: SQL Injection, Cross-Site Scripting (XSS), Command Injection, SSRF, IDOR, and API flaws.',
    tasks: [
      {
        id: 'd5-lab-1',
        title: 'DVWA SQL Injection Union & Error-Based Extraction Lab',
        type: 'lab',
        description: 'Bypass authentication with `\' OR 1=1 --` and execute SQLMap automated table dumps.',
      },
      {
        id: 'd5-lab-2',
        title: 'OWASP Juice Shop Cross-Site Scripting (XSS) Lab',
        type: 'lab',
        description: 'Test reflected, stored, and DOM-based XSS payload triggers inside product reviews and search inputs.',
      },
      {
        id: 'd5-lab-3',
        title: 'Commix OS Command Injection Lab',
        type: 'lab',
        description: 'Automate command injection exploitation against unescaped PHP `system()` and `exec()` endpoints.',
      },
      {
        id: 'd5-note-1',
        title: 'OWASP Top 10 Vulnerabilities & Code Defenses',
        type: 'note',
        description: 'Master parameterized queries, context-aware HTML output encoding, and Content Security Policy (CSP).',
      },
      {
        id: 'd5-note-2',
        title: 'Server-Side Request Forgery (SSRF) & Cloud Metadata Access',
        type: 'note',
        description: 'Understand how manipulating server URL fetchers allows querying internal 169.254.169.254 endpoints.',
      },
    ],
  },
  {
    id: 'domain-6',
    domainNumber: 6,
    name: 'Wireless Network Hacking',
    blueprintWeight: 6,
    color: '#ec4899', // pink-500
    summary: '802.11 protocol frame structures, WEP vs WPA2/WPA3, deauthentication attacks, Rogue APs, and Bluetooth vulnerabilities.',
    tasks: [
      {
        id: 'd6-lab-1',
        title: 'Aircrack-ng 4-Way Handshake Capture & Deauth Lab',
        type: 'lab',
        description: 'Send 802.11 deauth frames with `aireplay-ng` and capture WPA2 EAPOL handshakes with `airodump-ng`.',
      },
      {
        id: 'd6-lab-2',
        title: 'Evil Twin & Rogue Access Point Simulation Lab',
        type: 'lab',
        description: 'Deploy clone SSIDs with Airbase-ng to trick victim workstations into transmitting cleartext credentials.',
      },
      {
        id: 'd6-note-1',
        title: 'WPA2 4-Way Handshake Mathematics & PMKID Attack',
        type: 'note',
        description: 'Analyze ANonce, SNonce, MIC, and clientless PMKID attacks against the wireless access point.',
      },
      {
        id: 'd6-note-2',
        title: 'Bluetooth Attacks (Bluejacking, Bluesnarfing, Bluebugging)',
        type: 'note',
        description: 'Distinguish between unsolicited vCard messages (jacking), data theft (snarfing), and device control (bugging).',
      },
    ],
  },
  {
    id: 'domain-7',
    domainNumber: 7,
    name: 'Mobile, IoT & Operational Technology (OT)',
    blueprintWeight: 8,
    color: '#14b8a6', // teal-500
    summary: 'Mobile OS security architectures (Android/iOS), reverse engineering APKs, SCADA/ICS Modbus protocol analysis, and IoT attacks.',
    tasks: [
      {
        id: 'd7-lab-1',
        title: 'Android APK Decompilation & Reverse Engineering Lab',
        type: 'lab',
        description: 'Decompile Android application packages using `apktool` and `jadx-gui` to audit hardcoded API secrets.',
      },
      {
        id: 'd7-lab-2',
        title: 'Modbus & SCADA Industrial Network Capture Lab',
        type: 'lab',
        description: 'Inspect cleartext Modbus TCP function codes (Read Holding Registers) inside industrial control networks.',
      },
      {
        id: 'd7-note-1',
        title: 'Android & iOS Sandbox & Rooting Defenses',
        type: 'note',
        description: 'Understand UID separation, SELinux enforcement, and SafetyNet / Play Integrity attestation.',
      },
      {
        id: 'd7-note-2',
        title: 'OWASP IoT Top 10 & Hardware Firmware Extraction',
        type: 'note',
        description: 'Study insecure default credentials, weak update mechanisms, and UART / JTAG hardware debugging interfaces.',
      },
    ],
  },
  {
    id: 'domain-8',
    domainNumber: 8,
    name: 'Cloud Computing & Container Security',
    blueprintWeight: 6,
    color: '#6366f1', // indigo-500
    summary: 'Cloud shared responsibility models, AWS/Azure/GCP IAM misconfigurations, container breakouts, and S3 bucket auditing.',
    tasks: [
      {
        id: 'd8-lab-1',
        title: 'Cloud Storage Bucket Auditing & Permission Sweep Lab',
        type: 'lab',
        description: 'Use tools like `s3scanner` and AWS CLI to detect world-readable buckets exposing database backups.',
      },
      {
        id: 'd8-lab-2',
        title: 'Docker Container Breakout & Socket Exposure Lab',
        type: 'lab',
        description: 'Mount `/var/run/docker.sock` from inside an unprivileged container to escalate to host root.',
      },
      {
        id: 'd8-note-1',
        title: 'Cloud Shared Responsibility Model (IaaS, PaaS, SaaS)',
        type: 'note',
        description: 'Identify vendor vs customer boundaries for OS patching, hypervisor security, and IAM policy governance.',
      },
      {
        id: 'd8-note-2',
        title: 'Cloud Instance Metadata Service (IMDSv1 vs IMDSv2)',
        type: 'note',
        description: 'Understand how IMDSv2 PUT token headers defend against simple SSRF credential exfiltration.',
      },
    ],
  },
  {
    id: 'domain-9',
    domainNumber: 9,
    name: 'Cryptography & Steganography',
    blueprintWeight: 6,
    color: '#a855f7', // purple-500
    summary: 'Symmetric/asymmetric algorithms, hashing algorithms, PKI digital certificates, and LSB image/audio steganography.',
    tasks: [
      {
        id: 'd9-lab-1',
        title: 'Steghide & OpenStego Image Extraction Lab',
        type: 'lab',
        description: 'Extract password-protected secret archives hidden inside JPEG/BMP files using `steghide extract`.',
      },
      {
        id: 'd9-lab-2',
        title: 'OpenSSL RSA Key Pair Generation & Encryption Lab',
        type: 'lab',
        description: 'Generate 4096-bit RSA keys, encrypt test documents with public keys, and decrypt with private keys.',
      },
      {
        id: 'd9-note-1',
        title: 'Symmetric Block Ciphers & Mode Comparison (ECB vs CBC vs GCM)',
        type: 'note',
        description: 'Study pattern leakage in ECB, IV initialization in CBC, and authenticated encryption in Galois/Counter Mode.',
      },
      {
        id: 'd9-note-2',
        title: 'Public Key Infrastructure (PKI) & Digital Signatures',
        type: 'note',
        description: 'Review X.509 certificate chains, Root Certificate Authorities (CAs), CRLs, and OCSP stapling.',
      },
    ],
  },
];
