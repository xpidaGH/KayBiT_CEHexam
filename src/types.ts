export type ExamTab = 'written' | 'practical' | 'progress' | 'tools' | 'methodology' | 'tests' | 'installation';

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
