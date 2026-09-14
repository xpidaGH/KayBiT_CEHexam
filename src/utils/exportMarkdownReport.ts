import { EXAM_DOMAINS_PROGRESS } from '../data/progressData';
import { PRACTICAL_PRACTICE_CHALLENGES } from '../data/cehPracticalData';
import { STORAGE_KEYS, APP_CONFIG } from '../data/appConfig';
import { getStudyStreak } from './streakTracker';
import { StudyBookmark } from '../types';

/**
 * Generate and download a comprehensive Markdown revision & progress report
 */
export function exportProgressAndBookmarksMarkdown(): void {
  try {
    // 1. Fetch domain progress from localStorage
    const savedDomainProgress = localStorage.getItem(STORAGE_KEYS.DOMAIN_PROGRESS);
    const completedTasks: Record<string, boolean> = savedDomainProgress ? JSON.parse(savedDomainProgress) : {};

    // 2. Fetch solved practical flags
    const savedFlags = localStorage.getItem(STORAGE_KEYS.PRACTICAL_SOLVED_FLAGS);
    const solvedFlags: Record<number, boolean> = savedFlags ? JSON.parse(savedFlags) : {};
    const solvedFlagsCount = Object.values(solvedFlags).filter(Boolean).length;

    // 3. Fetch bookmarks
    const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    const bookmarks: StudyBookmark[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];

    // 4. Fetch streak
    const streak = getStudyStreak();

    // 5. Calculate overall scores
    let weightedScoreTotal = 0;
    const domainDetails = EXAM_DOMAINS_PROGRESS.map((domain) => {
      const completed = domain.tasks.filter((t) => completedTasks[t.id]).length;
      const total = domain.tasks.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      weightedScoreTotal += (percent * domain.blueprintWeight) / 100;
      return {
        ...domain,
        completed,
        total,
        percent,
      };
    });
    const finalScore = Math.round(weightedScoreTotal);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Build Markdown Document
    let md = `# ${APP_CONFIG.appName} - Comprehensive CEH Study & Revision Summary\n\n`;
    md += `> **Generated on:** ${formattedDate} at ${formattedTime}  \n`;
    md += `> **Blueprint Version:** CEH ${APP_CONFIG.blueprintVersion}  \n`;
    md += `> **Study Streak:** 🔥 ${streak.currentStreak} Consecutive Day${streak.currentStreak === 1 ? '' : 's'} (Best: ${streak.bestStreak} days)  \n\n`;

    md += `---\n\n`;

    // Section 1: Executive Readiness Summary
    md += `## 1. Executive Certification Readiness\n\n`;
    md += `| Metric | Current Progress | Exam Requirement | Status |\n`;
    md += `|---|:---:|:---:|:---:|\n`;
    md += `| **Overall Blueprint Score** | **${finalScore}%** | 70% | ${finalScore >= 70 ? '✅ PASSED' : '⚠️ IN PROGRESS'} |\n`;
    md += `| **CEH Practical CTF Flags** | **${solvedFlagsCount} / ${PRACTICAL_PRACTICE_CHALLENGES.length}** | 14 / 20 Flags | ${solvedFlagsCount >= 14 ? '✅ READY' : '⚠️ NEEDS DRILL'} |\n`;
    md += `| **Total Active Study Days** | **${streak.totalActiveDays} Days** | Regular Daily Cadence | ${streak.activeToday ? '🔥 Active Today' : '⏳ Pending Today'} |\n`;
    md += `| **Saved Bookmarks & Cheat Sheets** | **${bookmarks.length} Items** | Pre-Exam Quick Revision | 📚 Curated |\n\n`;

    // Section 2: Domain-by-Domain Mastery Checklist
    md += `## 2. Official 9-Domain Blueprint Mastery Breakdown\n\n`;
    domainDetails.forEach((d) => {
      const statusIcon = d.percent === 100 ? '🟢 100% MASTERED' : d.percent >= 70 ? '🟡 PASSING TIER' : '🔴 CRITICAL FOCUS';
      md += `### Domain ${d.domainNumber}: ${d.name} (${d.blueprintWeight}% Exam Weight)\n`;
      md += `* **Status:** ${statusIcon} - **${d.percent}%** (${d.completed}/${d.total} tasks completed)\n`;
      md += `* **Domain Overview:** ${d.summary}\n`;
      md += `* **Task Completion:**\n`;
      d.tasks.forEach((t) => {
        const isDone = !!completedTasks[t.id];
        md += `  - [${isDone ? 'x' : ' '}] **${t.title}** (${t.type.toUpperCase()}) - ${t.description}\n`;
      });
      md += `\n`;
    });

    // Section 3: CEH Practical CTF Challenges Log
    md += `## 3. CEH Practical 20-Challenge Simulation Log\n\n`;
    md += `* **Total Solved:** ${solvedFlagsCount} of ${PRACTICAL_PRACTICE_CHALLENGES.length} challenges (${Math.round((solvedFlagsCount / PRACTICAL_PRACTICE_CHALLENGES.length) * 100)}%)\n\n`;
    md += `| # | Challenge Scenario | Target Tool / Tech | Flag Captured |\n`;
    md += `|---|---|---|:---:|\n`;
    PRACTICAL_PRACTICE_CHALLENGES.forEach((c) => {
      const isSolved = !!solvedFlags[c.id];
      md += `| ${c.id} | ${c.title} | \`${c.pillar}\` | ${isSolved ? '✅ SOLVED' : '❌ PENDING'} |\n`;
    });
    md += `\n`;

    // Section 4: Bookmarked Topics & Cheat Sheets
    md += `## 4. Curated Study Bookmarks & Essential Commands\n\n`;
    if (bookmarks.length === 0) {
      md += `_No items have been bookmarked yet. Use the bookmark star in Written and Practical views to collect your revision notes._\n\n`;
    } else {
      // Group bookmarks by category
      const categories = ['command', 'cheat-sheet', 'lab', 'repo', 'pillar', 'note', 'other'];
      categories.forEach((cat) => {
        const items = bookmarks.filter((b) => b.category === cat);
        if (items.length === 0) return;

        const catTitle = {
          command: 'Terminal Commands & Tool Syntax',
          'cheat-sheet': 'GitHub Exam Cheat Sheets & Repositories',
          lab: 'Virtual Labs & TryHackMe Environments',
          repo: 'Big Three Practical Repositories',
          pillar: 'CEH Practical Exam Pillars',
          note: 'Conceptual Study Notes & Formulas',
          other: 'General Bookmarked Topics',
        }[cat] || cat;

        md += `### ${catTitle} (${items.length} items)\n\n`;
        items.forEach((item, idx) => {
          md += `#### ${idx + 1}. ${item.title}\n`;
          if (item.sourceTab) {
            md += `* **Source / Tab:** \`${item.sourceTab}\`${item.sourceSubTab ? ` (${item.sourceSubTab})` : ''}\n`;
          }
          if (item.description) {
            md += `* **Description:** ${item.description}\n`;
          }
          if (item.tags && item.tags.length > 0) {
            md += `* **Tags:** ${item.tags.map((t) => `\`#${t}\``).join(' ')}\n`;
          }
          if (item.notes) {
            md += `* **Personal Study Note:** ${item.notes}\n`;
          }
          if (item.content) {
            md += `\n\`\`\`bash\n${item.content}\n\`\`\`\n`;
          }
          md += `\n`;
        });
      });
    }

    // Section 5: Final Study Recommendations
    md += `## 5. Strategic Pre-Exam Recommendations\n\n`;
    md += `1. **Focus on High-Weight Domains:** Domains 2 (Scanning & Enum, 18%), 3 (Security Threats, 18%), and 4 (System Hacking, 18%) constitute over 54% of the Written Exam.\n`;
    md += `2. **Open-Documentation Strategy for Practical:** Master Nmap XML parsing, Hashcat mode syntax (-m 0, 1000, 1800), and SQLmap tamper flags (--batch --dbs).\n`;
    md += `3. **Rest & Pacing:** Practice with the built-in 60-minute Break Reminder to prevent cognitive fatigue during the 6-hour practical exam.\n\n`;

    md += `---\n`;
    md += `*Report compiled automatically by ${APP_CONFIG.appName} (${APP_CONFIG.tagline}). Keep hacking ethically!* 🛡️\n`;

    // Trigger browser file download
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const todayStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `KayBiT_CEH_Exam_Revision_Report_${todayStr}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export markdown revision report', err);
  }
}
