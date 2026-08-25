/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { TrackEverythingSection } from './components/TrackEverythingSection';
import { SleepScheduleSection } from './components/SleepScheduleSection';
import { SoundsAndGuidesSection } from './components/SoundsAndGuidesSection';
import { MultiCaregiverSection } from './components/MultiCaregiverSection';
import { ParentTestimonials } from './components/ParentTestimonials';
import { SEOPediatricKnowledgeHub } from './components/SEOPediatricKnowledgeHub';
import { Footer } from './components/Footer';
import { LullabyAIDashboardSection } from './components/LullabyAIDashboardSection';
import { SleepPatternsVisualizerSection } from './components/SleepPatternsVisualizerSection';
import { OnSiteAIBabyDoctorSection } from './components/OnSiteAIBabyDoctorSection';
import { StartTrackingModal } from './components/StartTrackingModal';
import { ActivityLoggerModal } from './components/ActivityLoggerModal';
import { SoundPlayerFloatingBar } from './components/SoundPlayerFloatingBar';
import { AIBabyHealthAgentModal } from './components/AIBabyHealthAgentModal';
import { AIFloatingTrigger } from './components/AIFloatingTrigger';
import { soundEngine } from './utils/audioSynthesizer';
import { 
  INITIAL_SLEEP_LOGS, 
  INITIAL_FEED_LOGS, 
  INITIAL_DIAPER_LOGS, 
  INITIAL_ACTIVITY_LOGS, 
  SOOTHING_SOUNDS 
} from './data/sleepData';
import { 
  SleepLog, 
  FeedLog, 
  DiaperLog, 
  CustomActivityLog, 
  SoundTrack, 
  BabyProfile 
} from './types';
import babyBottleBg from './assets/images/baby_bottle_dark_pastel_1787436304366.jpg';

export default function App() {
  const [logs, setLogs] = useState<SleepLog[]>(INITIAL_SLEEP_LOGS);
  const [feedLogs, setFeedLogs] = useState<FeedLog[]>(INITIAL_FEED_LOGS);
  const [diaperLogs, setDiaperLogs] = useState<DiaperLog[]>(INITIAL_DIAPER_LOGS);
  const [activityLogs, setActivityLogs] = useState<CustomActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [startTrackingModalOpen, setStartTrackingModalOpen] = useState<boolean>(false);
  
  // Activity Logger Modal State
  const [isActivityLoggerOpen, setIsActivityLoggerOpen] = useState<boolean>(false);
  const [activeLoggerTab, setActiveLoggerTab] = useState<'sleep' | 'feed' | 'diaper' | 'activity' | 'timer'>('sleep');

  // AI Pediatric & Health Agent State
  const [isAIAgentOpen, setIsAIAgentOpen] = useState<boolean>(false);

  const [babyProfile, setBabyProfile] = useState<BabyProfile>({
    name: 'Maya',
    ageMonths: 5,
    birthDate: '2026-03-15',
    gender: 'girl',
    wakeTime: '07:00',
    targetBedtime: '19:30',
    sleepGoal: 'Longer uninterrupted night stretches'
  });

  const activeSound = SOOTHING_SOUNDS.find((s) => s.id === activeSoundId) || null;

  // Sound handler
  const handleToggleSound = (track: SoundTrack) => {
    if (activeSoundId === track.id && isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setActiveSoundId(null);
    } else {
      soundEngine.play(track.synthesizerType, track.id, 30);
      setActiveSoundId(track.id);
      setIsPlaying(true);
    }
  };

  const handleStopSound = () => {
    soundEngine.stop();
    setIsPlaying(false);
    setActiveSoundId(null);
  };

  const handleQuickHeroSound = () => {
    const pinkNoise = SOOTHING_SOUNDS.find((s) => s.id === 'pink-noise-cozy') || SOOTHING_SOUNDS[0];
    handleToggleSound(pinkNoise);
  };

  // Add / Delete Log Handlers
  const handleAddSleepLog = (newLog: SleepLog) => {
    setLogs((prev) => [newLog, ...prev]);
  };
  const handleDeleteSleepLog = (id: string) => {
    setLogs((prev) => prev.filter(l => l.id !== id));
  };

  const handleAddFeedLog = (newLog: FeedLog) => {
    setFeedLogs((prev) => [newLog, ...prev]);
  };
  const handleDeleteFeedLog = (id: string) => {
    setFeedLogs((prev) => prev.filter(f => f.id !== id));
  };

  const handleAddDiaperLog = (newLog: DiaperLog) => {
    setDiaperLogs((prev) => [newLog, ...prev]);
  };
  const handleDeleteDiaperLog = (id: string) => {
    setDiaperLogs((prev) => prev.filter(d => d.id !== id));
  };

  const handleAddActivityLog = (newLog: CustomActivityLog) => {
    setActivityLogs((prev) => [newLog, ...prev]);
  };
  const handleDeleteActivityLog = (id: string) => {
    setActivityLogs((prev) => prev.filter(a => a.id !== id));
  };

  // Open Activity Logger with specific Tab
  const handleOpenActivityLogger = (tab: 'sleep' | 'feed' | 'diaper' | 'activity' | 'timer' = 'sleep') => {
    setActiveLoggerTab(tab);
    setIsActivityLoggerOpen(true);
  };

  // Scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Complete profile setup
  const handleCompleteSetup = (profile: BabyProfile) => {
    setBabyProfile(profile);
    scrollToSection('track-everything');
  };

  return (
    <div className="min-h-screen bg-transparent text-[#4A3F35] flex flex-col selection:bg-[#FFB7B2]/30 font-sans relative">
      {/* GLOBAL BACKGROUND: Prominent Darker Pastel Baby in Diaper drinking bottle across ALL pages */}
      <div 
        id="global-baby-bottle-bg"
        className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none"
        aria-hidden="true"
      >
        <img
          src={babyBottleBg}
          alt="Baby in diaper drinking a bottle background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center fixed inset-0 opacity-75 mix-blend-multiply filter contrast-[1.18] brightness-[0.88] saturate-[1.25] scale-100"
        />
        {/* Rich Dark Pastel Gradient Overlays */}
        <div className="fixed inset-0 bg-gradient-to-b from-[#4A324A]/25 via-[#2E2738]/20 to-[#432C3A]/30 mix-blend-color-burn" />
        <div className="fixed inset-0 bg-gradient-to-tr from-[#FFD1DC]/30 via-transparent to-[#D8B4FE]/30" />
        <div className="fixed inset-0 bg-[#FFF8F3]/35" />
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenStartTracking={() => setStartTrackingModalOpen(true)}
        onOpenLiveTracker={() => handleOpenActivityLogger('sleep')}
        onOpenAIAgent={() => setIsAIAgentOpen(true)}
        activePlayingId={isPlaying ? activeSoundId : null}
        onStopSound={handleStopSound}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onOpenStartTracking={() => handleOpenActivityLogger('sleep')}
          onExploreFeatures={() => scrollToSection('lullaby-ai-dashboard')}
          onPlayQuickSound={handleQuickHeroSound}
          onOpenAIAgent={() => setIsAIAgentOpen(true)}
          isQuickSoundPlaying={isPlaying && activeSoundId === 'pink-noise-cozy'}
        />

        {/* 2. Lullaby AI Baby Doctor & Sleep Tracker Dashboard */}
        <LullabyAIDashboardSection
          logs={logs}
          feedLogs={feedLogs}
          diaperLogs={diaperLogs}
          activityLogs={activityLogs}
          babyProfile={babyProfile}
          onOpenLoggerModal={handleOpenActivityLogger}
          onOpenAIAgent={() => setIsAIAgentOpen(true)}
          onAddSleepLog={handleAddSleepLog}
        />

        {/* 3. Section: Baby Sleep Tracker & 7-Day Circadian Patterns */}
        <SleepPatternsVisualizerSection
          logs={logs}
          babyProfile={babyProfile}
          onOpenLoggerModal={handleOpenActivityLogger}
          onOpenAIAgent={() => setIsAIAgentOpen(true)}
        />

        {/* 3. Section: On-Site AI Baby Doctor & Pediatric Clinic */}
        <OnSiteAIBabyDoctorSection
          babyProfile={babyProfile}
          onOpenFullModal={() => setIsAIAgentOpen(true)}
        />

        {/* 4. Features Overview Hub */}
        <FeaturesShowcase 
          onSelectFeature={(sectionId) => {
            if (sectionId === 'track-everything') {
              handleOpenActivityLogger('sleep');
              scrollToSection('track-everything');
            } else {
              scrollToSection(sectionId);
            }
          }} 
          onOpenLoggerModal={() => handleOpenActivityLogger('sleep')}
          onOpenAIAgent={() => setIsAIAgentOpen(true)}
        />

        {/* 5. Section: Track Everything & Daily Activity Stream */}
        <TrackEverythingSection
          logs={logs}
          feedLogs={feedLogs}
          diaperLogs={diaperLogs}
          activityLogs={activityLogs}
          onAddSleepLog={handleAddSleepLog}
          onAddFeedLog={handleAddFeedLog}
          onAddDiaperLog={handleAddDiaperLog}
          onAddActivityLog={handleAddActivityLog}
          onDeleteSleepLog={handleDeleteSleepLog}
          onDeleteFeedLog={handleDeleteFeedLog}
          onDeleteDiaperLog={handleDeleteDiaperLog}
          onDeleteActivityLog={handleDeleteActivityLog}
          onOpenLoggerModal={handleOpenActivityLogger}
        />

        {/* 6. Section: Personalized Sleep Schedules */}
        <SleepScheduleSection />

        {/* 5. Section: Sounds and Guides */}
        <SoundsAndGuidesSection
          activeSoundId={isPlaying ? activeSoundId : null}
          onToggleSound={handleToggleSound}
          onStopSound={handleStopSound}
        />

        {/* 6. Section: Multi-Caregiver Support */}
        <MultiCaregiverSection />

        {/* 7. Parent Testimonials & AAP Compliance */}
        <ParentTestimonials />

        {/* 8. Comprehensive SEO Knowledge Hub & Pediatric FAQ */}
        <SEOPediatricKnowledgeHub
          onOpenLiveTracker={() => handleOpenActivityLogger('sleep')}
          onOpenAIAgent={() => setIsAIAgentOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onOpenStartTracking={() => handleOpenActivityLogger('sleep')} />

      {/* Floating Sound Player (When Audio is Active) */}
      <SoundPlayerFloatingBar
        track={activeSound}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          if (activeSound) handleToggleSound(activeSound);
        }}
        onClose={handleStopSound}
      />

      {/* Floating AI Agent Trigger Button */}
      <AIFloatingTrigger
        onClick={() => setIsAIAgentOpen(true)}
        isSoundBarOpen={isPlaying && !!activeSound}
      />

      {/* 24/7 AI Pediatric & Health Agent Modal */}
      <AIBabyHealthAgentModal
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
        babyProfile={babyProfile}
      />

      {/* Interactive Sleep & Activity Logger Modal */}
      <ActivityLoggerModal
        isOpen={isActivityLoggerOpen}
        onClose={() => setIsActivityLoggerOpen(false)}
        onAddSleepLog={handleAddSleepLog}
        onAddFeedLog={handleAddFeedLog}
        onAddDiaperLog={handleAddDiaperLog}
        onAddActivityLog={handleAddActivityLog}
        initialTab={activeLoggerTab}
      />

      {/* Interactive Start Tracking / Masterplan Setup Modal */}
      <StartTrackingModal
        isOpen={startTrackingModalOpen}
        onClose={() => setStartTrackingModalOpen(false)}
        onCompleteSetup={handleCompleteSetup}
      />
    </div>
  );
}
