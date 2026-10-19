'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { Avatar, AVATAR_OPTIONS } from '../Avatar';
import { X, Clipboard, Loader2, User } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export function JoinRoomModal({ isOpen, onClose, initialCode = '' }: JoinRoomModalProps) {
  const router = useRouter();
  const { joinRoom, playerName, playerAvatar } = useGame();

  const [code, setCode] = useState(initialCode);
  const [guestName, setGuestName] = useState(playerName);
  const [guestAvatar, setGuestAvatar] = useState(playerAvatar);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (playerName && playerName !== 'Player') {
      setGuestName(playerName);
    }
    setGuestAvatar(playerAvatar);
  }, [playerName, playerAvatar]);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode.toUpperCase().trim());
    }
  }, [initialCode]);

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const cleaned = text.split('/').pop()?.trim().toUpperCase().slice(0, 6) || '';
        setCode(cleaned);
      }
    } catch {
      // Clipboard denied
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 4 || cleanCode.length > 8) {
      setError('Please enter a valid room code.');
      return;
    }

    const cleanName = guestName.trim();
    if (!cleanName || cleanName.length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const res = await joinRoom(cleanCode, cleanName, guestAvatar);
    setIsSubmitting(false);

    if (res.success && res.roomCode) {
      onClose();
      router.push(`/room/${res.roomCode}`);
    } else {
      setError(res.error || 'Failed to join room. Verify the code.');
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

        <h2 className="text-lg font-bold text-[#F2F0EB] mb-1">Join with Code</h2>
        <p className="text-xs text-[#777570] mb-5">Enter the 6-character room code to join the table.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Code */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5">
              Room Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
                  setError('');
                }}
                placeholder="e.g. K7M4QX"
                maxLength={8}
                className="w-full bg-[#202020] border border-[#333333] focus:border-[#D6FF62] rounded pl-3 pr-20 py-2.5 text-base font-mono font-bold tracking-widest text-[#F2F0EB] placeholder-[#555555] outline-none transition uppercase"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 rounded bg-[#2A2A2A] hover:bg-[#333333] text-[11px] font-mono text-[#A5A39E] hover:text-[#F2F0EB] transition cursor-pointer"
              >
                <Clipboard className="w-3 h-3" />
                Paste
              </button>
            </div>
          </div>

          {/* Player Name */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Your Display Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Charlie"
              maxLength={20}
              className="w-full bg-[#202020] border border-[#333333] focus:border-[#D6FF62] rounded px-3 py-2 text-sm text-[#F2F0EB] placeholder-[#555555] outline-none transition"
            />
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
                  onClick={() => setGuestAvatar(opt.id)}
                  className={`p-1.5 rounded border flex items-center justify-center transition cursor-pointer ${
                    guestAvatar === opt.id
                      ? 'border-[#D6FF62] bg-[#222818]'
                      : 'border-[#2C2C2C] bg-[#202020] hover:border-[#444444]'
                  }`}
                >
                  <Avatar avatarId={opt.id} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-[#D32F2F] mt-1">{error}</p>}

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
              disabled={isSubmitting || !code.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded text-xs font-bold text-[#101010] bg-[#D6FF62] hover:bg-[#C4F04D] transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Enter Table'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
