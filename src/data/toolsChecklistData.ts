import { ExamTool } from '../types';

export const EC_COUNCIL_EXAM_TOOLS: ExamTool[] = [
  {
    id: 'nmap',
    name: 'Nmap / Zenmap',
    category: 'Scanning & Recon',
    type: 'Both',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Network exploration, host discovery, OS detection, service version scanning, and NSE vulnerability scripting.',
    kaliInstallCmd: 'sudo apt update && sudo apt install -y nmap zenmap-kbx',
    quickSyntax: 'nmap -sV -sC -O -T4 <TARGET_IP> -oA output_scan',
    proTip: 'Always save results in all three formats (-oA). You will reference ports 3 hours later in the exam without needing to re-scan.'
  },
  {
    id: 'wireshark',
    name: 'Wireshark / Tshark',
    category: 'Sniffing & MITM',
    type: 'Both',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Interactive graphical and command-line packet capture analyzer for inspecting protocols, plaintext credentials, and malicious streams.',
    kaliInstallCmd: 'sudo apt install -y wireshark tshark',
    quickSyntax: 'tshark -r capture.pcap -Y "http.request.method == \\"POST\\"" -T fields -e http.file_data',
    proTip: 'Right click any packet -> Follow -> TCP Stream to read cleartext credentials from FTP, Telnet, or HTTP.'
  },
  {
    id: 'sqlmap',
    name: 'Sqlmap',
    category: 'Web App Hacking',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Automatic SQL injection detection and database takeover. Dumps tables, extracts password hashes, and reads files.',
    kaliInstallCmd: 'sudo apt install -y sqlmap',
    quickSyntax: 'sqlmap -u "http://target/page.php?id=1" --dbs --batch',
    proTip: 'Always use --batch to avoid getting stuck answering interactive confirmation prompts.'
  },
  {
    id: 'metasploit',
    name: 'Metasploit Framework (msfconsole & msfvenom)',
    category: 'System & PrivEsc',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Exploit execution engine, payload crafting (msfvenom), listener management (multi/handler), and post-exploitation Meterpreter sessions.',
    kaliInstallCmd: 'sudo apt install -y metasploit-framework',
    quickSyntax: 'msfconsole -q; use exploit/multi/handler; set payload windows/meterpreter/reverse_tcp',
    proTip: 'Inside a Meterpreter shell, run `getsystem` for instant Windows privilege elevation.'
  },
  {
    id: 'steghide',
    name: 'StegHide',
    category: 'Steganography & Forensics',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Hides and extracts data embedded within JPEG, BMP, WAV, and AU files using graph-theoretic algorithms.',
    kaliInstallCmd: 'sudo apt install -y steghide',
    quickSyntax: 'steghide extract -sf suspicious_image.jpg -p ""',
    proTip: 'If no password is provided in the exam prompt, always try extracting with an empty passphrase `""` first.'
  },
  {
    id: 'openstego',
    name: 'OpenStego',
    category: 'Steganography & Forensics',
    type: 'GUI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Java-based graphical steganography application used to hide and extract watermarks or files in BMP, PNG, and GIF images.',
    kaliInstallCmd: 'sudo apt install -y default-jre openstego',
    quickSyntax: 'openstego --gui (or launch from Application Menu -> Steganography)',
    proTip: 'OpenStego is frequently tested on the Windows desktop VM during the practical exam. Remember to match input and output paths.'
  },
  {
    id: 'quickstego',
    name: 'QuickStego',
    category: 'Steganography & Forensics',
    type: 'GUI',
    examPresence: 'Key Windows Utility',
    purpose: 'Classic Windows GUI tool to hide text inside image files without visibly altering the picture.',
    kaliInstallCmd: 'wine QuickStego.exe (Pre-installed on EC-Council Windows VM)',
    quickSyntax: 'Launch QuickStego -> Open Image -> Click "Get Text" or view secret text panel.',
    proTip: 'Available on the Windows target/attacker box in the exam lab. Click "Open Image" -> text appears directly in the bottom text box.'
  },
  {
    id: 'snow',
    name: 'SNOW Whitespace Stego',
    category: 'Steganography & Forensics',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Conceals messages in ASCII text by appending whitespace (spaces and tabs) to the ends of lines.',
    kaliInstallCmd: 'sudo apt install -y stegsnow',
    quickSyntax: 'stegsnow -C -p "passphrase" secret_doc.txt decoded_output.txt',
    proTip: 'Check text files for trailing spaces. If present, run `stegsnow -C -p "<key>" <file>`. Kali packages this as `stegsnow`.'
  },
  {
    id: 'enum4linux',
    name: 'Enum4linux',
    category: 'Scanning & Recon',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Enumerates data from Windows and Samba hosts: user lists, share names, password policy, group memberships, and OS details.',
    kaliInstallCmd: 'sudo apt install -y enum4linux',
    quickSyntax: 'enum4linux -a <TARGET_IP> | tee enum_results.txt',
    proTip: 'Pipe the output through `tee` so you can grep for usernames and RID values later without re-running.'
  },
  {
    id: 'john',
    name: 'John the Ripper',
    category: 'Cryptography & Cracking',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Fast password cracker supporting hundreds of hash and cipher types, wordlists, rules, and brute-force modes.',
    kaliInstallCmd: 'sudo apt install -y john',
    quickSyntax: 'john --wordlist=/usr/share/wordlists/rockyou.txt --format=NT hashes.txt',
    proTip: 'Identify the hash format first using `hashid` or `hash-identifier` before launching John with `--format=`.'
  },
  {
    id: 'hydra',
    name: 'THC-Hydra',
    category: 'Cryptography & Cracking',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'High-speed network login brute-forcer supporting FTP, SSH, Telnet, HTTP-POST-form, SMB, RDP, and MySQL.',
    kaliInstallCmd: 'sudo apt install -y hydra',
    quickSyntax: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://<IP> -t 4',
    proTip: 'Keep thread count to 4 (`-t 4`) to prevent overwhelming the target VM network stack during the exam.'
  },
  {
    id: 'hashcat',
    name: 'Hashcat',
    category: 'Cryptography & Cracking',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'The world\'s fastest password recovery utility utilizing CPU and GPU acceleration.',
    kaliInstallCmd: 'sudo apt install -y hashcat',
    quickSyntax: 'hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt',
    proTip: '-m 0 is MD5; -m 1000 is NTLM (Windows SAM hashes); -m 1800 is SHA-512 crypt (Linux shadow).'
  },
  {
    id: 'cryptool',
    name: 'CrypTool (CrypTool 1 / 2)',
    category: 'Cryptography & Cracking',
    type: 'GUI',
    examPresence: 'Key Windows Utility',
    purpose: 'Educational cryptography suite providing visual cryptographic algorithms, cryptanalysis of ciphers (Caesar, Vigenère, RSA, DES).',
    kaliInstallCmd: 'wine CrypTool.exe (Pre-installed on EC-Council Windows VM)',
    quickSyntax: 'Open CrypTool -> Cryptanalysis -> Symmetric/Asymmetric -> Automated Analysis.',
    proTip: 'Tested for classic cipher frequency analysis (e.g. solving substitution ciphers or checking entropy).'
  },
  {
    id: 'burpsuite',
    name: 'Burp Suite (Community / Professional)',
    category: 'Web App Hacking',
    type: 'GUI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Web vulnerability proxy, request repeater, intruder brute-force, and decoder.',
    kaliInstallCmd: 'sudo apt install -y burpsuite',
    quickSyntax: 'burpsuite & (Configure browser proxy to 127.0.0.1:8080)',
    proTip: 'Use Burp Decoder to quickly decode Base64, URL encoding, HTML entities, and compute MD5/SHA256 hashes.'
  },
  {
    id: 'wpscan',
    name: 'WPScan',
    category: 'Web App Hacking',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Black box WordPress vulnerability scanner for themes, plugins, timthumbs, and user enumeration.',
    kaliInstallCmd: 'sudo apt install -y wpscan',
    quickSyntax: 'wpscan --url http://<IP>/wordpress --enumerate u,p --plugins-detection aggressive',
    proTip: 'Often tests finding outdated plugins (like vulnerable file managers or contact forms).'
  },
  {
    id: 'gobuster',
    name: 'Gobuster / Dirb',
    category: 'Web App Hacking',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'High-speed directory, DNS subdomain, and virtual host brute-forcer written in Go.',
    kaliInstallCmd: 'sudo apt install -y gobuster dirb',
    quickSyntax: 'gobuster dir -u http://<IP>/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html',
    proTip: 'Always pass `-x php,txt,html,bak` to discover hidden configuration backups like `config.php.bak`.'
  },
  {
    id: 'responder',
    name: 'Responder',
    category: 'Sniffing & MITM',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'LLMNR, NBT-NS, and MDNS poisoner with built-in rogue authentication servers to capture NetNTLMv1/v2 password hashes.',
    kaliInstallCmd: 'sudo apt install -y responder',
    quickSyntax: 'sudo responder -I eth0 -dwv',
    proTip: 'When a Windows host searches for an unresolvable network share, Responder replies and captures the user hash.'
  },
  {
    id: 'cain-and-abel',
    name: 'Cain & Abel',
    category: 'Cryptography & Cracking',
    type: 'GUI',
    examPresence: 'Key Windows Utility',
    purpose: 'Legacy Windows password recovery and sniffing tool featuring ARP poisoning, dictionary cracking, and routing protocol auditing.',
    kaliInstallCmd: 'Pre-installed on EC-Council Windows exam desktop',
    quickSyntax: 'Launch Cain -> Sniffer tab -> Start/Stop Sniffer -> APR (Arp Poison Routing).',
    proTip: 'EC-Council practical labs on Windows specifically include Cain & Abel for cracking recorded hashes or demonstrating ARP tables.'
  },
  {
    id: 'veracrypt',
    name: 'VeraCrypt',
    category: 'Cryptography & Cracking',
    type: 'Both',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Disk encryption software based on TrueCrypt. Creates encrypted containers and mounts them as virtual disks.',
    kaliInstallCmd: 'sudo apt install -y veracrypt',
    quickSyntax: 'veracrypt --text --mount volume.hc /media/secure -p "password"',
    proTip: 'Exams sometimes ask to mount an encrypted container found on the desktop using a cracked password.'
  },
  {
    id: 'searchsploit',
    name: 'Searchsploit',
    category: 'System & PrivEsc',
    type: 'CLI',
    examPresence: 'Pre-installed in CEH VM',
    purpose: 'Offline command-line search tool for Exploit-DB allowing instant vulnerability searches without Internet access.',
    kaliInstallCmd: 'sudo apt install -y exploitdb',
    quickSyntax: 'searchsploit "Software Name 1.2" -w -m <EDB_ID>',
    proTip: 'Use `-m <EDB_ID>` to mirror the exploit script directly into your current working directory for editing.'
  }
];
