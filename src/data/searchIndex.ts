import { GlobalSearchItem, SearchFilterCategory, ExamTab } from '../types';
import { 
  DEFAULT_LIVING_COMMANDS, 
  PROGRAMMER_AUTOMATION_SCRIPTS, 
  OUTPUT_ANALYSIS_SCENARIOS 
} from './programmerMethodologyData';
import { 
  LAB_ENVIRONMENTS, 
  GITHUB_REPO_NOTES 
} from './cehWrittenData';
import { 
  BIG_THREE_REPOSITORIES, 
  PRACTICAL_PILLARS 
} from './cehPracticalData';
import { EC_COUNCIL_EXAM_TOOLS } from './toolsChecklistData';
import { EXAM_DOMAINS_PROGRESS } from './progressData';

/**
 * Builds a unified, fast index of all CEH topics, commands, scripts, notes, labs, and tools.
 */
function buildSearchIndex(): GlobalSearchItem[] {
  const items: GlobalSearchItem[] = [];

  // 1. Living Commands (Methodology module)
  DEFAULT_LIVING_COMMANDS.forEach((cmd) => {
    items.push({
      id: `living-${cmd.id}`,
      title: `${cmd.tool}: ${cmd.command}`,
      category: 'command',
      filterCategory: 'commands',
      targetTab: 'methodology',
      badge: 'CLI Command',
      description: cmd.description,
      contentSnippet: cmd.command,
      tags: [cmd.domain, cmd.tool, 'living-command', 'syntax', 'terminal'],
      toolOrLanguage: cmd.tool,
      copyable: cmd.command,
    });
  });

  // 2. 20-Programming Language Automation Scripts (Methodology module)
  PROGRAMMER_AUTOMATION_SCRIPTS.forEach((script, idx) => {
    items.push({
      id: `script-${idx}-${script.language.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      title: `${script.language} Automation: ${script.purpose}`,
      category: 'script',
      filterCategory: 'methodology',
      targetTab: 'methodology',
      badge: `${script.language} Script`,
      description: `${script.notes} (${script.filename})`,
      contentSnippet: script.code.slice(0, 300) + (script.code.length > 300 ? '...' : ''),
      tags: [script.language.toLowerCase(), 'script', 'automation', 'socket', 'network', script.filename],
      toolOrLanguage: script.language,
      copyable: script.code,
    });
  });

  // 3. Raw Terminal Output Scenarios (Methodology module)
  OUTPUT_ANALYSIS_SCENARIOS.forEach((scenario) => {
    items.push({
      id: `scenario-${scenario.id}`,
      title: `Terminal Triage: ${scenario.title} (${scenario.tool})`,
      category: 'scenario',
      filterCategory: 'methodology',
      targetTab: 'methodology',
      badge: 'Terminal Triage',
      description: `${scenario.explanation} - Pro Action: ${scenario.proAction}`,
      contentSnippet: scenario.terminalOutput.slice(0, 250) + '...',
      tags: [scenario.tool, 'terminal', 'triage', 'verdict', scenario.verdict.toLowerCase()],
      toolOrLanguage: scenario.tool,
      copyable: scenario.terminalOutput,
    });
  });

  // 4. GitHub Markdown Notes & Cheat Sheets (Written Exam module)
  GITHUB_REPO_NOTES.forEach((repo) => {
    items.push({
      id: `repo-note-${repo.id}`,
      title: `Written Notes: ${repo.title}`,
      category: 'note',
      filterCategory: 'notes',
      targetTab: 'written',
      badge: 'GitHub Markdown',
      description: `${repo.focus}. Highlights: ${repo.highlights.join(' • ')}`,
      contentSnippet: repo.cheatSheetPreview,
      tags: ['notes', 'ceh-written', 'v13', 'blueprint', repo.authorRepo.toLowerCase(), 'cheatsheet'],
      url: repo.url,
      copyable: repo.cheatSheetPreview,
    });

    // Also index sample commands inside this repo
    repo.sampleCommands.forEach((sample, sIdx) => {
      items.push({
        id: `repo-cmd-${repo.id}-${sIdx}`,
        title: `${repo.title}: ${sample.cmd}`,
        category: 'command',
        filterCategory: 'commands',
        targetTab: 'written',
        badge: 'Note Command',
        description: sample.desc,
        contentSnippet: sample.cmd,
        tags: ['command', 'ceh-written', repo.id, 'syntax'],
        copyable: sample.cmd,
      });
    });
  });

  // 5. Big Three Practical Repositories & Commands (Practical module)
  BIG_THREE_REPOSITORIES.forEach((repo) => {
    items.push({
      id: `big3-${repo.id}`,
      title: `Practical Repo: ${repo.name}`,
      category: 'note',
      filterCategory: 'notes',
      targetTab: 'practical',
      badge: 'Practical Cheat Sheet',
      description: `${repo.corePhilosophy} Exam Tips: ${repo.examTips.join(' • ')}`,
      tags: ['practical', 'big-three', repo.authorRepo.toLowerCase(), 'exam-tips'],
      url: repo.githubUrl,
    });

    repo.keySnippets.forEach((snippet, snipIdx) => {
      items.push({
        id: `big3-snippet-${repo.id}-${snipIdx}`,
        title: `${snippet.label} (${repo.name})`,
        category: 'command',
        filterCategory: 'commands',
        targetTab: 'practical',
        badge: 'Practical Command',
        description: snippet.notes,
        contentSnippet: snippet.code,
        tags: ['practical', 'syntax', 'command', snippet.label.toLowerCase()],
        copyable: snippet.code,
      });
    });
  });

  // 6. Practical Exam 4 Pillars (Practical module)
  PRACTICAL_PILLARS.forEach((pillar) => {
    items.push({
      id: `pillar-${pillar.id}`,
      title: `Practical Pillar ${pillar.id}: ${pillar.title}`,
      category: 'topic',
      filterCategory: 'notes',
      targetTab: 'practical',
      badge: 'Practical Pillar',
      description: `${pillar.whyItMatters} Key Tools: ${pillar.coreTools.join(', ')}`,
      contentSnippet: pillar.scenarioWalkthrough.objective,
      tags: ['pillar', 'practical', 'methodology', ...pillar.coreTools.map(t => t.toLowerCase())],
    });

    pillar.essentialCommands.forEach((cmdItem, cIdx) => {
      items.push({
        id: `pillar-cmd-${pillar.id}-${cIdx}`,
        title: `${pillar.title}: ${cmdItem.cmd}`,
        category: 'command',
        filterCategory: 'commands',
        targetTab: 'practical',
        badge: 'Pillar Command',
        description: `${cmdItem.explanation} (Flags: ${cmdItem.flagDetails})`,
        contentSnippet: cmdItem.cmd,
        tags: ['command', 'practical', `pillar-${pillar.id}`, 'syntax'],
        copyable: cmdItem.cmd,
      });
    });
  });

  // 7. Hands-on Labs & Environments (Written Exam module)
  LAB_ENVIRONMENTS.forEach((lab) => {
    items.push({
      id: `lab-${lab.id}`,
      title: `Lab: ${lab.title}`,
      category: 'lab',
      filterCategory: 'labs',
      targetTab: 'written',
      badge: `${lab.difficulty} Lab`,
      description: `${lab.description} Vulns: ${lab.keyVulnerabilitiesDemonstrated.join('; ')}`,
      contentSnippet: lab.architecture,
      tags: ['lab', lab.category, lab.difficulty.toLowerCase(), 'environment', 'hands-on'],
      url: lab.officialUrl,
    });

    lab.recommendedCommands.forEach((cmd, cIdx) => {
      items.push({
        id: `lab-cmd-${lab.id}-${cIdx}`,
        title: `${lab.title}: ${cmd}`,
        category: 'command',
        filterCategory: 'commands',
        targetTab: 'written',
        badge: 'Lab Command',
        description: `Recommended command in ${lab.title}`,
        contentSnippet: cmd,
        tags: ['lab', 'command', lab.category, 'hands-on'],
        copyable: cmd,
      });
    });
  });

  // 8. EC-Council Exam Tools Checklist (Tools module)
  EC_COUNCIL_EXAM_TOOLS.forEach((tool) => {
    items.push({
      id: `tool-${tool.id}`,
      title: `Tool: ${tool.name} (${tool.category})`,
      category: 'tool',
      filterCategory: 'tools',
      targetTab: 'tools',
      badge: `${tool.type} Tool`,
      description: `${tool.purpose} Pro-Tip: ${tool.proTip}`,
      contentSnippet: tool.quickSyntax,
      tags: ['tool', tool.category.toLowerCase(), tool.type.toLowerCase(), 'pre-installed'],
      toolOrLanguage: tool.name,
      copyable: tool.quickSyntax,
    });

    if (tool.quickSyntax) {
      items.push({
        id: `tool-syntax-${tool.id}`,
        title: `${tool.name} Syntax: ${tool.quickSyntax}`,
        category: 'command',
        filterCategory: 'commands',
        targetTab: 'tools',
        badge: 'Tool Syntax',
        description: `${tool.purpose} (Pro-Tip: ${tool.proTip})`,
        contentSnippet: tool.quickSyntax,
        tags: ['syntax', 'command', tool.id, tool.category.toLowerCase()],
        toolOrLanguage: tool.name,
        copyable: tool.quickSyntax,
      });
    }
  });

  // 9. CEH v13 Blueprint Domains & Tasks (Progress module)
  EXAM_DOMAINS_PROGRESS.forEach((domain) => {
    items.push({
      id: `domain-item-${domain.id}`,
      title: `Domain 0${domain.domainNumber}: ${domain.name} (${domain.blueprintWeight}%)`,
      category: 'topic',
      filterCategory: 'notes',
      targetTab: 'progress',
      badge: `Domain (${domain.blueprintWeight}%)`,
      description: domain.summary,
      contentSnippet: domain.tasks.map(t => t.title).join(' • '),
      tags: ['domain', 'blueprint', 'v13', `domain-${domain.domainNumber}`, domain.name.toLowerCase()],
    });

    domain.tasks.forEach((task) => {
      items.push({
        id: `domain-task-${task.id}`,
        title: `Domain 0${domain.domainNumber} Task: ${task.title}`,
        category: task.type === 'lab' ? 'lab' : 'note',
        filterCategory: task.type === 'lab' ? 'labs' : 'notes',
        targetTab: 'progress',
        badge: task.type === 'lab' ? 'Domain Lab' : 'Domain Note',
        description: task.description,
        tags: ['domain-task', task.type, `domain-${domain.domainNumber}`, domain.name.toLowerCase()],
      });
    });
  });

  return items;
}

export const GLOBAL_SEARCH_INDEX: GlobalSearchItem[] = buildSearchIndex();

/**
 * Searches items by query string and filter category.
 */
export function searchCEHItems(
  query: string,
  filter: SearchFilterCategory = 'all',
  limit: number = 50
): GlobalSearchItem[] {
  const trimmed = query.trim().toLowerCase();

  return GLOBAL_SEARCH_INDEX.filter((item) => {
    // Category filter check
    if (filter !== 'all' && item.filterCategory !== filter) {
      return false;
    }

    // If no query string, return all matching the category
    if (!trimmed) {
      return true;
    }

    // Split into keyword tokens for multi-term matching (e.g. "nmap stealth", "sqlmap dump")
    const tokens = trimmed.split(/\s+/).filter(Boolean);

    const searchableText = [
      item.title,
      item.description,
      item.contentSnippet || '',
      item.tags.join(' '),
      item.toolOrLanguage || '',
      item.badge,
    ].join(' ').toLowerCase();

    return tokens.every((token) => searchableText.includes(token));
  }).slice(0, limit);
}

export const POPULAR_SEARCH_SUGGESTIONS = [
  'nmap -sS',
  'sqlmap --dbs',
  'hydra ssh',
  'find / -perm SUID',
  'tshark POST',
  'python port scanner',
  'steghide extract',
  'cisco packet tracer',
  'wireshark tcp stream',
  'hashcat md5',
  'john rockyou',
  'phirojshah piping',
];
