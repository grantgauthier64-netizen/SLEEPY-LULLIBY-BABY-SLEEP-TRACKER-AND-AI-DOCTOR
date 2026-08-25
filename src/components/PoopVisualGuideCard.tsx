import React, { useState } from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, Info, ArrowRight, HelpCircle, Activity } from 'lucide-react';

export type PoopColorId = 
  | 'mustard_yellow' 
  | 'tan_formula' 
  | 'army_green' 
  | 'orange_peach' 
  | 'dark_brown' 
  | 'red_bloody' 
  | 'white_clay' 
  | 'black_tarry';

export type PoopTextureId = 
  | 'diarrhea' 
  | 'runny' 
  | 'pasty' 
  | 'soft' 
  | 'firm';

interface PoopColorOption {
  id: PoopColorId;
  name: string;
  hex: string;
  badge: 'Healthy & Normal' | 'Common & Safe' | 'Monitor / Attention' | '🚨 Immediate Emergency';
  badgeType: 'healthy' | 'monitor' | 'emergency';
  title: string;
  causes: string;
  notes: string;
  isNormal: boolean;
}

interface PoopTextureOption {
  id: PoopTextureId;
  name: string;
  emoji: string;
  shortDesc: string;
  badge: 'Healthy' | 'Normal' | 'Monitor' | 'High Risk' | 'Monitor Closely' | 'Constipation';
  badgeType: 'healthy' | 'monitor' | 'emergency';
  description: string;
  consistencyAdvice: string;
  isNormal: boolean;
}

export const POOP_COLORS: PoopColorOption[] = [
  {
    id: 'mustard_yellow',
    name: 'Mustard Yellow',
    hex: '#EAB308',
    badge: 'Healthy & Normal',
    badgeType: 'healthy',
    title: 'Mustard Yellow with Little Curds (Classic Breastfed)',
    causes: 'Natural liver bile breakdown mixed with breast milk fats. Often contains tiny white seed-like curds.',
    notes: 'Completely healthy and normal! Has a mild yogurt-like scent with runny or soft seedy consistency.',
    isNormal: true
  },
  {
    id: 'tan_formula',
    name: 'Tan / Peanut Butter',
    hex: '#B45309',
    badge: 'Healthy & Normal',
    badgeType: 'healthy',
    title: 'Tan / Yellow-Brown Peanut Butter (Classic Formula-Fed)',
    causes: 'Digested infant formula proteins and starches.',
    notes: '100% normal and typical for bottle-fed infants. Pasty texture (like hummus or peanut butter) with a more distinct scent.',
    isNormal: true
  },
  {
    id: 'army_green',
    name: 'Army / Forest Green',
    hex: '#15803D',
    badge: 'Common & Safe',
    badgeType: 'healthy',
    title: 'Army Green / Dark Green (Iron & Rapid Transit)',
    causes: 'Iron-fortified formula, infant iron drops, rapid digestive transit, or green purees (peas, spinach).',
    notes: 'Extremely common and harmless. When stool moves fast through the gut, bile remains green instead of turning yellow/brown.',
    isNormal: true
  },
  {
    id: 'orange_peach',
    name: 'Orange / Peach',
    hex: '#EA580C',
    badge: 'Healthy & Normal',
    badgeType: 'healthy',
    title: 'Orange / Peach Tones',
    causes: 'Digestive bile pigments, breast milk transit, or pureed vegetables like carrots, sweet potatoes, and squash.',
    notes: 'Very common and benign. Reflects natural food pigments and normal digestive motility.',
    isNormal: true
  },
  {
    id: 'dark_brown',
    name: 'Dark Brown',
    hex: '#573516',
    badge: 'Healthy & Normal',
    badgeType: 'healthy',
    title: 'Solid Dark Brown (Solids & Purees)',
    causes: 'Introduction of solid foods, baby oatmeal, meat, and table food around 6 months old.',
    notes: 'Normal maturation of stool. Consistency becomes firmer and scent becomes more like adult stool.',
    isNormal: true
  },
  {
    id: 'red_bloody',
    name: 'Red / Bloody Streaks',
    hex: '#DC2626',
    badge: 'Monitor / Attention',
    badgeType: 'monitor',
    title: 'Red Streaks / Bloody Stool (Review Needed)',
    causes: 'Cow\'s milk protein allergy/intolerance (CMPA), tiny anal fissure from hard constipation, or gut infection.',
    notes: 'Take a photo of the diaper and contact your pediatrician for prompt evaluation. Check if baby has been straining on hard pellets.',
    isNormal: false
  },
  {
    id: 'white_clay',
    name: 'White / Clay Pale',
    hex: '#E2E8F0',
    badge: '🚨 Immediate Emergency',
    badgeType: 'emergency',
    title: 'White / Chalky Pale / Clay-Gray (Achollic Stool)',
    causes: 'Lack of bile reaching the intestines due to liver/gallbladder duct blockage (such as biliary atresia).',
    notes: '🚨 RED FLAG EMERGENCY: Requires immediate same-day medical evaluation by a pediatrician or pediatric ER.',
    isNormal: false
  },
  {
    id: 'black_tarry',
    name: 'Black / Tarry (Melena)',
    hex: '#18181B',
    badge: '🚨 Immediate Emergency',
    badgeType: 'emergency',
    title: 'Black / Tarry Stool (After Day 4 of Life)',
    causes: 'Normal meconium in first 1–4 days. After day 5, indicates upper digestive tract bleeding (unless taking liquid iron).',
    notes: 'If baby is older than 5 days and NOT taking concentrated medicinal iron drops, call your pediatrician promptly.',
    isNormal: false
  }
];

export const POOP_TEXTURES: PoopTextureOption[] = [
  {
    id: 'diarrhea',
    name: 'Diarrhea / Watery',
    emoji: '💧🌊',
    shortDesc: 'Very watery, explosive, or leaves large wet ring',
    badge: 'Monitor Closely',
    badgeType: 'monitor',
    description: 'Very liquid, watery, and soaks completely into the diaper cloth/pad, often with explosive bursts.',
    consistencyAdvice: 'High risk of dehydration! Watch wet diaper count closely (needs ≥ 5–6 wet diapers/day). Offer breast milk or formula frequently. Call doctor if lasting > 24–48h or if paired with fever.',
    isNormal: false
  },
  {
    id: 'runny',
    name: 'Runny / Seedy',
    emoji: '🍯✨',
    shortDesc: 'Liquid with small soft curds (Classic Breastfed)',
    badge: 'Healthy',
    badgeType: 'healthy',
    description: 'Loose, runny, and easily smears with little white/yellow curds of digested milk fat.',
    consistencyAdvice: 'Completely normal and healthy for exclusively breastfed babies. As long as baby is gaining weight and smiling, no treatment needed.',
    isNormal: true
  },
  {
    id: 'pasty',
    name: 'Pasty / Creamy',
    emoji: '🥣🥜',
    shortDesc: 'Like smooth peanut butter or hummus',
    badge: 'Healthy',
    badgeType: 'healthy',
    description: 'Soft, creamy paste that holds some shape without being watery. Smears easily like peanut butter.',
    consistencyAdvice: 'The gold standard for formula-fed infants and babies starting smooth purees. Indicates optimal digestion and hydration.',
    isNormal: true
  },
  {
    id: 'soft',
    name: 'Soft Formed',
    emoji: '🪵👶',
    shortDesc: 'Soft log shape, easily squeezable',
    badge: 'Healthy',
    badgeType: 'healthy',
    description: 'Gently formed tubular or rounded stool that is soft, pliable, and passes easily without painful straining.',
    consistencyAdvice: 'Very common once baby is established on solid finger foods, oatmeal, and purees. Easy to pass without pain.',
    isNormal: true
  },
  {
    id: 'firm',
    name: 'Firm / Hard Pellets',
    emoji: '🪨⚠️',
    shortDesc: 'Hard pebbles or dry balls (Constipation)',
    badge: 'Constipation',
    badgeType: 'monitor',
    description: 'Small dry pebbles, hard compact balls, or thick dry logs. Baby may grunt painfully, cry, or turn red while passing.',
    consistencyAdvice: 'Indicates constipation or insufficient fluids. For babies on solids, offer "P" fruits (pears, prunes, peaches) and water sips. If formula-fed, verify scoop-to-water ratio is exact. Ask doctor before giving prune juice.',
    isNormal: false
  }
];

interface PoopVisualGuideCardProps {
  onAskDoctor?: (question: string) => void;
  babyName?: string;
  babyAgeMonths?: number;
  initialColor?: PoopColorId;
  initialTexture?: PoopTextureId;
  showAskButton?: boolean;
}

export const PoopVisualGuideCard: React.FC<PoopVisualGuideCardProps> = ({
  onAskDoctor,
  babyName = 'your baby',
  babyAgeMonths = 5,
  initialColor = 'mustard_yellow',
  initialTexture = 'pasty',
  showAskButton = true
}) => {
  const [selectedColorId, setSelectedColorId] = useState<PoopColorId>(initialColor);
  const [selectedTextureId, setSelectedTextureId] = useState<PoopTextureId>(initialTexture);
  const [activeTab, setActiveTab] = useState<'color' | 'texture' | 'matrix'>('color');

  const currentColor = POOP_COLORS.find(c => c.id === selectedColorId) || POOP_COLORS[0];
  const currentTexture = POOP_TEXTURES.find(t => t.id === selectedTextureId) || POOP_TEXTURES[0];

  // Combined clinical assessment
  const isOverallHealthy = currentColor.isNormal && currentTexture.isNormal;
  const isEmergency = currentColor.badgeType === 'emergency';
  const isWarning = !isOverallHealthy && !isEmergency;

  const handleAskAIDoctor = () => {
    if (!onAskDoctor) return;
    const prompt = `My baby ${babyName} (${babyAgeMonths} months old) has ${currentColor.name} colored poop with a ${currentTexture.name} texture (${currentTexture.id}). Can you evaluate what this combination means, whether it is normal, and what steps I should take?`;
    onAskDoctor(prompt);
  };

  return (
    <div 
      id="poop-visual-guide-card"
      className="bg-white/95 rounded-[32px] border-2 border-[#E7DDD5] shadow-lg shadow-[#4A3F35]/5 p-6 sm:p-7 space-y-6 overflow-hidden relative"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E6DD]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border-2 border-[#FDE68A] flex items-center justify-center text-2xl shadow-xs">
            💩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                Baby Poop Diagnostic Card
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]">
                Pediatric Guide
              </span>
            </div>
            <p className="text-xs text-[#57534E]">
              Interactive visual assessment for stool color & texture (Diarrhea, Runny, Pasty, Soft, Firm)
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-[#F5EFEB] p-1 rounded-2xl border border-[#E7DDD5]">
          <button
            type="button"
            onClick={() => setActiveTab('color')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'color' 
                ? 'bg-white text-[#1C1917] shadow-xs' 
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            🎨 1. Color ({POOP_COLORS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('texture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'texture' 
                ? 'bg-white text-[#1C1917] shadow-xs' 
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            🥣 2. Type & Texture ({POOP_TEXTURES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'matrix' 
                ? 'bg-white text-[#1C1917] shadow-xs' 
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            ⚡ Combined Report
          </button>
        </div>
      </div>

      {/* TAB 1: COLOR SELECTOR */}
      {activeTab === 'color' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#57534E] tracking-wider">
              Step 1: Select Baby's Diaper Color
            </span>
            <span className="text-[11px] font-bold text-[#EA580C]">
              {currentColor.name} Selected
            </span>
          </div>

          {/* Color Palette Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {POOP_COLORS.map((col) => {
              const isSelected = col.id === selectedColorId;
              return (
                <button
                  type="button"
                  key={col.id}
                  onClick={() => setSelectedColorId(col.id)}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 cursor-pointer text-center relative ${
                    isSelected
                      ? 'border-[#059669] bg-[#ECFDF5] shadow-sm ring-2 ring-[#059669]/20 scale-102'
                      : 'border-[#E7DDD5] bg-[#FFFBF7] hover:bg-[#F5EFEB]'
                  }`}
                >
                  <div className="relative">
                    <span
                      className="w-8 h-8 rounded-full border-2 border-black/15 shadow-sm block"
                      style={{ backgroundColor: col.hex }}
                    />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#059669] text-white rounded-full text-[10px] flex items-center justify-center font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-[#1C1917] block leading-tight">
                      {col.name}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md mt-1 inline-block ${
                      col.badgeType === 'healthy'
                        ? 'bg-emerald-100 text-emerald-800'
                        : col.badgeType === 'monitor'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {col.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Color Explanation Card */}
          <div className={`p-5 rounded-3xl border-2 transition-all space-y-3 ${
            currentColor.badgeType === 'emergency' 
              ? 'bg-red-50/95 border-red-300 text-red-950' 
              : currentColor.badgeType === 'monitor'
              ? 'bg-amber-50/95 border-amber-300 text-amber-950'
              : 'bg-[#FFFBF7] border-[#E7DDD5] text-[#292524]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-5 h-5 rounded-full border border-black/20 shadow-xs" 
                  style={{ backgroundColor: currentColor.hex }}
                />
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C1917]">
                  {currentColor.title}
                </h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide self-start sm:self-auto ${
                currentColor.isNormal ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {currentColor.isNormal ? '✅ Safe & Expected' : '⚠️ Medical Attention'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-black/5 space-y-1">
              <span className="text-xs font-extrabold uppercase text-[#57534E] block">🔬 Biological Cause:</span>
              <p className="text-sm sm:text-base text-[#1C1917] leading-relaxed font-medium">
                {currentColor.causes}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#EA580C]/30 shadow-xs space-y-1.5">
              <span className="text-xs font-extrabold uppercase text-[#EA580C] block flex items-center gap-1.5">
                <span>💡</span>
                <span>Pediatric Clinical Guidance & Action:</span>
              </span>
              <p className="text-base sm:text-lg text-[#1C1917] leading-relaxed font-bold">
                {currentColor.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEXTURE & CONSISTENCY SELECTOR (Diarrhea, Runny, Pasty, Soft, Firm) */}
      {activeTab === 'texture' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#57534E] tracking-wider">
              Step 2: Select Stool Texture & Consistency
            </span>
            <span className="text-[11px] font-bold text-[#0284C7]">
              {currentTexture.name} Selected
            </span>
          </div>

          {/* Texture cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {POOP_TEXTURES.map((tex) => {
              const isSelected = tex.id === selectedTextureId;
              return (
                <button
                  type="button"
                  key={tex.id}
                  onClick={() => setSelectedTextureId(tex.id)}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-start sm:items-center text-left sm:text-center gap-1.5 cursor-pointer relative ${
                    isSelected
                      ? 'border-[#0284C7] bg-[#F0F9FF] shadow-sm ring-2 ring-[#0284C7]/20 scale-102'
                      : 'border-[#E7DDD5] bg-[#FFFBF7] hover:bg-[#F5EFEB]'
                  }`}
                >
                  <span className="text-2xl">{tex.emoji}</span>
                  <div>
                    <span className="text-xs font-extrabold text-[#1C1917] block">
                      {tex.name}
                    </span>
                    <span className="text-[10px] text-[#78716C] font-medium leading-tight line-clamp-2 mt-0.5">
                      {tex.shortDesc}
                    </span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md mt-auto ${
                    tex.badgeType === 'healthy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : tex.badgeType === 'monitor'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {tex.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Texture Detail Card */}
          <div className="p-5 rounded-3xl bg-[#F0F9FF] border-2 border-[#BAE6FD] text-[#0C4A6E] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#BAE6FD]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentTexture.emoji}</span>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#0369A1]">
                  {currentTexture.name} Consistency Analysis
                </h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${
                currentTexture.isNormal ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {currentTexture.isNormal ? 'Normal Texture' : 'Needs Care / Hydration'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#BAE6FD]/40 space-y-1">
              <span className="text-xs font-extrabold uppercase text-[#0369A1] block">🩺 Appearance:</span>
              <p className="text-sm sm:text-base text-[#0C4A6E] leading-relaxed font-medium">
                {currentTexture.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#0284C7]/30 shadow-xs space-y-1.5">
              <span className="text-xs font-extrabold uppercase text-[#0284C7] block flex items-center gap-1.5">
                <span>💧</span>
                <span>Action & Hydration Guidance:</span>
              </span>
              <p className="text-base sm:text-lg text-[#0C4A6E] leading-relaxed font-bold">
                {currentTexture.consistencyAdvice}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMBINED REPORT MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-5 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E6DD] pb-3">
              <span className="text-sm font-extrabold uppercase text-[#1C1917] tracking-wider">
                Combined Stool Analysis for {babyName}
              </span>
              <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide self-start sm:self-auto ${
                isEmergency 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : isWarning 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-emerald-600 text-white'
              }`}>
                {isEmergency ? '🚨 Emergency Red Flag' : isWarning ? '⚠️ Monitor Stool' : '✅ 100% Healthy Combination'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E7DDD5]">
                <span className="text-xs font-extrabold text-[#78716C] uppercase block mb-1">
                  Selected Color:
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: currentColor.hex }} />
                  <span className="font-bold text-[#1C1917] text-base">{currentColor.name}</span>
                </div>
                <p className="text-xs text-[#57534E] mt-1">{currentColor.badge}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-2 border-[#E7DDD5]">
                <span className="text-xs font-extrabold text-[#78716C] uppercase block mb-1">
                  Selected Texture:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currentTexture.emoji}</span>
                  <span className="font-bold text-[#1C1917] text-base">{currentTexture.name}</span>
                </div>
                <p className="text-xs text-[#57534E] mt-1">{currentTexture.badge}</p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#EA580C]/40 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#EA580C] font-extrabold text-sm sm:text-base uppercase tracking-wider">
                <span>📋</span>
                <span>Pediatric Summary & Recommended Action:</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-[#1C1917] leading-relaxed">
                {currentColor.id === 'mustard_yellow' && currentTexture.id === 'runny' && (
                  "Classic healthy breastfed stool! Runny mustard yellow with soft milk fat curds. Excellent digestion."
                )}
                {currentColor.id === 'tan_formula' && (currentTexture.id === 'pasty' || currentTexture.id === 'soft') && (
                  "Standard healthy formula-fed stool! Pasty tan/peanut butter consistency indicates good formula absorption."
                )}
                {currentColor.id === 'army_green' && (currentTexture.id === 'pasty' || currentTexture.id === 'runny') && (
                  "Very common green stool from iron-fortified milk or rapid transit. Completely safe."
                )}
                {currentTexture.id === 'diarrhea' && (
                  "Watery diarrhea requires careful hydration monitoring. Ensure baby gets regular feeds and check for at least 5–6 wet diapers daily."
                )}
                {currentTexture.id === 'firm' && (
                  "Firm pellet stool indicates constipation. Verify formula mixing ratio or increase fluids/prune purees if on solids."
                )}
                {currentColor.id === 'red_bloody' && (
                  "Red streaks suggest possible milk allergy or anal fissure. Keep a photo of the diaper and call pediatrician."
                )}
                {currentColor.id === 'white_clay' && (
                  "White/clay stool is an urgent red flag indicating lack of bile. Seek immediate medical evaluation."
                )}
                {currentColor.id === 'black_tarry' && (
                  "Black tarry stool after newborn stage requires pediatrician review for possible upper GI bleeding."
                )}
                {!['mustard_yellow', 'tan_formula', 'army_green', 'red_bloody', 'white_clay', 'black_tarry'].includes(currentColor.id) && (
                  `The ${currentColor.name} color combined with ${currentTexture.name} texture is generally benign when baby is happy and drinking well.`
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Summary Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#FFFBF7] border border-[#E7DDD5] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#78716C]">Color:</span>
            <span className="font-bold text-[#1C1917] flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentColor.hex }} />
              {currentColor.name}
            </span>
          </div>
          <span className="text-[#D6C7BC]">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#78716C]">Texture:</span>
            <span className="font-bold text-[#1C1917] flex items-center gap-1">
              {currentTexture.emoji} {currentTexture.name}
            </span>
          </div>
        </div>

        {/* Ask AI Doctor Trigger */}
        {showAskButton && onAskDoctor && (
          <button
            type="button"
            onClick={handleAskAIDoctor}
            className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs shadow-md shadow-[#059669]/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Analyze {currentColor.name} + {currentTexture.name} with AI Doctor</span>
          </button>
        )}
      </div>
    </div>
  );
};
