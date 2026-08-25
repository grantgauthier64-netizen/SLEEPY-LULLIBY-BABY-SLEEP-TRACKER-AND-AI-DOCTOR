import React, { useState } from 'react';
import { Moon, Sparkles, Heart, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FooterProps {
  onOpenStartTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStartTracking }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const faqs = [
    {
      q: 'What is a "Wake Window" and how does Sleepy Lullaby Dreams calculate it?',
      a: 'A wake window is the duration of time your baby can comfortably stay awake between sleep periods before their body releases cortisol and adrenaline (becoming overtired). Sleepy Lullaby Dreams uses age-specific circadian markers and your baby’s actual waking times to predict the exact 15-minute "Sweet Spot" when sleep pressure is optimal.'
    },
    {
      q: 'Does Sleepy Lullaby Dreams require letting my baby "cry it out"?',
      a: 'Never. Sleepy Lullaby Dreams is 100% gentle and evidence-based. We focus on biological sleep timing, circadian alignment, environmental soothing cues, and responsive parenting techniques.'
    },
    {
      q: 'Can both parents and our nanny log sleep at the same time?',
      a: 'Yes! Every account includes unlimited caregiver profiles with real-time multi-device sync across iPhone, Android, tablets, and web browsers.'
    },
    {
      q: 'Is the white noise and pink noise safe for newborn hearing?',
      a: 'Yes. All sound profiles are low-pass filtered to eliminate harsh high-frequency treble. When played at recommended household volumes (~50-60 dB, placed at least 6 feet from the crib), it provides safe, gentle acoustic masking.'
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.9 },
      colors: ['#FF5A5F', '#38BDF8', '#C084FC', '#FDE047']
    });
  };

  return (
    <footer id="app-footer" className="bg-[#1C1917] text-[#E7DDD5] pt-20 pb-12 relative overflow-hidden">
      
      {/* Gentle Ambient Warm Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#FF5A5F]/20 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Pre-Footer CTA Card */}
        <div className="mb-20 p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-[#292524] to-[#1C1917] border border-white/15 text-center space-y-6 shadow-2xl relative">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-[#FF5A5F] text-xs font-extrabold uppercase tracking-widest border border-white/10">
            Join 85,000+ Well-Rested Parents
          </div>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white max-w-2xl mx-auto leading-tight">
            Give your family the gift of gentle, <span className="text-[#FF5A5F] italic">predictable sleep tonight.</span>
          </h3>

          <p className="text-sm sm:text-base text-[#D6D3D1] max-w-xl mx-auto leading-relaxed font-normal">
            No credit card required. Experience personalized sweet spots, soothing sounds, and synchronized care in minutes.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenStartTracking}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-extrabold text-white bg-[#FF5A5F] hover:bg-[#FF4147] active:scale-95 shadow-xl shadow-[#FF5A5F]/35 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Moon className="w-4 h-4 fill-white" />
              <span>Start Tracking Your Baby Free</span>
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 max-w-3xl mx-auto space-y-4">
          <h4 className="font-serif text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions for New Parents
          </h4>

          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/10"
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#FF5A5F] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#FF5A5F] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#D6D3D1] font-normal leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Navigation Columns with Rich Target Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5A5F] flex items-center justify-center shadow-md shadow-[#FF5A5F]/30">
                <Moon className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-white">
                Sleepy Lullaby AI
              </span>
            </div>
            <p className="text-xs text-[#A8A29E] leading-relaxed max-w-sm">
              The premier <strong>AI Baby Sleep Tracker</strong>, <strong>AI Sleep Coach</strong>, and <strong>Newborn Baby Sleep and Feeding Tracker with AI</strong>. Evidence-based pediatric support for well-rested families.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#4ADE80] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
              <span>AAP Safe Sleep & Pediatric Guidelines Compliant</span>
            </div>
          </div>

          {/* AI Sleep Tracker & Schedules */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              AI Sleep Coach
            </h5>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li><a href="#ai-baby-seo-knowledge-hub" className="hover:text-white transition-colors">AI Baby Sleep Tracker</a></li>
              <li><a href="#personalized-schedules" className="hover:text-white transition-colors">Baby Sleep Schedule App</a></li>
              <li><a href="#sleep-patterns" className="hover:text-white transition-colors">Newborn Sleep Tracker</a></li>
              <li><a href="#personalized-schedules" className="hover:text-white transition-colors">Wake Window Calculator</a></li>
              <li><a href="#sounds-guides" className="hover:text-white transition-colors">Pink & Brown Noise Machine</a></li>
            </ul>
          </div>

          {/* AI Pediatrician & Symptoms */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              AI Doctor & Health
            </h5>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li><a href="#on-site-ai-doctor" className="hover:text-white transition-colors">AI Pediatrician for Parents</a></li>
              <li><a href="#on-site-ai-doctor" className="hover:text-white transition-colors">AI Baby Health Assistant</a></li>
              <li><a href="#track-everything" className="hover:text-white transition-colors">Baby Symptoms Tracker App</a></li>
              <li><a href="#on-site-ai-doctor" className="hover:text-white transition-colors">Baby Tracker with AI Doctor</a></li>
              <li><a href="#on-site-ai-doctor" className="hover:text-white transition-colors">Infant Fever Calculator</a></li>
            </ul>
          </div>

          {/* Newborn Feeding & Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Feeding & Sync
            </h5>
            <ul className="space-y-2 text-xs text-[#A8A29E]">
              <li><a href="#track-everything" className="hover:text-white transition-colors">Baby Feeding & Sleep Tracker</a></li>
              <li><a href="#track-everything" className="hover:text-white transition-colors">Newborn Feeding Log</a></li>
              <li><a href="#track-everything" className="hover:text-white transition-colors">Diaper Photo Stool Triage</a></li>
              <li><a href="#multi-caregiver" className="hover:text-white transition-colors">Caregiver Shift Sync</a></li>
              <li><a href="#ai-baby-seo-knowledge-hub" className="hover:text-white transition-colors">Top 9 Allergen Ladder</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} Sleepy Lullaby Dreams. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Wishing your family peaceful nights</span>
            <Heart className="w-3.5 h-3.5 text-[#FF5A5F] fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
};
