import React, { useState, useEffect } from 'react';
import { Moon, Sun, Sparkles, Play, Pause, Clock, ShieldCheck, Heart, ArrowRight, CheckCircle2, Volume2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenStartTracking: () => void;
  onExploreFeatures: () => void;
  onPlayQuickSound: () => void;
  onOpenAIAgent: () => void;
  isQuickSoundPlaying: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenStartTracking,
  onExploreFeatures,
  onPlayQuickSound,
  onOpenAIAgent,
  isQuickSoundPlaying,
}) => {
  const [isBabySleeping, setIsBabySleeping] = useState(true);
  const [sleepSeconds, setSleepSeconds] = useState(6120); // 1h 42m
  const [wakeMinutesElapsed, setWakeMinutesElapsed] = useState(48);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isBabySleeping) {
        setSleepSeconds((prev) => prev + 1);
      } else {
        setWakeMinutesElapsed((prev) => (prev >= 120 ? 0 : prev + 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isBabySleeping]);

  const formatHoursMinutes = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <section
      id="hero-section"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#FFFBF7]/50 backdrop-blur-[0.5px]"
    >
      {/* Decorative Pastel Ambient Orbs */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#FFB7B2]/15 via-[#D1C4E9]/15 to-[#B2E2F2]/20 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-48 right-[-100px] w-96 h-96 bg-[#E8F5E9]/30 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Floating Gentle Badges */}
      <div className="absolute top-24 left-[8%] hidden lg:block animate-float-gentle opacity-90">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#E0D7D0] text-xs font-bold text-[#1C1917] shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F]" />
          <span>Sweet Spot: 2.25h window</span>
        </div>
      </div>
      <div className="absolute top-36 right-[10%] hidden lg:block animate-float-slow opacity-95">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#C8E6C9] text-xs font-bold text-[#1E7B28] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#1E7B28]" />
          <span>96% Optimal Rest Score</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Friendly Hero Copy matching Professional Polish archetype */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Trusted Badge */}
            <div className="inline-block px-4 py-1.5 bg-[#E8F5E9] text-[#1E7B28] rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs border border-[#C8E6C9]">
              Trusted by 50k+ Parents
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight font-bold text-[#1C1917]">
              Better sleep for baby, <br />
              <span className="text-[#FF5A5F] italic">more rest for you.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[#292524] font-normal max-w-lg leading-relaxed mx-auto lg:mx-0">
              Transform your nights with data-driven insights. Understand your baby's natural rhythms, predict circadian sweet spots, and build healthy sleep habits from day one.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-start-tracking-cta"
                onClick={onOpenStartTracking}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#FF5A5F] hover:bg-[#FF4147] text-white rounded-full font-bold shadow-xl shadow-[#FF5A5F]/35 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <span>Start Tracking</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-ai-agent-cta"
                onClick={onOpenAIAgent}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#EDE9FE] to-[#F3E8FF] hover:from-[#DDD6FE] hover:to-[#E9D5FF] border-2 border-[#8B5CF6] text-[#5B21B6] rounded-full font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                <span>AI Doctor</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#7C3AED] text-white">Ada + GPT</span>
              </button>

              <button
                id="hero-explore-features-cta"
                onClick={onExploreFeatures}
                className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-[#1C1917] rounded-full font-bold text-[#1C1917] hover:bg-[#F5EFEB] shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>Live AI Dashboard</span>
              </button>
            </div>

            {/* Reassurance Checkmarks */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#1C1917]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1E7B28]" />
                <span>No harsh sleep training</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1E7B28]" />
                <span>One-tap caregiver sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1E7B28]" />
                <span>AAP Guidelines Compliant</span>
              </div>
            </div>

          </div>

          {/* Right Column: Layered Card Motif with Rotated Sky Blue Backdrop */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              
              {/* Rotated Pastel Accent Layer */}
              <div className="absolute inset-0 bg-[#00B4D8] rounded-[40px] opacity-15 rotate-3 pointer-events-none" />

              {/* Main Foreground Card */}
              <div className="relative bg-white rounded-[40px] shadow-2xl border border-[#E0D7D0] p-6 sm:p-8 flex flex-col gap-6">
                
                {/* Header with sleep state & quality badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#FFE57F] flex items-center justify-center text-xl shadow-xs">
                      👶
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1C1917]">Tonight's Sleep Quality</h3>
                      <p className="text-xs font-medium text-[#57534E]">Baby Maya • 5.5 months</p>
                    </div>
                  </div>
                  <span className="text-[#1E7B28] bg-[#E8F5E9] border border-[#C8E6C9] px-3.5 py-1 rounded-full text-xs font-bold">
                    {isBabySleeping ? 'Excellent' : 'Active Wake'}
                  </span>
                </div>

                {/* Sleep Graph Visualization */}
                <div className="space-y-2">
                  <div className="flex items-end gap-2 h-28 px-2 pt-2 bg-[#FFFBF7] rounded-2xl border border-[#E7DDD5]">
                    <div className="flex-1 bg-[#48CAE4] rounded-t-md h-[40%] hover:opacity-85 transition-all" title="Nap 1: 45m" />
                    <div className="flex-1 bg-[#48CAE4] rounded-t-md h-[60%] hover:opacity-85 transition-all" title="Nap 2: 1h 15m" />
                    <div className="flex-1 bg-[#FF5A5F] rounded-t-md h-[90%] hover:opacity-85 transition-all" title="Core Night Rest: 5h 30m" />
                    <div className="flex-1 bg-[#48CAE4] rounded-t-md h-[75%] hover:opacity-85 transition-all" title="Morning Stretch: 3h 10m" />
                    <div className="flex-1 bg-[#48CAE4] rounded-t-md h-[85%] hover:opacity-85 transition-all" title="Afternoon Rest: 1h 45m" />
                    <div className="flex-1 bg-[#FF5A5F] rounded-t-md h-[55%] hover:opacity-85 transition-all" title="Active Window" />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#57534E] px-2 font-bold">
                    <span>7 AM</span>
                    <span>11 AM</span>
                    <span>3 PM</span>
                    <span>7 PM</span>
                    <span>11 PM</span>
                    <span>3 AM</span>
                  </div>
                </div>

                {/* Live Stats Rows matching design */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-[#F0E6DD] pb-2">
                    <span className="font-semibold text-[#57534E]">Total Duration</span>
                    <span className="font-bold text-[#1C1917]">
                      {isBabySleeping ? formatHoursMinutes(sleepSeconds) : '10h 42m'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-[#F0E6DD] pb-2">
                    <span className="font-semibold text-[#57534E]">Wake-ups</span>
                    <span className="font-bold text-[#1C1917]">1 time (quick feed)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-[#57534E]">Next Sweet Spot Window</span>
                    <span className="font-extrabold text-[#FF5A5F]">
                      {isBabySleeping ? 'Rest in Progress' : `In ${Math.max(0, 135 - wakeMinutesElapsed)} mins`}
                    </span>
                  </div>
                </div>

                {/* Interactive Controls Bar inside Card */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    id="hero-toggle-sleep-state-btn"
                    onClick={() => setIsBabySleeping(!isBabySleeping)}
                    className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-2 border-[#1C1917] bg-[#FFFBF7] hover:bg-[#F0E6DD] text-[#1C1917] active:scale-95"
                  >
                    {isBabySleeping ? (
                      <>
                        <Moon className="w-3.5 h-3.5 text-[#7C3AED] fill-current" />
                        <span>Status: Sleeping (Tap to Wake)</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Status: Awake (Tap to Sleep)</span>
                      </>
                    )}
                  </button>

                  <button
                    id="hero-quick-sound-btn"
                    onClick={onPlayQuickSound}
                    className={`py-2.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-2 active:scale-95 ${
                      isQuickSoundPlaying
                        ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-md shadow-[#FF5A5F]/30'
                        : 'bg-white text-[#1C1917] border-[#1C1917] hover:bg-[#FFFBF7]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isQuickSoundPlaying ? 'Pause' : 'Soothing Sound'}</span>
                  </button>
                </div>

                {/* Caregiver Sync status line */}
                <div className="flex items-center justify-between text-xs font-medium text-[#1C1917] pt-1">
                  <span className="flex items-center gap-1">
                    <span>👩‍🦰 Logged by Sarah (Mom)</span>
                  </span>
                  <span className="text-[#1E7B28] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#1E7B28]" />
                    Synced with Dad & Nanny
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
