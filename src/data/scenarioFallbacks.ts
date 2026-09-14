import { ScenarioPracticeQuestion } from '../types';

export const FALLBACK_SCENARIO_QUESTIONS: Record<string, ScenarioPracticeQuestion[]> = {
  'domain-1': [
    {
      id: 'sc-d1-01',
      domainId: 'domain-1',
      category: 'Domain 1: InfoSec & Ethical Hacking Overview',
      scenario: 'You are contracted as an external penetration tester for a major healthcare provider. During scoping, the client strictly specifies that you will receive only the target domain name and ASN, with zero credentials, architecture diagrams, or source code. Halfway through the engagement, you discover an unauthenticated web portal exposing HIPAA-regulated electronic protected health information (ePHI).',
      question: 'According to EC-Council Rules of Engagement (RoE) and ethical standards, what should be your immediate next action?',
      options: [
        'Exfiltrate sample ePHI records to your encrypted jumpbox to prove exploitability in the final deliverable',
        'Immediately pause testing on that component, document the exact finding, and notify the designated primary client contact without downloading sensitive ePHI',
        'Pivot into the underlying database subnet using automated sqlmap scripts to assess lateral movement risk',
        'Post a redacted disclosure on GitHub security advisories to warn the healthcare community'
      ],
      correctIndex: 1,
      explanation: 'Under ethical penetration testing guidelines and signed Rules of Engagement (RoE), discovering sensitive personal or regulatory data (ePHI, PCI-DSS, PII) mandates an immediate halt on testing that component and emergency notification of the client. Exfiltrating actual patient data creates severe legal and compliance liabilities under HIPAA and the CFAA.',
      keyTakeaway: 'Always immediately notify the client upon discovering live regulated data (HIPAA/PCI); never exfiltrate sensitive records to prove a vulnerability.',
      mitreTechnique: 'M1047: Risk Assessment / Scoping Compliance',
      suggestedFlashcardAnswer: 'Immediately pause testing on that component, document findings, and notify designated client contact without downloading sensitive regulated records.'
    },
    {
      id: 'sc-d1-02',
      domainId: 'domain-1',
      category: 'Domain 1: InfoSec & Ethical Hacking Overview',
      scenario: 'A financial institution calculates a CVSS v3.1 score for a newly discovered vulnerability on an external-facing customer login API. The metric vector indicates: Attack Vector: Network (AV:N), Attack Complexity: Low (AC:L), Privileges Required: None (PR:N), User Interaction: None (UI:N), Scope: Unchanged (S:U), Confidentiality: High (C:H), Integrity: High (I:H), Availability: None (A:N).',
      question: 'What is the qualitative severity rating for this vulnerability according to the standard CVSS v3.1 Base Score matrix?',
      options: [
        'Medium (4.0 - 6.9)',
        'High (7.0 - 8.9)',
        'Critical (9.0 - 10.0)',
        'Low (0.1 - 3.9)'
      ],
      correctIndex: 2,
      explanation: 'With AV:N, AC:L, PR:N, UI:N and two High impacts (C:H, I:H), this vulnerability generates a CVSS v3.1 base score of 9.1, which falls directly into the Critical range (9.0 - 10.0). Unauthenticated remote execution or data compromise with no user interaction constitutes an emergency remediation priority.',
      keyTakeaway: 'CVSS v3.1 Base Scores between 9.0 and 10.0 are rated Critical and indicate unauthenticated network-accessible compromise.',
      mitreTechnique: 'CEH Module 1: Vulnerability Assessment & Scoring',
      suggestedFlashcardAnswer: 'Critical (9.1 Base Score) — Remote, unauthenticated attack with high confidentiality and integrity compromise.'
    }
  ],
  'domain-2': [
    {
      id: 'sc-d2-01',
      domainId: 'domain-2',
      category: 'Domain 2: Reconnaissance & Footprinting',
      scenario: 'During an external reconnaissance phase against target enterprise globex-corp.com, an ethical hacker identifies two authoritative nameservers: ns1.globex-corp.com and ns2.globex-corp.com. The tester issues the command: "dig @ns1.globex-corp.com globex-corp.com axfr". The nameserver immediately returns 284 resource records including dev-vpn.globex-corp.com (10.14.2.5), internal-jira.globex-corp.com, and staging-db.internal.',
      question: 'What security misconfiguration occurred, and what specific remediation should the network administrator apply on BIND / DNS servers?',
      options: [
        'DNSSEC was improperly enabled; the administrator should disable TSIG keys on root resolvers',
        'Unrestricted DNS Zone Transfer; configure "allow-transfer { trusted_secondary_ips; };" in named.conf',
        'Split-Horizon DNS failed to forward reverse PTR lookups; open TCP port 53 on border stateful firewalls',
        'DNS Amplification vulnerability; enable open recursion on all external caching resolvers'
      ],
      correctIndex: 1,
      explanation: 'AXFR is a DNS Zone Transfer request meant only for synchronizing primary and secondary nameservers over TCP port 53. Leaving AXFR open to the public allows attackers to dump the entire internal DNS zone map. Remediation requires restricting AXFR to known secondary nameservers using "allow-transfer" or TSIG transaction signatures.',
      keyTakeaway: 'AXFR queries over TCP 53 must be restricted exclusively to trusted secondary nameservers using allow-transfer or TSIG.',
      mitreTechnique: 'T1590.002: Gather Victim Network Information: DNS',
      suggestedFlashcardAnswer: 'Unrestricted DNS Zone Transfer (AXFR) over TCP 53; remediate by configuring allow-transfer with trusted IP addresses in named.conf.'
    },
    {
      id: 'sc-d2-02',
      domainId: 'domain-2',
      category: 'Domain 2: Reconnaissance & Footprinting',
      scenario: 'A penetration tester wants to map live IP addresses in the subnet 192.168.10.0/24 without triggering IDS alert thresholds. The corporate border router is configured to block ICMP Type 8 (Echo Request) packets, rendering standard ping sweeps ineffective.',
      question: 'Which Nmap command option executes an ACK ping probe to port 80 and 443 to elicit an RST from live stateful hosts while bypassing standard ICMP echo blocking?',
      options: [
        'nmap -sn -PA80,443 192.168.10.0/24',
        'nmap -sU -p 53 192.168.10.0/24',
        'nmap -sF -p 80 192.168.10.0/24',
        'nmap -sI zombie.target.local 192.168.10.0/24'
      ],
      correctIndex: 0,
      explanation: 'The "-PA80,443" flag instructs Nmap to send TCP ACK packets to ports 80 and 443 during host discovery (-sn = no port scan). Because stateless ACK packets appear as part of an established session, stateless firewalls frequently forward them. Live hosts will respond with an RST packet (since no session existed), revealing their live status despite ICMP echo drops.',
      keyTakeaway: 'nmap -PA sends TCP ACK packets to detect live hosts when ICMP Echo (Type 8) is filtered by firewalls.',
      mitreTechnique: 'T1046: Network Service Discovery',
      suggestedFlashcardAnswer: 'nmap -sn -PA80,443 <subnet> sends TCP ACK packets to eliciting RST from live hosts while bypassing ICMP blocks.'
    }
  ],
  'domain-3': [
    {
      id: 'sc-d3-01',
      domainId: 'domain-3',
      category: 'Domain 3: System Hacking & Privilege Escalation',
      scenario: 'After obtaining unprivileged SSH access as user "www-data" on an Ubuntu 22.04 LTS production web server, a penetration tester runs "find / -perm -4000 -type f 2>/dev/null" to inspect SUID binaries. The output reveals /usr/bin/python3 has the SUID bit set with ownership root:root.',
      question: 'Which GTFOBins command line allows the tester to immediately spawn an interactive root shell utilizing this misconfiguration?',
      options: [
        'python3 -c "import pty; pty.spawn(\'/bin/bash\')"',
        'python3 -c "import os; os.execl(\'/bin/sh\', \'sh\', \'-p\')"',
        'chmod 777 /etc/shadow && cat /etc/shadow',
        'python3 -m SimpleHTTPServer 8080'
      ],
      correctIndex: 1,
      explanation: 'When a binary has the SUID permission (4000) owned by root, invoking the shell with the "-p" flag prevents the shell from dropping its effective UID (EUID 0). The command "os.execl(\'/bin/sh\', \'sh\', \'-p\')" maintains root privileges and delivers an instant root command interpreter.',
      keyTakeaway: 'SUID python binaries require the "-p" flag in /bin/sh to preserve root EUID and prevent shell privilege drop.',
      mitreTechnique: 'T1548.001: Abuse Elevation Control Mechanism: Setuid and Setgid',
      suggestedFlashcardAnswer: 'python3 -c "import os; os.execl(\'/bin/sh\', \'sh\', \'-p\')" leverages SUID on python3 to spawn a root shell without dropping EUID.'
    },
    {
      id: 'sc-d3-02',
      domainId: 'domain-3',
      category: 'Domain 3: System Hacking & Privilege Escalation',
      scenario: 'An attacker has compromised an Active Directory domain-joined workstation and dumped the local LSASS memory using procdump.exe. The attacker obtains the NTLM hash of a Domain Admin account: "aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0". The plaintext password contains 24 complex characters and cannot be cracked via dictionary attack.',
      question: 'Which post-exploitation offensive technique allows the attacker to authenticate to the Primary Domain Controller via SMB without cracking the plaintext password?',
      options: [
        'Pass-the-Ticket (PtT) using forged Golden Kerberos tickets only',
        'Pass-the-Hash (PtH) using Impacket wmiexec or psexec with the raw NTLM hash',
        'ARP Cache Poisoning to intercept Kerberos AS-REQ pre-authentication',
        'DNS Spoofing to downgrade NTLMv2 authentication to LM hash'
      ],
      correctIndex: 1,
      explanation: 'The Pass-the-Hash (PtH) attack allows an adversary to authenticate to remote servers over NTLM-supported protocols (SMB, RPC, WMI) using only the NTLM hash. Tools like Impacket (wmiexec.py, psexec.py) or Mimikatz execute PtH directly, bypassing the need to ever recover the plaintext password.',
      keyTakeaway: 'Pass-the-Hash (PtH) allows authentication across Windows domains using the raw NTLM hash without cracking.',
      mitreTechnique: 'T1550.002: Use Alternate Authentication Material: Pass the Hash',
      suggestedFlashcardAnswer: 'Pass-the-Hash (PtH) via Impacket or Mimikatz authenticates directly via SMB/RPC using the NTLM hash without plaintext recovery.'
    }
  ],
  'domain-4': [
    {
      id: 'sc-d4-01',
      domainId: 'domain-4',
      category: 'Domain 4: Network & Perimeter Hacking',
      scenario: 'A network security analyst investigates an incident where an internal user reports frequent TLS certificate warning banners and intermittent connectivity. Wireshark analysis on the local VLAN reveals unsolicited ARP replies broadcasting that the default gateway MAC address (00:50:56:FE:ED:01) is associated with 00:0c:29:ab:cd:ef, which belongs to an unauthorized employee laptop.',
      question: 'What attack is taking place, and what switchport security feature permanently mitigates this threat?',
      options: [
        'MAC Flooding; configure Port Security with maximum MAC address limits',
        'ARP Cache Poisoning / Spoofing; enable Dynamic ARP Inspection (DAI) with DHCP Snooping',
        'VLAN Hopping via Double Tagging; disable 802.1Q trunking on user ports',
        'Rogue DHCP Server; enable BPDU Guard on all access interfaces'
      ],
      correctIndex: 1,
      explanation: 'The broadcast of unsolicited (gratuitous) ARP replies mapping the gateway IP to an attacker MAC is the classic signature of ARP Poisoning (MITM). Dynamic ARP Inspection (DAI) intercepts all ARP requests/replies on untrusted ports and validates them against the DHCP Snooping binding table, dropping forged frames.',
      keyTakeaway: 'ARP Cache Poisoning is mitigated at Layer 2 by Dynamic ARP Inspection (DAI) coupled with DHCP Snooping.',
      mitreTechnique: 'T1557.002: Adversary-in-the-Middle: ARP Poisoning',
      suggestedFlashcardAnswer: 'ARP Cache Poisoning / Man-in-the-Middle; remediated with Dynamic ARP Inspection (DAI) and DHCP Snooping.'
    },
    {
      id: 'sc-d4-02',
      domainId: 'domain-4',
      category: 'Domain 4: Network & Perimeter Hacking',
      scenario: 'While reviewing a Wireshark capture of a suspicious port scan against an edge firewall, an engineer notices thousands of TCP packets arriving with both the SYN and FIN flags set simultaneously (flags 0x003). Normal RFC 793 implementations state that SYN (synchronize sequence) and FIN (terminate connection) should never occur in the same packet.',
      question: 'What scan type is being conducted, and what was the attacker\'s historical objective with this flag combination?',
      options: [
        'XMAS Scan (FIN, PSH, URG) designed to bypass stateless Linux iptables',
        'SYN/FIN Scan designed to bypass primitive packet-filtering firewalls that only inspect the SYN flag',
        'Null Scan (no flags set) designed to elicit RST responses from Windows hosts',
        'ACK Scan designed to map firewall rule sets and detect stateful connection tracking'
      ],
      correctIndex: 1,
      explanation: 'A SYN/FIN scan sets both SYN and FIN flags. Simple packet filters that only check if the SYN flag is set (to drop incoming new connections) can be confused by the simultaneous FIN flag, allowing the packet to slip past the boundary to the host.',
      keyTakeaway: 'SYN/FIN packets violate RFC 793 and are crafted to evade naive packet filters that inspect only single flags.',
      mitreTechnique: 'T1046: Network Service Discovery: Flag Manipulation',
      suggestedFlashcardAnswer: 'SYN/FIN Scan; crafted to bypass primitive packet filters that evaluate only the SYN flag.'
    }
  ],
  'domain-5': [
    {
      id: 'sc-d5-01',
      domainId: 'domain-5',
      category: 'Domain 5: Web Application Hacking',
      scenario: 'During an audit of an e-commerce API endpoint "GET /api/v1/user/orders?id=1024", a security consultant enters "\' OR 1=1-- -" in the parameter. The application returns an HTTP 500 internal server error with generic text "Database error encountered". The consultant then sends: "1024 AND (SELECT 1 FROM (SELECT(SLEEP(7)))a)-- -", and notices the HTTP response takes exactly 7.12 seconds to return.',
      question: 'Which specific category of SQL Injection vulnerability has been confirmed by this observation?',
      options: [
        'Union-Based SQL Injection',
        'Error-Based SQL Injection via XPath functions',
        'Time-Based Blind SQL Injection',
        'Second-Order SQL Injection'
      ],
      correctIndex: 2,
      explanation: 'When a web application gives neither explicit SQL error details on the page (Error-based) nor prints query results into the HTML output (Union-based), inferential SQL injection must be used. Observing a server response delay matching an injected SLEEP() payload confirms Time-Based Blind SQL Injection.',
      keyTakeaway: 'Time-Based Blind SQLi is confirmed when database execution delays (SLEEP / pg_sleep) match response latency.',
      mitreTechnique: 'T1190: Exploit Public-Facing Application: SQL Injection',
      suggestedFlashcardAnswer: 'Time-Based Blind SQL Injection; validated through measurable server execution delays using SLEEP() functions.'
    },
    {
      id: 'sc-d5-02',
      domainId: 'domain-5',
      category: 'Domain 5: Web Application Hacking',
      scenario: 'A penetration tester discovers a PDF generation endpoint where users submit a URL: "POST /generate-report" with body `{"url": "http://example.com/summary"}`. The backend server fetches the URL and renders it into a PDF using a headless Chromium instance. The tester submits `{"url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"}`.',
      question: 'What vulnerability class is being exploited, and what high-value asset in an AWS cloud environment is the tester attempting to exfiltrate?',
      options: [
        'Cross-Site Scripting (XSS) attempting to steal user session cookies',
        'Server-Side Request Forgery (SSRF) attempting to exfiltrate temporary IAM role STS tokens from the Instance Metadata Service (IMDS)',
        'Local File Inclusion (LFI) attempting to read /etc/shadow directly from the host',
        'Cross-Site Request Forgery (CSRF) attempting to modify AWS Security Group rules'
      ],
      correctIndex: 1,
      explanation: '169.254.169.254 is the link-local IP for the AWS Instance Metadata Service (IMDS). When a backend server fetches attacker-controlled internal URLs (SSRF), the attacker can query IMDS to obtain IAM role credentials (AccessKeyId, SecretAccessKey, Token) and take over AWS infrastructure.',
      keyTakeaway: 'SSRF queries targeting 169.254.169.254 in cloud environments attempt to steal temporary IAM role credentials.',
      mitreTechnique: 'T1552.005: Cloud Instance Metadata API (SSRF)',
      suggestedFlashcardAnswer: 'Server-Side Request Forgery (SSRF); targets 169.254.169.254 to exfiltrate AWS IAM role credentials from IMDS.'
    }
  ],
  'domain-6': [
    {
      id: 'sc-d6-01',
      domainId: 'domain-6',
      category: 'Domain 6: Wireless Network Hacking',
      scenario: 'A wireless penetration tester positions a laptop near a corporate campus running WPA2-Enterprise with 802.1X (PEAP/MS-CHAPv2). The tester deploys a rogue Access Point broadcasting the legitimate corporate SSID with a stronger signal (Evil Twin). When legitimate employee laptops connect, the rogue AP captures MS-CHAPv2 challenge-response handshakes.',
      question: 'What tool and technique should the tester utilize to crack the intercepted MS-CHAPv2 challenge-response hashes offline?',
      options: [
        'Aircrack-ng with a wordlist or Hashcat mode 5500 (NetNTLMv1 / MS-CHAPv2)',
        'Reaver targeting WPS PIN registrar exchange',
        'Wifite attacking WEP IV initialization vectors',
        'Kismet running active Bluetooth bluesnarfing sweeps'
      ],
      correctIndex: 0,
      explanation: 'In an Evil Twin attack against WPA2-Enterprise (PEAP/MS-CHAPv2), the client sends an MS-CHAPv2 challenge-response to the rogue RADIUS server. This hash can be cracked offline using Hashcat (mode 5500) or asleap with a dictionary, exposing the employee\'s Active Directory password.',
      keyTakeaway: 'Evil Twin APs capture MS-CHAPv2 handshakes in 802.1X networks, which can be cracked offline with Hashcat or asleap.',
      mitreTechnique: 'T1557.001: Rogue Wi-Fi Access Point',
      suggestedFlashcardAnswer: 'Evil Twin Rogue AP with Hashcat mode 5500 or asleap to crack intercepted MS-CHAPv2 handshakes offline.'
    }
  ],
  'domain-7': [
    {
      id: 'sc-d7-01',
      domainId: 'domain-7',
      category: 'Domain 7: Mobile, IoT & OT Security',
      scenario: 'An ethical hacker is evaluating an industrial water filtration facility utilizing Programmable Logic Controllers (PLCs) communicating over Modbus TCP on port 502. The tester connects to the engineering workstation subnet and uses Scapy or mbtget to send Modbus function code 0x05 (Write Single Coil) to address 0x0001.',
      question: 'Why does this Modbus command execute on the PLC without requiring any credentials or authentication handshake?',
      options: [
        'The tester must have already cracked the AES-256 preshared key in the Modbus handshake',
        'Modbus TCP has no inherent authentication, encryption, or integrity verification mechanisms in its base specification',
        'The PLC is operating in DNP3 emergency bypass fallback mode',
        'Modbus utilizes zero-knowledge proof authentication that was pre-compiled into firmware'
      ],
      correctIndex: 1,
      explanation: 'The Modbus protocol was designed in 1979 for serial networks with zero security controls. Modbus TCP simply encapsulates Modbus RTU frames inside TCP port 502 packets with no authentication, encryption, or authorization. Any device with network connectivity can send arbitrary control commands.',
      keyTakeaway: 'Modbus TCP (Port 502) lacks built-in authentication or encryption, allowing arbitrary coil/register modification if reached.',
      mitreTechnique: 'T0855: Unauthorized Command Message (ICS/SCADA)',
      suggestedFlashcardAnswer: 'Modbus TCP has zero native authentication or encryption; anyone with Layer 3 access can issue control commands.'
    }
  ],
  'domain-8': [
    {
      id: 'sc-d8-01',
      domainId: 'domain-8',
      category: 'Domain 8: Cloud Computing & Containers',
      scenario: 'An attacker compromises a web application container running in Docker. While inspecting mounted volumes and file systems, the attacker discovers that the Docker daemon control socket is mounted inside the container at /var/run/docker.sock.',
      question: 'How can the attacker leverage this mounted socket to break out of the container and obtain full root access over the host operating system?',
      options: [
        'Execute "docker run -v /:/host -it alpine chroot /host" using the host Docker socket',
        'Recompile the Linux kernel inside the container using gcc',
        'Run "chmod +s /bin/bash" inside the container filesystem',
        'Issue an ARP poisoning attack against the Docker bridge interface (docker0)'
      ],
      correctIndex: 0,
      explanation: 'Mounting /var/run/docker.sock inside a container grants full administrative control over the host Docker daemon. The attacker can simply command Docker to spawn a new privileged container with the host root filesystem mounted (e.g. -v /:/host) and chroot into it, achieving immediate host root compromise.',
      keyTakeaway: 'Exposing /var/run/docker.sock inside a container allows instant host breakout via container spawning with host mounts.',
      mitreTechnique: 'T1611: Escape to Host (Container Breakout)',
      suggestedFlashcardAnswer: 'Escape via host Docker socket: run a new privileged container mounting the host root filesystem (docker run -v /:/host).'
    }
  ],
  'domain-9': [
    {
      id: 'sc-d9-01',
      domainId: 'domain-9',
      category: 'Domain 9: Cryptography & Steganography',
      scenario: 'A corporate forensic investigator receives an anonymous tip that a confidential acquisition list was exfiltrated inside an innocent-looking JPEG photo posted to an external image board. The investigator uses steghide with the command: "steghide extract -sf corporate_pic.jpg".',
      question: 'Which steganographic technique does steghide utilize by default to embed payload bytes into image files without creating perceptible distortion?',
      options: [
        'Injection into EXIF metadata camera tags',
        'Least Significant Bit (LSB) insertion into discrete cosine transform or pixel channels',
        'Asymmetric RSA key padding in image header trailers',
        'High-order bit substitution in color palette lookups'
      ],
      correctIndex: 1,
      explanation: 'Steghide employs Least Significant Bit (LSB) steganography, replacing the lowest-order bits of audio or image sample values with secret data bits. Because the least significant bit has minimal impact on visual hue/luminance or audio tone, human perception cannot detect the alteration.',
      keyTakeaway: 'Steghide embeds secret payloads using Least Significant Bit (LSB) steganography to preserve visual fidelity.',
      mitreTechnique: 'T1027.003: Steganography',
      suggestedFlashcardAnswer: 'Least Significant Bit (LSB) substitution; embeds secret payload in the lowest bits of image pixels or audio samples.'
    }
  ]
};

export function getFallbackScenariosForTopic(
  domainId: string,
  categoryName: string,
  count: number = 3
): ScenarioPracticeQuestion[] {
  let list = FALLBACK_SCENARIO_QUESTIONS[domainId] || [];

  if (list.length === 0 || domainId === 'all' || domainId === 'custom') {
    // Combine all domain scenarios
    list = Object.values(FALLBACK_SCENARIO_QUESTIONS).flat();
  }

  // Shuffle and slice to count
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
