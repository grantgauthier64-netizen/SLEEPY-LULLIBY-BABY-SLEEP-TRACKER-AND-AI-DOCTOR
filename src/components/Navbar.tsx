import React, { useState, useEffect } from 'react';
import { Moon, Sparkles, Volume2, VolumeX, Menu, X, Clock, Heart, Users, BookOpen, Compass, Bot } from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';
import { SOOTHING_SOUNDS } from '../data/sleepData';

interface NavbarProps {
  onOpenStartTracking: () => void;
  onOpenLiveTracker: () => void;
  onOpenAIAgent: () => void;
  activePlayingId: string | null;
  onStopSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStartTracking,
  onOpenLiveTracker,
  onOpenAIAgent,
  activePlayingId,
  onStopSound,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeSound = SOOTHING_SOUNDS.find((s) => s.id === activePlayingId);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFBF7]/95 backdrop-blur-md shadow-xs border-b border-[#F0E6DD]'
          : 'bg-[#FFFBF7]/85 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand matching design */}
          <a
            href="#"
            id="brand-logo-btn"
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 bg-[#FF5A5F] rounded-full flex items-center justify-center shadow-md shadow-[#FF5A5F]/30 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-white rounded-full translate-x-1 -translate-y-1 shadow-inner"></div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#1C1917]">
                Sleepy Lullaby Dreams
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-semibold text-[#1C1917]">
            <button
              id="nav-dashboard-btn"
              onClick={() => scrollToSection('lullaby-ai-dashboard')}
              className="px-3.5 py-1.5 rounded-full bg-[#FFE4E6] text-[#9F1239] hover:bg-[#FECDD3] transition-all cursor-pointer flex items-center gap-1.5 font-extrabold border border-[#FECDD3] shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
              <span>AI Dashboard</span>
            </button>
            <button
              id="nav-patterns-btn"
              onClick={() => scrollToSection('sleep-patterns-tracker')}
              className="hover:text-[#FF5A5F] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Moon className="w-4 h-4 text-[#FF5A5F]" />
              <span>Sleep Tracker</span>
            </button>
            <button
              id="nav-ai-doctor-btn"
              onClick={() => scrollToSection('on-site-ai-doctor')}
              className="hover:text-[#7C3AED] transition-colors cursor-pointer flex items-center gap-1.5 text-[#5B21B6] font-bold"
            >
              <Bot className="w-4 h-4 text-[#7C3AED]" />
              <span>AI Baby Doctor</span>
            </button>
            <button
              id="nav-track-btn"
              onClick={() => scrollToSection('track-everything')}
              className="hover:text-[#FF5A5F] transition-colors cursor-pointer"
            >
              Daily Tracker
            </button>
            <button
              id="nav-schedules-btn"
              onClick={() => scrollToSection('personalized-schedules')}
              className="hover:text-[#FF5A5F] transition-colors cursor-pointer"
            >
              Sleep Science
            </button>
            <button
              id="nav-sounds-btn"
              onClick={() => scrollToSection('sounds-guides')}
              className="hover:text-[#FF5A5F] transition-colors cursor-pointer"
            >
              Sounds & Guides
            </button>
          </nav>

          {/* Active Audio Pill + CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {activePlayingId && activeSound && (
              <button
                id="active-sound-pill-btn"
                onClick={onStopSound}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] text-[#1E7B28] text-xs font-bold hover:bg-[#D9EEDC] transition-colors cursor-pointer animate-pulse-subtle shadow-xs"
                title="Click to pause sound"
              >
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2.5 bg-[#1E7B28] rounded-full animate-bounce"></span>
                  <span className="w-0.5 h-3.5 bg-[#1E7B28] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-0.5 h-1.5 bg-[#1E7B28] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
                <span>Playing: {activeSound.name}</span>
                <VolumeX className="w-3.5 h-3.5 text-[#1E7B28]" />
              </button>
            )}

            <button
              id="header-ai-agent-btn"
              onClick={onOpenAIAgent}
              className="px-4 py-2 rounded-full bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6] border-2 border-[#8B5CF6] font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              title="Ask AI Pediatric & Health Questions"
            >
              <Bot className="w-4 h-4 text-[#7C3AED]" />
              <span>Ask AI Agent</span>
            </button>

            <button
              id="header-explore-btn"
              onClick={() => scrollToSection('features-overview')}
              className="px-5 py-2.5 rounded-full border-2 border-[#FF5A5F] text-[#FF5A5F] font-bold text-sm hover:bg-[#FF5A5F] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Explore Features
            </button>

            <button
              id="header-start-tracking-btn"
              onClick={onOpenStartTracking}
              className="px-6 py-2.5 rounded-full bg-[#FF5A5F] hover:bg-[#FF4147] text-white font-bold text-sm shadow-lg shadow-[#FF5A5F]/40 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Moon className="w-4 h-4 fill-white" />
              <span>Start Tracking</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {activePlayingId && activeSound && (
              <button
                onClick={onStopSound}
                className="p-2 rounded-full bg-[#E8F5E9] text-[#1E7B28] text-xs font-bold"
                title="Stop sound"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-[#F0E6DD] text-[#1C1917] hover:bg-[#E5DDD4] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#FFFBF7] border-b border-[#F0E6DD] px-6 pt-3 pb-6 space-y-2 shadow-xl"
        >
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToSection('lullaby-ai-dashboard');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-extrabold text-[#9F1239] bg-[#FFE4E6] text-left border-2 border-[#FECDD3] shadow-xs"
          >
            <Sparkles className="w-5 h-5 text-[#FF5A5F]" />
            Lullaby AI Dashboard
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToSection('sleep-patterns-tracker');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-[#1C1917] bg-[#FFF1F2] hover:bg-[#FFE4E6] text-left border border-[#FECDD3]"
          >
            <Moon className="w-5 h-5 text-[#FF5A5F]" />
            Sleep Tracker & Patterns
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToSection('on-site-ai-doctor');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-[#5B21B6] bg-[#EDE9FE]/70 hover:bg-[#EDE9FE] text-left border border-[#DDD6FE]"
          >
            <Bot className="w-5 h-5 text-[#7C3AED]" />
            On-Site AI Baby Doctor
          </button>
          <button
            onClick={() => scrollToSection('track-everything')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-[#1C1917] hover:bg-[#F0E6DD]/60 text-left"
          >
            <Clock className="w-5 h-5 text-[#FF5A5F]" />
            Daily Activity Tracker
          </button>
          <button
            onClick={() => scrollToSection('personalized-schedules')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-[#1C1917] hover:bg-[#F0E6DD]/60 text-left"
          >
            <Compass className="w-5 h-5 text-[#FF5A5F]" />
            Sleep Science & Schedules
          </button>
          <button
            onClick={() => scrollToSection('sounds-guides')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-[#1C1917] hover:bg-[#F0E6DD]/60 text-left"
          >
            <Volume2 className="w-5 h-5 text-[#FF5A5F]" />
            Sounds & Sleep Guides
          </button>
          <button
            onClick={() => scrollToSection('multi-caregiver')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-[#1C1917] hover:bg-[#F0E6DD]/60 text-left"
          >
            <Users className="w-5 h-5 text-[#FF5A5F]" />
            Multi-Caregiver Support
          </button>

          <div className="pt-3 border-t border-[#F0E6DD] grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection('features-overview');
              }}
              className="w-full py-3 rounded-full text-sm font-bold text-center border-2 border-[#1C1917] text-[#1C1917] bg-white hover:bg-neutral-50"
            >
              Explore Features
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStartTracking();
              }}
              className="w-full py-3 rounded-full text-sm font-bold text-center text-white bg-[#FF5A5F] hover:bg-[#FF4147] shadow-md shadow-[#FF5A5F]/40"
            >
              Start Tracking
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
