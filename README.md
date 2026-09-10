# KayBiT_CEHexam

**All-in-One Cross-Platform Learning & Preparation Platform for the EC-Council Certified Ethical Hacker (CEH) Written and Practical Exams.**

Specifically crafted for intermediate programming students across Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart/Flutter, Bash/Shell, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, and COBOL/Assembly.

---

## Key Modules

### 1. CEH Written Exam Preparation
- **Hands-on Labs & Environments**:
  - Cisco Networking Academy Ethical Hacking virtual labs (network packet flows, routing switches, ACLs, ARP poisoning).
  - Local Virtualization Lab: 101 Labs & Vulnerable Apps (VirtualBox/VMware sandbox with Kali Linux attacking DVWA and OWASP Juice Shop to witness code-level input sanitization failures).
  - TryHackMe Free Tier interactive browser terminal rooms.
- **Curated Text Notes & GitHub Repositories**:
  - Mr-Infect / ceh-v13-notes (organized domain breakdown, protocol ports, cryptography formulas).
  - phirojshah / CEH (syntax cheat sheets for Nmap, enum4linux, sqlmap).
  - SNGWN / CEH-Notes (rapid domain to CLI tool matrices).
- **Video Courses & Player Applet**:
  - Embedded YouTube video player applet featuring Ethical Hacking Full Course 2026 and Edureka Ethical Hacking Course with interactive timestamps and notes.

### 2. CEH Practical Exam Preparation (Target: 14/20 to Pass)
- **The "Big Three" Open-Source Cheat Sheets**:
  - Samsar4 / Ethical-Hacking-Labs (direct syntax for brute-forcing, network sweeping, crypto cracking).
  - phirojshah / CEH (the golden rule: always pipe network scans to desktop files first!).
  - sariamubeen / CEH-Practical-Exam (challenge walkthroughs and flag methodologies).
- **The Four Practical Pillars**:
  1. Advanced Scanning & Enumeration (Nmap flags `-O`, `-sV`, `-sC`, enum4linux, null sessions).
  2. Web App Exploitation (SQL injection with sqlmap, LFI, hash extraction).
  3. System Hacking & Privilege Escalation (Metasploit, searchsploit, msfvenom, getsystem).
  4. Defensive Concepts (Steganography with OpenStego/StegHide/QuickStego, Wireshark `.pcap` analysis).
- **Interactive 20-Challenge Practical Simulator**:
  - 6-hour simulated exam timer, target scenarios, live flag checking, and 14/20 passing threshold indicator.

### 3. Programmer Study Methodology
- **The "Living" Command Sheet**: Interactive editor with default CEH domain commands, custom entry builder, and instant Markdown export.
- **Multi-Language Automation Scripts**: Python, Bash, Go, Rust, PowerShell, Node.js scripts to parse Nmap XML, brute force URLs, and avoid rabbit holes.
- **"Focus on the Why" Output Analyzer**: Interactive terminal log inspector to identify True Positives, Timeouts/Rate-limits, and Firewall Blocks.

### 4. EC-Council Exam Environment Tools Checklist
- Curated checklist of all GUI and CLI tools present in the exam environment.
- Category filters, Kali `apt-get` command generator, and exam pro-tips.

### 5. Multilingual User Guide Modal (18 Languages)
- French, German, Italian, Spanish, Portuguese, Indonesian, Swahili, Turkish, Russian, Chinese, Japanese, Arabic, Urdu, Hindi, Marathi, Bangla/Bengali, Tamil, and Telugu, plus English.
- Instant modal accessible directly from the splash header.

### 6. Native Packaging Implementation Guide (`INSTALLATION.md`)
- Complete instructions for wrapping into Android APK/AAB (Capacitor), Windows `.exe` / macOS `.dmg` (Tauri), and PWA.
- GitHub Actions CI/CD workflow for automated binary builds.

---

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion

---

## Quickstart

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```

## Documentation Files
- `USER_GUIDE.md`: Full user guide and exam preparation manual.
- `INSTALLATION.md`: Complete cross-platform native packaging and distribution guide.
