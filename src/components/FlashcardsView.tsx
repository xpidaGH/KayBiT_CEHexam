import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Award, 
  RefreshCw,
  FolderDown,
  Brain,
  Zap,
  Target
} from 'lucide-react';
import { Flashcard } from '../types';
import { DEFAULT_CEH_FLASHCARDS, FLASHCARD_CATEGORIES } from '../data/flashcardsData';
import { STORAGE_KEYS } from '../data/appConfig';
import { triggerAutoSaveToast } from '../utils/autoSaveEvent';
import { FlashcardDeck } from './FlashcardDeck';
import { FlashcardManager } from './FlashcardManager';
import { FlashcardModal } from './FlashcardModal';

export const FlashcardsView: React.FC = () => {
  // Load flashcards from local storage or initialize with defaults
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load flashcards from localStorage:', e);
    }
    return DEFAULT_CEH_FLASHCARDS;
  });

  const isInitialMount = useRef(true);

  // Save flashcards whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(cards));
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        triggerAutoSaveToast(`Flashcards (${cards.length} cards)`);
      }
    } catch (e) {
      console.error('Failed to save flashcards to localStorage:', e);
    }
  }, [cards]);

  // Mode: Practice deck vs Library & Management
  const [activeTab, setActiveTab] = useState<'practice' | 'library'>('practice');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [modalDefaultDomainId, setModalDefaultDomainId] = useState<string>('domain-2');

  // Open modal for new card
  const handleOpenCreateModal = (domainId?: string) => {
    setEditingCard(null);
    setModalDefaultDomainId(domainId || 'domain-2');
    setIsModalOpen(true);
  };

  // Open modal to edit existing card
  const handleEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setModalDefaultDomainId(card.domainId);
    setIsModalOpen(true);
  };

  // Save card (create or update)
  const handleSaveCard = (cardData: Omit<Flashcard, 'id' | 'createdAt'> & { id?: string }) => {
    if (cardData.id) {
      // Update existing
      setCards(prev => prev.map(c => {
        if (c.id === cardData.id) {
          return {
            ...c,
            domainId: cardData.domainId,
            category: cardData.category,
            question: cardData.question,
            answer: cardData.answer,
            explanation: cardData.explanation,
            hint: cardData.hint,
            codeSnippet: cardData.codeSnippet,
            tags: cardData.tags,
            isMastered: cardData.isMastered,
          };
        }
        return c;
      }));
    } else {
      // Create new
      const newCard: Flashcard = {
        id: `fc-custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        domainId: cardData.domainId,
        category: cardData.category,
        question: cardData.question,
        answer: cardData.answer,
        explanation: cardData.explanation,
        hint: cardData.hint,
        codeSnippet: cardData.codeSnippet,
        tags: cardData.tags,
        isMastered: false,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        isCustom: true
      };
      setCards(prev => [newCard, ...prev]);
    }
  };

  // Toggle mastered status
  const handleToggleMastered = (id: string) => {
    setCards(prev => prev.map(c => {
      if (c.id === id) {
        const nextMastered = !c.isMastered;
        return {
          ...c,
          isMastered: nextMastered,
          reviewCount: (c.reviewCount || 0) + 1,
          lastReviewedAt: new Date().toISOString()
        };
      }
      return c;
    }));
  };

  // Delete card
  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  // Reset category mastery
  const handleResetCategoryMastery = (domainId: string) => {
    setCards(prev => prev.map(c => {
      if (domainId === 'all' || domainId === 'custom' ? c.isCustom : c.domainId === domainId) {
        return { ...c, isMastered: false };
      }
      return c;
    }));
  };

  // Restore defaults
  const handleResetToDefaults = () => {
    // Keep user's custom cards and append default cards
    const customCards = cards.filter(c => c.isCustom);
    setCards([...customCards, ...DEFAULT_CEH_FLASHCARDS]);
  };

  // Import cards
  const handleImportCards = (imported: Flashcard[]) => {
    setCards(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const newCards = imported.filter(c => !existingIds.has(c.id));
      return [...newCards, ...prev];
    });
  };

  // Overall Statistics
  const totalCards = cards.length;
  const masteredCount = cards.filter(c => c.isMastered).length;
  const customCount = cards.filter(c => c.isCustom).length;
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                <Brain className="w-3.5 h-3.5" />
                CEH v13 Blueprint Review
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                Local Storage Persistent
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              CEH Exam Study Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Master high-yield concepts, protocol vulnerabilities, and command syntax across all 9 EC-Council exam blueprint domains. Create and customize cards with persistent local storage.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center min-w-[90px]">
              <span className="block text-xl font-mono font-extrabold text-white">{totalCards}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Cards</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center min-w-[90px]">
              <span className="block text-xl font-mono font-extrabold text-emerald-400">{masteredCount}</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Mastered</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center min-w-[90px]">
              <span className="block text-xl font-mono font-extrabold text-cyan-400">{masteryPercentage}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Readiness</span>
            </div>
          </div>
        </div>

        {/* Overall Mastery Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-4">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {masteredCount} of {totalCards} Cards Mastered
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-flashcard-practice"
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'practice'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Practice Deck (Interactive Flashcards)</span>
          </button>

          <button
            id="tab-flashcard-library"
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'library'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Card Library & Creator ({totalCards})</span>
          </button>
        </div>

        <button
          id="btn-create-card-action"
          type="button"
          onClick={() => handleOpenCreateModal()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm shadow-emerald-950/40"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>New Flashcard</span>
        </button>
      </div>

      {/* View Switcher: Practice vs Library */}
      {activeTab === 'practice' ? (
        <FlashcardDeck
          cards={cards}
          onToggleMastered={handleToggleMastered}
          onOpenCreateModal={handleOpenCreateModal}
          onResetCategoryMastery={handleResetCategoryMastery}
        />
      ) : (
        <FlashcardManager
          cards={cards}
          onOpenCreateModal={handleOpenCreateModal}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
          onToggleMastered={handleToggleMastered}
          onResetToDefaults={handleResetToDefaults}
          onImportCards={handleImportCards}
        />
      )}

      {/* Create / Edit Modal */}
      <FlashcardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
        }}
        onSave={handleSaveCard}
        editingCard={editingCard}
        defaultDomainId={modalDefaultDomainId}
      />
    </div>
  );
};
