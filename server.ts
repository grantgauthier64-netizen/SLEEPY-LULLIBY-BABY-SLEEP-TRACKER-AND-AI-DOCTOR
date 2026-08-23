import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Intelligent Evidence-Based Pediatric Knowledge Engine Fallback
 * Used if Gemini API is unreachable, has temporary network lag, or rate-limited.
 */
function getPediatricFallbackAdvice(query: string, babyProfile: any): string {
  const q = (query || '').toLowerCase();
  const name = babyProfile?.name || 'your baby';
  const age = babyProfile?.ageMonths !== undefined ? babyProfile.ageMonths : 5;

  // 1. Curdled Milk / Formula Spit-Up & Reflux
  if (
    q.includes('curd') || 
    q.includes('spit up') || 
    q.includes('spit-up') || 
    q.includes('spitting up') || 
    q.includes('cottage cheese') || 
    q.includes('chunky') || 
    q.includes('throw up') || 
    q.includes('vomit') || 
    q.includes('reflux') ||
    (q.includes('formula') && (q.includes('spit') || q.includes('curd') || q.includes('puke') || q.includes('sour')))
  ) {
    return `### 🍼 Why Does Baby Spit Up Curd-Like / Cottage-Cheese Stuff After Formula? (Pediatric Explanation)

Dear Parent, seeing curd-like, chunky, or cottage-cheese-textured spit-up after a formula or milk bottle is **one of the most common parent concerns**, but in the vast majority of cases, it is **100% normal and harmless**! Here is the clinical pediatric breakdown of what is happening inside ${name}'s tummy:

---

### 🔬 1. The Science: Why Formula Turns Into "Curdled Cheese"
- **Mixing with Stomach Acid:** When formula enters ${name}'s stomach, it immediately mixes with natural gastric juices (hydrochloric acid and digestive enzymes like pepsin).
- **Protein Coagulation:** The acidic environment causes the milk proteins (**casein and whey**) to curdle and clump into white, cottage-cheese-like curds. This is the **normal first step of digestion**!
- **The Timing Clue:**
  - **Spit-up immediately after feed (<5 mins):** Looks like smooth, liquid formula (hasn't mixed with stomach acid yet).
  - **Spit-up 15–60 minutes after feed:** Looks like **thick, curdled milk, cottage cheese lumps, or watery clear liquid with white clumps** with a slightly sour smell. This simply proves ${name}'s stomach acid is working properly to digest the formula.

---

### 👶 2. Why Does It Come Back Up? (Immature LES Valve)
At ${age} months old, ${name}'s **Lower Esophageal Sphincter (LES)**—the tiny muscular ring between the esophagus and the stomach—is still developing and acts like a loose valve.
- When baby burps, wiggles, sits in a car seat, gets their tummy pressed during a diaper change, or drinks too quickly, the curdled stomach contents easily splash back up the esophagus.
- If ${name} is alert, smiling, gaining weight, and doesn't cry in pain when spitting up, pediatricians call them a **"Happy Spitter"** (physiologic infant reflux).

---

### 🛠️ 3. Proven Pediatric Steps to Reduce Curdled Spit-Up:
1. **The 20–30 Minute Upright Rule:** Hold ${name} upright on your chest or lap for 20–30 minutes after every bottle. Gravity keeps the milk down while the stomach empties into the small intestine.
2. **Paced Bottle Feeding & Slow-Flow Nipples:** Keep the bottle semi-horizontal so ${name} drinks over 15–20 minutes rather than gulping air.
3. **Burp Halfway Through:** Burp ${name} every 2–3 ounces (or between breasts) to release trapped air bubbles before they push digested milk back up.
4. **Avoid Tight Diapers & Pressure on the Belly:** Loosen diaper waistbands slightly and avoid vigorous tummy time or bouncing immediately after a feed.
5. **Smaller, More Frequent Feeds:** If ${name}'s stomach is overstretched, reducing bottle size by 0.5–1 oz and feeding slightly more often can relieve excess pressure.

---

### 🚨 4. When to Call the Pediatrician (Red Flag Warning Signs):
Contact your doctor or seek prompt pediatric care if you notice:
- **Projective Vomiting:** Shooting forcefully across the room after every feed (can indicate *pyloric stenosis*).
- **Green or Yellow Bile:** Spit-up or vomit that is bright green or dark yellow/bile-colored.
- **Blood:** Streaks of red blood or dark brown "coffee-ground" specks.
- **Pain & Arching:** Crying in distress, arching their back in pain during or after feeds, or refusing bottles (may indicate GERD or cow's milk protein sensitivity).
- **Weight Loss or Poor Growth:** Dropping percentiles on growth curves or producing fewer than 5–6 wet diapers daily.

*💡 Bottom line: If ${name} is cheerful, wetting regular diapers, and growing steadily, curdled spit-up is just normal digestion taking its course!*`;
  }

  // 2. Baby Poop Colors & Stool Texture Interpretation (Diarrhea, Runny, Pasty, Soft, Firm)
  if (
    q.includes('poop') || 
    q.includes('stool') || 
    q.includes('bowel') || 
    q.includes('diarrhea') ||
    q.includes('pasty') ||
    q.includes('runny') ||
    q.includes('firm') ||
    q.includes('constipat') ||
    (q.includes('diaper') && (q.includes('color') || q.includes('green') || q.includes('yellow') || q.includes('black') || q.includes('red') || q.includes('white') || q.includes('brown') || q.includes('mucus') || q.includes('texture'))) ||
    q.includes('poo')
  ) {
    return `### 🎨 Complete Pediatric Baby Poop Color & Texture Diagnostic Guide

Baby poop changes color, texture, and frequency as their digestive system matures! Here is the comprehensive clinical breakdown of **both colors and textures (Diarrhea, Runny, Pasty, Soft, Firm)** for ${name} (${age} months old):

---

### 🥣 Part 1: Stool Texture & Consistency Decoder

| Texture Type | What It Looks Like | What It Means | Pediatric Action |
| :--- | :--- | :--- | :--- |
| 💧🌊 **Diarrhea** | Very liquid, explosive, watery ring soaking completely into diaper padding. | Viral bug (rotavirus/norovirus), food intolerance, antibiotic reaction. | **Hydration priority!** Count wet diapers (must have ≥ 5–6/day). Keep feeding breast milk/formula. Call doctor if >24–48h or with fever. |
| 🍯✨ **Runny / Seedy** | Loose, liquid with tiny white/yellow curds of digested milk fat. | **Classic breastfed baby stool!** Has a sweet yogurt-like scent. | ✅ **100% Healthy & Normal.** No intervention needed as long as baby is gaining weight. |
| 🥣🥜 **Pasty / Creamy** | Smooth paste like hummus or peanut butter; holds form slightly. | **Gold standard for formula-fed infants** and smooth puree starters. | ✅ **100% Healthy & Normal.** Indicates optimal digestion and hydration. |
| 🪵👶 **Soft Formed** | Soft pliable log, squeezable, passes easily without painful straining. | Expected once baby eats solid finger foods, purees, and oatmeal. | ✅ **100% Healthy & Normal.** Healthy solid transition. |
| 🪨⚠️ **Firm / Hard Pellets** | Dry marbles, hard compact balls, painful straining or crying. | **Infant Constipation.** Insufficient fluids, formula mixing error, or solid transition. | Offer "P" fruits (pears, prunes, peaches) and water sips (if >6m). Check exact formula water ratio. Never dilute formula. |

---

### 🟢 Part 2: Baby Stool Colors:

| Color | Clinical Meaning | Normal? |
| :--- | :--- | :--- |
| 🟡 **Mustard Yellow / Golden** | **Classic breastfed baby poop.** Usually soft, runny, with little white seed-like curds. | ✅ **Completely Normal** |
| 🟤 **Tan / Yellow-Brown** | **Classic formula-fed baby poop.** Pasty consistency, more formed, mild scent. | ✅ **Completely Normal** |
| 🟢 **Green (Forest, Army, or Dark Green)** | **Extremely common!** Iron in formula/vitamins or rapid transit before bile oxidizes. | ✅ **Completely Normal** |
| 🟠 **Orange / Peach** | Caused by natural liver bile transit or purees (carrots/squash/sweet potatoes). | ✅ **Completely Normal** |
| 🟫 **Dark Brown** | Typical once baby eats solid purees, meats, and cereal around 6 months. | ✅ **Completely Normal** |
| 🔴 **Red (Blood Streaks)** | Cow's milk protein allergy (CMPA), anal fissure from hard constipation, or infection. | ⚠️ **Call Pediatrician (Photo Diaper)** |
| ⚪ **White / Chalky Pale / Gray** | **Achollic stool** indicating lack of liver bile (biliary atresia / blocked bile duct). | 🚨 **Emergency: Immediate ER/Doctor** |
| ⚫ **Black / Tarry (Melena)** | Normal newborn meconium (days 1–4). After day 5, signals upper GI bleeding (unless on iron drops). | 🚨 **Prompt Pediatric Evaluation** |

---

### 📋 Checklist for ${name} (${age} Months):
- **Healthy Daily Rhythm:** 1–5 soft stools per day for formula/breastfed infants, or once every 2–4 days as long as the stool is soft, painless, and pasty.
- **Hydration Check:** Ensure ${name} produces **at least 5–6 wet diapers per 24 hours**.

*💡 Pro-Tip: You can always take a photo of an unusual diaper to show your pediatrician at your next visit or message portal!*`;
  }

  // 3. Lactose Intolerance vs Cow's Milk Protein Allergy (CMPA) & Remedies
  if (
    q.includes('lactose') || 
    q.includes('intoleran') || 
    q.includes('dairy') || 
    q.includes('cmpa') || 
    q.includes('cow milk protein') || 
    q.includes('milk allergy') || 
    q.includes('nutramigen') || 
    q.includes('alimentum') || 
    q.includes('hydrolyzed') || 
    q.includes('casein') || 
    q.includes('whey') || 
    q.includes('soy formula')
  ) {
    return `### 🥛 Lactose Intolerance vs. Milk Allergy (CMPA) & Pediatric Remedies for ${name} (${age} Months)

It is very common for parents to suspect dairy sensitivity when baby is fussy, gassy, or having explosive diapers. Here is the clinical pediatric breakdown of symptoms, differences, and how to fix them:

---

### ⚖️ 1. Lactose Intolerance vs. Cow's Milk Protein Allergy (CMPA)

| Factor | 🥛 Lactose Intolerance | 🚨 Cow's Milk Protein Allergy (CMPA) |
| :--- | :--- | :--- |
| **Biological Root** | **Enzyme Deficiency:** Shortage of *lactase* enzyme to digest lactose (milk sugar). | **Immune Response:** Immune system attacks proteins (*casein & whey*) in cow's milk. |
| **Prevalence in Babies** | **Very rare in infants under 2 years** (lactose is the main fuel in breast milk/formula). | **Common (2–7% of infants)** in their first year of life. |
| **Stool Characteristics** | **Frothy, watery, acidic/sour diarrhea** that burns skin ("ring of fire" diaper rash). | **Mucusy stool, blood flecks/streaks**, diarrhea or severe constipation. |
| **Skin & Respiratory** | ❌ No skin hives, no eczema, no wheezing. | ✅ **Eczema patches, facial hives, swollen eyes/lips, wheezing, chronic congestion.** |
| **Usual Onset** | Often **Secondary (Temporary)** after a viral stomach bug strips the gut lining for 1–2 weeks. | Emerges in first weeks/months of formula feeding or nursing. |

---

### 🛠️ 2. Proven Remedies & Pediatric Action Plan:

#### A. If Formula-Fed:
1. **Extensively Hydrolyzed Formula:** If CMPA is suspected, formulas like **Enfamil Nutramigen** or **Similac Alimentum** break milk proteins down into tiny peptides that the immune system doesn't react to. Most babies show improvement within 48–72 hours.
2. **Amino Acid-Based Formula (e.g., Neocate, EleCare):** Reserved for severe cases if hydrolyzed formula is not tolerated.
3. **Lactose-Free Formula (e.g., Enfamil Gentlease / Sensitive):** Helpful for temporary post-viral secondary lactose intolerance. Consult your pediatrician before switching.

#### B. If Breastfed:
1. **Fix Foremilk/Hindmilk Imbalance:** Foremilk is sugar-heavy and can cause gassy, green frothy stools; ensure ${name} drains one breast fully (15–20 mins) before switching sides to get the fat-rich hindmilk.
2. **Maternal Dairy Elimination Diet:** Eliminate milk, cheese, yogurt, butter, and hidden whey/casein from mother's diet for 14–21 days. Noticeable gut improvement usually takes 1–2 weeks.

#### C. Comfort & Diaper Rash Protection:
1. **40% Zinc Oxide Barrier Cream:** Acidic unabsorbed milk sugar burns delicate skin. Apply a thick layer (like cake frosting) at every diaper change.
2. **Tummy Relief:** Perform clockwise belly massages and bicycle leg kicks to relieve trapped gas.
3. **Paced Feeding & 20-Min Upright:** Hold ${name} upright after feeds to prevent reflux backflow.

---

### 🚨 When to Call the Pediatrician:
- Blood streaks in stool or black tarry stools.
- Inconsolable crying with abdominal rigidity.
- Signs of dehydration (<5–6 wet diapers/day, sunken soft spot).
- Severe eczema flare-ups or swelling around the face.`;
  }

  // 3. Infant Health & Fever (Comprehensive AAP Triage)
  if (
    q.includes('fever') || 
    q.includes('temp') || 
    q.includes('health') || 
    q.includes('sick') || 
    q.includes('illness') || 
    q.includes('cough') || 
    q.includes('cold') || 
    q.includes('congest') || 
    q.includes('diaper rash') || 
    q.includes('rash') || 
    q.includes('tylenol') || 
    q.includes('motrin') || 
    q.includes('medication') || 
    q.includes('100.') || 
    q.includes('101.') || 
    q.includes('102.') || 
    q.includes('103.') || 
    q.includes('104.')
  ) {
    return `### 🩺 Infant Health & Pediatric Fever Clinical Guide for ${name} (${age} months old)

**1. AAP Fever Thresholds & Urgency Matrix:**
- **🚨 Under 3 Months Old (<12 Weeks):** Any rectal temperature of **100.4°F (38.0°C) or higher** is a medical emergency. Take ${name} to the emergency room or pediatric urgent care immediately. Do not administer fever reducers before evaluation.
- **⚠️ 3 to 6 Months Old:** A temperature of **101.0°F (38.3°C) or higher** warrants a same-day call to your pediatrician.
- **ℹ️ 6+ Months Old:** A fever of **102.2°F (39.0°C)** or higher, or any fever lasting more than 48–72 hours, requires clinical evaluation.

**2. Infant Illness & Cold/Congestion Relief:**
- **Saline Drops & Gentle Nasal Aspiration:** 2–3 drops of sterile saline in each nostril before feeds and naps, followed by gentle suction with a bulb or nasal aspirator.
- **Cool-Mist Humidifier:** Place 3–5 feet away from the crib to keep nasal passages hydrated and relieve nighttime coughing.
- **Elevate the Room, Never the Mattress:** Keep the crib mattress 100% flat (AAP Safe Sleep standard). Hold baby upright in your arms during waking hours.

**3. Hydration & Vital Output Monitoring:**
- **Wet Diapers:** Ensure ${name} produces **at least 5–6 wet diapers every 24 hours**.
- **Signs of Dehydration:** Dry mouth/tongue, crying without tears, sunken fontanelle (soft spot), or unusual lethargy.

**4. Medication Safety Rules:**
- **Acetaminophen (Infant Tylenol):** Safe for 2+ months with doctor approval. Always dose by **exact weight, never age**, using the syringe provided in the package.
- **Ibuprofen (Infant Motrin/Advil):** Safe **ONLY for infants 6 months and older**. Never give to babies under 6 months without direct pediatric prescription.
- ❌ **Never give aspirin** to infants or children due to risk of Reye's syndrome.

*⚠️ Emergency Red Flags: Seek 911 or immediate ER care if ${name} shows labored/fast breathing, grunting, retractions (chest pulling in under ribs), blue lips, extreme lethargy, or inconsolable crying.*`;
  }

  // 2. Feeding, Nutrition, Solids & Milk Volumes
  if (
    q.includes('feed') || 
    q.includes('nutrit') || 
    q.includes('solid') || 
    q.includes('wean') || 
    q.includes('blw') || 
    q.includes('puree') || 
    q.includes('formula') || 
    q.includes('breast') || 
    q.includes('milk') || 
    q.includes('bottle') || 
    q.includes('ounce') || 
    q.includes('allergen') || 
    q.includes('peanut') || 
    q.includes('egg') || 
    q.includes('eat') || 
    q.includes('food')
  ) {
    const milkOunces = age <= 2 ? "20–28 oz" : age <= 6 ? "24–32 oz" : age <= 9 ? "24–30 oz" : "20–25 oz";
    const solidPhase = age < 4 
      ? "Exclusive breast milk or formula only (solids not recommended before 4-6 months)."
      : age < 6 
      ? "Prepare for solids around 6 months when showing full readiness cues." 
      : age <= 8 
      ? "1–2 solid meals daily alongside primary breast milk or formula feeds." 
      : "2–3 solid meals daily plus nutritious finger food snacks.";

    return `### 🍼 Pediatric Feeding & Nutrition Roadmap for ${name} (${age} Months Old)

**1. Daily Milk & Formula Benchmarks:**
- **Recommended Daily Volume:** **${milkOunces}** per 24-hour cycle.
- **Feed Frequency:** Typically 4–6 feeds per day (or on-demand nursing 6–8 times per day).
- **Primary Source:** Breast milk or iron-fortified formula remains the primary source of nutrition throughout the first 12 months.

**2. Starting Solids & BLW (Baby-Led Weaning) Readiness:**
- **Current Stage:** ${solidPhase}
- **4 Key Readiness Signs (Around 6 Months):**
  1. Sitting upright in a highchair with good head and neck control.
  2. Loss of the infant tongue-thrust reflex (no longer automatically pushing food out with tongue).
  3. Reaching for food and bringing items accurately to mouth.
  4. Showing eager interest when watching others eat.

**3. Safe Allergen Introduction Protocol (AAP & NIAID Guidelines):**
- **Top Allergens to Introduce Early (Around 6m):** Peanut, well-cooked egg, dairy (yogurt/cheese), sesame, soy, fish, and tree nuts.
- **Rule of 1-at-a-Time:** Introduce only **one new allergenic food every 3 to 5 days** in the morning to monitor for any reactions (hives, swelling, vomiting).
- **Safe Preparation:** Never offer whole peanuts or thick spoonfuls of nut butter (choking hazard). Thin smooth peanut butter with warm water, breast milk, or formula.

**4. Gas, Reflux & Digestion Soothing:**
- **The 20-Minute Upright Rule:** Hold ${name} upright against your shoulder for 15–20 minutes after every feeding.
- **Paced Bottle Feeding:** Hold the bottle horizontal and tilt slightly so milk fills the nipple without dripping excessively, allowing ${name} to take active pauses.
- **Bicycle Legs & Clockwise Tummy Massage:** Relieve trapped lower intestinal gas before naptime.

*💡 Vitamin D Reminder: AAP recommends 400 IU of liquid Vitamin D daily for exclusively breastfed infants.*`;
  }

  // 3. Teething & Gum Discomfort
  if (q.includes('teeth') || q.includes('gum') || q.includes('drool') || q.includes('gnaw') || q.includes('chew')) {
    return `### 🦷 Teething Comfort & Sleep Protocol for ${name} (${age} Months)

Teething commonly peaks between 4 to 10 months. Here are pediatric-approved soothing strategies:

**1. Safe Physical Soothers:**
- **Chilled (Not Frozen) Teethers:** Firm silicone or solid rubber rings chilled in the refrigerator provide gentle pressure to swollen gums.
- **Clean Damp Washcloth:** Wet a clean baby washcloth, chill in the fridge for 20 minutes, and let ${name} chew on it.
- **Clean Finger Gum Massage:** Gently rub ${name}'s gum line with a clean finger for 1–2 minutes before naptime.

**2. Sleep & Night Wakings:**
- Gum inflammation often feels more intense when lying flat. Keep a soothing, low-stimulus bedtime routine.
- Protect facial skin from drool rash by patting (not rubbing) chin dry and applying a thin barrier of pure petroleum jelly or baby balm.

**3. Safety Warnings (FDA & AAP):**
- ❌ **Avoid** numbing gels containing benzocaine or belladonna (can cause methemoglobinemia).
- ❌ **Avoid** amber teething necklaces (choking/strangulation hazard).`;
  }

  // 4. Sleep Regressions & Wake Windows
  if (q.includes('sleep') || q.includes('wake window') || q.includes('regression') || q.includes('nap') || q.includes('bedtime') || q.includes('night waking')) {
    const defaultWindow = age <= 3 ? "60–90 minutes" : age <= 5 ? "1.5–2.25 hours" : age <= 8 ? "2–3 hours" : "3–4 hours";
    const napCount = age <= 3 ? "4–5 naps" : age <= 5 ? "3 naps" : age <= 8 ? "2–3 naps" : age <= 14 ? "2 naps" : "1 nap";

    return `### 🌙 Sleep & Circadian Guidance for ${name} (${age} Months)

**Age-Appropriate Sleep Targets:**
- **Optimal Wake Windows:** **${defaultWindow}** between sleeps.
- **Daily Nap Schedule:** Typically **${napCount}** per day with 11–12 hours of consolidated night sleep.
- **Total 24h Sleep:** 13–15 hours recommended for ${age}-month-olds.

**Managing Sleep Regressions:**
1. **Watch Early Sleep Cues:** Look for zoning out, red eyebrows, and slowing down before overtired fussiness sets in.
2. **Bedtime Routine Consistency:** 4-step sequence (Warm bath/sponge → Gentle massage/PJs → Feeding in dim light → Soothing lullaby/Pink noise).
3. **AAP Safe Sleep Check:** Flat, firm crib surface with a tight fitted sheet, baby placed on their back, zero pillows, loose blankets, or positioners.
4. **Pause Before Intervening:** Give ${name} 60–90 seconds to self-settle between sleep cycles before offering gentle voice and patting reassurance.`;
  }

  // 5. Default Comprehensive Pediatric Guidance
  return `### 🩺 Pediatric Consultation for ${name} (${age} Months)

Thank you for reaching out! Here is evidence-based pediatric guidance tailored to ${name}:

**Core Infant Wellness Checklist:**
1. **Sleep Rhythm:** At ${age} months, maintain predictable wake windows to prevent cortisol spikes from overtiredness.
2. **AAP Safe Sleep:** Keep sleep surfaces flat, firm, and completely empty of loose bedding, positioners, or toys.
3. **Hydration & Output:** Ensure ${name} is producing 5–6+ wet diapers daily, staying alert during wake periods, and feeding comfortably.
4. **Milestone Progression:** Encourage plenty of floor tummy time and responsive verbal engagement to build neck, core, and communication skills.

*💡 If you have a specific question about fevers, wake windows, teething soothing, or feeding schedules, feel free to ask anytime!*`;
}

/**
 * Normalizes chat message history for Gemini API @google/genai:
 * - Ensures sequence starts with a 'user' turn
 * - Merges consecutive turns of the same role
 * - Strips empty messages
 */
function buildGeminiContents(rawMessages: Array<{ role: string; content: string }>) {
  const normalized: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const msg of rawMessages) {
    const role: 'user' | 'model' = (msg.role === 'assistant' || msg.role === 'model') ? 'model' : 'user';
    const text = (msg.content || '').trim();
    if (!text) continue;

    // Gemini requires the conversation to start with a 'user' role
    if (normalized.length === 0 && role === 'model') {
      continue;
    }

    // Merge consecutive messages with the same role
    const last = normalized[normalized.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n\n${text}`;
    } else {
      normalized.push({
        role: role,
        parts: [{ text: text }]
      });
    }
  }

  // Ensure there is at least one user message
  if (normalized.length === 0) {
    const lastUser = rawMessages.filter(m => m.role === 'user').pop();
    if (lastUser && lastUser.content) {
      normalized.push({
        role: 'user',
        parts: [{ text: lastUser.content.trim() }]
      });
    }
  }

  return normalized;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // Health and connection status
  app.get("/api/health", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({ 
      status: "ok", 
      service: "Sleepy Lullaby Baby AI Agent & Pediatric Clinic",
      aiConnected: hasKey,
      model: "gemini-3.7-flash"
    });
  });

  app.get("/api/ai/status", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: "online",
      aiConnected: hasKey,
      model: "gemini-3.7-flash",
      consultants: ["Dr. Lullaby (MD)", "Nurse Daisy (RN Pediatrician)"]
    });
  });

  // AI Pediatric Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, babyProfile } = req.body;
      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Missing message history" });
      }

      // Extract latest user query for logging / fallback
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      const latestQuery = lastUserMsg ? lastUserMsg.content : '';

      const ai = getGenAI();

      // If no Gemini client or API key, return pediatric expert rule response
      if (!ai) {
        console.log("Using pediatric clinical expert engine for query:", latestQuery);
        const fallbackReply = getPediatricFallbackAdvice(latestQuery, babyProfile);
        return res.json({ reply: fallbackReply, source: "pediatric-knowledge-engine" });
      }

      const profileContext = babyProfile ? `
Current Baby Context:
- Baby's Name: ${babyProfile.name || 'Baby'}
- Age: ${babyProfile.ageMonths !== undefined ? `${babyProfile.ageMonths} months old` : '5 months old'}
- Gender: ${babyProfile.gender || 'Not specified'}
- Typical Wake Time: ${babyProfile.wakeTime || '07:00'}
- Target Bedtime: ${babyProfile.targetBedtime || '19:30'}
- Primary Sleep Goal: ${babyProfile.sleepGoal || 'Gentle sleep routine'}
` : '';

      const systemInstruction = `You are "Dr. Lullaby & Nurse Daisy", a world-class, compassionate, evidence-based AI Pediatric Sleep & Infant Health Consultant for "Sleepy Lullaby Dreams".

Your mission:
1. Provide warm, empathetic, science-backed guidance to caring, often sleep-deprived parents and caregivers.
2. Answer all questions thoroughly regarding:
   - Infant & Toddler Sleep: Wake windows, age-appropriate nap transitions (3 to 2, 2 to 1), bedtime routines, sleep regressions (4m, 8m, 12m, 18m), gentle sleep shaping & soothing techniques, safe sleep environment (AAP Safe Sleep guidelines: flat firm mattress, alone on back, no loose blankets or bumpers).
   - Infant & Child Health: Teething relief, common infant congestion & humidifiers, safe fever guidance (AAP recommendations: under 3 months with 100.4°F / 38°C requires urgent medical care), diaper rash treatments, colic/reflux management, tummy time progression, cradle cap, hydration & wet diaper counts.
   - Feeding, Digestion & Spit-Up: Breastfeeding schedules & latching, formula volumes & safe prep, curdled/cottage-cheese spit-up physiology (explain that stomach acid and pepsin curdle milk proteins like casein and whey during normal digestion, and immature lower esophageal sphincter causes normal "Happy Spitter" reflux), gas, burping techniques, starting solids / Baby-Led Weaning (BLW), high-allergen introduction protocols, growth spurts.
   - Diaper Output & Poop Color Decoder: Explain all baby poop colors (Mustard yellow with curds in breastfed, tan/peanut butter in formula-fed, iron-induced green/army green as normal, orange, brown with solids) vs red flags requiring immediate pediatric attention (🔴 Red/blood from allergies or fissures, ⚪ White/chalky/clay indicating biliary issues, ⚫ Black/tarry melena after newborn meconium).
   - Development & Milestones: Motor milestones, sensory play, speech development, separation anxiety.
   - Postpartum & Caregiver Wellbeing: Parental fatigue, shared caregiver shifts, stress relief.

${profileContext}

Guidelines for your answers:
- Tone: Warm, reassuring, deeply supportive, non-judgmental, clear and structured.
- Structure: Use clean markdown formatting with bold headers, bullet points, and actionable next steps.
- Safety & Medical Disclaimer: Always include a brief, reassuring safety note that you provide educational guidance based on pediatric best practices (AAP guidelines) and parents should always consult their pediatrician or emergency services for acute illnesses, high fevers in young infants, breathing difficulties, or severe distress.
- Personalization: Tailor sleep windows, nap suggestions, and milestones specifically to their exact age in months!`;

      // Build properly normalized Gemini contents
      const contents = buildGeminiContents(messages);

      if (contents.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: latestQuery || "Hello Dr. Lullaby, I need guidance for my baby." }]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text;
      if (!replyText) {
        throw new Error("Empty text received from Gemini API");
      }

      res.json({ reply: replyText, source: "gemini-3.7-flash" });
    } catch (error: any) {
      const isQuotaOr429 = error?.status === "RESOURCE_EXHAUSTED" || error?.status === 429 || String(error?.message || '').includes('429') || String(error?.message || '').includes('prepayment');
      if (isQuotaOr429) {
        console.warn("Notice: Gemini API credits/quota limit reached. Seamlessly answering via Dr. Lullaby Pediatric Clinical Engine.");
      } else {
        console.warn("Notice: Gemini API temporary error. Serving fallback consultation:", error?.message || error);
      }
      
      // Provide immediate clinical fallback response so user never experiences broken connection
      const lastUserMsg = (req.body.messages || []).slice().reverse().find((m: any) => m.role === 'user');
      const fallbackReply = getPediatricFallbackAdvice(lastUserMsg ? lastUserMsg.content : '', req.body.babyProfile);
      
      res.json({ 
        reply: fallbackReply,
        source: "pediatric-knowledge-engine-fallback",
        warning: "Consultation answered via Pediatric Clinical Knowledge Base"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

