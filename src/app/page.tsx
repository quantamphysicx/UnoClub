'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Navbar } from '@/components/Navbar';
import { ToastContainer } from '@/components/Toasts';
import { CardView } from '@/components/CardView';
import { Avatar } from '@/components/Avatar';
import { CreateRoomModal } from '@/components/modals/CreateRoomModal';
import { JoinRoomModal } from '@/components/modals/JoinRoomModal';
import { HowToPlayModal } from '@/components/modals/HowToPlayModal';
import { GuestProfileModal } from '@/components/modals/GuestProfileModal';
import { Card } from '@/types/game';
import { ArrowRight, Edit3 } from 'lucide-react';

function LandingContent() {
  const { playerName, playerAvatar } = useGame();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Intentional, flat, physical card composition
  const heroCards: Card[] = [
    { id: 'h1', color: 'red', value: '7', score: 7 },
    { id: 'h2', color: 'blue', value: 'skip', score: 20 },
    { id: 'h3', color: 'wild', value: 'wild_draw4', score: 50 },
    { id: 'h4', color: 'yellow', value: 'reverse', score: 20 },
    { id: 'h5', color: 'green', value: 'draw2', score: 20 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#101010] text-[#F2F0EB]">
      <Navbar
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 flex flex-col items-center text-center">
        {/* User Alias Tag */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#444444] text-xs text-[#A5A39E] hover:text-[#F2F0EB] transition mb-8 cursor-pointer"
        >
          <Avatar avatarId={playerAvatar} size="sm" />
          <span>Playing as <strong className="text-[#F2F0EB] font-semibold">{playerName}</strong></span>
          <Edit3 className="w-3 h-3 text-[#777570]" />
        </button>

        {/* Headline & Supporting Copy */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#F2F0EB] mb-4">
          One more round.
        </h1>
        <p className="text-base sm:text-lg text-[#A5A39E] max-w-md leading-relaxed mb-10 font-normal">
          Your friends are here. Your cards are ready.
        </p>

        {/* Primary & Secondary Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm justify-center mb-16">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#D6FF62] hover:bg-[#C4F04D] text-[#101010] font-bold text-xs uppercase tracking-wider transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Create a Room
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsJoinOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] hover:border-[#444444] text-[#F2F0EB] font-semibold text-xs uppercase tracking-wider transition active:scale-98 flex items-center justify-center cursor-pointer"
          >
            Join with a Code
          </button>
        </div>

        {/* Physical Hand Arrangement: Flat, Tangible, Layered Cards */}
        <div className="relative w-full max-w-2xl flex items-center justify-center pt-4 pb-8">
          <div className="flex items-end -space-x-8 sm:-space-x-12">
            <div className="transform -rotate-12 translate-y-2 hover:-translate-y-3 transition-transform">
              <CardView card={heroCards[0]} size="lg" />
            </div>

            <div className="transform -rotate-6 translate-y-0.5 hover:-translate-y-3 transition-transform">
              <CardView card={heroCards[1]} size="lg" />
            </div>

            <div className="transform rotate-0 -translate-y-4 z-20 hover:-translate-y-6 transition-transform shadow-2xl">
              <CardView card={heroCards[2]} size="lg" isPlayable />
            </div>

            <div className="transform rotate-6 translate-y-0.5 hover:-translate-y-3 transition-transform">
              <CardView card={heroCards[3]} size="lg" />
            </div>

            <div className="transform rotate-12 translate-y-2 hover:-translate-y-3 transition-transform">
              <CardView card={heroCards[4]} size="lg" />
            </div>
          </div>
        </div>
      </main>

      {/* Understated Minimalist Footer */}
      <footer className="w-full border-t border-[#222222] py-5 text-xs text-[#777570]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#A5A39E]">UNO CLUB</span>
            <span>·</span>
            <span>Private classic multiplayer card game</span>
          </div>

          <div className="flex items-center gap-4 text-[#A5A39E]">
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="hover:text-[#F2F0EB] transition cursor-pointer"
            >
              How to Play
            </button>
            <span>·</span>
            <span>Zero accounts required</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateRoomModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <JoinRoomModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setIsHowToPlayOpen(false)} />
      <GuestProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return <LandingContent />;
}
