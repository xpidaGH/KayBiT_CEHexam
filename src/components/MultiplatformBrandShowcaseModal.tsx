import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Smartphone, 
  Globe, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  Sparkles,
  Shield
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface MultiplatformBrandShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiplatformBrandShowcaseModal: React.FC<MultiplatformBrandShowcaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activePlatformTab, setActivePlatformTab] = useState<'desktop' | 'mobile' | 'web'>('desktop');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tauriCliCommand = 'npm run tauri icon ./public/assets/kbt-logo-transparent.png';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500/20 to-yellow-500/20 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>KBT Multiplatform Brand & App Icon Showcase</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                  Vite • Tauri • Capacitor
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing the tech-styled cyber spider icon across Desktop Title Bars, Mobile App Bars & Web Headers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 gap-2">
          <button
            onClick={() => setActivePlatformTab('desktop')}
            className={`py-3 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all ${
              activePlatformTab === 'desktop'
                ? 'border-lime-400 text-lime-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop Title Bars (Windows / macOS)</span>
          </button>

          <button
            onClick={() => setActivePlatformTab('mobile')}
            className={`py-3 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all ${
              activePlatformTab === 'mobile'
                ? 'border-lime-400 text-lime-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile App Bars (iOS / Android)</span>
          </button>

          <button
            onClick={() => setActivePlatformTab('web')}
            className={`py-3 px-4 border-b-2 text-xs font-semibold flex items-center gap-2 transition-all ${
              activePlatformTab === 'web'
                ? 'border-lime-400 text-lime-400 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Web Header Bars (Browsers / PWA)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: DESKTOP TITLE BARS */}
          {activePlatformTab === 'desktop' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-300 leading-relaxed">
                Desktop Tauri title bars require resized 16px - 24px icon assets with crisp edges to fit within standard 32px OS window chrome on Windows 11 and macOS Sequoia.
              </div>

              {/* 1. macOS Window Mockup */}
              <div className="rounded-xl border border-slate-700/80 overflow-hidden shadow-2xl bg-slate-950">
                {/* macOS Title Bar */}
                <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 justify-between">
                  {/* Traffic lights */}
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  {/* Title & App Icon */}
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                    <BrandLogo variant="desktop-titlebar" showText={false} />
                    <span className="font-semibold text-slate-200">KayBiT_CEHexam — v13 Ready (macOS Universal)</span>
                  </div>
                  <div className="w-14" />
                </div>
                {/* Content preview */}
                <div className="p-4 bg-slate-950/80 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>[Tauri v2 Native macOS Window Frame]</span>
                  <span className="text-emerald-400">x86_64 + arm64 Universal Binary</span>
                </div>
              </div>

              {/* 2. Windows 11 Window Mockup */}
              <div className="rounded-xl border border-slate-700/80 overflow-hidden shadow-2xl bg-slate-950">
                {/* Windows 11 Title Bar */}
                <div className="h-9 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 justify-between">
                  <div className="flex items-center gap-2">
                    <BrandLogo variant="desktop-titlebar" showText={false} />
                    <span className="font-mono text-xs text-slate-200">KayBiT_CEHexam Desktop</span>
                  </div>
                  {/* Windows Window Controls */}
                  <div className="flex items-center">
                    <span className="w-9 h-7 flex items-center justify-center hover:bg-zinc-800 text-slate-400 text-sm">─</span>
                    <span className="w-9 h-7 flex items-center justify-center hover:bg-zinc-800 text-slate-400 text-xs">□</span>
                    <span className="w-9 h-7 flex items-center justify-center hover:bg-rose-600 hover:text-white text-slate-400 text-xs">✕</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-950/80 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>[Tauri v2 Native Windows 11 WiX / NSIS Frame]</span>
                  <span className="text-teal-400">Windows x64 .msi / .exe</span>
                </div>
              </div>

              {/* Tauri Icon CLI Generator Guide */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Generate all desktop icon sizes (.ico & .icns):</span>
                  <button
                    onClick={() => handleCopy(tauriCliCommand, 'tauri-cmd')}
                    className="flex items-center gap-1 text-[11px] text-lime-400 hover:text-lime-300 font-mono"
                  >
                    {copiedCode === 'tauri-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'tauri-cmd' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-black text-lime-400 font-mono text-xs overflow-x-auto">
                  {tauriCliCommand}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE APP BARS */}
          {activePlatformTab === 'mobile' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-300 leading-relaxed">
                On mobile devices (iOS / Android Capacitor builds), the brand icon utilizes an authentic continuous squircle mask with tailored 32px - 36px bounding dimensions.
              </div>

              {/* Mobile Phone Mockup */}
              <div className="max-w-sm mx-auto rounded-3xl border-2 border-slate-700 bg-slate-950 overflow-hidden shadow-2xl">
                {/* Status Bar */}
                <div className="h-6 bg-black flex items-center justify-between px-4 text-[10px] font-mono text-slate-400">
                  <span>9:41</span>
                  <div className="w-16 h-3 bg-zinc-800 rounded-full mx-auto" />
                  <span>5G 100%</span>
                </div>

                {/* Mobile Navigation Header */}
                <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BrandLogo variant="mobile-appbar" showText={false} />
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">KayBiT_CEHexam</h4>
                      <p className="text-[10px] text-lime-400">Mobile Hub • v13</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                    Pass 14/20
                  </span>
                </div>

                {/* Body mockup */}
                <div className="p-4 space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">The Big 3 Cheat Sheets</span>
                    <p className="text-[10px] text-slate-400 mt-1">Nmap, Wireshark & Hashcat practical commands optimized for mobile touch screens.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-200">Dark Web Blueprint</span>
                    <p className="text-[10px] text-slate-400 mt-1">Tor hidden services, PGP opsec, and breach monitoring.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEB HEADER BARS */}
          {activePlatformTab === 'web' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-300 leading-relaxed">
                In Web Browsers and PWAs, the brand logo sits prominently in the top sticky navbar, combining the glowing cyber spider squircle mask with responsive typography and version badges.
              </div>

              {/* Browser Mockup */}
              <div className="rounded-xl border border-slate-700/80 overflow-hidden shadow-2xl bg-slate-950">
                {/* Browser Tab Bar */}
                <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-t-lg border-t border-x border-zinc-700 text-[11px] text-slate-200">
                    <img src="/assets/kbt-logo-transparent.png" alt="favicon" className="w-3.5 h-3.5" />
                    <span>KayBiT_CEHexam Master Hub</span>
                  </div>
                </div>

                {/* Web Header Bar */}
                <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <BrandLogo variant="web-header" showText={true} />
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                      Web / PWA Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Standalone High-Res App Icon Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-28 h-28 bg-gradient-to-br from-zinc-900 to-black p-4 mask-squircle flex items-center justify-center border border-yellow-400/20 shrink-0 shadow-2xl">
                  <img 
                    src="/assets/kbt-logo-transparent.png" 
                    alt="KBT App Logo" 
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-bold text-sm text-white">Standalone 512x512 KBT App Logo Asset</h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    High-resolution vector-rendered transparent asset loaded from <code className="text-lime-400 font-mono">/assets/kbt-logo-transparent.png</code> with CSS squircle superellipse mask.
                  </p>
                  <a
                    href="/assets/kbt-logo-transparent.png"
                    download="kbt-logo-transparent.png"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Standalone Asset</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-lime-400 font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KBT Brand Integration Guide Compliant (CSS Squircle + Multiplatform Scaling)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
