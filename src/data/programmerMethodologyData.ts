import { ProgrammingScriptSnippet, LivingCommandItem } from '../types';

export const DEFAULT_LIVING_COMMANDS: LivingCommandItem[] = [
  // Recon
  {
    id: 'cmd-1',
    domain: '#Recon',
    tool: 'nmap',
    command: 'nmap -sS -sV -O -p- -T4 --open <TARGET_IP> -oA ~/Desktop/Scans/full_scan',
    description: 'Comprehensive TCP scan: all ports, service versions, OS detection, open ports only, output saved.'
  },
  {
    id: 'cmd-2',
    domain: '#Recon',
    tool: 'nmap-udp',
    command: 'nmap -sU --top-ports 50 -T4 <TARGET_IP> -oN ~/Desktop/Scans/udp_scan.txt',
    description: 'Targeted UDP sweep on the top 50 critical UDP ports (DNS, SNMP, NTP, DHCP).'
  },
  {
    id: 'cmd-3',
    domain: '#Recon',
    tool: 'enum4linux',
    command: 'enum4linux -a <TARGET_IP> | tee ~/Desktop/Scans/enum_win.txt',
    description: 'Full Windows/Samba enumeration: users, groups, shares, password policy, RID cycling.'
  },
  {
    id: 'cmd-4',
    domain: '#Recon',
    tool: 'smbclient',
    command: 'smbclient -L //<TARGET_IP> -N',
    description: 'Anonymous / Null session SMB share listing to find readable shares.'
  },
  // WebApps
  {
    id: 'cmd-5',
    domain: '#WebApps',
    tool: 'sqlmap-dbs',
    command: 'sqlmap -u "http://<IP>/page.php?id=1" --dbs --batch',
    description: 'Automated SQLi scan to discover all databases with batch non-interactive mode.'
  },
  {
    id: 'cmd-6',
    domain: '#WebApps',
    tool: 'sqlmap-dump',
    command: 'sqlmap -u "http://<IP>/page.php?id=1" -D <DATABASE> -T <TABLE> --dump --batch',
    description: 'Dumps all rows, columns, and password hashes from specific database table.'
  },
  {
    id: 'cmd-7',
    domain: '#WebApps',
    tool: 'gobuster',
    command: 'gobuster dir -u http://<IP>/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html,bak',
    description: 'Directory and file discovery looking for exposed endpoints and backup files.'
  },
  {
    id: 'cmd-8',
    domain: '#WebApps',
    tool: 'wpscan',
    command: 'wpscan --url http://<IP>/blog --enumerate ap,at,u --plugins-detection aggressive',
    description: 'WordPress audit enumerating vulnerable plugins, themes, and usernames.'
  },
  // Cracking
  {
    id: 'cmd-9',
    domain: '#Cracking',
    tool: 'hydra-ssh',
    command: 'hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://<IP> -t 4 -vV',
    description: 'SSH dictionary brute-forcing with 4 threads to prevent connection drops.'
  },
  {
    id: 'cmd-10',
    domain: '#Cracking',
    tool: 'john-ntlm',
    command: 'john --wordlist=/usr/share/wordlists/rockyou.txt --format=NT hashes.txt',
    description: 'Crack Windows NTLM SAM hashes using John the Ripper and rockyou.txt.'
  },
  {
    id: 'cmd-11',
    domain: '#Cracking',
    tool: 'hashcat-md5',
    command: 'hashcat -m 0 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt --force',
    description: 'High-speed GPU/CPU cracking for raw MD5 hashes.'
  },
  // PrivEsc
  {
    id: 'cmd-12',
    domain: '#PrivEsc',
    tool: 'linux-suid',
    command: 'find / -perm -u=s -type f 2>/dev/null',
    description: 'Enumerate all SUID binaries on Linux system for GTFOBins escalation.'
  },
  {
    id: 'cmd-13',
    domain: '#PrivEsc',
    tool: 'meterpreter-getsystem',
    command: 'meterpreter > getsystem',
    description: 'Attempt automatic Windows privilege escalation to NT AUTHORITY\\SYSTEM.'
  },
  {
    id: 'cmd-14',
    domain: '#PrivEsc',
    tool: 'msf-suggester',
    command: 'use exploit/multi/recon/local_exploit_suggester; set SESSION 1; run',
    description: 'Analyzes target system configuration and suggests viable local root/SYSTEM exploits.'
  },
  // Stego
  {
    id: 'cmd-15',
    domain: '#Stego',
    tool: 'steghide',
    command: 'steghide extract -sf target.jpg -p ""',
    description: 'Extract hidden stego payload from JPEG image with blank or specified passphrase.'
  },
  {
    id: 'cmd-16',
    domain: '#Stego',
    tool: 'stegsnow',
    command: 'stegsnow -C -p "pass" message.txt decoded.txt',
    description: 'Decode whitespace steganography from ASCII text file.'
  },
  // TrafficAnalysis
  {
    id: 'cmd-17',
    domain: '#TrafficAnalysis',
    tool: 'tshark-post',
    command: 'tshark -r capture.pcap -Y "http.request.method == \\"POST\\"" -T fields -e http.file_data',
    description: 'Extract raw HTTP POST body payloads containing login usernames and passwords.'
  },
  {
    id: 'cmd-18',
    domain: '#TrafficAnalysis',
    tool: 'tshark-ftp',
    command: 'tshark -r capture.pcap -Y "ftp" -T fields -e ftp.request.command -e ftp.request.arg',
    description: 'Extract all plaintext FTP credentials (USER and PASS commands) from packet capture.'
  }
];

export const PROGRAMMER_AUTOMATION_SCRIPTS: ProgrammingScriptSnippet[] = [
  {
    language: 'Python',
    purpose: 'Nmap XML Parser & Automatic Target Command Generator',
    filename: 'parse_nmap_targets.py',
    runCommand: 'python3 parse_nmap_targets.py scan.xml',
    notes: 'Eliminates 30 minutes of manual log searching. Parses Nmap XML output, categorizes open ports, and automatically generates ready-to-run enum4linux, curl, and hydra commands.',
    code: `#!/usr/bin/env python3
"""
KayBiT CEH Exam Helper: Parse Nmap XML and generate tailored attack commands
Run: python3 parse_nmap_targets.py scan.xml
"""
import xml.etree.ElementTree as ET
import sys

def parse_nmap(xml_file):
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
    except Exception as e:
        print(f"[-] Error loading {xml_file}: {e}")
        return

    print("=" * 60)
    print("      KAYBIT CEH PRACTICAL TARGET PARSER")
    print("=" * 60)

    for host in root.findall('host'):
        status = host.find('status')
        if status is not None and status.get('state') != 'up':
            continue

        addr_elem = host.find('address')
        ip = addr_elem.get('addr') if addr_elem is not None else 'Unknown'
        print(f"\\n[*] Target Host: {ip}")

        open_ports = []
        for port in host.findall('.//port'):
            state = port.find('state')
            if state is not None and state.get('state') == 'open':
                port_id = port.get('portid')
                service = port.find('service')
                svc_name = service.get('name') if service is not None else 'unknown'
                open_ports.append((port_id, svc_name))
                print(f"    [+] Open Port: {port_id:<5} ({svc_name})")

        # Command suggestions for exam challenges:
        for port_id, svc in open_ports:
            if port_id in ['139', '445'] or 'smb' in svc or 'netbios' in svc:
                print(f"    -> SMB Detected: enum4linux -a {ip} | tee enum_{ip}.txt")
                print(f"    -> Smbclient:    smbclient -L //{ip} -N")
            elif port_id in ['80', '8080', '8000', '8443'] or 'http' in svc:
                print(f"    -> Web Detected: gobuster dir -u http://{ip}:{port_id}/ -w /usr/share/wordlists/dirb/common.txt")
                print(f"    -> SQLi Probe:   sqlmap -u \\"http://{ip}:{port_id}/index.php?id=1\\" --batch --dbs")
            elif port_id == '21' or 'ftp' in svc:
                print(f"    -> FTP Brute:    hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://{ip} -t 4")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 parse_nmap_targets.py <nmap_output.xml>")
        sys.exit(1)
    parse_nmap(sys.argv[1])`
  },
  {
    language: 'Bash / Shell',
    purpose: 'Rapid Exam Subnet Triage & Output Directory Scaffolder',
    filename: 'ceh_exam_kickstart.sh',
    runCommand: 'chmod +x ceh_exam_kickstart.sh && ./ceh_exam_kickstart.sh 192.168.1.0/24',
    notes: 'Sets up a desktop folder structure, launches a background nmap sweep, and isolates web and SMB targets into organized subfolders.',
    code: `#!/usr/bin/env bash
# KayBiT CEH Exam Kickstart: Automated Folder & Recon Scaffolder
# Usage: ./ceh_exam_kickstart.sh 192.168.1.0/24

TARGET_NET="\${1:-192.168.1.0/24}"
EXAM_DIR="$HOME/Desktop/CEH_PRACTICAL_EXAM"

echo "[*] Initializing CEH Practical workspace in $EXAM_DIR"
mkdir -p "$EXAM_DIR"/{Scans,Credentials,Extracted_Stego,PCAP_Analysis,Notes}
cd "$EXAM_DIR" || exit 1

echo "[*] Step 1: Performing fast ping sweep on $TARGET_NET..."
nmap -sn "$TARGET_NET" -oG - | awk '/Up$/{print $2}' > Scans/live_hosts.txt
LIVE_COUNT=$(wc -l < Scans/live_hosts.txt)
echo "[+] Discovered $LIVE_COUNT live target machines."

echo "[*] Step 2: Running deep service and OS scans on live targets in background..."
while read -r IP; do
    echo "    -> Spawning scan for $IP..."
    nmap -sV -sC -O -T4 "$IP" -oA "Scans/scan_$IP" &
done < Scans/live_hosts.txt

echo "[+] All scans spawned in background. Check $EXAM_DIR/Scans/ for outputs."
echo "[*] Golden Rule: Keep checking files as they complete to start answering early questions!"`
  },
  {
    language: 'Go (Golang)',
    purpose: 'Concurrent HTTP Endpoint & Status Code Auditor',
    filename: 'ceh_web_probe.go',
    runCommand: 'go run ceh_web_probe.go 10.10.12.50',
    notes: 'Compiled, blisteringly fast concurrent Go tool to audit multi-port web services across discovered exam IPs.',
    code: `package main

import (
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"
)

func probe(url string, wg *sync.WaitGroup, client *http.Client) {
	defer wg.Done()
	resp, err := client.Get(url)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	server := resp.Header.Get("Server")
	if server == "" {
		server = "Unknown"
	}
	fmt.Printf("[+] FOUND: %-32s Status: %d | Server: %s\\n", url, resp.StatusCode, server)
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run ceh_web_probe.go <TARGET_IP>")
		return
	}
	target := os.Args[1]
	ports := []string{"80", "443", "8000", "8080", "8081", "8443", "8888", "9000", "9090"}

	client := &http.Client{Timeout: 3 * time.Second}
	var wg sync.WaitGroup

	fmt.Printf("[*] Probing common web ports on %s concurrently...\\n", target)
	for _, port := range ports {
		wg.Add(1)
		url := fmt.Sprintf("http://%s:%s/", target, port)
		go probe(url, &wg, client)
	}
	wg.Wait()
	fmt.Println("[*] Web probe completed.")
}`
  },
  {
    language: 'PowerShell',
    purpose: 'Windows Environment Audit & Local Token Inspector',
    filename: 'CEH_Windows_Audit.ps1',
    runCommand: 'powershell -ExecutionPolicy Bypass -File .\\CEH_Windows_Audit.ps1',
    notes: 'Executed inside the exam Windows target/attacker box to inspect local administrators, open shares, and network connections.',
    code: `# KayBiT CEH Windows Target Audit Script
# Run from PowerShell on Windows Host

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "     CEH EXAM WINDOWS TARGET AUDITOR     " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "[*] Host Information:" -ForegroundColor Yellow
[System.Net.Dns]::GetHostByName($env:computerName)

Write-Host "\`n[*] Local Administrators Group:" -ForegroundColor Yellow
Get-LocalGroupMember -Group "Administrators" | Select-Object Name, PrincipalSource

Write-Host "\`n[*] Active Network Shares:" -ForegroundColor Yellow
Get-SmbShare | Where-Object { $_.Name -notlike "*$" } | Select-Object Name, Path, Description

Write-Host "\`n[*] Listening Ports & Established Connections:" -ForegroundColor Yellow
Get-NetTCPConnection | Where-Object { $_.State -eq 'Listen' -and $_.LocalPort -in @(80, 445, 3389, 8080) } | 
    Select-Object LocalAddress, LocalPort, OwningProcess

Write-Host "\`n[*] Checking for unquoted service paths..." -ForegroundColor Yellow
Get-WmiObject -Class Win32_Service | 
    Where-Object { $_.PathName -notlike '"*' -and $_.PathName -like '* *' } | 
    Select-Object Name, PathName, StartMode`
  },
  {
    language: 'Rust',
    purpose: 'High-Speed Subnet Ping Sweeper & Output Formatter',
    filename: 'ceh_pinger.rs',
    runCommand: 'rustc -O ceh_pinger.rs && ./ceh_pinger 10.10.12.50',
    notes: 'Fast, safe, zero-dependency TCP connect scanner for high-speed port verification.',
    code: `// KayBiT CEH Rust TCP Fast Connect Sweeper
// Compile: rustc -O ceh_pinger.rs
use std::net::{SocketAddr, TcpStream};
use std::time::Duration;
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        println!("Usage: ./ceh_pinger <IP>");
        return;
    }
    let ip = &args[1];
    let ports = [21, 22, 23, 25, 53, 80, 110, 135, 139, 443, 445, 1433, 3306, 3389, 8080];

    println!("[*] Fast scanning target: {}", ip);
    for port in ports {
        let addr_str = format!("{}:{}", ip, port);
        if let Ok(addr) = addr_str.parse::<SocketAddr>() {
            let timeout = Duration::from_millis(400);
            if TcpStream::connect_timeout(&addr, timeout).is_ok() {
                println!("[+] OPEN PORT: {:<5} on {}", port, ip);
            }
        }
    }
    println!("[*] Scan complete.");
}`
  },
  {
    language: 'JavaScript / Node.js',
    purpose: 'PCAP Plaintext Credential Sniffer & Stream Extractor',
    filename: 'parse_pcap_json.js',
    runCommand: 'node parse_pcap_json.js capture.json',
    notes: 'Parses tshark JSON export to isolate form logins, HTTP Basic headers, and FTP credentials in seconds.',
    code: `// KayBiT CEH: Parse tshark JSON exports for credentials
// Generate input with: tshark -r capture.pcap -T json > capture.json
// Run: node parse_pcap_json.js capture.json

const fs = require('fs');

const filename = process.argv[2];
if (!filename) {
  console.log("Usage: node parse_pcap_json.js <capture.json>");
  process.exit(1);
}

const rawData = fs.readFileSync(filename, 'utf-8');
const packets = JSON.parse(rawData);

console.log(\`[*] Loaded \${packets.length} packets. Searching for credentials...\`);

packets.forEach((pkt, index) => {
  const layers = pkt._source?.layers;
  if (!layers) return;

  // Check HTTP POST data
  if (layers['http.file_data']) {
    console.log(\`[+] Packet #\${index} HTTP Data: \${layers['http.file_data']}\`);
  }

  // Check HTTP Authorization Header
  if (layers['http.authorization']) {
    console.log(\`[+] Packet #\${index} Auth Header: \${layers['http.authorization']}\`);
  }

  // Check FTP Command
  if (layers['ftp.request.command']) {
    console.log(\`[+] FTP Cmd: \${layers['ftp.request.command']} Arg: \${layers['ftp.request.arg'] || ''}\`);
  }
});`
  }
];

export interface OutputAnalysisScenario {
  id: string;
  title: string;
  tool: string;
  terminalOutput: string;
  question: string;
  options: string[];
  correctIndex: number;
  verdict: 'True Positive' | 'Timeout / Rate Limited' | 'False Positive' | 'Firewall Blocked';
  explanation: string;
  proAction: string;
  proCommand?: string;
}

export const OUTPUT_ANALYSIS_SCENARIOS: OutputAnalysisScenario[] = [
  {
    id: 'out-1',
    title: 'SQLMap Response Interpretation',
    tool: 'sqlmap',
    terminalOutput: `[*] testing 'AND boolean-based blind - WHERE or HAVING clause'
[*] testing 'MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause'
[WARNING] heuristic (basic) test shows that GET parameter 'id' might not be injectable
[INFO] GET parameter 'id' is vulnerable. Do you want to keep testing the others (if any)? [y/N] N
sqlmap identified the following injection points with a total of 45 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=1 AND 7129=7129
---
[INFO] the back-end DBMS is MySQL
back-end DBMS: MySQL >= 5.0.12`,
    question: 'What does this terminal output tell you about parameter `id`?',
    options: [
      'The server returned a 404 error and closed the connection.',
      'The parameter is verified as vulnerable to Boolean-based blind SQL injection running on MySQL.',
      'The heuristic test failed, meaning the server is completely secure.',
      'The Web Application Firewall blocked the request with a captcha.'
    ],
    correctIndex: 1,
    verdict: 'True Positive',
    explanation: 'Although the initial generic heuristic test gave a warning, SQLMap verified the vulnerability through a reproducible Boolean-based blind injection payload (id=1 AND 7129=7129) and successfully identified MySQL >= 5.0.12.',
    proAction: 'Immediately proceed to database enumeration: add `--dbs --batch` to extract database names.',
    proCommand: 'sqlmap -u "http://10.10.12.20/index.php?id=1" --dbs --batch'
  },
  {
    id: 'out-2',
    title: 'Hydra SSH Response Interpretation',
    tool: 'hydra',
    terminalOutput: `[DATA] max 16 tasks per target, 16 targets, 256 tasks, 14344399 login tries
[VERBOSE] Resolving addresses ... [VERBOSE] OK.
[ATTEMPT] target 10.10.12.20 - login "admin" - pass "123456" - 1 of 100
[ATTEMPT] target 10.10.12.20 - login "admin" - pass "password" - 2 of 100
[ERROR] Child with pid 28412 was killed by signal 15
[ERROR] ssh target dropped connection (read error: Connection reset by peer)
[ERROR] target 10.10.12.20:22 is not connecting anymore, child exiting ...`,
    question: 'Why did Hydra fail to complete the dictionary attack?',
    options: [
      'The wordlist rockyou.txt was corrupted.',
      'The user provided an invalid SSH port.',
      'The attack overwhelmed the target SSH daemon, triggering rate-limiting or connection reset (DoS).',
      'The target password was cracked and saved to disk.'
    ],
    correctIndex: 2,
    verdict: 'Timeout / Rate Limited',
    explanation: 'Running 16 or 32 tasks concurrently against weak virtual machine targets in exam environments frequently causes OpenSSH or Dropbear to reset connections or drop requests.',
    proAction: 'Reduce the thread count to 4 or 2 using `-t 4` or `-t 2`, and add `-W 1` to pause between connection attempts.',
    proCommand: 'hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://10.10.12.20 -t 4 -W 1'
  },
  {
    id: 'out-3',
    title: 'Nmap Filtered State Interpretation',
    tool: 'nmap',
    terminalOutput: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-10 14:22 UTC
Nmap scan report for 10.10.12.90
Host is up (0.0012s latency).
PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   filtered http
443/tcp  filtered https
3389/tcp filtered ms-wbt-server
Nmap done: 1 IP address (1 host up) scanned in 12.44 seconds`,
    question: 'What does the "filtered" state on ports 80, 443, and 3389 signify?',
    options: [
      'The services are running properly without authentication.',
      'A packet filter, firewall, or router ACL is dropping probes before they reach the target port.',
      'The ports are definitely closed and sent RST packets back.',
      'The operating system is Linux kernel 2.6.'
    ],
    correctIndex: 1,
    verdict: 'Firewall Blocked',
    explanation: 'In Nmap, "filtered" means no response was received (packet dropped) or an ICMP unreachable error was returned, proving a stateful firewall or ACL blocked the probe.',
    proAction: 'Try TCP ACK scan (`-sA`) to map firewall rules, or scan from another interface / check for alternative open ports like SSH.',
    proCommand: 'nmap -sA -p 80,443,3389 10.10.12.90'
  }
];
