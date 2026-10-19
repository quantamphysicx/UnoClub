'use client';

import React from 'react';
import { CardColor } from '@/types/game';

interface WildColorPickerModalProps {
  isOpen: boolean;
  onSelectColor: (color: CardColor) => void;
}

export function WildColorPickerModal({ isOpen, onSelectColor }: WildColorPickerModalProps) {
  if (!isOpen) return null;

  const colors: { id: CardColor; label: string; bg: string; hoverBg: string }[] = [
    {
      id: 'red',
      label: 'Red',
      bg: 'bg-[#D32F2F]',
      hoverBg: 'hover:bg-[#B71C1C]',
    },
    {
      id: 'blue',
      label: 'Blue',
      bg: 'bg-[#1976D2]',
      hoverBg: 'hover:bg-[#0D47A1]',
    },
    {
      id: 'green',
      label: 'Green',
      bg: 'bg-[#2E7D32]',
      hoverBg: 'hover:bg-[#1B5E20]',
    },
    {
      id: 'yellow',
      label: 'Yellow',
      bg: 'bg-[#F57F17]',
      hoverBg: 'hover:bg-[#E65100]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-150">
      <div className="w-full max-w-xs bg-[#181818] border border-[#333333] rounded-xl shadow-2xl p-5 text-left">
        <h2 className="text-sm font-bold text-[#F2F0EB] tracking-tight">Select Active Color</h2>
        <p className="text-xs text-[#A5A39E] mb-4">Choose the color for the next player to follow</p>

        <div className="grid grid-cols-2 gap-2.5">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectColor(c.id)}
              className={`h-20 rounded-lg ${c.bg} ${c.hoverBg} text-white font-black text-sm tracking-wide uppercase transition active:scale-95 flex items-center justify-center border border-white/15`}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
