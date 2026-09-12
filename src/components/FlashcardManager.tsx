import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Tag, 
  Code, 
  HelpCircle,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Flashcard } from '../types';
import { FLASHCARD_CATEGORIES } from '../data/flashcardsData';

interface FlashcardManagerProps {
  cards: Flashcard[];
  onOpenCreateModal: (domainId?: string) => void;
  onEditCard: (card: Flashcard) => void;
  onDeleteCard: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onResetToDefaults: () => void;
  onImportCards: (cards: Flashcard[]) => void;
}

export const FlashcardManager: React.FC<FlashcardManagerProps> = ({
  cards,
  onOpenCreateModal,
  onEditCard,
  onDeleteCard,
  onToggleMastered,
  onResetToDefaults,
  onImportCards,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unmastered' | 'mastered' | 'custom'>('all');
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);

  // Toggle card preview expand
  const toggleExpand = (id: string) => {
    setExpandedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered cards
  const filteredCards = cards.filter(card => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuestion = card.question.toLowerCase().includes(q);
      const matchAnswer = card.answer.toLowerCase().includes(q);
      const matchTags = card.tags?.some(t => t.toLowerCase().includes(q));
      const matchCode = card.codeSnippet?.toLowerCase().includes(q);
      const matchExp = card.explanation?.toLowerCase().includes(q);

      if (!matchQuestion && !matchAnswer && !matchTags && !matchCode && !matchExp) {
        return false;
      }
    }

    // Category
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'custom') {
        if (!card.isCustom) return false;
      } else if (card.domainId !== categoryFilter) {
        return false;
      }
    }

    // Status
    if (statusFilter === 'unmastered' && card.isMastered) return false;
    if (statusFilter === 'mastered' && !card.isMastered) return false;
    if (statusFilter === 'custom' && !card.isCustom) return false;

    return true;
  });

  // Export cards as JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ceh_study_flashcards_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import cards from JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Validate structure
          const validCards: Flashcard[] = parsed.filter((item: any) => item.question && item.answer).map((item: any) => ({
            id: item.id || `fc-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            domainId: item.domainId || 'domain-2',
            category: item.category || 'Custom Study Card',
            question: String(item.question),
            answer: String(item.answer),
            explanation: item.explanation ? String(item.explanation) : undefined,
            hint: item.hint ? String(item.hint) : undefined,
            codeSnippet: item.codeSnippet ? String(item.codeSnippet) : undefined,
            tags: Array.isArray(item.tags) ? item.tags : undefined,
            isMastered: Boolean(item.isMastered),
            reviewCount: Number(item.reviewCount) || 0,
            createdAt: item.createdAt || new Date().toISOString(),
            isCustom: true
          }));

          if (validCards.length > 0) {
            onImportCards(validCards);
            setImportStatusMessage(`Successfully imported ${validCards.length} study flashcards!`);
            setTimeout(() => setImportStatusMessage(null), 3000);
          } else {
            alert('No valid flashcards found in the selected JSON file.');
          }
        } else {
          alert('Invalid format: JSON file must contain an array of flashcard objects.');
        }
      } catch (err) {
        alert('Failed to parse JSON file. Please ensure valid JSON formatting.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls & Actions */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Card Library & Study Management</span>
            </h3>
            <p className="text-xs text-slate-400">
              Create, edit, search, and export your personal collection of CEH domain study cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-create-card-header"
              type="button"
              onClick={() => onOpenCreateModal(categoryFilter)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Flashcard</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Export all cards as JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>

            <label 
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Import cards from JSON backup"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import JSON</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportFile} 
                className="hidden" 
              />
            </label>

            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs border border-slate-700 transition-colors"
              title="Restore standard CEH blueprint card set"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Defaults</span>
            </button>
          </div>
        </div>

        {importStatusMessage && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{importStatusMessage}</span>
          </div>
        )}

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-cards"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search cards, concepts, commands, or tags..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-xs transition-colors"
            />
          </div>

          {/* Domain Category Filter */}
          <div className="sm:col-span-4">
            <select
              id="filter-category-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="all">All Domains ({cards.length})</option>
              {FLASHCARD_CATEGORIES.filter(c => c.id !== 'all').map(cat => {
                const count = cards.filter(c => 
                  cat.id === 'custom' ? c.isCustom : c.domainId === cat.id
                ).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.shortName} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="unmastered">Needs Review ({cards.filter(c => !c.isMastered).length})</option>
              <option value="mastered">Mastered ({cards.filter(c => c.isMastered).length})</option>
              <option value="custom">Custom Cards Only ({cards.filter(c => c.isCustom).length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting to Defaults */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="font-bold text-sm">Restore CEH Default Flashcards?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset the flashcard collection to the default 25+ curated CEH v13 blueprint cards and reset study mastery flags. Any custom cards will be preserved if possible.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetToDefaults();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                Confirm Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Grid / List */}
      {filteredCards.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <Layers className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No flashcards match your current filter.</p>
          <p className="text-xs text-slate-500">Try clearing the search query or changing the category filter.</p>
          <button
            onClick={() => onOpenCreateModal(categoryFilter)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 mt-2"
          >
            Create New Card Here
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredCards.length} flashcard{filteredCards.length !== 1 ? 's' : ''}</span>
            <span>Click card to expand preview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCards.map(card => {
              const isExpanded = expandedCardIds[card.id];
              const isConfirmingDelete = confirmDeleteId === card.id;

              return (
                <div
                  key={card.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    card.isMastered
                      ? 'bg-slate-900/90 border-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 font-mono text-[11px] font-semibold">
                          {card.category}
                        </span>
                        {card.isCustom && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-medium">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onToggleMastered(card.id)}
                          className={`p-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                            card.isMastered 
                              ? 'text-emerald-400 hover:text-emerald-300' 
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={card.isMastered ? "Mastered (Click to unmark)" : "Mark as Mastered"}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[11px] hidden sm:inline">
                            {card.isMastered ? 'Mastered' : 'Review'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Question (Front) */}
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {card.question}
                    </h4>

                    {/* Tags */}
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-500" />
                        {card.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expandable Preview Section */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-3">
                    {/* Collapsible Answer & Technical Details */}
                    {isExpanded ? (
                      <div className="space-y-2 text-xs animate-fadeIn">
                        <div>
                          <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                            Key Takeaway / Answer:
                          </span>
                          <p className="text-slate-200 mt-0.5 leading-relaxed font-medium">
                            {card.answer}
                          </p>
                        </div>

                        {card.explanation && (
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300 text-[11px] leading-relaxed">
                            <span className="font-semibold text-slate-400">Technical Context: </span>
                            {card.explanation}
                          </div>
                        )}

                        {card.codeSnippet && (
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                            {card.codeSnippet}
                          </div>
                        )}

                        {card.hint && (
                          <div className="text-[11px] text-amber-400 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            <span><strong>Hint:</strong> {card.hint}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {card.answer}
                      </p>
                    )}

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleExpand(card.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{isExpanded ? 'Collapse' : 'Inspect Full Answer'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEditCard(card)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit flashcard"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/30">
                            <span className="text-[11px] text-rose-400">Delete?</span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteCard(card.id);
                                setConfirmDeleteId(null);
                              }}
                              className="text-[11px] font-bold text-rose-300 hover:text-white px-1"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[11px] text-slate-400 hover:text-white px-1"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(card.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete flashcard"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
