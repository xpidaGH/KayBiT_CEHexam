import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

export type BrandLogoVariant = 'web-header' | 'desktop-titlebar' | 'mobile-appbar' | 'app-icon' | 'badge';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  showText?: boolean;
  versionBadge?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'web-header',
  className = '',
  showText = true,
  versionBadge = 'v13 Ready',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Logo source (placed in public/assets/kbt-logo-transparent.png per KBT integration guide)
  const logoSrc = '/assets/kbt-logo-transparent.png';

  // Sizing and styling based on platform target
  const getContainerStyle = () => {
    switch (variant) {
      case 'desktop-titlebar':
        return 'w-6 h-6 rounded-md p-0.5 bg-gradient-to-br from-zinc-900 to-black border border-lime-400/30 shadow-sm';
      case 'mobile-appbar':
        return 'w-8 h-8 rounded-lg p-1 bg-gradient-to-br from-zinc-900 to-black mask-squircle border border-lime-400/40 shadow-md';
      case 'app-icon':
        return 'w-24 h-24 p-3 bg-gradient-to-br from-zinc-900 to-black mask-squircle border border-yellow-400/30 shadow-xl';
      case 'badge':
        return 'w-5 h-5 rounded p-0.5 bg-zinc-900 border border-lime-500/30';
      case 'web-header':
      default:
        return 'w-10 h-10 rounded-xl p-1 bg-gradient-to-br from-zinc-900 via-slate-950 to-black mask-squircle border border-lime-400/30 shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform';
    }
  };

  const getImageStyle = () => {
    switch (variant) {
      case 'desktop-titlebar':
        return 'w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(163,230,53,0.4)]';
      case 'mobile-appbar':
        return 'w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(163,230,53,0.5)]';
      case 'app-icon':
        return 'w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(163,230,53,0.6)]';
      case 'badge':
        return 'w-full h-full object-contain';
      case 'web-header':
      default:
        return 'w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]';
    }
  };

  return (
    <div 
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`relative flex items-center justify-center shrink-0 ${getContainerStyle()}`}>
        {!imageError ? (
          <img 
            src={logoSrc} 
            alt="KBT App Logo" 
            onError={() => setImageError(true)}
            className={getImageStyle()}
          />
        ) : (
          <Terminal className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
        )}
      </div>

      {showText && variant === 'web-header' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base sm:text-lg tracking-tight text-slate-100 font-mono">
              KayBiT<span className="text-emerald-400">_CEHexam</span>
            </span>
            {versionBadge && (
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {versionBadge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            CEH Written & Practical Master Hub
          </p>
        </div>
      )}

      {showText && variant === 'desktop-titlebar' && (
        <span className="font-mono text-xs font-semibold text-slate-200">
          KayBiT_CEHexam
        </span>
      )}

      {showText && variant === 'mobile-appbar' && (
        <span className="font-mono text-sm font-bold text-slate-100">
          KayBiT CEH
        </span>
      )}
    </div>
  );
};
