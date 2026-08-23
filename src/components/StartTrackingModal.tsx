import React, { useState } from 'react';
import { Moon, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BabyProfile } from '../types';

interface StartTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSetup: (profile: BabyProfile) => void;
}

export const StartTrackingModal: React.FC<StartTrackingModalProps> = ({
  isOpen,
  onClose,
  onCompleteSetup,
}) => {
  const [babyName, setBabyName] = useState<string>('Leo');
  const [ageMonths, setAgeMonths] = useState<number>(4);
  const [gender] = useState<'boy' | 'girl' | 'prefer_not_to_say'>('boy');
  const [sleepGoal, setSleepGoal] = useState<string>('Longer uninterrupted night stretches');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [targetBedtime, setTargetBedtime] = useState<string>('19:30');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerateMasterplan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5A5F', '#38BDF8', '#C084FC', '#FDE047']
    });
  };

  const handleFinish = () => {
    const profile: BabyProfile = {
      name: babyName || 'Baby',
      ageMonths,
      birthDate: '2026-04-10',
      gender,
      wakeTime,
      targetBedtime,
      sleepGoal
    };
    onCompleteSetup(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[36px] border-2 border-[#E7DDD5] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E6DD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#1C1917] flex items-center justify-center text-xl shadow-xs border border-[#FDE68A]">
              👶
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Start Tracking with Sleepy Lullaby Dreams
              </h3>
              <p className="text-xs text-[#57534E] font-medium">
                Personalized Sleep Plan for Your Baby
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#FFFBF7] hover:bg-[#F0E6DD] text-[#1C1917] transition-colors cursor-pointer border-2 border-[#D6C7BC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isGenerated ? (
          <form onSubmit={handleGenerateMasterplan} className="space-y-5">
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-extrabold text-[#57534E] px-2">
              <span className="text-[#FF5A5F]">1. Baby Details</span>
              <span>2. Sleep Goals</span>
              <span>3. Masterplan</span>
            </div>

            {/* Baby Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                  Baby’s Name or Nickname
                </label>
                <input
                  type="text"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder="e.g. Leo, Maya, Oliver"
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-full border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                  Baby’s Age (Months)
                </label>
                <select
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#FFFBF7] rounded-full border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                >
                  <option value={1}>1 Month (Newborn)</option>
                  <option value={2}>2 Months (Developing rhythm)</option>
                  <option value={3}>3 Months (Melatonin starting)</option>
                  <option value={4}>4 Months (4-Month Regression stage)</option>
                  <option value={5}>5 Months (Rolling & 3 naps)</option>
                  <option value={6}>6 Months (First solids & 3 naps)</option>
                  <option value={7}>7 Months (2-3 naps transition)</option>
                  <option value={8}>8 Months (2 solid naps)</option>
                  <option value={9}>9 Months (Standing / crawling)</option>
                  <option value={12}>12 Months (Toddler transition)</option>
                  <option value={15}>15 Months (1-2 naps)</option>
                </select>
              </div>
            </div>

            {/* Primary Sleep Goal */}
            <div>
              <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                What is your top priority right now?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Longer uninterrupted night stretches',
                  'Extending 30-minute short naps',
                  'Predictable daily wake window routine',
                  'Gentle bedtime without crying'
                ].map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => setSleepGoal(goal)}
                    className={`p-3.5 rounded-2xl border-2 text-xs font-bold text-left transition-all cursor-pointer ${
                      sleepGoal === goal
                        ? 'bg-[#FFF1F2] border-[#FF5A5F] text-[#1C1917] shadow-xs'
                        : 'bg-[#FFFBF7]/60 border-[#E7DDD5] text-[#292524] hover:bg-white hover:border-[#D6C7BC]'
                    }`}
                  >
                    {sleepGoal === goal && '✓ '} {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Usual Morning Wake & Target Bedtime */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                  Typical Morning Wake
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FFFBF7] rounded-full border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#1C1917] mb-1.5">
                  Ideal Bedtime
                </label>
                <input
                  type="time"
                  value={targetBedtime}
                  onChange={(e) => setTargetBedtime(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FFFBF7] rounded-full border-2 border-[#D6C7BC] text-sm text-[#1C1917] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-xl shadow-[#FF5A5F]/35 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate {babyName}’s Sleep Masterplan</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Personalized Generated Masterplan */
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-[#FFFBF7] border-2 border-[#E7DDD5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#57534E]">
                  Custom Plan Generated
                </span>
                <span className="px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#1E7B28] border border-[#C8E6C9] text-xs font-bold">
                  Ready to Track
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-[#1C1917]">
                {babyName}’s Circadian Blueprint ({ageMonths} Months)
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-3 rounded-2xl bg-white border-2 border-[#E7DDD5]">
                  <p className="text-[10px] uppercase font-extrabold text-[#57534E]">Wake Window</p>
                  <p className="font-serif text-sm font-bold text-[#1C1917] mt-0.5">
                    {ageMonths <= 2 ? '45-60 min' : ageMonths <= 4 ? '1.5 - 1.75h' : ageMonths <= 7 ? '2.0 - 2.5h' : '2.75 - 3.25h'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-[#E7DDD5]">
                  <p className="text-[10px] uppercase font-extrabold text-[#57534E]">Naps / Day</p>
                  <p className="font-serif text-sm font-bold text-[#1C1917] mt-0.5">
                    {ageMonths <= 2 ? '4-5 Naps' : ageMonths <= 4 ? '3-4 Naps' : ageMonths <= 8 ? '2-3 Naps' : '2 Naps'}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white border-2 border-[#E7DDD5]">
                  <p className="text-[10px] uppercase font-extrabold text-[#57534E]">Night Target</p>
                  <p className="font-serif text-sm font-bold text-[#FF5A5F] mt-0.5">
                    {targetBedtime}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#292524] font-medium leading-relaxed pt-2 border-t border-[#F0E6DD]">
                ✨ <strong>Pediatric Strategy:</strong> To achieve <em>"{sleepGoal}"</em>, we will notify your family 15 minutes before the sweet spot window closes, keeping {babyName} well-rested and calm.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsGenerated(false)}
                className="px-5 py-3 rounded-full text-xs font-bold text-[#1C1917] bg-[#FFFBF7] border-2 border-[#D6C7BC] hover:bg-[#F0E6DD]"
              >
                Back / Edit
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-xl shadow-[#FF5A5F]/35 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Moon className="w-4 h-4 fill-white" />
                <span>Start Live Tracking with this Plan</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
