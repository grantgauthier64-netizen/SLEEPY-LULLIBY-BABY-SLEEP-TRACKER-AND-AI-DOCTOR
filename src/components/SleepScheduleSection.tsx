import React, { useState } from 'react';
import { 
  Compass, CheckCircle2, AlertCircle, Download, Clock, Moon, Sun, 
  Sparkles, Sliders, Calendar, ArrowRight, BedDouble, Zap, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AGE_MILESTONES } from '../data/sleepData';

export const SleepScheduleSection: React.FC = () => {
  const [selectedAgeId, setSelectedAgeId] = useState<string>('infant-early');
  const [hasExported, setHasExported] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'calculator'>('calculator');

  // Interactive Wake Window Calculator State
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(5);
  const [morningWakeTime, setMorningWakeTime] = useState<string>('07:00');
  const [napsPerDay, setNapsPerDay] = useState<number>(3);
  const [avgNapLengthMins, setAvgNapLengthMins] = useState<number>(75);

  const selectedMilestone = AGE_MILESTONES.find((m) => m.id === selectedAgeId) || AGE_MILESTONES[1];

  // Dynamic wake window computation based on months
  const calculateWakeWindowMins = (ageMonths: number): { min: number; max: number; label: string } => {
    if (ageMonths <= 1) return { min: 45, max: 60, label: '45–60 mins' };
    if (ageMonths <= 2) return { min: 60, max: 90, label: '60–90 mins' };
    if (ageMonths <= 3) return { min: 75, max: 110, label: '1.25–1.75 hours' };
    if (ageMonths <= 5) return { min: 105, max: 135, label: '1.75–2.25 hours' };
    if (ageMonths <= 7) return { min: 135, max: 165, label: '2.25–2.75 hours' };
    if (ageMonths <= 9) return { min: 165, max: 210, label: '2.75–3.5 hours' };
    if (ageMonths <= 12) return { min: 180, max: 240, label: '3–4 hours' };
    if (ageMonths <= 18) return { min: 240, max: 300, label: '4–5 hours' };
    return { min: 300, max: 360, label: '5–6 hours' };
  };

  const wakeWindowData = calculateWakeWindowMins(babyAgeMonths);

  // Time conversion helper
  const addMinutesToTimeString = (timeStr: string, minutesToAdd: number): string => {
    const [hStr, mStr] = timeStr.split(':');
    let totalMins = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + minutesToAdd;
    totalMins = totalMins % (24 * 60);
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Compute calculated schedule for the day
  const baseWakeWindow = Math.round((wakeWindowData.min + wakeWindowData.max) / 2);
  
  // Nap 1
  const nap1Start = addMinutesToTimeString(morningWakeTime, baseWakeWindow);
  const nap1End = addMinutesToTimeString(nap1Start, avgNapLengthMins);

  // Nap 2
  const nap2Start = addMinutesToTimeString(nap1End, baseWakeWindow + 10);
  const nap2End = addMinutesToTimeString(nap2Start, avgNapLengthMins);

  // Nap 3
  const nap3Start = addMinutesToTimeString(nap2End, baseWakeWindow + 15);
  const nap3End = addMinutesToTimeString(nap3Start, Math.min(45, avgNapLengthMins));

  // Calculated Bedtime
  const lastNapEnd = napsPerDay === 1 ? nap1End : napsPerDay === 2 ? nap2End : nap3End;
  const bedtimeWakeWindow = baseWakeWindow + 20; // last wake window is always the longest
  const calculatedBedtime = addMinutesToTimeString(lastNapEnd, bedtimeWakeWindow);
  const bedtimeEnd = addMinutesToTimeString(calculatedBedtime, 660); // ~11h night sleep

  const handleExport = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#FF5A5F', '#7C3AED', '#0284C7', '#F59E0B', '#10B981']
    });
    setHasExported(true);
    setTimeout(() => setHasExported(false), 3000);
  };

  return (
    <section id="personalized-schedules" className="py-20 bg-[#FFFBF7]/60 backdrop-blur-[1px] relative overflow-hidden border-t border-[#F0E6DD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-block px-4 py-1.5 bg-[#E8F5E9] text-[#1E7B28] rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs border border-[#C8E6C9]">
            Personalized Sleep Schedules & Wake Window Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Predict the exact sweet spot for <span className="text-[#FF5A5F] italic">every nap and bedtime</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Babies aren’t robots, but their circadian biology follows clear wake window limits.
            Use our interactive calculator or explore pediatrician-backed milestone schedules.
          </p>

          {/* Mode Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/35 scale-105'
                  : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC] hover:bg-[#FFF1F2] hover:text-[#FF5A5F]'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Interactive Wake Window Calculator</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-amber-950">
                Active
              </span>
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'presets'
                  ? 'bg-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/35 scale-105'
                  : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC] hover:bg-[#FFF1F2] hover:text-[#FF5A5F]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Milestone Presets ({AGE_MILESTONES.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INTERACTIVE WAKE WINDOW CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-8">
              
              {/* Inputs Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                
                {/* Age Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase text-[#57534E]">Baby Age:</label>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] font-black text-xs">
                      {babyAgeMonths} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={babyAgeMonths}
                    onChange={(e) => {
                      const m = parseInt(e.target.value, 10);
                      setBabyAgeMonths(m);
                      if (m <= 3) setNapsPerDay(4);
                      else if (m <= 7) setNapsPerDay(3);
                      else if (m <= 14) setNapsPerDay(2);
                      else setNapsPerDay(1);
                    }}
                    className="w-full accent-[#FF5A5F] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#78716C] block">
                    Ideal Wake Window: <strong>{wakeWindowData.label}</strong>
                  </span>
                </div>

                {/* Morning Wake Up Time */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase text-[#57534E]">Morning Wake Time:</label>
                  <input
                    type="time"
                    value={morningWakeTime}
                    onChange={(e) => setMorningWakeTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-[#D6C7BC] bg-white font-bold text-sm text-[#1C1917] focus:border-[#FF5A5F] outline-hidden"
                  />
                  <span className="text-[11px] text-[#78716C] block">
                    Anchors today's circadian rhythm
                  </span>
                </div>

                {/* Naps Count */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase text-[#57534E]">Target Naps Today:</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNapsPerDay(num)}
                        className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          napsPerDay === num
                            ? 'bg-[#FF5A5F] text-white shadow-xs'
                            : 'bg-white border border-[#D6C7BC] text-[#1C1917] hover:bg-[#F5EFEB]'
                        }`}
                      >
                        {num} {num === 1 ? 'Nap' : 'Naps'}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#78716C] block">
                    Recommended: {babyAgeMonths <= 3 ? '4 naps' : babyAgeMonths <= 8 ? '3 naps' : babyAgeMonths <= 14 ? '2 naps' : '1 nap'}
                  </span>
                </div>

                {/* Avg Nap Length */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold uppercase text-[#57534E]">Avg Nap Duration:</label>
                  <select
                    value={avgNapLengthMins}
                    onChange={(e) => setAvgNapLengthMins(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border-2 border-[#D6C7BC] bg-white font-bold text-sm text-[#1C1917] focus:border-[#FF5A5F] outline-hidden"
                  >
                    <option value={45}>45 mins (Short Rest)</option>
                    <option value={60}>1 hour (Standard)</option>
                    <option value={75}>1h 15m (Deep Nap)</option>
                    <option value={90}>1h 30m (Full 2-Cycle)</option>
                    <option value={120}>2 hours (Long Restorative)</option>
                  </select>
                  <span className="text-[11px] text-[#78716C] block">
                    Adjusts subsequent nap times
                  </span>
                </div>

              </div>

              {/* Sweet Spot Output Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFF1F2] via-[#FFF7ED] to-[#F5F3FF] border-2 border-[#FFD1D6] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F] text-white flex items-center justify-center font-bold text-xl shadow-md">
                      🎯
                    </div>
                    <div>
                      <h4 className="font-serif text-xl font-bold text-[#1C1917]">
                        Optimal Sleep & Bedtime Sweet Spots
                      </h4>
                      <p className="text-xs text-[#57534E]">
                        Calculated precisely for a {babyAgeMonths}-month-old waking at {morningWakeTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 rounded-xl bg-white border-2 border-[#D6C7BC] hover:border-[#FF5A5F] text-[#1C1917] font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FF5A5F]" />
                      <span>{hasExported ? '✓ Saved!' : 'Save Plan'}</span>
                    </button>
                  </div>
                </div>

                {/* Timeline Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Wake Up */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#E7DDD5] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#EAB308]">☀️ Wake Up</span>
                      <span className="text-xs font-bold text-[#78716C]">Start of Day</span>
                    </div>
                    <p className="font-serif text-2xl font-bold text-[#1C1917]">{morningWakeTime}</p>
                    <p className="text-xs text-[#57534E]">Next window: ~{wakeWindowData.label}</p>
                  </div>

                  {/* Nap 1 */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#BAE6FD] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#0284C7]">💤 Nap 1 Sweet Spot</span>
                      <span className="text-xs font-bold text-[#0284C7] bg-[#F0F9FF] px-2 py-0.5 rounded-md">
                        {avgNapLengthMins}m
                      </span>
                    </div>
                    <p className="font-serif text-2xl font-bold text-[#0369A1]">{nap1Start} – {nap1End}</p>
                    <p className="text-xs text-[#57534E]">Put down 10 mins prior</p>
                  </div>

                  {/* Nap 2 or 3 */}
                  {napsPerDay >= 2 && (
                    <div className="p-4 rounded-2xl bg-white border-2 border-[#BAE6FD] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-[#0284C7]">💤 Nap 2 Sweet Spot</span>
                        <span className="text-xs font-bold text-[#0284C7] bg-[#F0F9FF] px-2 py-0.5 rounded-md">
                          {avgNapLengthMins}m
                        </span>
                      </div>
                      <p className="font-serif text-2xl font-bold text-[#0369A1]">{nap2Start} – {nap2End}</p>
                      <p className="text-xs text-[#57534E]">Restorative afternoon stretch</p>
                    </div>
                  )}

                  {/* Bedtime Target */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#DDD6FE] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#7C3AED]">🌙 Bedtime Target</span>
                      <span className="text-xs font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md">
                        Night Rest
                      </span>
                    </div>
                    <p className="font-serif text-2xl font-bold text-[#6D28D9]">{calculatedBedtime}</p>
                    <p className="text-xs text-[#57534E]">Melatonin sweet spot window</p>
                  </div>
                </div>
              </div>

              {/* Pediatric Wake Window Guidance */}
              <div className="p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-3">
                <h4 className="text-sm font-extrabold text-[#1C1917] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                  <span>Clinical Pediatric Wake Window Rules for {babyAgeMonths} Months:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#292524]">
                  <li className="p-3 rounded-xl bg-white border border-[#E7DDD5] flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold">✓</span>
                    <span><strong>First Wake Window:</strong> Always shortest of the day ({wakeWindowData.min}–{wakeWindowData.min + 15}m). Sleep pressure carries over from night.</span>
                  </li>
                  <li className="p-3 rounded-xl bg-white border border-[#E7DDD5] flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold">✓</span>
                    <span><strong>Last Wake Window:</strong> Always longest ({wakeWindowData.max}m). Builds sufficient sleep debt for uninterrupted night stretches.</span>
                  </li>
                  <li className="p-3 rounded-xl bg-white border border-[#E7DDD5] flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold">✓</span>
                    <span><strong>Sleepy Cues vs Overtired:</strong> Put down at yawning, eye-rubbing, staring into space—do not wait for crying or back arching.</span>
                  </li>
                  <li className="p-3 rounded-xl bg-white border border-[#E7DDD5] flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold">✓</span>
                    <span><strong>Nap Cap:</strong> Cap any single daytime nap at 2 hours to protect total 24-hour night sleep distribution.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: MILESTONE PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Age Milestones Pills Bar */}
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-8">
              {AGE_MILESTONES.map((milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => setSelectedAgeId(milestone.id)}
                  className={`px-5 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedAgeId === milestone.id
                      ? 'bg-[#FF5A5F] text-white shadow-lg shadow-[#FF5A5F]/35 scale-105 ring-2 ring-[#FF5A5F]/40'
                      : 'bg-white text-[#1C1917] hover:bg-[#FFF1F2] hover:text-[#FF5A5F] border-2 border-[#D6C7BC] shadow-xs'
                  }`}
                >
                  <span>{milestone.ageLabel}</span>
                  {selectedAgeId === milestone.id && (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  )}
                </button>
              ))}
            </div>

            {/* Milestone Detail Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Key Parameters & Milestone Insights */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                        {selectedMilestone.ageLabel}
                      </h3>
                      <p className="text-xs font-semibold text-[#57534E]">Target Sleep Architecture</p>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-[#E8F5E9] text-[#1E7B28] border border-[#C8E6C9] text-xs font-extrabold">
                      {selectedMilestone.napsPerDay}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                      <span className="text-[11px] font-extrabold text-[#57534E] uppercase">
                        Wake Windows
                      </span>
                      <p className="font-serif text-base sm:text-lg font-bold text-[#1C1917] mt-0.5">
                        {selectedMilestone.wakeWindowRange}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                      <span className="text-[11px] font-extrabold text-[#57534E] uppercase">
                        Total Sleep / 24h
                      </span>
                      <p className="font-serif text-base sm:text-lg font-bold text-[#1C1917] mt-0.5">
                        {selectedMilestone.typicalTotalSleep}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                      <span className="text-[11px] font-extrabold text-[#57534E] uppercase">
                        Target Bedtime
                      </span>
                      <p className="font-serif text-base sm:text-lg font-bold text-[#1C1917] mt-0.5">
                        {selectedMilestone.bedtimeRange}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                      <span className="text-[11px] font-extrabold text-[#57534E] uppercase">
                        Night Stretch
                      </span>
                      <p className="font-serif text-base sm:text-lg font-bold text-[#1C1917] mt-0.5">
                        {selectedMilestone.nightSleepStretch}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-extrabold uppercase text-[#1C1917] tracking-wider">
                      Developmental Sleep Signs:
                    </h4>
                    <ul className="space-y-2">
                      {selectedMilestone.keyMilestones.map((item, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-[#292524] flex items-start gap-2 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FEF3C7]/60 border-2 border-[#FDE68A] flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#B45309]">Regression / Leap Radar:</p>
                      <p className="text-xs text-[#1C1917] font-medium mt-0.5 leading-relaxed">
                        {selectedMilestone.regressionRisk}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive Daily Schedule Visual Timeline */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E6DD]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                        Recommended Daily Timeline
                      </h3>
                      <p className="text-xs font-semibold text-[#57534E]">
                        Synchronized for {selectedMilestone.ageLabel} with {selectedMilestone.napCount} daily rest intervals
                      </p>
                    </div>

                    <button
                      onClick={handleExport}
                      className="px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-md shadow-[#FF5A5F]/30 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4 text-white" />
                      <span>{hasExported ? '✓ Schedule Saved!' : 'Save Schedule'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-[#E0D7D0]">
                    {selectedMilestone.sampleSchedule.map((item, idx) => {
                      const isNap = item.type === 'nap';
                      const isBedtime = item.type === 'bedtime';
                      const isRoutine = item.type === 'routine';
                      const isWake = item.type === 'wake';

                      return (
                        <div
                          key={idx}
                          className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                            isBedtime
                              ? 'bg-[#F5F3FF] border-[#DDD6FE] text-[#1C1917]'
                              : isNap
                              ? 'bg-[#F0F9FF] border-[#BAE6FD] text-[#1C1917]'
                              : isRoutine
                              ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#1C1917]'
                              : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#1C1917]'
                          }`}
                        >
                          <div
                            className={`relative z-10 w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-xs shrink-0 ${
                              isBedtime
                                ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30'
                                : isNap
                                ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/30'
                                : isRoutine
                                ? 'bg-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/30'
                                : isWake
                                ? 'bg-[#EAB308] text-white shadow-md'
                                : 'bg-white text-[#1C1917] border border-[#D6C7BC]'
                            }`}
                          >
                            {isBedtime ? '🌙' : isNap ? '💤' : isRoutine ? '🛁' : isWake ? '☀️' : '🍼'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-bold text-sm sm:text-base text-[#1C1917]">
                                {item.event}
                              </span>
                              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-[#D6C7BC] shrink-0 text-[#1C1917] shadow-2xs">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-[#57534E] capitalize mt-0.5">
                              {isNap ? 'Restorative Daytime Sleep Window' : isBedtime ? 'Nighttime Melatonin Peak' : isRoutine ? 'Wind-down Calm sequence' : 'Circadian Anchor Point'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
