export interface ContextMenuItem {
  id: 'refresh' | 'clear-cache' | 'report-bug' | 'open-docs' | 'copy-diagnostics';
  label: string;
  description: string;
  shortcut?: string;
  danger?: boolean;
}

export const SEARCH_CONTEXT_MENU_ITEMS: ContextMenuItem[] = [
  {
    id: 'refresh',
    label: 'Refresh App Data',
    description: 'Re-verify stored state, blueprint tasks, and streak synchronization',
    shortcut: '⌘R',
  },
  {
    id: 'clear-cache',
    label: 'Clear Cache',
    description: 'Flush temporary search caches and session memory without losing study progress',
    shortcut: 'Alt+C',
  },
  {
    id: 'report-bug',
    label: 'Report Bug',
    description: 'Open developer diagnostic report with active environment details',
    shortcut: '⌘.',
  },
];
