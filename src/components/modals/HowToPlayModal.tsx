'use client';

import React from 'react';
import { X, BookOpen, Layers, ShieldAlert, Zap, Trophy } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] bg-[#11131A] border border-[#232733] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="p-5 border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Classic UNO Rules Guide</h2>
              <p className="text-xs text-gray-400">Official rules and tactical card mechanics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-gray-300">
          {/* Section 1: Objective */}
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Objective
            </h3>
            <p className="leading-relaxed text-gray-400 text-xs sm:text-sm">
              Be the first player to play all cards from your hand. Each round begins with 7 cards dealt to all players.
            </p>
          </div>

          {/* Section 2: Playing a Card */}
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Legal Plays
            </h3>
            <p className="leading-relaxed text-gray-400 text-xs sm:text-sm mb-3">
              On your turn, you must match the top card of the discard pile by:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#171A23] border border-[#232733]">
                <span className="font-bold text-red-400 block mb-1">Color Match</span>
                Play any card matching the active color (Red, Blue, Green, or Yellow).
              </div>
              <div className="p-3 rounded-xl bg-[#171A23] border border-[#232733]">
                <span className="font-bold text-emerald-400 block mb-1">Number / Symbol</span>
                Play any card matching the number or symbol (e.g. Yellow 7 on Blue 7).
              </div>
              <div className="p-3 rounded-xl bg-[#171A23] border border-[#232733]">
                <span className="font-bold text-violet-400 block mb-1">Wild Cards</span>
                Wild and Wild Draw 4 can be played at any time.
              </div>
            </div>
          </div>

          {/* Section 3: Action Cards */}
          <div>
            <h3 className="text-white font-bold flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-violet-400" />
              Action Cards
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[90px]">Skip:</span>
                <span className="text-gray-400">Next player in order loses their turn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[90px]">Reverse:</span>
                <span className="text-gray-400">
                  Reverses direction of play. (In 2-player matches, acts as a Skip).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[90px]">Draw Two:</span>
                <span className="text-gray-400">Next player draws 2 cards and forfeits their turn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[90px]">Wild:</span>
                <span className="text-gray-400">Change the active color to any of the 4 colors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-white min-w-[90px]">Wild Draw Four:</span>
                <span className="text-gray-400">
                  Change active color + next player draws 4 cards and loses their turn.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 4: Calling UNO */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-transparent border border-red-500/30">
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Calling &quot;UNO!&quot;
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              When you play your second-to-last card and hold only <strong>1 card</strong>, you MUST click the{' '}
              <strong className="text-red-400">UNO</strong> button. If an opponent catches you and challenges your
              uncalled UNO before you declare it, you must draw <strong>2 penalty cards</strong>!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#232733] bg-[#0E1015] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition"
          >
            Got it, let&apos;s play!
          </button>
        </div>
      </div>
    </div>
  );
}
