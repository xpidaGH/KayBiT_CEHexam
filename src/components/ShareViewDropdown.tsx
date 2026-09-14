import React, { useState, useEffect, useRef } from 'react';
import { Share2, Copy, Check, QrCode, ExternalLink, X, Smartphone, Globe } from 'lucide-react';
import QRCode from 'qrcode';
import { ExamTab } from '../types';
import { NAV_ITEMS_CONFIG } from '../data/appConfig';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';

interface ShareViewDropdownProps {
  activeTab: ExamTab;
}

export const ShareViewDropdown: React.FC<ShareViewDropdownProps> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQrCode, setShowQrCode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeNav = NAV_ITEMS_CONFIG.find((item) => item.id === activeTab);
  const currentTabName = activeNav?.label || activeTab;

  // Build current view URL
  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    return url.toString();
  };

  const shareUrl = getShareUrl();

  // Generate QR code when dropdown opens or active tab changes
  useEffect(() => {
    if (isOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 180,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(''));
    }
  }, [isOpen, shareUrl, activeTab]);

  // Handle outside click & Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      triggerAutoSaveToast('Share link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyMarkdown = async () => {
    const markdown = `[KayBiT CEH v13 Blueprint - ${currentTabName}](${shareUrl})`;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedMarkdown(true);
      triggerAutoSaveToast('Markdown link copied!');
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        id="btn-context-share-view"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Share current study view (Copy link or scan QR code)"
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all group ${
          isOpen
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border-slate-700/70'
        }`}
      >
        <Share2 className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {isOpen && (
        <div
          id="popover-share-view"
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-fadeIn space-y-3.5 backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Share Current View</h4>
                <p className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                  Tab: {currentTabName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close share popover"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Copy Link Bar */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Direct Tab Link
            </span>
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-slate-300 font-mono text-[10px] w-full px-1 focus:outline-none truncate"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                id="btn-copy-share-url"
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold shrink-0 transition-colors"
                title="Copy URL"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Markdown Link Option */}
          <button
            id="btn-copy-share-markdown"
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 hover:text-white transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>Copy as Markdown Citation</span>
            </div>
            {copiedMarkdown ? (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Done
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-400">
                [title](url)
              </span>
            )}
          </button>

          {/* QR Code Section for Mobile Viewing */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              id="btn-toggle-share-qr"
              onClick={() => setShowQrCode((prev) => !prev)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-[11px] text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">Mobile QR Code View</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                {showQrCode ? 'Hide QR' : 'Show QR'}
              </span>
            </button>

            {showQrCode && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-2 animate-fadeIn">
                {qrDataUrl ? (
                  <div className="p-2 bg-white rounded-lg shadow-inner">
                    <img
                      src={qrDataUrl}
                      alt={`QR Code for ${currentTabName}`}
                      className="w-36 h-36 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center bg-slate-900 rounded-lg text-slate-500 text-xs font-mono">
                    Generating...
                  </div>
                )}
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Scan with your smartphone camera to jump directly to this tab on mobile.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
