export type SleepType = 'night' | 'nap';
export type ActivityType = 'sleep' | 'wake' | 'feed' | 'diaper' | 'tummy_time' | 'bath' | 'play' | 'medicine' | 'custom_note';
export type BabyMood = 'happy' | 'peaceful' | 'fussy' | 'restless' | 'crying';
export type FeedType = 'nursing' | 'formula' | 'pumped_milk' | 'solids';
export type BreastSide = 'left' | 'right' | 'both';
export type DiaperType = 'wet' | 'dirty' | 'both';

export interface SleepLog {
  id: string;
  type: SleepType;
  startTime: string; // e.g. "13:30"
  endTime: string;   // e.g. "15:00"
  durationMinutes: number;
  quality: 'peaceful' | 'restless' | 'broken';
  moodUponWaking: BabyMood;
  notes: string;
  loggedBy: string;
  caregiverAvatar: string;
  date: string;
}

export interface FeedLog {
  id: string;
  feedType: FeedType;
  time: string; // e.g. "14:30"
  durationMinutes?: number; // for nursing
  breastSide?: BreastSide;
  nursingSide?: BreastSide;
  amountMl?: number; // for formula or bottle
  amountOz?: number;
  foodDescription?: string; // for solids
  notes: string;
  loggedBy: string;
  caregiverAvatar: string;
  date?: string;
}

export interface DiaperLog {
  id: string;
  diaperType: DiaperType;
  time: string; // e.g. "15:15"
  hasRashCream?: boolean;
  stoolColor?: string;
  stoolConsistency?: string;
  leakage?: boolean;
  notes: string;
  loggedBy: string;
  caregiverAvatar: string;
  date?: string;
}

export interface CustomActivityLog {
  id: string;
  activityType: 'tummy_time' | 'bath' | 'play' | 'medicine' | 'custom_note';
  title: string;
  time: string; // e.g. "16:00"
  durationMinutes?: number;
  notes: string;
  loggedBy: string;
  caregiverAvatar: string;
  date: string;
}

export type UnifiedDailyEvent =
  | ({ category: 'sleep' } & SleepLog)
  | ({ category: 'feed' } & FeedLog)
  | ({ category: 'diaper' } & DiaperLog)
  | ({ category: 'activity' } & CustomActivityLog);

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  time: string;
  detail: string;
  loggedBy: string;
  iconName: string;
}

export interface AgeMilestone {
  id: string;
  ageLabel: string;
  monthsRange: [number, number];
  typicalTotalSleep: string; // e.g. "14 - 16 hours"
  wakeWindowRange: string;   // e.g. "90 - 120 mins"
  wakeWindowMinutes: [number, number];
  napsPerDay: string;        // e.g. "3 naps"
  napCount: number;
  bedtimeRange: string;      // e.g. "7:00 PM - 8:00 PM"
  nightSleepStretch: string; // e.g. "8 - 10 hours"
  keyMilestones: string[];
  regressionRisk: string;
  expertTip: string;
  sampleSchedule: {
    time: string;
    event: string;
    type: 'wake' | 'nap' | 'feed' | 'bedtime' | 'routine';
  }[];
}

export interface SoundTrack {
  id: string;
  name: string;
  category: 'White Noise' | 'Nature' | 'Womb & Heartbeat' | 'Lullaby';
  description: string;
  icon: string;
  color: string;
  bgGradient: string;
  synthesizerType: 'white_noise' | 'pink_noise' | 'brown_noise' | 'heartbeat' | 'rain' | 'lullaby_melody' | 'ocean_waves';
}

export interface SleepGuide {
  id: string;
  title: string;
  readTime: string;
  category: 'Newborn Essentials' | 'Sleep Training' | 'Regressions' | 'Nap Routines' | 'Feeding & Sleep';
  badgeColor: string;
  summary: string;
  keySteps: string[];
  pediatricNote: string;
}

export interface Caregiver {
  id: string;
  name: string;
  role: 'Mom' | 'Dad' | 'Nanny' | 'Grandparent' | 'Night Nurse';
  avatarBg: string;
  avatarEmoji: string;
  lastActive: string;
  isCurrentShift?: boolean;
}

export interface BabyProfile {
  name: string;
  ageMonths: number;
  birthDate: string;
  gender: 'boy' | 'girl' | 'prefer_not_to_say';
  wakeTime: string;
  targetBedtime: string;
  sleepGoal: string;
}

export interface DaySleepPattern {
  dayLabel: string;
  shortDay: string;
  dateStr: string;
  totalHours: number;
  nightHours: number;
  napHours: number;
  napsCount: number;
  nightWakes: number;
  qualityScore: number;
  onsetLatencyMins: number;
  segments: {
    type: 'night' | 'nap' | 'wake';
    name: string;
    startTime: string;
    endTime: string;
    startPercent: number; // 0-100 on 24h scale
    widthPercent: number; // 0-100
    durationMins: number;
    quality: 'peaceful' | 'restless' | 'broken';
  }[];
}

export interface VaccineRecord {
  vaccineId: string;
  isCompleted: boolean;
  completedDate?: string; // YYYY-MM-DD
  administeredBy?: string;
  lotNumber?: string;
  site?: 'left_thigh' | 'right_thigh' | 'left_arm' | 'right_arm' | 'oral';
  sideEffects?: string[];
  notes?: string;
  updatedAt?: string;
}

export interface ImmunizationScheduleItem {
  id: string;
  name: string;
  shortName: string;
  doseNumber: number;
  totalDoses: number;
  targetAgeMonths: number;
  ageLabel: string;
  protectsAgainst: string;
  description: string;
  route: 'intramuscular' | 'oral' | 'subcutaneous';
  mandatoryForDaycare: boolean;
  commonReactions: string[];
  aapComfortTips: string[];
}
