import React, { useState } from 'react';
import { Bug, Copy, Check, X, Terminal, AlertTriangle, Send, ExternalLink, Shield } from 'lucide-react';
import { ExamTab } from '../types';
import { APP_CONFIG, STORAGE_KEYS } from '../data/appConfig';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ExamTab;
}

export const BugReportModal: React.FC<BugReportModalProps> = ({
  isOpen,
  onClose,
  activeTab,
}) => {
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [copiedReport, setCopiedReport] = useState(false);

  if (!isOpen) return null;

  const storageItemsCount = typeof window !== 'undefined' ? localStorage.length : 0;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const userAgent = typeof window !== 'undefined' ? navigator.userAgent : 'Unknown';
  const timestamp = new Date().toISOString();

  const generateDiagnosticMarkdown = () => {
    return `### CEH v13 Study Blueprint Bug Report
- **App Version:** ${APP_CONFIG.version}
- **Active Tab:** \`${activeTab}\`
- **Timestamp:** \`${timestamp}\`
- **Current URL:** \`${currentUrl}\`
- **Local Storage Keys Count:** \`${storageItemsCount}\`
- **User Agent:** \`${userAgent}\`

#### Issue Summary:
${issueTitle.trim() || 'Not specified'}

#### Steps to Reproduce / Details:
${issueDescription.trim() || 'No additional steps provided'}
`;
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(generateDiagnosticMarkdown());
      setCopiedReport(true);
      triggerAutoSaveToast('Diagnostic report copied to clipboard!');
      setTimeout(() => setCopiedReport(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    handleCopyReport();
    triggerAutoSaveToast('Bug report prepared! Copied markdown diagnostics.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 space-y-4 text-slate-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bug-report-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h3 id="bug-report-title" className="text-sm font-bold text-white">
                Developer Diagnostic & Bug Report
              </h3>
              <p className="text-xs text-slate-400">
                Generate an environment snapshot for rapid issue resolution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* System Diagnostics Snapshot Box */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 font-semibold border-b border-slate-900 pb-1">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Environment Context</span>
            </span>
            <span className="text-emerald-400">v{APP_CONFIG.version}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
            <div>
              <span className="text-slate-500">Active View: </span>
              <span className="text-emerald-300 font-bold">{activeTab}</span>
            </div>
            <div>
              <span className="text-slate-500">Storage Keys: </span>
              <span className="text-slate-200">{storageItemsCount} keys</span>
            </div>
            <div className="col-span-2 truncate">
              <span className="text-slate-500">Platform: </span>
              <span className="text-slate-400 text-[10px]">{userAgent.slice(0, 50)}...</span>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendReport} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Issue Summary
            </label>
            <input
              type="text"
              placeholder="e.g. Practical challenge flag not verifying on Safari..."
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reproduction Steps / Details
            </label>
            <textarea
              rows={3}
              placeholder="Describe what happened and what you expected to happen..."
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              id="btn-copy-bug-diagnostics"
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copiedReport ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Prepare & Copy</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
