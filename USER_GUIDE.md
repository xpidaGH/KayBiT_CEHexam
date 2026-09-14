# KayBiT_CEHexam - Official Student & Instructor User Guide

Welcome to **KayBiT_CEHexam**, the all-in-one cross-platform learning and preparation hub tailored for intermediate programming students across 20+ programming languages (Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart/Flutter, Bash/Shell, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, COBOL/Assembly).

This comprehensive application is engineered to guide you through both:
1. **The Certified Ethical Hacker (CEH) Written Exam** (Theoretical foundations, 125 questions across 9 security domains).
2. **The Certified Ethical Hacker (CEH) Practical Exam** (6-hour rigorous hands-on live target laboratory, 20 challenges, passing threshold: 14/20).

---

## Table of Contents
1. [Core Architecture & Overview](#1-core-architecture--overview)
2. [Component 1: CEH Written Exam Track](#2-component-1-ceh-written-exam-track)
   - [Hands-on Labs & Virtual Sandboxes](#hands-on-labs--virtual-sandboxes)
   - [Text Notes & Community Repositories](#text-notes--community-repositories)
   - [Video Courses & Responsive Player Applet](#video-courses--responsive-player-applet)
3. [Component 2: CEH Practical Exam Track](#3-component-2-ceh-practical-exam-track)
   - [The "Big Three" Cheat Sheets & Repositories](#the-big-three-cheat-sheets--repositories)
   - [The Four Practical Pillars](#the-four-practical-pillars)
   - [The Golden Rule: Scan Once, Pipe Output to Disk](#the-golden-rule-scan-once-pipe-output-to-disk)
4. [Component 3: Spaced-Repetition Flashcards & Gemini AI Scenario Lab](#4-component-3-spaced-repetition-flashcards--gemini-ai-scenario-lab)
   - [Blueprint Domain Flashcard Decks](#blueprint-domain-flashcard-decks)
   - [Imagen Mnemonic Visual Anchors](#imagen-mnemonic-visual-anchors)
   - [Gemini AI Scenario Practice Generator](#gemini-ai-scenario-practice-generator)
   - [Converting Scenarios to Custom Flashcards](#converting-scenarios-to-custom-flashcards)
5. [Component 4: In-Browser Kali Linux CLI Simulation & Audio Cues](#5-component-4-in-browser-kali-linux-cli-simulation--audio-cues)
   - [Interactive Terminal Simulator](#interactive-terminal-simulator)
   - [Supported Security Commands & Output Parsers](#supported-security-commands--output-parsers)
   - [Synthetic Audio Cues (Mastery Chimes & Timer Alerts)](#synthetic-audio-cues)
6. [Component 5: Visual Performance Analytics & Historical Tracking](#6-component-5-visual-performance-analytics--historical-tracking)
   - [Recharts Historical Score Timeline](#recharts-historical-score-timeline)
   - [Domain Readiness & 70% Pass Threshold Monitoring](#domain-readiness--70-pass-threshold-monitoring)
7. [Component 6: Dark Web & Onion Routing Blueprint](#7-component-6-dark-web--onion-routing-blueprint)
   - [Surface vs Deep vs Dark Web Architecture](#surface-vs-deep-vs-dark-web-architecture)
   - [7-Step Onion Circuit Cryptographic Visualizer](#7-step-onion-circuit-cryptographic-visualizer)
8. [Recommended Study Methodology for Programmers](#8-recommended-study-methodology-for-programmers)
   - [The "Living" Command Sheet Builder](#the-living-command-sheet-builder)
   - [Simulate the Pacing & Language Automation Wrappers](#simulate-the-pacing--language-automation-wrappers)
   - [Focus on the "Why" (Terminal Output Analyzer)](#focus-on-the-why-terminal-output-analyzer)
9. [Curated EC-Council Exam Environment Tools Checklist](#9-curated-ec-council-exam-environment-tools-checklist)
10. [Interactive Practice Tests & 20-Question Lab Simulator](#10-interactive-practice-tests--20-question-lab-simulator)
11. [Internationalization & Text-to-Speech (20 Languages)](#11-internationalization--text-to-speech-20-languages)
12. [Global Focus Mode, Granular Audio Controls & My Bookmarks](#12-global-focus-mode-granular-audio-controls--my-bookmarks)
13. [Cross-Platform Native Installation (Android, iOS, Windows, macOS, PWA)](#13-cross-platform-native-installation)

---

## 1. Core Architecture & Overview

KayBiT_CEHexam bridges the gap between software development and offensive security. As programmers, you already understand memory layout, control structures, network sockets, and database queries. This application leverages your programming intuition to expose how software flaws—such as unescaped input, missing bounds checks, and default configurations—translate into weaponized exploits.

The UI consists of 8 primary interactive viewports:
- **Written Exam Track**: Labs (Cisco, Local Sandbox, TryHackMe), Markdown Notes, and Embedded Video Masterclasses.
- **Practical Exam Track**: Big Three cheat sheets, the 4 Pillars, workflows, and terminal outputs.
- **Flashcards & AI Lab**: 9 domain decks, spaced-repetition mastery, Imagen visual mnemonic anchors, and the **Gemini AI Scenario Generator**.
- **Tools & CLI Terminal**: Interactive checklist of pre-installed exam tools paired with a real in-browser Kali Linux CLI simulator.
- **Dark Web Blueprint**: Tor onion routing mechanics, multi-hop circuit visualizer, and defensive intelligence concepts.
- **Programmer Methodology**: Living command sheet generator, scripts in your favorite programming language, and raw terminal output interpreter.
- **Practice Tests**: 20-Challenge CEH Practical timed simulator, Written Exam domain quizzes, and **Recharts historical performance analytics**.
- **Native Downloads & Installation**: Complete guide for running the app on Android, iOS, Windows, and macOS.

---

## 2. Component 1: CEH Written Exam Track

### Hands-on Labs & Virtual Sandboxes
To pass the written exam with a deep conceptual grasp, theory must be validated in sandboxes:
1. **Cisco Networking Academy – Ethical Hacking Course**:
   - Guided virtual labs using Kali Linux.
   - Bridges network architecture (switches, routers, VLANs, ACLs) to active penetration testing.
   - Key topics: ARP poisoning (MITM), VLAN hopping, SNMP community string enumeration, and firewall packet inspection.
2. **Local Virtualization Lab - 101 Labs & Vulnerable Apps**:
   - Built on free hypervisors: **VirtualBox** or **VMware Workstation Player**.
   - Attacker VM: Official Kali Linux virtual appliance.
   - Target Apps: **DVWA** (Damn Vulnerable Web Application) and **OWASP Juice Shop** running in local Docker containers.
   - Teaches students how code-level input sanitization failures in PHP, Node.js, and SQL turn into remote code execution.
3. **TryHackMe - Free Tier**:
   - Browser-based disposable target instances without requiring local hypervisor overhead.
   - Recommended free rooms: Nmap, Wireshark 101, Burp Suite Basics, and Linux PrivEsc.

### Text Notes & Community Repositories
- **Mr-Infect / ceh-v13-notes**: Highly structured markdown covering all official domains, protocol numbers, encryption cipher modes, and cyber kill chains.
- **phirojshah / CEH**: Syntax cheat sheets mapped to the exam requirements, featuring nmap flags, enum4linux syntax, and sqlmap automation.
- **SNGWN / CEH-Notes**: Rapid domain-to-CLI tool mapping matrix, ideal for last-minute review.

### Video Courses & Responsive Player Applet
Long-form video walkthroughs are essential to visualize live packet exchanges and interactive command shells:
- **Ethical Hacking Full Course 2026**: 12+ hour masterclass spanning recon, scanning, web exploits, and Metasploit.
- **Edureka Ethical Hacking Course for Beginners**: 10-hour breakdown specifically tailored to EC-Council domains.
- The built-in player applet provides direct timestamps, domain chapters, and notes capture.

---

## 3. Component 2: CEH Practical Exam Track

### The "Big Three" Cheat Sheets & Repositories
In the CEH Practical exam, you are permitted to consult your own notes, official manuals, and public documentation. You need concise, copy-paste syntax:
1. **Samsar4 / Ethical-Hacking-Labs**:
   - Direct command lines for credential brute forcing, rapid network sweeping, and offline hash cracking.
2. **phirojshah / CEH**:
   - The foundational rule: **Always run full network scans first, pipe output to text files on the desktop (`-oA ~/Desktop/Scans/...`), and reference files later.**
3. **sariamubeen / CEH-Practical-Exam**:
   - Step-by-step challenge methodologies, flag patterns, and time allocation.

### The Four Practical Pillars
1. **Pillar 1: Advanced Scanning & Enumeration** (~30% of exam)
   - Nmap OS detection (`-O`), service versioning (`-sV`), script scanning (`-sC`).
   - Windows Null Session exploitation with `enum4linux -a` and `rpcclient -U "" -N`.
2. **Pillar 2: Web App Exploitation (SQLi & Path Traversal)** (~25% of exam)
   - Automated database dumping with `sqlmap --batch --dbs`.
   - Local File Inclusion (LFI) via path traversal (`../../../../etc/passwd`).
   - Offline hash cracking with John the Ripper and Hashcat.
3. **Pillar 3: System Hacking & Privilege Escalation** (~25% of exam)
   - `searchsploit` for offline Exploit-DB lookups.
   - Metasploit (`msfconsole`) module configuration and `msfvenom` staged reverse TCP payloads.
   - Elevation to `NT AUTHORITY\SYSTEM` using `getsystem` or SUID binary abuse (`GTFOBins`).
4. **Pillar 4: Defensive Concepts – Steganography & Traffic Analysis** (~20% of exam)
   - Steganography payload recovery with StegHide (`steghide extract -sf ... -p ""`), OpenStego, QuickStego, and SNOW (`stegsnow`).
   - Wireshark / Tshark `.pcap` analysis: filtering for cleartext HTTP POST passwords, FTP/Telnet credentials, and DNS exfiltration strings.

---

## 4. Component 3: Spaced-Repetition Flashcards & Gemini AI Scenario Lab

### Blueprint Domain Flashcard Decks
The **Flashcards** view organizes high-yield testable questions across all 9 CEH v13 domains:
- Filter by category or mastery status (*Needs Review* vs *Mastered*).
- Shuffle cards randomly to prevent positional memory bias.
- Real-time keyboard shortcuts (`Space` to flip, `ArrowRight`/`ArrowLeft` to navigate, `M` to mark mastered, `H` for hints, `A` for audio readout).
- Offline-first local storage persistence for custom user-created cards.

### Imagen Mnemonic Visual Anchors
Key cards feature generative **visual mnemonic anchors**—associative, surreal artwork engineered to lock abstract cybersecurity concepts into photographic memory (e.g., DNS Zone Transfers, Metasploit Meterpreter stages, StegHide pixel steganography).

### Gemini AI Scenario Practice Generator
Click **"AI Scenario Questions"** in the flashcard deck toolbar to generate real-world scenario challenges:
- **Server-Side Integration**: Calls `/api/generate-scenario-questions` powered by Google's `gemini-3.8-flash` model.
- **Contextual Deck Topic Targeting**: Automatically reads the currently selected domain deck (e.g., *Reconnaissance & Footprinting*, *Web Application Hacking*, *System Hacking*, etc.) and synthesizes plausible multi-stage intrusion and audit scenarios.
- **Customizable Depth**: Choose between *Standard CEH* exam difficulty and *Advanced Red Team* depth; enter custom target keywords or select quick topic suggestions.
- **Pedagogical Structure**: Each generated question includes:
  1. A rich multi-sentence engagement scenario.
  2. Four plausible technical answer choices.
  3. Clear identification of the correct option with comprehensive root-cause analysis.
  4. Core CEH exam "Key Takeaway" rule of thumb.
  5. MITRE ATT&CK technique mapping.
- **Offline Fallback Guarantee**: If no Gemini API key is configured or network drops occur, the system automatically falls back to an extensive curated offline scenario bank.

### Converting Scenarios to Custom Flashcards
Students can test their knowledge directly inside the scenario laboratory and click **"Save to Flashcard Deck"** to permanently add the scenario and its remediation explanation to their personal flashcard collection.

---

## 5. Component 4: In-Browser Kali Linux CLI Simulation & Audio Cues

### Interactive Terminal Simulator
Located directly inside the **Tools** tab, the interactive Kali Linux terminal simulation allows students to practice typing and executing security commands without setting up a virtual machine:
- **Terminal Shell Features**: Authentic Kali prompt (`root@kaybit-ceh:~#`), command history navigation (`ArrowUp` / `ArrowDown`), clear command (`clear` or `Ctrl+L`), and tabbed multi-session support.
- **Visual Terminal Themes**: Toggle between *Cyber Matrix Green*, *Classic Dark*, *Kali Navy*, and *Monochrome Amber*.

### Supported Security Commands & Output Parsers
The terminal includes high-fidelity simulated outputs for standard CEH commands:
- **Network Scanning**: `nmap -sS -sV -O -p- 10.10.10.5`, `nmap -sn 192.168.1.0/24`, `nmap --script vuln 10.10.10.5`
- **Web App Assessment**: `sqlmap -u "http://target/vuln.php?id=1" --dbs`, `gobuster dir -u http://target.local -w wordlist.txt`, `nikto -h http://target.local`
- **SMB & Windows Enumeration**: `enum4linux -a 192.168.1.25`, `smbclient -L //192.168.1.25 -N`
- **Password Cracking & Brute Force**: `hydra -l admin -P rockyou.txt 192.168.1.50 ssh`, `john --wordlist=rockyou.txt hashes.txt`, `hashcat -m 0 -a 0 hashes.txt rockyou.txt`
- **Steganography & Forensics**: `steghide extract -sf secret.jpg -p "password"`, `exiftool suspicious.png`
- **Wireless & Traffic**: `aircrack-ng -w wordlist.txt capture.cap`, `tshark -r capture.pcap -Y "http.request.method==POST"`
- **System Utilities**: `whois`, `dig`, `traceroute`, `uname -a`, `id`, `cat /etc/passwd`, `grep`, `pwd`, `help`
- **Direct Checklist Integration**: Every item in the exam tools checklist has a **"Test in CLI"** action that pre-loads the optimal exam command into the simulator.

### Synthetic Audio Cues
Enhance study engagement with toggleable auditory feedback powered by the browser's Web Audio API:
- **Mastery Chime**: Crisp synthesized chord played when flipping a card to "Mastered".
- **Deck Fanfare**: Multi-tone celebratory fanfare triggered when completing 100% of a domain deck.
- **Timer Alert**: Distinct double-beep when a timed practice session or Pomodoro block expires.
- **Global Audio Switch**: Easily muted or unmuted at any time using the Audio Cues toggle in the top toolbar.

---

## 6. Component 5: Visual Performance Analytics & Historical Tracking

### Recharts Historical Score Timeline
The **Practice Tests** view features an interactive data visualization suite built with Recharts:
- **Historical Score Trend**: Area and line chart tracking your score percentages across sequential practice sessions.
- **Score Velocity & Milestones**: Visual representation of attempts plotted against the 70% passing threshold (14/20 questions).
- **Persistent Test History**: Retains past practice test attempts, durations, and domain breakdowns in local storage.

### Domain Readiness & 70% Pass Threshold Monitoring
- Automatic calculation of your current readiness score.
- Color-coded indicators identifying strong domains (≥80%) and weak domains (<70%) that require focused flashcard review and scenario drills.

---

## 7. Component 6: Dark Web & Onion Routing Blueprint

### Surface vs Deep vs Dark Web Architecture
A structured comparative breakdown explaining the technical and legal distinctions:
- **Surface Web (4%)**: Publicly indexable via standard search engines (HTTP/HTTPS).
- **Deep Web (90%)**: Password-protected databases, corporate intranets, academic portals, and medical records.
- **Dark Web (6%)**: Encrypted overlay networks accessible only via specialized software (Tor, I2P, Freenet).

### 7-Step Onion Circuit Cryptographic Visualizer
An interactive walkthrough demonstrating how a Tor client establishes a circuit:
1. Directory Server Query & Consensus Retrieval.
2. Guard Node Connection & Diffie-Hellman Key Exchange (Layer 1 AES encryption).
3. Middle Relay Extension (Layer 2 AES encryption).
4. Exit Node Handshake (Layer 3 AES encryption).
5. Telescoping Onion Construction: Packaging the plaintext request inside 3 concentric cryptographic layers.
6. Progressive Peeling: Each hop strips one layer; the middle node knows only the previous and next IP.
7. Plaintext Delivery & End-to-End TLS: Exit node forwards request to the target web server.

---

## 8. Recommended Study Methodology for Programmers

### The "Living" Command Sheet Builder
Create and curate a single Markdown file divided into domain sections:
- `#Recon`
- `#WebApps`
- `#Cracking`
- `#PrivEsc`
- `#Stego`
- `#TrafficAnalysis`
Use the in-app editor to add your personalized flags and click **"Export Markdown"** to take into your exam session.

### Simulate the Pacing & Automation Wrappers
The 6-hour timeline is generous for 20 questions (18 minutes per question), but candidates fail when they fall into rabbit holes trying to fix broken exploit scripts. 
Use our provided automation scripts:
- **Python**: Parse Nmap XML files and automatically spit out targeted attack commands for open ports.
- **Bash**: Scaffolding scripts that create directory trees and launch scans in the background.
- **Go / Rust**: High-speed multi-threaded HTTP probing and TCP ping sweeps.
- **PowerShell**: Internal Windows target auditing script.

### Focus on the "Why" (Terminal Output Analyzer)
The exam tests your ability to interpret raw output:
- Distinguish whether an Nmap `filtered` state is caused by a firewall drop or host offline.
- Recognize when Hydra fails due to SSH rate-limiting (signal 15 / connection reset) vs invalid credentials.
- Read SQLMap outputs to know when a boolean-based blind injection is confirmed.

---

## 9. Curated EC-Council Exam Environment Tools Checklist
Interactive checklist of tools pre-installed in the exam VM:
- **Scanning**: Nmap, Zenmap, Enum4linux, Rpcclient, Smbclient, Netcat, Gobuster, Dirb, WPScan.
- **Web**: Sqlmap, Burp Suite, OWASP ZAP.
- **System/Exploitation**: Metasploit Framework, Searchsploit, Msfvenom.
- **Password/Cracking**: John the Ripper, Hydra, Hashcat, Cain & Abel, Ophcrack.
- **Stego/Forensics**: StegHide, OpenStego, QuickStego, SNOW, FTK Imager.
- **Sniffing/MITM**: Wireshark, Tshark, Responder, Bettercap.

---

## 10. Interactive Practice Tests
- **CEH Practical 20-Challenge Simulation**:
  - Timed 6-hour challenge room.
  - Live flag validation with real-time scoring.
  - Passing status indicator: **Target ≥ 14 / 20 (70%)**.
  - Detailed solutions and command walk-throughs for every challenge.
- **CEH Written Domain Quizzes**:
  - Comprehensive question bank across all 9 official CEH domains.
  - Explanations that reveal the underlying protocol mechanics and vulnerable code logic.

---

## 11. Internationalization & Text-to-Speech (20 Languages)
International students can switch the User Guide and reference materials instantly across 20 languages:
English, French, German, Italian, Spanish, Portuguese, Indonesian, Swahili, Turkish, Russian, Chinese (Simplified), Japanese, Arabic, Urdu, Hindi, Marathi, Bangla/Bengali, Tamil, Telugu, and Wu Chinese (Shanghainese).

Features:
- Built-in **Text-to-Speech (TTS)** player with playback speed adjustment (0.75x to 1.5x) and voice selection.
- Full text search across headings, descriptions, and bullet points.
- One-click copy guide to clipboard.

---

## 12. Global Focus Mode, Granular Audio Controls & My Bookmarks

### Global Focus Mode
Long study sessions require deep immersion without distractions. Toggle **Focus Mode** by clicking the Focus Mode button in the navbar or pressing the `F` key anywhere in the application.
- **Distraction-Free Layout**: Automatically hides non-essential navigation bars, context header ribbons, breadcrumb search prompts, and full-bleed footers across all tabs.
- **Built-in Session Stopwatch**: An integrated counter in the slim focus header tracks active study duration with pause, resume, and reset capabilities.
- **Quick Tab Navigation**: A compact icon-based tab switcher in the focus bar allows jumping between domains and tracks without exiting focus.
- **Instant Exit**: Exit focus mode anytime by clicking **Exit Focus (Esc)** or pressing the `Esc` or `F` key.

### Granular Audio Controls
KayBiT_CEHexam features a procedural Web Audio synthesizer that delivers crisp, zero-latency feedback without external audio files. Access the new **Settings & Audio Controls** modal from the navbar gear icon:
- **Master Audio Toggle**: Instantly enable or silence all audio effects application-wide.
- **Successful Completion Cues**: Independently toggle audio feedback for flashcard question mastery, deck completion fanfares, and practical CTF flag captures.
- **Timer Alerts**: Independently toggle audio chimes for Pomodoro break intervals and timed 6-hour test countdown alarms.
- **Built-in Audio Preview**: Test each synthetic sound effect directly within the Settings dialog before starting your study session.

### My Bookmarks System
Bookmark high-yield topics, lab setups, cheat sheets, and terminal commands across the app for rapid pre-exam revision:
- **Direct Bookmarking**: Click the bookmark icon next to any Lab Environment, GitHub Text Note, Big Three Cheat Sheet, or Practical Exam Pillar.
- **Dedicated 'My Bookmarks' Tab**: Navigate directly using the tab menu or pressing `B` or `0`.
- **Category Filtering & Search**: Filter bookmarks by category (*All*, *Written Notes*, *Cheat Sheets*, *Commands*, *Labs*, *Practical Pillars*) or search content.
- **CLI Simulator Integration**: Run bookmarked terminal commands directly in the in-browser Kali Linux CLI simulator with a single click.
- **Export Options**: Export all saved bookmarks in structured Markdown or JSON format for offline notes or printing.

---

## 13. Cross-Platform Native Installation
To install KayBiT_CEHexam as a standalone native app on Android, iOS, Windows, macOS, or as a Progressive Web App (PWA), refer to the included **`INSTALLATION.md`** file.
