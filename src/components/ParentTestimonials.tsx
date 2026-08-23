import React from 'react';
import { Star, ShieldCheck, Sparkles } from 'lucide-react';

export const ParentTestimonials: React.FC = () => {
  const reviews = [
    {
      id: 1,
      quote:
        'Sleepy Lullaby Dreams saved our sanity during the 4-month sleep regression. Predicting the exact wake windows stopped our baby from getting overtired and crying before bedtime.',
      parent: 'Emily & Mark R.',
      babyAge: 'Baby Leo (now 9 months)',
      result: 'Went from 5 night wakings to 1 gentle feed',
      rating: 5,
      avatar: '👩‍👧',
      bg: 'bg-white border-[#F0E6DD]'
    },
    {
      id: 2,
      quote:
        'The multi-caregiver handoff is genius. When our nanny leaves at 5 PM, my husband and I immediately see the exact wake window without frantic texting.',
      parent: 'Jessica T., Pediatric Nurse',
      babyAge: 'Baby Maya (6 months)',
      result: 'Zero confusion between parents & nanny',
      rating: 5,
      avatar: '👩‍⚕️',
      bg: 'bg-white border-[#F0E6DD]'
    },
    {
      id: 3,
      quote:
        'The pink noise sound machine and gentle guides taught us how to calm our fussy newborn without tears. It feels so gentle, warm, and supportive.',
      parent: 'Daniel K.',
      babyAge: 'Baby Noah (3 months)',
      result: 'Bedtime routine down to 18 peaceful minutes',
      rating: 5,
      avatar: '👨‍🍼',
      bg: 'bg-white border-[#F0E6DD]'
    }
  ];

  return (
    <section id="parent-reviews" className="py-20 bg-[#FFFBF7]/60 backdrop-blur-[1px] relative overflow-hidden border-t border-[#F0E6DD]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-block px-4 py-1.5 bg-[#E8F5E9] text-[#1E7B28] rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs border border-[#C8E6C9]">
            Parent Love & Pediatric Trust
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Over 85,000 peaceful nights logged by <span className="text-[#FF5A5F] italic">grateful parents</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Real stories from sleep-deprived families who found gentle rhythms, predictable naps, and restful nights.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 sm:p-8 rounded-[36px] bg-white border-2 border-[#E7DDD5] shadow-xs hover:shadow-md hover:border-[#FF5A5F] transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* 5 Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF5A5F] text-[#FF5A5F]" />
                  ))}
                </div>

                <p className="text-sm text-[#292524] font-medium leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E6DD] space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFFBF7] flex items-center justify-center text-xl border-2 border-[#E7DDD5]">
                    {rev.avatar}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                      {rev.parent}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#57534E]">{rev.babyAge}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[11px] font-bold text-[#1E7B28] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E7B28]" />
                  <span>{rev.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pediatric Trust Badge Bar */}
        <div className="mt-14 p-6 sm:p-8 rounded-[36px] bg-white border-2 border-[#E7DDD5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#1E7B28] border border-[#C8E6C9] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#1C1917]">
                AAP Safe Sleep Standards Compliant
              </h4>
              <p className="text-xs text-[#57534E] font-medium mt-0.5">
                Every guideline, schedule, and tip strictly adheres to the American Academy of Pediatrics safe sleep guidance.
              </p>
            </div>
          </div>
          <div className="text-xs font-extrabold text-[#1E7B28] bg-[#E8F5E9] px-4 py-2 rounded-full border border-[#C8E6C9] shrink-0">
            Certified Gentle & Evidence-Based
          </div>
        </div>

      </div>
    </section>
  );
};
