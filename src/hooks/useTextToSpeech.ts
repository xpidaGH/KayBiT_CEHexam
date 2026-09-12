import { useState, useEffect, useRef, useCallback } from 'react';
import { SUPPORTED_LANGUAGES } from '../data/translations';

export interface TTSVoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isDefault: boolean;
}

export interface UseTextToSpeechOptions {
  defaultLanguage?: string;
  defaultRate?: number;
  defaultPitch?: number;
  onBoundary?: (charIndex: number, text: string) => void;
}

export interface UseTextToSpeechReturn {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
  currentLanguage: string;
  availableVoices: SpeechSynthesisVoice[];
  activeVoice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  usingFallbackVoice: boolean;
  fallbackReason: string | null;
  speak: (text: string, langOverride?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setLanguage: (lang: string) => void;
  selectVoice: (voice: SpeechSynthesisVoice | null) => void;
}

// BCP-47 and dialect candidate mappings for all 20 supported languages
const LANGUAGE_VOICE_PREFERENCES: Record<string, string[]> = {
  en: ['en-US', 'en-GB', 'en-CA', 'en-AU', 'en-IN', 'en'],
  fr: ['fr-FR', 'fr-CA', 'fr-BE', 'fr-CH', 'fr'],
  de: ['de-DE', 'de-AT', 'de-CH', 'de'],
  it: ['it-IT', 'it-CH', 'it'],
  es: ['es-ES', 'es-MX', 'es-US', 'es-419', 'es'],
  pt: ['pt-BR', 'pt-PT', 'pt'],
  id: ['id-ID', 'in-ID', 'id', 'ms-MY'],
  sw: ['sw-KE', 'sw-TZ', 'sw', 'en-KE'],
  tr: ['tr-TR', 'tr'],
  ru: ['ru-RU', 'ru'],
  zh: ['zh-CN', 'zh-TW', 'zh-HK', 'zh-SG', 'zh'],
  ja: ['ja-JP', 'ja'],
  ar: ['ar-SA', 'ar-EG', 'ar-AE', 'ar-QA', 'ar'],
  ur: ['ur-PK', 'ur-IN', 'ur', 'hi-IN'],
  hi: ['hi-IN', 'hi'],
  mr: ['mr-IN', 'mr', 'hi-IN'],
  bn: ['bn-BD', 'bn-IN', 'bn'],
  ta: ['ta-IN', 'ta-LK', 'ta-SG', 'ta'],
  te: ['te-IN', 'te'],
  // wuu (Wu Chinese / Shanghainese): first search for wuu dialects, then strictly fallback to zh (Chinese)
  wuu: ['wuu-CN', 'wuu', 'zh-CN', 'zh-TW', 'zh-HK', 'zh'],
};

/**
 * Split long text into speakable sentence chunks (< 200 chars)
 * to prevent Chromium, Safari, and Mobile Webview 15-second speech truncation bugs.
 */
function splitIntoSentences(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];

  // Match sentence endings like periods, exclamation marks, questions, newlines, semicolons
  const regex = /[^.!?\n;]+[.!?\n;]+|\S+$/g;
  const rawChunks = clean.match(regex) || [clean];
  const results: string[] = [];

  for (const chunk of rawChunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    if (trimmed.length > 220) {
      // Secondary split on commas or spaces for ultra-long sentences
      const sub = trimmed.match(/.{1,200}(\s+|$)/g) || [trimmed];
      sub.forEach(s => s.trim() && results.push(s.trim()));
    } else {
      results.push(trimmed);
    }
  }

  return results.length > 0 ? results : [clean];
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const {
    defaultLanguage = 'en',
    defaultRate = 1.0,
    defaultPitch = 1.0,
    onBoundary
  } = options;

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeVoice, setActiveVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [usingFallbackVoice, setUsingFallbackVoice] = useState<boolean>(false);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  const [rate, setRateState] = useState<number>(defaultRate);
  const [pitch, setPitchState] = useState<number>(defaultPitch);

  // Queue and state refs to prevent closure staleness in asynchronous speech callbacks
  const queueRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(0);
  const keepAliveTimerRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize SpeechSynthesis and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const updateVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      } catch (err) {
        console.warn('Could not retrieve speech synthesis voices:', err);
      }
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Explicit audio unlock for mobile webviews & background playback
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx && !audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(() => {});
          }
        }
      } catch {
        // Safe failover if webview denies audioContext
      }
    };

    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    window.addEventListener('click', unlockAudio, { once: true, passive: true });

    return () => {
      if (keepAliveTimerRef.current) {
        window.clearInterval(keepAliveTimerRef.current);
      }
      try {
        window.speechSynthesis?.cancel();
      } catch {}
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  /**
   * Find matching system voice for any of the 20 language codes.
   * Special Rule: If language is 'wuu' (Wu/Shanghainese) and no native wuu voice is found,
   * explicitly fall back to the system's default Chinese engine ('zh').
   */
  const findBestVoice = useCallback((langCode: string, voicesList: SpeechSynthesisVoice[]): {
    voice: SpeechSynthesisVoice | null;
    isFallback: boolean;
    reason: string | null;
  } => {
    if (!voicesList || voicesList.length === 0) {
      return { voice: null, isFallback: false, reason: 'No voices available in browser' };
    }

    const normCode = langCode.toLowerCase().trim();

    // Specific Requirement: Fallback mechanism for 'wuu' -> 'zh'
    if (normCode === 'wuu') {
      // 1. First, search if a native wuu / Shanghainese voice exists
      const nativeWuu = voicesList.find(v => {
        const vLang = v.lang.toLowerCase();
        const vName = v.name.toLowerCase();
        return vLang.startsWith('wuu') || vName.includes('wuu') || vName.includes('shanghai');
      });

      if (nativeWuu) {
        return { voice: nativeWuu, isFallback: false, reason: null };
      }

      // 2. Fallback to system's default Chinese engine ('zh')
      const zhCandidates = ['zh-cn', 'zh', 'zh-tw', 'zh-hk', 'zh-sg'];
      for (const cand of zhCandidates) {
        const zhVoice = voicesList.find(v => v.lang.toLowerCase() === cand);
        if (zhVoice) {
          return { 
            voice: zhVoice, 
            isFallback: true, 
            reason: `Reverted to default Chinese engine (${zhVoice.lang}) as native Wu (wuu) is unavailable.` 
          };
        }
      }

      // Any voice starting with zh
      const anyZh = voicesList.find(v => v.lang.toLowerCase().startsWith('zh'));
      if (anyZh) {
        return { 
          voice: anyZh, 
          isFallback: true, 
          reason: `Reverted to default Chinese engine (${anyZh.lang}) as native Wu (wuu) is unavailable.` 
        };
      }
    }

    // General matching for all other 19 languages
    const preferredPrefixes = LANGUAGE_VOICE_PREFERENCES[normCode] || [normCode];

    // Priority 1: Exact match with preferred tags
    for (const pref of preferredPrefixes) {
      const match = voicesList.find(v => v.lang.toLowerCase() === pref.toLowerCase());
      if (match) {
        return { voice: match, isFallback: false, reason: null };
      }
    }

    // Priority 2: Starts with preferred prefix
    for (const pref of preferredPrefixes) {
      const match = voicesList.find(v => v.lang.toLowerCase().startsWith(pref.toLowerCase()));
      if (match) {
        return { voice: match, isFallback: false, reason: null };
      }
    }

    // Priority 3: Search by language name match in voice description
    const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === normCode);
    if (langMeta) {
      const byName = voicesList.find(v => 
        v.name.toLowerCase().includes(langMeta.name.toLowerCase()) ||
        v.name.toLowerCase().includes(langMeta.nativeName.toLowerCase())
      );
      if (byName) {
        return { voice: byName, isFallback: false, reason: null };
      }
    }

    // Priority 4: Default system voice fallback
    const defaultVoice = voicesList.find(v => v.default) || voicesList[0] || null;
    return { 
      voice: defaultVoice, 
      isFallback: true, 
      reason: `Default system voice (${defaultVoice?.lang || 'default'}) used for ${langCode}` 
    };
  }, []);

  // Update active voice when language or available voices change
  useEffect(() => {
    if (availableVoices.length > 0) {
      const { voice, isFallback, reason } = findBestVoice(currentLanguage, availableVoices);
      setActiveVoice(voice);
      setUsingFallbackVoice(isFallback);
      setFallbackReason(reason);
    }
  }, [currentLanguage, availableVoices, findBestVoice]);

  // Keep-alive timer for Chromium & Mobile Webview bug (stops speaking after ~15 sec)
  const startKeepAlive = useCallback(() => {
    if (keepAliveTimerRef.current) {
      window.clearInterval(keepAliveTimerRef.current);
    }
    keepAliveTimerRef.current = window.setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }
    }, 10000);
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveTimerRef.current) {
      window.clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  }, []);

  // Stop playback
  const stop = useCallback(() => {
    stopKeepAlive();
    queueRef.current = [];
    currentIndexRef.current = 0;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    activeUtteranceRef.current = null;

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Speech cancellation error:', e);
      }
    }
  }, [stopKeepAlive]);

  // Pause playback
  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } catch (e) {
        console.warn('Speech pause error:', e);
      }
    }
  }, []);

  // Resume playback
  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.paused) {
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
      } catch (e) {
        console.warn('Speech resume error:', e);
      }
    }
  }, []);

  // Speak queue chunk-by-chunk
  const speakNextChunk = useCallback(() => {
    if (!queueRef.current || currentIndexRef.current >= queueRef.current.length) {
      stop();
      return;
    }

    const chunk = queueRef.current[currentIndexRef.current];
    if (!chunk || !chunk.trim()) {
      currentIndexRef.current += 1;
      speakNextChunk();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.rate = rate;
      utterance.pitch = pitch;

      if (activeVoice) {
        utterance.voice = activeVoice;
        utterance.lang = activeVoice.lang;
      } else {
        utterance.lang = currentLanguage;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        isPlayingRef.current = true;
      };

      utterance.onend = () => {
        currentIndexRef.current += 1;
        if (currentIndexRef.current < queueRef.current.length && isPlayingRef.current) {
          speakNextChunk();
        } else {
          stop();
        }
      };

      utterance.onerror = (event) => {
        // 'canceled' or 'interrupted' are expected when user stops or switches
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          console.warn('TTS utterance playback error:', event.error);
        }
        stop();
      };

      utterance.onboundary = (event) => {
        if (onBoundary) {
          onBoundary(event.charIndex, chunk);
        }
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to dispatch SpeechSynthesisUtterance:', err);
      stop();
    }
  }, [activeVoice, currentLanguage, onBoundary, pitch, rate, stop]);

  // Main speak trigger
  const speak = useCallback((text: string, langOverride?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Cancel existing speech
    stop();

    const targetLang = langOverride || currentLanguage;
    if (langOverride && langOverride !== currentLanguage) {
      setCurrentLanguage(langOverride);
    }

    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) return;

    queueRef.current = sentences;
    currentIndexRef.current = 0;
    setCurrentText(text);
    setIsPlaying(true);
    setIsPaused(false);
    isPlayingRef.current = true;

    startKeepAlive();

    // Small timeout ensures clean cancelation before starting on mobile Safari/Chrome
    window.setTimeout(() => {
      speakNextChunk();
    }, 40);
  }, [currentLanguage, speakNextChunk, startKeepAlive, stop]);

  const selectVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setActiveVoice(voice);
    if (voice) {
      setUsingFallbackVoice(false);
      setFallbackReason(null);
    }
  }, []);

  const setRate = useCallback((newRate: number) => {
    setRateState(newRate);
  }, []);

  const setPitch = useCallback((newPitch: number) => {
    setPitchState(newPitch);
  }, []);

  const setLanguage = useCallback((newLang: string) => {
    setCurrentLanguage(newLang);
  }, []);

  return {
    isSupported,
    isPlaying,
    isPaused,
    currentText,
    currentLanguage,
    availableVoices,
    activeVoice,
    rate,
    pitch,
    usingFallbackVoice,
    fallbackReason,
    speak,
    pause,
    resume,
    stop,
    setRate,
    setPitch,
    setLanguage,
    selectVoice
  };
}
