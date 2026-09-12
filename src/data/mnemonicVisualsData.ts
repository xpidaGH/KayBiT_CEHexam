/**
 * Structured Mnemonic Visual Aids & Pre-Rendered Vector Assets
 * Centralized store for CEH v13 visual anchors, memory prompts, and SVG templates.
 */

export const DEFAULT_MNEMONIC_PROMPT_PRESETS = [
  'TCP SYN Stealth Ghost Handshake',
  'Diffie-Hellman Color Mixing Key Exchange',
  'Buffer Overflow Cup Memory Spill',
  'SQL Injection Malicious Cargo',
  'Tor Onion Layered Encryption',
  'ARP Poisoning Impersonator Mask',
  'Lockheed Cyber Kill Chain 7 Links',
  'Docker Socket Escape Root Mount'
] as const;

/**
 * Utility to encode raw SVG into clean, URL-safe data URIs
 */
export function createSvgDataUrl(svgMarkup: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup.trim())}`;
}

export const RAW_MNEMONIC_SVGS = {
  // Domain 1: Pen-Test Visibility Vaults
  penTestVaults: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#090d16"/>
        <stop offset="100%" stop-color="#111827"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#bg)" rx="16"/>
    <rect x="40" y="80" width="150" height="240" rx="14" fill="#050811" stroke="#334155" stroke-width="3"/>
    <rect x="225" y="80" width="150" height="240" rx="14" fill="#1e293b" fill-opacity="0.8" stroke="#64748b" stroke-width="3"/>
    <rect x="410" y="80" width="150" height="240" rx="14" fill="#064e3b" fill-opacity="0.4" stroke="#10b981" stroke-width="3"/>
    <text x="115" y="140" fill="#64748b" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">?</text>
    <text x="115" y="200" fill="#94a3b8" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">BLACK BOX</text>
    <text x="115" y="230" fill="#64748b" font-family="sans-serif" font-size="11" text-anchor="middle">Zero Prior Intel</text>
    <text x="300" y="140" fill="#94a3b8" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">&#9881;</text>
    <text x="300" y="200" fill="#cbd5e1" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">GRAY BOX</text>
    <text x="300" y="230" fill="#94a3b8" font-family="sans-serif" font-size="11" text-anchor="middle">Partial Insider</text>
    <text x="485" y="140" fill="#10b981" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">&#9672;</text>
    <text x="485" y="200" fill="#34d399" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">WHITE BOX</text>
    <text x="485" y="230" fill="#6ee7b7" font-family="sans-serif" font-size="11" text-anchor="middle">Full Code &amp; Architecture</text>
    <text x="300" y="45" fill="#f8fafc" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">MNEMONIC: PEN-TEST VISIBILITY VAULTS</text>
  </svg>`,

  // Domain 2: TCP SYN Stealth Ghost Handshake
  tcpSynGhost: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0b0f19"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#bg2)" rx="16"/>
    <circle cx="120" cy="180" r="50" fill="#312e81" stroke="#818cf8" stroke-width="3"/>
    <text x="120" y="185" fill="#e0e7ff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">SCANNER</text>
    <circle cx="480" cy="180" r="50" fill="#064e3b" stroke="#10b981" stroke-width="3"/>
    <text x="480" y="185" fill="#d1fae5" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">TARGET</text>
    <line x1="180" y1="140" x2="420" y2="140" stroke="#6366f1" stroke-width="3" stroke-dasharray="6,4"/>
    <polygon points="415,135 425,140 415,145" fill="#6366f1"/>
    <text x="300" y="130" fill="#a5b4fc" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">1. SYN [Handshake Initiated]</text>
    <line x1="420" y1="180" x2="180" y2="180" stroke="#10b981" stroke-width="3" stroke-dasharray="6,4"/>
    <polygon points="185,175 175,180 185,185" fill="#10b981"/>
    <text x="300" y="170" fill="#6ee7b7" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">2. SYN / ACK [Port Is Open]</text>
    <line x1="180" y1="220" x2="420" y2="220" stroke="#f43f5e" stroke-width="4"/>
    <polygon points="415,215 425,220 415,225" fill="#f43f5e"/>
    <text x="300" y="245" fill="#fda4af" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">3. RST [GHOST RESET - NEVER SENDS ACK]</text>
    <rect x="150" y="300" width="300" height="45" rx="8" fill="#0f172a" stroke="#e11d48" stroke-width="2"/>
    <text x="300" y="328" fill="#f43f5e" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">MNEMONIC: HALF-OPEN GHOST TEAR-DOWN</text>
  </svg>`,

  // Domain 9: Diffie-Hellman Color Mixing
  diffieHellmanColorMix: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="dhBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0c101c"/>
        <stop offset="100%" stop-color="#1a142e"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#dhBg)" rx="16"/>
    <text x="300" y="45" fill="#f8fafc" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">MNEMONIC: DIFFIE-HELLMAN COLOR MIXING</text>
    <circle cx="120" cy="120" r="36" fill="#f59e0b" stroke="#fbbf24" stroke-width="2"/>
    <text x="120" y="125" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">ALICE SECRET</text>
    <circle cx="300" cy="120" r="36" fill="#06b6d4" stroke="#22d3ee" stroke-width="2"/>
    <text x="300" y="125" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">COMMON BASE</text>
    <circle cx="480" cy="120" r="36" fill="#ec4899" stroke="#f472b6" stroke-width="2"/>
    <text x="480" y="125" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">BOB SECRET</text>
    <circle cx="210" cy="240" r="40" fill="#10b981" stroke="#34d399" stroke-width="3"/>
    <text x="210" y="245" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">PUBLIC MIX A</text>
    <circle cx="390" cy="240" r="40" fill="#8b5cf6" stroke="#a78bfa" stroke-width="3"/>
    <text x="390" y="245" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">PUBLIC MIX B</text>
    <circle cx="300" cy="330" r="44" fill="#6366f1" stroke="#818cf8" stroke-width="4"/>
    <text x="300" y="335" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">SHARED SECRET</text>
  </svg>`
};

/**
 * Pre-compiled data URIs ready for instant image rendering without network delays
 */
export const DEFAULT_MNEMONIC_SVGS = {
  penTestVaults: createSvgDataUrl(RAW_MNEMONIC_SVGS.penTestVaults),
  tcpSynGhost: createSvgDataUrl(RAW_MNEMONIC_SVGS.tcpSynGhost),
  diffieHellmanColorMix: createSvgDataUrl(RAW_MNEMONIC_SVGS.diffieHellmanColorMix)
};
