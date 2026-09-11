import { ExamTab } from '../types';

/**
 * Application Constants & Exam Default Configurations
 */
export const APP_CONFIG = {
  appName: 'KayBiT_CEHexam',
  version: '1.0.0',
  blueprintVersion: 'v13',
  title: 'CEH Written & Practical Master Hub for 20+ Languages',
  tagline: 'Bridging Software Engineering and Offensive Security',
  author: 'KayBiT Cyber Academy',
  examParameters: {
    practicalDurationSeconds: 21600, // 6 Hours = 6 * 3600
    practicalTotalChallenges: 20,
    practicalPassingScore: 14, // 70% threshold
    practicalMinutesPerChallenge: 18,
    writtenTotalQuestions: 125,
    writtenPassingScorePercentage: 70,
  },
};

/**
 * LocalStorage Keys for persistent state across app sessions
 */
export const STORAGE_KEYS = {
  CHECKED_TOOLS: 'kaybit_ceh_checked_tools',
  LIVING_COMMANDS: 'kaybit_ceh_living_commands',
  PRACTICAL_TIMER: 'kaybit_ceh_practical_timer',
  WRITTEN_NOTES: 'kaybit_ceh_written_notes',
  SELECTED_LANGUAGE: 'kaybit_ceh_selected_language',
  PRACTICAL_SOLVED_FLAGS: 'kaybit_ceh_practical_solved',
  ACTIVE_TAB: 'kaybit_ceh_active_tab',
  DOMAIN_PROGRESS: 'kaybit_ceh_domain_progress',
  COMPLETED_LABS: 'kaybit_ceh_completed_labs',
  COMPLETED_NOTES: 'kaybit_ceh_completed_notes',
  DARKWEB_PROGRESS: 'kaybit_ceh_darkweb_progress',
  DARKWEB_NOTES: 'kaybit_ceh_darkweb_notes',
  WRITTEN_DOMAIN_NOTES: 'kaybit_ceh_written_domain_notes',
} as const;

/**
 * Navigation Bar Configuration Items
 */
export interface NavItemConfig {
  id: ExamTab;
  label: string;
  badge?: string;
  description: string;
}

export const NAV_ITEMS_CONFIG: NavItemConfig[] = [
  { 
    id: 'written', 
    label: 'Written Exam', 
    description: 'Labs (Cisco, Local DVWA/JuiceShop, TryHackMe), Notes, Video Masterclasses' 
  },
  { 
    id: 'practical', 
    label: 'Practical Exam', 
    badge: '14/20 Pass', 
    description: 'The Big Three Cheat Sheets & The 4 Practical Pillars' 
  },
  { 
    id: 'darkweb', 
    label: 'Dark Web Blueprint', 
    badge: 'Tor Intel', 
    description: 'Network Boundaries, Tor Handshake Mechanics, Bootstrap Tracker & Threat Intel Scraper' 
  },
  { 
    id: 'progress', 
    label: 'Domain Tracker', 
    badge: 'Progress Ring', 
    description: 'Circular Progress Rings & Domain Mastery for Labs & Notes' 
  },
  { 
    id: 'tools', 
    label: 'Tools Checklist', 
    description: 'Pre-installed EC-Council Exam Environment CLI & GUI Tools' 
  },
  { 
    id: 'methodology', 
    label: 'Programmer Lab', 
    badge: 'Scripts', 
    description: 'Living Command Sheet, Multi-Language Automation & Terminal Analyzer' 
  },
  { 
    id: 'tests', 
    label: 'Practice Tests', 
    badge: '20 Labs', 
    description: '20-Challenge 6-Hour Timed Practical Lab & Written Domain Quizzes' 
  },
  { 
    id: 'installation', 
    label: 'Native Downloads', 
    description: 'Native Packaging for Android, iOS, Windows, macOS & PWA' 
  },
];

/**
 * Category & Type Filter Constants for Tools Checklist
 */
export const TOOL_CATEGORIES = [
  'All',
  'Scanning & Recon',
  'Web App Hacking',
  'System & PrivEsc',
  'Steganography & Forensics',
  'Cryptography & Cracking',
  'Sniffing & MITM',
] as const;

export const TOOL_TYPES = [
  { value: 'All', label: 'Type: All (CLI & GUI)' },
  { value: 'CLI', label: 'Type: Command Line (CLI)' },
  { value: 'GUI', label: 'Type: Graphical (GUI)' },
] as const;

/**
 * Domain Categories for Living Command Sheet
 */
export const LIVING_COMMAND_DOMAINS = [
  'All',
  '#Recon',
  '#WebApps',
  '#Cracking',
  '#PrivEsc',
  '#Stego',
  '#TrafficAnalysis',
] as const;

export const LIVING_COMMAND_ADD_OPTIONS = [
  '#Recon',
  '#WebApps',
  '#Cracking',
  '#PrivEsc',
  '#Stego',
  '#TrafficAnalysis',
] as const;
