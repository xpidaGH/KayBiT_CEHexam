import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Volume1, 
  VolumeX, 
  CloudRain, 
  Coffee, 
  Headphones, 
  Radio, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { 
  AMBIENT_SOUNDSCAPES, 
  AmbientSoundId, 
  DEFAULT_AMBIENT_SETTINGS,
  AmbientPlayerState 
} from '../data/ambientNoiseData';
import { STORAGE_KEYS } from '../data/appConfig';
import { ambientAudioEngine } from '../utils/ambientAudioSynthesizer';

export const AmbientNoisePlayer: React.FC = () => {
  // Load saved state from localStorage
  const [playerState, setPlayerState] = useState<AmbientPlayerState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AMBIENT_SOUND_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Do not auto-play on initial load without user interaction (browser autoplay policy)
        return { ...parsed, isPlaying: false };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_AMBIENT_SETTINGS;
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync settings to localStorage whenever sound, volume or mute state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AMBIENT_SOUND_SETTINGS, JSON.stringify({
        isPlaying: false, // Don't persist active playing state across reload
        activeSoundId: playerState.activeSoundId,
        volume: playerState.volume,
        isMuted: playerState.isMuted
      }));
    } catch {
      // Ignore storage errors
    }
  }, [playerState.activeSoundId, playerState.volume, playerState.isMuted]);

  // Handle outside click to close soundscape selector dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  // Clean up audio engine on unmount
  useEffect(() => {
    return () => {
      ambientAudioEngine.stop();
    };
  }, []);

  const currentSoundscape = AMBIENT_SOUNDSCAPES.find(s => s.id === playerState.activeSoundId) || AMBIENT_SOUNDSCAPES[0];

  const handleTogglePlay = () => {
    if (playerState.isPlaying) {
      ambientAudioEngine.stop();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    } else {
      const effectiveVolume = playerState.isMuted ? 0 : playerState.volume;
      ambientAudioEngine.play(playerState.activeSoundId, effectiveVolume);
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const handleSelectSound = (id: AmbientSoundId) => {
    setPlayerState(prev => {
      const next = { ...prev, activeSoundId: id };
      if (prev.isPlaying) {
        const effectiveVolume = prev.isMuted ? 0 : prev.volume;
        ambientAudioEngine.play(id, effectiveVolume);
      }
      return next;
    });
    setIsDropdownOpen(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setPlayerState(prev => {
      const next = { ...prev, volume: newVolume, isMuted: newVolume === 0 ? true : false };
      if (prev.isPlaying) {
        ambientAudioEngine.setVolume(newVolume, next.isMuted);
      }
      return next;
    });
  };

  const handleToggleMute = () => {
    setPlayerState(prev => {
      const newMuted = !prev.isMuted;
      if (prev.isPlaying) {
        ambientAudioEngine.setVolume(prev.volume, newMuted);
      }
      return { ...prev, isMuted: newMuted };
    });
  };

  const getSoundIcon = (id: AmbientSoundId, className = 'w-3.5 h-3.5') => {
    switch (id) {
      case 'rainfall':
        return <CloudRain className={className} />;
      case 'cafe':
        return <Coffee className={className} />;
      case 'whitenoise':
        return <Headphones className={className} />;
      case 'drone':
        return <Radio className={className} />;
      default:
        return <Headphones className={className} />;
    }
  };

  const getVolumeIcon = () => {
    if (playerState.isMuted || playerState.volume === 0) {
      return <VolumeX className="w-3.5 h-3.5 text-rose-400" />;
    }
    if (playerState.volume > 50) {
      return <Volume2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
    return <Volume1 className="w-3.5 h-3.5 text-slate-300" />;
  };

  return (
    <div 
      id="ambient-noise-player-footer"
      className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl text-xs shadow-lg backdrop-blur-md"
      role="region"
      aria-label="Deep Work Ambient Noise Player"
    >
      {/* Soundscape Identifier & Play/Pause Trigger */}
      <div className="flex items-center gap-2">
        <button
          id="btn-toggle-ambient-audio"
          onClick={handleTogglePlay}
          className={`flex items-center justify-center w-8 h-8 rounded-lg font-medium transition-all ${
            playerState.isPlaying
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50 scale-105'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80'
          }`}
          title={playerState.isPlaying ? 'Pause ambient audio' : 'Play deep work background noise'}
          aria-label={playerState.isPlaying ? 'Pause ambient audio' : 'Play deep work background noise'}
        >
          {playerState.isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Ambient Sound Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="btn-ambient-sound-selector"
            type="button"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-950 text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-medium transition-all"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className={playerState.isPlaying ? 'text-emerald-400' : 'text-slate-400'}>
              {getSoundIcon(playerState.activeSoundId)}
            </span>
            <span className="max-w-[90px] sm:max-w-[130px] truncate">
              {currentSoundscape.name}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Soundscape Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className="absolute bottom-full mb-2 left-0 w-64 sm:w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
              role="listbox"
            >
              <div className="px-2 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between border-b border-slate-800 mb-1">
                <span>Ambient Soundscapes</span>
                <span className="flex items-center gap-1 text-emerald-400 font-normal">
                  <Sparkles className="w-3 h-3" /> Web Audio Engine
                </span>
              </div>

              <div className="space-y-1">
                {AMBIENT_SOUNDSCAPES.map((sound) => {
                  const isSelected = sound.id === playerState.activeSoundId;
                  return (
                    <button
                      key={sound.id}
                      type="button"
                      onClick={() => handleSelectSound(sound.id)}
                      className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-colors ${
                        isSelected 
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-white' 
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className={`p-1.5 rounded-md mt-0.5 ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {getSoundIcon(sound.id, 'w-4 h-4')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold">{sound.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {sound.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {sound.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audio Wave / EQ Visualizer Indicator */}
      {playerState.isPlaying && (
        <div className="hidden sm:flex items-center gap-0.5 px-1 h-4" aria-hidden="true">
          <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-pulse" />
          <span className="w-0.5 h-4 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '75ms' }} />
        </div>
      )}

      {/* Volume Controls */}
      <div className="flex items-center gap-1.5 pl-1 border-l border-slate-800">
        <button
          id="btn-ambient-mute"
          type="button"
          onClick={handleToggleMute}
          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={playerState.isMuted ? 'Unmute audio' : 'Mute audio'}
          aria-label={playerState.isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {getVolumeIcon()}
        </button>

        <input
          id="slider-ambient-volume"
          type="range"
          min="0"
          max="100"
          step="1"
          value={playerState.isMuted ? 0 : playerState.volume}
          onChange={handleVolumeChange}
          className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          title={`Volume: ${playerState.isMuted ? 'Muted' : `${playerState.volume}%`}`}
          aria-label="Ambient volume level"
        />

        <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
          {playerState.isMuted ? '0%' : `${playerState.volume}%`}
        </span>
      </div>
    </div>
  );
};
