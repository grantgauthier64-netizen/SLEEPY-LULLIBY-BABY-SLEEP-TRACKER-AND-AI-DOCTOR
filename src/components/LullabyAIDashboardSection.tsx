import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Clock, 
  Sparkles, 
  HeartPulse, 
  Milk, 
  Baby, 
  Play, 
  Plus, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Timer, 
  ShieldCheck, 
  Send, 
  Bot, 
  Volume2, 
  Zap, 
  ChevronRight, 
  Layers, 
  Copy, 
  Check, 
  RotateCcw,
  Thermometer,
  Smile,
  Frown,
  Meh,
  Syringe
} from 'lucide-react';
import { 
  SleepLog, 
  FeedLog, 
  DiaperLog, 
  CustomActivityLog, 
  BabyProfile,
  UnifiedDailyEvent,
  VaccineRecord
} from '../types';
import { WEEKLY_SLEEP_PATTERNS } from '../data/sleepData';
import { VaccinationTrackingCard } from './VaccinationTrackingCard';
import babyBottleBg from '../assets/images/baby_bottle_dark_pastel_1787436304366.jpg';

interface LullabyAIDashboardSectionProps {
  logs: SleepLog[];
  feedLogs: FeedLog[];
  diaperLogs: DiaperLog[];
  activityLogs: CustomActivityLog[];
  babyProfile: BabyProfile;
  vaccineRecords?: Record<string, VaccineRecord>;
  onUpdateVaccineRecord?: (record: VaccineRecord) => void;
  onOpenLoggerModal: (tab?: 'sleep' | 'feed' | 'diaper' | 'activity' | 'timer') => void;
  onOpenAIAgent: () => void;
  onAddSleepLog: (log: SleepLog) => void;
}

export const LullabyAIDashboardSection: React.FC<LullabyAIDashboardSectionProps> = ({
  logs,
  feedLogs,
  diaperLogs,
  activityLogs,
  babyProfile,
  vaccineRecords,
  onUpdateVaccineRecord,
  onOpenLoggerModal,
  onOpenAIAgent,
  onAddSleepLog
}) => {
  // Active Tab within Dashboard: 'all' | 'tracker' | 'doctor' | 'vaccines'
  const [dashboardTab, setDashboardTab] = useState<'all' | 'tracker' | 'doctor' | 'vaccines'>('all');

  // Live Baby State (Awake vs Sleeping)
  const [isBabySleeping, setIsBabySleeping] = useState<boolean>(false);
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState<number>(6300); // 1h 45m awake
  const [wakeMinutesElapsed, setWakeMinutesElapsed] = useState<number>(105);

  // AI Pediatric Doctor in-dashboard state
  const [doctorQuery, setDoctorQuery] = useState<string>('');
  const [isDoctorLoading, setIsDoctorLoading] = useState<boolean>(false);
  const [doctorActiveTool, setDoctorActiveTool] = useState<'fever' | 'feeding' | 'teething' | 'vaccines' | 'sleep' | 'safesleep'>('fever');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // In-dashboard live chat history
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: string;
    source?: string;
  }>>([
    {
      id: 'init-msg-1',
      role: 'assistant',
      content: `Hello! I'm **Dr. Lullaby (MD)** along with **Nurse Daisy (RN)** from the Pediatric AI Clinic. 

How can we assist you with **${babyProfile.name}** (${babyProfile.ageMonths} months old) today? You can ask about **infant fevers**, **starting solids & allergen schedules**, **wake windows**, or **teething relief** anytime!`,
      timestamp: 'Just now'
    }
  ]);

  // Fever Calculator state in dashboard
  const [tempF, setTempF] = useState<number>(100.2);
  const [tempMethod, setTempMethod] = useState<'rectal' | 'axillary' | 'forehead'>('rectal');

  // Feeding State in dashboard
  const [feedingStage, setFeedingStage] = useState<'nursing' | 'formula' | 'starting_solids' | 'finger_foods'>('starting_solids');
  const [solidsChecked, setSolidsChecked] = useState<string[]>([
    'sitting_up', 'tongue_thrust', 'grasping'
  ]);

  // Teething Checklist
  const [teethingChecked, setTeethingChecked] = useState<string[]>(['drooling', 'chewing']);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveElapsedSeconds(prev => prev + 1);
      if (!isBabySleeping) {
        setWakeMinutesElapsed(prev => Math.min(240, prev + (1 / 60)));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isBabySleeping]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.floor(totalSec % 60);
    return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Wake Window Math based on age
  const targetWakeMax = babyProfile.ageMonths <= 3 ? 90 : babyProfile.ageMonths <= 5 ? 135 : babyProfile.ageMonths <= 8 ? 165 : 210;
  const currentWakeMins = Math.round(wakeMinutesElapsed);
  const wakePercent = Math.min(100, Math.round((currentWakeMins / targetWakeMax) * 100));
  const minutesUntilSweetSpot = Math.max(0, targetWakeMax - currentWakeMins);

  // Fever Evaluation
  const getFeverEvaluation = () => {
    const adjustedTemp = tempMethod === 'axillary' ? tempF + 1.0 : tempF;
    const isUnder3m = babyProfile.ageMonths < 3;

    if (adjustedTemp >= 104.0) {
      return {
        status: 'critical',
        label: 'High Fever — Immediate Medical Care',
        badge: '🚨 Urgent Attention',
        color: 'bg-red-50 text-red-700 border-red-200',
        advice: 'Contact your pediatrician or visit urgent care immediately. Keep baby in light clothing and ensure hydration.'
      };
    }
    if (isUnder3m && adjustedTemp >= 100.4) {
      return {
        status: 'critical',
        label: 'Infant Fever (<3 Months)',
        badge: '🚨 Urgent Under 3m',
        color: 'bg-red-50 text-red-700 border-red-200',
        advice: 'Any rectal temp ≥100.4°F in babies under 3 months is a pediatric emergency. Call doctor/ER right away.'
      };
    }
    if (adjustedTemp >= 101.0) {
      return {
        status: 'moderate',
        label: 'Mild to Moderate Fever',
        badge: '⚠️ Monitor & Hydrate',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        advice: 'Offer frequent feeds to prevent dehydration. Consult doctor if fever persists >48 hours or baby is lethargic.'
      };
    }
    if (adjustedTemp >= 100.4) {
      return {
        status: 'low',
        label: 'Low-Grade Elevated Temp',
        badge: 'ℹ️ Low-Grade Temp',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        advice: 'Monitor temperature trends. Ensure room temperature is 68-72°F and baby is not overdressed.'
      };
    }
    return {
      status: 'normal',
      label: 'Normal Body Temperature',
      badge: '✓ Normal Temperature',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      advice: 'Normal infant temperature range. Continue regular sleep, hydration, and feeding routines.'
    };
  };

  const feverEval = getFeverEvaluation();

  // Send AI chat message
  const handleSendDoctorMessage = async (overrideText?: string) => {
    const text = (overrideText || doctorQuery).trim();
    if (!text || isDoctorLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user' as const,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setDoctorQuery('');
    setIsDoctorLoading(true);

    try {
      // Build conversation payload
      const apiMessages = [...chatMessages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          babyProfile
        })
      });

      const data = await res.json();
      const reply = data.reply || "I am here to support you! What specific question do you have about your baby's sleep or health?";

      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source
        }
      ]);
    } catch (err) {
      console.error("AI Doctor Consultation failed:", err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `### 🩺 Pediatric Guidance for ${babyProfile.name}

Here is evidence-based pediatric advice:
- **Sleep & Wake Windows:** For a ${babyProfile.ageMonths}-month-old, aim for ~${targetWakeMax / 60} hour wake windows between daytime naps.
- **Hydration:** Ensure 5–6+ wet diapers every 24 hours.
- **AAP Safe Sleep:** Keep crib flat, firm, and free of loose bedding or positioners.

*Feel free to ask about fevers, starting solids, or teething comfort anytime!*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsDoctorLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick State Toggler
  const toggleBabyState = () => {
    if (!isBabySleeping) {
      // Transitioning to Sleep
      setIsBabySleeping(true);
      setLiveElapsedSeconds(0);
      // Auto create a sleep log entry
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      onAddSleepLog({
        id: `sleep-live-${Date.now()}`,
        type: 'nap',
        startTime: timeStr,
        endTime: timeStr,
        durationMinutes: 0,
        quality: 'peaceful',
        moodUponWaking: 'happy',
        notes: 'Live sleep session in progress',
        loggedBy: 'Mom (Sarah)',
        caregiverAvatar: '👩‍🦰',
        date: 'Today'
      });
    } else {
      // Transitioning to Awake
      setIsBabySleeping(false);
      setLiveElapsedSeconds(0);
      setWakeMinutesElapsed(0);
    }
  };

  // Calculate 24h Totals
  const totalSleepMins = logs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalSleepHours = (totalSleepMins / 60).toFixed(1);
  const napLogs = logs.filter(l => l.type === 'nap');
  const nightLogs = logs.filter(l => l.type === 'night');

  return (
    <section 
      id="lullaby-ai-dashboard" 
      className="py-16 md:py-24 bg-transparent relative overflow-hidden border-t-2 border-[#E7DDD5]"
    >
      {/* Baby in Diaper Drinking Bottle Ambient Background with Rich Dark Pastel Grading */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        <img
          src={babyBottleBg}
          alt="Baby in diaper drinking bottle"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top opacity-40 mix-blend-multiply filter contrast-[1.15] brightness-[0.92] saturate-[1.2] scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A324A]/20 via-transparent to-[#2E2738]/25" />
        <div className="absolute inset-0 bg-[#FFFBF7]/55" />
      </div>

      {/* Subtle Pastel Ambient Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-[#FFE4E6]/25 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-[#EDE9FE]/25 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE4E6] text-[#9F1239] text-xs font-extrabold uppercase tracking-wider border border-[#FECDD3] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A5F]" />
                Live Care Command Center
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#166534] text-xs font-bold border border-[#BBF7D0]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Dr. Lullaby AI Clinic Online
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
              Lullaby AI Baby Doctor & <span className="text-[#FF5A5F] italic">Sleep Tracker Dashboard</span>
            </h2>

            <p className="text-base sm:text-lg text-[#57534E] font-normal leading-relaxed">
              Real-time circadian sleep monitoring, wake window predictors, instant pediatric clinical triage, and comprehensive daily care logging for <strong>{babyProfile.name}</strong> ({babyProfile.ageMonths} months).
            </p>
          </div>

          {/* Quick Mode Switcher Pills */}
          <div className="bg-[#F5EFEB] p-1.5 rounded-2xl border border-[#E7DDD5] flex items-center gap-1 shadow-2xs shrink-0 self-start lg:self-auto">
            <button
              id="dash-tab-all"
              onClick={() => setDashboardTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardTab === 'all'
                  ? 'bg-white text-[#1C1917] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#FF5A5F]" />
              <span>Unified Dashboard</span>
            </button>
            <button
              id="dash-tab-tracker"
              onClick={() => setDashboardTab('tracker')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardTab === 'tracker'
                  ? 'bg-white text-[#1C1917] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Moon className="w-4 h-4 text-[#7C3AED]" />
              <span>Sleep Tracker</span>
            </button>
            <button
              id="dash-tab-doctor"
              onClick={() => setDashboardTab('doctor')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardTab === 'doctor'
                  ? 'bg-white text-[#1C1917] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Bot className="w-4 h-4 text-[#059669]" />
              <span>AI Baby Doctor</span>
            </button>
            <button
              id="dash-tab-vaccines"
              onClick={() => setDashboardTab('vaccines')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dashboardTab === 'vaccines'
                  ? 'bg-white text-[#1C1917] shadow-sm'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Syringe className="w-4 h-4 text-[#166534]" />
              <span>Vaccine Schedule</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TOP STATUS HERO BAR: Live Baby State & Wake Window Meter */}
        {/* ========================================================= */}
        <div className="mb-8 bg-white rounded-3xl border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Live State & Timer Toggler */}
            <div className="md:col-span-4 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-all ${
                isBabySleeping 
                  ? 'bg-[#7C3AED] text-white shadow-[#7C3AED]/35' 
                  : 'bg-[#FF5A5F] text-white shadow-[#FF5A5F]/35'
              }`}>
                {isBabySleeping ? (
                  <Moon className="w-8 h-8 animate-pulse text-purple-200 fill-current" />
                ) : (
                  <Sun className="w-8 h-8 animate-spin-slow text-amber-200" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isBabySleeping 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {isBabySleeping ? '● Sleeping' : '● Awake'}
                  </span>
                  <span className="text-xs text-[#78716C] font-semibold">
                    Live Session
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-mono text-[#1C1917]">
                  {formatTimer(liveElapsedSeconds)}
                </h3>
                <button
                  id="dashboard-toggle-live-state-btn"
                  onClick={toggleBabyState}
                  className="text-xs font-bold text-[#FF5A5F] hover:text-[#E11D48] underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isBabySleeping ? 'Tap to Wake Baby' : 'Tap to Mark Sleeping'}</span>
                </button>
              </div>
            </div>

            {/* Wake Window Circadian Meter */}
            <div className="md:col-span-5 space-y-2 border-t md:border-t-0 md:border-l border-[#F0E6DD] pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Circadian Sweet Spot Window ({targetWakeMax / 60}h max)
                </span>
                <span className={wakePercent > 85 ? 'text-rose-600 font-extrabold' : 'text-[#57534E]'}>
                  {wakePercent}% Used
                </span>
              </div>

              <div className="w-full h-3 bg-[#F0E6DD] rounded-full overflow-hidden p-0.5 border border-[#E7DDD5]">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    wakePercent < 60
                      ? 'bg-emerald-500'
                      : wakePercent < 85
                      ? 'bg-amber-500'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                  style={{ width: `${wakePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#57534E]">
                <span>Awake: {currentWakeMins}m</span>
                <span className="font-bold text-[#1C1917]">
                  {isBabySleeping ? 'Resting Peacefully' : `Next Sweet Spot in ~${minutesUntilSweetSpot} mins`}
                </span>
              </div>
            </div>

            {/* Quick Logging Launcher Buttons */}
            <div className="md:col-span-3 flex flex-wrap md:flex-col gap-2 justify-end">
              <button
                id="dash-quick-log-sleep"
                onClick={() => onOpenLoggerModal('sleep')}
                className="flex-1 md:w-full py-2.5 px-3.5 rounded-xl bg-[#FF5A5F] hover:bg-[#FF4147] text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Sleep Session</span>
              </button>
              <button
                id="dash-quick-log-feed"
                onClick={() => onOpenLoggerModal('feed')}
                className="flex-1 md:w-full py-2.5 px-3.5 rounded-xl bg-[#FFFBF7] hover:bg-[#F5EFEB] border border-[#D6C7BC] text-[#1C1917] text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Milk className="w-3.5 h-3.5 text-amber-600" />
                <span>Log Feed / Bottle</span>
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN DASHBOARD GRID: SLEEP TRACKER + AI BABY DOCTOR */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: SLEEP TRACKER & DAILY CARE STREAM (6 or 12) */}
          {/* ======================================================= */}
          {(dashboardTab === 'all' || dashboardTab === 'tracker') && (
            <div className={`space-y-6 ${dashboardTab === 'tracker' ? 'lg:col-span-12' : 'lg:col-span-6'}`}>
              
              {/* Card 1: 24-Hour Sleep Architecture & Metrics */}
              <div className="bg-white rounded-3xl border-2 border-[#E7DDD5] p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#F0E6DD] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] flex items-center justify-center text-[#FF5A5F]">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        24-Hour Sleep Tracker & Patterns
                      </h3>
                      <p className="text-xs text-[#57534E]">
                        Target: {babyProfile.sleepGoal}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E8F5E9] text-[#166534] border border-[#BBF7D0]">
                    96% Rest Score
                  </span>
                </div>

                {/* 4 Sleep Summary Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5]">
                    <span className="text-[10px] font-extrabold uppercase text-[#78716C] block">
                      Total Sleep
                    </span>
                    <div className="text-lg font-bold text-[#1C1917] mt-0.5">
                      {totalSleepHours}h <span className="text-xs font-normal text-[#78716C]">/ 14h</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">On target</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5]">
                    <span className="text-[10px] font-extrabold uppercase text-[#78716C] block">
                      Day Naps
                    </span>
                    <div className="text-lg font-bold text-[#1C1917] mt-0.5">
                      {napLogs.length} <span className="text-xs font-normal text-[#78716C]">naps</span>
                    </div>
                    <span className="text-[10px] text-[#57534E]">3h 45m total</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5]">
                    <span className="text-[10px] font-extrabold uppercase text-[#78716C] block">
                      Night Rest
                    </span>
                    <div className="text-lg font-bold text-[#1C1917] mt-0.5">
                      10.5h
                    </div>
                    <span className="text-[10px] text-[#57534E]">1 night feed</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5]">
                    <span className="text-[10px] font-extrabold uppercase text-[#78716C] block">
                      Feeds & Diapers
                    </span>
                    <div className="text-lg font-bold text-[#1C1917] mt-0.5">
                      {feedLogs.length} / {diaperLogs.length}
                    </div>
                    <span className="text-[10px] text-[#57534E]">Healthy output</span>
                  </div>
                </div>

                {/* 24-Hour Circadian Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                    <span>Today's Sleep Rhythm Timeline</span>
                    <span className="text-[#FF5A5F]">24-Hour View</span>
                  </div>

                  <div className="h-10 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] p-1 flex items-center gap-1">
                    {/* Morning Nap */}
                    <div className="w-[15%] h-full bg-[#48CAE4] rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-2xs" title="Nap 1 (08:30 - 09:30)">
                      Nap 1
                    </div>
                    <div className="w-[20%] h-full bg-transparent flex items-center justify-center text-[9px] text-[#78716C]">
                      Awake 2h
                    </div>
                    {/* Midday Nap */}
                    <div className="w-[20%] h-full bg-[#48CAE4] rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-2xs" title="Nap 2 (11:45 - 13:15)">
                      Nap 2 (1.5h)
                    </div>
                    <div className="w-[15%] h-full bg-transparent flex items-center justify-center text-[9px] text-[#78716C]">
                      Awake
                    </div>
                    {/* Bridge Nap */}
                    <div className="w-[10%] h-full bg-[#38BDF8] rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-2xs" title="Bridge Nap 3 (16:30)">
                      Nap 3
                    </div>
                    {/* Night Sleep */}
                    <div className="w-[20%] h-full bg-[#FF5A5F] rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-2xs" title="Bedtime (19:30 - 07:00)">
                      Night
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-[#78716C] font-semibold px-1">
                    <span>7 AM</span>
                    <span>11 AM</span>
                    <span>3 PM</span>
                    <span>7 PM</span>
                    <span>11 PM</span>
                    <span>7 AM</span>
                  </div>
                </div>

                {/* Quick Care Action Pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F0E6DD]">
                  <button
                    onClick={() => onOpenLoggerModal('timer')}
                    className="py-2.5 px-3 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>Nap Stopwatch</span>
                  </button>
                  <button
                    onClick={() => onOpenLoggerModal('diaper')}
                    className="py-2.5 px-3 rounded-xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Baby className="w-3.5 h-3.5" />
                    <span>Log Diaper</span>
                  </button>
                  <button
                    onClick={() => onOpenLoggerModal('activity')}
                    className="py-2.5 px-3 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Tummy Time</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Recent Activity Stream */}
              <div className="bg-white rounded-3xl border-2 border-[#E7DDD5] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-[#1C1917]">
                    Recent Activity Logs
                  </h3>
                  <button 
                    onClick={() => onOpenLoggerModal('sleep')}
                    className="text-xs font-bold text-[#FF5A5F] hover:underline cursor-pointer"
                  >
                    + Add New
                  </button>
                </div>

                <div className="space-y-2.5">
                  {logs.slice(0, 3).map((log) => (
                    <div 
                      key={log.id}
                      className="p-3 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                          log.type === 'night' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                        }`}>
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1C1917]">
                            {log.type === 'night' ? 'Night Sleep' : 'Nap'} ({log.durationMinutes} mins)
                          </div>
                          <div className="text-[11px] text-[#78716C]">
                            {log.startTime} – {log.endTime} • {log.quality}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#1C1917] bg-white px-2.5 py-1 rounded-lg border border-[#E7DDD5]">
                        {log.loggedBy}
                      </span>
                    </div>
                  ))}

                  {feedLogs.slice(0, 2).map((feed) => (
                    <div 
                      key={feed.id}
                      className="p-3 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                          <Milk className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#1C1917]">
                            {feed.feedType === 'nursing' ? 'Nursing Feed' : 'Formula / Bottle'} {feed.amountOz ? `(${feed.amountOz} oz)` : ''}
                          </div>
                          <div className="text-[11px] text-[#78716C]">
                            At {feed.time} • {feed.notes || 'Full feed'}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#1C1917] bg-white px-2.5 py-1 rounded-lg border border-[#E7DDD5]">
                        {feed.loggedBy}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* RIGHT COLUMN: LULLABY AI BABY DOCTOR & CLINIC (6 or 12)  */}
          {/* ======================================================= */}
          {(dashboardTab === 'all' || dashboardTab === 'doctor') && (
            <div className={`space-y-6 ${dashboardTab === 'doctor' ? 'lg:col-span-12' : 'lg:col-span-6'}`}>
              
              {/* Doctor Interactive Triage Tools Card */}
              <div className="bg-white rounded-3xl border-2 border-[#E7DDD5] p-6 shadow-sm space-y-6">
                
                {/* Doctor Header */}
                <div className="flex items-center justify-between border-b border-[#F0E6DD] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Lullaby AI Baby Doctor Clinic
                      </h3>
                      <p className="text-xs text-[#57534E]">
                        Pediatric triage, fever calculators, & nutrition roadmap
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenAIAgent}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#EDE9FE] text-[#5B21B6] hover:bg-[#DDD6FE] border border-[#8B5CF6]/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                    <span>Expand Modal</span>
                  </button>
                </div>

                {/* Diagnostic Tool Tabs */}
                <div className="bg-[#FFFBF7] p-1.5 rounded-2xl border border-[#E7DDD5] flex items-center gap-1 overflow-x-auto scrollbar-none">
                  <button
                    id="dash-tool-fever"
                    onClick={() => setDoctorActiveTool('fever')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      doctorActiveTool === 'fever'
                        ? 'bg-[#FF5A5F] text-white shadow-2xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Infant Health & Fever</span>
                  </button>

                  <button
                    id="dash-tool-feeding"
                    onClick={() => setDoctorActiveTool('feeding')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      doctorActiveTool === 'feeding'
                        ? 'bg-[#D97706] text-white shadow-2xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <Milk className="w-3.5 h-3.5" />
                    <span>Feeding & Nutrition</span>
                  </button>

                  <button
                    id="dash-tool-teething"
                    onClick={() => setDoctorActiveTool('teething')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      doctorActiveTool === 'teething'
                        ? 'bg-[#7C3AED] text-white shadow-2xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <Smile className="w-3.5 h-3.5" />
                    <span>Teething Relief</span>
                  </button>

                  <button
                    id="dash-tool-vaccines"
                    onClick={() => setDoctorActiveTool('vaccines')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      doctorActiveTool === 'vaccines'
                        ? 'bg-[#059669] text-white shadow-2xs'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    <Syringe className="w-3.5 h-3.5" />
                    <span>Vaccine Schedule</span>
                  </button>
                </div>

                {/* Active Tool View: Infant Health & Fever */}
                {doctorActiveTool === 'fever' && (
                  <div className="space-y-4 bg-[#FFFBF7] p-4 sm:p-5 rounded-2xl border border-[#E7DDD5] animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-[#78716C]">
                        Live Temperature Slider:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono text-[#1C1917]">
                          {tempF.toFixed(1)}°F
                        </span>
                        <span className="text-xs font-medium text-[#78716C]">
                          ({(((tempF - 32) * 5) / 9).toFixed(1)}°C)
                        </span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="97.0"
                      max="104.5"
                      step="0.1"
                      value={tempF}
                      onChange={(e) => setTempF(parseFloat(e.target.value))}
                      className="w-full accent-[#FF5A5F] cursor-pointer"
                    />

                    {/* Method Selector */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#57534E]">Method:</span>
                      <div className="flex gap-1">
                        {(['rectal', 'axillary', 'forehead'] as const).map(m => (
                          <button
                            key={m}
                            onClick={() => setTempMethod(m)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                              tempMethod === m
                                ? 'bg-[#FF5A5F] text-white'
                                : 'bg-white text-[#57534E] border border-[#E7DDD5]'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Severity Banner */}
                    <div className={`p-3 rounded-xl border ${feverEval.color} text-xs space-y-1`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>{feverEval.badge}</span>
                        <span className="text-[10px] uppercase font-extrabold">
                          {babyProfile.ageMonths < 3 ? '<3m Urgent Rule' : '3m+ AAP Matrix'}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{feverEval.advice}</p>
                    </div>

                    {/* Quick Doctor Consultation Action */}
                    <button
                      onClick={() => handleSendDoctorMessage(`My ${babyProfile.ageMonths}-month-old baby (${babyProfile.name}) has a temperature of ${tempF.toFixed(1)}°F measured via ${tempMethod}. What clinical steps, safe medication dosing, and comfort measures should I follow?`)}
                      disabled={isDoctorLoading}
                      className="w-full py-2.5 rounded-xl bg-[#FF5A5F] hover:bg-[#FF4147] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Ask AI Doctor Detailed Care Plan for {tempF.toFixed(1)}°F</span>
                    </button>
                  </div>
                )}

                {/* Active Tool View: Feeding & Nutrition */}
                {doctorActiveTool === 'feeding' && (
                  <div className="space-y-4 bg-[#FFFBF7] p-4 sm:p-5 rounded-2xl border border-[#E7DDD5] animate-fadeIn">
                    {/* Visual Card Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-[#FDE68A] h-28 sm:h-32 shadow-2xs">
                      <img
                        src={babyBottleBg}
                        alt="Baby in diaper drinking bottle"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                        <div className="text-white">
                          <span className="text-[10px] font-extrabold uppercase bg-amber-500/90 px-2 py-0.5 rounded-full inline-block mb-1">
                            🍼 Daily Feeding Roadmap
                          </span>
                          <p className="text-xs font-bold leading-tight">
                            Recommended Bottle & Milk Schedule for {babyProfile.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-[#78716C]">
                        Stage:
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                        {babyProfile.ageMonths <= 3 ? '22–28 oz/day' : '24–32 oz/day'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'nursing', label: 'Breastfeeding' },
                        { id: 'formula', label: 'Formula' },
                        { id: 'starting_solids', label: 'Starting Solids (BLW)' },
                        { id: 'finger_foods', label: 'Finger Foods' }
                      ].map(st => (
                        <button
                          key={st.id}
                          onClick={() => setFeedingStage(st.id as any)}
                          className={`p-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                            feedingStage === st.id
                              ? 'bg-[#FEF3C7] border-2 border-[#F59E0B] text-[#92400E]'
                              : 'bg-white border border-[#E7DDD5] text-[#57534E]'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#57534E] bg-white p-2.5 rounded-xl border border-[#E7DDD5]">
                      💡 <strong>AAP Nutrition Tip:</strong> Breast milk or iron-fortified formula remains the primary nutrition source through 12 months. Introduce top allergens (peanut, egg) early around 6 months.
                    </div>

                    <button
                      onClick={() => handleSendDoctorMessage(`Can you provide a personalized pediatric feeding roadmap for my ${babyProfile.ageMonths}-month-old baby (${feedingStage})? Include daily milk volumes, starting solids schedule, and safe allergen introduction.`)}
                      disabled={isDoctorLoading}
                      className="w-full py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Get Evidence-Based Nutrition & Solids Plan</span>
                    </button>
                  </div>
                )}

                {/* Active Tool View: Teething Relief */}
                {doctorActiveTool === 'teething' && (
                  <div className="space-y-4 bg-[#FFFBF7] p-4 sm:p-5 rounded-2xl border border-[#E7DDD5] animate-fadeIn">
                    <span className="text-xs font-extrabold uppercase text-[#78716C] block">
                      Teething Checklist & Comfort:
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'drooling', label: 'Heavy Drooling' },
                        { id: 'chewing', label: 'Gnawing on Hands' },
                        { id: 'gums', label: 'Swollen Gums' },
                        { id: 'fussiness', label: 'Night Discomfort' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setTeethingChecked(prev => 
                            prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                          )}
                          className={`p-2 rounded-xl text-left font-bold transition-all cursor-pointer ${
                            teethingChecked.includes(item.id)
                              ? 'bg-[#EDE9FE] border-2 border-[#8B5CF6] text-[#5B21B6]'
                              : 'bg-white border border-[#E7DDD5] text-[#57534E]'
                          }`}
                        >
                          ✓ {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="text-[11px] text-[#57534E] bg-white p-2.5 rounded-xl border border-[#E7DDD5]">
                      🧊 <strong>Pediatric Soothers:</strong> Use chilled damp washcloths or refrigerated solid silicone rings. Avoid frozen teethers and numbing gels with benzocaine.
                    </div>

                    <button
                      onClick={() => handleSendDoctorMessage(`My ${babyProfile.ageMonths}-month-old baby is teething with swollen gums and drooling. What are safe pediatric comfort protocols to help them sleep at night?`)}
                      disabled={isDoctorLoading}
                      className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                      <span>Ask AI Doctor Teething Soothing Protocol</span>
                    </button>
                  </div>
                )}

                {/* Active Tool View: Vaccine Schedule & Post-Shot Comfort */}
                {doctorActiveTool === 'vaccines' && (
                  <div className="space-y-4 bg-[#FFFBF7] p-4 sm:p-5 rounded-2xl border border-[#E7DDD5] animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-[#78716C]">
                        CDC / AAP Schedule Highlights:
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                        {babyProfile.ageMonths <= 2 ? '2-Month Round' : babyProfile.ageMonths <= 4 ? '4-Month Round' : babyProfile.ageMonths <= 6 ? '6-Month Round' : '12-Month Round'}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-2 text-xs">
                      <div className="font-bold text-[#1C1917] flex items-center gap-1.5">
                        <Syringe className="w-3.5 h-3.5 text-[#166534]" />
                        <span>Expected Immunizations for {babyProfile.name} ({babyProfile.ageMonths}m):</span>
                      </div>
                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                        {babyProfile.ageMonths < 2 
                          ? 'HepB #2, DTaP #1, Rotavirus #1, Hib #1, PCV #1, IPV Polio #1' 
                          : babyProfile.ageMonths <= 4 
                          ? 'DTaP #2, RV #2, Hib #2, PCV #2, IPV #2' 
                          : babyProfile.ageMonths <= 6 
                          ? 'DTaP #3, Hib #3, PCV #3, IPV #3, HepB #3 + Annual Flu' 
                          : 'MMR #1, Varicella #1, HepA #1, Hib #4, PCV #4'}
                      </p>
                    </div>

                    <div className="text-[11px] text-[#57534E] bg-white p-2.5 rounded-xl border border-[#E7DDD5] space-y-1">
                      <div>🌡️ <strong>Post-Shot Reactions:</strong> Low-grade fevers (99.5–101.5°F) & thigh soreness are normal 24–48h signs of immune antibody response.</div>
                      <div>🧊 <strong>Soothing:</strong> Cool damp washcloth for 10 min on the thigh. Infant Acetaminophen (Tylenol) if ≥2 months per weight chart.</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => setDashboardTab('vaccines')}
                        className="py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Syringe className="w-3.5 h-3.5" />
                        <span>Open Full Vaccine Tracker</span>
                      </button>

                      <button
                        onClick={() => handleSendDoctorMessage(`What vaccines are due for my ${babyProfile.ageMonths}-month-old baby (${babyProfile.name}), and how should I treat post-shot fever and leg soreness?`)}
                        disabled={isDoctorLoading}
                        className="py-2.5 px-3 rounded-xl bg-white border border-[#E7DDD5] hover:bg-[#F5EFEB] text-[#1C1917] text-xs font-bold active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Ask AI Doctor Vaccine Triage</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* In-Dashboard AI Doctor Live Chat Box */}
                <div className="border-t border-[#F0E6DD] pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1C1917]">
                    <span className="flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-[#7C3AED]" />
                      Live AI Pediatric Consultation
                    </span>
                    <span className="text-[10px] text-emerald-700 font-extrabold uppercase">
                      ● Active
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 text-xs">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-[#FF5A5F] text-white ml-6 shadow-2xs'
                            : 'bg-[#FFFBF7] text-[#1C1917] border border-[#E7DDD5] mr-4 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 opacity-80 text-[10px] font-bold">
                          <span>{msg.role === 'user' ? 'You' : 'Dr. Lullaby (MD)'}</span>
                          <div className="flex items-center gap-1.5">
                            <span>{msg.timestamp}</span>
                            {msg.role === 'assistant' && (
                              <button
                                onClick={() => copyToClipboard(msg.content, msg.id)}
                                className="p-0.5 hover:opacity-100 cursor-pointer"
                                title="Copy response"
                              >
                                {copiedId === msg.id ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="whitespace-pre-wrap leading-relaxed font-sans">
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {isDoctorLoading && (
                      <div className="p-3 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5] flex items-center gap-2 text-xs font-bold text-[#7C3AED]">
                        <Bot className="w-4 h-4 animate-bounce" />
                        <span>Dr. Lullaby is analyzing pediatric guidelines...</span>
                      </div>
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={doctorQuery}
                      onChange={(e) => setDoctorQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendDoctorMessage();
                        }
                      }}
                      placeholder={`Ask Dr. Lullaby about ${babyProfile.name}'s sleep or health...`}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D6C7BC] bg-white text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                    <button
                      onClick={() => handleSendDoctorMessage()}
                      disabled={isDoctorLoading || !doctorQuery.trim()}
                      className="p-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-2xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* VACCINATION TRACKING SECTION (Unified 'all' or 'vaccines') */}
          {/* ======================================================= */}
          {(dashboardTab === 'all' || dashboardTab === 'vaccines') && (
            <div className="lg:col-span-12 animate-fadeIn">
              <VaccinationTrackingCard
                babyProfile={babyProfile}
                vaccineRecords={vaccineRecords}
                onUpdateVaccineRecord={onUpdateVaccineRecord}
                onAskDoctor={(prompt) => {
                  handleSendDoctorMessage(prompt);
                  const docSection = document.getElementById('lullaby-ai-dashboard');
                  if (docSection) docSection.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
