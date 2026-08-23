import React, { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Play, 
  Timer, 
  Layers, 
  Compass, 
  Info,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { SleepLog, BabyProfile, DaySleepPattern } from '../types';
import { WEEKLY_SLEEP_PATTERNS } from '../data/sleepData';

interface SleepPatternsVisualizerSectionProps {
  logs: SleepLog[];
  babyProfile: BabyProfile;
  onOpenLoggerModal: (tab?: 'sleep' | 'timer') => void;
  onOpenAIAgent: () => void;
}

export const SleepPatternsVisualizerSection: React.FC<SleepPatternsVisualizerSectionProps> = ({
  logs,
  babyProfile,
  onOpenLoggerModal,
  onOpenAIAgent,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6); // Default: Today
  const [metricView, setMetricView] = useState<'rhythm' | 'metrics' | 'consistency'>('rhythm');
  const [selectedSegment, setSelectedSegment] = useState<{
    day: string;
    name: string;
    startTime: string;
    endTime: string;
    durationMins: number;
    quality: string;
  } | null>(null);

  const currentDayPattern = WEEKLY_SLEEP_PATTERNS[selectedDayIndex] || WEEKLY_SLEEP_PATTERNS[6];

  // Calculate averages across 7 days
  const avgTotalHours = (WEEKLY_SLEEP_PATTERNS.reduce((acc, d) => acc + d.totalHours, 0) / WEEKLY_SLEEP_PATTERNS.length).toFixed(1);
  const avgNightHours = (WEEKLY_SLEEP_PATTERNS.reduce((acc, d) => acc + d.nightHours, 0) / WEEKLY_SLEEP_PATTERNS.length).toFixed(1);
  const avgNapHours = (WEEKLY_SLEEP_PATTERNS.reduce((acc, d) => acc + d.napHours, 0) / WEEKLY_SLEEP_PATTERNS.length).toFixed(1);
  const avgNightWakes = (WEEKLY_SLEEP_PATTERNS.reduce((acc, d) => acc + d.nightWakes, 0) / WEEKLY_SLEEP_PATTERNS.length).toFixed(1);
  const avgQualityScore = Math.round(WEEKLY_SLEEP_PATTERNS.reduce((acc, d) => acc + d.qualityScore, 0) / WEEKLY_SLEEP_PATTERNS.length);

  // Live Wake Window Simulation (e.g. woke up at 14:00, target window ~2h 15m for 5m old)
  const currentWakeMinutes = 105; // 1h 45m
  const targetWakeMax = 135; // 2h 15m
  const wakePercent = Math.min(100, Math.round((currentWakeMinutes / targetWakeMax) * 100));
  const minutesUntilNextNap = Math.max(0, targetWakeMax - currentWakeMinutes);

  return (
    <section id="sleep-patterns-tracker" className="py-20 bg-white/60 backdrop-blur-[1px] relative overflow-hidden border-t-2 border-[#E7DDD5]">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFE4E6]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#EDE9FE]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFE4E6] text-[#9F1239] rounded-full text-xs font-extrabold uppercase tracking-widest border border-[#FECDD3] shadow-2xs">
              <Moon className="w-3.5 h-3.5 text-[#FF5A5F]" />
              <span>Baby Sleep Tracker & Circadian Patterns</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
              Visualize 7-Day Sleep Patterns & <span className="text-[#FF5A5F] italic">Rhythm Stability</span>
            </h2>
            <p className="text-base sm:text-lg text-[#44403C] font-normal leading-relaxed">
              Track {babyProfile.name}&apos;s sleep architecture across 24-hour cycles. Identify nap consistency, night wake patterns, and predicted wake window sweet spots.
            </p>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="pattern-log-sleep-btn"
              onClick={() => onOpenLoggerModal('sleep')}
              className="px-5 py-3 rounded-full bg-[#FF5A5F] hover:bg-[#FF4147] text-white font-bold text-sm shadow-lg shadow-[#FF5A5F]/30 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Sleep</span>
            </button>
            <button
              id="pattern-start-nap-timer-btn"
              onClick={() => onOpenLoggerModal('timer')}
              className="px-5 py-3 rounded-full bg-[#EDE9FE] hover:bg-[#DDD6FE] border-2 border-[#8B5CF6] text-[#5B21B6] font-bold text-sm shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-[#7C3AED]" />
              <span>Start Nap Stopwatch</span>
            </button>
          </div>
        </div>

        {/* Live Wake Window & Sleep Sweet Spot Alert Banner */}
        <div className="mb-10 bg-gradient-to-r from-[#FFF1F2] via-[#FFFBF7] to-[#F5F3FF] p-6 rounded-3xl border-2 border-[#FECDD3] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Live Status */}
            <div className="lg:col-span-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF5A5F] text-white flex items-center justify-center shadow-md shadow-[#FF5A5F]/35 shrink-0">
                <Sun className="w-7 h-7 animate-spin-slow text-amber-200" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#9F1239] block">
                  Current State: Awake
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                  Awake for 1h 45m
                </h3>
                <p className="text-xs text-[#57534E] font-medium">
                  Last woke up at 14:00 from Nap 2
                </p>
              </div>
            </div>

            {/* Wake Window Progress Bar */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Wake Window Progress (Target: 2h 15m)
                </span>
                <span className="text-[#FF5A5F]">{wakePercent}% Full</span>
              </div>
              <div className="w-full h-3.5 bg-[#E7DDD5] rounded-full overflow-hidden p-0.5 border border-[#D6C7BC]">
                <div 
                  className="h-full bg-gradient-to-r from-[#22C55E] via-amber-400 to-[#FF5A5F] rounded-full transition-all duration-500"
                  style={{ width: `${wakePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#57534E] font-semibold">
                <span>0m (Woke)</span>
                <span>Optimal Sweet Spot</span>
                <span>Overtired Zone</span>
              </div>
            </div>

            {/* Sweet Spot Prediction */}
            <div className="lg:col-span-3 bg-white p-4 rounded-2xl border-2 border-[#E7DDD5] flex flex-col justify-center">
              <span className="text-[11px] font-extrabold uppercase text-[#5B21B6] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                Next Nap Sweet Spot:
              </span>
              <p className="font-serif text-lg font-bold text-[#1C1917] mt-0.5">
                In ~{minutesUntilNextNap} mins (16:15 - 16:30)
              </p>
              <p className="text-[11px] text-[#57534E] font-medium">
                Catnap 3 (Target: 30–45 mins)
              </p>
            </div>

          </div>
        </div>

        {/* 4 Core Sleep Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#FFFBF7] p-5 rounded-2xl border-2 border-[#E7DDD5] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#57534E] uppercase">7-Day Total Avg</span>
              <span className="p-1.5 rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
                <Moon className="w-4 h-4" />
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
              {avgTotalHours} <span className="text-sm font-sans font-medium text-[#57534E]">hrs/24h</span>
            </p>
            <p className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimal for 5m old (13.5 - 15h)</span>
            </p>
          </div>

          <div className="bg-[#FFFBF7] p-5 rounded-2xl border-2 border-[#E7DDD5] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#57534E] uppercase">Day vs Night Split</span>
              <span className="p-1.5 rounded-lg bg-[#E0F2FE] text-[#0284C7]">
                <Sun className="w-4 h-4" />
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
              {avgNightHours}h <span className="text-sm font-sans font-medium text-[#57534E]">night / {avgNapHours}h naps</span>
            </p>
            <p className="text-xs font-semibold text-[#0284C7] flex items-center gap-1">
              <span>74% Night Sleep Consolidation</span>
            </p>
          </div>

          <div className="bg-[#FFFBF7] p-5 rounded-2xl border-2 border-[#E7DDD5] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#57534E] uppercase">Night Wakings</span>
              <span className="p-1.5 rounded-lg bg-[#FEF3C7] text-[#D97706]">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
              {avgNightWakes} <span className="text-sm font-sans font-medium text-[#57534E]">per night</span>
            </p>
            <p className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Down from 3.2 wakings/night</span>
            </p>
          </div>

          <div className="bg-[#FFFBF7] p-5 rounded-2xl border-2 border-[#E7DDD5] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#57534E] uppercase">Sleep Quality Index</span>
              <span className="p-1.5 rounded-lg bg-[#DCFCE7] text-[#16A34A]">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
              {avgQualityScore}% <span className="text-sm font-sans font-medium text-[#16A34A]">Restful</span>
            </p>
            <p className="text-xs font-semibold text-[#57534E]">
              Avg onset latency: 11 mins
            </p>
          </div>
        </div>

        {/* 7-Day 24-Hour Circadian Rhythm Visualizer */}
        <div className="bg-[#FFFBF7] rounded-[36px] border-2 border-[#E7DDD5] p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E6DD]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                  24-Hour Circadian Rhythm Timeline (Past 7 Days)
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#5B21B6]">
                  Click any sleep block
                </span>
              </div>
              <p className="text-xs font-semibold text-[#57534E] mt-0.5">
                Horizontal time scale represents 00:00 (Midnight) through 24:00 (End of day)
              </p>
            </div>

            {/* Time Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#57534E]">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#4338CA]" />
                <span>Night Sleep</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#0284C7]" />
                <span>Nap 1 & 2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#F59E0B]" />
                <span>Catnap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-[#E7DDD5]" />
                <span>Wake Window</span>
              </div>
            </div>
          </div>

          {/* Time axis scale ruler */}
          <div className="hidden sm:grid grid-cols-8 text-[11px] font-bold text-[#57534E] px-24 py-1 border-b border-[#F0E6DD]/80">
            <span>00:00</span>
            <span>03:00</span>
            <span>06:00 (Wake)</span>
            <span>09:00</span>
            <span>12:00 (Noon)</span>
            <span>15:00</span>
            <span>18:00</span>
            <span>21:00 (Bed)</span>
          </div>

          {/* 7 Days Rhythm Bars */}
          <div className="space-y-3">
            {WEEKLY_SLEEP_PATTERNS.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-3 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#FF5A5F] shadow-md shadow-[#FF5A5F]/15 ring-2 ring-[#FF5A5F]/30'
                      : 'bg-white/80 border-[#E7DDD5] hover:border-[#D6C7BC]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    
                    {/* Day Label & Total */}
                    <div className="w-24 sm:w-28 shrink-0 flex items-center justify-between sm:block">
                      <span className="font-bold text-sm text-[#1C1917] block">
                        {day.shortDay} <span className="text-xs font-normal text-[#57534E]">({day.dateStr})</span>
                      </span>
                      <span className="text-[11px] font-extrabold text-[#FF5A5F]">
                        {day.totalHours}h total
                      </span>
                    </div>

                    {/* 24h Sleep Track Bar */}
                    <div className="flex-1 h-9 bg-[#F5EFEB] rounded-xl overflow-hidden relative flex border border-[#D6C7BC]/60">
                      {day.segments.map((seg, sIdx) => {
                        const isNight = seg.type === 'night';
                        const isCatnap = seg.name.toLowerCase().includes('catnap') || seg.durationMins <= 45;
                        
                        return (
                          <div
                            key={sIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDayIndex(idx);
                              setSelectedSegment({
                                day: day.dayLabel,
                                name: seg.name,
                                startTime: seg.startTime,
                                endTime: seg.endTime,
                                durationMins: seg.durationMins,
                                quality: seg.quality
                              });
                            }}
                            title={`${seg.name}: ${seg.startTime} - ${seg.endTime} (${Math.round(seg.durationMins / 60 * 10) / 10}h)`}
                            className={`absolute top-0 bottom-0 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white transition-transform hover:scale-y-105 hover:z-20 cursor-pointer shadow-xs ${
                              isNight 
                                ? 'bg-[#4338CA] hover:bg-[#3730A3]' 
                                : isCatnap 
                                ? 'bg-[#F59E0B] hover:bg-[#D97706]' 
                                : 'bg-[#0284C7] hover:bg-[#0369A1]'
                            }`}
                            style={{
                              left: `${seg.startPercent}%`,
                              width: `${seg.widthPercent}%`
                            }}
                          >
                            {seg.widthPercent > 7 && (
                              <span className="truncate px-1">
                                {seg.durationMins}m
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quality badge */}
                    <div className="w-16 text-right shrink-0 hidden md:block">
                      <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                        {day.qualityScore}%
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Segment Inspection Box or AI Doctor Analysis Callout */}
          {selectedSegment ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE9FE] border-2 border-[#DDD6FE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#5B21B6] text-white text-[10px] font-bold uppercase">
                    Inspecting {selectedSegment.day}
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#1C1917]">
                    {selectedSegment.name}
                  </h4>
                </div>
                <p className="text-xs text-[#3730A3] font-medium">
                  Time: <strong>{selectedSegment.startTime} – {selectedSegment.endTime}</strong> • Duration: <strong>{selectedSegment.durationMins} minutes ({Math.round(selectedSegment.durationMins / 60 * 10) / 10} hours)</strong> • Quality: <strong className="capitalize">{selectedSegment.quality}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSegment(null)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] text-xs font-bold text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  Close Inspection
                </button>
                <button
                  onClick={onOpenAIAgent}
                  className="px-4 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Ask AI Doctor About This Nap</span>
                </button>
              </div>
            </div>
          ) : (
            /* Pediatric Sleep Pattern Findings */
            <div className="p-5 rounded-2xl bg-white border-2 border-[#E7DDD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-lg shrink-0">
                  📈
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-[#1C1917]">
                    AI Sleep Pattern Diagnosis for {babyProfile.name} ({babyProfile.ageMonths}m)
                  </h4>
                  <p className="text-xs text-[#57534E] font-medium leading-relaxed mt-0.5">
                    Maya is demonstrating strong circadian consolidation with 10.5h+ uninterrupted night sleep and consistent 90-minute morning naps. The 3rd afternoon catnap is naturally shortening (35m), indicating healthy readiness for a 2-nap schedule in upcoming months.
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenAIAgent}
                className="px-5 py-2.5 rounded-full bg-[#EDE9FE] hover:bg-[#DDD6FE] border-2 border-[#8B5CF6] text-[#5B21B6] font-extrabold text-xs whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Ask AI Doctor For Schedule Tune-Up</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
