'use client';

import React, { useState } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import { Navbar } from '@/components/Navbar';
import { ToastContainer } from '@/components/Toasts';
import { CardView } from '@/components/CardView';
import { CreateRoomModal } from '@/components/modals/CreateRoomModal';
import { JoinRoomModal } from '@/components/modals/JoinRoomModal';
import { HowToPlayModal } from '@/components/modals/HowToPlayModal';
import { GuestProfileModal } from '@/components/modals/GuestProfileModal';
import { Card } from '@/types/game';
import {
  Sparkles,
  Users,
  Share2,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

function LandingContent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Floating artwork demonstration cards
  const heroCards: Card[] = [
    { id: 'h1', color: 'red', value: '7', score: 7 },
    { id: 'h2', color: 'blue', value: 'skip', score: 20 },
    { id: 'h3', color: 'wild', value: 'wild_draw4', score: 50 },
    { id: 'h4', color: 'yellow', value: 'reverse', score: 20 },
    { id: 'h5', color: 'green', value: 'draw2', score: 20 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#F3F4F6] relative overflow-hidden">
      <Navbar
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 flex flex-col items-center justify-center text-center relative z-10">
        {/* Ambient Top Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171A24] border border-[#2B3040] text-xs font-semibold text-violet-300 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Classic Multiplayer Experience</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Your friends. Your cards.{' '}
          <span className="shimmer-text">Your chaos.</span>
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed mb-10">
          Create a private table, invite your friends with a 6-character code, and let the last card decide everything.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center mb-6">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-extrabold text-sm text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
          >
            Create a Room
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsJoinOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#171A24] hover:bg-[#1E2230] border border-[#2B3040] font-bold text-sm text-gray-200 hover:text-white transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
          >
            Join a Room
          </button>
        </div>

        {/* Truthful Subtitle Caption */}
        <p className="text-xs text-gray-500 font-medium tracking-wide">
          Free to play · No account required · Play with friends
        </p>

        {/* Hero Artwork Composition: Layered Floating Cards */}
        <div className="mt-14 sm:mt-20 relative w-full max-w-3xl flex items-center justify-center py-8">
          <div className="relative flex items-center justify-center -space-x-8 sm:-space-x-12">
            {/* Card 1: Red 7 */}
            <div className="transform -rotate-16 -translate-y-2 hover:-translate-y-6 transition-all duration-300">
              <CardView card={heroCards[0]} size="lg" isPlayable />
            </div>

            {/* Card 2: Blue Skip */}
            <div className="transform -rotate-8 translate-y-1 hover:-translate-y-6 transition-all duration-300">
              <CardView card={heroCards[1]} size="lg" isPlayable />
            </div>

            {/* Center Focal Card: Wild Draw 4 */}
            <div className="transform rotate-0 -translate-y-5 scale-110 z-20 hover:-translate-y-8 transition-all duration-300 shadow-[0_0_40px_rgba(124,58,237,0.4)]">
              <CardView card={heroCards[2]} size="lg" isPlayable />
            </div>

            {/* Card 4: Yellow Reverse */}
            <div className="transform rotate-8 translate-y-1 hover:-translate-y-6 transition-all duration-300">
              <CardView card={heroCards[3]} size="lg" isPlayable />
            </div>

            {/* Card 5: Green Draw 2 */}
            <div className="transform rotate-16 -translate-y-2 hover:-translate-y-6 transition-all duration-300">
              <CardView card={heroCards[4]} size="lg" isPlayable />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="w-full mt-20 pt-16 border-t border-[#1C202B]">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">How It Works</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-10">Zero hassle setup. Ready in 10 seconds.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#12141D] border border-[#232733] relative overflow-hidden group hover:border-violet-500/40 transition">
              <span className="text-xs font-mono font-black text-violet-400 mb-3 block">01</span>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-400" />
                Create your room
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Click Create a Room to set your player capacity and turn timer. A private table is instantly reserved.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141D] border border-[#232733] relative overflow-hidden group hover:border-violet-500/40 transition">
              <span className="text-xs font-mono font-black text-violet-400 mb-3 block">02</span>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                Share your code
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Copy your unique 6-character invite code or direct invite link and send it to your friends on Discord or WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12141D] border border-[#232733] relative overflow-hidden group hover:border-violet-500/40 transition">
              <span className="text-xs font-mono font-black text-violet-400 mb-3 block">03</span>
              <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
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
      <footer className="w-full border-t border-[#1C202B] py-8 bg-[#090A0D] text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
