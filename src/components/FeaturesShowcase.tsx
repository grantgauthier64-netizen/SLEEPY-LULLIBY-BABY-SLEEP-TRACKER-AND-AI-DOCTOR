import React from 'react';
import { Clock, Compass, Volume2, Users, ArrowRight, Bot, Sparkles } from 'lucide-react';

interface FeaturesShowcaseProps {
  onSelectFeature: (sectionId: string) => void;
  onOpenLoggerModal?: () => void;
  onOpenAIAgent?: () => void;
}

export const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({ 
  onSelectFeature, 
  onOpenLoggerModal,
  onOpenAIAgent 
}) => {
  const features = [
    {
      id: 'track-everything',
      title: 'Sleep & Daily Tracker',
      emoji: '📊',
      badge: 'Naps, Feeds & Diapers',
      iconBg: 'bg-[#FFECB3]',
      tagline: 'Start, End & Duration Tracking',
      description:
        'Easily log naps & nighttime sleep (start/end/duration), nursing & formula bottle feeds, wet/dirty diapers, and tummy time notes.',
      icon: Clock,
    },
    {
      id: 'personalized-schedules',
      title: 'Personalized Schedules',
      emoji: '⏰',
      badge: 'Circadian Predictor',
      iconBg: 'bg-[#C8E6C9]',
      tagline: 'Age-Tuned Wake Windows',
      description:
        'AI-powered predictions for your baby’s next optimal sleep window, preventing overtiredness before it starts.',
      icon: Compass,
    },
    {
      id: 'sounds-guides',
      title: 'Sounds & Guides',
      emoji: '🎵',
      badge: 'Acoustic Womb Masking',
      iconBg: 'bg-[#D1C4E9]',
      tagline: 'Pink Noise & Expert Techniques',
      description:
        'Curated white noise library, womb heartbeat, and expert articles on evidence-based gentle soothing methods.',
      icon: Volume2,
    },
    {
      id: 'multi-caregiver',
      title: 'Multi-Caregiver Support',
      emoji: '👨‍👩‍👧',
      badge: 'Team Caregiving',
      iconBg: 'bg-[#B2E2F2]',
      tagline: 'Moms, Dads & Nannies in Sync',
      description:
        'Sync data instantly between mom, dad, and nannies in real-time with automatic shift handover summaries.',
      icon: Users,
    }
  ];

  return (
    <section id="features-overview" className="py-20 bg-[#FFFBF7]/60 backdrop-blur-[1px] relative overflow-hidden border-t border-[#F0E6DD]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-block px-4 py-1.5 bg-[#E8F5E9] text-[#1E7B28] rounded-full text-xs font-extrabold uppercase tracking-widest shadow-xs border border-[#C8E6C9]">
            Complete Care Suite
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1C1917] tracking-tight">
            Designed for calm days and <span className="text-[#FF5A5F] italic">peaceful nights</span>
          </h2>
          <p className="text-base sm:text-lg text-[#292524] font-normal leading-relaxed">
            Everything you need to understand, soothe, and support your baby’s natural sleep evolution in one warm, gentle space.
          </p>
        </div>

        {/* 4 Cards Grid matching Professional Polish theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6">
          {features.map((feat) => {
            return (
              <div
                key={feat.id}
                onClick={() => onSelectFeature(feat.id)}
                className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#E7DDD5] shadow-sm hover:shadow-md hover:border-[#FF5A5F] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${feat.iconBg} rounded-2xl flex items-center justify-center text-xl shadow-xs font-bold`}>
                      {feat.emoji}
                    </div>
                    <span className="text-[11px] font-extrabold text-[#FF5A5F] px-3 py-1 rounded-full bg-[#FFF1F2] border border-[#FF5A5F]/20">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-[#1C1917] group-hover:text-[#FF5A5F] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[11px] font-bold text-[#57534E] mt-0.5">
                      {feat.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E6DD] flex items-center justify-between text-xs font-extrabold text-[#FF5A5F] group-hover:text-[#FF4147]">
                  <span>Explore Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Pediatric Agent Banner Callout */}
        {onOpenAIAgent && (
          <div className="mt-8 bg-gradient-to-r from-[#EDE9FE] via-[#FFF1F2] to-[#FFFBF7] p-6 sm:p-8 rounded-3xl border-2 border-[#DDD6FE] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#8B5CF6] flex items-center justify-center text-2xl shrink-0 shadow-md shadow-[#8B5CF6]/20">
                <Bot className="w-7 h-7 text-[#7C3AED]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                    24/7 AI Pediatric & Infant Health Advisor
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5B21B6] text-white">
                    Powered by Gemini 3.7
                  </span>
                </div>
                <p className="text-sm text-[#44403C] max-w-2xl leading-relaxed">
                  Have questions in the middle of the night? Ask our clinical AI agent about wake windows, fevers, teething relief, feeding amounts, tummy time, and sleep regressions.
                </p>
              </div>
            </div>

            <button
              id="showcase-ask-ai-agent-btn"
              onClick={onOpenAIAgent}
              className="w-full md:w-auto px-6 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full font-bold shadow-lg shadow-[#7C3AED]/35 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Ask AI Doctor Now</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
