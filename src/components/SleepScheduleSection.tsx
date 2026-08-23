import React, { useState } from 'react';
import { Compass, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AGE_MILESTONES } from '../data/sleepData';

export const SleepScheduleSection: React.FC = () => {
  const [selectedAgeId, setSelectedAgeId] = useState<string>('infant-early');
  const [hasExported, setHasExported] = useState<boolean>(false);

  const selectedMilestone = AGE_MILESTONES.find((m) => m.id === selectedAgeId) || AGE_MILESTONES[1];

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
            Personalized Sleep Schedules • Science-Backed
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Predict the exact sweet spot for <span className="text-[#FF5A5F] italic">every nap and bedtime</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Babies aren’t robots, but their circadian biology follows clear wake window limits.
            Select your baby’s age to unlock their personalized schedule.
          </p>
        </div>

        {/* Age Milestones Pills Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-10">
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

        {/* Milestone Detail Card & Interactive Schedule Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Key Parameters & Milestone Insights */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Parameters Matrix Card */}
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

              {/* 4-Stat Metric Grid */}
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

              {/* Developmental Key Milestones */}
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

              {/* Regression Alert Box */}
              <div className="p-4 rounded-2xl bg-[#FEF3C7]/60 border-2 border-[#FDE68A] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#B45309]">Regression / Leap Radar:</p>
                  <p className="text-xs text-[#1C1917] font-medium mt-0.5 leading-relaxed">
                    {selectedMilestone.regressionRisk}
                  </p>
                </div>
              </div>

              {/* Expert Pediatric Tip */}
              <div className="p-4 rounded-2xl bg-[#EDE9FE]/70 border-2 border-[#DDD6FE] text-xs text-[#5B21B6] leading-relaxed">
                <strong className="block font-extrabold text-[#5B21B6] mb-1">
                  💡 Pediatric Sleep Consultant Tip:
                </strong>
                <span className="text-[#3730A3] font-medium">{selectedMilestone.expertTip}</span>
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

                {/* Export / Download Button */}
                <button
                  onClick={handleExport}
                  className="px-5 py-2.5 rounded-full text-xs font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-md shadow-[#FF5A5F]/30 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>{hasExported ? '✓ Schedule Saved!' : 'Save Schedule'}</span>
                </button>
              </div>

              {/* Chronological Event Cards List */}
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
                      {/* Timeline Dot Icon */}
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

                      {/* Event Detail */}
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

              {/* Schedule Legend */}
              <div className="pt-3 border-t border-[#F0E6DD] flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#57534E]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#0284C7]" /> Nap Windows
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#7C3AED]" /> Night Rest
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B]" /> Bedtime Ritual
                  </span>
                </div>
                <span className="text-[#1E7B28]">✓ Adjusts dynamically to early/late wakes</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
