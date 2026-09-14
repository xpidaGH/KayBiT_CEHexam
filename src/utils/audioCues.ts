/**
 * Procedural Web Audio API sound cues for CEH Master Hub
 * Subtle, responsive, zero external asset dependencies
 */

const AUDIO_CUES_STORAGE_KEY = 'kaybit_ceh_audio_cues_enabled';
const AUDIO_COMPLETION_STORAGE_KEY = 'kaybit_ceh_completion_cues_enabled';
const AUDIO_TIMER_ALERTS_STORAGE_KEY = 'kaybit_ceh_timer_alerts_enabled';

let cachedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!cachedAudioCtx || cachedAudioCtx.state === 'closed') {
      cachedAudioCtx = new AudioContextClass();
    }
    if (cachedAudioCtx.state === 'suspended') {
      cachedAudioCtx.resume().catch(() => {});
    }
    return cachedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Check if global master audio cues are enabled
 */
export function isAudioCuesEnabled(): boolean {
  try {
    const saved = localStorage.getItem(AUDIO_CUES_STORAGE_KEY);
    // Defaults to true
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

/**
 * Check if successful completion cues (flashcard success, fanfare, flag captured) are enabled
 */
export function isCompletionCuesEnabled(): boolean {
  try {
    const saved = localStorage.getItem(AUDIO_COMPLETION_STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

/**
 * Check if timer alerts (Pomodoro complete, test countdown alarms) are enabled
 */
export function isTimerAlertsEnabled(): boolean {
  try {
    const saved = localStorage.getItem(AUDIO_TIMER_ALERTS_STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

/**
 * Retrieve comprehensive audio settings state
 */
export function getAudioSettings(): { master: boolean; completion: boolean; timerAlerts: boolean } {
  return {
    master: isAudioCuesEnabled(),
    completion: isCompletionCuesEnabled(),
    timerAlerts: isTimerAlertsEnabled(),
  };
}

/**
 * Set master audio cues enabled state
 */
export function setAudioCuesEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUDIO_CUES_STORAGE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent('audio-cues-toggle', { detail: { enabled } }));
    window.dispatchEvent(new CustomEvent('audio-settings-changed', { 
      detail: getAudioSettings() 
    }));
  } catch {
    // ignore
  }
}

/**
 * Set completion cues enabled state
 */
export function setCompletionCuesEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUDIO_COMPLETION_STORAGE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent('audio-settings-changed', { 
      detail: getAudioSettings() 
    }));
  } catch {
    // ignore
  }
}

/**
 * Set timer alerts enabled state
 */
export function setTimerAlertsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUDIO_TIMER_ALERTS_STORAGE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent('audio-settings-changed', { 
      detail: getAudioSettings() 
    }));
  } catch {
    // ignore
  }
}

/**
 * Update audio settings in bulk
 */
export function updateAudioSettings(settings: { master?: boolean; completion?: boolean; timerAlerts?: boolean }): void {
  try {
    if (settings.master !== undefined) {
      localStorage.setItem(AUDIO_CUES_STORAGE_KEY, String(settings.master));
      window.dispatchEvent(new CustomEvent('audio-cues-toggle', { detail: { enabled: settings.master } }));
    }
    if (settings.completion !== undefined) {
      localStorage.setItem(AUDIO_COMPLETION_STORAGE_KEY, String(settings.completion));
    }
    if (settings.timerAlerts !== undefined) {
      localStorage.setItem(AUDIO_TIMER_ALERTS_STORAGE_KEY, String(settings.timerAlerts));
    }
    window.dispatchEvent(new CustomEvent('audio-settings-changed', { 
      detail: getAudioSettings() 
    }));
  } catch {
    // ignore
  }
}

/**
 * Subtle uplifting chime for successful flashcard completion / mastery
 */
export function playFlashcardSuccessSound(forcePreview = false): void {
  if (!forcePreview && (!isAudioCuesEnabled() || !isCompletionCuesEnabled())) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Ascending major triad: E5 (659.25Hz) -> G#5 (830.61Hz) -> B5 (987.77Hz)
    const notes = [659.25, 830.61, 987.77];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0, now + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.4);
    });
  } catch {
    // audio failure graceful ignore
  }
}

/**
 * Subtle chime for complete deck mastery / 100% domain milestone
 */
export function playDeckMasteredFanfare(forcePreview = false): void {
  if (!forcePreview && (!isAudioCuesEnabled() || !isCompletionCuesEnabled())) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Harmonic progression: C5 -> E5 -> G5 -> C6
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.75);
    });
  } catch {
    // ignore
  }
}

/**
 * Resonant, soothing warm chime when a study session or timer completes
 */
export function playTimerCompleteSound(forcePreview = false): void {
  if (!forcePreview && (!isAudioCuesEnabled() || !isTimerAlertsEnabled())) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Two-tone chime (D5: 587.33Hz, then A5: 880Hz)
    const tones = [587.33, 880];
    tones.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.2);

      gain.gain.setValueAtTime(0, now + index * 0.2);
      gain.gain.linearRampToValueAtTime(0.22, now + index * 0.2 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.2 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.2);
      osc.stop(now + index * 0.2 + 0.95);
    });
  } catch {
    // ignore
  }
}

/**
 * Snappy confirmation sound for practical lab challenge solved / flag captured
 */
export function playFlagCapturedSound(forcePreview = false): void {
  if (!forcePreview && (!isAudioCuesEnabled() || !isCompletionCuesEnabled())) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch {
    // ignore
  }
}
