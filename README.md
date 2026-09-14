# KayBiT_CEHexam

**All-in-One Cross-Platform Learning & Preparation Platform for the EC-Council Certified Ethical Hacker (CEH) Written and Practical Exams.**

Specifically crafted for intermediate programming students across 20+ languages: Python, JavaScript, TypeScript, Java, C#, Kotlin, Dart/Flutter, Bash/Shell, Rust, Go, C++, C, PHP, Ruby, PowerShell, SQL, R, Scala, MATLAB, and COBOL/Assembly.

---

## Key Modules

### 1. CEH Written Exam Track
- **Hands-on Labs & Sandboxes**:
  - Cisco Networking Academy Ethical Hacking virtual labs (network packet flows, routing switches, ACLs, ARP poisoning).
  - Local Virtualization Lab: 101 Labs & Vulnerable Apps (VirtualBox/VMware sandbox with Kali Linux attacking DVWA and OWASP Juice Shop to witness code-level input sanitization failures).
  - TryHackMe Free Tier interactive browser terminal rooms.
- **Curated Text Notes & Repositories**:
  - Mr-Infect / `ceh-v13-notes` (domain breakdown, protocol ports, cryptography formulas).
  - phirojshah / `CEH` (syntax cheat sheets for Nmap, enum4linux, sqlmap).
  - SNGWN / `CEH-Notes` (rapid domain to CLI tool matrices).
- **Video Courses & Player Applet**:
  - Embedded YouTube video player applet featuring Ethical Hacking Full Course 2026 and Edureka Ethical Hacking Course with interactive timestamps and notes.

### 2. CEH Practical Exam Track (Target: 14/20 to Pass)
- **The "Big Three" Open-Source Cheat Sheets**:
  - Samsar4 / `Ethical-Hacking-Labs` (direct syntax for brute-forcing, network sweeping, crypto cracking).
  - phirojshah / `CEH` (the golden rule: always pipe network scans to desktop files first!).
  - sariamubeen / `CEH-Practical-Exam` (challenge walkthroughs and flag methodologies).
- **The Four Practical Pillars**:
  1. Advanced Scanning & Enumeration (Nmap flags `-O`, `-sV`, `-sC`, enum4linux, null sessions).
  2. Web App Exploitation (SQL injection with sqlmap, LFI, hash extraction).
  3. System Hacking & Privilege Escalation (Metasploit, searchsploit, msfvenom, getsystem).
  4. Defensive Concepts (Steganography with OpenStego/StegHide/QuickStego, Wireshark `.pcap` analysis).
- **Interactive 20-Challenge Practical Simulator**:
  - 6-hour simulated exam timer, target scenarios, live flag checking, and 14/20 passing threshold indicator.

### 3. Spaced-Repetition Study Flashcards & Mnemonic Visual Anchors
- Complete study decks across all 9 official CEH blueprint domains.
- Mastery status tracking (*Needs Review* vs *Mastered*), shuffle mode, and instant search.
- Browser SpeechSynthesis Text-to-Speech (TTS) for auditory pronunciation of terms.
- Generative associative mnemonic visual anchors to facilitate photographic recall.
- Full custom card creation, JSON import/export, and local storage persistence.

### 4. Gemini AI Scenario Practice Generator
- **Server-Side AI Endpoint**: Powered by `@google/genai` using the `gemini-3.8-flash` model at `POST /api/generate-scenario-questions`.
- **Contextual Deck Topic Targeting**: Automatically creates multi-stage penetration testing scenarios based on the active flashcard deck's topic.
- **Customization**: Adjustable difficulty (*Standard CEH* vs *Advanced Red Team*) and customizable target focus.
- **Interactive Lab Drills**: Real-time option validation, detailed technical root-cause explanations, MITRE ATT&CK technique mapping, and exam takeaways.
- **Flashcard Conversion**: Save individual questions or bulk-export generated scenarios directly into your flashcard decks.
- **Curated Offline Fallback**: Extensive high-yield scenario bank ensures 100% availability even without an API key.

### 5. In-Browser Kali Linux CLI Simulation
- Realistic embedded terminal emulator directly inside the **Tools** tab.
- Supports 25+ real security commands: `nmap`, `hydra`, `sqlmap`, `john`, `steghide`, `aircrack-ng`, `wireshark`, `gobuster`, `nikto`, `enum4linux`, `smbclient`, `dig`, `whois`, etc.
- Authentic terminal features: command history (`ArrowUp`/`ArrowDown`), tabbed terminal sessions, and 4 customizable themes (*Matrix Green*, *Classic Dark*, *Kali Navy*, *Monochrome Amber*).
- **"Test in CLI"** buttons throughout the tools checklist for one-click command execution.

### 6. Granular Web Audio Controls & Settings Modal
- Pure synthesized audio cues created via the native Web Audio API (zero external audio files).
- Independent toggling for **Master Audio**, **Completion Cues** (flashcard answers, deck fanfares, CTF flag captures), and **Timer Alerts** (Pomodoro breaks, 6-hour test countdown alarms).
- Dedicated Settings modal with live preview audio triggers and persistence in `localStorage`.
- Quick-toggle mute button conveniently available in the top navbar.

### 7. Global Focus Mode
- Full-screen distraction-free layout across all exam tracks and study views.
- Automatically collapses navigation bars, breadcrumbs, search ribbons, and footers.
- Sticky minimalist top bar with an integrated session stopwatch (start, pause, reset) and quick icon-based view switcher.
- Accessible via the navbar Focus Mode button or by pressing the `F` key anywhere.

### 8. My Bookmarks Hub & Quick Revision
- Save high-yield topics, lab environments, GitHub notes, Big Three cheat sheets, and terminal commands directly from Written and Practical views.
- Dedicated tab with real-time bookmark counter badge, search filtering, and category grouping.
- One-click copy, direct execution in the embedded Kali Linux CLI simulator, and bulk export to Markdown or JSON.
- Quick navigation shortcut: press `B` or `0`.

### 9. Visual Performance Analytics & Historical Tracking
- Built with **Recharts** inside the **Practice Tests** module.
- Interactive score trend area chart tracking progress across sequential test attempts against the 70% passing threshold.
- Domain breakdown analytics highlighting strong areas and weak domains requiring extra review.

### 10. Dark Web & Onion Routing Blueprint
- Surface Web (4%), Deep Web (90%), and Dark Web (6%) structural architecture.
- 7-step interactive visualizer demonstrating Tor 3-hop circuit construction, concentric AES encryption layers, and onion peeling.
- Python and Bash automation scripts for safe `.onion` security research.

### 11. Programmer Study Methodology
- **The "Living" Command Sheet**: Interactive editor with default CEH domain commands, custom entry builder, and instant Markdown export.
- **Multi-Language Automation Scripts**: Python, Bash, Go, Rust, PowerShell, Node.js scripts to parse Nmap XML, brute force URLs, and avoid rabbit holes.
- **"Focus on the Why" Output Analyzer**: Interactive terminal log inspector to identify True Positives, Timeouts/Rate-limits, and Firewall Blocks.

### 12. Curated EC-Council Exam Environment Tools Checklist
- Checklist of GUI and CLI tools present in the official exam environment.
- Category filters, Kali `apt-get` command generator, and exam pro-tips.

### 13. Multilingual User Guide & TTS (20 Languages)
- Available in English, French, German, Italian, Spanish, Portuguese, Indonesian, Swahili, Turkish, Russian, Chinese (Simplified), Japanese, Arabic, Urdu, Hindi, Marathi, Bangla/Bengali, Tamil, Telugu, and Wu Chinese (Shanghainese).
- Integrated Text-to-Speech (TTS) audio narration with adjustable speech rate.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Backend / API** | Node.js + Express + `tsx` |
| **AI Integration** | `@google/genai` (Google Gen AI SDK, `gemini-3.8-flash`) |
| **Styling** | Tailwind CSS v4 |
| **Data Visualization** | Recharts + D3 |
| **Icons & Visuals** | Lucide React |
| **Animations** | Motion (`motion/react`) |
| **Audio Engine** | Native HTML5 Web Audio API (synthesized oscillators) |
| **Speech Engine** | Native Web Speech API (`SpeechSynthesis`) |
| **Build Bundler** | Vite (Client) + `esbuild` (Server CJS bundle) |

---

## Quickstart

### Prerequisites
- Node.js 18+ or 20+
- (Optional) `GEMINI_API_KEY` for live AI scenario generation

### Installation

```bash
# 1. Clone repository and navigate to folder
git clone https://github.com/your-username/kaybit-cehexam.git
cd kaybit-cehexam

# 2. Install dependencies
npm install

# 3. (Optional) Set up your Gemini API Key
# Copy example environment file and add your key
cp .env.example .env
# Edit .env and set: GEMINI_API_KEY=your_actual_key_here

# 4. Start development server (boots Express backend + Vite frontend on port 3000)
npm run dev
```

The application will be accessible at: `http://localhost:3000`

### Production Build & Deployment

```bash
# Build production client bundle and server bundle
npm run build

# Start the standalone production server
npm run start
```

---

## Documentation Files
- `USER_GUIDE.md`: Comprehensive student and instructor curriculum guide.
- `INSTALLATION.md`: Full-stack packaging and native deployment guide (Docker, Android, iOS, Windows, macOS, PWA).
