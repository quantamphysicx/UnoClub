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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-2xl max-h-[85vh] bg-[#181818] border border-[#333333] rounded shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="p-5 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#D6FF62]" />
            <div>
              <h2 className="text-base font-bold text-[#F2F0EB]">Classic UNO Rules Guide</h2>
              <p className="text-xs text-[#777570]">Standard 108 cards tournament rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777570] hover:text-[#F2F0EB] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#A5A39E]">
          {/* Section 1: Objective */}
          <div>
            <h3 className="text-[#F2F0EB] font-bold flex items-center gap-2 mb-1.5 text-xs uppercase font-mono tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#F57F17]" />
              Objective
            </h3>
            <p className="leading-relaxed text-xs sm:text-sm text-[#A5A39E]">
              Be the first player to empty your hand. Every round starts with 7 cards dealt to each player.
            </p>
          </div>

          {/* Section 2: Playing a Card */}
          <div>
            <h3 className="text-[#F2F0EB] font-bold flex items-center gap-2 mb-2 text-xs uppercase font-mono tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#1976D2]" />
              Legal Plays
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded bg-[#202020] border border-[#2E2E2E]">
                <span className="font-bold text-[#D32F2F] block mb-1">Color Match</span>
                Play any card matching the active color (Red, Blue, Green, or Yellow).
              </div>
              <div className="p-3 rounded bg-[#202020] border border-[#2E2E2E]">
                <span className="font-bold text-[#2E7D32] block mb-1">Value Match</span>
                Play any card matching the number or symbol (e.g. Yellow 7 on Blue 7).
              </div>
              <div className="p-3 rounded bg-[#202020] border border-[#2E2E2E]">
                <span className="font-bold text-[#F2F0EB] block mb-1">Wild Cards</span>
                Wild and Wild Draw 4 can be played on any card at any time.
              </div>
            </div>
          </div>

          {/* Section 3: Action Cards */}
          <div>
            <h3 className="text-[#F2F0EB] font-bold flex items-center gap-2 mb-2 text-xs uppercase font-mono tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#D6FF62]" />
              Action Cards
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#F2F0EB] min-w-[100px] text-xs font-bold">Skip:</span>
                <span className="text-[#A5A39E]">Next player loses their turn.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#F2F0EB] min-w-[100px] text-xs font-bold">Reverse:</span>
                <span className="text-[#A5A39E]">
                  Reverses direction. (In 2-player matches, acts as a Skip).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#F2F0EB] min-w-[100px] text-xs font-bold">Draw Two:</span>
                <span className="text-[#A5A39E]">Next player draws 2 cards and is skipped.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#F2F0EB] min-w-[100px] text-xs font-bold">Wild:</span>
                <span className="text-[#A5A39E]">Changes the active color to Red, Blue, Green, or Yellow.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[#F2F0EB] min-w-[100px] text-xs font-bold">Wild Draw 4:</span>
                <span className="text-[#A5A39E]">
                  Changes active color + next player draws 4 cards and is skipped.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 4: Calling UNO */}
          <div className="p-3.5 rounded bg-[#202020] border border-[#D32F2F]">
            <h3 className="text-[#D32F2F] font-bold flex items-center gap-1.5 mb-1 text-xs uppercase font-mono tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D32F2F]" />
              Calling &quot;UNO!&quot;
            </h3>
            <p className="text-xs text-[#F2F0EB] leading-relaxed">
              When playing your second-to-last card leaving only <strong>1 card</strong>, you MUST click the{' '}
              <strong className="text-[#D32F2F]">CALL UNO</strong> button. If an opponent catches you before you declare it, you must draw <strong>2 penalty cards</strong>!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#282828] bg-[#141414] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-bold text-[#101010] bg-[#D6FF62] hover:bg-[#C4F04D] transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
