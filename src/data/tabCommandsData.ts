import { ExamTab } from '../types';

export interface TabCommandInfo {
  tabId: ExamTab;
  tabTitle: string;
  primaryCommand: string;
  commandLabel: string;
  commandDesc: string;
  secondaryCommand?: string;
  secondaryLabel?: string;
  cliTool: string;
}

export const TAB_COMMANDS_CONFIG: Record<ExamTab, TabCommandInfo> = {
  written: {
    tabId: 'written',
    tabTitle: 'Written Blueprint',
    primaryCommand: 'ceh --blueprint v13 --domains 1-9 --review-weights',
    commandLabel: 'Blueprint Matrix Query',
    commandDesc: 'Audit all 9 CEH domains with weighted distribution breakdown',
    secondaryCommand: 'dig axfr @ns1.target.com target.com',
    secondaryLabel: 'DNS Zone Transfer Check',
    cliTool: 'bash',
  },
  practical: {
    tabId: 'practical',
    tabTitle: 'Practical Exam (6h)',
    primaryCommand: 'nmap -sS -sV -sC -O -T4 --min-rate 1000 -p- -oN nmap_audit.txt 10.10.10.X',
    commandLabel: 'Full Stealth Audit Scan',
    commandDesc: 'Multi-vector aggressive port scan with version detection & default NSE scripts',
    secondaryCommand: 'find / -perm -u=s -type f 2>/dev/null',
    secondaryLabel: 'SUID PrivEsc Binary Hunt',
    cliTool: 'nmap',
  },
  darkweb: {
    tabId: 'darkweb',
    tabTitle: 'Dark Web Blueprint',
    primaryCommand: 'tor --socks-port 9050 --data-directory /tmp/tor & curl --socks5-h 127.0.0.1:9050 http://expyuzz5wqqfdgah56...onion',
    commandLabel: 'Tor Proxy Routing Test',
    commandDesc: 'Initialize SOCKS5 daemon and route HTTP request over the Tor network',
    secondaryCommand: 'socat TCP-LISTEN:9050,fork SOCKS4A:127.0.0.1:onion_host:80,socksport=9050',
    secondaryLabel: 'Socat Tor Relay Pivot',
    cliTool: 'tor',
  },
  tools: {
    tabId: 'tools',
    tabTitle: '65+ Tools Checklist',
    primaryCommand: 'hashcat -m 1000 -a 0 -o cracked.txt ntlm_hashes.txt /usr/share/wordlists/rockyou.txt',
    commandLabel: 'Hashcat NTLM Cracker',
    commandDesc: 'Dictionary attack against NTLM hashes using standard rockyou wordlist',
    secondaryCommand: 'sqlmap -u "http://target.com/item?id=1" --batch --dbs --dump',
    secondaryLabel: 'SQLMap Auto Exploit',
    cliTool: 'hashcat',
  },
  methodology: {
    tabId: 'methodology',
    tabTitle: 'Programmer Methodology',
    primaryCommand: 'checksec --file=./vuln_binary && gdb -q ./vuln_binary -ex "pattern create 200"',
    commandLabel: 'Binary Security Audit',
    commandDesc: 'Verify NX, Canary, PIE, RELRO and generate cyclic buffer pattern in GDB',
    secondaryCommand: 'ROPgadget --binary ./vuln_binary --only "pop|ret"',
    secondaryLabel: 'ROP Gadget Hunter',
    cliTool: 'gdb',
  },
  tests: {
    tabId: 'tests',
    tabTitle: 'Practice & 20-Challenge Sim',
    primaryCommand: 'python3 -m unittest discover -s tests -p "*_ctf_test.py"',
    commandLabel: 'Automated CTF Flag Verification',
    commandDesc: 'Execute automated regression test suite against practical challenge scenarios',
    secondaryCommand: 'nc -nvlp 4444',
    secondaryLabel: 'Catch Reverse Shell',
    cliTool: 'netcat',
  },
  installation: {
    tabId: 'installation',
    tabTitle: 'Installation & Setup',
    primaryCommand: 'sudo apt update && sudo apt install -y kali-tools-top10 wireshark openvpn gobuster',
    commandLabel: 'Core Pentest Suite Install',
    commandDesc: 'Install the standard top 10 pentesting packages on Debian/Kali Linux',
    secondaryCommand: 'docker run -d --name ceh-sandbox -p 8080:80 vulnhub/basic-pentest',
    secondaryLabel: 'Local Docker Lab Spawn',
    cliTool: 'apt',
  },
  flashcards: {
    tabId: 'flashcards',
    tabTitle: 'Flashcard Decks',
    primaryCommand: 'anki --profile "CEH v13 Master" --sync',
    commandLabel: 'Spaced Repetition Sync',
    commandDesc: 'Trigger spaced repetition deck synchronization across devices',
    secondaryCommand: 'head -n 20 /usr/share/seclists/Discovery/Web-Content/common.txt',
    secondaryLabel: 'Wordlist Quick Peek',
    cliTool: 'anki',
  },
  progress: {
    tabId: 'progress',
    tabTitle: 'Domain Progress & Heatmap',
    primaryCommand: 'cat ~/.ceh/progress_report.json | jq ".overallScore, .domainsSummary"',
    commandLabel: 'Export Progress JSON Metric',
    commandDesc: 'Query local CEH blueprint mastery and task completion statistics',
    secondaryCommand: 'python3 -m http.server 8000 --directory ./reports',
    secondaryLabel: 'Host Progress HTML',
    cliTool: 'jq',
  },
  bookmarks: {
    tabId: 'bookmarks',
    tabTitle: 'My Bookmarks',
    primaryCommand: 'grep -rn "STARRED" ~/.ceh/study_vault/ | sort -r',
    commandLabel: 'List Starred Study Notes',
    commandDesc: 'Quickly query high-yield study bookmarks from the local terminal vault',
    secondaryCommand: 'tar -czvf ceh_bookmarks_backup.tar.gz ~/.ceh/bookmarks/',
    secondaryLabel: 'Archive Bookmarks',
    cliTool: 'grep',
  },
};
