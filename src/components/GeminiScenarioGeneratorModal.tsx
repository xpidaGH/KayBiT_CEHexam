import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Brain, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Check, 
  RefreshCw, 
  Sliders, 
  Bookmark, 
  Layers, 
  Cpu, 
  Target,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Flashcard, ScenarioPracticeQuestion } from '../types';
import { FlashcardCategory } from '../data/flashcardsData';

interface GeminiScenarioGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCategory: FlashcardCategory;
  deckCards: Flashcard[];
  onAddCardsToDeck: (newCards: Flashcard[]) => void;
}

export const GeminiScenarioGeneratorModal: React.FC<GeminiScenarioGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentCategory,
  deckCards,
  onAddCardsToDeck,
}) => {
  const [difficulty, setDifficulty] = useState<'standard' | 'advanced'>('standard');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [customFocus, setCustomFocus] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scenarioQuestions, setScenarioQuestions] = useState<ScenarioPracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [addedCardIds, setAddedCardIds] = useState<Record<string, boolean>>({});
  const [allAdded, setAllAdded] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>('gemini-3.8-flash');
  const [isCuratedBank, setIsCuratedBank] = useState<boolean>(false);

  // Suggested prompt tags based on current domain
  const getDomainSuggestions = (domainId: string): string[] => {
    switch (domainId) {
      case 'domain-1':
        return ['Black vs White box RoE', 'CVSS v3.1 calculation', 'CFAA § 1030 compliance'];
      case 'domain-2':
        return ['DNS Zone Transfer AXFR', 'Nmap TCP ACK Probes', 'theHarvester OSINT'];
      case 'domain-3':
        return ['Linux SUID GTFOBins', 'Pass-the-Hash LSASS', 'Mimikatz Golden Ticket'];
      case 'domain-4':
        return ['Dynamic ARP Inspection', 'SYN/FIN Filter Evasion', 'Wireshark TCP Handshake'];
      case 'domain-5':
        return ['Time-Based Blind SQLi', 'SSRF Cloud IMDS 169.254.169.254', 'Stored XSS Cookie Theft'];
      case 'domain-6':
        return ['WPA2 4-Way Handshake', 'Evil Twin Rogue AP', 'Deauthentication Frame Injection'];
      case 'domain-7':
        return ['Modbus TCP Function Codes', 'Android APK Smali Injection', 'MQTT Broker Exposure'];
      case 'domain-8':
        return ['Docker.sock Host Breakout', 'AWS S3 Bucket ACL Misconfig', 'Kubernetes RBAC Privilege'];
      case 'domain-9':
        return ['Least Significant Bit Steghide', 'AES-GCM vs CBC Oracle', 'Diffie-Hellman Key Exchange'];
      default:
        return ['Active Directory Lateral Movement', 'Firewall Evasion & Decoy Scans', 'Web API Parameter Tampering'];
    }
  };

  const domainSuggestions = getDomainSuggestions(currentCategory.id);

  // Generate Questions via Server API
  const handleGenerate = async (overrideFocus?: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setUserAnswers({});
    setAddedCardIds({});
    setAllAdded(false);
    setCurrentQuestionIndex(0);

    const focusText = overrideFocus !== undefined ? overrideFocus : customFocus;

    try {
      const response = await fetch('/api/generate-scenario-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainId: currentCategory.id,
          categoryName: currentCategory.name,
          count: questionCount,
          difficulty,
          customFocus: focusText,
          sampleDeckCards: deckCards.slice(0, 5).map(c => ({ question: c.question, answer: c.answer }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setScenarioQuestions(data.questions);
        setModelUsed(data.model || 'gemini-3.8-flash');
        setIsCuratedBank(Boolean(data.isSimulated));
      } else {
        throw new Error('No scenario questions were returned from the model.');
      }
    } catch (err) {
      console.error('Scenario generation error:', err);
      setErrorMessage((err as Error).message || 'Failed to generate scenario questions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Select Option
  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (userAnswers[questionIdx] !== undefined) return; // Answer already submitted
    setUserAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  // Convert a scenario question into a flashcard
  const convertToFlashcard = (q: ScenarioPracticeQuestion): Flashcard => {
    return {
      id: `fc-scenario-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      domainId: currentCategory.id === 'all' || currentCategory.id === 'custom' ? (q.domainId || 'domain-2') : currentCategory.id,
      category: currentCategory.name,
      question: `[CEH SCENARIO]\n${q.scenario}\n\nQuestion: ${q.question}`,
      answer: q.suggestedFlashcardAnswer || q.options[q.correctIndex],
      explanation: `${q.explanation}\n\nKey Takeaway: ${q.keyTakeaway}`,
      tags: [q.mitreTechnique || 'CEH Scenario', difficulty === 'advanced' ? 'Advanced Scenario' : 'Standard Scenario', 'AI-Generated'],
      isMastered: false,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      isCustom: true
    };
  };

  // Add single question as flashcard
  const handleAddSingleCard = (q: ScenarioPracticeQuestion) => {
    if (addedCardIds[q.id]) return;
    const card = convertToFlashcard(q);
    onAddCardsToDeck([card]);
    setAddedCardIds(prev => ({ ...prev, [q.id]: true }));
  };

  // Add all generated questions as flashcards
  const handleAddAllCards = () => {
    if (allAdded || scenarioQuestions.length === 0) return;
    const cardsToAdd = scenarioQuestions
      .filter(q => !addedCardIds[q.id])
      .map(convertToFlashcard);

    if (cardsToAdd.length > 0) {
      onAddCardsToDeck(cardsToAdd);
    }
    const newAddedState: Record<string, boolean> = {};
    scenarioQuestions.forEach(q => { newAddedState[q.id] = true; });
    setAddedCardIds(newAddedState);
    setAllAdded(true);
  };

  if (!isOpen) return null;

  const activeQuestion = scenarioQuestions[currentQuestionIndex];
  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && userAnswers[currentQuestionIndex] === activeQuestion?.correctIndex;

  // Score statistics
  const totalAnswered = Object.keys(userAnswers).length;
  const totalCorrect = Object.entries(userAnswers).filter(
    ([idx, ans]) => scenarioQuestions[Number(idx)]?.correctIndex === ans
  ).length;

  return (
    <div 
      id="gemini-scenario-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col my-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                  Gemini AI Scenario Practice Lab
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  {isCuratedBank ? 'CEH Blueprint Bank' : 'gemini-3.8-flash'}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">
                Active Deck Topic: <span className="text-emerald-400 font-medium">{currentCategory.name}</span> ({deckCards.length} cards)
              </p>
            </div>
          </div>

          <button
            id="btn-close-scenario-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Generation Configuration Controls Bar */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Scenario Generator Configuration
                </span>
              </div>

              {/* Difficulty & Count Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setDifficulty('standard')}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      difficulty === 'standard'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Standard CEH
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficulty('advanced')}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      difficulty === 'advanced'
                        ? 'bg-purple-500 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Advanced Red Team
                  </button>
                </div>

                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
                  {[3, 5].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`px-2 py-1 rounded-md transition-all font-bold ${
                        questionCount === cnt
                          ? 'bg-slate-700 text-emerald-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Focus and Prompting */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Specific Topic / Tool Focus (Optional):</span>
                <span className="text-[11px] text-slate-500">Press Enter or click generate</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFocus}
                  onChange={e => setCustomFocus(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleGenerate(); }}
                  placeholder="e.g., DNS zone transfer, Nmap timing evasion, SUID privilege escalation, SQLi bypass..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  id="btn-trigger-gemini-scenarios"
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50 whitespace-nowrap"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Scenarios</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Topic Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Suggested:</span>
                {domainSuggestions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setCustomFocus(tag);
                      handleGenerate(tag);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-800 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="underline font-bold text-rose-200 hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State Animation */}
          {isLoading && (
            <div className="py-12 px-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <Brain className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Gemini AI Analyzing CEH v13 Blueprint...
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Synthesizing multi-stage enterprise scenarios, realistic network topologies, and MITRE ATT&CK techniques for <span className="text-emerald-400 font-medium">{currentCategory.name}</span>.
                </p>
              </div>
            </div>
          )}

          {/* Empty / Initial State before first generation */}
          {!isLoading && scenarioQuestions.length === 0 && !errorMessage && (
            <div className="py-10 px-6 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1 max-w-lg mx-auto">
                <h3 className="text-sm font-bold text-slate-200">
                  Ready to Practice High-Yield CEH Exam Scenarios
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click <strong className="text-emerald-300">Generate Scenarios</strong> to have Gemini create complex scenario questions based on <span className="text-slate-300">{currentCategory.name}</span>. You can test your knowledge immediately and save any question directly to this flashcard deck.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate {questionCount} Scenarios Now</span>
              </button>
            </div>
          )}

          {/* Active Generated Scenarios Stage */}
          {!isLoading && scenarioQuestions.length > 0 && activeQuestion && (
            <div className="space-y-5">
              {/* Question Navigation Header & Score Tracker */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Scenario {currentQuestionIndex + 1} of {scenarioQuestions.length}
                  </span>
                  {activeQuestion.mitreTechnique && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {activeQuestion.mitreTechnique}
                    </span>
                  )}
                  {activeQuestion.difficulty && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      activeQuestion.difficulty.includes('Advanced') 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {activeQuestion.difficulty}
                    </span>
                  )}
                </div>

                {/* Score & Stepper Controls */}
                <div className="flex items-center gap-3">
                  {totalAnswered > 0 && (
                    <span className="text-xs font-mono text-slate-400">
                      Score: <span className="text-emerald-400 font-bold">{totalCorrect}</span>/{totalAnswered} ({Math.round((totalCorrect / totalAnswered) * 100)}%)
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={currentQuestionIndex === scenarioQuestions.length - 1}
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(scenarioQuestions.length - 1, prev + 1))}
                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scenario Context Box */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="uppercase tracking-wider">Enterprise Engagement Scenario</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {activeQuestion.scenario}
                </p>
              </div>

              {/* Specific Question Prompt */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Problem Statement:
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {activeQuestion.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((option, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const isCorrect = optIdx === activeQuestion.correctIndex;
                  const showResult = hasAnsweredCurrent;

                  let borderClass = 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/80 text-slate-300';
                  let icon = <span className="w-5 h-5 rounded-full border border-slate-700 text-[10px] font-mono flex items-center justify-center text-slate-400">{String.fromCharCode(65 + optIdx)}</span>;

                  if (showResult) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-100 font-medium';
                      icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                    } else if (isSelected && !isCorrect) {
                      borderClass = 'border-rose-500 bg-rose-500/15 text-rose-200 line-through opacity-80';
                      icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                    } else {
                      borderClass = 'border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-cyan-500 bg-cyan-500/10 text-cyan-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 text-xs sm:text-sm ${borderClass} ${!hasAnsweredCurrent ? 'cursor-pointer hover:border-slate-700' : 'cursor-default'}`}
                    >
                      <div className="shrink-0 mt-0.5">{icon}</div>
                      <span className="flex-1 leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Technical Explanation (Revealed on Answer) */}
              {hasAnsweredCurrent && (
                <div className={`p-4 sm:p-5 rounded-xl border space-y-3 animate-fadeIn ${
                  isCurrentCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                      {isCurrentCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct Decision
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Incorrect Option
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Answer: Option {String.fromCharCode(65 + activeQuestion.correctIndex)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {activeQuestion.explanation}
                  </p>

                  {activeQuestion.keyTakeaway && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-300 flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">CEH Exam Rule of Thumb:</strong>
                        <span>{activeQuestion.keyTakeaway}</span>
                      </div>
                    </div>
                  )}

                  {/* Add to Flashcard Deck Button */}
                  <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddSingleCard(activeQuestion)}
                      disabled={addedCardIds[activeQuestion.id]}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        addedCardIds[activeQuestion.id]
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50'
                      }`}
                    >
                      {addedCardIds[activeQuestion.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved in Deck</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Save as Flashcard to Deck</span>
                        </>
                      )}
                    </button>

                    {currentQuestionIndex < scenarioQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5"
                      >
                        <span>Next Scenario</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">
                        All scenarios in batch reviewed!
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-800 bg-slate-950/80 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Domain:</span>
            <span className="text-emerald-400 font-mono font-medium">{currentCategory.shortName}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {scenarioQuestions.length > 0 && (
              <button
                type="button"
                onClick={handleAddAllCards}
                disabled={allAdded}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all disabled:opacity-40"
              >
                {allAdded ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                <span>{allAdded ? 'All Added to Deck' : `Add All (${scenarioQuestions.length}) as Flashcards`}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
            >
              Close Lab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
