'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { Avatar, AVATAR_OPTIONS } from '../Avatar';
import { X, LogIn, Clipboard, Loader2, User } from 'lucide-react';

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
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <LogIn className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white">Join Private Room</h2>
        </div>
        <p className="text-xs text-gray-400 mb-5">Enter the 6-character room code shared by your friend.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Code */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
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
                className="w-full bg-[#181B26] border border-[#2D3346] focus:border-indigo-500 rounded-xl pl-4 pr-24 py-3 text-lg font-mono font-bold tracking-widest text-white placeholder-gray-600 outline-none transition focus:ring-1 focus:ring-indigo-500 uppercase"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#222736] hover:bg-[#2A3144] text-[11px] font-semibold text-gray-300 hover:text-white transition"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Paste
              </button>
            </div>
          </div>

          {/* Player Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
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
              className="w-full bg-[#181B26] border border-[#2D3346] focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:ring-1 focus:ring-indigo-500"
            />
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
                  onClick={() => setGuestAvatar(opt.id)}
                  className={`p-1.5 rounded-xl border flex items-center justify-center transition ${
                    guestAvatar === opt.id
                      ? 'border-indigo-500 bg-indigo-600/20 ring-2 ring-indigo-500/50'
                      : 'border-[#262B3A] bg-[#181B26] hover:border-gray-600'
                  }`}
                >
                  <Avatar avatarId={opt.id} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

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
              disabled={isSubmitting || !code.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
