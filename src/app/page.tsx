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
import {
  Users,
  Share2,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
  Edit2,
} from 'lucide-react';

function LandingContent() {
  const { playerName, playerAvatar } = useGame();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Casino-grade hero card composition
  const heroCards: Card[] = [
    { id: 'h1', color: 'red', value: '7', score: 7 },
    { id: 'h2', color: 'blue', value: 'skip', score: 20 },
    { id: 'h3', color: 'wild', value: 'wild_draw4', score: 50 },
    { id: 'h4', color: 'yellow', value: 'reverse', score: 20 },
    { id: 'h5', color: 'green', value: 'draw2', score: 20 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0E12] text-[#F4F5F7] relative">
      <Navbar
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 flex flex-col items-center justify-center text-center z-10">
        {/* User Alias Pill Badge */}
        <button
          onClick={() => setIsProfileOpen(true)}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#161922] border border-[#2B3042] hover:border-violet-500/50 text-xs text-gray-300 hover:text-white transition shadow-sm mb-6 group cursor-pointer"
          title="Click to change your display name and avatar"
        >
          <Avatar avatarId={playerAvatar} size="sm" />
          <span>Playing as <strong className="text-white font-extrabold">{playerName}</strong></span>
          <Edit2 className="w-3 h-3 text-gray-400 group-hover:text-violet-400 transition" />
        </button>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.08] mb-5">
          Your friends. Your cards. <span className="text-violet-400">Your chaos.</span>
        </h1>

        {/* Supporting text */}
        <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed mb-8">
          Host private card tables, share your 6-character room code, and play Classic UNO together in real-time.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md justify-center mb-6">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-extrabold text-sm text-white shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            Create a Room
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsJoinOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#181B26] hover:bg-[#222736] border border-[#2C3244] font-bold text-sm text-gray-200 hover:text-white transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            Join a Room
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-gray-500 font-medium tracking-wide">
          Free to play · No account required · Private multiplayer
        </p>

        {/* Hero Card Showcase: Crisp Physical Casino Cards */}
        <div className="mt-12 sm:mt-16 relative w-full max-w-3xl flex items-center justify-center py-6">
          <div className="relative flex items-center justify-center -space-x-6 sm:-space-x-10">
            {/* Card 1: Red 7 */}
            <div className="transform -rotate-14 -translate-y-1 hover:-translate-y-5 transition-all duration-200">
              <CardView card={heroCards[0]} size="lg" />
            </div>

            {/* Card 2: Blue Skip */}
            <div className="transform -rotate-7 translate-y-1 hover:-translate-y-5 transition-all duration-200">
              <CardView card={heroCards[1]} size="lg" />
            </div>

            {/* Center Focal Card: Wild Draw 4 */}
            <div className="transform rotate-0 -translate-y-4 scale-105 z-20 hover:-translate-y-6 transition-all duration-200 shadow-xl">
              <CardView card={heroCards[2]} size="lg" isPlayable />
            </div>

            {/* Card 4: Yellow Reverse */}
            <div className="transform rotate-7 translate-y-1 hover:-translate-y-5 transition-all duration-200">
              <CardView card={heroCards[3]} size="lg" />
            </div>

            {/* Card 5: Green Draw 2 */}
            <div className="transform rotate-14 -translate-y-1 hover:-translate-y-5 transition-all duration-200">
              <CardView card={heroCards[4]} size="lg" />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="w-full mt-16 pt-12 border-t border-[#1C202B]">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1.5">How It Works</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-8">Private rooms with instant room codes.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            <div className="p-5 rounded-2xl bg-[#141620] border border-[#232736] hover:border-violet-500/40 transition">
              <span className="text-xs font-mono font-bold text-violet-400 mb-2.5 block">01</span>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                Create your room
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Click Create a Room to set your table capacity and turn timer. Enter your player alias.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141620] border border-[#232736] hover:border-violet-500/40 transition">
              <span className="text-xs font-mono font-bold text-violet-400 mb-2.5 block">02</span>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                Share your code
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Copy your 6-character room code or direct invite link and share it with your friends.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141620] border border-[#232736] hover:border-violet-500/40 transition">
              <span className="text-xs font-mono font-bold text-violet-400 mb-2.5 block">03</span>
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Play together
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Everyone enters the lobby, marks ready, and the host launches the match. Synchronized turns in real-time.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1C202B] py-6 bg-[#090A0D] text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">UNO CLUB</span>
            <span>·</span>
            <span>Independent classic multiplayer card game</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={() => setIsHowToPlayOpen(true)}
              className="hover:text-white transition"
            >
              How to Play
            </button>
            <span>·</span>
            <span className="hover:text-white transition">Privacy</span>
            <span>·</span>
            <span className="hover:text-white transition">Terms</span>
          </div>
        </div>
      </footer>

      {/* Dialog Modals */}
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
