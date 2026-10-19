'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { Avatar } from '../Avatar';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface VictoryModalProps {
  winnerId: string;
  onReturnToLobby?: () => void;
}

export function VictoryModal({ winnerId, onReturnToLobby }: VictoryModalProps) {
  const { publicState, playerId, rematch, leaveRoom } = useGame();

  const winner = publicState?.players.find((p) => p.id === winnerId);
  const isMe = playerId === winnerId;

  useEffect(() => {
    // Fire confetti cascade
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 400);

      return () => clearTimeout(timeout);
    } catch {
      // Confetti optional
    }
  }, []);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#181818] border border-[#333333] rounded-xl shadow-2xl p-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#202020] border border-[#333333] text-[#A5A39E] text-[11px] font-mono uppercase tracking-wider mb-5">
          <Trophy className="w-3.5 h-3.5 text-[#D6FF62]" />
          Match Finished
        </div>

        {/* Winner Showcase */}
        <div className="flex flex-col items-center justify-center mb-5">
          <Avatar avatarId={winner.avatar} size="xl" />
          <div className="mt-3">
            <h2 className="text-xl font-bold text-[#F2F0EB] tracking-tight">
              {isMe ? 'Victory! You Won!' : `${winner.name} Wins`}
            </h2>
            <p className="text-xs text-[#A5A39E] mt-1 max-w-xs mx-auto">
              {isMe
                ? 'You played your last card before everyone else.'
                : 'All cards played and the round is officially resolved.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#262626]">
          <button
            onClick={rematch}
            className="w-full py-3 rounded-lg bg-[#D6FF62] hover:bg-[#cbf556] font-bold text-xs tracking-wider uppercase text-[#101010] flex items-center justify-center gap-2 transition active:scale-98"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>

          <button
            onClick={() => {
              leaveRoom();
              window.location.href = '/';
            }}
            className="w-full py-2.5 rounded-lg bg-[#202020] hover:bg-[#262626] border border-[#333333] font-medium text-xs text-[#A5A39E] hover:text-[#F2F0EB] flex items-center justify-center gap-2 transition"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
