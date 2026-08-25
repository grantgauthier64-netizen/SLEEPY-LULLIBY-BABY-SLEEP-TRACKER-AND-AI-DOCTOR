import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, BookOpen, Clock, Heart, Sparkles, 
  Wind, CloudRain, Music, ChevronRight, CheckCircle2, Sliders, X, Layers, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import { SOOTHING_SOUNDS, SLEEP_GUIDES } from '../data/sleepData';
import { soundEngine, SoundLayerConfig } from '../utils/audioSynthesizer';
import { SoundTrack, SleepGuide } from '../types';

interface SoundsAndGuidesSectionProps {
  activeSoundId: string | null;
  onToggleSound: (track: SoundTrack) => void;
  onStopSound: () => void;
}

const INITIAL_MIXER_LAYERS: SoundLayerConfig[] = [
  { id: 'rain-gentle', name: 'Gentle Rain', type: 'rain', volume: 0.6, enabled: false },
  { id: 'womb-heartbeat', name: 'Womb & Heartbeat', type: 'heartbeat', volume: 0.7, enabled: false },
  { id: 'pink-noise-cozy', name: 'Pink Noise (Acoustic Mask)', type: 'pink_noise', volume: 0.5, enabled: false },
  { id: 'ocean-drift', name: 'Rhythmic Ocean Waves', type: 'ocean_waves', volume: 0.5, enabled: false },
  { id: 'brown-noise-deep', name: 'Deep Brown Noise (Low Rumbler)', type: 'brown_noise', volume: 0.4, enabled: false },
  { id: 'brahms-lullaby', name: 'Music Box Chimes', type: 'lullaby_melody', volume: 0.35, enabled: false }
];

export const SoundsAndGuidesSection: React.FC<SoundsAndGuidesSectionProps> = ({
  activeSoundId,
  onToggleSound,
  onStopSound,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<SleepGuide | null>(null);
  const [masterVolume, setMasterVolume] = useState<number>(0.6);
  const [timerDuration, setTimerDuration] = useState<number>(30); // 0 = continuous
  const [activeTab, setActiveTab] = useState<'sounds' | 'mixer' | 'guides'>('sounds');
  const [mixerLayers, setMixerLayers] = useState<SoundLayerConfig[]>(INITIAL_MIXER_LAYERS);
  const [isMixerPlaying, setIsMixerPlaying] = useState<boolean>(false);

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
    soundEngine.setVolume(val);
  };

  const handleLayerToggle = (layerId: string) => {
    setMixerLayers(prev => {
      const updated = prev.map(layer => {
        if (layer.id === layerId) {
          const nextEnabled = !layer.enabled;
          soundEngine.setMixerLayer(layer.type, layer.id, nextEnabled, layer.volume);
          return { ...layer, enabled: nextEnabled };
        }
        return layer;
      });
      const anyActive = updated.some(l => l.enabled);
      setIsMixerPlaying(anyActive);
      return updated;
    });
  };

  const handleLayerVolumeChange = (layerId: string, val: number) => {
    setMixerLayers(prev => {
      return prev.map(layer => {
        if (layer.id === layerId) {
          if (layer.enabled) {
            soundEngine.setMixerLayer(layer.type, layer.id, true, val);
          }
          return { ...layer, volume: val };
        }
        return layer;
      });
    });
  };

  const handleApplyPreset = (presetName: string) => {
    soundEngine.stop();
    let newLayers = mixerLayers.map(l => ({ ...l, enabled: false }));

    if (presetName === 'womb_haven') {
      newLayers = newLayers.map(l => {
        if (l.id === 'womb-heartbeat') return { ...l, enabled: true, volume: 0.75 };
        if (l.id === 'pink-noise-cozy') return { ...l, enabled: true, volume: 0.45 };
        return l;
      });
    } else if (presetName === 'rain_sanctuary') {
      newLayers = newLayers.map(l => {
        if (l.id === 'rain-gentle') return { ...l, enabled: true, volume: 0.7 };
        if (l.id === 'brown-noise-deep') return { ...l, enabled: true, volume: 0.4 };
        return l;
      });
    } else if (presetName === 'ocean_lullaby') {
      newLayers = newLayers.map(l => {
        if (l.id === 'ocean-drift') return { ...l, enabled: true, volume: 0.65 };
        if (l.id === 'brahms-lullaby') return { ...l, enabled: true, volume: 0.35 };
        return l;
      });
    } else if (presetName === 'deep_blocker') {
      newLayers = newLayers.map(l => {
        if (l.id === 'pink-noise-cozy') return { ...l, enabled: true, volume: 0.6 };
        if (l.id === 'brown-noise-deep') return { ...l, enabled: true, volume: 0.5 };
        return l;
      });
    }

    setMixerLayers(newLayers);
    newLayers.forEach(l => {
      if (l.enabled) {
        soundEngine.setMixerLayer(l.type, l.id, true, l.volume);
      }
    });
    soundEngine.setMixerTimer(timerDuration);
    setIsMixerPlaying(true);
  };

  const handleStopAllMixer = () => {
    soundEngine.stop();
    setMixerLayers(prev => prev.map(l => ({ ...l, enabled: false })));
    setIsMixerPlaying(false);
  };

  const getSoundIcon = (name: string) => {
    switch (name) {
      case 'Waves': return <Wind className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Volume2': return <Volume2 className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5" />;
      case 'Wind': return <Wind className="w-5 h-5" />;
      case 'Music': return <Music className="w-5 h-5" />;
      default: return <Volume2 className="w-5 h-5" />;
    }
  };

  return (
    <section id="sounds-guides" className="py-20 bg-[#FFFBF7]/60 backdrop-blur-[1px] relative overflow-hidden border-t border-[#F0E6DD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-block px-4 py-1.5 bg-[#E8F5E9] text-[#1E7B28] rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs border border-[#C8E6C9]">
            Sound Machine & Multi-Layer Mixer • Deep Rest Toolkit
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Soothe in seconds with <span className="text-[#FF5A5F] italic">custom ambient layers & expert guides</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Continuous acoustic masking mimics the gentle whoosh of the womb.
            Play curated single tracks, blend your own custom sound mix, or explore pediatric soothing routines.
          </p>

          {/* 3-Tab Switcher */}
          <div className="pt-2 flex items-center justify-center flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('sounds')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sounds'
                  ? 'bg-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/35 scale-105'
                  : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC] hover:bg-[#FFF1F2] hover:text-[#FF5A5F]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Sound Machine ({SOOTHING_SOUNDS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('mixer')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'mixer'
                  ? 'bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/35 scale-105'
                  : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC] hover:bg-[#F5F3FF] hover:text-[#7C3AED]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Multi-Track Sound Mixer</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-amber-950">
                New
              </span>
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'guides'
                  ? 'bg-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/35 scale-105'
                  : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC] hover:bg-[#FFF1F2] hover:text-[#FF5A5F]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Pediatric Guides ({SLEEP_GUIDES.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SOOTHING SOUND MACHINE (SINGLE TRACKS) */}
        {activeTab === 'sounds' && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Active Synthesizer Dashboard */}
            <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F0E6DD]">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] flex items-center gap-2">
                    <span>Single Sound Generator</span>
                    {activeSoundId && (
                      <span className="px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E7B28] text-xs font-extrabold border border-[#C8E6C9] animate-pulse">
                        Now Playing
                      </span>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#57534E] mt-0.5">
                    Synthesized locally in your browser using safe, low-pass filtered frequencies.
                  </p>
                </div>

                {/* Master Volume & Extended Timer Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#FFFBF7] px-4 py-2 rounded-full border-2 border-[#E7DDD5]">
                    <Sliders className="w-4 h-4 text-[#FF5A5F]" />
                    <span className="text-xs font-extrabold text-[#1C1917]">Volume:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={masterVolume}
                      onChange={handleMasterVolumeChange}
                      className="w-24 accent-[#FF5A5F] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#1C1917]">{Math.round(masterVolume * 100)}%</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#FFFBF7] px-3.5 py-1.5 rounded-full border-2 border-[#E7DDD5]">
                    <Clock className="w-4 h-4 text-[#FF5A5F]" />
                    <span className="text-xs font-extrabold text-[#1C1917]">Timer:</span>
                    {[15, 30, 45, 60, 90, 0].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimerDuration(t);
                          if (activeSoundId) {
                            soundEngine.play(
                              SOOTHING_SOUNDS.find(s => s.id === activeSoundId)?.synthesizerType || 'pink_noise',
                              activeSoundId,
                              t
                            );
                          }
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                          timerDuration === t
                            ? 'bg-[#FF5A5F] text-white shadow-xs'
                            : 'bg-white text-[#1C1917] border border-[#D6C7BC] hover:bg-[#F0E6DD]'
                        }`}
                      >
                        {t === 0 ? '∞ All Night' : `${t}m`}
                      </button>
                    ))}
                  </div>

                  {activeSoundId && (
                    <button
                      onClick={onStopSound}
                      className="px-4 py-2 rounded-full text-xs font-extrabold text-[#B91C1C] bg-[#FEE2E2] border border-[#FCA5A5] hover:bg-[#FCA5A5] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Sound</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sound Tracks Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SOOTHING_SOUNDS.map((track) => {
                  const isThisPlaying = activeSoundId === track.id;
                  return (
                    <div
                      key={track.id}
                      className={`rounded-3xl border-2 p-6 transition-all duration-300 relative flex flex-col justify-between ${
                        isThisPlaying
                          ? 'bg-[#FFF7ED] border-[#FF5A5F] shadow-md shadow-[#FF5A5F]/15 ring-2 ring-[#FF5A5F]/20'
                          : 'bg-[#FFFBF7] border-[#E7DDD5] hover:border-[#D6C7BC] hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isThisPlaying ? 'bg-[#FF5A5F] text-white' : 'bg-white text-[#4A3F35] border border-[#E7DDD5]'
                          }`}>
                            {getSoundIcon(track.icon)}
                          </div>
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-white border border-[#E7DDD5] text-[#57534E]">
                            {track.category}
                          </span>
                        </div>

                        <h4 className="font-serif text-lg font-bold text-[#1C1917] mb-1">
                          {track.name}
                        </h4>
                        <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                          {track.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#F0E6DD] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#78716C]">
                          ⏱️ {timerDuration === 0 ? 'Continuous' : `${timerDuration}m session`}
                        </span>
                        <button
                          onClick={() => onToggleSound(track)}
                          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                            isThisPlaying
                              ? 'bg-[#B91C1C] text-white shadow-md shadow-[#B91C1C]/25 hover:bg-[#991B1B]'
                              : 'bg-[#FF5A5F] text-white hover:bg-[#FF4147] shadow-md shadow-[#FF5A5F]/25 active:scale-95'
                          }`}
                        >
                          {isThisPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Play Track</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-TRACK SOUND MIXER (CUSTOM SOUNDSCAPE BLENDER) */}
        {activeTab === 'mixer' && (
          <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn">
            
            {/* Top Mixer Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F0E6DD]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                    Custom Multi-Track Sound Mixer
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                    Simultaneous Multi-Layer
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#57534E] mt-1">
                  Blend multiple soothing audio layers together (e.g. Rain + Womb Heartbeat + Pink Noise) with individual volume sliders.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Timer selector */}
                <div className="flex items-center gap-1.5 bg-[#FFFBF7] px-3.5 py-1.5 rounded-full border-2 border-[#E7DDD5]">
                  <Clock className="w-4 h-4 text-[#7C3AED]" />
                  <span className="text-xs font-extrabold text-[#1C1917]">Timer:</span>
                  {[15, 30, 60, 90, 0].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTimerDuration(t);
                        soundEngine.setMixerTimer(t);
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                        timerDuration === t
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : 'bg-white text-[#1C1917] border border-[#D6C7BC] hover:bg-[#F0E6DD]'
                      }`}
                    >
                      {t === 0 ? '∞ All Night' : `${t}m`}
                    </button>
                  ))}
                </div>

                {isMixerPlaying && (
                  <button
                    onClick={handleStopAllMixer}
                    className="px-4 py-2 rounded-full text-xs font-extrabold text-[#B91C1C] bg-[#FEE2E2] border border-[#FCA5A5] hover:bg-[#FCA5A5] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span>Mute All Layers</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="p-5 rounded-3xl bg-[#F5F3FF] border-2 border-[#DDD6FE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#6D28D9] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Curated Soundscape Presets:</span>
                </span>
                <span className="text-xs text-[#5B21B6] font-semibold">1-Tap Load</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleApplyPreset('womb_haven')}
                  className="p-3 rounded-2xl bg-white border-2 border-[#DDD6FE] hover:border-[#7C3AED] hover:shadow-xs transition-all text-left cursor-pointer active:scale-95"
                >
                  <span className="text-base block">🤰</span>
                  <strong className="text-xs font-bold text-[#1C1917] block mt-1">Womb Haven</strong>
                  <span className="text-[10px] text-[#57534E]">Heartbeat + Pink Noise</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('rain_sanctuary')}
                  className="p-3 rounded-2xl bg-white border-2 border-[#DDD6FE] hover:border-[#7C3AED] hover:shadow-xs transition-all text-left cursor-pointer active:scale-95"
                >
                  <span className="text-base block">🌧️</span>
                  <strong className="text-xs font-bold text-[#1C1917] block mt-1">Rain Sanctuary</strong>
                  <span className="text-[10px] text-[#57534E]">Gentle Rain + Brown Noise</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('ocean_lullaby')}
                  className="p-3 rounded-2xl bg-white border-2 border-[#DDD6FE] hover:border-[#7C3AED] hover:shadow-xs transition-all text-left cursor-pointer active:scale-95"
                >
                  <span className="text-base block">🌊</span>
                  <strong className="text-xs font-bold text-[#1C1917] block mt-1">Ocean Lullaby</strong>
                  <span className="text-[10px] text-[#57534E]">Ocean Waves + Music Chimes</span>
                </button>
                <button
                  onClick={() => handleApplyPreset('deep_blocker')}
                  className="p-3 rounded-2xl bg-white border-2 border-[#DDD6FE] hover:border-[#7C3AED] hover:shadow-xs transition-all text-left cursor-pointer active:scale-95"
                >
                  <span className="text-base block">🛡️</span>
                  <strong className="text-xs font-bold text-[#1C1917] block mt-1">Deep Sound Shield</strong>
                  <span className="text-[10px] text-[#57534E]">Pink + Brown Noise Mask</span>
                </button>
              </div>
            </div>

            {/* Individual Channel Strips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mixerLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-5 rounded-3xl border-2 transition-all space-y-4 ${
                    layer.enabled
                      ? 'bg-[#FAF5FF] border-[#7C3AED] shadow-sm ring-2 ring-[#7C3AED]/20'
                      : 'bg-[#FFFBF7] border-[#E7DDD5] hover:border-[#D6C7BC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1C1917]">{layer.name}</h4>
                      <span className="text-[11px] font-semibold text-[#57534E]">
                        {layer.enabled ? `Playing @ ${Math.round(layer.volume * 100)}%` : 'Muted'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleLayerToggle(layer.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                        layer.enabled
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : 'bg-white text-[#1C1917] border border-[#D6C7BC] hover:bg-[#F5F3FF]'
                      }`}
                    >
                      {layer.enabled ? 'Active ✓' : '+ Enable Layer'}
                    </button>
                  </div>

                  {/* Volume Fader Slider */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-[#57534E] font-bold">
                      <span className="flex items-center gap-1">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C3AED]" />
                        <span>Channel Level</span>
                      </span>
                      <span className="text-[#1C1917] font-extrabold">{Math.round(layer.volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={layer.volume}
                      disabled={!layer.enabled}
                      onChange={(e) => handleLayerVolumeChange(layer.id, parseFloat(e.target.value))}
                      className={`w-full accent-[#7C3AED] cursor-pointer ${!layer.enabled && 'opacity-40 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Master Output Status Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#7C3AED]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold">
                  🎛️
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#1C1917]">
                    Active Layers: {mixerLayers.filter(l => l.enabled).length} of {mixerLayers.length}
                  </h5>
                  <p className="text-xs text-[#57534E]">
                    Audio outputs are mixed in real time with continuous loop smoothing.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#57534E]">Master Gain:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVolume}
                  onChange={handleMasterVolumeChange}
                  className="w-24 accent-[#7C3AED] cursor-pointer"
                />
                <span className="text-xs font-extrabold text-[#1C1917]">{Math.round(masterVolume * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PEDIATRIC SOOTHING GUIDES */}
        {activeTab === 'guides' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SLEEP_GUIDES.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 shadow-sm hover:border-[#FF5A5F]/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]">
                        {guide.category}
                      </span>
                      <span className="text-xs font-bold text-[#78716C] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {guide.readTime}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#1C1917] mb-2 leading-snug">
                      {guide.title}
                    </h4>
                    <p className="text-xs text-[#57534E] leading-relaxed mb-4">
                      {guide.summary}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[#F0E6DD]">
                      <span className="text-[11px] font-extrabold uppercase text-[#1C1917] tracking-wider block mb-1">
                        Step-by-step Protocol:
                      </span>
                      {guide.keySteps.slice(0, 3).map((step, idx) => (
                        <div key={idx} className="text-xs text-[#292524] flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedGuide(guide)}
                    className="w-full py-2.5 rounded-2xl bg-[#FFFBF7] hover:bg-[#FFF1F2] border-2 border-[#D6C7BC] hover:border-[#FF5A5F] text-[#1C1917] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Read Complete Pediatric Guide</span>
                    <ChevronRight className="w-4 h-4 text-[#FF5A5F]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Guide Modal */}
        {selectedGuide && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#E7DDD5] animate-scaleUp">
              <div className="flex items-start justify-between gap-4 border-b border-[#F0E6DD] pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]">
                    {selectedGuide.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-2">
                    {selectedGuide.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="p-2 rounded-full bg-[#F5EFEB] hover:bg-[#E7DDD5] text-[#1C1917] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] text-sm text-[#292524] leading-relaxed">
                <strong className="text-[#1C1917] font-bold">Summary: </strong>
                {selectedGuide.summary}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-[#1C1917] tracking-wider">
                  Clinical Step-by-Step Procedure:
                </h4>
                <div className="space-y-2.5">
                  {selectedGuide.keySteps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-[#0C4A6E] font-medium leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF3C7]/80 border-2 border-[#FDE68A] text-xs text-[#92400E] leading-relaxed">
                <strong>Pediatric Note:</strong> {selectedGuide.pediatricNote || 'Consistency and a soothing, dimly-lit bedtime ritual trigger natural melatonin release in infants.'}
              </div>

              <button
                onClick={() => setSelectedGuide(null)}
                className="w-full py-3 rounded-2xl bg-[#FF5A5F] hover:bg-[#FF4147] text-white font-extrabold text-sm shadow-md cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
