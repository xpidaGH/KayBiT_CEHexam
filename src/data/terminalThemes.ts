export interface TerminalTheme {
  id: string;
  name: string;
  badge: string;
  bg: string;
  surface: string;
  text: string;
  prompt: string;
  accent: string;
  comment: string;
  cyan: string;
  yellow: string;
  red: string;
  border: string;
  swatch: string[];
}

export const TERMINAL_THEMES: TerminalTheme[] = [
  {
    id: 'kali',
    name: 'Kali Cyber Dark',
    badge: 'Default',
    bg: '#0a0f1d',
    surface: '#060a14',
    text: '#cbd5e1',
    prompt: '#10b981',
    accent: '#06b6d4',
    comment: '#64748b',
    cyan: '#14b8a6',
    yellow: '#f59e0b',
    red: '#f43f5e',
    border: '#1e293b',
    swatch: ['#0a0f1d', '#10b981', '#06b6d4', '#cbd5e1'],
  },
  {
    id: 'dracula',
    name: 'Dracula',
    badge: 'Classic',
    bg: '#282a36',
    surface: '#21222c',
    text: '#f8f8f2',
    prompt: '#50fa7b',
    accent: '#bd93f9',
    comment: '#6272a4',
    cyan: '#8be9fd',
    yellow: '#f1fa8c',
    red: '#ff5555',
    border: '#44475a',
    swatch: ['#282a36', '#bd93f9', '#50fa7b', '#f8f8f2'],
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox Dark',
    badge: 'Warm Retro',
    bg: '#282828',
    surface: '#1d2021',
    text: '#ebdbb2',
    prompt: '#b8bb26',
    accent: '#fe8019',
    comment: '#928374',
    cyan: '#8ec07c',
    yellow: '#fabd2f',
    red: '#fb4934',
    border: '#3c3836',
    swatch: ['#282828', '#fe8019', '#b8bb26', '#ebdbb2'],
  },
  {
    id: 'solarized',
    name: 'Solarized Dark',
    badge: 'Precision',
    bg: '#002b36',
    surface: '#073642',
    text: '#93a1a1',
    prompt: '#859900',
    accent: '#268bd2',
    comment: '#586e75',
    cyan: '#2aa198',
    yellow: '#b58900',
    red: '#dc322f',
    border: '#0a4352',
    swatch: ['#002b36', '#268bd2', '#859900', '#93a1a1'],
  },
  {
    id: 'monokai',
    name: 'Monokai Pro',
    badge: 'High Contrast',
    bg: '#2d2a2e',
    surface: '#221f22',
    text: '#fcfcfa',
    prompt: '#a9dc76',
    accent: '#ffd866',
    comment: '#727072',
    cyan: '#78dce8',
    yellow: '#ffd866',
    red: '#ff6188',
    border: '#403e41',
    swatch: ['#2d2a2e', '#ffd866', '#a9dc76', '#ff6188'],
  },
  {
    id: 'nord',
    name: 'Nordic Frost',
    badge: 'Cool Arctic',
    bg: '#2e3440',
    surface: '#242933',
    text: '#eceff4',
    prompt: '#a3be8c',
    accent: '#88c0d0',
    comment: '#616e88',
    cyan: '#8fbcbb',
    yellow: '#ebcb8b',
    red: '#bf616a',
    border: '#3b4252',
    swatch: ['#2e3440', '#88c0d0', '#a3be8c', '#eceff4'],
  },
  {
    id: 'matrix',
    name: 'Matrix Green',
    badge: 'Cyberpunk',
    bg: '#050f08',
    surface: '#020a04',
    text: '#00ff66',
    prompt: '#00ff41',
    accent: '#39ff14',
    comment: '#006622',
    cyan: '#00ffcc',
    yellow: '#99ff33',
    red: '#ff3333',
    border: '#003311',
    swatch: ['#050f08', '#00ff41', '#39ff14', '#00ffcc'],
  },
];

export const DEFAULT_TERMINAL_THEME = TERMINAL_THEMES[0];
