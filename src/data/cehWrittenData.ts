import { LabEnvironment, GitHubRepoNote, VideoCourse } from '../types';

export const LAB_ENVIRONMENTS: LabEnvironment[] = [
  {
    id: 'cisco-netacad',
    title: 'Cisco Networking Academy – Ethical Hacking Course',
    category: 'cisco',
    tag: 'Official Packet Tracer & Kali Guided Labs',
    difficulty: 'Intermediate',
    description: 'Designed to bridge the practical gap between network architecture and offensive penetration testing. Features cloud-delivered virtual labs with pre-configured network topologies, routing tables, and Kali Linux attack stations.',
    architecture: 'Multi-subnet corporate topology (DMZ, Internal LAN, Management VLAN) connected via Cisco virtual routers. Attacker station on Kali Linux VM with target endpoints running vulnerable Linux and Windows services.',
    setupInstructions: [
      'Enroll in the Cisco NetAcad Ethical Hacking self-paced or instructor-led course track (often free through affiliated institutions).',
      'Launch the browser-based virtual environment or install Cisco Packet Tracer 8.2+ with Kali Linux VM image.',
      'Configure IP addressing on eth0 to mirror the target subnet (192.168.1.0/24).',
      'Execute reconnaissance protocols against gateway switches and perimeter firewalls before testing internal hosts.'
    ],
    keyVulnerabilitiesDemonstrated: [
      'ARP poisoning and Man-in-the-Middle (MITM) via Ettercap/Bettercap',
      'VLAN hopping and switch port security bypass',
      'SNMP community string brute forcing (public/private strings exposing routing tables)',
      'Router ACL misconfigurations allowing unauthorized ICMP and Telnet access'
    ],
    recommendedCommands: [
      'snmpwalk -v 2c -c public 192.168.1.1 1.3.6.1.2.1.1',
      'ettercap -T -q -M arp:remote /192.168.1.1// /192.168.1.105//',
      'nmap -sS -sV -O --traceroute 192.168.1.0/24 -oN cisco_netscan.txt'
    ],
    officialUrl: 'https://www.netacad.com/courses/cybersecurity/ethical-hacker'
  },
  {
    id: 'local-virtualization',
    title: 'Local Virtualization Lab - 101 Labs & Vulnerable Apps',
    category: 'local',
    tag: 'VirtualBox / VMware + DVWA & OWASP Juice Shop',
    difficulty: 'Beginner',
    description: 'Build your own zero-cost, isolated testing sandbox on your computer using free hypervisors. Set up Kali Linux as your attacker operating system and deploy intentionally vulnerable microservices (DVWA & OWASP Juice Shop) to witness input sanitization failures in real code.',
    architecture: 'Host-Only or Internal Network (vboxnet0 / vmnet1) isolating target VMs and containers from your physical home Wi-Fi to prevent rogue broadcast packets.',
    setupInstructions: [
      'Install VirtualBox 7.x (free & open source) or VMware Workstation Player.',
      'Download and import the official Kali Linux Virtual Appliance (.ova) with 4GB RAM and 2 vCPUs.',
      'Option A (DVWA via Docker): Run `docker run --rm -it -p 80:80 vulnerables/web-dvwa` on target VM.',
      'Option B (OWASP Juice Shop via Docker): Run `docker run --rm -p 3000:3000 bkimminich/juice-shop`.',
      'Verify connectivity by curling the target IP from your Kali terminal: `curl -I http://192.168.56.101`.'
    ],
    keyVulnerabilitiesDemonstrated: [
      'SQL Injection (Authentication bypass: "\' OR \'1\'=\'1" and Union-based database dumping)',
      'Command Injection (Exploiting unescaped `system()` or `exec()` calls in PHP/Node.js ping forms)',
      'Cross-Site Scripting (Reflected, Stored, and DOM-based script injection in search fields)',
      'Insecure Direct Object Reference (IDOR) & Broken Access Control in modern REST APIs'
    ],
    recommendedCommands: [
      'sqlmap -u "http://192.168.56.101/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="PHPSESSID=..." --batch',
      'commix --url="http://192.168.56.101/vulnerabilities/exec/" --data="ip=127.0.0.1&Submit=submit" --cookie="..."',
      'wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt --hc 404 http://192.168.56.101/FUZZ'
    ],
    officialUrl: 'https://github.com/digininja/DVWA'
  },
  {
    id: 'tryhackme-free',
    title: 'TryHackMe - Free Tier Interactive Browser Rooms',
    category: 'tryhackme',
    tag: 'Cloud-Based Disposable Target Instances',
    difficulty: 'Beginner',
    description: 'Interactive browser-based terminal rooms to practice basic enumeration and network scanning protocols without requiring a heavy local hypervisor or consuming local storage. Connect directly via the in-browser AttackBox or your own OpenVPN configuration.',
    architecture: 'Private cloud subnet (10.10.x.x) dynamically spawned per exercise with ephemeral IP assignments and automatic teardown.',
    setupInstructions: [
      'Create a free account at tryhackme.com.',
      'Download your personal `.ovpn` configuration file from your profile access page.',
      'Connect from Kali terminal using: `sudo openvpn --config <username>.ovpn`.',
      'Deploy the recommended free rooms: "Intro to Offensive Security", "Nmap", "Wireshark 101", "Burp Suite: Basics", and "Juice Shop".',
      'Verify VPN tun0 IP address: `ip addr show tun0`.'
    ],
    keyVulnerabilitiesDemonstrated: [
      'Network service enumeration across uncommon high ports (8080, 8443, 9000)',
      'SSH credential brute-forcing with Hydra against default configurations',
      'Anonymous FTP login and world-readable backup file discovery',
      'Privilege escalation via SUID binaries and misconfigured sudo permissions (`sudo -l`)'
    ],
    recommendedCommands: [
      'sudo openvpn user.ovpn &',
      'nmap -sV -sC -T4 10.10.x.x -oN thm_scan.txt',
      'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://10.10.x.x -t 4'
    ],
    officialUrl: 'https://tryhackme.com'
  }
];

export const GITHUB_REPO_NOTES: GitHubRepoNote[] = [
  {
    id: 'mr-infect',
    title: 'Mr-Infect / ceh-v13-notes',
    authorRepo: 'Mr-Infect / ceh-v13-notes',
    url: 'https://github.com/Mr-Infect/ceh-v13-notes',
    focus: 'Core CEH v13 Blueprint Breakdown, Protocols, & Tool Methodologies',
    highlights: [
      'Organized strictly by EC-Council CEH v13 exam domains (Recon, Scanning, System Hacking, Malware, Sniffing, Social Engineering, Web/Wireless, Cryptography)',
      'Streamlined definitions and protocol port tables (e.g. Kerberos 88, NetBIOS 137-139, SMB 445, LDAP 389/636)',
      'Clear distinctions between asymmetric algorithms (RSA, ECC, Diffie-Hellman) and symmetric ciphers (AES, 3DES, RC4)',
      'Comprehensive cyber kill-chain mapping from footprinting to clearing tracks'
    ],
    cheatSheetPreview: `# Domain 02: Scanning Networks
- TCP Connect Scan (-sT): Complete 3-way handshake (SYN -> SYN/ACK -> ACK). High logging footprint.
- TCP SYN Stealth Scan (-sS): Half-open (SYN -> SYN/ACK -> RST). Default, fast, stealthy.
- FIN Scan (-sF): RFC 793 standard. Closed ports send RST; open ports drop packet. Fails against Windows.
- Xmas Scan (-sX): Sets FIN, PSH, and URG flags simultaneously ("lit up like a Christmas tree").
- Idle/Zombie Scan (-sI zombie_ip): Blind scan exploiting IP ID predictability of a passive host.`,
    sampleCommands: [
      { cmd: 'nmap -sS -T4 -p- 10.10.10.5', desc: 'Full 65,535 TCP port SYN stealth scan' },
      { cmd: 'nmap -sU -p 53,67,68,161,162 10.10.10.5', desc: 'Targeted UDP scan on critical protocol services' },
      { cmd: 'nikto -h http://target.local -C all', desc: 'Scan target web server for known CGI vulnerabilities' }
    ]
  },
  {
    id: 'phirojshah',
    title: 'phirojshah / CEH',
    authorRepo: 'phirojshah / CEH',
    url: 'https://github.com/phirojshah/CEH',
    focus: 'CEH Practical Materials & Command Cheat Sheets',
    highlights: [
      'Syntax cheat sheets mapped specifically to tools required in the practical exam',
      'Emphasizes the foundational golden rule: pipe all scan outputs immediately into desktop text files (`> nmap_initial.txt`)',
      'Covers enum4linux, smbclient, rpcclient, and null session exploitation',
      'Provides copy-paste commands for sqlmap tamper scripts, database dumping, and hash cracking'
    ],
    cheatSheetPreview: `# Essential Scanning & Piping Strategy
# Golden Rule: Pipe output to desktop folder so you don't rescan during timed challenges
mkdir -p ~/Desktop/Exam_Output
nmap -A -p- -T4 <TARGET_IP> -oN ~/Desktop/Exam_Output/nmap_all_ports.txt

# Null Session & SMB Enumeration
enum4linux -a <TARGET_IP> | tee ~/Desktop/Exam_Output/enum4linux.txt
smbclient -L //<TARGET_IP> -N
rpcclient -U "" -N <TARGET_IP>`,
    sampleCommands: [
      { cmd: 'enum4linux -U -S 192.168.1.50', desc: 'Enumerate users and active SMB shares via null session' },
      { cmd: 'sqlmap -u "http://target/item.php?id=1" --dbs --batch', desc: 'Enumerate all databases on vulnerable endpoint' },
      { cmd: 'sqlmap -u "http://target/item.php?id=1" -D target_db --tables --batch', desc: 'List tables in selected database' }
    ]
  },
  {
    id: 'sngwn',
    title: 'SNGWN / CEH-Notes',
    authorRepo: 'SNGWN / CEH-Notes',
    url: 'https://github.com/SNGWN/CEH-Notes',
    focus: 'Rapid Domain Breakdown & CLI Tool Associations',
    highlights: [
      'Rapid-skim domain breakdowns designed for quick review before taking tests',
      'Maps every theoretical concept directly to the CLI tool that executes it (e.g. DNS Zone Transfer -> dig axfr / host -l)',
      'Covers mobile platforms, IoT/OT protocols (MQTT, Modbus), and cloud security vectors (AWS S3 bucket misconfigurations)',
      'Summarizes regulatory compliance frameworks tested on the written exam (NIST, HIPAA, PCI-DSS, ISO 27001)'
    ],
    cheatSheetPreview: `# CEH Domain to Tool Matrix
- DNS Zone Transfer: dig axfr @ns1.target.com target.com / host -l target.com ns1.target.com
- Steganography Detection: stegdetect, zsteg, steghide extract -sf image.jpg
- Cryptographic Hashes: md5sum, sha256sum, hashid, hash-identifier
- WiFi Auditing: airodump-ng, aireplay-ng (deauth), aircrack-ng
- DoS/DDoS Simulation: hping3 --flood -S -p 80 <IP>, LOIC, HOIC`,
    sampleCommands: [
      { cmd: 'dig axfr @dns_server domain.com', desc: 'Attempt DNS full zone transfer' },
      { cmd: 'steghide extract -sf confidential.jpg -p "password123"', desc: 'Extract hidden text payload with passphrase' },
      { cmd: 'hashid "e110adc3949ba59abbe56e057f20f883"', desc: 'Identify algorithm of given cryptographic hash' }
    ]
  }
];

export const VIDEO_COURSES: VideoCourse[] = [
  {
    id: 'ethical-hacking-2026',
    title: 'Ethical Hacking Full Course 2026 - Masterclass Walkthrough',
    provider: 'FreeCodeCamp / Cyber Security Academy',
    duration: '12+ Hours Intensive',
    youtubeId: '3Kq1MIfTWCE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE',
    description: 'A comprehensive, end-to-end masterclass covering modern network reconnaissance, packet analysis, vulnerability scanning with Nessus/OpenVAS, web application penetration testing, and exploitation frameworks in real time.',
    keyTopics: [
      'Networking Fundamentals (TCP/IP, OSI Model, Subnetting, Port Multiplexing)',
      'Reconnaissance & Footprinting (OSINT, WHOIS, DNS Harvesting, Google Dorking)',
      'Scanning & Enumeration (Nmap flags, Banner Grabbing, Vulnerability Assessment)',
      'Metasploit Framework, Meterpreter payloads, and Post-Exploitation',
      'Wireless Security (WPA2 4-way handshake capture and dictionary attacks)'
    ],
    chapters: [
      { title: 'Introduction & Ethical Hacking Lab Architecture', timestamp: '00:00:00' },
      { title: 'Linux Command-Line Mastery for Penetration Testers', timestamp: '00:45:30' },
      { title: 'Deep Dive: TCP 3-Way Handshake & Packet Flags', timestamp: '01:30:15' },
      { title: 'Active Network Scanning with Nmap and Zenmap', timestamp: '02:45:00' },
      { title: 'Web App Attacks: SQLi, XSS, and CSRF Demystified', timestamp: '05:15:20' },
      { title: 'Metasploit, Reverse Shells, and Meterpreter Pivoting', timestamp: '08:10:45' }
    ]
  },
  {
    id: 'edureka-hacking',
    title: 'Edureka Ethical Hacking Course for Beginners',
    provider: 'Edureka Cyber Security',
    duration: '10 Hours Comprehensive',
    youtubeId: 'fNzpcB7ODxQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/fNzpcB7ODxQ',
    description: 'Clear, step-by-step visual demonstrations specifically tailored to the EC-Council CEH exam syllabus. Ideal for visualizing how traffic flows across routers and how payload listeners receive inbound shells.',
    keyTopics: [
      'CEH Exam Structure, Domains, and Passing Strategy',
      'System Hacking: Password Cracking (Rainbow Tables, Dictionary, Brute Force)',
      'Malware Threats (Trojans, Worms, Ransomware, Fileless Malware)',
      'Sniffing with Wireshark & Detecting Promiscuous Mode',
      'Cryptography: Asymmetric vs Symmetric Ciphers & Public Key Infrastructure'
    ],
    chapters: [
      { title: 'CEH Roadmap & Core Security Principles (CIA Triad)', timestamp: '00:00:00' },
      { title: 'Information Gathering & Footprinting Tools', timestamp: '01:12:00' },
      { title: 'Port Scanning, Banner Grabbing & Service Fingerprinting', timestamp: '02:50:30' },
      { title: 'Password Attacks with John the Ripper and Hydra', timestamp: '04:35:10' },
      { title: 'Network Sniffing & Wireshark Filter Syntax', timestamp: '06:20:00' },
      { title: 'Cryptography, Hashes, and Steganography in Practice', timestamp: '08:15:00' }
    ]
  }
];
