'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '@/context/GameContext';
import { Avatar } from '../Avatar';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#11131A] border border-violet-500/40 rounded-3xl shadow-[0_0_50px_rgba(124,58,237,0.3)] overflow-hidden p-6 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Trophy className="w-3.5 h-3.5" />
          Match Complete
        </div>

        {/* Winner Showcase */}
        <div className="relative inline-block mb-3">
          <Avatar avatarId={winner.avatar} size="xl" glow />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 border-2 border-[#11131A] flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          {isMe ? 'Victory! You Won!' : `${winner.name} Wins!`}
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          {isMe
            ? 'Incredible moves! You emptied your hand before anyone else.'
            : 'Well played! All cards played and match officially resolved.'}
        </p>

        {/* Action Controls */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={rematch}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-sm text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 transition active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            Rematch (Play Again)
          </button>

          <button
            onClick={() => {
              leaveRoom();
              window.location.href = '/';
            }}
            className="w-full py-3 rounded-xl bg-[#171A23] hover:bg-[#1E222D] border border-[#2B3040] font-semibold text-xs text-gray-300 hover:text-white flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            Exit to Home
          </button>
        </div>
      </div>
    </div>
  );
}
