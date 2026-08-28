import { ImmunizationScheduleItem, VaccineRecord } from '../types';

export const CDC_AAP_VACCINE_SCHEDULE: ImmunizationScheduleItem[] = [
  // --- BIRTH ---
  {
    id: 'hepb-1',
    name: 'Hepatitis B (HepB) — Dose 1',
    shortName: 'HepB #1',
    doseNumber: 1,
    totalDoses: 3,
    targetAgeMonths: 0,
    ageLabel: 'Birth (0 Mo)',
    protectsAgainst: 'Hepatitis B viral infection causing chronic liver damage and cirrhosis',
    description: 'First dose given within 24 hours of birth to protect newborn against hepatitis B virus transmission.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Low-grade fever (<100.4°F)', 'Mild soreness at injection site', 'Slight drowsiness'],
    aapComfortTips: ['Skin-to-skin cuddling immediately after injection', 'Gentle feeding/nursing for pain distraction']
  },

  // --- 1 - 2 MONTHS ---
  {
    id: 'hepb-2',
    name: 'Hepatitis B (HepB) — Dose 2',
    shortName: 'HepB #2',
    doseNumber: 2,
    totalDoses: 3,
    targetAgeMonths: 1.5,
    ageLabel: '1–2 Months',
    protectsAgainst: 'Hepatitis B viral liver disease',
    description: 'Second dose in the 3-dose series given at 1 to 2 months well-child checkup.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild redness on thigh', 'Low fever', 'Short-term fussiness for 24 hours'],
    aapComfortTips: ['Cool damp washcloth over thigh injection site', 'Frequent soothing and extra contact naps']
  },

  // --- 2 MONTHS ---
  {
    id: 'dtap-1',
    name: 'DTaP (Diphtheria, Tetanus, acellular Pertussis) — Dose 1',
    shortName: 'DTaP #1',
    doseNumber: 1,
    totalDoses: 5,
    targetAgeMonths: 2,
    ageLabel: '2 Months',
    protectsAgainst: 'Whooping cough (Pertussis), lockjaw (Tetanus), and throat membrane toxicity (Diphtheria)',
    description: 'Crucial primary dose protecting infants against severe life-threatening pertussis whooping cough.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild fever (100–101.5°F)', 'Tenderness/knot in thigh muscle', 'Fussiness & fatigue'],
    aapComfortTips: ['Bicycle legs gently to disperse muscle tension', 'Check temperature rectally; hydrate with milk']
  },
  {
    id: 'rv-1',
    name: 'Rotavirus (RV) Oral Drops — Dose 1',
    shortName: 'Rotavirus #1',
    doseNumber: 1,
    totalDoses: 2,
    targetAgeMonths: 2,
    ageLabel: '2 Months',
    protectsAgainst: 'Severe dehydrating diarrhea and vomiting in young infants',
    description: 'Gentle sweet-tasting liquid drops given orally in the cheek pouch. No needles.',
    route: 'oral',
    mandatoryForDaycare: true,
    commonReactions: ['Mild temporary diarrhea or spit-up', 'Mild tummy rumbling', 'Temporary loose stools'],
    aapComfortTips: ['Wash hands carefully after diaper changes', 'Feed small frequent milk amounts to soothe digestion']
  },
  {
    id: 'hib-1',
    name: 'Haemophilus influenzae type b (Hib) — Dose 1',
    shortName: 'Hib #1',
    doseNumber: 1,
    totalDoses: 4,
    targetAgeMonths: 2,
    ageLabel: '2 Months',
    protectsAgainst: 'Severe bacterial meningitis, pneumonia, and epiglottitis (airway swelling)',
    description: 'Protects against Hib bacteria that can cause life-threatening infant brain and lung infections.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild localized tenderness', 'Low-grade fever', 'Decreased appetite for 1 meal'],
    aapComfortTips: ['Warm soothing bath in the evening', 'Offer breastfeeding or bottle immediately post-visit']
  },
  {
    id: 'pcv-1',
    name: 'Pneumococcal Conjugate (PCV15 / PCV20) — Dose 1',
    shortName: 'PCV15/20 #1',
    doseNumber: 1,
    totalDoses: 4,
    targetAgeMonths: 2,
    ageLabel: '2 Months',
    protectsAgainst: 'Pneumococcal pneumonia, bloodstream bacteremia, and middle ear infections (otitis media)',
    description: 'Updated 15 or 20-valent conjugate vaccine defending infants against invasive Streptococcus pneumoniae.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild swelling on thigh', 'Fever up to 101°F', 'Mild sleepiness'],
    aapComfortTips: ['Dress baby in loose, breathable cotton clothes', 'Keep room temperature comfortable at 68–72°F']
  },
  {
    id: 'ipv-1',
    name: 'Inactivated Poliovirus (IPV) — Dose 1',
    shortName: 'Polio (IPV) #1',
    doseNumber: 1,
    totalDoses: 4,
    targetAgeMonths: 2,
    ageLabel: '2 Months',
    protectsAgainst: 'Poliovirus paralysis and spinal cord damage',
    description: 'Inactivated (non-live) injectable polio vaccine providing lifelong motor nerve protection.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Slight ache at injection site', 'Short crying spell during shot'],
    aapComfortTips: ['Hold baby in comfortable upright swaddle or lap embrace during injection']
  },

  // --- 4 MONTHS ---
  {
    id: 'dtap-2',
    name: 'DTaP (Diphtheria, Tetanus, Pertussis) — Dose 2',
    shortName: 'DTaP #2',
    doseNumber: 2,
    totalDoses: 5,
    targetAgeMonths: 4,
    ageLabel: '4 Months',
    protectsAgainst: 'Pertussis whooping cough, Tetanus, and Diphtheria',
    description: 'Second primary dose to deepen immune antibody titers against pertussis and tetanus.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Low-grade fever', 'Thigh muscle knot for 2–3 days', 'Fussiness'],
    aapComfortTips: ['Gentle massage around (not directly on) injection site', 'Extra cuddle time and calm bedtime routine']
  },
  {
    id: 'rv-2',
    name: 'Rotavirus (RV) Oral Drops — Dose 2',
    shortName: 'Rotavirus #2',
    doseNumber: 2,
    totalDoses: 2,
    targetAgeMonths: 4,
    ageLabel: '4 Months',
    protectsAgainst: 'Rotavirus severe gastroenteritis & dehydration',
    description: 'Second oral dose completes standard 2-dose Rotarix series (or dose 2 of 3 for RotaTeq).',
    route: 'oral',
    mandatoryForDaycare: true,
    commonReactions: ['Mild irritability', 'Mild loose stool'],
    aapComfortTips: ['Ensure diaper area is coated with zinc oxide barrier cream if stools become loose']
  },
  {
    id: 'hib-2',
    name: 'Haemophilus influenzae type b (Hib) — Dose 2',
    shortName: 'Hib #2',
    doseNumber: 2,
    totalDoses: 4,
    targetAgeMonths: 4,
    ageLabel: '4 Months',
    protectsAgainst: 'Bacterial meningitis and invasive bloodstream infection',
    description: 'Second dose establishing sustained immunity through infant development.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Slight swelling', 'Mild fever'],
    aapComfortTips: ['Pediatrician-approved acetaminophen if baby is in marked discomfort']
  },
  {
    id: 'pcv-2',
    name: 'Pneumococcal Conjugate (PCV15 / PCV20) — Dose 2',
    shortName: 'PCV15/20 #2',
    doseNumber: 2,
    totalDoses: 4,
    targetAgeMonths: 4,
    ageLabel: '4 Months',
    protectsAgainst: 'Pneumococcal lung, blood, and ear infections',
    description: 'Second dose building protection against 15–20 high-virulence pneumococcal serotypes.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild tenderness on thigh', 'Low fever', 'Short nap changes'],
    aapComfortTips: ['Encourage peaceful rest; don’t skip regular feeding schedule']
  },
  {
    id: 'ipv-2',
    name: 'Inactivated Poliovirus (IPV) — Dose 2',
    shortName: 'Polio (IPV) #2',
    doseNumber: 2,
    totalDoses: 4,
    targetAgeMonths: 4,
    ageLabel: '4 Months',
    protectsAgainst: 'Poliovirus paralysis',
    description: 'Second inactivated dose ensuring broad antibody response.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild redness at site'],
    aapComfortTips: ['Comfortable swaddling with loose legs']
  },

  // --- 6 MONTHS ---
  {
    id: 'dtap-3',
    name: 'DTaP (Diphtheria, Tetanus, Pertussis) — Dose 3',
    shortName: 'DTaP #3',
    doseNumber: 3,
    totalDoses: 5,
    targetAgeMonths: 6,
    ageLabel: '6 Months',
    protectsAgainst: 'Pertussis whooping cough, Tetanus, and Diphtheria',
    description: 'Third primary series dose providing over 95% protection against whooping cough before solid food transitions.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Fever up to 101.5°F', 'Mild redness', 'Increased fussiness on Day 1'],
    aapComfortTips: ['Cold compress on thigh for 10 minutes at a time', 'Extra skin-to-skin contact']
  },
  {
    id: 'hib-3',
    name: 'Haemophilus influenzae type b (Hib) — Dose 3',
    shortName: 'Hib #3',
    doseNumber: 3,
    totalDoses: 4,
    targetAgeMonths: 6,
    ageLabel: '6 Months',
    protectsAgainst: 'Bacterial meningitis and invasive infections',
    description: 'Third dose (for 4-dose series brands like ActHIB/Pentacel) to complete infant series.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild local tenderness', 'Mild sleepiness'],
    aapComfortTips: ['Comfortable room environment, soothing white noise']
  },
  {
    id: 'pcv-3',
    name: 'Pneumococcal Conjugate (PCV15 / PCV20) — Dose 3',
    shortName: 'PCV15/20 #3',
    doseNumber: 3,
    totalDoses: 4,
    targetAgeMonths: 6,
    ageLabel: '6 Months',
    protectsAgainst: 'Pneumococcal pneumonia, bacteremia, and recurrent ear infections',
    description: 'Third primary dose creating robust mucosal and blood immunity.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Fever (100–101°F)', 'Thigh tenderness', 'Restlessness'],
    aapComfortTips: ['Offer extra breast milk or formula for hydration']
  },
  {
    id: 'ipv-3',
    name: 'Inactivated Poliovirus (IPV) — Dose 3',
    shortName: 'Polio (IPV) #3',
    doseNumber: 3,
    totalDoses: 4,
    targetAgeMonths: 6,
    ageLabel: '6–18 Months',
    protectsAgainst: 'Poliovirus infection',
    description: 'Third dose administered between 6 and 18 months well-child visit.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild soreness'],
    aapComfortTips: ['Gentle rocking and post-visit nursing']
  },
  {
    id: 'hepb-3',
    name: 'Hepatitis B (HepB) — Dose 3',
    shortName: 'HepB #3',
    doseNumber: 3,
    totalDoses: 3,
    targetAgeMonths: 6,
    ageLabel: '6–18 Months',
    protectsAgainst: 'Chronic Hepatitis B liver infection',
    description: 'Final dose in primary HepB series giving lasting decades-long immune memory.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild soreness', 'Low fever'],
    aapComfortTips: ['Loose comfortable clothes, warm evening bath']
  },
  {
    id: 'flu-annual',
    name: 'Influenza (Flu) — Seasonal Annual',
    shortName: 'Flu Shot #1',
    doseNumber: 1,
    totalDoses: 2,
    targetAgeMonths: 6,
    ageLabel: '6+ Months (Seasonal)',
    protectsAgainst: 'Seasonal Influenza A & B strains causing severe respiratory distress',
    description: 'Recommended annually starting at 6 months. First-time recipients receive 2 doses spaced 4 weeks apart.',
    route: 'intramuscular',
    mandatoryForDaycare: false,
    commonReactions: ['Low-grade fever', 'Mild muscle aches', 'Runny nose'],
    aapComfortTips: ['Keep well hydrated', 'Monitor temperature with digital thermometer']
  },

  // --- 12 MONTHS ---
  {
    id: 'mmr-1',
    name: 'MMR (Measles, Mumps, Rubella) — Dose 1',
    shortName: 'MMR #1',
    doseNumber: 1,
    totalDoses: 2,
    targetAgeMonths: 12,
    ageLabel: '12 Months',
    protectsAgainst: 'Measles (rubeola rash/pneumonia), Mumps (parotitis), and Rubella (German measles)',
    description: 'Live-attenuated vaccine given at 1st birthday. Provides ~93% efficacy against high-contagion measles.',
    route: 'subcutaneous',
    mandatoryForDaycare: true,
    commonReactions: ['Mild fever occurring 7–12 days later', 'Faint non-contagious pink rash 1–2 weeks later', 'Mild irritability'],
    aapComfortTips: ['Note that MMR fever typically occurs 1–2 weeks AFTER the visit, not on day 1 (this is normal!)', 'Keep baby hydrated']
  },
  {
    id: 'varicella-1',
    name: 'Varicella (Chickenpox) — Dose 1',
    shortName: 'Varicella #1',
    doseNumber: 1,
    totalDoses: 2,
    targetAgeMonths: 12,
    ageLabel: '12 Months',
    protectsAgainst: 'Chickenpox blisters, skin infections, and encephalitis',
    description: 'Subcutaneous injection providing over 90% protection against chickenpox outbreaks.',
    route: 'subcutaneous',
    mandatoryForDaycare: true,
    commonReactions: ['Mild fever', 'Occasional few chickenpox-like bumps 1–3 weeks later'],
    aapComfortTips: ['Do not scratch bumps', 'Calamine lotion if mild itch occurs under pediatrician guidance']
  },
  {
    id: 'hepa-1',
    name: 'Hepatitis A (HepA) — Dose 1',
    shortName: 'HepA #1',
    doseNumber: 1,
    totalDoses: 2,
    targetAgeMonths: 12,
    ageLabel: '12 Months',
    protectsAgainst: 'Hepatitis A viral liver inflammation transmitted via contaminated water and foods',
    description: 'First dose in 2-dose series spaced 6 months apart at 12 and 18 months.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild soreness at site', 'Slight loss of appetite'],
    aapComfortTips: ['Encourage easy finger foods and cold water sips']
  },
  {
    id: 'pcv-4',
    name: 'Pneumococcal Conjugate (PCV15/20) — Booster Dose 4',
    shortName: 'PCV15/20 #4 (Booster)',
    doseNumber: 4,
    totalDoses: 4,
    targetAgeMonths: 12,
    ageLabel: '12–15 Months',
    protectsAgainst: 'Pneumococcal infections',
    description: 'Final toddler booster completing full pneumococcal conjugate schedule.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Tenderness at site', 'Low fever'],
    aapComfortTips: ['Gentle movement and playful distractions']
  },
  {
    id: 'hib-4',
    name: 'Haemophilus influenzae type b (Hib) — Booster Dose 4',
    shortName: 'Hib #4 (Booster)',
    doseNumber: 4,
    totalDoses: 4,
    targetAgeMonths: 12,
    ageLabel: '12–15 Months',
    protectsAgainst: 'Bacterial meningitis and invasive epiglottitis',
    description: 'Toddler booster dose cementing lifelong antibacterial immunity.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild tenderness'],
    aapComfortTips: ['Warm bath, quiet reading before sleep']
  },

  // --- 15 - 18 MONTHS ---
  {
    id: 'dtap-4',
    name: 'DTaP (Diphtheria, Tetanus, Pertussis) — Booster Dose 4',
    shortName: 'DTaP #4 (Booster)',
    doseNumber: 4,
    totalDoses: 5,
    targetAgeMonths: 15,
    ageLabel: '15–18 Months',
    protectsAgainst: 'Whooping cough, Tetanus, and Diphtheria',
    description: 'Fourth dose booster reinforcing toddler respiratory protection against pertussis.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Swelling on thigh/arm', 'Fever (100–102°F)', 'Fussiness'],
    aapComfortTips: ['Cold pack on injection site', 'Hydration and restful naps']
  },
  {
    id: 'hepa-2',
    name: 'Hepatitis A (HepA) — Dose 2',
    shortName: 'HepA #2',
    doseNumber: 2,
    totalDoses: 2,
    targetAgeMonths: 18,
    ageLabel: '18 Months',
    protectsAgainst: 'Hepatitis A viral infection',
    description: 'Final dose in 2-dose series given 6 months after Dose 1 to complete permanent protection.',
    route: 'intramuscular',
    mandatoryForDaycare: true,
    commonReactions: ['Mild site tenderness'],
    aapComfortTips: ['Comfortable clothing and praise for brave toddler!']
  }
];

// Helper to calculate exact due date and status based on baby birth date
export function calculateVaccineDueDate(birthDateStr: string, targetAgeMonths: number): {
  dueDateStr: string;
  formattedDate: string;
  daysRemaining: number;
  isOverdue: boolean;
  isDueNow: boolean;
} {
  const birth = new Date(birthDateStr || '2026-03-15');
  const targetDate = new Date(birth);
  
  // Add months precisely
  const wholeMonths = Math.floor(targetAgeMonths);
  const fracDays = Math.round((targetAgeMonths - wholeMonths) * 30.44);
  targetDate.setMonth(targetDate.getMonth() + wholeMonths);
  targetDate.setDate(targetDate.getDate() + fracDays);

  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getDate()).padStart(2, '0');
  const dueDateStr = `${yyyy}-${mm}-${dd}`;

  const formattedDate = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Is Overdue if target date was >14 days ago
  const isOverdue = daysRemaining < -14;
  // Is Due Now if within 14 days before or 14 days after target
  const isDueNow = Math.abs(daysRemaining) <= 14;

  return {
    dueDateStr,
    formattedDate,
    daysRemaining,
    isOverdue,
    isDueNow
  };
}

export function getVaccineRecordStatus(
  record: VaccineRecord | undefined,
  birthDateStr: string,
  targetAgeMonths: number
): {
  status: 'completed' | 'due_now' | 'overdue' | 'upcoming';
  badgeLabel: string;
  badgeClass: string;
  dueDateFormatted: string;
} {
  const { formattedDate, isOverdue, isDueNow, daysRemaining } = calculateVaccineDueDate(birthDateStr, targetAgeMonths);

  if (record?.isCompleted) {
    return {
      status: 'completed',
      badgeLabel: `✓ Completed on ${record.completedDate || formattedDate}`,
      badgeClass: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
      dueDateFormatted: formattedDate
    };
  }

  if (isOverdue) {
    return {
      status: 'overdue',
      badgeLabel: `⚠️ Overdue (${Math.abs(daysRemaining)}d ago)`,
      badgeClass: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
      dueDateFormatted: formattedDate
    };
  }

  if (isDueNow) {
    return {
      status: 'due_now',
      badgeLabel: `● Due Now (${formattedDate})`,
      badgeClass: 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE] animate-pulse',
      dueDateFormatted: formattedDate
    };
  }

  return {
    status: 'upcoming',
    badgeLabel: `Upcoming (in ${daysRemaining}d)`,
    badgeClass: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
    dueDateFormatted: formattedDate
  };
}

// Initial default completed state for a 5-month-old baby (like Maya born 2026-03-15)
export const INITIAL_VACCINE_RECORDS: Record<string, VaccineRecord> = {
  'hepb-1': {
    vaccineId: 'hepb-1',
    isCompleted: true,
    completedDate: '2026-03-15',
    administeredBy: 'Hospital Birth Unit - Dr. Chen',
    lotNumber: 'ENG-2026-09A',
    site: 'left_thigh',
    sideEffects: [],
    notes: 'Administered at birth with zero complications.'
  },
  'hepb-2': {
    vaccineId: 'hepb-2',
    isCompleted: true,
    completedDate: '2026-04-20',
    administeredBy: 'Sunrise Pediatrics - Dr. Lullaby Clinic',
    lotNumber: 'ENG-2026-44B',
    site: 'left_thigh',
    sideEffects: ['Mild sleepiness'],
    notes: 'Well tolerated at 1 month checkup.'
  },
  'dtap-1': {
    vaccineId: 'dtap-1',
    isCompleted: true,
    completedDate: '2026-05-18',
    administeredBy: 'Sunrise Pediatrics - Nurse Daisy',
    lotNumber: 'DTP-98210',
    site: 'right_thigh',
    sideEffects: ['Low-grade fever', 'Fussiness'],
    notes: 'Fever of 99.8°F resolved within 24 hours with skin-to-skin.'
  },
  'rv-1': {
    vaccineId: 'rv-1',
    isCompleted: true,
    completedDate: '2026-05-18',
    administeredBy: 'Sunrise Pediatrics - Nurse Daisy',
    lotNumber: 'ROT-3321A',
    site: 'oral',
    sideEffects: [],
    notes: 'Took full oral sweet liquid dose without spitting up.'
  },
  'hib-1': {
    vaccineId: 'hib-1',
    isCompleted: true,
    completedDate: '2026-05-18',
    administeredBy: 'Sunrise Pediatrics - Nurse Daisy',
    lotNumber: 'HIB-44102',
    site: 'left_thigh',
    sideEffects: ['Soreness at site'],
    notes: 'Cold washcloth applied.'
  },
  'pcv-1': {
    vaccineId: 'pcv-1',
    isCompleted: true,
    completedDate: '2026-05-18',
    administeredBy: 'Sunrise Pediatrics - Nurse Daisy',
    lotNumber: 'PCV-88219',
    site: 'right_thigh',
    sideEffects: [],
    notes: 'PCV20 brand given.'
  },
  'ipv-1': {
    vaccineId: 'ipv-1',
    isCompleted: true,
    completedDate: '2026-05-18',
    administeredBy: 'Sunrise Pediatrics - Nurse Daisy',
    lotNumber: 'IPV-10294',
    site: 'left_thigh',
    sideEffects: [],
    notes: 'Poliovirus dose 1.'
  },
  'dtap-2': {
    vaccineId: 'dtap-2',
    isCompleted: true,
    completedDate: '2026-07-20',
    administeredBy: 'Sunrise Pediatrics - Dr. Lullaby Clinic',
    lotNumber: 'DTP-99412',
    site: 'left_thigh',
    sideEffects: ['Mild fussiness on evening 1'],
    notes: '4-month milestone series completed.'
  },
  'rv-2': {
    vaccineId: 'rv-2',
    isCompleted: true,
    completedDate: '2026-07-20',
    administeredBy: 'Sunrise Pediatrics - Dr. Lullaby Clinic',
    lotNumber: 'ROT-3419B',
    site: 'oral',
    sideEffects: [],
    notes: 'Completed 2-dose Rotarix series.'
  },
  'hib-2': {
    vaccineId: 'hib-2',
    isCompleted: true,
    completedDate: '2026-07-20',
    administeredBy: 'Sunrise Pediatrics - Dr. Lullaby Clinic',
    lotNumber: 'HIB-45019',
    site: 'right_thigh',
    sideEffects: [],
    notes: 'Tolerated well.'
  },
  'pcv-2': {
    vaccineId: 'pcv-2',
    isCompleted: true,
    completedDate: '2026-07-20',
    administeredBy: 'Sunrise Pediatrics - Dr. Lullaby Clinic',
    lotNumber: 'PCV-89410',
    site: 'left_thigh',
    sideEffects: [],
    notes: 'Dose 2 completed.'
  },
  'ipv-2': {
    vaccineId: 'ipv-2',
    isCompleted: true,
    completedDate: '2026-07-20',
    administeredBy: 'Sunrise Pediatrics - Dr. Lullaby Clinic',
    lotNumber: 'IPV-11204',
    site: 'right_thigh',
    sideEffects: [],
    notes: 'Dose 2 completed.'
  }
};
