export type ExamTab = 'written' | 'practical' | 'progress' | 'darkweb' | 'tools' | 'methodology' | 'tests' | 'installation' | 'flashcards' | 'bookmarks';

export interface StudyBookmark {
  id: string; // unique ID e.g. "note-mr-infect" or "cmd-nmap-recon"
  type: 'note' | 'cheatsheet' | 'command' | 'lab' | 'pillar';
  title: string;
  category: string; // e.g. "Written Notes", "Cheat Sheet Snippet", "4 Practical Pillars", "Lab Environment", "Essential Command"
  sourceTab: ExamTab;
  sourceSubTab?: string;
  targetId?: string; // e.g. "mr-infect", "pillar-1", "cisco-packet-tracer", "repo-1"
  description?: string;
  content?: string; // command or code snippet or notes
  notes?: string;
  tags?: string[];
  createdAt: string;
}

export interface AudioSettingsState {
  master: boolean;
  completion: boolean;
  timerAlerts: boolean;
}

export interface DomainTaskItem {
  id: string;
  title: string;
  type: 'lab' | 'note';
  description: string;
}

export interface ExamDomainProgress {
  id: string;
  domainNumber: number;
  name: string;
  blueprintWeight: number; // percentage, e.g. 21 for 21%
  color: string;
  summary: string;
  tasks: DomainTaskItem[];
}

export interface UserProgressState {
  completedTaskIds: Record<string, boolean>;
  completedLabIds: Record<string, boolean>;
  completedNoteIds: Record<string, boolean>;
  lastUpdated: string;
}

export interface LabEnvironment {
  id: string;
  title: string;
  category: 'cisco' | 'local' | 'tryhackme';
  tag: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  architecture: string;
  setupInstructions: string[];
  keyVulnerabilitiesDemonstrated: string[];
  recommendedCommands: string[];
  officialUrl: string;
}

export interface GitHubRepoNote {
  id: string;
  title: string;
  authorRepo: string;
  url: string;
  focus: string;
  highlights: string[];
  cheatSheetPreview: string;
  sampleCommands: { cmd: string; desc: string }[];
}

export interface VideoCourse {
  id: string;
  title: string;
  provider: string;
  duration: string;
  youtubeId: string;
  embedUrl: string;
  description: string;
  keyTopics: string[];
  chapters: { title: string; timestamp: string }[];
}

export interface PracticalPillar {
  id: string;
  title: string;
  iconName: string;
  examWeight: string;
  summary: string;
  whyItMatters: string;
  coreTools: string[];
  essentialCommands: { cmd: string; explanation: string; flagDetails: string }[];
  scenarioWalkthrough: {
    target: string;
    objective: string;
    steps: string[];
    sampleTerminalOutput: string;
  };
}

export interface ExamTool {
  id: string;
  name: string;
  category: 'Scanning & Recon' | 'Web App Hacking' | 'System & PrivEsc' | 'Steganography & Forensics' | 'Cryptography & Cracking' | 'Sniffing & MITM';
  type: 'CLI' | 'GUI' | 'Both';
  examPresence: 'Pre-installed in CEH VM' | 'Essential Add-on' | 'Key Windows Utility';
  purpose: string;
  kaliInstallCmd: string;
  quickSyntax: string;
  proTip: string;
}

export interface PracticalChallenge {
  id: number;
  title: string;
  pillar: string;
  scenario: string;
  targetInfo: string;
  task: string;
  flagHint: string;
  correctFlag: string;
  solutionBreakdown: string[];
  codeSnippetExample: string;
}

export interface WrittenQuizQuestion {
  id: number;
  domain: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeVulnerabilityExample?: string;
}

export interface ProgrammingScriptSnippet {
  language: string;
  purpose: string;
  filename: string;
  code: string;
  notes: string;
  runCommand?: string;
}

export interface LivingCommandItem {
  id: string;
  domain: string;
  tool: string;
  command: string;
  description: string;
  isCustom?: boolean;
}

export type SearchFilterCategory = 'all' | 'commands' | 'notes' | 'methodology' | 'labs' | 'tools';

export interface GlobalSearchItem {
  id: string;
  title: string;
  category: 'command' | 'note' | 'script' | 'lab' | 'tool' | 'scenario' | 'topic';
  filterCategory: 'commands' | 'notes' | 'methodology' | 'labs' | 'tools';
  targetTab: ExamTab;
  badge: string;
  description: string;
  contentSnippet?: string;
  tags: string[];
  toolOrLanguage?: string;
  copyable?: string;
  url?: string;
}

export interface NetworkSpectrumTier {
  id: string;
  name: string;
  commonAlias: string;
  estimatedVolume: string;
  dnsMechanism: string;
  portsAndProtocols: string[];
  indexingMechanism: string;
  encryptionSecurity: string;
  accessMethod: string;
  cehExamTraps: string[];
  coreCharacteristics: string[];
  realWorldExamples: string[];
}

export interface OnionCircuitStep {
  stepNumber: number;
  phase: string;
  cellType: string;
  source: string;
  destination: string;
  cryptoLayer: string;
  action: string;
  whatNodeKnows: {
    knowsClientIP: boolean;
    knowsNextHop: boolean;
    knowsPrevHop: boolean;
    knowsTargetDestination: boolean;
    canReadPayload: boolean;
  };
  explanation: string;
  securityImpact: string;
}

export interface DarkWebObjectiveItem {
  id: string;
  category: 'spectrum' | 'handshake' | 'crypto' | 'intel' | 'threats';
  title: string;
  cehSignificance: string;
  description: string;
  verificationQuestion: string;
  verifiedAnswer: string;
}

export interface TorScraperScript {
  id: string;
  language: string;
  filename: string;
  purpose: string;
  speedRating: string;
  executionComplexity: 'Easy' | 'Intermediate' | 'Advanced';
  regexPattern: string;
  targetEndpoints: string[];
  dependencies: string[];
  code: string;
  usageInstructions: string[];
  sampleOutput: string;
}

export interface Flashcard {
  id: string;
  domainId: string; // e.g. 'domain-1' through 'domain-9', or 'general'
  category: string;
  question: string;
  answer: string;
  explanation?: string;
  hint?: string;
  codeSnippet?: string;
  tags?: string[];
  mnemonicVisualUrl?: string; // Generated Imagen visual aid data URL or image URL
  mnemonicPrompt?: string; // Mnemonic visual concept prompt
  isMastered?: boolean;
  reviewCount?: number;
  lastReviewedAt?: string;
  createdAt: string;
  isCustom?: boolean;
}

export interface ScenarioPracticeQuestion {
  id: string;
  domainId: string;
  category: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyTakeaway: string;
  mitreTechnique?: string;
  suggestedFlashcardAnswer?: string;
  difficulty?: 'Standard CEH' | 'Advanced Red Team';
  userSelectedOption?: number;
}

export type ThemeVariationId = 'editorial' | 'technical' | 'warm' | 'dark' | 'vibrant';

export interface ThemeVariation {
  id: ThemeVariationId;
  name: string;
  tagline: string;
  description: string;
  fontCategory: string;
  aesthetic: string;
  preview: {
    bg: string;
    surface: string;
    card: string;
    border: string;
    accent: string;
    text: string;
    badgeBg: string;
    badgeText: string;
  };
}

export type PomodoroTimerMode = 'focus' | 'short-break' | 'long-break';

export interface PomodoroSettings {
  focusDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  completedSessions: number;
  totalMinutesStudied: number;
  activeTopic?: string;
}
