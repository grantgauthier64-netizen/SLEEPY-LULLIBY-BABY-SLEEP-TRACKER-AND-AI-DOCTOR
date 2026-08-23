import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, BookOpen, Clock, Heart, Sparkles, 
  Wind, CloudRain, Music, ChevronRight, CheckCircle2, Sliders, X
} from 'lucide-react';
import { SOOTHING_SOUNDS, SLEEP_GUIDES } from '../data/sleepData';
import { soundEngine } from '../utils/audioSynthesizer';
import { SoundTrack, SleepGuide } from '../types';

interface SoundsAndGuidesSectionProps {
  activeSoundId: string | null;
  onToggleSound: (track: SoundTrack) => void;
  onStopSound: () => void;
}

export const SoundsAndGuidesSection: React.FC<SoundsAndGuidesSectionProps> = ({
  activeSoundId,
  onToggleSound,
  onStopSound,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<SleepGuide | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const [timerDuration, setTimerDuration] = useState<number>(30); // minutes
  const [activeTab, setActiveTab] = useState<'sounds' | 'guides'>('sounds');

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
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
            Sounds & Pediatric Guides • Deep Rest Toolkit
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Soothe in seconds with <span className="text-[#FF5A5F] italic">gentle sounds & expert guides</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Continuous acoustic masking mimics the gentle whoosh of the womb.
            Paired with proven pediatric soothing guides, bedtime becomes a calm sanctuary.
          </p>

          {/* Tab Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('sounds')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sounds'
                  ? 'bg-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/35 scale-105'
                  : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC] hover:bg-[#FFF1F2] hover:text-[#FF5A5F]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Sound Machine ({SOOTHING_SOUNDS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
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

        {/* Tab 1: Soothing Sound Machine */}
        {activeTab === 'sounds' && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Active Synthesizer Dashboard */}
            <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#F0E6DD]">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] flex items-center gap-2">
                    <span>Soothing Ambient Sound Suite</span>
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

                {/* Master Volume & Timer Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#FFFBF7] px-4 py-2 rounded-full border-2 border-[#E7DDD5]">
                    <Sliders className="w-4 h-4 text-[#FF5A5F]" />
                    <span className="text-xs font-extrabold text-[#1C1917]">Volume:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 accent-[#FF5A5F] cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#1C1917]">{Math.round(volume * 100)}%</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#FFFBF7] px-4 py-2 rounded-full border-2 border-[#E7DDD5]">
                    <Clock className="w-4 h-4 text-[#FF5A5F]" />
                    <span className="text-xs font-extrabold text-[#1C1917]">Timer:</span>
                    {[15, 30, 60].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimerDuration(t)}
                        className={`px-3 py-1 rounded-full text-xs font-extrabold transition-colors cursor-pointer ${
                          timerDuration === t
                            ? 'bg-[#FF5A5F] text-white shadow-xs'
                            : 'bg-white text-[#1C1917] border border-[#D6C7BC] hover:bg-[#F0E6DD]'
                        }`}
                      >
                        {t}m
                      </button>
                    ))}
                  </div>

                  {activeSoundId && (
                    <button
                      onClick={onStopSound}
                      className="px-4 py-2 rounded-full text-xs font-extrabold text-[#B91C1C] bg-[#FEE2E2] border border-[#FCA5A5] hover:bg-[#FCA5A5] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>Stop All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sound Tracks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {SOOTHING_SOUNDS.map((track) => {
                  const isThisPlaying = activeSoundId === track.id;

                  return (
                    <div
                      key={track.id}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-4 ${
                        isThisPlaying
                          ? 'bg-[#FFFBF7] border-[#FF5A5F] shadow-lg ring-2 ring-[#FF5A5F]/20'
                          : 'bg-[#FFFBF7]/60 border-[#E7DDD5] hover:border-[#FF5A5F] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${track.color} shadow-xs font-bold`}>
                            {getSoundIcon(track.icon)}
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#57534E]">
                              {track.category}
                            </span>
                            <h4 className="font-serif font-bold text-base text-[#1C1917]">
                              {track.name}
                            </h4>
                          </div>
                        </div>

                        {/* Play / Pause Toggle Button */}
                        <button
                          onClick={() => onToggleSound(track)}
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${
                            isThisPlaying
                              ? 'bg-[#FF5A5F] text-white hover:bg-[#FF4147] scale-105 shadow-md shadow-[#FF5A5F]/40'
                              : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC] hover:border-[#FF5A5F] hover:text-[#FF5A5F] hover:bg-[#FFF1F2]'
                          }`}
                          aria-label={isThisPlaying ? `Pause ${track.name}` : `Play ${track.name}`}
                        >
                          {isThisPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                        </button>
                      </div>

                      <p className="text-xs text-[#44403C] font-medium leading-relaxed">
                        {track.description}
                      </p>

                      <div className="pt-2 border-t border-[#F0E6DD] flex items-center justify-between text-[11px] font-semibold text-[#57534E]">
                        <span>Safe continuous sound level</span>
                        {isThisPlaying ? (
                          <span className="text-[#1E7B28] font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#1E7B28] animate-ping" />
                            Streaming Audio
                          </span>
                        ) : (
                          <span className="text-[#57534E]">Click play to preview</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Calming Parent Breathing Bubble */}
              <div className="p-6 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2 justify-center sm:justify-start">
                    <span>Parent Calming Breathing Guide</span>
                    <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
                  </h4>
                  <p className="text-xs text-[#44403C] font-medium max-w-xl">
                    Babies co-regulate with their parents’ nervous systems. Take three slow belly breaths with this gentle pacing cycle before putting baby down.
                  </p>
                </div>
                
                {/* Breathing Visualizer Pulsing Circle */}
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#FF5A5F]/20 animate-pulse-subtle" />
                    <div className="w-12 h-12 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center text-xs font-bold shadow-md shadow-[#FF5A5F]/35">
                      Breathe
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#1C1917]">
                    <p>Inhale 4s</p>
                    <p>Hold 4s</p>
                    <p>Exhale 6s</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Pediatric Sleep Guides */}
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {SLEEP_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="p-6 sm:p-8 rounded-[36px] bg-white border-2 border-[#E7DDD5] shadow-sm hover:shadow-md hover:border-[#FF5A5F] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-full text-xs font-extrabold border border-[#D6C7BC] bg-[#FFFBF7] text-[#1C1917]">
                      {guide.category}
                    </span>
                    <span className="text-xs text-[#57534E] flex items-center gap-1 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1C1917] mb-2">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-[#44403C] leading-relaxed mb-4">
                    {guide.summary}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#F0E6DD]">
                    <p className="text-xs font-extrabold uppercase text-[#57534E]">Key Pediatric Steps:</p>
                    <ul className="space-y-1.5">
                      {guide.keySteps.slice(0, 3).map((step, idx) => (
                        <li key={idx} className="text-xs text-[#292524] font-medium flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-[#F0E6DD]">
                  <span className="text-[11px] text-[#1E7B28] font-bold">✓ AAP Safe Sleep Guideline Approved</span>
                  <button
                    onClick={() => setSelectedGuide(guide)}
                    className="px-4 py-2 rounded-full text-xs font-extrabold text-[#FF5A5F] hover:text-white bg-[#FFF1F2] hover:bg-[#FF5A5F] border border-[#FF5A5F]/20 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Read Full Guide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Full Guide Detail View */}
        {selectedGuide && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-scaleUp">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F0E6DD]">
                <div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#E8F5E9] text-[#1E7B28] border border-[#C8E6C9]">
                    {selectedGuide.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-2">
                    {selectedGuide.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="p-2 rounded-full bg-[#FFFBF7] hover:bg-[#F0E6DD] text-[#1C1917] cursor-pointer border-2 border-[#D6C7BC]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-[#1C1917]">
                <p className="text-base leading-relaxed font-normal text-[#292524]">
                  {selectedGuide.summary}
                </p>

                <div className="p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-3">
                  <h4 className="font-serif font-bold text-base text-[#1C1917]">
                    Step-by-Step Instructions:
                  </h4>
                  <ul className="space-y-3">
                    {selectedGuide.keySteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-[#292524] font-medium">
                        <span className="w-6 h-6 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 shadow-xs">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] text-xs text-[#166534] leading-relaxed">
                  <strong className="block font-bold text-[#14532D] mb-1">
                    🏥 Pediatrician Clinical Safety Note:
                  </strong>
                  {selectedGuide.pediatricNote}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="px-6 py-2.5 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 cursor-pointer"
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
