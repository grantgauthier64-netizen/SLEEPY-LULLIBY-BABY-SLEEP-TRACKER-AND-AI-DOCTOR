import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Stethoscope, 
  HeartPulse, 
  Thermometer, 
  Baby, 
  Milk, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Copy, 
  Check, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Smile,
  MilkOff
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BabyProfile } from '../types';
import { PoopVisualGuideCard } from './PoopVisualGuideCard';
import { LactoseIntoleranceCard } from './LactoseIntoleranceCard';

interface OnSiteAIBabyDoctorSectionProps {
  babyProfile: BabyProfile;
  onOpenFullModal: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const OnSiteAIBabyDoctorSection: React.FC<OnSiteAIBabyDoctorSectionProps> = ({
  babyProfile,
  onOpenFullModal
}) => {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'doc-welcome',
      role: 'assistant',
      content: `### 🩺 Welcome to your On-Site AI Pediatric Clinic
I'm **Dr. Lullaby & Nurse Daisy**, your 24/7 AI Pediatric Consultant for ${babyProfile.name || 'your baby'} (${babyProfile.ageMonths} months old).

**Ask me anything regarding:**
- **Fever & Illness**: Safe temperature thresholds, when to call the pediatrician, cold/cough comfort.
- **Sleep & Wake Windows**: Overtiredness vs undertiredness, nap transitions, regression relief.
- **Teething & Fussiness**: Safe gum soothing, swollen gums, drooling rash remedies.
- **Feeding & Nutrition**: Starting solids / BLW, nursing schedules, formula amounts, gas/reflux relief.

*Type any question below or click any of the interactive diagnostic tools on the left!*`,
      timestamp: 'Online Now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Diagnostic Tool Tab
  const [activeTool, setActiveTool] = useState<'lactose' | 'spit_up' | 'poop_colors' | 'fever' | 'feeding' | 'teething' | 'colic' | 'safe_sleep'>('lactose');

  // Poop Color Decoder State
  const [selectedPoopColor, setSelectedPoopColor] = useState<string>('curd_yellow');

  // Spit-up time since feed slider
  const [spitUpMinutes, setSpitUpMinutes] = useState<number>(25);

  // Fever Calculator State
  const [tempF, setTempF] = useState<number>(100.2);
  const [feverAgeMonths, setFeverAgeMonths] = useState<number>(babyProfile.ageMonths || 5);
  const [tempMethod, setTempMethod] = useState<'rectal' | 'axillary' | 'forehead'>('rectal');

  // Feeding & Nutrition State
  const [feedingStage, setFeedingStage] = useState<'nursing' | 'formula' | 'starting_solids' | 'finger_foods'>('starting_solids');
  const [solidsChecked, setSolidsChecked] = useState<string[]>([
    'sitting_up', 'tongue_thrust', 'grasping'
  ]);

  // Teething checklist state
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>(['drooling', 'gnawing']);

  // Safe sleep checklist
  const [safeSleepChecked, setSafeSleepChecked] = useState<string[]>([
    'flat_firm', 'back_sleep', 'empty_crib', 'room_share'
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const toggleSafeSleep = (id: string) => {
    setSafeSleepChecked(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleTeethingSymptom = (id: string) => {
    setCheckedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSolidsCheck = (id: string) => {
    setSolidsChecked(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    // Scroll chat into view
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);

    try {
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          babyProfile: babyProfile
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I'm sorry, I couldn't generate a response. Please try asking your question again.";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("AI Doctor Chat Error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**⚠️ Temporary Network Note:** I had trouble reaching the AI pediatric model. 

*Immediate Pediatric Guidelines:*
- **Fever (<3 months old):** Any temperature ≥100.4°F (38.0°C) taken rectally requires **emergency medical attention**.
- **Fever (3–6 months old):** ≥101°F (38.3°C) call pediatrician for evaluation.
- **Hydration:** Ensure baby has at least 5–6 wet diapers every 24 hours.

Please feel free to re-submit your message in a moment!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatContainerRef.current?.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Evaluate fever level based on AAP rules
  const getFeverEvaluation = () => {
    const isUnder3Months = feverAgeMonths < 3;
    const is3to6Months = feverAgeMonths >= 3 && feverAgeMonths < 6;

    if (tempF >= 104.0) {
      return {
        level: 'critical',
        badge: '🚨 High Fever Alert',
        bgColor: 'bg-red-100 border-red-300 text-red-950',
        advice: 'Very high fever. Contact pediatrician immediately or seek emergency medical care. Check for alertness, stiff neck, and labored breathing.'
      };
    }

    if (isUnder3Months) {
      if (tempF >= 100.4) {
        return {
          level: 'urgent',
          badge: '⚠️ Urgent Medical Evaluation Needed',
          bgColor: 'bg-red-100 border-red-300 text-red-950',
          advice: 'AAP Guideline: In infants under 3 months, a rectal temperature of 100.4°F (38°C) or higher requires immediate evaluation by a pediatrician or emergency room to rule out serious infection.'
        };
      }
      return {
        level: 'normal',
        badge: '✓ Normal Temperature Range',
        bgColor: 'bg-emerald-100 border-emerald-300 text-emerald-950',
        advice: 'Temperature is within normal limits (97.5°F – 100.3°F). Keep baby dressed comfortably in breathable layers.'
      };
    }

    if (is3to6Months) {
      if (tempF >= 101.0) {
        return {
          level: 'warning',
          badge: '⚠️ Moderate Fever - Call Pediatrician',
          bgColor: 'bg-amber-100 border-amber-300 text-amber-950',
          advice: 'Call your pediatrician for guidance. Focus on hydration (breast milk or formula), comfortable light clothing, and skin-to-skin reassurance.'
        };
      }
      if (tempF >= 100.4) {
        return {
          level: 'mild',
          badge: 'ℹ️ Mild Low-Grade Fever',
          bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
          advice: 'Monitor closely. If baby is nursing well, alert, and making wet diapers, continue to offer extra fluids and rest.'
        };
      }
      return {
        level: 'normal',
        badge: '✓ Normal Infant Temperature',
        bgColor: 'bg-emerald-100 border-emerald-300 text-emerald-950',
        advice: 'Temperature is normal. No fever detected.'
      };
    }

    // 6+ months
    if (tempF >= 102.0) {
      return {
        level: 'warning',
        badge: '⚠️ Elevated Fever',
        bgColor: 'bg-amber-100 border-amber-300 text-amber-950',
        advice: 'Monitor baby’s demeanor and fluid intake. Contact pediatrician if fever lasts more than 2-3 days or if baby is inconsolable.'
      };
    }
    if (tempF >= 100.4) {
      return {
        level: 'mild',
        badge: 'ℹ️ Low-Grade Fever',
        bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
        advice: 'Common during viral colds or post-vaccination. Keep baby hydrated and offer comfortable rest.'
      };
    }

    return {
      level: 'normal',
      badge: '✓ Normal Temperature',
      bgColor: 'bg-emerald-100 border-emerald-300 text-emerald-950',
      advice: 'Normal temperature range. No fever present.'
    };
  };

  const feverEval = getFeverEvaluation();

  return (
    <section id="on-site-ai-doctor" className="py-20 bg-[#FFFBF7]/60 backdrop-blur-[1px] relative overflow-hidden border-t-2 border-[#E7DDD5]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EDE9FE] text-[#5B21B6] rounded-full text-xs font-extrabold uppercase tracking-widest border border-[#DDD6FE] shadow-2xs">
            <Stethoscope className="w-4 h-4 text-[#7C3AED]" />
            <span>On-Site AI Baby Doctor & Pediatric Clinic</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Instant Pediatric & Health Answers, <span className="text-[#FF5A5F] italic">Right on Site</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Clinical guidance at your fingertips 24/7. Ask questions, check fever safety thresholds, diagnose sleep regressions, and verify AAP safe sleep standards.
          </p>
        </div>

        {/* Main 2-Column Interactive Doctor Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Pediatric Diagnostic Tools & Triagers */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Diagnostic Tool Selector Pills */}
            <div className="bg-white p-3 rounded-3xl border-2 border-[#E7DDD5] shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                id="btn-tool-lactose"
                onClick={() => setActiveTool('lactose')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'lactose'
                    ? 'bg-[#EA580C] text-white shadow-md shadow-[#EA580C]/30 scale-102 ring-2 ring-[#EA580C]/20'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <MilkOff className="w-3.5 h-3.5" />
                <span>🥛 Lactose & CMPA Guide</span>
              </button>

              <button
                id="btn-tool-spit-up"
                onClick={() => setActiveTool('spit_up')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'spit_up'
                    ? 'bg-[#EA580C] text-white shadow-md shadow-[#EA580C]/30 scale-102'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <Milk className="w-3.5 h-3.5" />
                <span>🍼 Curdled Spit-Up Guide</span>
              </button>

              <button
                id="btn-tool-poop-colors"
                onClick={() => setActiveTool('poop_colors')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'poop_colors'
                    ? 'bg-[#059669] text-white shadow-md shadow-[#059669]/30 scale-102'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>🎨 Poop Color Decoder</span>
              </button>

              <button
                id="btn-tool-fever"
                onClick={() => setActiveTool('fever')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'fever'
                    ? 'bg-[#FF5A5F] text-white shadow-md shadow-[#FF5A5F]/30 scale-102'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>Infant Health & Fever</span>
              </button>

              <button
                id="btn-tool-feeding"
                onClick={() => setActiveTool('feeding')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'feeding'
                    ? 'bg-[#D97706] text-white shadow-md shadow-[#D97706]/30 scale-102'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <Milk className="w-3.5 h-3.5" />
                <span>Feeding & Nutrition</span>
              </button>

              <button
                id="btn-tool-teething"
                onClick={() => setActiveTool('teething')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'teething'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30 scale-102'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Teething Check</span>
              </button>

              <button
                id="btn-tool-safe-sleep"
                onClick={() => setActiveTool('safe_sleep')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'safe_sleep'
                    ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/30 scale-102'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AAP Safe Sleep</span>
              </button>
            </div>

            {/* Active Tool Card: Lactose Intolerance & Dairy Sensitivity Card */}
            {activeTool === 'lactose' && (
              <LactoseIntoleranceCard
                babyName={babyProfile.name || 'your baby'}
                babyAgeMonths={babyProfile.ageMonths || 5}
                onAskDoctor={(prompt) => handleSendMessage(prompt)}
              />
            )}

            {/* Active Tool Card: Curdled Spit-Up & Reflux Guide */}
            {activeTool === 'spit_up' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] border border-[#FED7AA] flex items-center justify-center text-[#EA580C]">
                      <Milk className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Curdled Formula & Spit-Up Guide
                      </h3>
                      <p className="text-xs text-[#57534E]">Why spit-up looks like cottage cheese & what to do</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                    95% Normal
                  </span>
                </div>

                {/* The Science Breakdown */}
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2">
                  <span className="text-xs font-extrabold uppercase text-[#EA580C] block">
                    🔬 Why It Looks Like Curdled Cottage Cheese:
                  </span>
                  <p className="text-xs text-[#44403C] leading-relaxed">
                    When baby drinks formula or milk, it mixes with <strong>hydrochloric acid & pepsin</strong> in the stomach. This naturally <strong>curdles milk proteins (casein & whey)</strong> into white clumps—the normal first stage of healthy digestion!
                  </p>
                </div>

                {/* Interactive Time Since Feed Slider */}
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">Time Elapsed Since Bottle:</span>
                    <span className="font-serif text-sm font-bold text-[#EA580C] px-2 py-0.5 rounded-lg bg-orange-100 border border-orange-200">
                      {spitUpMinutes} Minutes After Feed
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={spitUpMinutes}
                    onChange={(e) => setSpitUpMinutes(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#D6C7BC] rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
                  />
                  <div className="p-3 rounded-xl bg-white border border-[#E7DDD5] text-xs">
                    {spitUpMinutes <= 10 ? (
                      <p className="text-[#57534E]">
                        🍼 <strong>Fresh Spit-Up (0–10 mins):</strong> Milk has not spent much time in stomach acid yet; looks like smooth liquid formula.
                      </p>
                    ) : spitUpMinutes <= 45 ? (
                      <p className="text-[#9A3412] font-medium">
                        🧀 <strong>Active Curdled Digestion ({spitUpMinutes} mins):</strong> Milk has reacted with stomach acid, forming white cottage-cheese lumps & clear digestive fluid. <em>Completely normal!</em>
                      </p>
                    ) : (
                      <p className="text-[#57534E]">
                        💧 <strong>Late Reflux (45+ mins):</strong> Mostly clear gastric fluid with tiny protein flecks as stomach finishes emptying.
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Soothing Steps */}
                <div className="space-y-1.5 text-xs text-[#44403C]">
                  <strong className="text-xs font-bold text-[#1C1917] block">Pediatrician-Approved Spit-Up Tips:</strong>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#FFFBF7] border border-[#E7DDD5]">
                      <span className="font-bold text-[#EA580C] block">1. 20-Min Upright</span>
                      Hold baby upright after feeds to let gravity keep milk down.
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FFFBF7] border border-[#E7DDD5]">
                      <span className="font-bold text-[#EA580C] block">2. Paced Feeding</span>
                      Tilt bottle semi-flat; burp every 2–3 oz to release trapped air.
                    </div>
                  </div>
                </div>

                {/* Action Trigger */}
                <button
                  onClick={() => handleSendMessage(`Why does my baby spit up curd-like stuff after drinking her formula? Is this normal and how can I help soothe it?`)}
                  className="w-full py-3 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-md shadow-[#EA580C]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Ask AI Doctor to Analyze Curdled Spit-Up</span>
                </button>
              </div>
            )}

            {/* Active Tool Card: Baby Poop Color & Texture Diagnostic Card */}
            {activeTool === 'poop_colors' && (
              <PoopVisualGuideCard
                babyName={babyProfile.name || 'your baby'}
                babyAgeMonths={babyProfile.ageMonths || 5}
                onAskDoctor={(prompt) => handleSendMessage(prompt)}
              />
            )}

            {/* Active Tool Card: Infant Health & Fever */}
            {activeTool === 'fever' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#FF5A5F]">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Infant Health & Fever Calculator
                      </h3>
                      <p className="text-xs text-[#57534E]">Evidence-based AAP pediatric fever & illness triage</p>
                    </div>
                  </div>
                </div>

                {/* Age & Temp Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase text-[#57534E] block mb-1">
                      Baby Age
                    </label>
                    <select
                      value={feverAgeMonths}
                      onChange={(e) => setFeverAgeMonths(Number(e.target.value))}
                      className="w-full bg-[#FFFBF7] border-2 border-[#D6C7BC] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#FF5A5F]"
                    >
                      <option value={1}>1 Month Old (Newborn)</option>
                      <option value={2}>2 Months Old</option>
                      <option value={4}>4 Months Old</option>
                      <option value={5}>5 Months Old (Maya)</option>
                      <option value={7}>7 Months Old</option>
                      <option value={10}>10 Months Old</option>
                      <option value={14}>14 Months Old (Toddler)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase text-[#57534E] block mb-1">
                      Measurement Site
                    </label>
                    <select
                      value={tempMethod}
                      onChange={(e) => setTempMethod(e.target.value as any)}
                      className="w-full bg-[#FFFBF7] border-2 border-[#D6C7BC] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#FF5A5F]"
                    >
                      <option value="rectal">Rectal (Most Accurate)</option>
                      <option value="forehead">Temporal / Forehead</option>
                      <option value="axillary">Axillary (Armpit)</option>
                    </select>
                  </div>
                </div>

                {/* Temperature Value Slider & Direct Input */}
                <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">Temperature:</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl font-bold text-[#1C1917]">
                        {tempF.toFixed(1)}
                      </span>
                      <span className="text-sm font-bold text-[#57534E]">°F</span>
                      <span className="text-xs font-medium text-[#57534E] ml-1">
                        ({((tempF - 32) * 5 / 9).toFixed(1)}°C)
                      </span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="97.0"
                    max="105.0"
                    step="0.1"
                    value={tempF}
                    onChange={(e) => setTempF(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#D6C7BC] rounded-lg appearance-none cursor-pointer accent-[#FF5A5F]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-[#57534E]">
                    <span>97.0°F (Normal)</span>
                    <span className="text-amber-700 font-extrabold">100.4°F (Fever mark)</span>
                    <span className="text-red-700 font-extrabold">104.0°F (High)</span>
                  </div>
                </div>

                {/* Dynamic Triage Output */}
                <div className={`p-4 rounded-2xl border-2 space-y-2 ${feverEval.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">
                      {feverEval.badge}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      {feverAgeMonths < 3 ? 'Age: <3m urgent rule' : 'Age: 3m+ rule'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {feverEval.advice}
                  </p>
                </div>

                {/* Quick Fever Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSendMessage(`My ${feverAgeMonths}-month-old baby has a temperature of ${tempF.toFixed(1)}°F measured via ${tempMethod}. What clinical steps should I take right now, how do I keep them comfortable, and when should I call the pediatrician?`)}
                    className="w-full py-3 rounded-2xl bg-[#FF5A5F] hover:bg-[#FF4147] text-white font-bold text-xs shadow-md shadow-[#FF5A5F]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Ask AI Doctor Detailed Care Plan for {tempF.toFixed(1)}°F</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSendMessage(`What are the safe guidelines and weight-based dosing rules for infant acetaminophen (Tylenol) vs ibuprofen (Motrin) for a ${feverAgeMonths}-month-old baby?`)}
                      className="p-2 rounded-xl bg-[#FFFBF7] border border-[#D6C7BC] hover:border-[#FF5A5F] hover:bg-[#FFE4E6]/30 text-[11px] font-bold text-[#1C1917] transition-all text-left cursor-pointer"
                    >
                      💊 Safe Medication Dosing
                    </button>
                    <button
                      onClick={() => handleSendMessage(`My ${feverAgeMonths}-month-old baby has a cold and stuffy nose. What are safe pediatric ways to relieve infant nasal congestion before sleep?`)}
                      className="p-2 rounded-xl bg-[#FFFBF7] border border-[#D6C7BC] hover:border-[#FF5A5F] hover:bg-[#FFE4E6]/30 text-[11px] font-bold text-[#1C1917] transition-all text-left cursor-pointer"
                    >
                      🌬️ Cold & Congestion Relief
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Tool Card: Feeding & Nutrition */}
            {activeTool === 'feeding' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
                      <Milk className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Infant Feeding & Nutrition Roadmap
                      </h3>
                      <p className="text-xs text-[#57534E]">Milk volumes, starting solids (BLW), & safe allergens</p>
                    </div>
                  </div>
                </div>

                {/* Feeding Stage Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase text-[#57534E] block">
                    Current Feeding Stage:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'nursing', label: 'Breastfeeding / Nursing' },
                      { id: 'formula', label: 'Formula Feeding' },
                      { id: 'starting_solids', label: 'Starting Solids (4–8m)' },
                      { id: 'finger_foods', label: 'Finger Foods (9–14m)' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setFeedingStage(st.id as any)}
                        className={`p-2.5 rounded-xl border-2 text-xs font-bold text-left transition-all cursor-pointer ${
                          feedingStage === st.id
                            ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] shadow-xs'
                            : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#1C1917] hover:bg-[#F5EFEB]'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Milk Benchmark Box */}
                <div className="bg-[#FFFBF7] p-4 rounded-2xl border-2 border-[#E7DDD5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">
                      Recommended Milk / Formula:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                      {feverAgeMonths <= 3 ? '22–28 oz / day' : feverAgeMonths <= 8 ? '24–32 oz / day' : '20–25 oz / day'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Breast milk or iron-fortified formula remains the primary nutritional foundation for all infants through 12 months.
                  </p>
                </div>

                {/* Solids Readiness Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase text-[#57534E] block">
                    Starting Solids & BLW Readiness Checklist:
                  </span>
                  {[
                    { id: 'sitting_up', label: 'Sitting upright in highchair with strong neck control' },
                    { id: 'tongue_thrust', label: 'Loss of tongue-thrust reflex (not pushing puree out)' },
                    { id: 'grasping', label: 'Reaches for food and accurately brings hands to mouth' },
                    { id: 'interest', label: 'Shows keen interest when watching parents eat' }
                  ].map((item) => (
                    <label
                      key={item.id}
                      onClick={() => toggleSolidsCheck(item.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all cursor-pointer text-xs font-semibold ${
                        solidsChecked.includes(item.id)
                          ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                          : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#1C1917] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={solidsChecked.includes(item.id)}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-[#D97706] focus:ring-[#D97706]"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>

                {/* Quick Actions for Feeding */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSendMessage(`Can you provide a personalized pediatric feeding guide for my ${feverAgeMonths}-month-old baby (${feedingStage})? Include milk volumes, solid meal timing, and safe prep instructions.`)}
                    className="w-full py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md shadow-[#D97706]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Ask AI Doctor for Personalized Nutrition Plan</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleSendMessage(`How do I introduce top food allergens like peanut butter and egg safely to my ${feverAgeMonths}-month-old baby according to AAP guidelines?`)}
                      className="p-2 rounded-xl bg-[#FFFBF7] border border-[#D6C7BC] hover:border-[#D97706] hover:bg-[#FEF3C7]/40 text-[11px] font-bold text-[#1C1917] transition-all text-left cursor-pointer"
                    >
                      🥜 Allergen Intro (Peanut/Egg)
                    </button>
                    <button
                      onClick={() => handleSendMessage(`What are the best pediatrician-approved tips to relieve gas, spit-up, and tummy reflux after feeding?`)}
                      className="p-2 rounded-xl bg-[#FFFBF7] border border-[#D6C7BC] hover:border-[#D97706] hover:bg-[#FEF3C7]/40 text-[11px] font-bold text-[#1C1917] transition-all text-left cursor-pointer"
                    >
                      🍼 Relieve Gas & Reflux
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'teething' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
                      <Baby className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Teething & Gum Discomfort Checker
                      </h3>
                      <p className="text-xs text-[#57534E]">Identify symptoms & soothing protocols</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase text-[#57534E] block">
                    Check Symptoms Baby is Showing:
                  </span>
                  {[
                    { id: 'drooling', label: 'Heavy drooling & chin redness' },
                    { id: 'gnawing', label: 'Chewing/gnawing hard on toys or fingers' },
                    { id: 'swollen_gums', label: 'Visible red, swollen gum mounds' },
                    { id: 'fussiness', label: 'Increased night wakings & fussiness' },
                    { id: 'ear_rubbing', label: 'Rubbing cheeks or pulling ears' }
                  ].map((s) => (
                    <label
                      key={s.id}
                      onClick={() => toggleTeethingSymptom(s.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer text-xs font-semibold ${
                        checkedSymptoms.includes(s.id)
                          ? 'bg-[#EDE9FE] border-[#8B5CF6] text-[#5B21B6]'
                          : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#1C1917] hover:bg-[#F5EFEB]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checkedSymptoms.includes(s.id)}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>

                {/* Evidence Based Teething Remedies */}
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2 text-xs text-[#1C1917]">
                  <strong className="block font-bold text-[#7C3AED]">
                    💡 Pediatrician Approved Teething Comfort:
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-[#44403C]">
                    <li>Chilled (not frozen solid) silicone teethers or clean damp washcloth.</li>
                    <li>Gentle gum massage with your clean finger.</li>
                    <li>Avoid numbing gels containing benzocaine or belladonna (FDA warning).</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSendMessage(`My baby is showing teething symptoms (${checkedSymptoms.join(', ')}). How can I help soothe the pain and help them sleep better tonight?`)}
                  className="w-full py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-[#7C3AED]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Get Personalized Teething Relief Plan</span>
                </button>
              </div>
            )}

            {activeTool === 'safe_sleep' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        AAP Safe Sleep ABC Checklist
                      </h3>
                      <p className="text-xs text-[#57534E]">American Academy of Pediatrics Standards</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'back_sleep', label: 'A: Alone on their back for every sleep', desc: 'Prevents airway obstruction and lowers SIDS risk by over 50%.' },
                    { id: 'flat_firm', label: 'B: Back on a Firm, Flat Mattress', desc: 'Tight-fitting sheet only with zero incline.' },
                    { id: 'empty_crib', label: 'C: Empty Crib (Zero pillows, blankets, bumpers)', desc: 'Keep crib clear; use a wearable sleep sack for warmth.' },
                    { id: 'room_share', label: 'D: Room sharing in same room for 6+ months', desc: 'Keep crib near parental bed for easy monitoring.' }
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleSafeSleep(item.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        safeSleepChecked.includes(item.id)
                          ? 'bg-[#F0FDF4] border-[#22C55E] text-[#14532D]'
                          : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#1C1917]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1C1917]">{item.label}</span>
                        <CheckCircle2 className={`w-4 h-4 ${safeSleepChecked.includes(item.id) ? 'text-[#16A34A]' : 'text-[#D6C7BC]'}`} />
                      </div>
                      <p className="text-[11px] text-[#57534E] mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSendMessage('Can you review the AAP Safe Sleep guidelines and check if my nursery sleep setup is 100% safe?')}
                  className="w-full py-3 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-[#0284C7]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Ask AI Doctor to Audit My Sleep Environment</span>
                </button>
              </div>
            )}

            {activeTool === 'colic' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
                      <Milk className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Infant Gas, Reflux & Colic Calmer
                      </h3>
                      <p className="text-xs text-[#57534E]">Tummy relief and post-feed digestion</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                    <strong className="block font-bold text-[#D97706] mb-1">
                      1. The 20-Minute Upright Rule:
                    </strong>
                    <p className="text-[#44403C] leading-relaxed">
                      Hold baby upright against your shoulder for 15–20 minutes after feeds to let gravity prevent milk backflow.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                    <strong className="block font-bold text-[#D97706] mb-1">
                      2. Bicycle Legs & Tummy Massage:
                    </strong>
                    <p className="text-[#44403C] leading-relaxed">
                      Gently pedal baby’s legs towards their chest and massage their tummy in clockwise circles to relieve trapped gas bubbles.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                    <strong className="block font-bold text-[#D97706] mb-1">
                      3. Paced Bottle Feeding:
                    </strong>
                    <p className="text-[#44403C] leading-relaxed">
                      Keep the bottle horizontal rather than vertical so baby controls the milk flow and swallows less air.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSendMessage('My baby is arching their back and crying after feeds with gas/reflux. What can I do to relieve their tummy discomfort?')}
                  className="w-full py-3 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md shadow-[#D97706]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Ask AI Doctor for Colic/Gas Solutions</span>
                </button>
              </div>
            )}

            {/* Quick Questions Library */}
            <div className="bg-[#FFFBF7] p-5 rounded-2xl border-2 border-[#E7DDD5] space-y-3">
              <span className="text-xs font-extrabold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Popular Pediatric Inquiries:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Why does baby spit up curd-like stuff after formula?",
                  "What do different baby poop colors mean?",
                  "When to transition 3 naps to 2 naps?",
                  "Is 100.4°F fever emergency for young baby?",
                  "How to start Baby-Led Weaning safely?",
                  "Help with the 4-month sleep regression!"
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#D6C7BC] text-xs font-semibold text-[#1C1917] hover:border-[#EA580C] hover:bg-[#FFEDD5]/40 transition-all text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: In-Page Live AI Doctor Consultation Chat Console */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] shadow-lg flex flex-col h-[650px] overflow-hidden">
              
              {/* Console Header */}
              <div className="p-4 sm:px-6 bg-[#FFFBF7] border-b border-[#F0E6DD] flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-[#FFE4E6] border-2 border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shadow-xs">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Live AI Pediatrician Console
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE]">
                        Gemini 3.7
                      </span>
                    </div>
                    <p className="text-xs text-[#57534E] font-medium">
                      Tailored to {babyProfile.name || 'Baby'} ({babyProfile.ageMonths}m) • AAP Evidence-Based
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMessages([
                        {
                          id: 'welcome-reset',
                          role: 'assistant',
                          content: `### 🩺 Consultation Reset
Ready for your questions regarding sleep, infant health, fevers, and baby milestones. How can I assist?`,
                          timestamp: 'Now'
                        }
                      ]);
                    }}
                    className="p-2 rounded-xl text-[#57534E] hover:text-[#1C1917] hover:bg-[#F0E6DD] transition-colors cursor-pointer"
                    title="Reset chat"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onOpenFullModal}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#D6C7BC] text-xs font-bold text-[#1C1917] hover:bg-[#F5EFEB] transition-colors cursor-pointer hidden sm:block"
                  >
                    Expand Fullscreen
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={chatContainerRef}
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FFFBF7]/40"
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shrink-0 mt-1">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-xs relative group ${
                          isUser
                            ? 'bg-[#FF5A5F] text-white rounded-br-none'
                            : 'bg-white border-2 border-[#E7DDD5] text-[#1C1917] rounded-bl-none'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>
                        ) : (
                          <div className="text-sm leading-relaxed text-[#1C1917] space-y-2 prose prose-stone max-w-none">
                            <ReactMarkdown
                              components={{
                                h3: ({ children }) => (
                                  <h3 className="font-serif text-base font-bold text-[#1C1917] mt-1 mb-2">
                                    {children}
                                  </h3>
                                ),
                                h4: ({ children }) => (
                                  <h4 className="font-bold text-sm text-[#1C1917] mt-2 mb-1">
                                    {children}
                                  </h4>
                                ),
                                p: ({ children }) => (
                                  <p className="text-sm text-[#1C1917] leading-relaxed mb-2 last:mb-0">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc pl-5 space-y-1 my-2 text-sm text-[#1C1917]">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal pl-5 space-y-1 my-2 text-sm text-[#1C1917]">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="text-sm text-[#1C1917]">
                                    {children}
                                  </li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-bold text-[#1C1917]">
                                    {children}
                                  </strong>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-4 border-[#FF5A5F] pl-3 py-1 my-2 bg-[#FFF1F2] rounded-r-lg text-xs font-semibold text-[#9F1239]">
                                    {children}
                                  </blockquote>
                                )
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>

                            <div className="pt-2 border-t border-[#F0E6DD]/60 flex items-center justify-between text-[10px] text-[#57534E]">
                              <span>{msg.timestamp}</span>
                              <button
                                onClick={() => handleCopy(msg.content, msg.id)}
                                className="flex items-center gap-1 text-[#57534E] hover:text-[#1C1917] font-bold transition-colors cursor-pointer"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#22C55E]" />
                                    <span className="text-[#22C55E]">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-xl bg-[#1C1917] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                          👤
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-3 justify-start animate-fadeIn">
                    <div className="w-8 h-8 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shrink-0">
                      <Stethoscope className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div className="bg-white border-2 border-[#E7DDD5] rounded-2xl rounded-bl-none p-4 shadow-xs flex items-center gap-3 text-xs font-bold text-[#57534E]">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-[#FF5A5F] animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span>Dr. Lullaby is reviewing clinical pediatric protocols...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions Pills */}
              <div className="px-4 py-2 bg-[#FFFBF7] border-t border-[#F0E6DD] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[10px] font-extrabold uppercase text-[#78716C] shrink-0">Try Asking:</span>
                {[
                  "Lactose intolerance symptoms & remedies to fix",
                  "What's the difference between lactose intolerance & CMPA?",
                  "Why does baby spit up curdled formula?",
                  "Which hypoallergenic formula is best for milk sensitivity?",
                  "How to soothe severe baby gas & bloating"
                ].map((suggested, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(suggested)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E7DDD5] hover:border-[#EA580C] hover:text-[#EA580C] text-[11px] font-semibold text-[#57534E] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                  >
                    {suggested}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-white border-t border-[#F0E6DD] space-y-2 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask Dr. Lullaby any question (e.g. fever thresholds, wake windows, colic, BLW)..."
                    className="flex-1 bg-[#FFFBF7] border-2 border-[#D6C7BC] focus:border-[#FF5A5F] rounded-2xl px-4 py-3 text-sm text-[#1C1917] placeholder:text-[#57534E]/60 focus:outline-none transition-all"
                    disabled={isLoading}
                  />

                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isLoading}
                    className="h-11 px-5 rounded-2xl bg-[#FF5A5F] hover:bg-[#FF4147] text-white font-bold text-sm shadow-md shadow-[#FF5A5F]/35 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Ask</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-[#57534E] px-1">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <strong>Educational Pediatric Guidance:</strong> For acute medical distress, call your pediatrician or 911.
                  </span>
                  <span className="hidden sm:inline">24/7 AI Service</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
