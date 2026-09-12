/**
 * Background White Noise & Deep Work Ambient Audio Configurations
 * Centralized data and parameter definitions for procedural Web Audio synthesis.
 */

export type AmbientSoundId = 'rainfall' | 'cafe' | 'whitenoise' | 'drone';

export interface AmbientSoundscapeConfig {
  id: AmbientSoundId;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  defaultVolume: number; // 0.0 to 1.0
  recommendedUse: string;
}

export const AMBIENT_SOUNDSCAPES: AmbientSoundscapeConfig[] = [
  {
    id: 'rainfall',
    name: 'Soft Rainfall',
    tagline: 'Continuous gentle rain & droplet diffusion',
    description: 'Biquad low-pass filtered stochastic noise with gentle low-frequency wave modulation, mirroring natural rainfall.',
    badge: 'Relaxation & Focus',
    defaultVolume: 0.5,
    recommendedUse: 'Reading blueprint documentation & long study sessions'
  },
  {
    id: 'cafe',
    name: 'Cafe Ambience',
    tagline: 'Muffled warm acoustics & gentle harmonics',
    description: 'Multi-band Brownian noise blended with resonant harmonic intervals simulating a tranquil study cafe.',
    badge: 'Creative Flow',
    defaultVolume: 0.45,
    recommendedUse: 'Writing lab notes, Python exploit scripts & tools analysis'
  },
  {
    id: 'whitenoise',
    name: 'Pink Noise (Acoustic Masking)',
    tagline: 'Balanced -3dB/octave spectral density',
    description: 'Engineered pink noise utilizing a 7-stage pole filter array to maximize speech masking and auditory isolation.',
    badge: 'Cognitive Masking',
    defaultVolume: 0.4,
    recommendedUse: 'Memorizing flashcards & high-intensity quiz simulations'
  },
  {
    id: 'drone',
    name: 'Cyber Drone (4Hz Theta)',
    tagline: '55Hz grounding tone with theta binaural pulse',
    description: 'Sub-harmonic dual detuned sine waves layered over warm Brownian hum inducing theta-frequency mental states.',
    badge: 'Deep Problem Solving',
    defaultVolume: 0.35,
    recommendedUse: 'Practical exam 6-hour lab challenges & terminal exploits'
  }
];

export interface AmbientPlayerState {
  isPlaying: boolean;
  activeSoundId: AmbientSoundId;
  volume: number; // 0 to 100
  isMuted: boolean;
}

export const DEFAULT_AMBIENT_SETTINGS: AmbientPlayerState = {
  isPlaying: false,
  activeSoundId: 'rainfall',
  volume: 45,
  isMuted: false
};
