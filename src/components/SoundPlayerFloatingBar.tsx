import React from 'react';
import { Pause, Play, Moon, X } from 'lucide-react';
import { SoundTrack } from '../types';

interface SoundPlayerFloatingBarProps {
  track: SoundTrack | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export const SoundPlayerFloatingBar: React.FC<SoundPlayerFloatingBarProps> = ({
  track,
  isPlaying,
  onTogglePlay,
  onClose,
}) => {
  if (!track || !isPlaying) return null;

  return (
    <aside
      aria-label="Sound player controls"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] sm:w-full bg-[#1C1917]/95 backdrop-blur-md text-white rounded-full border border-white/20 shadow-2xl px-5 py-3 animate-slideUp flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-[#FF5A5F] flex items-center justify-center text-lg shrink-0 shadow-md shadow-[#FF5A5F]/40">
          <Moon className="w-5 h-5 text-white fill-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white truncate">
              {track.name}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping shrink-0" />
          </div>
          <p className="text-[11px] text-white/80 font-medium truncate">
            Soothing sound active • Safe nursery level
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full bg-[#FF5A5F] hover:bg-[#FF4147] text-white flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer shadow-lg shadow-[#FF5A5F]/40"
          aria-label={isPlaying ? 'Pause sound' : 'Play sound'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        <button
          onClick={onClose}
          className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          aria-label="Close sound bar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
