import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Activity, 
  Milk, 
  Apple, 
  Clock, 
  ChefHat, 
  ShieldAlert, 
  Stethoscope,
  ChevronRight,
  Info
} from 'lucide-react';

interface UndigestedFoodAndSourMilkCardProps {
  onAskDoctor?: (question: string) => void;
  babyName?: string;
  babyAgeMonths?: number;
  initialTab?: 'undigested_food' | 'sour_milk';
}

interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  whyItAppears: string;
  howToPrep: string;
  safetyNote: string;
}

const COMMON_UNDIGESTED_FOODS: FoodItem[] = [
  {
    id: 'carrots',
    name: 'Carrots & Squash',
    emoji: '🥕',
    category: 'Root Vegetables',
    whyItAppears: 'Dense fiber with beta-carotene pigment. Rapid infant gut transit (4–8 hrs) means orange chunks exit before cellular breakdown.',
    howToPrep: 'Steam or roast until buttery soft (squishable between thumb and pointer finger). For early solids, mash with a fork or grate finely.',
    safetyNote: 'Harmless and normal. Stool may also turn bright orange-yellow.'
  },
  {
    id: 'corn',
    name: 'Corn Kernels',
    emoji: '🌽',
    category: 'Grains & Seeds',
    whyItAppears: 'Outer hull is made of cellulose fiber which resists human stomach acid. Because babies lack molars to grind kernels, they swallow them whole.',
    howToPrep: 'Puree into smooth corn chowder or wait until toddler years (12+ months) when grinding chewing develops.',
    safetyNote: 'Completely expected in both babies and adults!'
  },
  {
    id: 'peas',
    name: 'Peas & Edamame',
    emoji: '🫛',
    category: 'Legumes',
    whyItAppears: 'Fibrous waxy outer skin protects the inner pea starch from digestive enzymes like amylase.',
    howToPrep: 'Gently pinch or flatten each pea between fingers before serving to break the skin and eliminate choking risk.',
    safetyNote: 'Flattening helps both digestion and safe airway passage.'
  },
  {
    id: 'banana',
    name: 'Banana Seeds & Threads',
    emoji: '🍌',
    category: 'Fruits',
    whyItAppears: 'Microscopic banana fiber tubes and core seeds oxidize in stomach acid, turning into tiny black thread-like specks that look like "tiny worms" or poppy seeds.',
    howToPrep: 'Ripe bananas with brown spots are easiest to digest. Mash with a fork or serve in soft spears.',
    safetyNote: '100% normal. Parents frequently confuse oxidized banana fibers for parasites!'
  },
  {
    id: 'blueberries',
    name: 'Blueberries & Berries',
    emoji: '🫐',
    category: 'Fruits & Berries',
    whyItAppears: 'Tough fruit skins and tiny seeds resist gastric acid. Stool may turn dark purple or blackish.',
    howToPrep: 'Flatten, quarter, or gently mash blueberries before serving to infants under 12 months.',
    safetyNote: 'Quartering prevents airway choking and helps digestion.'
  },
  {
    id: 'raisins',
    name: 'Raisins & Dried Fruit',
    emoji: '🍇',
    category: 'Dried Fruit',
    whyItAppears: 'Concentrated tough skins and high fructose move quickly through the digestive tract.',
    howToPrep: 'Soak in warm water to rehydrate, then finely dice or puree. Avoid whole dry raisins under 12m due to choking hazard.',
    safetyNote: 'Whole raisins are a choking risk for young babies; always soak or chop.'
  },
  {
    id: 'greens',
    name: 'Spinach & Kale Specks',
    emoji: '🥬',
    category: 'Leafy Greens',
    whyItAppears: 'High insoluble cellulose passes without breaking down, creating dark green or black flakes in diaper.',
    howToPrep: 'Finely mince and steam into soft omelets, purees, or mix with oatmeal.',
    safetyNote: 'Normal green flecks; rich in iron and vitamins.'
  }
];

export const UndigestedFoodAndSourMilkCard: React.FC<UndigestedFoodAndSourMilkCardProps> = ({
  onAskDoctor,
  babyName = 'your baby',
  babyAgeMonths = 5,
  initialTab = 'undigested_food'
}) => {
  const [activeTab, setActiveTab] = useState<'undigested_food' | 'sour_milk'>(initialTab);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('carrots');
  const [spitUpMinutes, setSpitUpMinutes] = useState<number>(30);

  const currentFood = COMMON_UNDIGESTED_FOODS.find(f => f.id === selectedFoodId) || COMMON_UNDIGESTED_FOODS[0];

  const handleAskAIDoctor = (topic: 'food' | 'sour_milk') => {
    if (!onAskDoctor) return;
    if (topic === 'food') {
      onAskDoctor(`My baby ${babyName} (${babyAgeMonths} months old) has undigested pieces of ${currentFood.name} in their poop. What is the clinical cause, what should I check in their diaper, and how should I prepare their food so it is easier to digest?`);
    } else {
      onAskDoctor(`My baby ${babyName} (${babyAgeMonths} months old) is spitting up / throwing up sour-smelling curdled milk ${spitUpMinutes} minutes after feeds. Why does this happen, how do I know if it's normal reflux vs GERD, and what step-by-step protocol should I follow to fix it?`);
    }
  };

  return (
    <div 
      id="undigested-food-sour-milk-card"
      className="bg-white/95 rounded-[32px] border-2 border-[#E7DDD5] shadow-lg shadow-[#4A3F35]/5 p-6 sm:p-7 space-y-6 overflow-hidden relative"
    >
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E6DD]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] border-2 border-[#FED7AA] flex items-center justify-center text-2xl shadow-xs">
            {activeTab === 'undigested_food' ? '🥕' : '🍼'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917]">
                {activeTab === 'undigested_food' 
                  ? 'Undigested Food in Poop Guide' 
                  : 'Sour Milk Throwing Up & Spit-Up Guide'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                AAP Clinical Guide
              </span>
            </div>
            <p className="text-xs text-[#57534E]">
              Causes, what to do, how to fix, and pediatrician red flags for new parents
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-[#F5EFEB] p-1 rounded-2xl border border-[#E7DDD5]">
          <button
            type="button"
            onClick={() => setActiveTab('undigested_food')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'undigested_food'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <span>🥕 Undigested Food</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sour_milk')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sour_milk'
                ? 'bg-white text-[#1C1917] shadow-xs'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <span>🍼 Sour Milk Spit-Up</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: UNDIGESTED FOOD IN POOP */}
      {/* ======================================================== */}
      {activeTab === 'undigested_food' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Section 1: The Causes (Why it happens) */}
          <div className="bg-[#FFFBF7] rounded-2xl border-2 border-[#E7DDD5] p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#C2410C]">
              <Info className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                🔬 1. The Causes: Why Does Food Come Out Whole?
              </h4>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#44403C]">
              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">⚡ Rapid Infant Gut Transit:</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  Infant digestion takes only <strong>4–8 hours</strong> (compared to 24–48 hours in adults). Food travels quickly before enzymes break tough cell walls.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">🦷 No Molar Teeth for Chewing:</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  Babies only have front incisors (or gums). They swallow soft chunks without grinding, so pieces pass intact.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">🧪 Developing Digestive Enzymes:</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  Infants produce lower levels of salivary and pancreatic <strong>amylase and cellulase</strong>, which are needed to break down plant starches.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">🌽 Insoluble Plant Cellulose Skins:</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  Corn kernels, pea skins, blueberries, and seeds have cellulose walls that resist human gastric acid completely.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Food Item Inspector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-[#1C1917] tracking-wider">
                🥦 Click Common Food Items to Inspect:
              </span>
              <span className="text-[11px] font-bold text-[#EA580C]">
                {currentFood.name} Selected
              </span>
            </div>

            {/* Food pill selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {COMMON_UNDIGESTED_FOODS.map((food) => {
                const isSelected = food.id === selectedFoodId;
                return (
                  <button
                    type="button"
                    key={food.id}
                    onClick={() => setSelectedFoodId(food.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#EA580C] text-white shadow-xs scale-102 ring-2 ring-[#EA580C]/20'
                        : 'bg-[#FFFBF7] text-[#57534E] border border-[#E7DDD5] hover:bg-[#F5EFEB]'
                    }`}
                  >
                    <span>{food.emoji}</span>
                    <span>{food.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Food Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF7ED] border-2 border-[#FED7AA] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentFood.emoji}</span>
                  <div>
                    <h5 className="font-bold text-sm text-[#9A3412]">{currentFood.name}</h5>
                    <span className="text-[10px] font-extrabold text-[#C2410C] bg-white px-2 py-0.5 rounded-md border border-[#FDBA74]">
                      {currentFood.category}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                  ✓ 100% Normal & Safe
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#431407]">
                <div>
                  <strong className="text-[#9A3412]">Why it shows up whole:</strong> {currentFood.whyItAppears}
                </div>
                <div>
                  <strong className="text-[#9A3412]">How to prepare for baby:</strong> {currentFood.howToPrep}
                </div>
                <div className="p-2.5 bg-white/80 rounded-xl border border-[#FED7AA] text-[11px] text-[#7C2D12]">
                  💡 <strong>Pediatric Note:</strong> {currentFood.safetyNote}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: What to Do (Parent Clinical Checklist) */}
          <div className="bg-[#F0FDF4] rounded-2xl border-2 border-[#BBF7D0] p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-[#166534]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                📋 2. What to Do: Parent Clinical Checklist
              </h4>
            </div>
            
            <ul className="space-y-1.5 text-xs text-[#14532D]">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#15803D]">1.</span>
                <span><strong>Celebrate the milestone:</strong> Finding food in the diaper means {babyName} is practicing oral motor skills and exploring new textures!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#15803D]">2.</span>
                <span><strong>Assess stool consistency:</strong> Check that the surrounding stool is soft, pasty, or gently formed (normal) rather than watery diarrhea.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#15803D]">3.</span>
                <span><strong>Monitor wet diapers:</strong> Ensure {babyName} is producing at least <strong>5–6 wet diapers every 24 hours</strong> with steady weight gain.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#15803D]">4.</span>
                <span><strong>Confirm no red flags:</strong> Verify there is no bright red blood, black tarry stools, or fever.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: How to Fix for New Parents (Kitchen & Feeding Protocol) */}
          <div className="bg-white rounded-2xl border-2 border-[#E7DDD5] p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#1C1917]">
              <ChefHat className="w-4 h-4 text-[#EA580C]" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                🛠️ 3. How to Fix It (Parent Kitchen & Feeding Protocol)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#44403C]">
              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">1. The "Squish Test" Cooking Rule:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Steam or roast carrots, apples, squash, and broccoli until you can easily mash them flat between your thumb and index finger.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">2. Pinch & Flatten Skins:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Flatten peas, chickpeas, and blueberries before serving to rupture outer cellulose skins and prevent airway choking.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">3. Model Chewing at Meals:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Eat meals together and exaggerate your mouth chewing motions. Babies learn mastication and tongue control by copying parents!
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">4. Water Sips With Meals (6m+):</strong>
                <p className="text-[11px] text-[#57534E]">
                  Offer 1–2 ounces of water in an open or straw cup during solid food meals to aid digestive lubrication and transit.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Red Flags & Doctor Call */}
          <div className="bg-[#FEF2F2] rounded-2xl border-2 border-[#FECDD3] p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#991B1B]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <h5 className="text-xs font-bold">🚨 When to Call the Pediatrician (Red Flags):</h5>
            </div>
            <p className="text-xs text-[#7F1D1D] leading-relaxed">
              Contact your doctor if food pieces are accompanied by <strong>watery diarrhea lasting &gt;24–48 hours</strong>, blood or mucus streaks, abdominal pain/swelling, failure to gain weight, or rectal fever ≥100.4°F (38.0°C).
            </p>
          </div>

          {/* Ask AI Doctor CTA */}
          <button
            type="button"
            onClick={() => handleAskAIDoctor('food')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs shadow-md shadow-[#EA580C]/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-orange-200" />
            <span>Ask AI Doctor About {currentFood.name} in Baby's Poop</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BABY THROWS UP SOUR MILK / SPIT-UP */}
      {/* ======================================================== */}
      {activeTab === 'sour_milk' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Section 1: The Causes (Why it smells sour and curdles) */}
          <div className="bg-[#FFFBF7] rounded-2xl border-2 border-[#E7DDD5] p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#C2410C]">
              <Info className="w-4 h-4 shrink-0" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                🔬 1. The Causes: Why Does Spat-Up Milk Turn Sour & Curdled?
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#44403C]">
              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">🧪 Stomach Acid + Protein Coagulation:</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  In the stomach, <strong>hydrochloric acid and pepsin</strong> curdle milk proteins (casein & whey) into white clumps with a sour yogurt/vinegar scent. This proves digestion has started!
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">👶 Immature Lower Esophageal Valve:</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  The muscular sphincter at the top of the stomach is still loose in babies under 12 months, allowing stomach contents to splash upward.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">💨 Swallowed Air Bubbles (Aerophagia):</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  Gulping milk quickly traps air beneath the milk pool. When that bubble rises as a burp, it launches curdled sour milk upward like a geyser.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">🍼 Overfilling Tiny Stomach:</strong>
                <p className="text-[11px] leading-relaxed text-[#57534E]">
                  A young infant's stomach is only the size of a golf ball. Excess ounces spill over the loose valve when the stomach contracts.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Spit-Up Timing & Texture Slider */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF7ED] border-2 border-[#FED7AA] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#EA580C]" />
                <span className="text-xs font-bold text-[#1C1917]">Time Elapsed Since Feed:</span>
              </div>
              <span className="font-serif text-sm font-bold text-[#EA580C] px-2.5 py-0.5 rounded-lg bg-orange-100 border border-orange-200">
                {spitUpMinutes} Minutes Post-Feed
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={spitUpMinutes}
              onChange={(e) => setSpitUpMinutes(parseInt(e.target.value, 10))}
              className="w-full accent-[#EA580C] cursor-pointer"
            />

            <div className="p-3 bg-white/90 rounded-xl border border-[#FED7AA] text-xs text-[#7C2D12] space-y-1">
              <strong className="block text-[#9A3412]">
                {spitUpMinutes <= 15 
                  ? "🥛 0–15 Minutes: Fresh Sweet Milk" 
                  : spitUpMinutes <= 60 
                  ? "🥣 15–60 Minutes: Thick Curdled Clumps & Sour Scent" 
                  : "💧 60+ Minutes: Clear Watery Acid with White Specks"}
              </strong>
              <p className="text-[11px] leading-relaxed text-[#57534E]">
                {spitUpMinutes <= 15
                  ? "Liquid milk spit-up right after feeds hasn't had time to mix with stomach acid. Smells like fresh milk or formula."
                  : spitUpMinutes <= 60
                  ? "Peak acid breakdown! Casein proteins have curdled into white cottage-cheese lumps with a distinct sour vinegar/yogurt smell. Completely normal physiological digestion."
                  : "Stomach is finishing emptying into the small intestine. Spat-up fluid is mostly clear gastric liquid with minor milk specks."}
              </p>
            </div>
          </div>

          {/* Section 3: Diagnostic Triage Matrix (Happy Spitter vs GERD vs Pyloric Stenosis) */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase text-[#1C1917] block">
              ⚖️ Diagnostic Matrix: What Does Baby's Spit-Up Mean?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] space-y-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#059669] text-white inline-block">
                  ✓ 90% Happy Spitter
                </span>
                <p className="text-[11px] text-[#065F46] font-medium leading-relaxed pt-1">
                  Baby smiles, wiggles, gains weight, and wets 5–6+ diapers/day. Spitting up causes zero pain or distress.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] space-y-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#D97706] text-white inline-block">
                  ⚠️ GERD / Acid Reflux
                </span>
                <p className="text-[11px] text-[#92400E] font-medium leading-relaxed pt-1">
                  Baby arches back in pain, screams during/after bottles, coughs when lying flat, or refuses feedings.
                </p>
              </div>

              <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FECDD3] space-y-1">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#DC2626] text-white inline-block">
                  🚨 Projectile / Pyloric
                </span>
                <p className="text-[11px] text-[#991B1B] font-medium leading-relaxed pt-1">
                  Forceful vomiting shooting feet across room, green bile, blood specks, or weight loss. Immediate doctor needed.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: How to Fix for New Parents (6-Step Protocol) */}
          <div className="bg-white rounded-2xl border-2 border-[#E7DDD5] p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#1C1917]">
              <Stethoscope className="w-4 h-4 text-[#EA580C]" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                🛠️ 3. How to Fix It (6-Step Pediatric Action Plan)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#44403C]">
              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">1. 20–30 Minute Upright Rule:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Hold {babyName} upright on your chest or lap for 20–30 minutes after feeds. Gravity keeps the milk down while the stomach empties.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">2. Paced Bottle Feeding:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Hold bottle horizontal and use a slow-flow nipple so {babyName} drinks gently over 15–20 minutes instead of gulping air in 5 minutes.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">3. Burp Halfway Through:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Burp every 2–3 ounces (or between breasts) to vent small gas bubbles before they launch sour milk upward.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">4. Smaller, More Frequent Feeds:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Reduce bottle size by 0.5–1 oz and feed slightly more often to avoid overstretching the stomach wall.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">5. Loosen Diapers & Postpone Tummy Time:</strong>
                <p className="text-[11px] text-[#57534E]">
                  Avoid belly pressure. Wait 45–60 minutes post-feed before active tummy time or bouncy seat play.
                </p>
              </div>

              <div className="p-3 bg-[#FFFBF7] rounded-xl border border-[#E7DDD5] space-y-1">
                <strong className="text-[#1C1917] block font-bold">6. Formula Review (If Painful):</strong>
                <p className="text-[11px] text-[#57534E]">
                  If paired with fussiness or eczema, ask pediatrician about extensively hydrolyzed formula (Nutramigen, Alimentum) or anti-reflux formula.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Red Flags */}
          <div className="bg-[#FEF2F2] rounded-2xl border-2 border-[#FECDD3] p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#991B1B]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <h5 className="text-xs font-bold">🚨 Emergency Red Flags:</h5>
            </div>
            <p className="text-xs text-[#7F1D1D] leading-relaxed">
              Seek prompt pediatric or ER care if you notice: <strong>forceful projectile vomiting</strong> across the room, dark green or bright yellow bile, blood specks/brown coffee-grounds, fewer than 4 wet diapers/24h, or fever.
            </p>
          </div>

          {/* Ask AI Doctor CTA */}
          <button
            type="button"
            onClick={() => handleAskAIDoctor('sour_milk')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs shadow-md shadow-[#EA580C]/25 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-orange-200" />
            <span>Ask AI Doctor About Sour Milk Spit-Up & Reflux</span>
          </button>
        </div>
      )}
    </div>
  );
};
