'use client';

import React from 'react';
import { CardColor } from '@/types/game';

interface WildColorPickerModalProps {
  isOpen: boolean;
  onSelectColor: (color: CardColor) => void;
}

export function WildColorPickerModal({ isOpen, onSelectColor }: WildColorPickerModalProps) {
  if (!isOpen) return null;

  const colors: { id: CardColor; label: string; bg: string; border: string; glow: string }[] = [
    {
      id: 'red',
      label: 'Red',
      bg: 'bg-red-600 hover:bg-red-500',
      border: 'border-red-400',
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.5)]',
    },
    {
      id: 'blue',
      label: 'Blue',
      bg: 'bg-blue-600 hover:bg-blue-500',
      border: 'border-blue-400',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    },
    {
      id: 'green',
      label: 'Green',
      bg: 'bg-emerald-600 hover:bg-emerald-500',
      border: 'border-emerald-400',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.5)]',
    },
    {
      id: 'yellow',
      label: 'Yellow',
      bg: 'bg-amber-500 hover:bg-amber-400',
      border: 'border-amber-300',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
      <div className="w-full max-w-sm bg-[#11131A] border border-[#232733] rounded-3xl shadow-2xl p-6 text-center">
        <h2 className="text-xl font-black text-white mb-1 tracking-tight">Choose Active Color</h2>
        <p className="text-xs text-gray-400 mb-6">Select the color for the next player to follow</p>

        <div className="grid grid-cols-2 gap-3.5">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectColor(c.id)}
              className={`h-24 rounded-2xl ${c.bg} border ${c.border} text-white font-extrabold text-base tracking-wider uppercase transition-all duration-150 hover:scale-105 active:scale-95 ${c.glow} flex flex-col items-center justify-center`}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
