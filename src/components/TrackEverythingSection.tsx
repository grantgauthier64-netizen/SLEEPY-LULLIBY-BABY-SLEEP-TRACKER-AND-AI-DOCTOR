import React, { useState } from 'react';
import { 
  Clock, Moon, Sun, Plus, Sparkles, Filter, Milk, Baby, 
  Trash2, Play, Heart, Bath, Activity, Pill, MessageSquare, 
  CheckCircle2, ChevronRight, ShieldCheck, MilkOff
} from 'lucide-react';
import { 
  SleepLog, FeedLog, DiaperLog, CustomActivityLog, 
  BabyMood, UnifiedDailyEvent 
} from '../types';
import { PoopVisualGuideCard } from './PoopVisualGuideCard';
import { LactoseIntoleranceCard } from './LactoseIntoleranceCard';

interface TrackEverythingSectionProps {
  logs: SleepLog[];
  feedLogs: FeedLog[];
  diaperLogs: DiaperLog[];
  activityLogs: CustomActivityLog[];
  onAddSleepLog: (newLog: SleepLog) => void;
  onAddFeedLog: (newLog: FeedLog) => void;
  onAddDiaperLog: (newLog: DiaperLog) => void;
  onAddActivityLog: (newLog: CustomActivityLog) => void;
  onDeleteSleepLog: (id: string) => void;
  onDeleteFeedLog: (id: string) => void;
  onDeleteDiaperLog: (id: string) => void;
  onDeleteActivityLog: (id: string) => void;
  onOpenLoggerModal: (tab?: 'sleep' | 'feed' | 'diaper' | 'activity' | 'timer') => void;
}

export const TrackEverythingSection: React.FC<TrackEverythingSectionProps> = ({
  logs,
  feedLogs,
  diaperLogs,
  activityLogs,
  onAddSleepLog,
  onAddFeedLog,
  onAddDiaperLog,
  onAddActivityLog,
  onDeleteSleepLog,
  onDeleteFeedLog,
  onDeleteDiaperLog,
  onDeleteActivityLog,
  onOpenLoggerModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'sleep' | 'feed' | 'diaper' | 'activity'>('all');
  const [quickFormCategory, setQuickFormCategory] = useState<'none' | 'sleep' | 'feed' | 'diaper' | 'activity'>('none');
  const [showPoopCard, setShowPoopCard] = useState<boolean>(false);
  const [showLactoseCard, setShowLactoseCard] = useState<boolean>(false);

  // Inline Quick Sleep Form State
  const [newType, setNewType] = useState<'nap' | 'night'>('nap');
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:30');
  const [newQuality, setNewQuality] = useState<'peaceful' | 'restless' | 'broken'>('peaceful');
  const [newMood, setNewMood] = useState<BabyMood>('happy');
  const [newNotes, setNewNotes] = useState('');
  const [newLoggedBy, setNewLoggedBy] = useState('Sarah (Mom)');

  // Sleep totals
  const totalSleepMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const nightSleepMinutes = logs.filter(l => l.type === 'night').reduce((acc, c) => acc + c.durationMinutes, 0);
  const napSleepMinutes = logs.filter(l => l.type === 'nap').reduce((acc, c) => acc + c.durationMinutes, 0);

  // Feeding totals
  const totalNursingMins = feedLogs
    .filter(f => f.feedType === 'nursing' && f.durationMinutes)
    .reduce((acc, f) => acc + (f.durationMinutes || 0), 0);
  const totalFormulaMl = feedLogs
    .filter(f => (f.feedType === 'formula' || f.feedType === 'pumped_milk') && f.amountMl)
    .reduce((acc, f) => acc + (f.amountMl || 0), 0);

  // Diaper totals
  const wetCount = diaperLogs.filter(d => d.diaperType === 'wet' || d.diaperType === 'both').length;
  const dirtyCount = diaperLogs.filter(d => d.diaperType === 'dirty' || d.diaperType === 'both').length;

  // Activity totals
  const tummyMinutes = activityLogs
    .filter(a => a.activityType === 'tummy_time' && a.durationMinutes)
    .reduce((acc, a) => acc + (a.durationMinutes || 0), 0);

  const formatHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const handleCreateSleepLog = (e: React.FormEvent) => {
    e.preventDefault();
    const [sH, sM] = newStartTime.split(':').map(Number);
    const [eH, eM] = newEndTime.split(':').map(Number);
    let startMin = sH * 60 + sM;
    let endMin = eH * 60 + eM;
    if (endMin < startMin) {
      endMin += 24 * 60; // overnight
    }
    const duration = Math.max(15, endMin - startMin);

    const log: SleepLog = {
      id: `log-${Date.now()}`,
      type: newType,
      startTime: newStartTime,
      endTime: newEndTime,
      durationMinutes: duration,
      quality: newQuality,
      moodUponWaking: newMood,
      notes: newNotes || (newType === 'nap' ? 'Smooth daytime nap.' : 'Restful night sleep.'),
      loggedBy: newLoggedBy,
      caregiverAvatar: newLoggedBy.includes('Mom') ? '👩‍🦰' : newLoggedBy.includes('Dad') ? '👨‍🦱' : '👩‍⚕️',
      date: 'Today'
    };

    onAddSleepLog(log);
    setQuickFormCategory('none');
    setNewNotes('');
  };

  // Combine all into unified chronological events
  const unifiedEvents: UnifiedDailyEvent[] = [
    ...logs.map(l => ({ category: 'sleep' as const, ...l })),
    ...feedLogs.map(f => ({ category: 'feed' as const, ...f })),
    ...diaperLogs.map(d => ({ category: 'diaper' as const, ...d })),
    ...activityLogs.map(a => ({ category: 'activity' as const, ...a }))
  ].sort((a, b) => {
    const timeA = 'startTime' in a ? a.startTime : a.time;
    const timeB = 'startTime' in b ? b.startTime : b.time;
    return timeB.localeCompare(timeA); // newest first
  });

  const filteredEvents = unifiedEvents.filter(ev => {
    if (filterType === 'all') return true;
    return ev.category === filterType;
  });

  return (
    <section id="track-everything" className="py-20 bg-[#FFFBF7]/60 backdrop-blur-[1px] relative overflow-hidden border-t border-[#F0E6DD]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-block px-4 py-1.5 bg-[#E8F5E9] text-[#1E7B28] rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs border border-[#C8E6C9]">
            Simple & Intuitive Tracking System
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Track daily naps, feeds, diapers & <span className="text-[#FF5A5F] italic">gentle routines</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Everything your baby experiences in a 24-hour cycle—logged with effortless single taps, live timers, and instant caregiver synchronization.
          </p>
        </div>

        {/* 4 Interactive Quick Action Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          
          <button
            id="quick-log-sleep-btn"
            onClick={() => onOpenLoggerModal('sleep')}
            className="p-4 rounded-3xl bg-white border-2 border-[#DDD6FE] hover:border-[#7C3AED] hover:bg-[#F5F3FF] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group cursor-pointer active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center text-2xl shadow-md shadow-[#7C3AED]/30 group-hover:scale-110 transition-transform">
              🌙
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-[#1C1917] block group-hover:text-[#7C3AED]">
                + Log Sleep
              </span>
              <span className="text-[11px] font-semibold text-[#57534E]">Naps & Night Rest</span>
            </div>
          </button>

          <button
            id="quick-log-feed-btn"
            onClick={() => onOpenLoggerModal('feed')}
            className="p-4 rounded-3xl bg-white border-2 border-[#FDE68A] hover:border-[#D97706] hover:bg-[#FFFBEB] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group cursor-pointer active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center text-2xl shadow-md shadow-[#F59E0B]/30 group-hover:scale-110 transition-transform">
              🍼
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-[#1C1917] block group-hover:text-[#D97706]">
                + Log Feed
              </span>
              <span className="text-[11px] font-semibold text-[#57534E]">Nursing & Formula</span>
            </div>
          </button>

          <button
            id="quick-log-diaper-btn"
            onClick={() => onOpenLoggerModal('diaper')}
            className="p-4 rounded-3xl bg-white border-2 border-[#BAE6FD] hover:border-[#0284C7] hover:bg-[#F0F9FF] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group cursor-pointer active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center text-2xl shadow-md shadow-[#0284C7]/30 group-hover:scale-110 transition-transform">
              🧷
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-[#1C1917] block group-hover:text-[#0284C7]">
                + Log Diaper
              </span>
              <span className="text-[11px] font-semibold text-[#57534E]">Wet, Dirty & Both</span>
            </div>
          </button>

          <button
            id="quick-log-activity-btn"
            onClick={() => onOpenLoggerModal('activity')}
            className="p-4 rounded-3xl bg-white border-2 border-[#BBF7D0] hover:border-[#16A34A] hover:bg-[#F0FDF4] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group cursor-pointer active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center text-2xl shadow-md shadow-[#16A34A]/30 group-hover:scale-110 transition-transform">
              🤸
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-[#1C1917] block group-hover:text-[#16A34A]">
                + Log Activity
              </span>
              <span className="text-[11px] font-semibold text-[#57534E]">Tummy, Bath, Notes</span>
            </div>
          </button>

          <button
            id="quick-log-timer-btn"
            onClick={() => onOpenLoggerModal('timer')}
            className="p-4 rounded-3xl bg-[#FFF1F2] border-2 border-[#FF5A5F]/40 hover:border-[#FF5A5F] hover:bg-[#FFE4E6] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group cursor-pointer col-span-2 sm:col-span-1 active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F] text-white flex items-center justify-center text-2xl shadow-md shadow-[#FF5A5F]/35 group-hover:scale-110 transition-transform">
              ⏱️
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-[#E11D48] block">
                Live Stopwatch
              </span>
              <span className="text-[11px] font-semibold text-[#57534E]">Real-time Tracker</span>
            </div>
          </button>

        </div>

        {/* 4 Category Daily Metric Tally Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          
          {/* 1. Sleep Metrics */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7DDD5] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#6D28D9] flex items-center justify-center text-xl font-bold">
                🌙
              </div>
              <span className="text-xs font-extrabold text-[#1E7B28] bg-[#E8F5E9] border border-[#C8E6C9] px-3 py-0.5 rounded-full">
                {logs.length} sessions
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#57534E]">Total Daily Sleep</p>
              <h4 className="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">
                {formatHours(totalSleepMinutes)}
              </h4>
            </div>
            <div className="pt-2 border-t border-[#F0E6DD] flex justify-between text-xs text-[#1C1917] font-medium">
              <span>Night: <strong className="text-[#1C1917]">{formatHours(nightSleepMinutes)}</strong></span>
              <span>Naps: <strong className="text-[#1C1917]">{formatHours(napSleepMinutes)}</strong></span>
            </div>
          </div>

          {/* 2. Feedings Metrics */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7DDD5] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center text-xl font-bold">
                🍼
              </div>
              <span className="text-xs font-extrabold text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] px-3 py-0.5 rounded-full">
                {feedLogs.length} feeds
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#57534E]">Feeding Nourishment</p>
              <h4 className="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">
                {feedLogs.length} Feeds Today
              </h4>
            </div>
            <div className="pt-2 border-t border-[#F0E6DD] flex justify-between text-xs text-[#1C1917] font-medium">
              <span>Nursed: <strong className="text-[#1C1917]">{totalNursingMins}m</strong></span>
              <span>Bottle: <strong className="text-[#1C1917]">{totalFormulaMl}ml</strong></span>
            </div>
          </div>

          {/* 3. Diapers Metrics */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7DDD5] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center text-xl font-bold">
                🧷
              </div>
              <span className="text-xs font-extrabold text-[#0369A1] bg-[#E0F2FE] border border-[#BAE6FD] px-3 py-0.5 rounded-full">
                {diaperLogs.length} changes
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#57534E]">Diaper Hydration</p>
              <h4 className="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">
                {diaperLogs.length} Diapers
              </h4>
            </div>
            <div className="pt-2 border-t border-[#F0E6DD] flex justify-between text-xs text-[#1C1917] font-medium">
              <span>💧 Wet: <strong className="text-[#1C1917]">{wetCount}</strong></span>
              <span>💩 Dirty: <strong className="text-[#1C1917]">{dirtyCount}</strong></span>
            </div>
          </div>

          {/* 4. Tummy & Activities */}
          <div className="p-6 rounded-3xl bg-white border border-[#E7DDD5] shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center text-xl font-bold">
                🤸
              </div>
              <span className="text-xs font-extrabold text-[#15803D] bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-0.5 rounded-full">
                {activityLogs.length} events
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#57534E]">Tummy Time & Play</p>
              <h4 className="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">
                {tummyMinutes > 0 ? `${tummyMinutes} mins` : `${activityLogs.length} Activities`}
              </h4>
            </div>
            <div className="pt-2 border-t border-[#F0E6DD] flex justify-between text-xs text-[#1C1917] font-medium">
              <span>Goal: <strong className="text-[#1C1917]">30 mins</strong></span>
              <span className="text-[#15803D] font-bold">✓ Active</span>
            </div>
          </div>

        </div>

        {/* Live Interactive Sleep & Activity Tracker Console */}
        <div className="bg-white rounded-[36px] border border-[#E0D7D0] shadow-xl p-6 sm:p-10">
          
          {/* Tracker Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#F0E6DD]">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  Daily Activity & Rest Stream
                </h3>
                <span className="px-3.5 py-1 rounded-full bg-[#E8F5E9] text-xs font-extrabold text-[#1E7B28] border border-[#C8E6C9]">
                  {unifiedEvents.length} Total Logs
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#44403C] font-medium mt-1">
                Real-time chronological timeline synced with Mom, Dad, and Nanny
              </p>
            </div>

            {/* Quick Action Button to Open Full Modal */}
            <div className="flex items-center gap-3">
              <button
                id="open-full-activity-logger-btn"
                onClick={() => onOpenLoggerModal('sleep')}
                className="px-6 py-3.5 rounded-full text-sm font-bold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Baby Activity</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="my-6 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <Filter className="w-4 h-4 text-[#FF5A5F] shrink-0" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1C1917] shrink-0">
                Filter:
              </span>
              
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#1C1917] text-white shadow-md'
                    : 'bg-[#FFFBF7] border-2 border-[#D6C7BC] text-[#1C1917] hover:bg-[#F0E6DD]'
                }`}
              >
                All ({unifiedEvents.length})
              </button>

              <button
                onClick={() => setFilterType('sleep')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterType === 'sleep'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30'
                    : 'bg-[#FFFBF7] border-2 border-[#DDD6FE] text-[#6D28D9] hover:bg-[#EDE9FE]'
                }`}
              >
                🌙 Sleep ({logs.length})
              </button>

              <button
                onClick={() => setFilterType('feed')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterType === 'feed'
                    ? 'bg-[#D97706] text-white shadow-md shadow-[#D97706]/30'
                    : 'bg-[#FFFBF7] border-2 border-[#FDE68A] text-[#B45309] hover:bg-[#FEF3C7]'
                }`}
              >
                🍼 Feeds ({feedLogs.length})
              </button>

              <button
                id="btn-filter-diaper"
                onClick={() => setFilterType('diaper')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterType === 'diaper'
                    ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/30'
                    : 'bg-[#FFFBF7] border-2 border-[#BAE6FD] text-[#0369A1] hover:bg-[#E0F2FE]'
                }`}
              >
                🧷 Diapers ({diaperLogs.length})
              </button>

              <button
                id="btn-toggle-poop-guide"
                onClick={() => setShowPoopCard(!showPoopCard)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  showPoopCard
                    ? 'bg-[#059669] text-white shadow-md shadow-[#059669]/30'
                    : 'bg-[#FFFBF7] border-2 border-[#A7F3D0] text-[#059669] hover:bg-[#ECFDF5]'
                }`}
              >
                <span>💩 Poop Color & Texture Guide</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-black">
                  {showPoopCard ? 'Hide' : 'View'}
                </span>
              </button>

              <button
                id="btn-toggle-lactose-guide"
                onClick={() => setShowLactoseCard(!showLactoseCard)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  showLactoseCard
                    ? 'bg-[#EA580C] text-white shadow-md shadow-[#EA580C]/30'
                    : 'bg-[#FFFBF7] border-2 border-[#FED7AA] text-[#EA580C] hover:bg-[#FFEDD5]'
                }`}
              >
                <MilkOff className="w-3.5 h-3.5" />
                <span>🥛 Lactose & CMPA Guide</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-orange-100 text-orange-900 rounded-full font-black">
                  {showLactoseCard ? 'Hide' : 'View'}
                </span>
              </button>

              <button
                onClick={() => setFilterType('activity')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterType === 'activity'
                    ? 'bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30'
                    : 'bg-[#FFFBF7] border-2 border-[#BBF7D0] text-[#15803D] hover:bg-[#DCFCE7]'
                }`}
              >
                🤸 Tummy & Notes ({activityLogs.length})
              </button>
            </div>

            <div className="text-xs text-[#1E7B28] flex items-center gap-1.5 font-bold bg-[#E8F5E9] border border-[#C8E6C9] px-3.5 py-1.5 rounded-full shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E7B28]" />
              <span>Sweet Spot Sync Active</span>
            </div>
          </div>

          {/* Embedded Poop Visual Guide Card when toggled or when filtering diaper */}
          {(showPoopCard || filterType === 'diaper') && (
            <div className="mb-6 animate-fadeIn">
              <PoopVisualGuideCard
                babyName="Baby"
                babyAgeMonths={5}
                showAskButton={false}
              />
            </div>
          )}

          {/* Embedded Lactose Intolerance & Dairy Sensitivity Card when toggled */}
          {showLactoseCard && (
            <div className="mb-6 animate-fadeIn">
              <LactoseIntoleranceCard
                babyName="Baby"
                babyAgeMonths={5}
                showAskButton={false}
              />
            </div>
          )}

          {/* Timeline Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => {
              if (ev.category === 'sleep') {
                return (
                  <div
                    key={ev.id}
                    className="p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] hover:border-[#7C3AED] transition-all flex flex-col justify-between space-y-3 shadow-xs group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-xs ${
                            ev.type === 'night'
                              ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold'
                              : 'bg-[#FEF3C7] text-[#B45309] font-bold'
                          }`}
                        >
                          {ev.type === 'night' ? '🌙' : '☀️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1C1917]">
                              {ev.type === 'night' ? 'Night Sleep Rest' : 'Daytime Nap'}
                            </h4>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ev.quality === 'peaceful'
                                  ? 'bg-[#E8F5E9] text-[#1E7B28] border border-[#C8E6C9]'
                                  : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                              }`}
                            >
                              {ev.quality}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#57534E]">
                            {ev.startTime} – {ev.endTime} ({formatHours(ev.durationMinutes)})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917] bg-white border border-[#D6C7BC] px-3 py-1 rounded-full shadow-2xs">
                          {ev.caregiverAvatar} {ev.loggedBy.split(' ')[0]}
                        </span>
                        <button
                          onClick={() => onDeleteSleepLog(ev.id)}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#1C1917] font-medium italic bg-white p-3 rounded-2xl border border-[#E7DDD5]">
                      "{ev.notes}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#57534E] font-medium pt-1 border-t border-[#F0E6DD]">
                      <span>Wake Mood: <strong className="capitalize text-[#1C1917]">{ev.moodUponWaking}</strong></span>
                      <span className="text-[#1E7B28] font-bold">✓ Verified Complete</span>
                    </div>
                  </div>
                );
              }

              if (ev.category === 'feed') {
                return (
                  <div
                    key={ev.id}
                    className="p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] hover:border-[#F59E0B] transition-all flex flex-col justify-between space-y-3 shadow-xs group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center text-lg shadow-xs font-bold">
                          {ev.feedType === 'nursing' ? '🤱' : ev.feedType === 'solids' ? '🥑' : '🍼'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1C1917]">
                              {ev.feedType === 'nursing' ? 'Breastfeeding Nursing' : ev.feedType === 'formula' ? 'Formula Bottle' : ev.feedType === 'pumped_milk' ? 'Pumped Milk Bottle' : 'Solid Food Feed'}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] capitalize">
                              {ev.feedType.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-[#57534E]">
                            {ev.time} • {ev.feedType === 'nursing' ? `${ev.durationMinutes} mins (${ev.breastSide} side)` : ev.amountMl ? `${ev.amountMl} ml (${ev.amountOz} oz)` : ev.foodDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917] bg-white border border-[#D6C7BC] px-3 py-1 rounded-full shadow-2xs">
                          {ev.caregiverAvatar} {ev.loggedBy.split(' ')[0]}
                        </span>
                        <button
                          onClick={() => onDeleteFeedLog(ev.id)}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#1C1917] font-medium italic bg-white p-3 rounded-2xl border border-[#E7DDD5]">
                      "{ev.notes}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#57534E] font-medium pt-1 border-t border-[#F0E6DD]">
                      <span>Feed Type: <strong className="capitalize text-[#1C1917]">{ev.feedType.replace('_', ' ')}</strong></span>
                      <span className="text-[#1E7B28] font-bold">✓ Fed & Burped</span>
                    </div>
                  </div>
                );
              }

              if (ev.category === 'diaper') {
                return (
                  <div
                    key={ev.id}
                    className="p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] hover:border-[#0284C7] transition-all flex flex-col justify-between space-y-3 shadow-xs group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center text-lg shadow-xs font-bold">
                          {ev.diaperType === 'wet' ? '💧' : ev.diaperType === 'dirty' ? '💩' : '💧💩'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1C1917]">
                              {ev.diaperType === 'both' ? 'Wet + Dirty Diaper' : ev.diaperType === 'dirty' ? 'Dirty Diaper' : 'Wet Diaper'}
                            </h4>
                            {ev.hasRashCream && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#1E7B28] border border-[#C8E6C9]">
                                🧴 Cream Applied
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#57534E]">
                            {ev.time} • Changed & Cleaned
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917] bg-white border border-[#D6C7BC] px-3 py-1 rounded-full shadow-2xs">
                          {ev.caregiverAvatar} {ev.loggedBy.split(' ')[0]}
                        </span>
                        <button
                          onClick={() => onDeleteDiaperLog(ev.id)}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#1C1917] font-medium italic bg-white p-3 rounded-2xl border border-[#E7DDD5]">
                      "{ev.notes}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#57534E] font-medium pt-1 border-t border-[#F0E6DD]">
                      <span>Condition: <strong className="capitalize text-[#1C1917]">{ev.diaperType}</strong></span>
                      <span className="text-[#1E7B28] font-bold">✓ Clean Change</span>
                    </div>
                  </div>
                );
              }

              if (ev.category === 'activity') {
                return (
                  <div
                    key={ev.id}
                    className="p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] hover:border-[#16A34A] transition-all flex flex-col justify-between space-y-3 shadow-xs group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center text-lg shadow-xs font-bold">
                          {ev.activityType === 'tummy_time' ? '🤸' : ev.activityType === 'bath' ? '🛁' : ev.activityType === 'medicine' ? '💊' : '📝'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[#1C1917]">
                              {ev.title}
                            </h4>
                            {ev.durationMinutes && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                                {ev.durationMinutes}m duration
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#57534E]">
                            {ev.time} • Completed
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1917] bg-white border border-[#D6C7BC] px-3 py-1 rounded-full shadow-2xs">
                          {ev.caregiverAvatar} {ev.loggedBy.split(' ')[0]}
                        </span>
                        <button
                          onClick={() => onDeleteActivityLog(ev.id)}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#1C1917] font-medium italic bg-white p-3 rounded-2xl border border-[#E7DDD5]">
                      "{ev.notes}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#57534E] font-medium pt-1 border-t border-[#F0E6DD]">
                      <span>Activity: <strong className="capitalize text-[#1C1917]">{ev.activityType.replace('_', ' ')}</strong></span>
                      <span className="text-[#15803D] font-bold">✓ Completed</span>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm font-semibold text-[#57534E]">
                No logs recorded yet for this filter.
              </p>
              <button
                onClick={() => onOpenLoggerModal()}
                className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-md shadow-[#FF5A5F]/35 cursor-pointer"
              >
                + Add First Log
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
