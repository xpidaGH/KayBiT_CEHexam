export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bangla/Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'wuu', name: 'Wu Chinese (Shanghainese)', nativeName: '吴语 (上海话)' },
];

export interface UserGuideContent {
  title: string;
  badge: string;
  lastUpdated: string;
  sections: {
    id: string;
    heading: string;
    content: string;
    bulletPoints?: string[];
  }[];
}

export const USER_GUIDE_TRANSLATIONS: Record<string, UserGuideContent> = {
  en: {
    title: 'KayBiT_CEHexam: Complete Student & Educator User Guide',
    badge: 'Official Exam Preparation Manual',
    lastUpdated: 'September 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Executive Overview & Architecture',
        content: 'KayBiT_CEHexam is an all-in-one, cross-platform preparation hub designed specifically for intermediate programming students across Python, JavaScript, TypeScript, Java, C#, Kotlin, Go, Rust, Bash, PowerShell, C++, C, SQL, and other languages. The platform unifies theoretical knowledge for the CEH Written Exam with live, command-driven execution for the CEH Practical Exam.',
        bulletPoints: [
          'Component 1: CEH Written Exam Preparation with virtual labs, structured GitHub text notes, and YouTube video player applets.',
          'Component 2: CEH Practical Exam Preparation with the "Big Three" community cheat sheets, four core practical pillars, and a 20-question authentic lab exam simulator.',
          'Living Command Sheet builder allowing custom command documentation and one-click markdown exports.',
          'Programmer automation wrappers (Python, Bash, Go, Rust, PowerShell) to prevent exam fatigue.'
        ]
      },
      {
        id: 'written-guide',
        heading: '2. CEH Written Exam Track Guide',
        content: 'The CEH Written examination (125 multiple-choice questions in 4 hours) demands rigorous conceptual comprehension across 9 security domains.',
        bulletPoints: [
          'Hands-on Labs: Access guided virtual setups from Cisco Networking Academy (packet flows & network penetration), Local Virtualization Sandboxes (VirtualBox/VMware + DVWA & OWASP Juice Shop to witness code-level input sanitization failures), and TryHackMe free browser terminal rooms.',
          'Text Notes & GitHub Repos: Study curated summaries from Mr-Infect (ceh-v13-notes for protocol blueprints), phirojshah (syntax cheat sheets for nmap, enum4linux, sqlmap), and SNGWN (rapid domain to CLI tool matrices).',
          'Video Masterclasses: Utilize the in-app responsive YouTube video player applets featuring Ethical Hacking Full Course 2026 and Edureka Ethical Hacking Course with timestamps.'
        ]
      },
      {
        id: 'practical-guide',
        heading: '3. CEH Practical Exam Track & The "Big Three"',
        content: 'The CEH Practical is a 6-hour hands-on challenge requiring at least 14 out of 20 correct flags. You are tested in an authentic VM sandbox.',
        bulletPoints: [
          'The Big Three Repositories: Samsar4 (credential brute-forcing, network sweeping, cryptography cracking), phirojshah (the golden rule: always pipe network scans to desktop files first!), and sariamubeen (challenge breakdowns and flag methodologies).',
          'Pillar 1 - Advanced Scanning: Nmap flags (-O, -sV, -sC), enum4linux, and Null Session exploits against Windows targets.',
          'Pillar 2 - Web App Exploitation: Automated SQL injection with sqlmap, dumping databases and password hashes, directory traversal.',
          'Pillar 3 - System Hacking & PrivEsc: Metasploit msfconsole, msfvenom payloads, and upgrading to Meterpreter with getsystem.',
          'Pillar 4 - Defensive Stego & Traffic Analysis: OpenStego, StegHide, QuickStego image extractions, and Wireshark .pcap credential stream carving.'
        ]
      },
      {
        id: 'methodology-guide',
        heading: '4. Programmer Study Methodology & Living Sheet',
        content: 'As programmers, leverage your scripting superpowers rather than performing repetitive manual labor.',
        bulletPoints: [
          'Build a Living Command Sheet: Categorized under #Recon, #WebApps, #Cracking, #PrivEsc, #Stego, and #TrafficAnalysis. Export directly to Markdown.',
          'Simulate the Pacing: Use our pre-built automation scripts in Python, Bash, Go, Rust, or PowerShell to parse Nmap XML outputs and prevent getting trapped in 40-minute rabbit holes.',
          'Focus on the "Why": Train your mental parser with our interactive Raw Terminal Output Analyzer to distinguish True Positives from Rate-Limiting Timeouts and Firewall Drops.'
        ]
      },
      {
        id: 'tools-guide',
        heading: '5. EC-Council Exam Environment Tools Checklist',
        content: 'Audit and pre-install the exact GUI and CLI tools available in the official EC-Council exam machine. Filter by category, track your installation progress, and generate unified `apt-get` installation scripts.'
      },
      {
        id: 'flashcards-ai-lab',
        heading: '6. Spaced-Repetition Flashcards & Gemini AI Scenario Lab',
        content: 'Master high-yield concepts across all 9 CEH domains with interactive spaced-repetition flashcards, generative mnemonic visual anchors, and AI-powered scenario question generation.',
        bulletPoints: [
          'Domain Decks: Spaced-repetition card decks with mastery tracking, audio pronunciation via Web Speech TTS, and instant keyboard shortcuts.',
          'Mnemonic Visual Anchors: Associative generative imagery to facilitate photographic recall for complex protocols and memory exploits.',
          'Gemini AI Scenario Generator: Synthesize real-world multi-stage scenarios tailored to the active deck topic with instant multiple-choice drills, detailed remediation explanations, and MITRE ATT&CK mappings.',
          'Custom Deck Conversion: Instantly save generated scenarios directly into your study deck with persistent local storage.'
        ]
      },
      {
        id: 'cli-simulator',
        heading: '7. In-Browser Kali Linux CLI Simulation & Audio Cues',
        content: 'Practice typing and executing authentic security commands directly within the browser without requiring a virtual machine.',
        bulletPoints: [
          'Simulated CLI Terminal: Authentic prompt supporting 25+ real security tools (nmap, hydra, sqlmap, john, steghide, aircrack-ng, enum4linux, etc.) with command history and customizable color themes.',
          'Test in CLI Integration: Launch pre-configured exam commands directly from the tools checklist into the terminal simulator.',
          'Synthetic Audio Feedback: Web Audio API chimes for flashcard mastery, deck completion fanfares, and Pomodoro study timer alerts (globally toggleable).'
        ]
      },
      {
        id: 'performance-analytics',
        heading: '8. Visual Performance Analytics & Historical Tracking',
        content: 'Track exam readiness and score progression over time with interactive Recharts visualizations.',
        bulletPoints: [
          'Historical Score Trend: Interactive area chart visualizing test score percentages across sequential practice sessions against the 70% passing threshold.',
          'Domain Breakdown: Identify high-performing domains (≥80%) and pinpoint vulnerable areas requiring extra scenario practice.'
        ]
      },
      {
        id: 'darkweb-blueprint',
        heading: '9. Dark Web & Onion Routing Blueprint',
        content: 'Explore the architectural differences between Surface Web (4%), Deep Web (90%), and Dark Web (6%).',
        bulletPoints: [
          '7-Step Circuit Visualizer: Interactive step-by-step breakdown of Tor multi-hop circuit establishment, layered AES encryption, and onion peeling.',
          'Defensive Intelligence: Practical guidance and automation scripts for conducting safe threat intelligence and `.onion` security investigations.'
        ]
      },
      {
        id: 'focus-audio-bookmarks',
        heading: '10. Global Focus Mode, Granular Audio Controls & My Bookmarks',
        content: 'Enhance productivity during marathon study sessions with distraction-free viewing, custom audio notification preferences, and persistent content bookmarking.',
        bulletPoints: [
          'Global Focus Mode: Toggle via the navbar button or press "F" anywhere in the app to hide distraction elements across all views. Features a built-in stopwatch, quick tab switcher, and zero-clutter reading.',
          'Granular Audio Controls: Independently configure or mute master sound effects, successful completion cues (flashcard answers, flag captures, domain fanfares), and timer alerts via the Settings menu.',
          'My Bookmarks Hub: Bookmark any lab environment, GitHub text note, Big Three cheat sheet, or essential terminal command. Search, filter by category, run commands directly in the CLI simulator, and export bookmarks as Markdown or JSON.'
        ]
      }
    ]
  },
  fr: {
    title: 'KayBiT_CEHexam: Guide Utilisateur Complet pour Étudiants et Enseignants',
    badge: 'Manuel Officiel de Préparation aux Examens',
    lastUpdated: 'Septembre 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Présentation Générale et Architecture',
        content: 'KayBiT_CEHexam est une plateforme de préparation multiplateforme conçue pour les étudiants programmeurs intermédiaires (Python, JS, C#, Java, Go, Rust, Bash, etc.). Elle réunit la préparation théorique au CEH Écrit et la pratique intensive pour le CEH Practical.',
        bulletPoints: [
          'Composant 1: Examen Écrit CEH avec laboratoires virtuels (Cisco, DVWA, TryHackMe), dépôts GitHub et lecteur vidéo YouTube intégré.',
          'Composant 2: Examen Pratique CEH avec les "Trois Grands" aide-mémoires, 4 piliers pratiques et simulateur de 20 défis.',
          'Feuille de commandes vivante personnalisable et exportable en Markdown.',
          'Scripts d\'automatisation pour programmeurs en Python, Bash, Go, Rust et PowerShell.'
        ]
      },
      {
        id: 'written-guide',
        heading: '2. Parcours de l\'Examen Écrit CEH',
        content: 'L\'examen écrit (125 questions QCM en 4 heures) nécessite une compréhension rigoureuse des 9 domaines de sécurité.',
        bulletPoints: [
          'Laboratoires pratiques : Cisco Networking Academy, bac à sable local (VirtualBox/VMware avec DVWA et OWASP Juice Shop), et salles gratuites TryHackMe.',
          'Notes Markdown : dépôts de Mr-Infect (ceh-v13-notes), phirojshah et SNGWN.',
          'Vidéos intégrées : Masterclasses YouTube 2026 et cours Edureka avec chapitrage.'
        ]
      },
      {
        id: 'practical-guide',
        heading: '3. Parcours de l\'Examen Pratique CEH (14/20 pour réussir)',
        content: 'L\'examen pratique de 6 heures exige de valider au moins 14 défis sur 20 dans un environnement virtuel réel.',
        bulletPoints: [
          'Les 3 Grands Dépôts : Samsar4 (brute-force et crypto), phirojshah (rediriger toujours les scans vers des fichiers texte) et sariamubeen.',
          'Les 4 Piliers : Balayage avancé (Nmap, enum4linux), exploitation Web (sqlmap, LFI), piratage système (Metasploit, Meterpreter) et analyse défensive (StegHide, Wireshark).'
        ]
      }
    ]
  },
  de: {
    title: 'KayBiT_CEHexam: Vollständiges Benutzerhandbuch für Studenten & Dozenten',
    badge: 'Offizieller Prüfungsvorbereitungs-Leitfaden',
    lastUpdated: 'September 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Gesamtübersicht & Plattform-Architektur',
        content: 'KayBiT_CEHexam ist die All-in-One-Vorbereitungsplattform für Programmierstudenten aller gängigen Sprachen. Sie vereint die theoretische CEH-Schriftprüfung mit dem praxisorientierten CEH-Practical-Labor.',
        bulletPoints: [
          'Komponente 1: CEH Written Exam mit Hands-on-Labs (Cisco, DVWA, TryHackMe), GitHub-Notizen und YouTube-Videoplayer.',
          'Komponente 2: CEH Practical Exam mit den "Großen Drei" Repositories, 4 Kernsäulen und 20-Aufgaben-Prüfungssimulator.',
          'Lebendes Befehlsblatt mit Direkt-Export nach Markdown.',
          'Automatisierungs-Skripte für Python, Bash, Go, Rust und PowerShell.'
        ]
      },
      {
        id: 'practical-guide',
        heading: '2. CEH Practical Leitfaden (14 von 20 zum Bestehen)',
        content: 'In der 6-stündigen Praxisprüfung müssen mindestens 14 von 20 Flaggen korrekt eingereicht werden. Wichtigste Regel: Alle Scans sofort in Textdateien auf dem Desktop speichern!'
      }
    ]
  },
  it: {
    title: 'KayBiT_CEHexam: Guida Utente Completa per Studenti e Docenti',
    badge: 'Manuale Ufficiale di Preparazione',
    lastUpdated: 'Settembre 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Panoramica Generale e Architettura',
        content: 'KayBiT_CEHexam è l\'hub di preparazione integrato dedicato agli studenti di programmazione per superare sia l\'esame teorico CEH Written che l\'esame pratico CEH Practical.',
        bulletPoints: [
          'Preparazione CEH Scritto con laboratori Cisco, sandbox locale DVWA/Juice Shop e TryHackMe.',
          'Preparazione CEH Pratico con le 3 repository comunitarie principali e simulatore da 20 sfide.',
          'Foglio di comandi interattivo con esportazione Markdown.',
          'Script di automazione in Python, Bash, Go e PowerShell.'
        ]
      }
    ]
  },
  es: {
    title: 'KayBiT_CEHexam: Guía Completa del Usuario para Estudiantes y Educadores',
    badge: 'Manual Oficial de Preparación CEH',
    lastUpdated: 'Septiembre 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Resumen Ejecutivo y Arquitectura',
        content: 'KayBiT_CEHexam es una plataforma multiplataforma creada para estudiantes de programación intermedios. Integra la preparación teórica para el examen escrito CEH y el entorno de explotación para el examen práctico CEH.',
        bulletPoints: [
          'Componente 1: Examen Escrito CEH con laboratorios Cisco NetAcad, sandbox local con DVWA y OWASP Juice Shop, y salas TryHackMe.',
          'Componente 2: Examen Práctico CEH con los "Tres Grandes" repositorios de GitHub (Samsar4, phirojshah, sariamubeen) y simulador de 20 desafíos (14/20 para aprobar).',
          'Hoja viva de comandos con exportación en formato Markdown.',
          'Scripts de automatización en Python, Bash, Go, Rust y PowerShell para procesar salidas de terminal.'
        ]
      },
      {
        id: 'practical-guide',
        heading: '2. Los Cuatro Pilares del CEH Práctico',
        content: 'Domina los 4 pilares: Escaneo y Enumeración Avanzada, Explotación de Aplicaciones Web (SQLi con sqlmap), Hackeo de Sistemas y Escalada de Privilegios con Metasploit, y Conceptos Defensivos (Esteganografía y Wireshark).'
      }
    ]
  },
  pt: {
    title: 'KayBiT_CEHexam: Guia Completo do Usuário para Estudantes e Instrutores',
    badge: 'Manual Oficial de Preparação',
    lastUpdated: 'Setembro 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Visão Geral e Arquitetura',
        content: 'O KayBiT_CEHexam é a solução tudo-em-um para estudantes de programação dominarem tanto a prova escrita do CEH quanto o exame prático de 6 horas do CEH Practical.',
        bulletPoints: [
          'Preparação para o CEH Escrito com laboratórios Cisco, DVWA, OWASP Juice Shop e TryHackMe.',
          'Preparação para o CEH Prático com os três repositórios essenciais e simulador com 20 desafios.',
          'Folha de comandos dinâmica personalizável e exportável em Markdown.',
          'Scripts auxiliares em Python, Bash, Go e PowerShell.'
        ]
      }
    ]
  },
  id: {
    title: 'KayBiT_CEHexam: Panduan Lengkap Pengguna untuk Siswa & Pengajar',
    badge: 'Buku Panduan Persiapan Ujian Resmi',
    lastUpdated: 'September 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Ringkasan Eksekutif & Arsitektur',
        content: 'KayBiT_CEHexam adalah aplikasi lintas platform untuk siswa pemrograman yang mempersiapkan ujian tertulis CEH dan ujian praktik CEH Practical.',
        bulletPoints: [
          'Komponen 1: Ujian Tertulis CEH dengan lab virtual Cisco, DVWA, OWASP Juice Shop, dan TryHackMe.',
          'Komponen 2: Ujian Praktik CEH dengan 3 repositori utama dan simulasi 20 tantangan lab (lulus minimal 14/20).',
          'Lembar perintah interaktif yang dapat diekspor ke Markdown.',
          'Skrip otomatisasi Python, Bash, Go, dan PowerShell.'
        ]
      }
    ]
  },
  sw: {
    title: 'KayBiT_CEHexam: Mwongozo Kamili wa Mtumiaji kwa Wanafunzi na Walimu',
    badge: 'Mwongozo Rasmi wa Maandalizi ya Mtihani',
    lastUpdated: 'Septemba 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Muhtasari Mkuu na Muundo',
        content: 'KayBiT_CEHexam ni jukwaa la maandalizi ya mtihani wa CEH Written na CEH Practical lililotengenezwa mahsusi kwa wanafunzi wa programu za kompyuta.',
        bulletPoints: [
          'Mtihani wa Nadharia wa CEH ukiwa na maabara ya Cisco, DVWA, na TryHackMe.',
          'Mtihani wa Vitendo wa CEH ukiwa na hazina kuu 3 na majaribio 20 ya vitendo (alama ya kufaulu 14/20).',
          'Jedwali la amri linaloweza kuboreshwa na kupakuliwa kwa Markdown.',
          'Hati za kiotomatiki za Python, Bash, na Go.'
        ]
      }
    ]
  },
  tr: {
    title: 'KayBiT_CEHexam: Öğrenciler ve Eğitmenler İçin Kapsamlı Kullanım Kılavuzu',
    badge: 'Resmi Sınav Hazırlık El Kitabı',
    lastUpdated: 'Eylül 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Genel Bakış ve Mimari',
        content: 'KayBiT_CEHexam, programlama öğrencileri için CEH Yazılı Sınavı ve CEH Practical Uygulamalı Sınavına hazırlanmayı tek bir çatı altında toplayan çok platformlu bir uygulamadır.',
        bulletPoints: [
          'Bileşen 1: Cisco NetAcad, yerel DVWA/Juice Shop laboratuvarları ve TryHackMe odalarıyla CEH Yazılı hazırlığı.',
          'Bileşen 2: "Büyük Üçlü" açık kaynak notları, 4 ana pratik sütun ve 20 soruluk sınav simülatörü (geçmek için en az 14/20).',
          'Markdown olarak dışa aktarılabilen dinamik komut kılavuzu.',
          'Python, Bash, Go, Rust ve PowerShell için sınav otomasyon betikleri.'
        ]
      }
    ]
  },
  ru: {
    title: 'KayBiT_CEHexam: Полное руководство пользователя для студентов и преподавателей',
    badge: 'Официальное руководство по подготовке к экзаменам',
    lastUpdated: 'Сентябрь 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. Обзор платформы и архитектура',
        content: 'KayBiT_CEHexam — это кроссплатформенный обучающий комплекс для подготовки к письменному экзамену CEH Written и 6-часовому практическому экзамену CEH Practical.',
        bulletPoints: [
          'Компонент 1: Подготовка к письменному CEH с виртуальными лабораториями Cisco, песочницей DVWA/Juice Shop, TryHackMe и видеокурсами YouTube.',
          'Компонент 2: Подготовка к CEH Practical с шпаргалками "Большой тройки" (Samsar4, phirojshah, sariamubeen) и симулятором 20 задач (14/20 для сдачи).',
          'Интерактивный лист команд с возможностью экспорта в Markdown.',
          'Скрипты автоматизации для программистов на Python, Bash, Go, Rust и PowerShell.'
        ]
      }
    ]
  },
  zh: {
    title: 'KayBiT_CEHexam: 学生与讲师全功能使用指南',
    badge: '官方认证备考指南',
    lastUpdated: '2026年9月',
    sections: [
      {
        id: 'overview',
        heading: '1. 平台概述与架构',
        content: 'KayBiT_CEHexam 专为中级编程学员（掌握 Python、JS、Go、Rust、Bash、C++ 等语言）打造，完美整合 CEH 笔试与 CEH Practical 实操考试。',
        bulletPoints: [
          '模块一：CEH 笔试备考，包含思科网络学院实验、本地 DVWA/Juice Shop 靶场、TryHackMe 免费练习室及内置 YouTube 视频播放器。',
          '模块二：CEH Practical 实操备考，收录三大经典开源 Cheat Sheets、四大核心实操支柱及 20 题实战实验室模拟器（答对 14 题及以上通关）。',
          '实时动态命令库，支持一键导出标准 Markdown 格式。',
          '提供 Python、Bash、Go、Rust、PowerShell 多语言自动化解析脚本，避免盲目扫描浪费时间。'
        ]
      }
    ]
  },
  ja: {
    title: 'KayBiT_CEHexam: 受講生および指導者のための総合ユーザーガイド',
    badge: '公式認定試験対策マニュアル',
    lastUpdated: '2026年9月',
    sections: [
      {
        id: 'overview',
        heading: '1. 全体概要とシステム構成',
        content: 'KayBiT_CEHexam は、プログラミング学習者のための CEH 筆記試験および実技試験（CEH Practical）を網羅したオールインワン学習プラットフォームです。',
        bulletPoints: [
          'コンポーネント1: CEH筆記試験対策（Cisco仮想ラボ、DVWA/Juice Shopサンドボックス、TryHackMe、YouTubeビデオ講座）。',
          'コンポーネント2: CEH Practical実技試験対策（「三大」GitHubチートシート、4大実践ピラー、20問ラボシミュレーター）。',
          'Markdown形式でエクスポート可能な「生きたコマンドシート」。',
          'Python、Bash、Go、Rust、PowerShellによるログ解析自動化スクリプト。'
        ]
      }
    ]
  },
  ar: {
    title: 'KayBiT_CEHexam: دليل المستخدم الشامل للطلاب والمعلمين',
    badge: 'الدليل الرسمي للتحضير للاختبار',
    lastUpdated: 'سبتمبر 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. نظرة عامة والأساس المعماري',
        content: 'تطبيق KayBiT_CEHexam هو منصة شاملة لطلاب البرمجة للتحضير لاختبار المخترق الأخلاقي المعتمد النظري والعملي (CEH Written & CEH Practical).',
        bulletPoints: [
          'المكون الأول: التحضير للاختبار النظري مع مختبرات Cisco و DVWA و TryHackMe ومقاطع فيديو تعليمية.',
          'المكون الثاني: التحضير للاختبار العملي مع المستودعات الثلاثة الكبرى وجلسة محاكاة من 20 تحدياً (النجاح من 14/20).',
          'سجل الأوامر المباشر القابل للتصدير بصيغة Markdown.',
          'نصوص أتمتة برمجية بلغات Python و Bash و Go و PowerShell لتسريع تحليل المخرجات.'
        ]
      }
    ]
  },
  ur: {
    title: 'KayBiT_CEHexam: طلباء اور اساتذہ کے لیے مکمل یوزر گائیڈ',
    badge: 'سرکاری امتحانی تیاری گائیڈ',
    lastUpdated: 'ستمبر 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. تعارف اور بنیادی ڈھانچہ',
        content: 'KayBiT_CEHexam پروگرامنگ کے طلباء کے لیے CEH تھیوری اور CEH پریکٹیکل امتحانات کی تیاری کا جامع پلیٹ فارم ہے۔',
        bulletPoints: [
          'حصہ 1: CEH تھیوری امتحان کے لیے Cisco لیبز، DVWA، اور TryHackMe فری رومز۔',
          'حصہ 2: CEH پریکٹیکل امتحان کے لیے ٹاپ تین اوپن سورس ریپوز اور 20 سوالات پر مشتمل لائیو لیب سمیلیٹر (پاس ہونے کے لیے 14/20 درکار)۔',
          'زندہ کمانڈ شیٹ بلڈر جس کو Markdown میں ایکسپورٹ کیا جا سکتا ہے۔',
          'Python، Bash اور PowerShell میں آٹومیشن اسکرپٹس۔'
        ]
      }
    ]
  },
  hi: {
    title: 'KayBiT_CEHexam: छात्रों और शिक्षकों के लिए संपूर्ण उपयोगकर्ता मार्गदर्शिका',
    badge: 'आधिकारिक परीक्षा तैयारी गाइड',
    lastUpdated: 'सितंबर 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. समग्र परिचय एवं वास्तुकला',
        content: 'KayBiT_CEHexam प्रोग्रामिंग छात्रों (Python, Java, Go, Rust, C++, Bash आदि) के लिए CEH लिखित एवं CEH प्रैक्टिकल परीक्षाओं की तैयारी का ऑल-इन-वन हब है।',
        bulletPoints: [
          'घटक 1: CEH लिखित परीक्षा की तैयारी - Cisco लैब्स, स्थानीय वर्चुअलाइजेशन (DVWA, OWASP Juice Shop), TryHackMe एवं YouTube मास्टरक्लास।',
          'घटक 2: CEH प्रैक्टिकल परीक्षा की तैयारी - "बिग थ्री" गिटहब नोट्स, 4 प्रैक्टिकल पिलर्स और 20-चुनौती परीक्षा सिम्युलेटर (उत्तीर्ण होने के लिए 14/20 अनिवार्य)।',
          'लिविंग कमांड शीट संपादक - मार्कडाउन में तुरंत डाउनलोड करने योग्य।',
          'Python, Bash, Go और PowerShell में स्वचालन स्क्रिप्ट्स ताकि परीक्षा के दौरान समय बचाया जा सके।'
        ]
      }
    ]
  },
  mr: {
    title: 'KayBiT_CEHexam: विद्यार्थी आणि शिक्षकांसाठी संपूर्ण वापरकर्ता मार्गदर्शिका',
    badge: 'अधिकृत परीक्षा तयारी मॅन्युअल',
    lastUpdated: 'सप्टेंबर 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. विहंगावलोकन आणि रचना',
        content: 'KayBiT_CEHexam हे प्रोग्रामिंग विद्यार्थ्यांसाठी CEH लेखी परीक्षा आणि CEH प्रॅक्टिकल परीक्षांची तयारी करण्यासाठीचे सर्वसमावेशक व्यासपीठ आहे.',
        bulletPoints: [
          'घटक 1: CEH लेखी परीक्षा - Cisco नेटअकॅड लॅब, DVWA, OWASP Juice Shop आणि TryHackMe.',
          'घटक 2: CEH प्रॅक्टिकल परीक्षा - बिग थ्री गिटहब नोट्स आणि 20-आव्हान प्रॅक्टिकल सिम्युलेटर (उत्तीर्ण होण्यासाठी 14/20 आवश्यक).',
          'लिव्हिंग कमांड शीट जी थेट Markdown मध्ये एक्सपोर्ट करता येते.',
          'Python, Bash आणि Go मधील ऑटोमेशन स्क्रिप्ट्स.'
        ]
      }
    ]
  },
  bn: {
    title: 'KayBiT_CEHexam: শিক্ষার্থী ও প্রশিক্ষকদের জন্য সম্পূর্ণ ব্যবহারকারী নির্দেশিকা',
    badge: 'অফিসিয়াল পরীক্ষা প্রস্তুতি ম্যানুয়াল',
    lastUpdated: 'সেপ্টেম্বর ২০২৬',
    sections: [
      {
        id: 'overview',
        heading: '১. প্ল্যাটফর্ম পরিচিতি ও পরিকাঠামো',
        content: 'KayBiT_CEHexam প্রোগ্রামিং শিক্ষার্থীদের জন্য তৈরি একটি সর্বাঙ্গীন প্রস্তুতি হাব, যা CEH লিখিত পরীক্ষা এবং CEH প্র্যাকটিক্যাল উভয় পরীক্ষার জন্য ডিজাইন করা হয়েছে।',
        bulletPoints: [
          'কম্পোনেন্ট ১: CEH লিখিত পরীক্ষা - Cisco ভার্চুয়াল ল্যাব, DVWA/Juice Shop স্যান্ডবক্স এবং TryHackMe ফ্রি রুম।',
          'কম্পোনেন্ট ২: CEH প্র্যাকটিক্যাল পরীক্ষা - "বিগ থ্রি" গিটহাব চিটশিট, ৪টি মূল স্তম্ভ এবং ২০টি চ্যালেঞ্জ সমৃদ্ধ সিমুলেটর (পাস মার্ক ১৪/২০)।',
          'কাস্টম লিভিং কমান্ড শিট ও সরাসরি Markdown এক্সপোর্ট সুবিধা।',
          'Python, Bash, Go এবং PowerShell ভিত্তিক আউটপুট পার্সার স্ক্রিপ্ট।'
        ]
      }
    ]
  },
  ta: {
    title: 'KayBiT_CEHexam: மாணவர்கள் மற்றும் பயிற்றுநர்களுக்கான முழுமையான பயனர் கையேடு',
    badge: 'அதிகாரப்பூர்வ தேர்வு தயாரிப்பு வழிகாட்டி',
    lastUpdated: 'செப்டம்பர் 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. தளத்தின் மேலோட்டம் மற்றும் கட்டமைப்பு',
        content: 'KayBiT_CEHexam என்பது நிரலாக்க மாணவர்கள் CEH எழுத்துத் தேர்வு மற்றும் CEH செய்முறைத் தேர்வில் தேர்ச்சி பெற உதவும் முழுமையான தளமாகும்.',
        bulletPoints: [
          'கூறு 1: CEH எழுத்துத் தேர்வு - Cisco லேப்கள், DVWA/Juice Shop மற்றும் TryHackMe இலவச அறைகள்.',
          'கூறு 2: CEH செய்முறைத் தேர்வு - முக்கிய 3 GitHub குறிப்புகள் மற்றும் 20 சவால்கள் கொண்ட தேர்வு சிமுலேட்டர் (தேர்ச்சி பெற 14/20 தேவை).',
          'லைவிங் கமாண்ட் ஷீட் - Markdown ஆக பதிவிறக்கம் செய்யும் வசதி.',
          'Python, Bash, Go மற்றும் PowerShell தானியங்கி ஸ்கிரிப்டுகள்.'
        ]
      }
    ]
  },
  te: {
    title: 'KayBiT_CEHexam: విద్యార్థులు మరియు అధ్యాపకుల కోసం సమగ్ర వినియోగదారు మార్గదర్శిని',
    badge: 'అధికారిక పరీక్ష సన్నద్ధత మాన్యువల్',
    lastUpdated: 'సెప్టెంబర్ 2026',
    sections: [
      {
        id: 'overview',
        heading: '1. ప్రాజెక్ట్ అవలోకనం మరియు నిర్మాణం',
        content: 'KayBiT_CEHexam అనేది ప్రోగ్రామింగ్ విద్యార్థుల కోసం CEH వ్రాత పరీక్ష మరియు CEH ప్రాక్టికల్ పరీక్షల సమగ్ర తయారీ వేదిక.',
        bulletPoints: [
          'భాగం 1: CEH వ్రాత పరీక్ష తయారీ - Cisco ల్యాబ్స్, DVWA/Juice Shop మరియు TryHackMe.',
          'భాగం 2: CEH ప్రాక్టికల్ పరీక్ష తయారీ - బిగ్ త్రీ GitHub నోట్స్ మరియు 20 సవాళ్ల ల్యాబ్ సిమ్యులేటర్ (పాస్ అవ్వడానికి 14/20 అవసరం).',
          'లివింగ్ కమాండ్ షీట్ - Markdown లోకి ఎగుమతి చేసుకునే సదుపాయం.',
          'Python, Bash, Go మరియు PowerShell లలో ఆటోమేషన్ స్క్రిప్ట్‌లు.'
        ]
      }
    ]
  },
  wuu: {
    title: 'KayBiT_CEHexam: 学生搭教师使用指南 (吴语/上海话指南)',
    badge: '官方考试准备手册',
    lastUpdated: '2026年9月',
    sections: [
      {
        id: 'overview',
        heading: '1. 总体架构与考试目标 (Executive Overview)',
        content: 'KayBiT_CEHexam 是专门为中级程序员（Python、JS、TypeScript、Java、Go、Rust、Bash等）设计个一站式跨平台网络安全认证准备系统。将 CEH 笔试（Written）理论知识搭 CEH 实验操作（Practical）现场实操完美结合。',
        bulletPoints: [
          '模块 1：CEH 笔试备考——包含虚拟实验环境（Cisco、DVWA/Juice Shop、TryHackMe）、精选 GitHub 笔记及视频播放器。',
          '模块 2：CEH 实操备考——精选三大神级社区笔记（Samsar4、phirojshah、sariamubeen）、四大实战支柱搭 6 小时模拟机。',
          '动态命令清单（Living Command Sheet）：分类归档网络侦察、Web 渗透、凭据破解、权限提升搭流量分析命令，支持一键导出 Markdown。',
          '程序员专属自动化脚本工具：提供 Python、Bash、Go、Rust、PowerShell 多语言脚本，避免人工重复劳动。'
        ]
      },
      {
        id: 'written-guide',
        heading: '2. CEH 笔试认证路径 (CEH Written Exam Track)',
        content: 'CEH 笔试要求在 4 个钟头内完成 125 道多选题，覆盖 9 大安全知识域。系统提供针对性实验指南搭权威讲义复习。',
        bulletPoints: [
          '动手实验：连接 Cisco 实验、本地虚拟机沙箱（DVWA/OWASP Juice Shop 验证输入过滤失效）搭 TryHackMe 免费靶场。',
          '笔记精粹：学习 Mr-Infect 协议蓝图、phirojshah 命令语法速查表搭 SNGWN 工具矩阵。',
          '视频课堂：内置 2026 伦理黑客全流程精讲视频。'
        ]
      },
      {
        id: 'practical-guide',
        heading: '3. CEH 实操挑战与三大神级仓库 (The Big Three)',
        content: 'CEH Practical 是历时 6 小时的动手挑战赛，需要夺取 20 面旗帜中的至少 14 面。',
        bulletPoints: [
          '三大实战笔记：Samsar4（密码破解、加密学）、phirojshah（黄金法则：随时把网络扫描输出管道重定向到文件）搭 sariamubeen。',
          '支柱 1 高级扫描：Nmap 深度参数（-O、-sV、-sC）、enum4linux 及 Windows 空会话利用。',
          '支柱 2 Web 渗透：sqlmap 自动化注入提取数据库、密码哈希与目录遍历。',
          '支柱 3 系统提权：Metasploit msfconsole、msfvenom 生成载荷及 Meterpreter getsystem。',
          '支柱 4 隐写与流量分析：OpenStego、StegHide 隐写提取搭 Wireshark 抓包数据流分析。'
        ]
      },
      {
        id: 'methodology-guide',
        heading: '4. 程序员高效备考心法与动态命令清单',
        content: '发挥程序员编写脚本的优势，切忌陷入机械重复劳动。利用多语言脚本自动解析 Nmap XML 输出，提升答题节奏。',
        bulletPoints: [
          '建立活命令集：涵盖 Recon、WebApps、Cracking、PrivEsc、Stego 与 TrafficAnalysis。',
          '把控节奏：遇到卡点 40 分钟内及时切换目标。',
          '注重底层机制：用内置终端分析器辨别真实漏洞与防火墙丢包。'
        ]
      },
      {
        id: 'tools-guide',
        heading: '5. EC-Council 官方实操工具清单',
        content: '核对官方考试环境中预装的所有 GUI 与 CLI 工具，分类勾选进度并生成统一的 apt-get 脚本。'
      }
    ]
  }
};
