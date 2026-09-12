import React, { useState, useEffect } from 'react';
import { CheckCircle2, CloudCheck } from 'lucide-react';

interface AutoSaveDetail {
  label?: string;
  timestamp?: number;
}

export const AutoSaveToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [sourceLabel, setSourceLabel] = useState('Content');

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    const handleAutoSaveEvent = (e: Event) => {
      const customEvent = e as CustomEvent<AutoSaveDetail>;
      const label = customEvent.detail?.label || 'Content';
      setSourceLabel(label);
      setVisible(true);

      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        setVisible(false);
      }, 1800);
    };

    window.addEventListener('kaybit-autosave', handleAutoSaveEvent);
    return () => {
      window.removeEventListener('kaybit-autosave', handleAutoSaveEvent);
      clearTimeout(hideTimeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="auto-save-toast-indicator"
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/95 text-slate-200 border border-emerald-500/40 shadow-xl shadow-slate-950/80 text-xs font-mono backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 select-none pointer-events-none"
    >
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
        <CloudCheck className="w-3.5 h-3.5" />
        <span>Auto-saved</span>
      </span>
      <span className="text-slate-500 text-[10px]">•</span>
      <span className="text-slate-300 text-[11px] truncate max-w-[160px]">{sourceLabel}</span>
    </div>
  );
};
