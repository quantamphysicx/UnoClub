'use client';

import React from 'react';
import { Card, CardColor, CardValue } from '@/types/game';

interface CardViewProps {
  card?: Card;
  isBack?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isPlayable?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  rotation?: number;
}

export function CardView({
  card,
  isBack = false,
  size = 'md',
  isPlayable = false,
  isSelected = false,
  disabled = false,
  onClick,
  className = '',
  rotation = 0,
}: CardViewProps) {
  // Sizing definitions: maintaining exact standard 2.5:3.5 card ratio
  const sizeStyles = {
    xs: 'w-10 h-14 text-[9px] rounded-lg',
    sm: 'w-16 h-23 text-xs rounded-xl',
    md: 'w-24 h-34 text-sm rounded-2xl',
    lg: 'w-32 h-45 text-base rounded-2xl',
  }[size];

  // ================= CARD BACK =================
  if (isBack || !card) {
    return (
      <div
        className={`relative select-none uno-card shadow-lg bg-[#0E1017] border-2 border-[#222634] ${sizeStyles} ${className} overflow-hidden p-1 sm:p-1.5`}
        style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      >
        {/* Crisp white inner margin line */}
        <div className="w-full h-full rounded-[inherit] border border-white/20 bg-[#141722] flex items-center justify-center relative overflow-hidden">
          {/* Subtle geometric cross-hatch pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `radial-gradient(circle, #FFFFFF 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
            }}
          />

          {/* Central Tilted Oval with Bold UNO Emblem */}
          <div className="w-4/5 h-1/2 rounded-[50%] bg-[#D32F2F] border-2 border-white flex items-center justify-center transform -rotate-25 shadow-md">
            <span className="font-black text-white italic tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-xs sm:text-base font-sans">
              UNO
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ================= CARD FACE =================
  // Solid, authentic casino card colors (NO AI gradient slop)
  const colorPalette: Record<
    CardColor,
    {
      bg: string;
      border: string;
      textColor: string;
      hex: string;
    }
  > = {
    red: {
      bg: 'bg-[#D32F2F]',
      border: 'border-[#9A0007]',
      textColor: 'text-[#D32F2F]',
      hex: '#D32F2F',
    },
    blue: {
      bg: 'bg-[#1976D2]',
      border: 'border-[#004BA0]',
      textColor: 'text-[#1976D2]',
      hex: '#1976D2',
    },
    green: {
      bg: 'bg-[#2E7D32]',
      border: 'border-[#005005]',
      textColor: 'text-[#2E7D32]',
      hex: '#2E7D32',
    },
    yellow: {
      bg: 'bg-[#F57F17]',
      border: 'border-[#BC5100]',
      textColor: 'text-[#F57F17]',
      hex: '#F57F17',
    },
    wild: {
      bg: 'bg-[#181A20]',
      border: 'border-[#2D313D]',
      textColor: 'text-white',
      hex: '#181A20',
    },
  };

  const theme = colorPalette[card.color];

  // Render Corner Symbols (Top-Left & Rotated Bottom-Right)
  const renderCornerValue = () => {
    switch (card.value) {
      case 'skip':
        return (
          <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="3">
            <circle cx="12" cy="12" r="9" />
            <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
          </svg>
        );
      case 'reverse':
        return (
          <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="3">
            <path d="M4 12h14M4 12l4-4M4 12l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 12l-4-4M20 12l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'draw2':
        return <span className="font-black text-[10px] sm:text-xs text-white leading-none tracking-tight">+2</span>;
      case 'wild':
        return (
          <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-white flex flex-wrap overflow-hidden">
            <div className="w-1/2 h-1/2 bg-[#D32F2F]" />
            <div className="w-1/2 h-1/2 bg-[#1976D2]" />
            <div className="w-1/2 h-1/2 bg-[#F57F17]" />
            <div className="w-1/2 h-1/2 bg-[#2E7D32]" />
          </div>
        );
      case 'wild_draw4':
        return <span className="font-black text-[10px] sm:text-xs text-amber-300 leading-none tracking-tight">+4</span>;
      default:
        return <span className="font-black text-xs sm:text-sm text-white leading-none font-sans drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">{card.value}</span>;
    }
  };

  // Render Central Large Symbol inside the Iconic White Tilted Oval
  const renderCenterGraphic = () => {
    const isSmall = size === 'xs';
    const isMedium = size === 'sm';

    switch (card.value) {
      case 'skip':
        return (
          <svg
            className={`stroke-current ${isSmall ? 'w-4 h-4' : isMedium ? 'w-6 h-6' : 'w-9 h-9'}`}
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="3.5"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
          </svg>
        );
      case 'reverse':
        return (
          <svg
            className={`stroke-current ${isSmall ? 'w-4 h-4' : isMedium ? 'w-6 h-6' : 'w-9 h-9'}`}
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 10h12M5 10l4-4M5 10l4 4" />
            <path d="M19 14H7M19 14l-4-4M19 14l-4 4" />
          </svg>
        );
      case 'draw2':
        return (
          <div className="flex flex-col items-center">
            <span className={`font-black tracking-tight leading-none ${isSmall ? 'text-xs' : isMedium ? 'text-lg' : 'text-2xl'}`}>
              +2
            </span>
          </div>
        );
      case 'wild':
        return (
          <div
            className={`rounded-full border-2 border-white shadow-md flex flex-wrap overflow-hidden ${
              isSmall ? 'w-5 h-5' : isMedium ? 'w-8 h-8' : 'w-12 h-12'
            }`}
          >
            <div className="w-1/2 h-1/2 bg-[#D32F2F]" />
            <div className="w-1/2 h-1/2 bg-[#1976D2]" />
            <div className="w-1/2 h-1/2 bg-[#F57F17]" />
            <div className="w-1/2 h-1/2 bg-[#2E7D32]" />
          </div>
        );
      case 'wild_draw4':
        return (
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full border border-white shadow-sm flex flex-wrap overflow-hidden mb-0.5 ${
                isSmall ? 'w-4 h-4' : isMedium ? 'w-6 h-6' : 'w-8 h-8'
              }`}
            >
              <div className="w-1/2 h-1/2 bg-[#D32F2F]" />
              <div className="w-1/2 h-1/2 bg-[#1976D2]" />
              <div className="w-1/2 h-1/2 bg-[#F57F17]" />
              <div className="w-1/2 h-1/2 bg-[#2E7D32]" />
            </div>
            <span className={`font-black text-amber-500 tracking-tight leading-none ${isSmall ? 'text-xs' : isMedium ? 'text-sm' : 'text-xl'}`}>
              +4
            </span>
          </div>
        );
      default:
        return (
          <span
            className={`font-black font-sans leading-none drop-shadow-[0_2px_1px_rgba(0,0,0,0.25)] ${
              isSmall ? 'text-base' : isMedium ? 'text-2xl' : 'text-4xl'
            }`}
          >
            {card.value}
          </span>
        );
    }
  };

  return (
    <div
      onClick={!disabled && isPlayable && onClick ? onClick : undefined}
      className={`relative select-none uno-card border-2 ${sizeStyles} ${theme.bg} ${theme.border} ${
        isPlayable
          ? 'uno-card-playable ring-2 ring-white/90 shadow-[0_8px_20px_rgba(0,0,0,0.6)] z-10'
          : 'cursor-default opacity-85 shadow-md'
      } ${isSelected ? '-translate-y-4 ring-4 ring-yellow-400' : ''} ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } overflow-hidden p-1 sm:p-1.5 transition-all duration-150 ${className}`}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* Crisp White Inner Margin Frame (Authentic physical card stock) */}
      <div className="w-full h-full rounded-[inherit] border border-white/40 flex items-center justify-center relative overflow-hidden bg-black/10">
        {/* Top-Left Corner Index */}
        <div className="absolute top-1 left-1.5 flex flex-col items-center">
          {renderCornerValue()}
        </div>

        {/* Central Iconic White Oval Plate (rotated -25 deg) */}
        <div className="w-[82%] h-[68%] rounded-[50%] bg-white flex items-center justify-center transform -rotate-25 shadow-md border border-black/10">
          <div className={`transform rotate-25 ${theme.textColor} flex items-center justify-center`}>
            {renderCenterGraphic()}
          </div>
        </div>

        {/* Bottom-Right Inverted Corner Index */}
        <div className="absolute bottom-1 right-1.5 flex flex-col items-center transform rotate-180">
          {renderCornerValue()}
        </div>
      </div>
    </div>
  );
}
