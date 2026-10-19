'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { AVATAR_OPTIONS, Avatar } from '../Avatar';
import { X, Check } from 'lucide-react';

interface GuestProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function GuestProfileModal({ isOpen, onClose, onSaved }: GuestProfileModalProps) {
  const { playerName, playerAvatar, setPlayerIdentity, addToast } = useGame();
  const [name, setName] = useState(playerName);
  const [selectedAvatar, setSelectedAvatar] = useState(playerAvatar);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 20) {
      setError('Name cannot exceed 20 characters.');
      return;
    }

    setPlayerIdentity(trimmed, selectedAvatar);
    addToast('Profile updated', 'success');
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-md bg-[#181818] border border-[#333333] rounded shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#777570] hover:text-[#F2F0EB] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-[#F2F0EB] mb-1">Player Profile</h2>
        <p className="text-xs text-[#777570] mb-5">Customize your display name and symbol.</p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter alias"
              maxLength={20}
              className="w-full bg-[#202020] border border-[#333333] focus:border-[#D6FF62] rounded px-3 py-2 text-sm text-[#F2F0EB] placeholder-[#555555] outline-none transition"
            />
            {error && <p className="text-xs text-[#D32F2F] mt-1">{error}</p>}
          </div>

          {/* Avatar Grid */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5A39E] mb-1.5">
              Symbol
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = selectedAvatar === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setSelectedAvatar(opt.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#D6FF62] bg-[#222818]'
                        : 'border-[#2C2C2C] bg-[#202020] hover:border-[#444444]'
                    }`}
                  >
                    <Avatar avatarId={opt.id} size="md" />
                    <span className="text-[10px] text-[#A5A39E] font-mono">
                      {opt.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#262626]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded text-xs font-semibold text-[#A5A39E] hover:text-[#F2F0EB] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-[#101010] bg-[#D6FF62] hover:bg-[#C4F04D] transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
