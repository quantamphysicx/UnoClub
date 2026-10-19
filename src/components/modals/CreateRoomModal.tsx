'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { Avatar, AVATAR_OPTIONS } from '../Avatar';
import { X, Users, Clock, ShieldCheck, Loader2, Sparkles, User } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter();
  const { createRoom, playerName, playerAvatar } = useGame();

  const [hostName, setHostName] = useState(playerName);
  const [hostAvatar, setHostAvatar] = useState(playerAvatar);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [turnTimerSeconds, setTurnTimerSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (playerName && playerName !== 'Player') {
      setHostName(playerName);
    }
    setHostAvatar(playerAvatar);
  }, [playerName, playerAvatar]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanName = hostName.trim();
    if (!cleanName || cleanName.length < 2) {
      setError('Please enter a display name (at least 2 characters).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const res = await createRoom(
      {
        maxPlayers,
        startingCards: 7,
        turnTimerSeconds,
      },
      cleanName,
      hostAvatar
    );

    setIsSubmitting(false);
    if (res.success && res.roomCode) {
      onClose();
      router.push(`/room/${res.roomCode}`);
    } else {
      setError(res.error || 'Failed to create room.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#12141C] border border-[#262B3A] rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white">Create Private Room</h2>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          Configure table settings and choose your player alias.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Host Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-violet-400" />
              Your Display Name
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => {
                setHostName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Alex"
              maxLength={20}
              className="w-full bg-[#181B26] border border-[#2D3346] focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:ring-1 focus:ring-violet-500"
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setHostAvatar(opt.id)}
                  className={`p-1.5 rounded-xl border flex items-center justify-center transition ${
                    hostAvatar === opt.id
                      ? 'border-violet-500 bg-violet-600/20 ring-2 ring-violet-500/50'
                      : 'border-[#262B3A] bg-[#181B26] hover:border-gray-600'
                  }`}
                >
                  <Avatar avatarId={opt.id} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              Player Capacity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    maxPlayers === num
                      ? 'border-violet-500 bg-violet-600/20 text-white'
                      : 'border-[#262B3A] bg-[#181B26] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {num} Players
                </button>
              ))}
            </div>
          </div>

          {/* Turn Timer */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              Turn Timer
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 0, label: 'Off' },
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
                      ? 'border-violet-500 bg-violet-600/20 text-white'
                      : 'border-[#262B3A] bg-[#181B26] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-[#161822] border border-[#262B3A] flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-[11px] text-gray-400">
              Only friends with your unique 6-character room code can enter.
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#262B3A]">
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Room...
                </>
              ) : (
                'Create Table'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
