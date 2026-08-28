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
  MilkOff,
  Apple,
  TrendingUp,
  Moon,
  AlertCircle,
  FileText,
  Zap,
  Maximize2,
  Minimize2,
  Type,
  CheckSquare,
  Square,
  ZoomIn,
  ZoomOut,
  Clock,
  Printer
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BabyProfile, SleepLog, FeedLog, DiaperLog, CustomActivityLog } from '../types';
import { PoopVisualGuideCard } from './PoopVisualGuideCard';
import { LactoseIntoleranceCard } from './LactoseIntoleranceCard';
import { UndigestedFoodAndSourMilkCard } from './UndigestedFoodAndSourMilkCard';
import { generatePediatricPdf } from '../utils/generatePediatricPdf';

interface OnSiteAIBabyDoctorSectionProps {
  babyProfile: BabyProfile;
  onOpenFullModal: () => void;
  sleepLogs?: SleepLog[];
  feedLogs?: FeedLog[];
  diaperLogs?: DiaperLog[];
  activityLogs?: CustomActivityLog[];
  onDownloadPdf?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const OnSiteAIBabyDoctorSection: React.FC<OnSiteAIBabyDoctorSectionProps> = ({
  babyProfile,
  onOpenFullModal,
  sleepLogs = [],
  feedLogs = [],
  diaperLogs = [],
  activityLogs = [],
  onDownloadPdf
}) => {
  // Engine Mode: 'dr_lullaby' | 'ada_health' | 'chatgpt_health'
  const [selectedEngine, setSelectedEngine] = useState<'dr_lullaby' | 'ada_health' | 'chatgpt_health'>('dr_lullaby');

  // Reader Canvas Size: 'split' | 'expanded'
  const [isExpandedCanvas, setIsExpandedCanvas] = useState<boolean>(false);
  // Font Size: 'normal' (16px) | 'large' (18px) | 'xlarge' (21px)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  // Interactive Action Items check state
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});

  const toggleActionItem = (id: string) => {
    setCheckedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'doc-welcome',
      role: 'assistant',
      content: `### 🩺 Welcome to your 24/7 AI Pediatric Clinic
I'm **Dr. Lullaby & Nurse Daisy**, with integrated **Ada Health Pediatric Triage** and **ChatGPT Health Assistant** for ${babyProfile.name || 'your baby'} (${babyProfile.ageMonths} months old).

**Select an AI Engine above or ask anything regarding:**
- **Fever & Illness**: Safe temperature thresholds, when to call the pediatrician, cold/cough comfort.
- **Sleep Regressions**: 4-month maturation, 8-month separation anxiety, nap transitions.
- **Starting Solids & Allergens**: Baby-Led Weaning, Top 9 allergen introduction ladder, reaction signs.
- **Developmental Milestones**: Motor skills, speech, and AAP clinical red flags.
- **Feeding & Digestion**: Reflux, curdled spit-up, cow's milk sensitivity, and colic soothing.

*Type any question below or click any of the interactive diagnostic tools on the left!*`,
      timestamp: 'Online Now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Diagnostic Tool Tab
  const [activeTool, setActiveTool] = useState<
    'lactose' | 'spit_up' | 'poop_colors' | 'fever' | 'feeding' | 'allergens' | 'milestones' | 'regressions' | 'teething' | 'colic' | 'safe_sleep'
  >('lactose');

  // Poop Color Decoder State
  const [selectedPoopColor, setSelectedPoopColor] = useState<string>('curd_yellow');

  // Spit-up time since feed slider
  const [spitUpMinutes, setSpitUpMinutes] = useState<number>(25);

  // Fever Calculator State
  const [tempF, setTempF] = useState<number>(100.2);
  const [feverAgeMonths, setFeverAgeMonths] = useState<number>(babyProfile.ageMonths || 5);
  const [tempMethod, setTempMethod] = useState<'rectal' | 'axillary' | 'forehead'>('rectal');

  // Solid Foods & Allergens State
  const [selectedAllergen, setSelectedAllergen] = useState<string>('peanut');
  const [solidsChecked, setSolidsChecked] = useState<string[]>([
    'sitting_up', 'tongue_thrust', 'grasping'
  ]);

  // Developmental Milestone State
  const [milestoneAgeBracket, setMilestoneAgeBracket] = useState<'0_3' | '4_6' | '7_9' | '10_12' | '12_18'>('4_6');

  // Sleep Regression State
  const [regressionAge, setRegressionAge] = useState<'4m' | '8m' | '12m' | '18m'>('4m');

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
          babyProfile: babyProfile,
          engine: selectedEngine
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
            Clinical guidance at your fingertips 24/7. Check fever thresholds, diagnose sleep regressions, assess solids & allergy readiness, and track developmental milestones.
          </p>
        </div>

        {/* Main 2-Column Interactive Doctor Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Pediatric Diagnostic Tools & Triagers (Hidden when Canvas Expanded) */}
          {!isExpandedCanvas && (
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
                <span>🥛 Lactose & CMPA</span>
              </button>

              <button
                id="btn-tool-allergens"
                onClick={() => setActiveTool('allergens')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'allergens'
                    ? 'bg-[#15803D] text-white shadow-md shadow-[#15803D]/30 scale-102 ring-2 ring-[#15803D]/20'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>🥑 Solids & Allergens</span>
              </button>

              <button
                id="btn-tool-milestones"
                onClick={() => setActiveTool('milestones')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'milestones'
                    ? 'bg-[#0284C7] text-white shadow-md shadow-[#0284C7]/30 scale-102 ring-2 ring-[#0284C7]/20'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>👶 Milestones & Red Flags</span>
              </button>

              <button
                id="btn-tool-regressions"
                onClick={() => setActiveTool('regressions')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTool === 'regressions'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30 scale-102 ring-2 ring-[#7C3AED]/20'
                    : 'bg-[#FFFBF7] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5EFEB]'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>🌙 Sleep Regressions</span>
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
                <span>🍼 Sour Milk & Undigested Food</span>
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
                <span>🎨 Poop Colors</span>
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
                <span>Fever Triage</span>
              </button>
            </div>

            {/* TOOL 1: Lactose & CMPA Card */}
            {activeTool === 'lactose' && (
              <LactoseIntoleranceCard
                babyName={babyProfile.name || 'your baby'}
                babyAgeMonths={babyProfile.ageMonths || 5}
                onAskDoctor={(prompt) => handleSendMessage(prompt)}
              />
            )}

            {/* TOOL 2: Solid Foods & Top 9 Allergen Ladder */}
            {activeTool === 'allergens' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#15803D]">
                      <Apple className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Solids & Top 9 Allergen Ladder
                      </h3>
                      <p className="text-xs text-[#57534E]">AAP Early Allergen Introduction Protocol</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                    4–6+ Months
                  </span>
                </div>

                {/* Readiness Assessment */}
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2">
                  <span className="text-xs font-extrabold uppercase text-[#15803D] block">
                    ✓ Developmental Solids Readiness Checklist:
                  </span>
                  <div className="space-y-1.5 text-xs text-[#292524]">
                    {[
                      { id: 'sitting_up', label: 'Holds head steady & sits upright with minimal support' },
                      { id: 'tongue_thrust', label: 'Loss of tongue-thrust reflex (does not automatically push food out)' },
                      { id: 'grasping', label: 'Reaches out for food and brings hands/objects to mouth' },
                    ].map((item) => (
                      <label
                        key={item.id}
                        onClick={() => toggleSolidsCheck(item.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E7DDD5] cursor-pointer hover:bg-[#F0FDF4]"
                      >
                        <input
                          type="checkbox"
                          checked={solidsChecked.includes(item.id)}
                          onChange={() => {}}
                          className="w-4 h-4 accent-[#15803D]"
                        />
                        <span className="font-medium text-xs text-[#1C1917]">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Top 9 Allergen Timeline Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase text-[#1C1917] block">
                    Select Allergen for Safe Pediatric Introduction:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'peanut', label: '🥜 Peanut', risk: 'High' },
                      { id: 'egg', label: '🥚 Egg', risk: 'Medium' },
                      { id: 'dairy', label: '🥛 Dairy', risk: 'Medium' },
                      { id: 'tree_nut', label: '🌰 Tree Nuts', risk: 'High' },
                      { id: 'soy', label: '🌱 Soy', risk: 'Low' },
                      { id: 'wheat', label: '🌾 Wheat', risk: 'Low' },
                      { id: 'fish', label: '🐟 Fish', risk: 'Medium' },
                      { id: 'shellfish', label: '🦐 Shellfish', risk: 'Medium' },
                      { id: 'sesame', label: '🥯 Sesame', risk: 'Medium' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedAllergen(item.id)}
                        className={`p-2.5 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                          selectedAllergen === item.id
                            ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                            : 'bg-white text-[#1C1917] border-[#E7DDD5] hover:bg-[#F0FDF4]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Allergen Clinical Procedure */}
                <div className="p-4 rounded-2xl bg-[#F0FDF4] border-2 border-[#BBF7D0] space-y-2 text-xs">
                  <strong className="block text-sm font-bold text-[#14532D]">
                    💡 Pediatric Protocol for {selectedAllergen.toUpperCase()}:
                  </strong>
                  <ul className="space-y-1.5 text-[#166534]">
                    <li>• <strong>Preparation:</strong> Thin smooth paste/puree (e.g. 1/4 tsp peanut powder mixed with breastmilk/formula). Never whole nuts.</li>
                    <li>• <strong>Timing:</strong> Introduce in the morning when baby is healthy, so you can observe over the next 2–3 hours.</li>
                    <li>• <strong>Frequency:</strong> Once introduced with no reaction, offer 1–2 times weekly to maintain tolerance.</li>
                  </ul>
                </div>

                {/* Reaction vs Emergency Signs */}
                <div className="p-4 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECDD3] space-y-2">
                  <span className="text-xs font-bold text-[#991B1B] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>When to Seek Immediate Medical Help (Anaphylaxis):</span>
                  </span>
                  <p className="text-xs text-[#7F1D1D] leading-relaxed">
                    Hives spreading rapidly, facial/lip swelling, vomiting within 30 mins, wheezing, coughing, or sudden lethargy. Call 911 / emergency services immediately.
                  </p>
                </div>

                <button
                  onClick={() => handleSendMessage(`What is the recommended step-by-step introduction plan for ${selectedAllergen} for my ${babyProfile.ageMonths}-month-old baby?`)}
                  className="w-full py-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs shadow-md shadow-[#15803D]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Ask AI Doctor About Starting Solids</span>
                </button>
              </div>
            )}

            {/* TOOL 3: Developmental Milestones & Red Flags Tracker */}
            {activeTool === 'milestones' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Developmental Milestones
                      </h3>
                      <p className="text-xs text-[#57534E]">AAP & CDC Age-Based Developmental Tracker</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                    CDC Guidelines
                  </span>
                </div>

                {/* Age Bracket Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  {[
                    { id: '0_3', label: '0–3 Months' },
                    { id: '4_6', label: '4–6 Months' },
                    { id: '7_9', label: '7–9 Months' },
                    { id: '10_12', label: '10–12 Months' },
                    { id: '12_18', label: '12–18 Months' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMilestoneAgeBracket(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        milestoneAgeBracket === tab.id
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'bg-[#FFFBF7] text-[#57534E] border border-[#D6C7BC] hover:bg-[#E0F2FE]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 4 Developmental Domains */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-1">
                    <span className="text-xs font-extrabold uppercase text-[#0369A1] block">
                      🏃 Gross Motor Skills:
                    </span>
                    <p className="text-xs text-[#292524]">
                      {milestoneAgeBracket === '0_3' && 'Lifts head during tummy time, turns head side to side, smooth arm movements.'}
                      {milestoneAgeBracket === '4_6' && 'Rolls tummy to back and back to tummy, pushes up on straight arms, sits with support.'}
                      {milestoneAgeBracket === '7_9' && 'Sits without support, crawls or scoots, bears weight on legs when supported.'}
                      {milestoneAgeBracket === '10_12' && 'Pulls up to stand, cruises along furniture, may take first independent steps.'}
                      {milestoneAgeBracket === '12_18' && 'Walks independently, squats to pick up toys, climbs onto low surfaces.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-1">
                    <span className="text-xs font-extrabold uppercase text-[#7C3AED] block">
                      🗣️ Social & Communication:
                    </span>
                    <p className="text-xs text-[#292524]">
                      {milestoneAgeBracket === '0_3' && 'Smiles responsively at faces, makes cooing sounds ("ooh", "aah"), turns to familiar voices.'}
                      {milestoneAgeBracket === '4_6' && 'Laughs out loud, babbles consonant strings ("ba-ba", "da-da"), looks when name is called.'}
                      {milestoneAgeBracket === '7_9' && 'Understands "no", responds to own name consistently, shows stranger anxiety.'}
                      {milestoneAgeBracket === '10_12' && 'Waves "bye-bye", says "mama" or "dada" with specific meaning, plays peek-a-boo.'}
                      {milestoneAgeBracket === '12_18' && 'Uses 5–10 words, points to show interest, follows simple 1-step directions.'}
                    </p>
                  </div>
                </div>

                {/* AAP Red Flags Callout */}
                <div className="p-4 rounded-2xl bg-[#FEF3C7] border-2 border-[#FDE68A] space-y-1.5">
                  <span className="text-xs font-extrabold text-[#92400E] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#B45309]" />
                    <span>AAP Clinical Red Flags (Contact Pediatrician):</span>
                  </span>
                  <p className="text-xs text-[#78350F] leading-relaxed">
                    {milestoneAgeBracket === '0_3' && 'Does not respond to loud sounds, does not track moving objects with eyes, stiff or excessively floppy limbs.'}
                    {milestoneAgeBracket === '4_6' && 'Does not hold head steady, does not smile or make sounds, does not reach for toys.'}
                    {milestoneAgeBracket === '7_9' && 'Cannot sit with help, does not bear weight on legs, does not babble or respond to name.'}
                    {milestoneAgeBracket === '10_12' && 'Cannot stand with support, does not point or gesture, loses previously acquired skills.'}
                    {milestoneAgeBracket === '12_18' && 'Does not walk by 18 months, speaks fewer than 6 words, avoids eye contact.'}
                  </p>
                </div>

                <button
                  onClick={() => handleSendMessage(`Are my baby's developmental milestones on track for ${babyProfile.ageMonths} months? What activities boost motor and speech development?`)}
                  className="w-full py-3 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-[#0284C7]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Ask AI Doctor About Milestones</span>
                </button>
              </div>
            )}

            {/* TOOL 4: Sleep Regressions & Circadian Leaps */}
            {activeTool === 'regressions' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Sleep Regressions & Leaps
                      </h3>
                      <p className="text-xs text-[#57534E]">Neurological Sleep Transitions & Solutions</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE]">
                    Circadian Shift
                  </span>
                </div>

                {/* Regression Age Selector */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '4m', label: '4-Month', sub: 'Sleep Cycles' },
                    { id: '8m', label: '8-10 Month', sub: 'Separation' },
                    { id: '12m', label: '12-Month', sub: 'Nap Drop' },
                    { id: '18m', label: '18-Month', sub: 'Independence' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRegressionAge(r.id as any)}
                      className={`p-2.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        regressionAge === r.id
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                          : 'bg-white text-[#1C1917] border-[#E7DDD5] hover:bg-[#F5F3FF]'
                      }`}
                    >
                      <strong className="text-xs block font-bold">{r.label}</strong>
                      <span className="text-[10px] opacity-80">{r.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Regression Science & Protocols */}
                <div className="p-4 rounded-2xl bg-[#FAF5FF] border-2 border-[#DDD6FE] space-y-3">
                  <strong className="block text-sm font-bold text-[#5B21B6]">
                    🧠 Biological Cause ({regressionAge.toUpperCase()} Regression):
                  </strong>
                  <p className="text-xs text-[#3730A3] leading-relaxed">
                    {regressionAge === '4m' && 'Baby transitions from simple 2-stage newborn sleep to adult-like 4-stage circadian cycles (every 45–60 mins). When they cycle into light REM sleep, they wake and look for the exact environment they fell asleep in.'}
                    {regressionAge === '8m' && 'Peak separation anxiety and intense motor leaps (crawling, pulling up in crib). Baby’s brain wants to practice standing at 2 AM!'}
                    {regressionAge === '12m' && 'Often a false 1-nap regression. Baby resists nap 2 due to brain development, but is not biologically ready for 1 nap until 14–18 months.'}
                    {regressionAge === '18m' && 'Language explosion, peak teething (canines/molars), and toddler testing of boundaries at bedtime.'}
                  </p>
                </div>

                {/* Step-by-Step Survival Protocol */}
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2 text-xs">
                  <span className="text-xs font-extrabold uppercase text-[#1C1917] block">
                    🛡️ Pediatric Survival Strategy:
                  </span>
                  <ul className="space-y-1.5 text-[#292524]">
                    <li>• <strong>Drowsy But Awake:</strong> Place baby in crib calm but not fully asleep so they master linking cycles independently.</li>
                    <li>• <strong>Protect Wake Windows:</strong> Do not let wake windows stretch past max limits ({babyProfile.ageMonths <= 5 ? '2h 15m' : '3h 30m'}).</li>
                    <li>• <strong>Acoustic Masking:</strong> Keep continuous pink/brown noise playing at 55–60 dB to prevent startle wakeups during REM transitions.</li>
                  </ul>
                </div>

                <button
                  onClick={() => handleSendMessage(`How do I fix the ${regressionAge} sleep regression for my baby who is waking every hour at night?`)}
                  className="w-full py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-[#7C3AED]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Ask AI Doctor for Regression Survival Plan</span>
                </button>
              </div>
            )}

            {/* TOOL 5: Sour Milk Vomit & Undigested Food Guide */}
            {activeTool === 'spit_up' && (
              <UndigestedFoodAndSourMilkCard
                babyName={babyProfile.name || 'your baby'}
                babyAgeMonths={babyProfile.ageMonths || 5}
                onAskDoctor={(prompt) => handleSendMessage(prompt)}
              />
            )}

            {/* TOOL 6: Poop Color Decoder */}
            {activeTool === 'poop_colors' && (
              <PoopVisualGuideCard
                babyName={babyProfile.name || 'your baby'}
                babyAgeMonths={babyProfile.ageMonths || 5}
                onAskDoctor={(prompt) => handleSendMessage(prompt)}
              />
            )}

            {/* TOOL 7: Fever Triage */}
            {activeTool === 'fever' && (
              <div className="bg-white rounded-[32px] border-2 border-[#E7DDD5] p-6 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0E6DD]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#FF5A5F]">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                        Infant Fever Calculator
                      </h3>
                      <p className="text-xs text-[#57534E]">AAP Age-Specific Fever Triage</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${feverEval.bgColor}`}>
                    {feverEval.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1C1917] block">Baby's Age:</label>
                    <select
                      value={feverAgeMonths}
                      onChange={(e) => setFeverAgeMonths(parseInt(e.target.value, 10))}
                      className="w-full p-2.5 rounded-xl border border-[#D6C7BC] bg-[#FFFBF7] text-xs font-semibold text-[#1C1917]"
                    >
                      <option value={1}>1 Month (Urgent threshold)</option>
                      <option value={2}>2 Months (Urgent threshold)</option>
                      <option value={4}>4 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={9}>9 Months</option>
                      <option value={12}>12+ Months</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1C1917] block">Measurement Type:</label>
                    <select
                      value={tempMethod}
                      onChange={(e) => setTempMethod(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-[#D6C7BC] bg-[#FFFBF7] text-xs font-semibold text-[#1C1917]"
                    >
                      <option value="rectal">Rectal (AAP Gold Standard)</option>
                      <option value="forehead">Temporal / Forehead</option>
                      <option value="axillary">Armpit (Axillary)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">Temperature:</span>
                    <span className="font-serif text-lg font-bold text-[#B91C1C]">
                      {tempF.toFixed(1)}°F ({((tempF - 32) * 5 / 9).toFixed(1)}°C)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="97.0"
                    max="105.0"
                    step="0.1"
                    value={tempF}
                    onChange={(e) => setTempF(parseFloat(e.target.value))}
                    className="w-full accent-[#FF5A5F] cursor-pointer"
                  />
                </div>

                <div className={`p-4 rounded-2xl border-2 text-xs leading-relaxed ${feverEval.bgColor}`}>
                  <strong className="block font-bold mb-1">💡 Clinical Guidance:</strong>
                  {feverEval.advice}
                </div>

                <button
                  onClick={() => handleSendMessage(`My ${feverAgeMonths}-month-old baby has a temperature of ${tempF.toFixed(1)}°F taken ${tempMethod}. What are the immediate pediatric recommendations?`)}
                  className="w-full py-3 rounded-2xl bg-[#FF5A5F] hover:bg-[#FF4147] text-white font-bold text-xs shadow-md shadow-[#FF5A5F]/30 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-rose-200" />
                  <span>Ask AI Doctor About This Temperature</span>
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
                  "How to start peanut allergen safely?",
                  "Why does baby spit up curd-like formula?",
                  "What do different baby poop colors mean?",
                  "Help with the 4-month sleep regression!",
                  "When to transition 3 naps to 2 naps?",
                  "Is 100.4°F fever emergency for young baby?"
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
          )}

          {/* Right Column: In-Page Live AI Doctor Consultation Chat Console (Expandable to Full Width) */}
          <div className={isExpandedCanvas ? 'lg:col-span-12' : 'lg:col-span-7'}>
            <div className={`bg-white rounded-[36px] border-2 border-[#E7DDD5] shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
              isExpandedCanvas ? 'h-[850px]' : 'h-[680px]'
            }`}>
              
              {/* Console Header */}
              <div className="p-4 sm:px-6 bg-[#FFFBF7] border-b border-[#F0E6DD] space-y-3 shrink-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-[#FFE4E6] border-2 border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shadow-xs">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#22C55E] border-2 border-white rounded-full" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                          24/7 AI Pediatric Clinic
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE]">
                          Multi-Model AI
                        </span>
                        {isExpandedCanvas && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                            Spacious Canvas Mode
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#57534E] font-medium">
                        Patient: {babyProfile.name || 'Baby'} ({babyProfile.ageMonths}m) • AAP Evidence-Based
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Expand Canvas Button */}
                    <button
                      onClick={() => setIsExpandedCanvas(!isExpandedCanvas)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isExpandedCanvas
                          ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                          : 'bg-white text-[#1C1917] border-[#D6C7BC] hover:bg-[#F5EFEB]'
                      }`}
                      title={isExpandedCanvas ? "Switch to Split View" : "Expand Answer Canvas to Full Screen Width"}
                    >
                      {isExpandedCanvas ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Split View</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Expand Canvas</span>
                        </>
                      )}
                    </button>

                    {/* Font Size Zoom Controller */}
                    <div className="hidden sm:flex items-center bg-white rounded-xl border border-[#D6C7BC] p-0.5 text-xs font-bold">
                      <button
                        onClick={() => setFontSize('normal')}
                        className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          fontSize === 'normal' ? 'bg-[#FF5A5F] text-white' : 'text-[#57534E] hover:text-[#1C1917]'
                        }`}
                        title="Normal Text Size"
                      >
                        A
                      </button>
                      <button
                        onClick={() => setFontSize('large')}
                        className={`px-2.5 py-1 rounded-lg text-sm transition-all cursor-pointer ${
                          fontSize === 'large' ? 'bg-[#FF5A5F] text-white' : 'text-[#57534E] hover:text-[#1C1917]'
                        }`}
                        title="Large Text Size"
                      >
                        A+
                      </button>
                      <button
                        onClick={() => setFontSize('xlarge')}
                        className={`px-2.5 py-1 rounded-lg text-base transition-all cursor-pointer ${
                          fontSize === 'xlarge' ? 'bg-[#FF5A5F] text-white' : 'text-[#57534E] hover:text-[#1C1917]'
                        }`}
                        title="Extra Large Text Size"
                      >
                        A++
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (onDownloadPdf) {
                          onDownloadPdf();
                        } else {
                          generatePediatricPdf({
                            babyProfile,
                            sleepLogs,
                            feedLogs,
                            diaperLogs,
                            activityLogs
                          });
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                      title="Download 24h & 7-Day Pediatric Summary PDF for Doctor"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Export PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setMessages([
                          {
                            id: 'welcome-reset',
                            role: 'assistant',
                            content: `### 🩺 Consultation Reset
Switched to **${selectedEngine === 'ada_health' ? 'Ada Health Pediatric Triage' : selectedEngine === 'chatgpt_health' ? 'ChatGPT Health Assistant' : 'Dr. Lullaby Clinical MD'}**. Ready for your questions regarding sleep, infant health, fevers, solids, allergens, and baby milestones. How can I assist?`,
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
                      Fullscreen
                    </button>
                  </div>
                </div>

                {/* 3 Clinical Intelligence Engine Selectors */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5EFEB] rounded-2xl border border-[#E7DDD5]">
                  <button
                    onClick={() => {
                      setSelectedEngine('dr_lullaby');
                      setMessages(prev => [
                        ...prev,
                        {
                          id: `mode-${Date.now()}`,
                          role: 'assistant',
                          content: `### 🏥 Switched to Dr. Lullaby & Nurse Daisy (AAP Guidelines)
Providing evidence-based pediatric clinical guidelines, fever safety, milk protein physiology, and safe sleep standards.`,
                          timestamp: 'Now'
                        }
                      ]);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedEngine === 'dr_lullaby'
                        ? 'bg-[#FF5A5F] text-white shadow-xs'
                        : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/60'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span className="truncate">Dr. Lullaby</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEngine('ada_health');
                      setMessages(prev => [
                        ...prev,
                        {
                          id: `mode-${Date.now()}`,
                          role: 'assistant',
                          content: `### 🔍 Switched to Ada Health Pediatric Triage Engine
Specializing in systematic symptom triage, differential probability analysis, and pediatric red-flag identification.`,
                          timestamp: 'Now'
                        }
                      ]);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedEngine === 'ada_health'
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/60'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span className="truncate">Ada Health</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEngine('chatgpt_health');
                      setMessages(prev => [
                        ...prev,
                        {
                          id: `mode-${Date.now()}`,
                          role: 'assistant',
                          content: `### ⚡ Switched to ChatGPT Health Assistant
Specializing in empathetic parenting routines, gentle sleep soothing scripts, feeding schedules, and milestone coaching.`,
                          timestamp: 'Now'
                        }
                      ]);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedEngine === 'chatgpt_health'
                        ? 'bg-[#10A37F] text-white shadow-xs'
                        : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/60'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="truncate">ChatGPT Health</span>
                  </button>
                </div>
              </div>

              {/* Messages Area - Larger, High-Contrast Visual Answer Stream */}
              <div 
                ref={chatContainerRef}
                className="flex-1 p-4 sm:p-7 overflow-y-auto space-y-6 bg-[#FFFBF7]/40"
              >
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFE4E6] border-2 border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shrink-0 mt-1 shadow-xs">
                          <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                      )}

                      <div
                        className={`rounded-3xl p-5 sm:p-7 shadow-md relative group transition-all ${
                          isUser
                            ? 'bg-[#FF5A5F] text-white rounded-br-none max-w-[85%] sm:max-w-[75%]'
                            : isExpandedCanvas
                            ? 'bg-white border-2 border-[#E7DDD5] text-[#1C1917] rounded-bl-none max-w-[96%] w-full'
                            : 'bg-white border-2 border-[#E7DDD5] text-[#1C1917] rounded-bl-none max-w-[92%] sm:max-w-[88%]'
                        }`}
                      >
                        {/* If assistant, display visual clinical badge header */}
                        {!isUser && (
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#F0E6DD] text-xs">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>AAP Clinical Verified</span>
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#F5EFEB] text-[#57534E]">
                                👶 Patient: {babyProfile.name || 'Baby'} ({babyProfile.ageMonths}m)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[#78716C] font-mono text-[11px]">
                              <Clock className="w-3 h-3" />
                              <span>{msg.timestamp}</span>
                            </div>
                          </div>
                        )}

                        {isUser ? (
                          <p className={`font-semibold whitespace-pre-wrap ${
                            fontSize === 'xlarge' ? 'text-xl leading-relaxed' : fontSize === 'large' ? 'text-lg leading-relaxed' : 'text-base leading-relaxed'
                          }`}>
                            {msg.content}
                          </p>
                        ) : (
                          <div className={`space-y-4 max-w-none ${
                            fontSize === 'xlarge'
                              ? 'text-xl leading-loose'
                              : fontSize === 'large'
                              ? 'text-lg leading-relaxed'
                              : 'text-base leading-relaxed'
                          } text-[#1C1917]`}>
                            <ReactMarkdown
                              components={{
                                h3: ({ children }) => (
                                  <div className="p-3.5 sm:p-4 my-4 bg-[#FFF7ED] border-l-4 border-[#EA580C] rounded-r-2xl shadow-2xs">
                                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#9A3412] flex items-center gap-2 m-0">
                                      <span>🩺</span>
                                      <span>{children}</span>
                                    </h3>
                                  </div>
                                ),
                                h4: ({ children }) => (
                                  <h4 className="font-bold text-base sm:text-lg text-[#1C1917] mt-4 mb-2 flex items-center gap-2 pb-1 border-b border-[#F0E6DD]">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F]" />
                                    <span>{children}</span>
                                  </h4>
                                ),
                                p: ({ children }) => (
                                  <p className="text-[#1C1917] font-normal leading-relaxed mb-3 last:mb-0">
                                    {children}
                                  </p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="space-y-2.5 my-3 pl-2 sm:pl-4">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="space-y-2.5 my-3 pl-2 sm:pl-4 list-decimal text-[#1C1917]">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="p-3 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5] shadow-2xs text-[#1C1917] font-medium flex items-start gap-2.5 leading-relaxed">
                                    <span className="text-[#059669] font-bold mt-0.5 shrink-0">✓</span>
                                    <div className="flex-1">{children}</div>
                                  </li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-bold text-[#1C1917] bg-[#FEF3C7]/40 px-1 py-0.5 rounded">
                                    {children}
                                  </strong>
                                ),
                                blockquote: ({ children }) => (
                                  <div className="my-4 p-4 sm:p-5 rounded-2xl bg-[#FFF1F2] border-2 border-[#FECDD3] text-[#9F1239] shadow-xs space-y-1">
                                    <div className="flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider text-[#BE123C]">
                                      <ShieldAlert className="w-4 h-4" />
                                      <span>Pediatric Urgent Red Flags / Important Warning</span>
                                    </div>
                                    <div className="text-base sm:text-lg font-semibold leading-relaxed">
                                      {children}
                                    </div>
                                  </div>
                                )
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>

                            {/* Interactive Care Checklist & Action Bar */}
                            <div className="mt-5 pt-4 border-t-2 border-[#F0E6DD] space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold text-[#57534E]">
                                <span className="uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckSquare className="w-3.5 h-3.5 text-[#059669]" />
                                  <span>Parent Care Steps Checklist:</span>
                                </span>
                                <span className="text-[11px] text-[#78716C]">Tap to mark steps completed</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {[
                                  { id: `${msg.id}-step1`, label: 'Checked temperature & recorded reading' },
                                  { id: `${msg.id}-step2`, label: 'Offered hydration (breast milk/formula/water)' },
                                  { id: `${msg.id}-step3`, label: 'Observed diapers and stool consistency' },
                                  { id: `${msg.id}-step4`, label: 'Applied soothing & comfortable rest routine' }
                                ].map((step) => {
                                  const isDone = !!checkedActions[step.id];
                                  return (
                                    <button
                                      key={step.id}
                                      type="button"
                                      onClick={() => toggleActionItem(step.id)}
                                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                                        isDone
                                          ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#166534] font-bold'
                                          : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#57534E] hover:bg-[#F5EFEB]'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                        isDone ? 'bg-[#15803D] border-[#15803D] text-white' : 'border-[#D6C7BC] bg-white'
                                      }`}>
                                        {isDone && <Check className="w-3 h-3" />}
                                      </div>
                                      <span className="text-[11px] truncate">{step.label}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Action Tools: Copy, Print, Share */}
                              <div className="flex items-center justify-between gap-3 pt-2 text-xs text-[#57534E]">
                                <span className="text-[11px] text-[#78716C] font-mono">
                                  Reference ID: #{msg.id.slice(-6)}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleCopy(msg.content, msg.id)}
                                    className="px-3 py-1.5 rounded-xl bg-[#FFFBF7] hover:bg-[#F0E6DD] border border-[#E7DDD5] text-[#1C1917] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    {copiedId === msg.id ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 text-green-600" />
                                        <span className="text-green-600">Copied Plan</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Plan</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (onDownloadPdf) onDownloadPdf();
                                      else generatePediatricPdf({ babyProfile, sleepLogs, feedLogs, diaperLogs, activityLogs });
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Print / PDF</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                          </div>
                        )}

                        {isUser && (
                          <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-white/20 text-[11px] opacity-90 font-mono">
                            <span>{msg.timestamp}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-4 justify-start items-center p-4 bg-white rounded-3xl border-2 border-[#E7DDD5] shadow-sm animate-pulse">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] border border-[#FECDD3] flex items-center justify-center text-[#FF5A5F] shrink-0">
                      <Stethoscope className="w-5 h-5 animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-sm text-[#1C1917] font-bold ml-1">Consulting Pediatric AI & CDC Guidelines...</span>
                      </div>
                      <p className="text-xs text-[#57534E]">
                        Formulating patient assessment for {babyProfile.name || 'your baby'} ({babyProfile.ageMonths} months old)...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input & Suggested Questions */}
              <div className="p-4 bg-white border-t border-[#F0E6DD] space-y-3">
                {/* Quick prompt chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                  <span className="text-[10px] font-bold uppercase text-[#78716C] shrink-0 mr-1">
                    Quick Ask:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`Why does my baby have undigested food in their poop (carrots, peas, corn), is it normal, and how do I fix food prep for them?`)}
                    className="px-2.5 py-1 rounded-xl bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] font-bold hover:bg-[#FFEDD5] whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>🥕 Undigested food in poop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`Why does my baby throw up / spit up sour-smelling curdled milk after bottles, and what should I do to fix it?`)}
                    className="px-2.5 py-1 rounded-xl bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] font-bold hover:bg-[#FFEDD5] whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>🍼 Throws up sour milk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`How do I tell the difference between lactose overload vs cow's milk protein allergy (CMPA)?`)}
                    className="px-2.5 py-1 rounded-xl bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-bold hover:bg-[#DCFCE7] whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>🥛 Lactose vs CMPA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`What vaccines are due for my ${babyProfile.ageMonths}-month-old baby (${babyProfile.name}), and how should I treat post-shot fever and leg soreness?`)}
                    className="px-2.5 py-1 rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-bold hover:bg-[#D1FAE5] whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>💉 Vaccine Schedule & Care</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage(`When is an infant fever considered a medical emergency under AAP guidelines?`)}
                    className="px-2.5 py-1 rounded-xl bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3] font-bold hover:bg-[#FFE4E6] whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>🌡️ Fever Red Flags</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={`Ask about fever, spit-up, sleep regressions, or allergens...`}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#D6C7BC] bg-[#FFFBF7] text-sm text-[#1C1917] focus:outline-hidden focus:border-[#FF5A5F] focus:bg-white transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isLoading}
                    className="px-5 py-3 rounded-2xl bg-[#FF5A5F] text-white hover:bg-[#FF4147] font-bold text-sm shadow-md shadow-[#FF5A5F]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-[#78716C] text-center mt-2">
                  *Pediatric AI guidance is for informational & educational purposes based on AAP literature. Always consult your baby's physician for medical diagnosis.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
