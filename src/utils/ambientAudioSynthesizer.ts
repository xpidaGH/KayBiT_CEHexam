/**
 * Procedural Web Audio API Synthesizer for Deep Work Ambient Soundscapes
 * Generates continuous, seamless acoustic masking without external network assets.
 */

import { AmbientSoundId } from '../data/ambientNoiseData';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSoundId: AmbientSoundId | null = null;
  private activeNodes: {
    sources: (AudioBufferSourceNode | OscillatorNode)[];
    filters: BiquadFilterNode[];
    gains: GainNode[];
    intervals: number[];
  } | null = null;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /**
   * Generates a 5-second seamless loop buffer of Pink Noise using Paul Kellet's 7-filter method
   */
  private createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  /**
   * Generates a 5-second seamless loop buffer of Brown (Brownian / Red) Noise
   */
  private createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 5;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain scaling
      }
    }
    return buffer;
  }

  /**
   * Tear down current sound nodes smoothly
   */
  private stopCurrentNodes() {
    if (this.activeNodes) {
      this.activeNodes.intervals.forEach(id => clearInterval(id));
      this.activeNodes.sources.forEach(source => {
        try {
          source.stop();
          source.disconnect();
        } catch {
          // Ignore if already stopped
        }
      });
      this.activeNodes.filters.forEach(filter => {
        try { filter.disconnect(); } catch { /* noop */ }
      });
      this.activeNodes.gains.forEach(gain => {
        try { gain.disconnect(); } catch { /* noop */ }
      });
      this.activeNodes = null;
    }
    this.currentSoundId = null;
  }

  /**
   * Start or switch soundscape
   */
  public play(soundId: AmbientSoundId, volume: number) {
    const ctx = this.initContext();
    this.setVolume(volume);

    // If same sound is already playing, simply ensure running
    if (this.currentSoundId === soundId && this.activeNodes) {
      if (ctx.state === 'suspended') ctx.resume();
      return;
    }

    this.stopCurrentNodes();
    this.currentSoundId = soundId;

    const sources: (AudioBufferSourceNode | OscillatorNode)[] = [];
    const filters: BiquadFilterNode[] = [];
    const gains: GainNode[] = [];
    const intervals: number[] = [];

    const now = ctx.currentTime;

    if (soundId === 'rainfall') {
      // 1. Dual-layer rain: Brownian rumble + filtered pink hiss
      const brownBuf = this.createBrownNoiseBuffer(ctx);
      const brownSource = ctx.createBufferSource();
      brownSource.buffer = brownBuf;
      brownSource.loop = true;

      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.setValueAtTime(450, now);

      const brownGain = ctx.createGain();
      brownGain.gain.setValueAtTime(0.7, now);

      brownSource.connect(lowFilter);
      lowFilter.connect(brownGain);
      brownGain.connect(this.masterGain!);

      // High-frequency rainfall drops
      const pinkBuf = this.createPinkNoiseBuffer(ctx);
      const pinkSource = ctx.createBufferSource();
      pinkSource.buffer = pinkBuf;
      pinkSource.loop = true;

      const bandFilter = ctx.createBiquadFilter();
      bandFilter.type = 'bandpass';
      bandFilter.frequency.setValueAtTime(1400, now);
      bandFilter.Q.setValueAtTime(0.7, now);

      // Rain wave LFO modulation
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, now); // slow rain surge
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(300, now);
      lfo.connect(lfoGain);
      lfoGain.connect(bandFilter.frequency);

      const pinkGain = ctx.createGain();
      pinkGain.gain.setValueAtTime(0.45, now);

      pinkSource.connect(bandFilter);
      bandFilter.connect(pinkGain);
      pinkGain.connect(this.masterGain!);

      brownSource.start();
      pinkSource.start();
      lfo.start();

      sources.push(brownSource, pinkSource, lfo);
      filters.push(lowFilter, bandFilter);
      gains.push(brownGain, pinkGain, lfoGain);
    } else if (soundId === 'cafe') {
      // 2. Cafe Ambience: Warm Brownian acoustic blanket with bandpass resonance
      const brownBuf = this.createBrownNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = brownBuf;
      source.loop = true;

      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(550, now);
      filter1.Q.setValueAtTime(1.2, now);

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(1200, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.85, now);

      source.connect(filter1);
      filter1.connect(filter2);
      filter2.connect(gain);
      gain.connect(this.masterGain!);

      // Subtle occasional harmonic resonance simulating cafe distance
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.015, now);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain!);

      source.start();
      osc.start();

      sources.push(source, osc);
      filters.push(filter1, filter2);
      gains.push(gain, oscGain);
    } else if (soundId === 'whitenoise') {
      // 3. Pink Noise: Standard acoustic masking for high-intensity study
      const pinkBuf = this.createPinkNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = pinkBuf;
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3200, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.75, now);

      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(this.masterGain!);

      source.start();
      sources.push(source);
      filters.push(lowpass);
      gains.push(gain);
    } else if (soundId === 'drone') {
      // 4. Cyber Drone (Theta 4Hz): Dual oscillators for theta wave brain synchronization
      // 55Hz (A1) on left/center, 59Hz on right -> 4Hz Theta beat
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, now);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(59, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);
      filter.Q.setValueAtTime(2.0, now);

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.4, now);

      // Add gentle brown noise floor for sub-hum realism
      const brownBuf = this.createBrownNoiseBuffer(ctx);
      const brownSource = ctx.createBufferSource();
      brownSource.buffer = brownBuf;
      brownSource.loop = true;

      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(90, now);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.3, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.masterGain!);

      brownSource.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(this.masterGain!);

      osc1.start();
      osc2.start();
      brownSource.start();

      sources.push(osc1, osc2, brownSource);
      filters.push(filter, subFilter);
      gains.push(droneGain, subGain);
    }

    this.activeNodes = { sources, filters, gains, intervals };
  }

  /**
   * Set volume with smooth ramping to prevent audio clicking
   */
  public setVolume(volume0to100: number, isMuted: boolean = false) {
    if (!this.masterGain || !this.ctx) return;
    const targetGain = isMuted ? 0 : Math.max(0, Math.min(1, volume0to100 / 100));
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.08);
  }

  /**
   * Pause/Stop playback
   */
  public stop() {
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.05);
      setTimeout(() => {
        this.stopCurrentNodes();
      }, 60);
    } else {
      this.stopCurrentNodes();
    }
  }

  public isPlaying(): boolean {
    return this.activeNodes !== null;
  }

  public getActiveSound(): AmbientSoundId | null {
    return this.currentSoundId;
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
