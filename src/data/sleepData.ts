import { AgeMilestone, SoundTrack, SleepGuide, Caregiver, SleepLog, FeedLog, DiaperLog, CustomActivityLog, DaySleepPattern } from '../types';

export const AGE_MILESTONES: AgeMilestone[] = [
  {
    id: 'newborn',
    ageLabel: '0 – 2 Months',
    monthsRange: [0, 2],
    typicalTotalSleep: '15 – 18 hours',
    wakeWindowRange: '45 – 60 mins',
    wakeWindowMinutes: [45, 60],
    napsPerDay: '4 – 6 naps',
    napCount: 5,
    bedtimeRange: '9:00 PM – 10:30 PM',
    nightSleepStretch: '2 – 4 hours',
    keyMilestones: [
      'Day/night circadian rhythm is developing',
      'Active REM sleep makes up ~50% of sleep',
      'Need frequent feeding every 2-3 hours'
    ],
    regressionRisk: 'Day/night reversal is common in weeks 1-4',
    expertTip: 'Keep daytime bright and interactive; keep night feeds dim, quiet, and unstimulating to set their internal clock.',
    sampleSchedule: [
      { time: '07:30 AM', event: 'Morning wake up & gentle feeding', type: 'wake' },
      { time: '08:20 AM', event: 'Morning Nap 1 (45-60m wake window)', type: 'nap' },
      { time: '10:00 AM', event: 'Feed & tummy time on blanket', type: 'feed' },
      { time: '10:50 AM', event: 'Midday Nap 2 (swaddled with white noise)', type: 'nap' },
      { time: '01:00 PM', event: 'Feed, diaper change & stroller walk', type: 'feed' },
      { time: '01:50 PM', event: 'Afternoon Nap 3', type: 'nap' },
      { time: '04:00 PM', event: 'Feed & skin-to-skin snuggle', type: 'feed' },
      { time: '04:50 PM', event: 'Catnap 4 (power nap)', type: 'nap' },
      { time: '07:00 PM', event: 'Feed & evening cuddle', type: 'feed' },
      { time: '08:30 PM', event: 'Bedtime routine: Warm sponge, swaddle, lullaby', type: 'routine' },
      { time: '09:00 PM', event: 'Night Sleep begins', type: 'bedtime' }
    ]
  },
  {
    id: 'infant-early',
    ageLabel: '3 – 4 Months',
    monthsRange: [3, 4],
    typicalTotalSleep: '14 – 16 hours',
    wakeWindowRange: '75 – 100 mins',
    wakeWindowMinutes: [75, 100],
    napsPerDay: '3 – 4 naps',
    napCount: 4,
    bedtimeRange: '7:30 PM – 8:30 PM',
    nightSleepStretch: '4 – 6 hours',
    keyMilestones: [
      'Melatonin production begins naturally',
      'Developing 4 distinct adult-like sleep stages',
      'Social smiling & recognizing bedtime cues'
    ],
    regressionRisk: '4-Month Sleep Regression (permanent developmental maturation of sleep cycles)',
    expertTip: 'Focus on consistent sleep cues (dark room, sleep sack, white noise) so baby learns to transition between sleep cycles smoothly.',
    sampleSchedule: [
      { time: '07:00 AM', event: 'Wake up, nurse/bottle & natural sunlight', type: 'wake' },
      { time: '08:30 AM', event: 'Nap 1 (Morning Nap ~1.5h)', type: 'nap' },
      { time: '10:00 AM', event: 'Feed, sensory toys & play mat', type: 'feed' },
      { time: '11:45 AM', event: 'Nap 2 (Midday Nap ~1.5h)', type: 'nap' },
      { time: '01:15 PM', event: 'Feed & gentle book reading', type: 'feed' },
      { time: '03:00 PM', event: 'Nap 3 (Afternoon Nap ~45m)', type: 'nap' },
      { time: '04:00 PM', event: 'Feed & outdoor carrier walk', type: 'feed' },
      { time: '05:30 PM', event: 'Nap 4 (Short bridge catnap 30m)', type: 'nap' },
      { time: '07:00 PM', event: 'Bedtime routine: Warm bath, lotion massage, song', type: 'routine' },
      { time: '07:45 PM', event: 'Bedtime down in crib (drowsy & calm)', type: 'bedtime' }
    ]
  },
  {
    id: 'infant-mid',
    ageLabel: '5 – 7 Months',
    monthsRange: [5, 7],
    typicalTotalSleep: '13 – 15 hours',
    wakeWindowRange: '2.0 – 2.75 hours',
    wakeWindowMinutes: [120, 165],
    napsPerDay: '3 naps (dropping to 2)',
    napCount: 3,
    bedtimeRange: '7:00 PM – 8:00 PM',
    nightSleepStretch: '6 – 8 hours',
    keyMilestones: [
      'Consolidating longer stretches of uninterrupted night rest',
      'Rolling over both ways, transitioning out of swaddle',
      'Starting first solid foods (purees)'
    ],
    regressionRisk: 'Teething & gross motor leap (rolling/sitting up in crib)',
    expertTip: 'When Nap 3 pushes bedtime too late, cap it at 30 minutes or transition to a predictable 2-nap schedule.',
    sampleSchedule: [
      { time: '06:45 AM', event: 'Morning Wake up, milk feed & solid breakfast', type: 'wake' },
      { time: '09:00 AM', event: 'Nap 1 (90 minutes deep rest)', type: 'nap' },
      { time: '10:30 AM', event: 'Milk feed & tummy crawling practice', type: 'feed' },
      { time: '01:00 PM', event: 'Nap 2 (60-90 minutes)', type: 'nap' },
      { time: '02:30 PM', event: 'Afternoon feed, mirror play & park walk', type: 'feed' },
      { time: '04:45 PM', event: 'Nap 3 (quick 30 min bridge nap)', type: 'nap' },
      { time: '06:30 PM', event: 'Dinner, bath, story & sleep sack', type: 'routine' },
      { time: '07:15 PM', event: 'Bedtime down for night rest', type: 'bedtime' }
    ]
  },
  {
    id: 'infant-late',
    ageLabel: '8 – 11 Months',
    monthsRange: [8, 11],
    typicalTotalSleep: '12 – 14 hours',
    wakeWindowRange: '2.75 – 3.75 hours',
    wakeWindowMinutes: [165, 225],
    napsPerDay: '2 solid naps',
    napCount: 2,
    bedtimeRange: '7:00 PM – 7:45 PM',
    nightSleepStretch: '10 – 12 hours',
    keyMilestones: [
      'Established 2-nap schedule (morning + afternoon)',
      'Pulling up to stand, babbling words',
      'Separation anxiety peak'
    ],
    regressionRisk: '8-9 Month regression due to crawling/standing and object permanence',
    expertTip: 'Practice standing up and sitting down during daytime playtime so baby does not get stuck standing in their crib at night.',
    sampleSchedule: [
      { time: '07:00 AM', event: 'Wake up, morning milk & oat cereal', type: 'wake' },
      { time: '09:45 AM', event: 'Nap 1 (1.25 hours)', type: 'nap' },
      { time: '11:00 AM', event: 'Lunch with finger foods & play', type: 'feed' },
      { time: '02:15 PM', event: 'Nap 2 (1.25 hours)', type: 'nap' },
      { time: '03:30 PM', event: 'Snack, active play, outdoor stroll', type: 'feed' },
      { time: '06:00 PM', event: 'Dinner with family', type: 'feed' },
      { time: '06:45 PM', event: 'Bedtime routine: Bath, pajamas, 2 stories, lullaby', type: 'routine' },
      { time: '07:30 PM', event: 'Night Sleep (Independent settling)', type: 'bedtime' }
    ]
  },
  {
    id: 'toddler-early',
    ageLabel: '12 – 18 Months',
    monthsRange: [12, 18],
    typicalTotalSleep: '12 – 14 hours',
    wakeWindowRange: '3.5 – 5.0 hours',
    wakeWindowMinutes: [210, 300],
    napsPerDay: '1 – 2 naps',
    napCount: 1,
    bedtimeRange: '7:15 PM – 8:00 PM',
    nightSleepStretch: '11 – 12 hours',
    keyMilestones: [
      'Transition from 2 naps down to 1 midday nap (usually around 14-16m)',
      'First steps and walking confidence',
      'More independent personality & bedtime protests'
    ],
    regressionRisk: '12-Month nap strike (often mistaken for readiness for 1 nap)',
    expertTip: 'Do not rush the 1-nap transition too early. If baby resists nap 2, keep offering quiet crib rest time.',
    sampleSchedule: [
      { time: '07:00 AM', event: 'Wake up, morning milk & breakfast', type: 'wake' },
      { time: '12:00 PM', event: 'Midday Lunch & quiet wind-down', type: 'feed' },
      { time: '12:45 PM', event: 'Restorative Midday Nap (2 hours)', type: 'nap' },
      { time: '02:45 PM', event: 'Wake up, fruit snack & active park play', type: 'feed' },
      { time: '06:00 PM', event: 'Family dinner', type: 'feed' },
      { time: '07:00 PM', event: 'Bedtime routine: Warm wash, teeth brush, bedtime book', type: 'routine' },
      { time: '07:45 PM', event: 'Bedtime & uninterrupted night sleep', type: 'bedtime' }
    ]
  }
];

export const SOOTHING_SOUNDS: SoundTrack[] = [
  {
    id: 'white-noise-pure',
    name: 'Gentle White Noise',
    category: 'White Noise',
    description: 'Calming constant frequency that masks household sounds and mimics the continuous hum baby heard in the womb.',
    icon: 'Waves',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    bgGradient: 'from-amber-50 to-orange-50',
    synthesizerType: 'white_noise'
  },
  {
    id: 'pink-noise-cozy',
    name: 'Warm Pink Noise',
    category: 'White Noise',
    description: 'Deeper, softer acoustic slope proven to encourage longer slow-wave deep sleep cycles.',
    icon: 'Sparkles',
    color: 'text-rose-700 bg-rose-50 border-rose-200',
    bgGradient: 'from-rose-50 to-pink-50',
    synthesizerType: 'pink_noise'
  },
  {
    id: 'brown-noise-deep',
    name: 'Deep Brown Noise',
    category: 'White Noise',
    description: 'Rich low-frequency rumble reminiscent of a heavy waterfall, comforting for restless infants.',
    icon: 'Volume2',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    bgGradient: 'from-emerald-50 to-teal-50',
    synthesizerType: 'brown_noise'
  },
  {
    id: 'womb-heartbeat',
    name: 'Womb & Steady Heartbeat',
    category: 'Womb & Heartbeat',
    description: 'Rhythmic 68 BPM heartbeat matching mother’s resting pulse to trigger instant calming reflex.',
    icon: 'Heart',
    color: 'text-red-700 bg-red-50 border-red-200',
    bgGradient: 'from-red-50 to-rose-50',
    synthesizerType: 'heartbeat'
  },
  {
    id: 'soft-rain-window',
    name: 'Gentle Nursery Rain',
    category: 'Nature',
    description: 'Soft raindrops falling gently against nursery window panes for serene nighttime tranquility.',
    icon: 'CloudRain',
    color: 'text-sky-700 bg-sky-50 border-sky-200',
    bgGradient: 'from-sky-50 to-blue-50',
    synthesizerType: 'rain'
  },
  {
    id: 'ocean-tide-sway',
    name: 'Ocean Waves Rhythm',
    category: 'Nature',
    description: 'Slow, rolling ocean waves that guide parent and baby into calm, synchronized breathing.',
    icon: 'Wind',
    color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    bgGradient: 'from-cyan-50 to-sky-50',
    synthesizerType: 'ocean_waves'
  },
  {
    id: 'brahms-lullaby',
    name: 'Celeste Lullaby Melody',
    category: 'Lullaby',
    description: 'Delicate music-box bell notes playing timeless gentle lullaby melodies for peaceful bedtime drift.',
    icon: 'Music',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    bgGradient: 'from-purple-50 to-indigo-50',
    synthesizerType: 'lullaby_melody'
  }
];

export const SLEEP_GUIDES: SleepGuide[] = [
  {
    id: 'guide-5s',
    title: 'The Pediatric 5S Soothing Technique',
    readTime: '4 min read',
    category: 'Newborn Essentials',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    summary: 'Dr. Harvey Karp’s gold-standard method to trigger the innate calming reflex in fussy newborns in under 60 seconds.',
    keySteps: [
      'Swaddle: Snug wrapping with arms by sides prevents startling moro reflex.',
      'Side or Stomach Position: Hold baby on their side or stomach in your arms (always back to sleep in crib).',
      'Shush: Make a strong "shhh" sound right near baby’s ear as loud as their crying.',
      'Swing: Gentle, rhythmic jiggling motion supporting the head.',
      'Suck: Offer a clean pacifier or clean pinky finger to settle.'
    ],
    pediatricNote: 'Safe Sleep Rule: Once placed down in the crib or bassinet, baby must always be laid flat on their back on a firm mattress.'
  },
  {
    id: 'guide-4m-regression',
    title: 'Demystifying the 4-Month Sleep Regression',
    readTime: '6 min read',
    category: 'Regressions',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    summary: 'Why your previously good sleeper suddenly wakes every 45 minutes, and how this developmental milestone is actually a leap forward.',
    keySteps: [
      'Understand the Shift: Sleep changes from 2 simple stages to 4 adult-like stages. Babies now wake briefly between 45-min cycles.',
      'Pause Before Rushing In: Give baby 2-3 minutes to attempt self-settling if they are simply grunting or fussing lightly.',
      'Gradual Night Weaning of Crutches: Gradually reduce rocking to dead sleep; aim to lay baby down when calm but slightly awake.',
      'Protect Daytime Calories: Increase full feeds during daytime light to avoid hunger-driven hourly night wakings.'
    ],
    pediatricNote: 'This regression is permanent sleep cycle maturation. Setting gentle, consistent sleep habits now pays dividends for years.'
  },
  {
    id: 'guide-bedtime-routine',
    title: 'The 20-Minute Calming Bedtime Ritual',
    readTime: '5 min read',
    category: 'Nap Routines',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    summary: 'A bulletproof, loving sequence that cues your baby’s brain to release natural melatonin and prepare for rest.',
    keySteps: [
      'Step 1 (T-20 min): Warm dim bath or soothing warm washcloth massage.',
      'Step 2 (T-15 min): Diaper change & breathable organic cotton sleep sack.',
      'Step 3 (T-10 min): Dim nursery lights to 10%, turn on pink noise or rain sound.',
      'Step 4 (T-5 min): Read 1-2 board books with low, soothing cadence.',
      'Step 5 (T-0 min): Final goodnight phrase ("I love you, time to sleep") and into crib.'
    ],
    pediatricNote: 'Keep the sequence identical every single night—even when traveling—to create an unbreakable psychological sleep anchor.'
  },
  {
    id: 'guide-drowsy-awake',
    title: 'Drowsy but Awake: Practical Steps',
    readTime: '5 min read',
    category: 'Sleep Training',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    summary: 'How to practice independent sleep skills with zero harsh crying or abandonment.',
    keySteps: [
      'Recognize Sleepy Cues Early: Rubbing eyes, staring off into distance, red eyebrows, slower movements.',
      'Catch the Sweet Spot: If baby is crying or yawning heavily, they are already overtired and need extra comfort.',
      'The "Heavy Lids" Stage: Lay baby down when eyes are blinking slowly but still open.',
      'The Hand-on-Chest Reassurance: Keep your warm palm on baby’s chest for 30 seconds after placing them down so they feel grounded.'
    ],
    pediatricNote: 'Be patient. If baby gets too upset, soothe fully and try again for the first morning nap tomorrow when sleep pressure is highest.'
  }
];

export const CAREGIVERS_LIST: Caregiver[] = [
  {
    id: 'caregiver-1',
    name: 'Sarah (Mom)',
    role: 'Mom',
    avatarBg: 'bg-rose-100 text-rose-700 border-rose-200',
    avatarEmoji: '👩‍🦰',
    lastActive: 'Logged 45 min nap 20m ago',
    isCurrentShift: true
  },
  {
    id: 'caregiver-2',
    name: 'David (Dad)',
    role: 'Dad',
    avatarBg: 'bg-sky-100 text-sky-700 border-sky-200',
    avatarEmoji: '👨‍🦱',
    lastActive: 'Handled 3:45 AM night feed (120ml)',
    isCurrentShift: false
  },
  {
    id: 'caregiver-3',
    name: 'Elena (Nanny)',
    role: 'Nanny',
    avatarBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    avatarEmoji: '👩‍⚕️',
    lastActive: 'Logged 1.5h afternoon nap yesterday',
    isCurrentShift: false
  },
  {
    id: 'caregiver-4',
    name: 'Martha (Grandma)',
    role: 'Grandparent',
    avatarBg: 'bg-purple-100 text-purple-700 border-purple-200',
    avatarEmoji: '👵',
    lastActive: 'Checked bedtime schedule 2h ago',
    isCurrentShift: false
  }
];

export const INITIAL_SLEEP_LOGS: SleepLog[] = [
  {
    id: 'log-1',
    type: 'night',
    startTime: '19:45',
    endTime: '06:50',
    durationMinutes: 665,
    quality: 'peaceful',
    moodUponWaking: 'happy',
    notes: 'Slept like a champ! Only 1 brief nursing feed at 3:15 AM. Settled back down within 10 minutes.',
    loggedBy: 'David (Dad)',
    caregiverAvatar: '👨‍🦱',
    date: 'Today'
  },
  {
    id: 'log-2',
    type: 'nap',
    startTime: '08:45',
    endTime: '10:15',
    durationMinutes: 90,
    quality: 'peaceful',
    moodUponWaking: 'peaceful',
    notes: 'Morning Nap 1 went smoothly in crib with pink noise. Woke up smiling.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  },
  {
    id: 'log-3',
    type: 'nap',
    startTime: '12:30',
    endTime: '14:00',
    durationMinutes: 90,
    quality: 'peaceful',
    moodUponWaking: 'happy',
    notes: 'Midday Nap 2 after tummy time. Fast asleep in 4 minutes flat.',
    loggedBy: 'Elena (Nanny)',
    caregiverAvatar: '👩‍⚕️',
    date: 'Today'
  },
  {
    id: 'log-4',
    type: 'nap',
    startTime: '16:15',
    endTime: '16:50',
    durationMinutes: 35,
    quality: 'restless',
    moodUponWaking: 'fussy',
    notes: 'Short catnap in stroller. Woke up when dog barked, but bridged to dinner.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  }
];

export const INITIAL_FEED_LOGS: FeedLog[] = [
  {
    id: 'feed-1',
    feedType: 'nursing',
    time: '07:05',
    durationMinutes: 20,
    breastSide: 'both',
    notes: 'Morning wake-up feed (10m left, 10m right). Strong latch, very alert.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  },
  {
    id: 'feed-2',
    feedType: 'formula',
    time: '10:30',
    amountMl: 150,
    amountOz: 5,
    notes: 'Warm organic formula bottle after Nap 1. Finished whole bottle peacefully.',
    loggedBy: 'David (Dad)',
    caregiverAvatar: '👨‍🦱',
    date: 'Today'
  },
  {
    id: 'feed-3',
    feedType: 'pumped_milk',
    time: '14:15',
    amountMl: 130,
    amountOz: 4.5,
    notes: 'Pumped breast milk bottle after afternoon nap. Burped nicely twice.',
    loggedBy: 'Elena (Nanny)',
    caregiverAvatar: '👩‍⚕️',
    date: 'Today'
  },
  {
    id: 'feed-4',
    feedType: 'nursing',
    time: '18:45',
    durationMinutes: 25,
    breastSide: 'left',
    notes: 'Bedtime nursing session. Drank calmly and got drowsy in rocking chair.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  }
];

export const INITIAL_DIAPER_LOGS: DiaperLog[] = [
  {
    id: 'diaper-1',
    diaperType: 'wet',
    time: '07:15',
    hasRashCream: false,
    notes: 'Heavy morning wet diaper right after waking up.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  },
  {
    id: 'diaper-2',
    diaperType: 'both',
    time: '10:45',
    hasRashCream: true,
    notes: 'Wet + dirty diaper after bottle. Applied organic soothing zinc cream.',
    loggedBy: 'David (Dad)',
    caregiverAvatar: '👨‍🦱',
    date: 'Today'
  },
  {
    id: 'diaper-3',
    diaperType: 'wet',
    time: '14:20',
    hasRashCream: false,
    notes: 'Clean change before playtime.',
    loggedBy: 'Elena (Nanny)',
    caregiverAvatar: '👩‍⚕️',
    date: 'Today'
  },
  {
    id: 'diaper-4',
    diaperType: 'dirty',
    time: '17:30',
    hasRashCream: true,
    notes: 'Normal texture and color. Cleaned with gentle water wipes.',
    loggedBy: 'David (Dad)',
    caregiverAvatar: '👨‍🦱',
    date: 'Today'
  },
  {
    id: 'diaper-5',
    diaperType: 'wet',
    time: '19:15',
    hasRashCream: true,
    notes: 'Overnight extra-absorbent diaper before bedtime sleep sack.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  }
];

export const INITIAL_ACTIVITY_LOGS: CustomActivityLog[] = [
  {
    id: 'act-1',
    activityType: 'tummy_time',
    title: 'Morning Tummy Time',
    time: '11:00',
    durationMinutes: 15,
    notes: 'Great head control lifting chest off mat and smiling at sensory mirror!',
    loggedBy: 'David (Dad)',
    caregiverAvatar: '👨‍🦱',
    date: 'Today'
  },
  {
    id: 'act-2',
    activityType: 'play',
    title: 'Stroller Walk & Fresh Air',
    time: '15:00',
    durationMinutes: 30,
    notes: 'Sunny stroll in the neighborhood. Loved looking at tree leaves.',
    loggedBy: 'Elena (Nanny)',
    caregiverAvatar: '👩‍⚕️',
    date: 'Today'
  },
  {
    id: 'act-3',
    activityType: 'bath',
    title: 'Calming Bedtime Bath',
    time: '18:15',
    durationMinutes: 15,
    notes: 'Warm water splash with gentle lavender wash. Super relaxed afterwards.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  },
  {
    id: 'act-4',
    activityType: 'medicine',
    title: 'Daily Vitamin D Drops',
    time: '08:00',
    notes: '1 drop on pacifier during morning routine.',
    loggedBy: 'Sarah (Mom)',
    caregiverAvatar: '👩‍🦰',
    date: 'Today'
  }
];

export const WEEKLY_SLEEP_PATTERNS: DaySleepPattern[] = [
  {
    dayLabel: 'Monday',
    shortDay: 'Mon',
    dateStr: 'Aug 17',
    totalHours: 14.3,
    nightHours: 10.5,
    napHours: 3.8,
    napsCount: 3,
    nightWakes: 1,
    qualityScore: 94,
    onsetLatencyMins: 10,
    segments: [
      { type: 'night', name: 'Night Sleep (Early Morning)', startTime: '00:00', endTime: '06:45', startPercent: 0, widthPercent: 28.1, durationMins: 405, quality: 'peaceful' },
      { type: 'nap', name: 'Morning Nap 1', startTime: '08:45', endTime: '10:15', startPercent: 36.5, widthPercent: 6.2, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Midday Nap 2', startTime: '12:30', endTime: '14:00', startPercent: 52.1, widthPercent: 6.2, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Catnap 3', startTime: '16:30', endTime: '17:15', startPercent: 68.75, widthPercent: 3.1, durationMins: 45, quality: 'restless' },
      { type: 'night', name: 'Night Sleep (Bedtime)', startTime: '19:45', endTime: '24:00', startPercent: 82.3, widthPercent: 17.7, durationMins: 255, quality: 'peaceful' },
    ]
  },
  {
    dayLabel: 'Tuesday',
    shortDay: 'Tue',
    dateStr: 'Aug 18',
    totalHours: 14.0,
    nightHours: 10.2,
    napHours: 3.8,
    napsCount: 3,
    nightWakes: 2,
    qualityScore: 89,
    onsetLatencyMins: 14,
    segments: [
      { type: 'night', name: 'Night Sleep (Early Morning)', startTime: '00:00', endTime: '06:30', startPercent: 0, widthPercent: 27.1, durationMins: 390, quality: 'peaceful' },
      { type: 'nap', name: 'Morning Nap 1', startTime: '08:30', endTime: '10:00', startPercent: 35.4, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Midday Nap 2', startTime: '12:15', endTime: '13:45', startPercent: 51.0, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Catnap 3', startTime: '16:15', endTime: '17:00', startPercent: 67.7, widthPercent: 3.1, durationMins: 45, quality: 'peaceful' },
      { type: 'night', name: 'Night Sleep (Bedtime)', startTime: '19:30', endTime: '24:00', startPercent: 81.25, widthPercent: 18.75, durationMins: 270, quality: 'peaceful' },
    ]
  },
  {
    dayLabel: 'Wednesday',
    shortDay: 'Wed',
    dateStr: 'Aug 19',
    totalHours: 14.8,
    nightHours: 11.0,
    napHours: 3.8,
    napsCount: 3,
    nightWakes: 1,
    qualityScore: 96,
    onsetLatencyMins: 8,
    segments: [
      { type: 'night', name: 'Night Sleep (Early Morning)', startTime: '00:00', endTime: '07:00', startPercent: 0, widthPercent: 29.1, durationMins: 420, quality: 'peaceful' },
      { type: 'nap', name: 'Morning Nap 1', startTime: '09:00', endTime: '10:30', startPercent: 37.5, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Midday Nap 2', startTime: '13:00', endTime: '14:30', startPercent: 54.1, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Catnap 3', startTime: '16:45', endTime: '17:30', startPercent: 69.8, widthPercent: 3.1, durationMins: 45, quality: 'peaceful' },
      { type: 'night', name: 'Night Sleep (Bedtime)', startTime: '20:00', endTime: '24:00', startPercent: 83.3, widthPercent: 16.7, durationMins: 240, quality: 'peaceful' },
    ]
  },
  {
    dayLabel: 'Thursday',
    shortDay: 'Thu',
    dateStr: 'Aug 20',
    totalHours: 13.7,
    nightHours: 10.0,
    napHours: 3.7,
    napsCount: 3,
    nightWakes: 2,
    qualityScore: 88,
    onsetLatencyMins: 18,
    segments: [
      { type: 'night', name: 'Night Sleep (Early Morning)', startTime: '00:00', endTime: '06:30', startPercent: 0, widthPercent: 27.1, durationMins: 390, quality: 'restless' },
      { type: 'nap', name: 'Morning Nap 1', startTime: '08:45', endTime: '10:00', startPercent: 36.5, widthPercent: 5.2, durationMins: 75, quality: 'peaceful' },
      { type: 'nap', name: 'Midday Nap 2', startTime: '12:30', endTime: '14:15', startPercent: 52.1, widthPercent: 7.3, durationMins: 105, quality: 'peaceful' },
      { type: 'nap', name: 'Catnap 3', startTime: '16:30', endTime: '17:15', startPercent: 68.75, widthPercent: 3.1, durationMins: 45, quality: 'restless' },
      { type: 'night', name: 'Night Sleep (Bedtime)', startTime: '19:45', endTime: '24:00', startPercent: 82.3, widthPercent: 17.7, durationMins: 255, quality: 'peaceful' },
    ]
  },
  {
    dayLabel: 'Friday',
    shortDay: 'Fri',
    dateStr: 'Aug 21',
    totalHours: 14.6,
    nightHours: 10.8,
    napHours: 3.8,
    napsCount: 3,
    nightWakes: 1,
    qualityScore: 95,
    onsetLatencyMins: 9,
    segments: [
      { type: 'night', name: 'Night Sleep (Early Morning)', startTime: '00:00', endTime: '06:50', startPercent: 0, widthPercent: 28.5, durationMins: 410, quality: 'peaceful' },
      { type: 'nap', name: 'Morning Nap 1', startTime: '08:45', endTime: '10:15', startPercent: 36.5, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Midday Nap 2', startTime: '12:45', endTime: '14:15', startPercent: 53.1, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Catnap 3', startTime: '16:30', endTime: '17:15', startPercent: 68.75, widthPercent: 3.1, durationMins: 45, quality: 'peaceful' },
      { type: 'night', name: 'Night Sleep (Bedtime)', startTime: '19:30', endTime: '24:00', startPercent: 81.25, widthPercent: 18.75, durationMins: 270, quality: 'peaceful' },
    ]
  },
  {
    dayLabel: 'Saturday',
    shortDay: 'Sat',
    dateStr: 'Aug 22',
    totalHours: 14.2,
    nightHours: 10.4,
    napHours: 3.8,
    napsCount: 3,
    nightWakes: 1,
    qualityScore: 92,
    onsetLatencyMins: 12,
    segments: [
      { type: 'night', name: 'Night Sleep (Early Morning)', startTime: '00:00', endTime: '06:45', startPercent: 0, widthPercent: 28.1, durationMins: 405, quality: 'peaceful' },
      { type: 'nap', name: 'Morning Nap 1', startTime: '09:00', endTime: '10:30', startPercent: 37.5, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Midday Nap 2', startTime: '13:00', endTime: '14:30', startPercent: 54.1, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Catnap 3', startTime: '16:45', endTime: '17:30', startPercent: 69.8, widthPercent: 3.1, durationMins: 45, quality: 'peaceful' },
      { type: 'night', name: 'Night Sleep (Bedtime)', startTime: '19:45', endTime: '24:00', startPercent: 82.3, widthPercent: 17.7, durationMins: 255, quality: 'peaceful' },
    ]
  },
  {
    dayLabel: 'Today (Sunday)',
    shortDay: 'Sun',
    dateStr: 'Today',
    totalHours: 14.5,
    nightHours: 11.0,
    napHours: 3.5,
    napsCount: 3,
    nightWakes: 1,
    qualityScore: 96,
    onsetLatencyMins: 8,
    segments: [
      { type: 'night', name: 'Night Sleep (Early Morning)', startTime: '00:00', endTime: '06:50', startPercent: 0, widthPercent: 28.5, durationMins: 410, quality: 'peaceful' },
      { type: 'nap', name: 'Morning Nap 1', startTime: '08:45', endTime: '10:15', startPercent: 36.5, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Midday Nap 2', startTime: '12:30', endTime: '14:00', startPercent: 52.1, widthPercent: 6.25, durationMins: 90, quality: 'peaceful' },
      { type: 'nap', name: 'Catnap 3', startTime: '16:15', endTime: '16:50', startPercent: 67.7, widthPercent: 2.4, durationMins: 35, quality: 'restless' },
      { type: 'night', name: 'Night Sleep (Projected)', startTime: '19:45', endTime: '24:00', startPercent: 82.3, widthPercent: 17.7, durationMins: 255, quality: 'peaceful' },
    ]
  }
];
