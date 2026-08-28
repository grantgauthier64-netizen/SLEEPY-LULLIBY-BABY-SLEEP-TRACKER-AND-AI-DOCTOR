import React, { useState } from 'react';
import { Bot, Sparkles, X, Activity, Stethoscope } from 'lucide-react';

interface AIFloatingTriggerProps {
  onClick: () => void;
  isSoundBarOpen: boolean;
}

export const AIFloatingTrigger: React.FC<AIFloatingTriggerProps> = ({
  onClick,
  isSoundBarOpen
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div
      className={`fixed right-5 z-40 flex flex-col items-end gap-2 transition-all duration-300 ${
        isSoundBarOpen ? 'bottom-24' : 'bottom-6'
      }`}
    >
      {/* Speech Prompt Pill Banner with Ada Health & ChatGPT Health badges */}
      {showTooltip && (
        <div className="bg-[#1C1917] text-white px-3.5 py-2.5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 max-w-xs animate-bounce-subtle text-xs">
          <span className="text-base">🩺</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-1.5 py-0.2 bg-[#0284C7] text-white rounded text-[9px] font-bold uppercase">Ada Health</span>
              <span className="px-1.5 py-0.2 bg-[#10A37F] text-white rounded text-[9px] font-bold uppercase">ChatGPT Health</span>
            </div>
            <p className="font-extrabold text-white text-[11px] leading-tight">
              24/7 AI Pediatrician Ready
            </p>
            <p className="text-[10px] text-white/80 leading-tight">
              Fever, sleep regressions & symptom triage
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-white/60 hover:text-white p-0.5 rounded-full hover:bg-white/10"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Glowing AI Doctor Button */}
      <button
        id="floating-ai-doctor-btn"
        onClick={onClick}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#7C3AED] via-[#FF5A5F] to-[#0284C7] hover:opacity-95 text-white font-extrabold px-4 sm:px-5 py-3.5 rounded-full shadow-2xl shadow-[#7C3AED]/40 border-2 border-white/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Open AI Baby Doctor (Ada Health & ChatGPT Health)"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>

        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>

        <div className="text-left">
          <span className="text-xs sm:text-sm font-bold tracking-tight block leading-none">
            AI Doctor
          </span>
          <span className="text-[9px] text-white/90 font-medium leading-none block mt-0.5">
            Ada + ChatGPT Health
          </span>
        </div>

        <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
