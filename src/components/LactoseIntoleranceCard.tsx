import React, { useState } from 'react';
import { Sparkles, ShieldAlert, CheckCircle2, Info, AlertTriangle, Milk, HeartHandshake, HelpCircle, Activity, Stethoscope, ArrowRight } from 'lucide-react';

export interface SymptomItem {
  id: string;
  label: string;
  category: 'digestive' | 'skin' | 'behavior';
  isCMPAOnly?: boolean;
  isLactoseTypical?: boolean;
  description: string;
}

const SYMPTOM_LIST: SymptomItem[] = [
  {
    id: 'frothy_diarrhea',
    label: 'Frothy, Watery, Acidic Diarrhea',
    category: 'digestive',
    isLactoseTypical: true,
    description: 'Frequent loose, watery stools that look foamy or frothy with a distinctly sour smell.'
  },
  {
    id: 'explosive_gas',
    label: 'Severe Bloating & Explosive Gas',
    category: 'digestive',
    isLactoseTypical: true,
    description: 'Loud gurgling/rumbling tummy sounds (borborygmi) and excessive gas passing with distress.'
  },
  {
    id: 'acidic_diaper_rash',
    label: 'Severe Acidic Diaper Rash ("Ring of Fire")',
    category: 'skin',
    isLactoseTypical: true,
    description: 'Bright red, raw irritation around the anus caused by acidic unabsorbed lactose in the stool.'
  },
  {
    id: 'post_feed_cramping',
    label: 'Cramping 30–120 Mins After Feeding',
    category: 'behavior',
    isLactoseTypical: true,
    description: 'Baby cries, pulls knees/legs tightly up to chest, and appears uncomfortable 30 to 120 minutes post-feed.'
  },
  {
    id: 'blood_in_stool',
    label: 'Specks / Streaks of Blood in Diaper',
    category: 'digestive',
    isCMPAOnly: true,
    description: 'Tiny red flecks or mucusy red streaks in stool. (Hallmark sign of Cow\'s Milk Protein Allergy, NOT lactose intolerance).'
  },
  {
    id: 'eczema_hives',
    label: 'Eczema Flare-ups, Dry Patches or Hives',
    category: 'skin',
    isCMPAOnly: true,
    description: 'Rough itchy skin patches, facial rash, or urticaria/hives triggered by immune response to milk proteins.'
  },
  {
    id: 'frequent_spit_up',
    label: 'Painful Spit-Up / Reflux',
    category: 'digestive',
    isLactoseTypical: true,
    description: 'Frequent spitting up accompanied by back arching, throat clearing, or choking during feeds.'
  },
  {
    id: 'recent_stomach_bug',
    label: 'Recent Viral Stomach Bug / Gastroenteritis',
    category: 'digestive',
    isLactoseTypical: true,
    description: 'Baby recently had a stomach virus or diarrhea illness within the past 1–3 weeks (Secondary Lactose Intolerance).'
  }
];

interface LactoseIntoleranceCardProps {
  onAskDoctor?: (question: string) => void;
  babyName?: string;
  babyAgeMonths?: number;
  feedingType?: 'breast' | 'formula' | 'combo';
  showAskButton?: boolean;
}

export const LactoseIntoleranceCard: React.FC<LactoseIntoleranceCardProps> = ({
  onAskDoctor,
  babyName = 'your baby',
  babyAgeMonths = 5,
  feedingType = 'combo',
  showAskButton = true
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['frothy_diarrhea', 'post_feed_cramping']);
  const [activeTab, setActiveTab] = useState<'checker' | 'difference' | 'remedies' | 'formulas'>('checker');

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Assessment calculation
  const hasCMPASymptoms = selectedSymptoms.some(id => id === 'blood_in_stool' || id === 'eczema_hives');
  const hasSecondaryClue = selectedSymptoms.includes('recent_stomach_bug');
  const lactoseCount = selectedSymptoms.filter(id => 
    ['frothy_diarrhea', 'explosive_gas', 'acidic_diaper_rash', 'post_feed_cramping', 'frequent_spit_up'].includes(id)
  ).length;

  let assessmentResult = {
    title: 'Low Probability of Dairy Issues',
    badge: 'Normal Infant Digestion / Gas',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    summary: 'Selected symptoms are very common in normal infant digestion, gas, or mild colic. True congenital lactose intolerance is extremely rare in young babies because breast milk and standard infant formulas naturally contain high lactose to fuel brain development.',
    nextStep: 'Continue current feeding routine. Practice paced bottle feeding, keep baby upright for 20 minutes post-feed, and do gentle bicycle leg kicks.'
  };

  if (hasCMPASymptoms) {
    assessmentResult = {
      title: "Probable Cow's Milk Protein Allergy (CMPA)",
      badge: "CMPA / Milk Allergy (Immune Response)",
      badgeColor: "bg-red-100 text-red-800 border-red-300",
      summary: "Presence of blood/mucus in stool and/or eczema strongly points toward Cow's Milk Protein Allergy (CMPA) rather than lactose intolerance. CMPA is an immune reaction to the proteins (casein/whey) in cow's milk, affecting ~2–7% of babies.",
      nextStep: "Consult your pediatrician about transitioning to an Extensively Hydrolyzed Formula (e.g. Nutramigen / Alimentum) or maternal dairy elimination if breastfeeding."
    };
  } else if (hasSecondaryClue && lactoseCount >= 2) {
    assessmentResult = {
      title: 'Probable Secondary (Temporary) Lactose Intolerance',
      badge: 'Post-Viral Temporary Intolerance',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      summary: 'A recent stomach virus often temporarily strips the gut brush border of lactase enzymes. This causes temporary lactose malabsorption (frothy stools, gas) that resolves naturally in 1–2 weeks as intestinal lining heals.',
      nextStep: 'Offer gentle feeds. If formula-fed, discuss temporary lactose-free formula with your pediatrician for 10–14 days while the gut recovers.'
    };
  } else if (lactoseCount >= 3) {
    assessmentResult = {
      title: 'Moderate Dairy Sensitivity / Lactose Overload',
      badge: 'Dairy Sensitivity / Lactose Imbalance',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
      summary: 'Multiple symptoms of gut irritation post-feeding. In breastfed babies, this is often a "foremilk/hindmilk imbalance" (too much watery sugar-rich foremilk before rich hindmilk). In bottle-fed babies, it may indicate sensitivity to standard cow-milk formula.',
      nextStep: 'For nursing moms: ensure one breast is fully emptied before switching. For formula: discuss gentle or hydrolyzed options with pediatrician.'
    };
  }

  const handleAskDoctor = () => {
    if (!onAskDoctor) return;
    const symptomNames = selectedSymptoms.map(id => SYMPTOM_LIST.find(s => s.id === id)?.label).filter(Boolean).join(', ');
    const prompt = `My baby ${babyName} (${babyAgeMonths} months old) is showing these digestive symptoms: ${symptomNames || 'none selected'}. Can you evaluate whether this could be lactose intolerance, Cow's Milk Protein Allergy (CMPA), or normal infant gas, and explain the best remedies and formula/diet fixes?`;
    onAskDoctor(prompt);
  };

  return (
    <div 
      id="lactose-intolerance-card"
      className="bg-white rounded-[32px] border-2 border-[#E7DDD5] shadow-lg shadow-[#4A3F35]/5 p-6 sm:p-7 space-y-6 overflow-hidden relative animate-fadeIn"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E6DD]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] border-2 border-[#FED7AA] flex items-center justify-center text-[#EA580C] shadow-xs">
            <Milk className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                Lactose Intolerance & Dairy Sensitivity Guide
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]">
                Clinical Triage
              </span>
            </div>
            <p className="text-xs text-[#57534E]">
              Symptoms, CMPA vs. Lactose Intolerance distinction, and pediatrician-backed remedies
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-[#F5EFEB] p-1 rounded-2xl border border-[#E7DDD5] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('checker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'checker' 
                ? 'bg-white text-[#1C1917] shadow-xs' 
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            🩺 Symptom Checker
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('difference')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'difference' 
                ? 'bg-white text-[#1C1917] shadow-xs' 
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            ⚖️ Lactose vs CMPA
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('remedies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'remedies' 
                ? 'bg-white text-[#1C1917] shadow-xs' 
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            ✨ Remedies & Fixes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'formulas' 
                ? 'bg-white text-[#1C1917] shadow-xs' 
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            🍼 Formula Types
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE SYMPTOM CHECKER */}
      {activeTab === 'checker' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-[#57534E] tracking-wider">
              Check all symptoms currently affecting {babyName}:
            </span>
            <span className="text-xs font-bold text-[#EA580C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-[#FED7AA]">
              {selectedSymptoms.length} Selected
            </span>
          </div>

          {/* Symptom selection list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SYMPTOM_LIST.map((sym) => {
              const isChecked = selectedSymptoms.includes(sym.id);
              return (
                <button
                  type="button"
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 text-left cursor-pointer ${
                    isChecked
                      ? 'border-[#EA580C] bg-[#FFF7ED] shadow-xs ring-2 ring-[#EA580C]/20'
                      : 'border-[#E7DDD5] bg-[#FFFBF7] hover:bg-[#F5EFEB]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    isChecked ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-[#D6C7BC] bg-white'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1C1917]">{sym.label}</span>
                      {sym.isCMPAOnly && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-red-100 text-red-700 rounded-md">
                          CMPA Clue
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                      {sym.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Assessment Output Card with Prominent, Large Recommended Action */}
          <div className={`p-5 rounded-3xl border-2 space-y-4 transition-all ${
            hasCMPASymptoms ? 'bg-red-50/95 border-red-300 text-red-950' : 'bg-[#FFFBF7] border-[#FED7AA] text-[#44403C]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-black/10">
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C1917] flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#EA580C]" />
                {assessmentResult.title}
              </h4>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border self-start sm:self-auto ${assessmentResult.badgeColor}`}>
                {assessmentResult.badge}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#292524] leading-relaxed font-normal">
              {assessmentResult.summary}
            </p>

            {/* HIGH-VISIBILITY LARGE RECOMMENDED ACTIONS BLOCK */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#EA580C]/40 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#EA580C] font-extrabold text-sm sm:text-base uppercase tracking-wider">
                <span className="text-lg">💡</span>
                <span>Recommended Action & Next Steps:</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-[#1C1917] leading-relaxed">
                {assessmentResult.nextStep}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LACTOSE INTOLERANCE VS CMPA COMPARISON */}
      {activeTab === 'difference' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] text-sm text-[#292524] leading-relaxed">
            <strong className="text-[#1C1917] font-bold">Crucial Pediatric Distinction:</strong> Parents often confuse <em>Lactose Intolerance</em> with <em>Cow's Milk Protein Allergy (CMPA)</em>. They are completely different biological conditions requiring different solutions.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Lactose Intolerance Column */}
            <div className="p-5 rounded-2xl bg-[#FFF7ED] border-2 border-[#FED7AA] space-y-3">
              <div className="flex items-center justify-between border-b border-[#FDBA74] pb-2.5">
                <h4 className="font-serif font-bold text-base text-[#9A3412] flex items-center gap-2">
                  <Milk className="w-5 h-5" /> Lactose Intolerance
                </h4>
                <span className="px-2.5 py-1 rounded-md text-xs font-black bg-amber-100 text-amber-800">
                  Enzyme Deficiency
                </span>
              </div>
              <p className="text-[#431407] text-sm leading-relaxed">
                <strong>What it is:</strong> Inability to digest <strong>lactose (milk sugar)</strong> due to insufficient lactase enzyme in the small intestine.
              </p>
              <ul className="space-y-1.5 text-[#7C2D12] text-sm list-disc list-inside leading-relaxed">
                <li>Rare in infants under 2 years (except after a stomach virus).</li>
                <li>Digestive symptoms only (gas, frothy acidic diarrhea, cramps).</li>
                <li><strong>No hives, eczema, or blood in stool.</strong></li>
                <li>Lactose is vital for infant brain & gut development.</li>
              </ul>
              <div className="p-3.5 rounded-xl bg-white border-2 border-[#FED7AA] space-y-1">
                <span className="text-xs font-extrabold uppercase text-[#EA580C] block">💡 Recommended Action:</span>
                <p className="text-sm font-semibold text-[#1C1917] leading-relaxed">
                  Lactose-free formula or lactase drops (usually temporary post-illness). Never eliminate dairy without pediatric advice.
                </p>
              </div>
            </div>

            {/* CMPA Column */}
            <div className="p-5 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECACA] space-y-3">
              <div className="flex items-center justify-between border-b border-[#FCA5A5] pb-2.5">
                <h4 className="font-serif font-bold text-base text-[#991B1B] flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Cow's Milk Protein Allergy
                </h4>
                <span className="px-2.5 py-1 rounded-md text-xs font-black bg-red-100 text-red-800">
                  Immune Reaction
                </span>
              </div>
              <p className="text-[#450A0A] text-sm leading-relaxed">
                <strong>What it is:</strong> Baby's immune system mistakenly attacks the <strong>proteins (casein & whey)</strong> in cow's milk.
              </p>
              <ul className="space-y-1.5 text-[#7F1D1D] text-sm list-disc list-inside leading-relaxed">
                <li>Affects ~2–7% of babies in their first year of life.</li>
                <li>Causes <strong>blood/mucus streaks in stool</strong>, severe reflux, crying.</li>
                <li>Skin signs: <strong>eczema, hives, swollen lips/eyes</strong>.</li>
                <li>Respiratory signs: wheezing or chronic nasal congestion.</li>
              </ul>
              <div className="p-3.5 rounded-xl bg-white border-2 border-[#FECACA] space-y-1">
                <span className="text-xs font-extrabold uppercase text-[#DC2626] block">💡 Recommended Action:</span>
                <p className="text-sm font-semibold text-[#1C1917] leading-relaxed">
                  Switch to an Extensively Hydrolyzed Formula (broken protein chains) or maternal dairy elimination if nursing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PEDIATRIC REMEDIES & HOME FIXES */}
      {activeTab === 'remedies' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Remedy 1: Breastfeeding Guidance */}
            <div className="p-5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-black text-sm">1</span>
                <h5 className="font-bold text-base text-[#1C1917]">Breastfeeding Solutions</h5>
              </div>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>Fix Foremilk/Hindmilk Imbalance:</strong> Ensure baby drains one breast completely before switching. Foremilk is sugar-heavy and can cause gassy frothy stools; fatty hindmilk aids digestion.
              </p>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>2-Week Maternal Dairy Elimination:</strong> Cut milk, cheese, butter, and whey for 14 days to observe if fussiness and stool improve.
              </p>
            </div>

            {/* Remedy 2: Formula Adjustments */}
            <div className="p-5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm">2</span>
                <h5 className="font-bold text-base text-[#1C1917]">Formula Adjustments</h5>
              </div>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>Hydrolyzed vs. Lactose-Free:</strong> Always consult pediatrician before switching. True CMPA requires <em>Extensively Hydrolyzed Formula</em> (broken protein chains), not just lactose-free formula.
              </p>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>Exact Water Ratios:</strong> Never over-concentrate or dilute formula; improper mixing exacerbates intestinal osmolarity and diarrhea.
              </p>
            </div>

            {/* Remedy 3: Tummy Comfort */}
            <div className="p-5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">3</span>
                <h5 className="font-bold text-base text-[#1C1917]">Tummy & Gas Relief</h5>
              </div>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>Clockwise Massage & Bicycles:</strong> Gently massage tummy in clockwise circles (following colon path) and do bicycle leg pumps to release trapped gas pockets.
              </p>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>20-Minute Upright Hold:</strong> Keep baby upright against your shoulder after feeds to ease gastric pressure.
              </p>
            </div>

            {/* Remedy 4: Acidic Diaper Rash Protection */}
            <div className="p-5 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">4</span>
                <h5 className="font-bold text-base text-[#1C1917]">Diaper Rash Shield</h5>
              </div>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>40% Zinc Oxide Barrier:</strong> Acidic diarrhea quickly burns delicate infant skin. Apply a thick layer like cake frosting at every diaper change.
              </p>
              <p className="text-[#292524] text-sm sm:text-base leading-relaxed">
                <strong>Water Wipe Cleansing:</strong> Use warm water and soft cotton cloths rather than alcohol/fragrance wipes during active diarrhea flare-ups.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INFANT FORMULA MATRIX */}
      {activeTab === 'formulas' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800">
                1. Standard Cow's Milk
              </span>
              <h5 className="font-bold text-sm text-[#1C1917]">Standard Formula (e.g. Enfamil, Similac)</h5>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Contains intact cow milk proteins (casein/whey) and full lactose. Optimal for 90%+ of infants with healthy digestion.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF7ED] border-2 border-[#FED7AA] space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">
                2. Extensively Hydrolyzed
              </span>
              <h5 className="font-bold text-sm text-[#1C1917]">Hypoallergenic (e.g. Nutramigen, Alimentum)</h5>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Proteins are broken down into tiny peptides that the immune system does not recognize. **First-line choice for CMPA and severe milk allergy.**
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FEF2F2] border-2 border-[#FECACA] space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-800">
                3. Amino Acid Based
              </span>
              <h5 className="font-bold text-sm text-[#1C1917]">Elemental (e.g. Neocate, EleCare)</h5>
              <p className="text-xs text-[#57534E] leading-relaxed">
                100% free amino acids. Reserved for severe multi-food allergies, failure to thrive, or when hydrolyzed formulas fail.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Action Trigger to AI Doctor */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFBF7] border-2 border-[#E7DDD5] text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#EA580C] shrink-0" />
          <span className="text-[#57534E] text-xs sm:text-sm">
            Selected: <strong className="text-[#1C1917]">{selectedSymptoms.length} symptoms</strong> for {babyName}
          </span>
        </div>

        {showAskButton && onAskDoctor && (
          <button
            type="button"
            onClick={handleAskDoctor}
            className="px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#EA580C]/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Ask AI Doctor to Evaluate Lactose & Dairy Symptoms</span>
          </button>
        )}
      </div>
    </div>
  );
};
