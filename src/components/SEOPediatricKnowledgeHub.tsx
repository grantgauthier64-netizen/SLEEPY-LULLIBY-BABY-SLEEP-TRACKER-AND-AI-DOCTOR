import React, { useState } from 'react';
import { 
  Sparkles, 
  Moon, 
  Stethoscope, 
  Milk, 
  Baby, 
  Activity, 
  Heart, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Search, 
  BookOpen, 
  Thermometer, 
  Apple, 
  Clock, 
  Zap, 
  TrendingUp, 
  Users 
} from 'lucide-react';

interface SEOPediatricKnowledgeHubProps {
  onOpenLiveTracker?: () => void;
  onOpenAIAgent?: () => void;
}

export const SEOPediatricKnowledgeHub: React.FC<SEOPediatricKnowledgeHubProps> = ({
  onOpenLiveTracker,
  onOpenAIAgent,
}) => {
  const [activeTopic, setActiveTopic] = useState<
    'sleep_coach' | 'schedule_app' | 'health_assistant' | 'pediatrician' | 'feeding_sleep' | 'symptoms_tracker'
  >('sleep_coach');
  const [searchFilter, setSearchFilter] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const topics = [
    {
      id: 'sleep_coach' as const,
      label: 'AI Baby Sleep Tracker & Coach',
      icon: '🌙',
      title: 'AI Baby Sleep Tracker App & Intelligent Sleep Coach',
      tagline: 'Predictive wake windows, circadian rhythm syncing, and gentle sleep training science'
    },
    {
      id: 'schedule_app' as const,
      label: 'Baby Sleep Schedule & Newborns',
      icon: '⏱️',
      title: 'Baby Sleep Schedule App & Newborn Sleep Tracker',
      tagline: 'Age-customized nap routines, bedtime sweet spots, and sleep regression solutions'
    },
    {
      id: 'health_assistant' as const,
      label: 'AI Baby Health Assistant',
      icon: '🩺',
      title: 'AI Baby Health Assistant & 24/7 Pediatric Triage',
      tagline: 'Clinical fever guidance, symptom monitoring, and milestone progression'
    },
    {
      id: 'pediatrician' as const,
      label: 'AI Pediatrician for Parents',
      icon: '👨‍⚕️',
      title: 'AI Pediatrician for Parents & Baby Tracker with AI Doctor',
      tagline: 'Evidence-based AAP answers, formula digestion, spit-up analysis & poop decoding'
    },
    {
      id: 'feeding_sleep' as const,
      label: 'Feeding & Sleep Tracker',
      icon: '🍼',
      title: 'Baby Feeding and Sleep Tracker App',
      tagline: '1-tap nursing timer, bottle intake, pumped milk, and synchronized multi-caregiver logs'
    },
    {
      id: 'symptoms_tracker' as const,
      label: 'Baby Symptoms Tracker',
      icon: '🩹',
      title: 'Baby Symptoms Tracker App & Clinical Export',
      tagline: 'Diaper photo analysis, lactose/CMPA sensitivity, and doctor-ready 24h reports'
    },
  ];

  const articles = [
    {
      id: 'art-1',
      topic: 'sleep_coach',
      keywordTitle: 'How an AI Baby Sleep Tracker Detects the Optimal "Sweet Spot" Wake Window',
      summary: 'Infant sleep pressure builds rapidly based on adenosine buildup. Sleepy Lullaby Dreams combines your baby’s exact morning wake time, previous nap length, and age-calibrated circadian markers to predict the 15-minute biological window when settling is easiest without cortisol spikes.',
      highlights: [
        'Real-time wake window countdowns preventing overtiredness and bedtime battles',
        'Automatic adaptation for false naps, short catnaps, and early morning wakings',
        'Built-in acoustic pink and brown noise synthesizer for continuous REM cycle linking'
      ],
      ageRange: '0 – 24 Months'
    },
    {
      id: 'art-2',
      topic: 'schedule_app',
      keywordTitle: 'Newborn Sleep Tracker & Month-by-Month Sleep Schedules (0 to 18 Months)',
      summary: 'Newborns (0–3 months) sleep 14–17 hours without circadian melatonin rhythm. By 4 months, sleep architecture transitions to 4-stage cycles. Our algorithm dynamically calculates wake windows from 45–60 mins (newborns) up to 4–5 hours (toddlers on 1 nap).',
      highlights: [
        '0–3 Months: 45–90 min wake windows, 4–5 naps, gentle 5S soothing protocols',
        '4–6 Months: 1.5–2.5 hr wake windows, 3 naps, navigating the 4-month sleep regression',
        '7–9 Months: 2.25–3 hr wake windows, 2–3 naps, bedtime routine solidifying',
        '10–18 Months: 3–4.5 hr wake windows, transition from 2 naps to 1 restorative nap'
      ],
      ageRange: 'Birth to Toddler'
    },
    {
      id: 'art-3',
      topic: 'health_assistant',
      keywordTitle: 'AI Baby Health Assistant: Clinical Infant Fever Rules & AAP Safety Guidelines',
      summary: 'Temperature guidelines change drastically based on an infant’s age. Sleepy Lullaby AI includes an instant AAP clinical triage calculator that evaluates rectal, temporal, and axillary readings to advise whether immediate emergency care, pediatric consultation, or home monitoring is required.',
      highlights: [
        'Under 3 Months: Rectal temp ≥100.4°F (38.0°C) is a clinical emergency requiring immediate ER evaluation',
        '3–6 Months: Temp ≥101.0°F (38.3°C) warrants same-day pediatrician assessment',
        'Hydration safeguards: Calculating minimum wet diaper output (≥5–6 per 24 hours)'
      ],
      ageRange: '0 – 12 Months'
    },
    {
      id: 'art-4',
      topic: 'pediatrician',
      keywordTitle: 'Baby Tracker with AI Doctor: Curdled Spit-Up, Reflux, and Infant Poop Colors',
      summary: 'Parents often worry when formula spit-up looks like cottage cheese or when diaper stool changes color. Our AI Pediatrician explains gastric acid protein curdling (hydrochloric acid + pepsin), decodes golden vs green vs acholic pale white stool, and checks for Cow’s Milk Protein Allergy (CMPA).',
      highlights: [
        'Curdled spit-up is 95% normal: Stomach acid breaks casein/whey into curd clumps during digestion',
        'Infant Stool Decoder: Golden mustard, seedy green, and brown are normal; white, black, or red require immediate doctor review',
        'CMPA & Lactose Guidance: Distinguishing primary lactose deficiency from cow’s milk protein allergy'
      ],
      ageRange: 'Pediatric Reference'
    },
    {
      id: 'art-5',
      topic: 'feeding_sleep',
      keywordTitle: 'Baby Feeding and Sleep Tracker App: Synchronized Nursing, Bottle & Solid Intake',
      summary: 'Coordinate care seamlessly between Mom, Dad, grandparents, and nannies. Log left/right breastfeeding durations, formula milliliters/ounces, pumped milk reserves, and early solid food introductions with instant 1-tap shortcuts.',
      highlights: [
        '1-Tap quick logs for instant time-stamped diaper changes, bottles, and nap sessions',
        'Real-time multi-device cloud synchronization across iOS, Android, and web browsers',
        'Total daily nourishment tally comparing fluid intake and restorative sleep against pediatric milestones'
      ],
      ageRange: 'All Ages'
    },
    {
      id: 'art-6',
      topic: 'symptoms_tracker',
      keywordTitle: 'Baby Symptoms Tracker App & 24-Hour Pediatrician Visit Summary Generator',
      summary: 'Before doctor appointments or tele-health checkups, generate a single-click clinical export detailing total sleep duration, nursing minutes, bottle ounces, wet/dirty diaper counts, tummy time exercise, and logged symptoms.',
      highlights: [
        'Photo Diaper Stool Triage: Browser-based camera analysis matching clinical infant stool charts',
        'Top 9 Allergen Introduction Ladder: Safe morning introduction protocol for peanuts, eggs, and dairy',
        '1-Click "Copy Summary for Doctor" formatted in standardized clinical chart notes'
      ],
      ageRange: 'Clinical Checkup Ready'
    },
  ];

  const seoFaqs = [
    {
      question: 'What makes Sleepy Lullaby Dreams the best AI Baby Sleep Tracker & AI Sleep Coach?',
      answer: 'Sleepy Lullaby Dreams combines pediatric sleep science with modern artificial intelligence. Unlike rigid clock-based schedules, our AI Sleep Coach dynamically recalculates your baby’s next nap "Sweet Spot" based on their specific age, morning waking time, and previous nap quality, preventing overtiredness and cortisol spikes before they cause crying or bedtime struggles.'
    },
    {
      question: 'How does the Baby Sleep Schedule App calculate newborn wake windows?',
      answer: 'Our Baby Sleep Schedule algorithm uses evidence-based American Academy of Pediatrics (AAP) circadian data. For a 2-month-old, wake windows average 60–90 minutes; for a 5-month-old, 2 to 2.5 hours; and for a 9-month-old, 2.75 to 3.5 hours. The app monitors real-time elapsed awake time and sends gentle notifications before the window closes.'
    },
    {
      question: 'Can I use this app as a Newborn Sleep and Feeding Tracker with AI?',
      answer: 'Yes! Sleepy Lullaby Dreams is an all-in-one Newborn Baby Sleep and Feeding Tracker with AI. It includes 1-tap shortcuts for logging breastfeeding (left/right duration), bottle formula volume (ml/oz), diaper wetness and stool consistency, tummy time, and sleep milestones with real-time multi-caregiver syncing.'
    },
    {
      question: 'How does the AI Baby Health Assistant & AI Pediatrician for Parents work?',
      answer: 'Our on-site AI Pediatrician provides instant, 24/7 evidence-based guidance on infant health topics including AAP fever thresholds by age, curdled milk/reflux questions, 4-month and 8-month sleep regressions, Top 9 allergen introduction plans, and photo diaper stool triage.'
    },
    {
      question: 'Is this Baby Symptoms Tracker App compliant with AAP Safe Sleep recommendations?',
      answer: 'Absolutely. Sleepy Lullaby Dreams adheres strictly to AAP safe sleep guidelines: back to sleep, flat and firm sleep surface, empty crib free of loose blankets or pillows, room sharing without bed sharing, and acoustic noise machines played at safe volumes (50–60 dB).'
    }
  ];

  const filteredArticles = articles.filter(art => {
    if (searchFilter) {
      return (
        art.keywordTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchFilter.toLowerCase()) ||
        art.highlights.some(h => h.toLowerCase().includes(searchFilter.toLowerCase()))
      );
    }
    return art.topic === activeTopic;
  });

  return (
    <section 
      id="ai-baby-seo-knowledge-hub" 
      className="py-20 bg-gradient-to-b from-[#FFF8F3] via-white to-[#FFFBF7] border-t-2 border-[#E7DDD5] relative overflow-hidden"
      aria-label="AI Baby Sleep Tracker and Pediatric Health Knowledge Hub"
    >
      {/* Background Decorative Rings */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#FF5A5F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* SEO Header */}
        <header className="text-center max-w-4xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF1F2] text-[#E11D48] rounded-full text-xs font-extrabold uppercase tracking-widest border border-[#FFE4E6] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
            <span>Parent & Pediatric SEO Knowledge Center</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight leading-tight">
            The Complete <span className="text-[#FF5A5F] italic">AI Baby Sleep Tracker</span> & Pediatric Health Guide
          </h2>

          <p className="text-base sm:text-lg text-[#44403C] font-normal leading-relaxed max-w-3xl mx-auto">
            Everything you need to master newborn sleep schedules, wake window sweet spots, baby feeding rhythms, symptom triage, and baby tracking with our 24/7 AI Doctor.
          </p>

          {/* Quick Search Box for SEO topics */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              placeholder="Search sleep schedules, wake windows, fever rules..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-full border-2 border-[#E7DDD5] text-xs sm:text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#FF5A5F] shadow-xs"
            />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#78716C] hover:text-[#1C1917]"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Primary Keyword Category Navigation Hub */}
        <nav 
          aria-label="SEO Topic Navigation" 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10"
        >
          {topics.map((t) => {
            const isSelected = activeTopic === t.id && !searchFilter;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTopic(t.id);
                  setSearchFilter('');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 active:scale-95 ${
                  isSelected
                    ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-md scale-102'
                    : 'bg-white text-[#1C1917] border-[#E7DDD5] hover:border-[#FF5A5F] hover:bg-[#FFFBF7]'
                }`}
              >
                <span className="text-xl">{t.icon}</span>
                <div>
                  <strong className="text-xs font-bold block leading-tight">
                    {t.label}
                  </strong>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Dynamic SEO Knowledge Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Main Article Content */}
          <div className="lg:col-span-8 space-y-6">
            {filteredArticles.map((art) => (
              <article 
                key={art.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#E7DDD5] shadow-xs space-y-4 hover:border-[#FF5A5F]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F0E6DD] pb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]">
                    {art.ageRange}
                  </span>
                  <span className="text-xs font-semibold text-[#1E7B28] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#1E7B28]" />
                    <span>Evidence-Based Pediatric Standard</span>
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] leading-snug">
                  {art.keywordTitle}
                </h3>

                <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed font-normal">
                  {art.summary}
                </p>

                {/* Key Bullet Highlights */}
                <div className="p-4 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5] space-y-2">
                  <strong className="text-xs font-extrabold uppercase text-[#1C1917] tracking-wider block">
                    Key Clinical Highlights & Action Steps:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-[#292524]">
                    {art.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Call to Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0E6DD]">
                  <span className="text-xs text-[#78716C]">
                    Included in Free Lullaby AI Suite
                  </span>
                  <div className="flex items-center gap-2">
                    {onOpenLiveTracker && (
                      <button
                        onClick={onOpenLiveTracker}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-[#FFFBF7] text-[#1C1917] border border-[#D6C7BC] hover:bg-[#F5EFEB] transition-colors cursor-pointer"
                      >
                        Open Live Tracker
                      </button>
                    )}
                    {onOpenAIAgent && (
                      <button
                        onClick={onOpenAIAgent}
                        className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#FF5A5F] text-white hover:bg-[#FF4147] shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ask AI Pediatrician</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Column: SEO Keywords & Capability Pill Matrix */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Quick Keyword Matrix Box */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#E7DDD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FF5A5F]" />
                <h4 className="font-serif text-lg font-bold text-[#1C1917]">
                  Target Capabilities Index
                </h4>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed">
                Explore our full suite of baby sleep, health, and feeding tools engineered for modern parents:
              </p>

              <div className="flex flex-wrap gap-1.5">
                {[
                  'AI Baby Sleep Tracker',
                  'Baby Sleep Tracker App',
                  'AI Sleep Coach',
                  'Baby Sleep Schedule App',
                  'Newborn Sleep Tracker',
                  'AI Baby Health Assistant',
                  'AI Pediatrician for Parents',
                  'Baby Feeding & Sleep Tracker',
                  'Baby Symptoms Tracker App',
                  'Baby Tracker with AI Doctor',
                  'Newborn Sleep & Feeding Tracker with AI',
                  'Wake Window Calculator',
                  '4-Month Sleep Regression Guide',
                  'Pink Noise Baby Synthesizer',
                  'Photo Diaper Stool Triage',
                  'Lactose & CMPA Sensitivity Guide',
                  'Infant Fever Calculator AAP',
                  'Top 9 Allergen Ladder Guide',
                  'Multi-Caregiver Shift Handover'
                ].map((kw, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 bg-[#FFFBF7] text-[#44403C] border border-[#E7DDD5] rounded-xl text-[11px] font-semibold hover:border-[#FF5A5F] hover:text-[#1C1917] transition-colors cursor-default"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Live Pediatric Checklist Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF5FF] to-[#EDE9FE] border-2 border-[#DDD6FE] space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center text-sm font-bold">
                  🩺
                </div>
                <h4 className="font-serif text-base font-bold text-[#5B21B6]">
                  24/7 AI Pediatric Guidance
                </h4>
              </div>

              <p className="text-xs text-[#4C1D95] leading-relaxed">
                Have a question about your newborn’s sleep regression, curdled formula spit-up, or safe solid food allergen introductions? Our on-site AI Baby Doctor is ready right now.
              </p>

              <button
                onClick={onOpenAIAgent}
                className="w-full py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-md shadow-[#7C3AED]/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Chat with AI Doctor (Free)</span>
              </button>
            </div>

          </aside>
        </div>

        {/* Structured SEO FAQ Accordion Section */}
        <section aria-labelledby="seo-faq-heading" className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h3 id="seo-faq-heading" className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917]">
              Frequently Asked Questions: AI Baby Sleep & Health Tracking
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E]">
              Clinical and practical answers for tired parents searching for evidence-based solutions.
            </p>
          </div>

          <div className="space-y-3">
            {seoFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border-2 border-[#E7DDD5] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FFFBF7]"
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-[#1C1917]">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#FF5A5F] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#FF5A5F] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#44403C] font-normal leading-relaxed border-t border-[#F0E6DD] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </section>
  );
};
