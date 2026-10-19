'use client';

import React from 'react';
import Link from 'next/link';
import { useGame } from '@/context/GameContext';
import { Volume2, VolumeX, BookOpen, User, Wifi, WifiOff } from 'lucide-react';
import { Avatar } from './Avatar';

interface NavbarProps {
  onOpenHowToPlay?: () => void;
  onOpenProfile?: () => void;
}

export function Navbar({ onOpenHowToPlay, onOpenProfile }: NavbarProps) {
  const { isConnected, isMuted, toggleMute, playerName, playerAvatar } = useGame();

  return (
    <header className="w-full border-b border-[#232733]/80 bg-[#0B0C10]/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.7)] transition-all">
            <span className="font-black text-xs text-white tracking-tighter">UNO</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
              UNO<span className="text-violet-400 font-black">CLUB</span>
            </span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection Status Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isConnected
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            {isConnected ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>Connecting...</span>
              </>
            )}
          </div>

          {/* How to Play Button */}
          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A2E3D] hover:border-violet-500/40 bg-[#141721] hover:bg-[#1A1E2B] text-xs font-medium text-gray-300 hover:text-white transition shadow-sm"
              title="How to Play Classic UNO"
            >
              <BookOpen className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Rules</span>
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg border transition ${
              isMuted
                ? 'border-[#2A2E3D] bg-[#141721] text-gray-400 hover:text-gray-200'
                : 'border-violet-500/30 bg-violet-600/10 text-violet-300 hover:bg-violet-600/20'
            }`}
            title={isMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Player Identity Badge */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl border border-[#2A2E3D] hover:border-violet-500/50 bg-[#141721] hover:bg-[#1A1E2B] transition group"
              title="Change Player Name and Avatar"
            >
              <Avatar avatarId={playerAvatar} size="sm" />
              <span className="text-xs font-semibold text-gray-200 group-hover:text-white max-w-[100px] truncate">
                {playerName}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
