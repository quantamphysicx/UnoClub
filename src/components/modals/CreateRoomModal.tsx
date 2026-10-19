'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { X, Sparkles, Users, Clock, ShieldCheck, Loader2 } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter();
  const { createRoom } = useGame();

  const [maxPlayers, setMaxPlayers] = useState(8);
  const [turnTimerSeconds, setTurnTimerSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const res = await createRoom({
      maxPlayers,
      startingCards: 7,
      turnTimerSeconds,
    });

    setIsSubmitting(false);
    if (res.success && res.roomCode) {
      onClose();
      router.push(`/room/${res.roomCode}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#11131A] border border-[#232733] rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white">Create Private Room</h2>
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Set up a private table. An invitation code will be generated for your friends.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Game Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Game Mode
            </label>
            <div className="p-3 rounded-xl bg-[#171A23] border border-violet-500/40 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  Classic UNO
                  <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 text-[10px] font-semibold border border-violet-500/30">
                    Official Rules
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">Standard 108 cards, skips, reverses, +2, wilds & +4.</p>
              </div>
            </div>
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              Maximum Capacity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    maxPlayers === num
                      ? 'border-violet-500 bg-violet-600/20 text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                      : 'border-[#232733] bg-[#171A23] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {num} Players
                </button>
              ))}
            </div>
          </div>

          {/* Turn Timer */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              Turn Timer
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 0, label: 'No Limit' },
                { val: 15, label: '15s' },
                { val: 30, label: '30s' },
                { val: 45, label: '45s' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setTurnTimerSeconds(item.val)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    turnTimerSeconds === item.val
                      ? 'border-violet-500 bg-violet-600/20 text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                      : 'border-[#232733] bg-[#171A23] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-[#141721] border border-[#232733] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-[11px] text-gray-400">
              Private room. Only people with your unique 6-character room code can join.
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232733]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-[0_0_18px_rgba(124,58,237,0.4)] transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Room...
                </>
              ) : (
                'Create Room'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
