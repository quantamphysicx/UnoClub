'use client';

import React from 'react';
import Link from 'next/link';
import { useGame } from '@/context/GameContext';
import { Volume2, VolumeX, BookOpen, Edit3 } from 'lucide-react';
import { Avatar } from './Avatar';

interface NavbarProps {
  onOpenHowToPlay?: () => void;
  onOpenProfile?: () => void;
}

export function Navbar({ onOpenHowToPlay, onOpenProfile }: NavbarProps) {
  const { isConnected, isMuted, toggleMute, playerName, playerAvatar } = useGame();

  return (
    <header className="w-full border-b border-[#242424] bg-[#101010] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-[#D6FF62] text-[#101010] font-black text-xs flex items-center justify-center rounded-xs tracking-tighter">
            UC
          </div>
          <span className="font-extrabold text-sm tracking-wider text-[#F2F0EB]">
            UNO CLUB
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Connection Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-[#A5A39E] border border-[#2E2E2E] bg-[#161616]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected ? 'bg-[#1EA245]' : 'bg-[#D32F2F]'
              }`}
            />
            <span>{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          {/* Rules Guide Button */}
          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#2E2E2E] hover:border-[#444444] bg-[#181818] text-xs text-[#A5A39E] hover:text-[#F2F0EB] transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rules</span>
            </button>
          )}

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded border border-[#2E2E2E] hover:border-[#444444] bg-[#181818] text-[#A5A39E] hover:text-[#F2F0EB] transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Player Identity Badge */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1 pr-2.5 py-0.5 rounded border border-[#2E2E2E] hover:border-[#444444] bg-[#181818] transition group cursor-pointer"
              title="Edit Profile"
            >
              <Avatar avatarId={playerAvatar} size="sm" />
              <span className="text-xs font-medium text-[#F2F0EB] max-w-[100px] truncate">
                {playerName}
              </span>
              <Edit3 className="w-3 h-3 text-[#777570] group-hover:text-[#F2F0EB] transition" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
