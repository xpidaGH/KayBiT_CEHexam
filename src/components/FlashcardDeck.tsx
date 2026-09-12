import React, { useState, useEffect, useCallback } from 'react';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Shuffle, 
  HelpCircle, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Tag, 
  Eye, 
  Code,
  RotateCcw,
  Plus,
  Volume2,
  VolumeX,
  Wand2,
  Maximize2,
  X
} from 'lucide-react';
import { Flashcard } from '../types';
import { FLASHCARD_CATEGORIES, FlashcardCategory } from '../data/flashcardsData';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface FlashcardDeckProps {
  cards: Flashcard[];
  onToggleMastered: (id: string) => void;
  onOpenCreateModal: (domainId?: string) => void;
  onResetCategoryMastery: (domainId: string) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  onToggleMastered,
  onOpenCreateModal,
  onResetCategoryMastery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);
  const [selectedMnemonicModal, setSelectedMnemonicModal] = useState<{
    url: string;
    prompt?: string;
    title: string;
  } | null>(null);

  // Initialize Text-To-Speech for audio card read-aloud
  const {
    isSupported: isTtsSupported,
    isPlaying: isTtsPlaying,
    isPaused: isTtsPaused,
    speak: speakCard,
    pause: pauseCardAudio,
    resume: resumeCardAudio,
    stop: stopCardAudio
  } = useTextToSpeech({
    defaultLanguage: 'en',
    defaultRate: 1.0
  });

  // Filtered list
  const filteredCards = cards.filter(card => {
    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'custom') {
        if (!card.isCustom) return false;
      } else if (card.domainId !== selectedCategory) {
        return false;
      }
    }
    // Status filter
    if (statusFilter === 'unmastered' && card.isMastered) return false;
    if (statusFilter === 'mastered' && !card.isMastered) return false;

    return true;
  });

  // Effective deck order
  const effectiveCards = React.useMemo(() => {
    if (!shuffledOrder || shuffledOrder.length !== filteredCards.length) {
      return filteredCards;
    }
    return shuffledOrder.map(idx => filteredCards[idx]).filter(Boolean);
  }, [filteredCards, shuffledOrder]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setShuffledOrder(null);
  }, [selectedCategory, statusFilter]);

  const currentCard: Flashcard | undefined = effectiveCards[currentIndex];

  // Stop card audio when navigating or changing filters
  const handleToggleCardAudio = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    if (isTtsPlaying) {
      if (isTtsPaused) {
        resumeCardAudio();
      } else {
        pauseCardAudio();
      }
      return;
    }

    const cardSpeechText = !isFlipped
      ? `Question. ${currentCard.question}. ${currentCard.hint ? `Hint: ${currentCard.hint}.` : ''}`
      : `Answer. ${currentCard.answer}. ${currentCard.explanation ? `Explanation: ${currentCard.explanation}.` : ''} ${currentCard.mnemonicPrompt ? `Visual Mnemonic: ${currentCard.mnemonicPrompt}.` : ''}`;

    speakCard(cardSpeechText, 'en');
  }, [currentCard, isFlipped, isTtsPlaying, isTtsPaused, resumeCardAudio, pauseCardAudio, speakCard]);

  const handleNext = useCallback(() => {
    if (effectiveCards.length === 0) return;
    stopCardAudio();
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => (prev + 1) % effectiveCards.length);
  }, [effectiveCards.length, stopCardAudio]);

  const handlePrev = useCallback(() => {
    if (effectiveCards.length === 0) return;
    stopCardAudio();
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex(prev => (prev - 1 + effectiveCards.length) % effectiveCards.length);
  }, [effectiveCards.length, stopCardAudio]);

  const handleFlip = useCallback(() => {
    stopCardAudio();
    setIsFlipped(prev => !prev);
  }, [stopCardAudio]);

  const handleShuffle = () => {
    stopCardAudio();
    if (filteredCards.length <= 1) return;
    const indices = Array.from({ length: filteredCards.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledOrder(indices);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleCopyCode = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        if (currentCard) {
          e.preventDefault();
          onToggleMastered(currentCard.id);
        }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleShuffle();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowHint(prev => !prev);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleToggleCardAudio();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, currentCard, onToggleMastered, handleToggleCardAudio]);

  // Statistics for the active category
  const categoryCards = cards.filter(c => 
    selectedCategory === 'all' 
      ? true 
      : selectedCategory === 'custom' 
        ? c.isCustom 
        : c.domainId === selectedCategory
  );
  const categoryMasteredCount = categoryCards.filter(c => c.isMastered).length;
  const categoryMasteryPercent = categoryCards.length > 0 
    ? Math.round((categoryMasteredCount / categoryCards.length) * 100) 
    : 0;

  const currentCategoryInfo = FLASHCARD_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Selection Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Filter by Exam Domain Category
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Mastery Progress:</span>
            <span className="font-mono font-bold text-emerald-400">
              {categoryMasteredCount}/{categoryCards.length} ({categoryMasteryPercent}%)
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {FLASHCARD_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = cards.filter(c => 
              cat.id === 'all' ? true : cat.id === 'custom' ? c.isCustom : c.domainId === cat.id
            ).length;

            return (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{cat.shortName}</span>
                {cat.weight && (
                  <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isSelected ? 'bg-emerald-600 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                    {cat.weight}%
                  </span>
                )}
                <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Sub-filters & Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                statusFilter === 'all' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({filteredCards.length})
            </button>
            <button
              onClick={() => setStatusFilter('unmastered')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                statusFilter === 'unmastered' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Needs Review
            </button>
            <button
              onClick={() => setStatusFilter('mastered')}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                statusFilter === 'mastered' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mastered
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-shuffle-deck"
              type="button"
              onClick={handleShuffle}
              disabled={effectiveCards.length <= 1}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 text-xs transition-colors disabled:opacity-40 disabled:pointer-events-none"
              title="Randomize card sequence (Shortcut: S)"
            >
              <Shuffle className="w-3 h-3 text-cyan-400" />
              <span>Shuffle</span>
            </button>

            {categoryMasteredCount > 0 && (
              <button
                type="button"
                onClick={() => onResetCategoryMastery(selectedCategory)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/70 text-xs transition-colors"
                title="Reset mastery status for all cards in this category"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Reset Mastery</span>
              </button>
            )}

            <button
              id="btn-deck-new-card"
              type="button"
              onClick={() => onOpenCreateModal(selectedCategory)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>New Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {effectiveCards.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
            <Layers className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">No Flashcards In This Filter</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {statusFilter === 'mastered'
                ? 'You have not marked any cards in this category as mastered yet. Switch to "All" or "Needs Review" to practice!'
                : 'No cards match the selected domain or status criteria. You can create a new custom flashcard for this domain.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Show All Cards
              </button>
            )}
            <button
              onClick={() => onOpenCreateModal(selectedCategory)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              Create Flashcard for this Category
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Deck Counter & Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-200">
                Card {currentIndex + 1} of {effectiveCards.length}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90 font-medium">
                {currentCard?.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {currentCard?.isMastered ? (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mastered</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <span>Needs Review</span>
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / effectiveCards.length) * 100}%` }}
            />
          </div>

          {/* Flip Card Container */}
          <div 
            id="interactive-flashcard"
            onClick={handleFlip}
            className="cursor-pointer select-none relative min-h-[360px] sm:min-h-[380px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:border-emerald-500/50 hover:shadow-emerald-950/20 group"
          >
            {/* Top Card Info Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                  {isFlipped ? 'ANSWER (BACK)' : 'QUESTION (FRONT)'}
                </span>
                {currentCard?.isCustom && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-medium">
                    User Created
                  </span>
                )}
                {currentCard?.mnemonicVisualUrl && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium">
                    <Wand2 className="w-3 h-3 text-indigo-400" />
                    <span>Visual Aid</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Read-Out Button */}
                {isTtsSupported && (
                  <button
                    id="btn-card-audio-read"
                    type="button"
                    onClick={handleToggleCardAudio}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                      isTtsPlaying
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm shadow-amber-500/20'
                        : 'bg-slate-800/90 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
                    }`}
                    title={isTtsPlaying ? 'Pause card audio (Shortcut: A)' : 'Listen to card read aloud (Shortcut: A)'}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isTtsPlaying ? 'animate-pulse' : 'text-emerald-400'}`} />
                    <span>{isTtsPlaying ? (isTtsPaused ? 'Resume' : 'Playing') : 'Listen'}</span>
                    <kbd className="hidden sm:inline text-[9px] bg-slate-900/80 px-1 py-0.2 rounded font-mono text-slate-400 border border-slate-700">
                      A
                    </kbd>
                  </button>
                )}

                <span className="text-[11px] text-slate-500 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <RotateCw className="w-3 h-3 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Flip</span>
                </span>
              </div>
            </div>

            {/* Card Body Content */}
            <div className="py-6 my-auto">
              {!isFlipped ? (
                /* FRONT: QUESTION */
                <div className="space-y-5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-relaxed">
                    {currentCard?.question}
                  </h2>

                  {/* Tags */}
                  {currentCard?.tags && currentCard.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      <Tag className="w-3.5 h-3.5 text-slate-500" />
                      {currentCard.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hint Reveal */}
                  {currentCard?.hint && (
                    <div className="pt-2">
                      {!showHint ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Need a memory hint?</span>
                        </button>
                      ) : (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2 animate-fadeIn"
                        >
                          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Memory Clue:</span> {currentCard.hint}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Mnemonic Visual Aid (Front Teaser if available) */}
                  {currentCard?.mnemonicVisualUrl && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMnemonicModal({
                          url: currentCard.mnemonicVisualUrl!,
                          prompt: currentCard.mnemonicPrompt,
                          title: currentCard.question
                        });
                      }}
                      className="pt-2"
                    >
                      <div className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs transition-colors group/teaser">
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-indigo-500/40 bg-slate-950">
                          <img 
                            src={currentCard.mnemonicVisualUrl} 
                            alt="Visual Aid" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="text-left">
                          <span className="font-bold flex items-center gap-1">
                            <Wand2 className="w-3 h-3 text-indigo-400" />
                            <span>Mnemonic Visual Aid Attached</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Flip card or click to view visual memory anchor
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* BACK: ANSWER */
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Core Answer & Blueprint Takeaway
                    </span>
                    <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-medium">
                      {currentCard?.answer}
                    </p>
                  </div>

                  {/* Detailed Explanation */}
                  {currentCard?.explanation && (
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed space-y-1">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Exam Technical Context</span>
                      </div>
                      <p>{currentCard.explanation}</p>
                    </div>
                  )}

                  {/* Code Snippet */}
                  {currentCard?.codeSnippet && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800/80">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Code className="w-3.5 h-3.5" />
                          <span>Syntax / Command Reference</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(currentCard.codeSnippet!, e)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                          title="Copy command"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-emerald-300 whitespace-pre-wrap overflow-x-auto selection:bg-emerald-500 selection:text-slate-950">
                        {currentCard.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Full Mnemonic Visual Anchor Presentation (Back of Card) */}
                  {currentCard?.mnemonicVisualUrl && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMnemonicModal({
                          url: currentCard.mnemonicVisualUrl!,
                          prompt: currentCard.mnemonicPrompt,
                          title: currentCard.question
                        });
                      }}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/40 hover:border-indigo-500 transition-all flex flex-col sm:flex-row items-center gap-3.5 group/aid"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden shrink-0 border border-slate-800 bg-slate-900 relative">
                        <img 
                          src={currentCard.mnemonicVisualUrl} 
                          alt={currentCard.mnemonicPrompt || 'Mnemonic Aid'} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover/aid:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/aid:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1">
                            <Wand2 className="w-3 h-3" />
                            <span>Imagen Mnemonic Anchor</span>
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-200">
                          {currentCard.mnemonicPrompt || 'Mnemonic Visual Metaphor'}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Visual memory representation engineered to permanently associate this complex concept in exam memory.
                        </p>
                        <button
                          type="button"
                          className="mt-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Click to expand high-resolution visual anchor</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-xs">
              {/* Mastery Self-Assessment Buttons */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2"
              >
                <button
                  id="btn-mark-mastered"
                  type="button"
                  onClick={() => currentCard && onToggleMastered(currentCard.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                    currentCard?.isMastered
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700'
                  }`}
                  title="Toggle mastery status (Shortcut: M)"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentCard?.isMastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
                </button>

                {currentCard?.isMastered && (
                  <button
                    type="button"
                    onClick={() => currentCard && onToggleMastered(currentCard.id)}
                    className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs"
                    title="Demote card back to Needs Review"
                  >
                    Demote to Review
                  </button>
                )}
              </div>

              {/* Flip action trigger */}
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3 text-emerald-400" />
                  <span>{isFlipped ? 'Show Question' : 'Show Answer'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <button
              id="btn-prev-card"
              type="button"
              onClick={handlePrev}
              disabled={effectiveCards.length <= 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
              <kbd className="hidden sm:inline text-[9px] bg-slate-900 text-slate-400 border border-slate-700 px-1 rounded font-mono">
                ←
              </kbd>
            </button>

            {/* Keyboard Shortcuts Helper */}
            <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">Space</kbd> Flip
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">←</kbd>
                <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">→</kbd> Nav
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">A</kbd> Audio
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">M</kbd> Mastered
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">S</kbd> Shuffle
              </span>
            </div>

            <button
              id="btn-next-card"
              type="button"
              onClick={handleNext}
              disabled={effectiveCards.length <= 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-emerald-500/20"
            >
              <span>Next Card</span>
              <kbd className="hidden sm:inline text-[9px] bg-emerald-600 text-slate-950 px-1 rounded font-mono">
                →
              </kbd>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mnemonic High-Res Lightbox Modal */}
      {selectedMnemonicModal && (
        <div 
          id="mnemonic-visual-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedMnemonicModal(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      AI Mnemonic Visual Anchor
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                      Imagen 3 Metaphor
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {selectedMnemonicModal.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMnemonicModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Image */}
            <div className="p-6 overflow-y-auto space-y-4 flex flex-col items-center">
              <div className="w-full max-w-lg rounded-xl overflow-hidden border border-indigo-500/30 bg-slate-950 shadow-xl flex items-center justify-center">
                <img 
                  src={selectedMnemonicModal.url} 
                  alt={selectedMnemonicModal.prompt || 'Mnemonic Visual Aid'} 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[420px] object-contain"
                />
              </div>

              {selectedMnemonicModal.prompt && (
                <div className="w-full max-w-lg p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Cognitive Memory Prompt
                  </span>
                  <p className="font-medium text-slate-200">
                    "{selectedMnemonicModal.prompt}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
              <span>Associative memory technique designed for rapid CEH v13 exam recall</span>
              <button
                type="button"
                onClick={() => setSelectedMnemonicModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
