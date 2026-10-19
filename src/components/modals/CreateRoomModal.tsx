'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { Avatar, AVATAR_OPTIONS } from '../Avatar';
import { X, Users, Clock, Loader2, User } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-md bg-[#181818] border border-[#333333] rounded shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 text-[#777570] hover:text-[#F2F0EB] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-[#F2F0EB] mb-1">Create Table</h2>
        <p className="text-xs text-[#777570] mb-5">
          Configure table settings and choose your alias.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Host Name Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
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
              className="w-full bg-[#202020] border border-[#333333] focus:border-[#D6FF62] rounded px-3 py-2 text-sm text-[#F2F0EB] placeholder-[#555555] outline-none transition"
            />
            {error && <p className="text-xs text-[#D32F2F] mt-1">{error}</p>}
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5">
              Avatar Symbol
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setHostAvatar(opt.id)}
                  className={`p-1.5 rounded border flex items-center justify-center transition cursor-pointer ${
                    hostAvatar === opt.id
                      ? 'border-[#D6FF62] bg-[#222818]'
                      : 'border-[#2C2C2C] bg-[#202020] hover:border-[#444444]'
                  }`}
                >
                  <Avatar avatarId={opt.id} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Capacity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  className={`py-1.5 rounded text-xs font-bold border transition cursor-pointer ${
                    maxPlayers === num
                      ? 'border-[#D6FF62] bg-[#222818] text-[#D6FF62]'
                      : 'border-[#2C2C2C] bg-[#202020] text-[#A5A39E] hover:border-[#444444] hover:text-[#F2F0EB]'
                  }`}
                >
                  {num}P
                </button>
              ))}
            </div>
          </div>

          {/* Turn Timer */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Turn Timer
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 0, label: 'None' },
                { val: 15, label: '15s' },
                { val: 30, label: '30s' },
                { val: 45, label: '45s' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.val}
                  onClick={() => setTurnTimerSeconds(item.val)}
                  className={`py-1.5 rounded text-xs font-bold border transition cursor-pointer ${
                    turnTimerSeconds === item.val
                      ? 'border-[#D6FF62] bg-[#222818] text-[#D6FF62]'
                      : 'border-[#2C2C2C] bg-[#202020] text-[#A5A39E] hover:border-[#444444] hover:text-[#F2F0EB]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded text-xs font-semibold text-[#A5A39E] hover:text-[#F2F0EB] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded text-xs font-bold text-[#101010] bg-[#D6FF62] hover:bg-[#C4F04D] transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating...
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
