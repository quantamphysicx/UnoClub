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
    addToast('Profile updated!', 'success');
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#11131A] border border-[#232733] rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Player Profile</h2>
        <p className="text-xs text-gray-400 mb-6">Choose your display name and geometric game avatar.</p>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter your game alias"
              maxLength={20}
              className="w-full bg-[#171A23] border border-[#2B3040] focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:ring-1 focus:ring-violet-500"
            />
            {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>

          {/* Avatar Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2.5">
              Select Avatar
            </label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = selectedAvatar === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setSelectedAvatar(opt.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-violet-500 bg-violet-600/20 ring-2 ring-violet-500/50 scale-105'
                        : 'border-[#232733] bg-[#171A23] hover:border-gray-600'
                    }`}
                  >
                    <Avatar avatarId={opt.id} size="md" glow={isSelected} />
                    <span className="text-[10px] text-gray-300 truncate max-w-full font-medium">
                      {opt.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232733]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.4)] transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
