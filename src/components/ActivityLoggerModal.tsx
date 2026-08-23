import React, { useState, useEffect } from 'react';
import { 
  X, Moon, Sun, Milk, Baby, Sparkles, Clock, Play, Pause, 
  RotateCcw, Check, Heart, Bath, Activity, Pill, MessageSquare, 
  ChevronRight, AlertCircle, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  SleepLog, FeedLog, DiaperLog, CustomActivityLog, 
  BabyMood, FeedType, BreastSide, DiaperType 
} from '../types';

interface ActivityLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSleepLog: (log: SleepLog) => void;
  onAddFeedLog: (log: FeedLog) => void;
  onAddDiaperLog: (log: DiaperLog) => void;
  onAddActivityLog: (log: CustomActivityLog) => void;
  initialTab?: 'sleep' | 'feed' | 'diaper' | 'activity' | 'timer';
}

export const ActivityLoggerModal: React.FC<ActivityLoggerModalProps> = ({
  isOpen,
  onClose,
  onAddSleepLog,
  onAddFeedLog,
  onAddDiaperLog,
  onAddActivityLog,
  initialTab = 'sleep'
}) => {
  const [activeTab, setActiveTab] = useState<'sleep' | 'feed' | 'diaper' | 'activity' | 'timer'>('sleep');
  const [caregiver, setCaregiver] = useState('Sarah (Mom)');

  // Initialize active tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Current time helper e.g. "14:30"
  const getCurrentTimeStr = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const getPastTimeStr = (minutesAgo: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - minutesAgo);
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  // 1. SLEEP FORM STATE
  const [sleepType, setSleepType] = useState<'nap' | 'night'>('nap');
  const [sleepStart, setSleepStart] = useState(getPastTimeStr(90));
  const [sleepEnd, setSleepEnd] = useState(getCurrentTimeStr());
  const [sleepQuality, setSleepQuality] = useState<'peaceful' | 'restless' | 'broken'>('peaceful');
  const [wakeMood, setWakeMood] = useState<BabyMood>('happy');
  const [sleepNotes, setSleepNotes] = useState('');

  // 2. FEED FORM STATE
  const [feedType, setFeedType] = useState<FeedType>('nursing');
  const [feedTime, setFeedTime] = useState(getCurrentTimeStr());
  const [nursingDuration, setNursingDuration] = useState(20);
  const [breastSide, setBreastSide] = useState<BreastSide>('both');
  const [formulaAmountMl, setFormulaAmountMl] = useState(150);
  const [formulaAmountOz, setFormulaAmountOz] = useState(5);
  const [foodDescription, setFoodDescription] = useState('Organic sweet potato puree');
  const [feedNotes, setFeedNotes] = useState('');

  // 3. DIAPER FORM STATE
  const [diaperType, setDiaperType] = useState<DiaperType>('both');
  const [diaperTime, setDiaperTime] = useState(getCurrentTimeStr());
  const [hasRashCream, setHasRashCream] = useState(false);
  const [diaperNotes, setDiaperNotes] = useState('');

  // 4. CUSTOM ACTIVITY FORM STATE
  const [customType, setCustomType] = useState<'tummy_time' | 'bath' | 'play' | 'medicine' | 'custom_note'>('tummy_time');
  const [activityTitle, setActivityTitle] = useState('Tummy Time Practice');
  const [activityTime, setActivityTime] = useState(getCurrentTimeStr());
  const [activityDuration, setActivityDuration] = useState(15);
  const [activityNotes, setActivityNotes] = useState('');

  // 5. LIVE STOPWATCH TIMER STATE
  const [timerType, setTimerType] = useState<'sleep' | 'nursing_left' | 'nursing_right' | 'tummy'>('sleep');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimerDigits = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getCaregiverAvatar = (cg: string) => {
    if (cg.includes('Mom')) return '👩‍🦰';
    if (cg.includes('Dad')) return '👨‍🦱';
    if (cg.includes('Nanny')) return '👩‍⚕️';
    return '👵';
  };

  const triggerSuccessCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Submit Sleep
  const handleSubmitSleep = (e: React.FormEvent) => {
    e.preventDefault();
    const [sH, sM] = sleepStart.split(':').map(Number);
    const [eH, eM] = sleepEnd.split(':').map(Number);
    let startMin = sH * 60 + sM;
    let endMin = eH * 60 + eM;
    if (endMin < startMin) {
      endMin += 24 * 60;
    }
    const duration = Math.max(10, endMin - startMin);

    const log: SleepLog = {
      id: `sleep-${Date.now()}`,
      type: sleepType,
      startTime: sleepStart,
      endTime: sleepEnd,
      durationMinutes: duration,
      quality: sleepQuality,
      moodUponWaking: wakeMood,
      notes: sleepNotes || (sleepType === 'nap' ? 'Calm daytime nap in crib.' : 'Night sleep session.'),
      loggedBy: caregiver,
      caregiverAvatar: getCaregiverAvatar(caregiver),
      date: 'Today'
    };

    onAddSleepLog(log);
    triggerSuccessCelebration();
    onClose();
  };

  // Submit Feed
  const handleSubmitFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const log: FeedLog = {
      id: `feed-${Date.now()}`,
      feedType,
      time: feedTime,
      durationMinutes: feedType === 'nursing' ? nursingDuration : undefined,
      breastSide: feedType === 'nursing' ? breastSide : undefined,
      amountMl: feedType === 'formula' || feedType === 'pumped_milk' ? formulaAmountMl : undefined,
      amountOz: feedType === 'formula' || feedType === 'pumped_milk' ? formulaAmountOz : undefined,
      foodDescription: feedType === 'solids' ? foodDescription : undefined,
      notes: feedNotes || (feedType === 'nursing' ? `Nursed on ${breastSide} side for ${nursingDuration}m` : `${formulaAmountMl}ml bottle feed`),
      loggedBy: caregiver,
      caregiverAvatar: getCaregiverAvatar(caregiver),
      date: 'Today'
    };

    onAddFeedLog(log);
    triggerSuccessCelebration();
    onClose();
  };

  // Submit Diaper
  const handleSubmitDiaper = (e: React.FormEvent) => {
    e.preventDefault();
    const log: DiaperLog = {
      id: `diaper-${Date.now()}`,
      diaperType,
      time: diaperTime,
      hasRashCream,
      notes: diaperNotes || (diaperType === 'both' ? 'Wet + dirty diaper change' : diaperType === 'dirty' ? 'Dirty diaper change' : 'Wet diaper change'),
      loggedBy: caregiver,
      caregiverAvatar: getCaregiverAvatar(caregiver),
      date: 'Today'
    };

    onAddDiaperLog(log);
    triggerSuccessCelebration();
    onClose();
  };

  // Submit Activity
  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const log: CustomActivityLog = {
      id: `act-${Date.now()}`,
      activityType: customType,
      title: activityTitle,
      time: activityTime,
      durationMinutes: activityDuration,
      notes: activityNotes || `${activityTitle} completed happily`,
      loggedBy: caregiver,
      caregiverAvatar: getCaregiverAvatar(caregiver),
      date: 'Today'
    };

    onAddActivityLog(log);
    triggerSuccessCelebration();
    onClose();
  };

  // Convert timer session to log
  const handleSaveTimerSession = () => {
    const durationMins = Math.max(1, Math.round(timerSeconds / 60));
    setTimerRunning(false);

    if (timerType === 'sleep') {
      const now = getCurrentTimeStr();
      const start = getPastTimeStr(durationMins);
      const log: SleepLog = {
        id: `sleep-${Date.now()}`,
        type: durationMins > 120 ? 'night' : 'nap',
        startTime: start,
        endTime: now,
        durationMinutes: durationMins,
        quality: 'peaceful',
        moodUponWaking: 'happy',
        notes: `Recorded via live timer (${durationMins} minutes).`,
        loggedBy: caregiver,
        caregiverAvatar: getCaregiverAvatar(caregiver),
        date: 'Today'
      };
      onAddSleepLog(log);
    } else if (timerType.startsWith('nursing')) {
      const side = timerType === 'nursing_left' ? 'left' : 'right';
      const log: FeedLog = {
        id: `feed-${Date.now()}`,
        feedType: 'nursing',
        time: getCurrentTimeStr(),
        durationMinutes: durationMins,
        breastSide: side,
        notes: `Live timed nursing session on ${side} side (${durationMins}m).`,
        loggedBy: caregiver,
        caregiverAvatar: getCaregiverAvatar(caregiver),
        date: 'Today'
      };
      onAddFeedLog(log);
    } else if (timerType === 'tummy') {
      const log: CustomActivityLog = {
        id: `act-${Date.now()}`,
        activityType: 'tummy_time',
        title: 'Tummy Time Practice',
        time: getCurrentTimeStr(),
        durationMinutes: durationMins,
        notes: `Live timed tummy session (${durationMins} mins). Strong neck control!`,
        loggedBy: caregiver,
        caregiverAvatar: getCaregiverAvatar(caregiver),
        date: 'Today'
      };
      onAddActivityLog(log);
    }

    setTimerSeconds(0);
    triggerSuccessCelebration();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        id="activity-logger-modal"
        className="bg-white rounded-[32px] border-2 border-[#E7DDD5] shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="p-6 sm:px-8 border-b border-[#F0E6DD] bg-[#FFFBF7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-xl shadow-xs">
              🍼
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Log Baby Activity
              </h3>
              <p className="text-xs text-[#57534E] font-medium">
                Sleepy Lullaby Dreams • Real-time Caregiver Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Caregiver select pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white border-2 border-[#D6C7BC] px-3 py-1.5 rounded-full text-xs font-bold text-[#1C1917]">
              <span>{getCaregiverAvatar(caregiver)}</span>
              <select
                value={caregiver}
                onChange={(e) => setCaregiver(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold text-[#1C1917]"
              >
                <option value="Sarah (Mom)">Sarah (Mom)</option>
                <option value="David (Dad)">David (Dad)</option>
                <option value="Elena (Nanny)">Elena (Nanny)</option>
                <option value="Martha (Grandma)">Martha (Grandma)</option>
              </select>
            </div>

            <button
              id="close-activity-logger-modal-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border-2 border-[#D6C7BC] flex items-center justify-center text-[#1C1917] hover:bg-[#F0E6DD] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="px-6 pt-4 pb-2 bg-white border-b border-[#F0E6DD] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-log-sleep-btn"
            onClick={() => setActiveTab('sleep')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sleep'
                ? 'bg-[#EDE9FE] text-[#5B21B6] border-2 border-[#8B5CF6] shadow-sm'
                : 'text-[#57534E] hover:bg-[#FFFBF7] border-2 border-transparent'
            }`}
          >
            <Moon className="w-4 h-4 text-[#7C3AED]" />
            <span>Sleep & Naps</span>
          </button>

          <button
            id="tab-log-feed-btn"
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-[#FEF3C7] text-[#92400E] border-2 border-[#F59E0B] shadow-sm'
                : 'text-[#57534E] hover:bg-[#FFFBF7] border-2 border-transparent'
            }`}
          >
            <Milk className="w-4 h-4 text-[#D97706]" />
            <span>Feedings</span>
          </button>

          <button
            id="tab-log-diaper-btn"
            onClick={() => setActiveTab('diaper')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'diaper'
                ? 'bg-[#E0F2FE] text-[#0369A1] border-2 border-[#0284C7] shadow-sm'
                : 'text-[#57534E] hover:bg-[#FFFBF7] border-2 border-transparent'
            }`}
          >
            <Baby className="w-4 h-4 text-[#0284C7]" />
            <span>Diaper Changes</span>
          </button>

          <button
            id="tab-log-activity-btn"
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-[#DCFCE7] text-[#166534] border-2 border-[#22C55E] shadow-sm'
                : 'text-[#57534E] hover:bg-[#FFFBF7] border-2 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#16A34A]" />
            <span>Tummy & Notes</span>
          </button>

          <button
            id="tab-log-timer-btn"
            onClick={() => setActiveTab('timer')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timer'
                ? 'bg-[#FFE4E6] text-[#9F1239] border-2 border-[#FF5A5F] shadow-sm'
                : 'text-[#57534E] hover:bg-[#FFFBF7] border-2 border-transparent'
            }`}
          >
            <Clock className="w-4 h-4 text-[#FF5A5F]" />
            <span>Live Timers</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">

          {/* 1. SLEEP FORM */}
          {activeTab === 'sleep' && (
            <form onSubmit={handleSubmitSleep} className="space-y-5">
              <div className="flex items-center justify-between bg-[#FFFBF7] p-3.5 rounded-2xl border-2 border-[#E7DDD5]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                  <Moon className="w-4 h-4 text-[#FF5A5F]" />
                  <span>Select Sleep Category:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSleepType('nap')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      sleepType === 'nap'
                        ? 'bg-[#FEF3C7] text-[#92400E] border-2 border-[#F59E0B] shadow-xs'
                        : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC]'
                    }`}
                  >
                    ☀️ Daytime Nap
                  </button>
                  <button
                    type="button"
                    onClick={() => setSleepType('night')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      sleepType === 'night'
                        ? 'bg-[#EDE9FE] text-[#5B21B6] border-2 border-[#8B5CF6] shadow-xs'
                        : 'bg-white text-[#1C1917] border-2 border-[#D6C7BC]'
                    }`}
                  >
                    🌙 Nighttime Sleep
                  </button>
                </div>
              </div>

              {/* Start Time, End Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] space-y-2">
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Fell Asleep (Start Time)
                  </label>
                  <input
                    type="time"
                    value={sleepStart}
                    onChange={(e) => setSleepStart(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                    required
                  />
                  <div className="flex gap-1.5">
                    {[-30, -60, -90].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setSleepStart(getPastTimeStr(Math.abs(mins)))}
                        className="text-[10px] font-bold text-[#57534E] bg-white border border-[#D6C7BC] px-2 py-0.5 rounded-md hover:bg-[#F0E6DD] cursor-pointer"
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] space-y-2">
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Woke Up (End Time)
                  </label>
                  <input
                    type="time"
                    value={sleepEnd}
                    onChange={(e) => setSleepEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                    required
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSleepEnd(getCurrentTimeStr())}
                      className="text-[10px] font-bold text-[#1E7B28] bg-[#E8F5E9] border border-[#C8E6C9] px-2.5 py-0.5 rounded-md cursor-pointer"
                    >
                      Now ({getCurrentTimeStr()})
                    </button>
                  </div>
                </div>
              </div>

              {/* Quality & Mood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Sleep Quality
                  </label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFBF7] rounded-2xl border-2 border-[#D6C7BC] text-xs font-bold text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  >
                    <option value="peaceful">✨ Peaceful & Deep (Zero Wakings)</option>
                    <option value="restless">🔄 Restless (Stirred or Moved)</option>
                    <option value="broken">⚡ Broken (Multiple night wakings)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Mood Upon Waking
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['happy', 'peaceful', 'fussy', 'crying'] as BabyMood[]).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setWakeMood(m)}
                        className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all cursor-pointer ${
                          wakeMood === m
                            ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-sm'
                            : 'bg-[#FFFBF7] text-[#1C1917] border-[#D6C7BC]'
                        }`}
                      >
                        {m === 'happy' ? '😊 Happy' : m === 'peaceful' ? '😌 Calm' : m === 'fussy' ? '🥺 Fussy' : '😭 Crying'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Soothing Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#1C1917]">
                  Sleep Notes & Soothing Method
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swaddled in crib, fell asleep within 5 minutes with pink noise"
                  value={sleepNotes}
                  onChange={(e) => setSleepNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-2xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-[#F0E6DD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1C1917] hover:bg-[#F0E6DD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Sleep Session</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. FEEDING FORM */}
          {activeTab === 'feed' && (
            <form onSubmit={handleSubmitFeed} className="space-y-5">
              {/* Feeding Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { type: 'nursing' as FeedType, label: 'Nursing', emoji: '🤱' },
                  { type: 'formula' as FeedType, label: 'Formula Bottle', emoji: '🍼' },
                  { type: 'pumped_milk' as FeedType, label: 'Pumped Milk', emoji: '🥛' },
                  { type: 'solids' as FeedType, label: 'Solid Food', emoji: '🥑' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.type}
                    onClick={() => setFeedType(item.type)}
                    className={`py-3 px-2 rounded-2xl text-xs font-extrabold flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                      feedType === item.type
                        ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B] shadow-xs'
                        : 'bg-[#FFFBF7] text-[#1C1917] border-[#D6C7BC] hover:bg-[#F0E6DD]'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Time of feed */}
              <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] flex items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Time of Feeding
                  </label>
                  <span className="text-[11px] text-[#57534E] font-medium">When baby began feeding</span>
                </div>
                <input
                  type="time"
                  value={feedTime}
                  onChange={(e) => setFeedTime(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  required
                />
              </div>

              {/* Specific Options based on Feed Type */}
              {feedType === 'nursing' && (
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                      Breastfed Side
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['left', 'right', 'both'] as BreastSide[]).map((side) => (
                        <button
                          type="button"
                          key={side}
                          onClick={() => setBreastSide(side)}
                          className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all cursor-pointer ${
                            breastSide === side
                              ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-sm'
                              : 'bg-white text-[#1C1917] border-[#D6C7BC]'
                          }`}
                        >
                          {side === 'left' ? '👈 Left Breast' : side === 'right' ? '👉 Right Breast' : '🔄 Both Sides'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-extrabold text-[#1C1917] mb-1">
                      <span>Nursing Duration:</span>
                      <span className="text-[#FF5A5F] text-sm font-black">{nursingDuration} minutes</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={nursingDuration}
                      onChange={(e) => setNursingDuration(Number(e.target.value))}
                      className="w-full accent-[#FF5A5F] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#57534E] font-semibold">
                      <span>5 mins</span>
                      <span>20 mins (typical)</span>
                      <span>60 mins</span>
                    </div>
                  </div>
                </div>
              )}

              {(feedType === 'formula' || feedType === 'pumped_milk') && (
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#1C1917] mb-1">
                        Amount (ml)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={350}
                        step={10}
                        value={formulaAmountMl}
                        onChange={(e) => {
                          const ml = Number(e.target.value);
                          setFormulaAmountMl(ml);
                          setFormulaAmountOz(Math.round((ml / 30) * 10) / 10);
                        }}
                        className="w-full px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-[#1C1917] mb-1">
                        Amount (oz)
                      </label>
                      <input
                        type="number"
                        min={0.5}
                        max={12}
                        step={0.5}
                        value={formulaAmountOz}
                        onChange={(e) => {
                          const oz = Number(e.target.value);
                          setFormulaAmountOz(oz);
                          setFormulaAmountMl(Math.round(oz * 30));
                        }}
                        className="w-full px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                      />
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[60, 90, 120, 150, 180, 210].map((ml) => (
                      <button
                        type="button"
                        key={ml}
                        onClick={() => {
                          setFormulaAmountMl(ml);
                          setFormulaAmountOz(Math.round((ml / 30) * 10) / 10);
                        }}
                        className="px-3 py-1 bg-white border-2 border-[#D6C7BC] text-xs font-bold text-[#1C1917] rounded-lg hover:bg-[#F0E6DD] cursor-pointer"
                      >
                        {ml} ml ({Math.round((ml / 30) * 10) / 10} oz)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {feedType === 'solids' && (
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2">
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Food & Meal Description
                  </label>
                  <input
                    type="text"
                    value={foodDescription}
                    onChange={(e) => setFoodDescription(e.target.value)}
                    placeholder="e.g. Mashed banana with infant oat cereal"
                    className="w-full px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  />
                </div>
              )}

              {/* Feed Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#1C1917]">
                  Feeding Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Latched quickly, calm burp, drowsy afterwards"
                  value={feedNotes}
                  onChange={(e) => setFeedNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-2xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-[#F0E6DD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1C1917] hover:bg-[#F0E6DD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Log Feeding</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. DIAPER FORM */}
          {activeTab === 'diaper' && (
            <form onSubmit={handleSubmitDiaper} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#1C1917]">
                  Diaper Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDiaperType('wet')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      diaperType === 'wet'
                        ? 'bg-[#E0F2FE] border-[#0284C7] text-[#0369A1] shadow-xs'
                        : 'bg-[#FFFBF7] border-[#D6C7BC] text-[#1C1917] hover:bg-[#F0E6DD]'
                    }`}
                  >
                    <span className="text-2xl">💧</span>
                    <span className="text-xs font-extrabold">Wet Diaper</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiaperType('dirty')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      diaperType === 'dirty'
                        ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] shadow-xs'
                        : 'bg-[#FFFBF7] border-[#D6C7BC] text-[#1C1917] hover:bg-[#F0E6DD]'
                    }`}
                  >
                    <span className="text-2xl">💩</span>
                    <span className="text-xs font-extrabold">Dirty Diaper</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiaperType('both')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      diaperType === 'both'
                        ? 'bg-[#DCFCE7] border-[#22C55E] text-[#166534] shadow-xs'
                        : 'bg-[#FFFBF7] border-[#D6C7BC] text-[#1C1917] hover:bg-[#F0E6DD]'
                    }`}
                  >
                    <span className="text-2xl">💧💩</span>
                    <span className="text-xs font-extrabold">Both (Wet + Dirty)</span>
                  </button>
                </div>
              </div>

              {/* Time of diaper change */}
              <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] flex items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Change Timestamp
                  </label>
                  <span className="text-[11px] text-[#57534E] font-medium">Exact time diaper was changed</span>
                </div>
                <input
                  type="time"
                  value={diaperTime}
                  onChange={(e) => setDiaperTime(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  required
                />
              </div>

              {/* Rash Cream Toggle */}
              <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-sm">
                    🧴
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-[#1C1917]">Applied Diaper Rash Cream?</h5>
                    <p className="text-[11px] text-[#57534E] font-medium">Zinc / organic barrier balm</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHasRashCream(!hasRashCream)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    hasRashCream
                      ? 'bg-[#1E7B28] text-white shadow-sm'
                      : 'bg-white border-2 border-[#D6C7BC] text-[#1C1917]'
                  }`}
                >
                  {hasRashCream ? '✓ Yes Applied' : 'No'}
                </button>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#1C1917]">
                  Diaper Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Normal texture and color, skin looks healthy"
                  value={diaperNotes}
                  onChange={(e) => setDiaperNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-2xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-[#F0E6DD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1C1917] hover:bg-[#F0E6DD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Log Diaper Change</span>
                </button>
              </div>
            </form>
          )}

          {/* 4. CUSTOM ACTIVITY FORM */}
          {activeTab === 'activity' && (
            <form onSubmit={handleSubmitActivity} className="space-y-5">
              {/* Activity Type Selection */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { type: 'tummy_time', label: 'Tummy Time', emoji: '🤸', defaultTitle: 'Tummy Time Practice' },
                  { type: 'bath', label: 'Bath Time', emoji: '🛁', defaultTitle: 'Warm Bedtime Bath' },
                  { type: 'play', label: 'Play & Stroll', emoji: '🧸', defaultTitle: 'Stroller Walk & Outdoor Sensory' },
                  { type: 'medicine', label: 'Vitamins / Meds', emoji: '💊', defaultTitle: 'Daily Vitamin D Drops' },
                  { type: 'custom_note', label: 'Custom Note', emoji: '📝', defaultTitle: 'Daily Milestone Note' },
                ].map((act) => (
                  <button
                    type="button"
                    key={act.type}
                    onClick={() => {
                      setCustomType(act.type as any);
                      setActivityTitle(act.defaultTitle);
                    }}
                    className={`py-3 px-2 rounded-2xl text-xs font-extrabold flex flex-col items-center gap-1 border-2 transition-all cursor-pointer ${
                      customType === act.type
                        ? 'bg-[#DCFCE7] text-[#166534] border-[#22C55E] shadow-xs'
                        : 'bg-[#FFFBF7] text-[#1C1917] border-[#D6C7BC] hover:bg-[#F0E6DD]'
                    }`}
                  >
                    <span className="text-xl">{act.emoji}</span>
                    <span className="text-[11px] leading-tight text-center">{act.label}</span>
                  </button>
                ))}
              </div>

              {/* Title input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#1C1917]">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-2xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  required
                />
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] space-y-2">
                  <label className="block text-xs font-extrabold text-[#1C1917]">
                    Time of Activity
                  </label>
                  <input
                    type="time"
                    value={activityTime}
                    onChange={(e) => setActivityTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                    required
                  />
                </div>

                <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] space-y-2">
                  <div className="flex justify-between text-xs font-extrabold text-[#1C1917]">
                    <span>Duration:</span>
                    <span className="text-[#1E7B28] font-black">{activityDuration} minutes</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(Number(e.target.value))}
                    className="w-full accent-[#1E7B28] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#57534E] font-semibold">
                    <span>5m</span>
                    <span>15m</span>
                    <span>30m</span>
                    <span>60m</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-[#1C1917]">
                  Notes & Baby's Reaction
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lifted head high, giggled at rattle, very energetic!"
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-2xl border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-[#F0E6DD] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1C1917] hover:bg-[#F0E6DD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Log Activity</span>
                </button>
              </div>
            </form>
          )}

          {/* 5. LIVE STOPWATCH TIMERS */}
          {activeTab === 'timer' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5A5F] bg-[#FFE4E6] px-3.5 py-1 rounded-full border border-[#FECDD3]">
                  Live Baby Stopwatch
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#1C1917]">
                  Real-Time Session Timer
                </h4>
                <p className="text-xs text-[#57534E] font-medium max-w-sm mx-auto">
                  Start the timer when baby falls asleep, nurses, or begins tummy time. Stop and automatically save the exact session duration.
                </p>
              </div>

              {/* Timer Mode Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'sleep', label: 'Sleep Nap', emoji: '🌙' },
                  { id: 'nursing_left', label: 'Nurse (Left)', emoji: '🤱 Left' },
                  { id: 'nursing_right', label: 'Nurse (Right)', emoji: '🤱 Right' },
                  { id: 'tummy', label: 'Tummy Time', emoji: '🤸' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setTimerType(mode.id as any);
                    }}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-extrabold border-2 transition-all cursor-pointer ${
                      timerType === mode.id
                        ? 'bg-[#FF5A5F] text-white border-[#FF5A5F] shadow-sm'
                        : 'bg-[#FFFBF7] text-[#1C1917] border-[#D6C7BC] hover:bg-[#F0E6DD]'
                    }`}
                  >
                    <span>{mode.emoji} {mode.label}</span>
                  </button>
                ))}
              </div>

              {/* Big Timer Display */}
              <div className="bg-[#FFFBF7] rounded-3xl p-8 border-2 border-[#E7DDD5] text-center space-y-4 shadow-inner">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border-2 border-[#D6C7BC] text-xs font-extrabold text-[#1C1917]">
                  <span className={`w-2 h-2 rounded-full ${timerRunning ? 'bg-[#1E7B28] animate-ping' : 'bg-[#FF5A5F]'}`} />
                  <span>Tracking: {timerType === 'sleep' ? 'Baby Sleep Rest' : timerType.includes('nursing') ? 'Active Nursing' : 'Tummy Exercise'}</span>
                </div>

                <div className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-[#1C1917]">
                  {formatTimerDigits(timerSeconds)}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`px-8 py-3.5 rounded-full text-sm font-extrabold text-white shadow-lg transition-all cursor-pointer flex items-center gap-2 ${
                      timerRunning
                        ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                        : 'bg-[#FF5A5F] hover:bg-[#FF4147] shadow-lg shadow-[#FF5A5F]/35 active:scale-95'
                    }`}
                  >
                    {timerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>Pause Timer</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>{timerSeconds > 0 ? 'Resume Timer' : 'Start Timer'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSeconds(0);
                    }}
                    className="p-3.5 rounded-full bg-white border-2 border-[#D6C7BC] text-[#1C1917] hover:bg-[#F0E6DD] transition-colors cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Save Timer Button */}
              {timerSeconds > 10 && (
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSaveTimerSession}
                    className="px-8 py-3 rounded-full text-sm font-extrabold text-white bg-[#1E7B28] hover:bg-[#16601f] shadow-lg shadow-[#1E7B28]/35 active:scale-95 transition-all flex items-center gap-2 cursor-pointer animate-bounce-subtle"
                  >
                    <Check className="w-4 h-4" />
                    <span>Stop & Save Session ({Math.max(1, Math.round(timerSeconds / 60))}m)</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
