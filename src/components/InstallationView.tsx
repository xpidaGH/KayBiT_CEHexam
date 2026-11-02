import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Cpu, 
  ExternalLink, 
  FileCode, 
  CheckCircle2,
  Server,
  Shield
} from 'lucide-react';
import { 
  NATIVE_PLATFORMS, 
  CONFIG_SNIPPETS, 
  DISTRIBUTION_TIERS, 
  NativePlatformPackage 
} from '../data/installationData';
import { PlatformSvgIcons } from '../data/svgIcons';
import { MultiplatformBrandShowcaseModal } from './MultiplatformBrandShowcaseModal';

export const InstallationView: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<NativePlatformPackage>(NATIVE_PLATFORMS[0]);
  const [activeSnippetTab, setActiveSnippetTab] = useState<keyof typeof CONFIG_SNIPPETS>('capacitorConfig');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isBrandShowcaseOpen, setIsBrandShowcaseOpen] = useState<boolean>(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderPlatformIcon = (id: string) => {
    switch (id) {
      case 'android':
        return <PlatformSvgIcons.Android className="w-5 h-5 text-emerald-400" />;
      case 'windows':
        return <PlatformSvgIcons.Windows className="w-5 h-5 text-teal-400" />;
      case 'macos':
        return <PlatformSvgIcons.Apple className="w-5 h-5 text-slate-200" />;
      case 'pwa':
        return <PlatformSvgIcons.PwaWeb className="w-5 h-5 text-cyan-400" />;
      default:
        return <Download className="w-5 h-5 text-emerald-400" />;
    }
  };

  const snippetTabs: { key: keyof typeof CONFIG_SNIPPETS; label: string; file: string }[] = [
    { key: 'capacitorConfig', label: 'Capacitor (Android/iOS)', file: 'capacitor.config.ts' },
    { key: 'tauriConfig', label: 'Tauri (Windows/macOS)', file: 'tauri.conf.json' },
    { key: 'githubActions', label: 'CI/CD Pipeline', file: 'release-builds.yml' },
    { key: 'webManifest', label: 'PWA Web Manifest', file: 'manifest.webmanifest' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Download className="w-3.5 h-3.5" />
          Cross-Platform Native Packaging & Distribution
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Deploy KayBiT_CEHexam to Every Student Device
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Package this unified Vite + React TypeScript codebase into standalone native binaries for 
          <strong> Android (.apk/.aab)</strong>, <strong>Windows (.exe/.msi)</strong>, <strong>macOS (.dmg Universal)</strong>, <strong>Linux (.AppImage/.deb)</strong>, or instant <strong>Progressive Web App (PWA)</strong> with 100% offline access.
        </p>

        {/* Action shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            id="btn-installation-showcase"
            onClick={() => setIsBrandShowcaseOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border border-lime-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>KBT App Icon & Brand Specifications (Desktop, Mobile, Web)</span>
          </button>

          <a
            href="/GitHub_Actions.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-all shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-teal-400" />
            <span>View GitHub_Actions.md CI/CD Guide</span>
          </a>
        </div>
      </div>

      {/* Target Platforms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NATIVE_PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform.id === platform.id;
          return (
            <button
              key={platform.id}
              id={`btn-platform-${platform.id}`}
              onClick={() => setSelectedPlatform(platform)}
              className={`p-5 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {renderPlatformIcon(platform.id)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {platform.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{platform.name}</h3>
                <span className="text-xs font-mono text-teal-400 block mb-2">{platform.fileExtension}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{platform.description}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Platform Detail Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              {renderPlatformIcon(selectedPlatform.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{selectedPlatform.name}</h2>
                <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {selectedPlatform.wrapperFramework}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Target Output: {selectedPlatform.distributionPath}</p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {selectedPlatform.description}
        </p>

        {/* Requirements & Build Command */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Prerequisites & Build Tools
            </h4>
            <ul className="space-y-1.5">
              {selectedPlatform.requirements.map((req, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Terminal Build Command
              </h4>
              <button
                onClick={() => handleCopy(selectedPlatform.commandQuickstart, selectedPlatform.id)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {copiedKey === selectedPlatform.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === selectedPlatform.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="block p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-emerald-300 break-all border border-slate-800">
              {selectedPlatform.commandQuickstart}
            </code>
          </div>
        </div>
      </div>

      {/* Concrete Configuration Snippets Tabs */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Concrete Configuration Templates</h3>
            <p className="text-xs text-slate-400">Ready-to-use configuration files for your project root.</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {snippetTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSnippetTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeSnippetTab === tab.key
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
                }`}
              >
                {tab.file}
              </button>
            ))}
          </div>
        </div>

        {/* Code Box */}
        <div className="relative">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 rounded-t-xl border border-b-0 border-slate-800 text-xs text-slate-400 font-mono">
            <span>{snippetTabs.find((t) => t.key === activeSnippetTab)?.file}</span>
            <button
              id="btn-copy-config-snippet"
              onClick={() => handleCopy(CONFIG_SNIPPETS[activeSnippetTab], activeSnippetTab)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              {copiedKey === activeSnippetTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Configuration</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-b-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed max-h-96">
            {CONFIG_SNIPPETS[activeSnippetTab]}
          </pre>
        </div>
      </div>

      {/* Hosting & Distribution Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DISTRIBUTION_TIERS.map((tier, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">{tier.title}</h4>
            </div>
            <p className="text-xs text-slate-400">{tier.summary}</p>
            <ul className="space-y-1.5 pt-1">
              {tier.steps.map((st, sIdx) => (
                <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Multiplatform Brand Logo & App Icon Showcase Modal */}
      <MultiplatformBrandShowcaseModal
        isOpen={isBrandShowcaseOpen}
        onClose={() => setIsBrandShowcaseOpen(false)}
      />
    </div>
  );
};

