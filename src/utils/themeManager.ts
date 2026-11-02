import { ThemeVariation, ThemeVariationId } from '../types';

export const THEME_STORAGE_KEY = 'kaybit_ceh_theme_variation';

export const THEME_VARIATIONS: ThemeVariation[] = [
  {
    id: 'editorial',
    name: 'Editorial & Refined',
    tagline: 'Scholarly & Distraction-Free',
    description: 'Serif typography with generous whitespace, crisp ink-like readability, and a clean off-white academic canvas.',
    fontCategory: 'Serif (Lora / Playfair)',
    aesthetic: 'Academic journal layout with subtle warm parchment surfaces and noble violet accents.',
    preview: {
      bg: '#faf9f6',
      surface: '#f3efe6',
      card: '#ffffff',
      border: '#e2ded4',
      accent: '#7c3aed',
      text: '#1c1917',
      badgeBg: '#f3e8ff',
      badgeText: '#7c3aed',
    },
  },
  {
    id: 'technical',
    name: 'Technical & Systematic',
    tagline: 'High-Density Cyber Grid',
    description: 'Monospace terminal typography, visible cybernetic grid borders, and dense information layout for security engineers.',
    fontCategory: 'Monospace (JetBrains Mono / Fira)',
    aesthetic: 'Matrix hacker console with high-density grid lines and electric terminal neon green.',
    preview: {
      bg: '#070b12',
      surface: '#0c121e',
      card: '#101828',
      border: '#1e3a5f',
      accent: '#00ff66',
      text: '#e2e8f0',
      badgeBg: 'rgba(0, 255, 102, 0.12)',
      badgeText: '#00ff66',
    },
  },
  {
    id: 'warm',
    name: 'Warm & Approachable',
    tagline: 'Gentle & Ergonomic Study Flow',
    description: 'Soft pastel cards, pill-shaped buttons, rounded contours, and calming warm tones to eliminate exam fatigue.',
    fontCategory: 'Rounded Sans (Plus Jakarta)',
    aesthetic: 'Comfortable study lounge with gentle amber glow, pill buttons, and soft cream surfaces.',
    preview: {
      bg: '#fdfaf6',
      surface: '#f6efe6',
      card: '#ffffff',
      border: '#ede1d1',
      accent: '#f97316',
      text: '#292524',
      badgeBg: '#ffedd5',
      badgeText: '#ea580c',
    },
  },
  {
    id: 'dark',
    name: 'Elegant Dark',
    tagline: 'Deep Pitch & Precision Accents',
    description: 'Sleek dark mode engineered with obsidian surfaces, tailored high-contrast borders, and vivid emerald indicators.',
    fontCategory: 'Modern Sans (Plus Jakarta / System)',
    aesthetic: 'Sleek stealth workstation with deep black glass, sharp contrast, and emerald laser highlights.',
    preview: {
      bg: '#030712',
      surface: '#0b0f19',
      card: '#0f172a',
      border: '#1e293b',
      accent: '#10b981',
      text: '#f8fafc',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeText: '#34d399',
    },
  },
  {
    id: 'vibrant',
    name: 'Vibrant Palette',
    tagline: 'Bold Cyber Neon & High Voltage',
    description: 'High-energy, high-saturation color scheme with electric magenta, cosmic violet, and luminous highlights.',
    fontCategory: 'Modern Sans (High Contrast)',
    aesthetic: 'Electric synthwave red team cockpit with neon gradients, magenta pulses, and vibrant badges.',
    preview: {
      bg: '#0c071e',
      surface: '#140d2f',
      card: '#1d1344',
      border: '#3b2575',
      accent: '#ec4899',
      text: '#fdf4ff',
      badgeBg: 'rgba(236, 72, 153, 0.15)',
      badgeText: '#f472b6',
    },
  },
];

export function getSavedTheme(): ThemeVariationId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && (saved === 'editorial' || saved === 'technical' || saved === 'warm' || saved === 'dark' || saved === 'vibrant')) {
      return saved as ThemeVariationId;
    }
  } catch {
    // ignore
  }
  return 'dark'; // default to Elegant Dark
}

export function applyTheme(themeId: ThemeVariationId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {
    // ignore
  }

  const root = document.documentElement;
  const theme = THEME_VARIATIONS.find(t => t.id === themeId) || THEME_VARIATIONS[3];

  // Set data attribute and class on root
  root.setAttribute('data-theme', themeId);
  root.classList.remove('theme-editorial', 'theme-technical', 'theme-warm', 'theme-dark', 'theme-vibrant');
  root.classList.add(`theme-${themeId}`);

  // Dynamically set CSS variables
  root.style.setProperty('--app-bg', theme.preview.bg);
  root.style.setProperty('--app-surface', theme.preview.surface);
  root.style.setProperty('--app-card', theme.preview.card);
  root.style.setProperty('--app-border', theme.preview.border);
  root.style.setProperty('--app-accent', theme.preview.accent);
  root.style.setProperty('--app-text-primary', theme.preview.text);

  if (themeId === 'editorial') {
    root.style.setProperty('--app-font-family', "'Lora', 'Playfair Display', Georgia, serif");
    root.style.setProperty('--app-radius', '0.5rem');
  } else if (themeId === 'technical') {
    root.style.setProperty('--app-font-family', "'JetBrains Mono', 'Fira Code', monospace");
    root.style.setProperty('--app-radius', '0.25rem');
  } else if (themeId === 'warm') {
    root.style.setProperty('--app-font-family', "'Plus Jakarta Sans', system-ui, sans-serif");
    root.style.setProperty('--app-radius', '1.25rem');
  } else if (themeId === 'vibrant') {
    root.style.setProperty('--app-font-family', "'Plus Jakarta Sans', system-ui, sans-serif");
    root.style.setProperty('--app-radius', '0.85rem');
  } else {
    root.style.setProperty('--app-font-family', "'Plus Jakarta Sans', system-ui, sans-serif");
    root.style.setProperty('--app-radius', '0.75rem');
  }

  // Dispatch change event
  window.dispatchEvent(new CustomEvent('theme-variation-changed', { detail: { themeId } }));
}
