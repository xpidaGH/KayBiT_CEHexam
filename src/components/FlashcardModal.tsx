import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Sparkles, 
  AlertCircle, 
  Code, 
  HelpCircle,
  Image as ImageIcon,
  Wand2,
  RefreshCw,
  Trash2,
  Lightbulb
} from 'lucide-react';
import { Flashcard } from '../types';
import { FLASHCARD_CATEGORIES } from '../data/flashcardsData';
import { DEFAULT_MNEMONIC_PROMPT_PRESETS } from '../data/mnemonicVisualsData';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<Flashcard, 'id' | 'createdAt'> & { id?: string }) => void;
  editingCard?: Flashcard | null;
  defaultDomainId?: string;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCard,
  defaultDomainId = 'domain-2'
}) => {
  const [domainId, setDomainId] = useState<string>(defaultDomainId);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Imagen Mnemonic Visual Aid State
  const [mnemonicVisualUrl, setMnemonicVisualUrl] = useState<string>('');
  const [mnemonicPrompt, setMnemonicPrompt] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageGenerationError, setImageGenerationError] = useState<string>('');

  useEffect(() => {
    if (editingCard) {
      setDomainId(editingCard.domainId || 'domain-2');
      setQuestion(editingCard.question || '');
      setAnswer(editingCard.answer || '');
      setExplanation(editingCard.explanation || '');
      setHint(editingCard.hint || '');
      setCodeSnippet(editingCard.codeSnippet || '');
      setTagsInput(editingCard.tags ? editingCard.tags.join(', ') : '');
      setMnemonicVisualUrl(editingCard.mnemonicVisualUrl || '');
      setMnemonicPrompt(editingCard.mnemonicPrompt || '');
      setError('');
      setImageGenerationError('');
    } else {
      setDomainId(defaultDomainId === 'all' || defaultDomainId === 'custom' ? 'domain-2' : defaultDomainId);
      setQuestion('');
      setAnswer('');
      setExplanation('');
      setHint('');
      setCodeSnippet('');
      setTagsInput('');
      setMnemonicVisualUrl('');
      setMnemonicPrompt('');
      setError('');
      setImageGenerationError('');
    }
  }, [editingCard, defaultDomainId, isOpen]);

  if (!isOpen) return null;

  const handleGenerateMnemonic = async (presetConcept?: string) => {
    const conceptToUse = (presetConcept || mnemonicPrompt.trim() || question.trim() || answer.trim());
    if (!conceptToUse) {
      setImageGenerationError('Please enter a question, concept or prompt before generating a visual aid.');
      return;
    }

    setIsGeneratingImage(true);
    setImageGenerationError('');

    try {
      const selectedCat = FLASHCARD_CATEGORIES.find(c => c.id === domainId);
      const categoryName = selectedCat ? selectedCat.name : 'Cybersecurity';

      const res = await fetch('/api/generate-mnemonic-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: conceptToUse,
          category: categoryName,
          question: question.trim(),
          answer: answer.trim()
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.imageUrl) {
        setMnemonicVisualUrl(data.imageUrl);
        setMnemonicPrompt(conceptToUse);
      } else {
        throw new Error(data.error || 'Failed to generate visual aid');
      }
    } catch (err) {
      setImageGenerationError((err as Error).message || 'Visual aid generation failed. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRemoveVisualAid = () => {
    setMnemonicVisualUrl('');
    setMnemonicPrompt('');
    setImageGenerationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please provide the question / front of the flashcard.');
      return;
    }
    if (!answer.trim()) {
      setError('Please provide the answer / key takeaway for the back.');
      return;
    }

    const selectedCat = FLASHCARD_CATEGORIES.find(c => c.id === domainId);
    const categoryName = selectedCat ? selectedCat.name : 'Custom Study Card';

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave({
      id: editingCard?.id,
      domainId,
      category: categoryName,
      question: question.trim(),
      answer: answer.trim(),
      explanation: explanation.trim() || undefined,
      hint: hint.trim() || undefined,
      codeSnippet: codeSnippet.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      mnemonicVisualUrl: mnemonicVisualUrl || undefined,
      mnemonicPrompt: mnemonicPrompt || undefined,
      isMastered: editingCard?.isMastered || false,
      reviewCount: editingCard?.reviewCount || 0,
      isCustom: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-100 space-y-5 my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              {editingCard ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {editingCard ? 'Edit Study Flashcard' : 'Create Custom Flashcard'}
              </h3>
              <p className="text-xs text-slate-400">
                Saves directly to your browser's persistent local storage.
              </p>
            </div>
          </div>
          <button
            id="btn-close-flashcard-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Exam Domain Category
            </label>
            <select
              id="select-card-domain"
              value={domainId}
              onChange={e => setDomainId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {FLASHCARD_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.domainNumber ? `Domain ${cat.domainNumber}: ${cat.name}` : cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question (Front) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Card Front (Question / Prompt) *</span>
              <span className="text-[11px] text-slate-500 font-normal">Required</span>
            </label>
            <textarea
              id="input-card-question"
              rows={3}
              value={question}
              onChange={e => {
                setQuestion(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., How does an Nmap TCP SYN scan (-sS) operate and why is it considered stealthy?"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Answer (Back) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Card Back (Core Answer & Key Takeaway) *</span>
              <span className="text-[11px] text-slate-500 font-normal">Required</span>
            </label>
            <textarea
              id="input-card-answer"
              rows={3}
              value={answer}
              onChange={e => {
                setAnswer(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Scanner sends SYN; target returns SYN/ACK; scanner immediately responds with RST to avoid completing 3-way handshake..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              required
            />
          </div>

          {/* Technical Deep Dive Explanation (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Technical Deep Dive / Exam Reference (Optional)</span>
            </label>
            <textarea
              id="input-card-explanation"
              rows={2}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="Detailed architectural nuances, RFC references, or real-world exploitation impact..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-xs"
            />
          </div>

          {/* Code Snippet / CLI Commands (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>CLI Command or Code Snippet (Optional)</span>
            </label>
            <textarea
              id="input-card-code"
              rows={2}
              value={codeSnippet}
              onChange={e => setCodeSnippet(e.target.value)}
              placeholder="e.g., nmap -sS -p- -T4 192.168.1.10 -oN scan.txt"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-xs"
            />
          </div>

          {/* Imagen Mnemonic Visual Aid Generator */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">AI Mnemonic Visual Aid</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-medium border border-indigo-500/30">
                      Imagen 3
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Generate an unforgettable visual metaphor to anchor this security concept in your memory.
                  </p>
                </div>
              </div>

              {mnemonicVisualUrl && (
                <button
                  type="button"
                  onClick={handleRemoveVisualAid}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                  title="Remove visual aid"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Quick concept preset buttons */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1.5">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Quick CEH Mnemonic Ideas:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_MNEMONIC_PROMPT_PRESETS.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => {
                      setMnemonicPrompt(idea);
                      handleGenerateMnemonic(idea);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors text-left"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Input & Trigger */}
            <div className="flex gap-2">
              <input
                id="input-card-mnemonic-prompt"
                type="text"
                value={mnemonicPrompt}
                onChange={e => setMnemonicPrompt(e.target.value)}
                placeholder="Visual concept or prompt (leave blank to derive from card question)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition-colors"
              />
              <button
                id="btn-generate-mnemonic-aid"
                type="button"
                onClick={() => handleGenerateMnemonic()}
                disabled={isGeneratingImage}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:pointer-events-none shrink-0"
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{mnemonicVisualUrl ? 'Regenerate' : 'Generate Aid'}</span>
                  </>
                )}
              </button>
            </div>

            {imageGenerationError && (
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span>{imageGenerationError}</span>
              </div>
            )}

            {/* Live Visual Preview */}
            {mnemonicVisualUrl && (
              <div className="relative rounded-xl overflow-hidden border border-indigo-500/40 bg-slate-950 p-2 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center relative group">
                  <img
                    src={mnemonicVisualUrl}
                    alt={mnemonicPrompt || 'Mnemonic Visual Aid'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-semibold">Attached to Card</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-left">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Visual Aid Ready
                  </span>
                  <p className="text-slate-200 font-medium line-clamp-2">
                    {mnemonicPrompt || question || 'Mnemonic Memory Anchor'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Will appear automatically in study mode to reinforce neurological recall during flashcard reviews.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Two-column: Hint & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Memory Hint (Optional)</span>
              </label>
              <input
                id="input-card-hint"
                type="text"
                value={hint}
                onChange={e => setHint(e.target.value)}
                placeholder="e.g. Half-open connection (RST flag)"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Tags (Comma Separated)
              </label>
              <input
                id="input-card-tags"
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="e.g. Nmap, Scanning, RFC 793"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              id="btn-cancel-card-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-save-card"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{editingCard ? 'Update Card' : 'Save Flashcard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
