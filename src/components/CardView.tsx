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
  // Dimensions for various card sizes
  const sizeStyles = {
    xs: 'w-12 h-18 text-[10px] rounded-md',
    sm: 'w-16 h-24 text-xs rounded-lg',
    md: 'w-22 h-34 text-sm rounded-xl',
    lg: 'w-28 h-42 text-base rounded-2xl',
  }[size];

  // If card back is requested
  if (isBack || !card) {
    return (
      <div
        className={`relative select-none card-perspective transition-all duration-200 ${sizeStyles} ${className}`}
        style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
      >
        <div className="w-full h-full bg-gradient-to-br from-[#1E222D] to-[#0E1015] border border-[#2D3344] shadow-xl flex items-center justify-center rounded-[inherit] overflow-hidden p-1.5">
          {/* Subtle concentric inner oval */}
          <div className="w-full h-full rounded-[inherit] border border-[#3A4259]/50 flex items-center justify-center bg-[#141720]/60 relative">
            <div className="w-10 h-14 rounded-full border border-violet-500/30 bg-violet-600/10 flex items-center justify-center transform -rotate-12">
              <span className="text-[9px] font-black tracking-widest text-violet-400/90 font-mono">
                CLUB
              </span>
            </div>
            {/* Corner dots */}
            <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-violet-500/40" />
            <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-violet-500/40" />
          </div>
        </div>
      </div>
    );
  }

  // Card themes
  const colorThemes: Record<CardColor, { bg: string; border: string; glow: string; text: string; sub: string }> = {
    red: {
      bg: 'bg-gradient-to-br from-[#EF4444] via-[#DC2626] to-[#991B1B]',
      border: 'border-[#F87171]/60',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      text: 'text-white',
      sub: '#EF4444',
    },
    blue: {
      bg: 'bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1E40AF]',
      border: 'border-[#60A5FA]/60',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      text: 'text-white',
      sub: '#3B82F6',
    },
    green: {
      bg: 'bg-gradient-to-br from-[#10B981] via-[#059669] to-[#065F46]',
      border: 'border-[#34D399]/60',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      text: 'text-white',
      sub: '#10B981',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#92400E]',
      border: 'border-[#FBBF24]/60',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
      text: 'text-white',
      sub: '#F59E0B',
    },
    wild: {
      bg: 'bg-gradient-to-br from-[#1E222D] via-[#12141A] to-[#0A0C10]',
      border: 'border-violet-500/80',
      glow: 'shadow-[0_0_22px_rgba(168,85,247,0.6)]',
      text: 'text-white',
      sub: '#8B5CF6',
    },
  };

  const theme = colorThemes[card.color];

  // Render original vector symbols
  const renderSymbol = (isSmall: boolean = false) => {
    const iconSize = isSmall ? (size === 'xs' ? 8 : 12) : size === 'xs' ? 14 : size === 'sm' ? 18 : 28;

    switch (card.value) {
      case 'skip':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        );
      case 'reverse':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 12h16M4 12l4-4M4 12l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 12l-4-4M20 12l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'draw2':
        return isSmall ? (
          <span className="font-black">+2</span>
        ) : (
          <div className="flex flex-col items-center">
            <span className="font-black tracking-tight text-xl leading-none">+2</span>
            <div className="flex -space-x-1 mt-0.5">
              <div className="w-3.5 h-5 rounded-xs border border-white/60 bg-white/20" />
              <div className="w-3.5 h-5 rounded-xs border border-white/80 bg-white/40" />
            </div>
          </div>
        );
      case 'wild':
        return (
          <div
            className={`rounded-full border-2 border-white/40 overflow-hidden shadow-inner flex flex-wrap ${
              isSmall ? 'w-3 h-3' : size === 'xs' ? 'w-5 h-5' : size === 'sm' ? 'w-7 h-7' : 'w-10 h-10'
            }`}
          >
            <div className="w-1/2 h-1/2 bg-[#EF4444]" />
            <div className="w-1/2 h-1/2 bg-[#3B82F6]" />
            <div className="w-1/2 h-1/2 bg-[#F59E0B]" />
            <div className="w-1/2 h-1/2 bg-[#10B981]" />
          </div>
        );
      case 'wild_draw4':
        return isSmall ? (
          <span className="font-black text-amber-300">+4</span>
        ) : (
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full border-2 border-white/40 overflow-hidden flex flex-wrap mb-0.5 ${
                size === 'xs' ? 'w-4 h-4' : 'w-7 h-7'
              }`}
            >
              <div className="w-1/2 h-1/2 bg-[#EF4444]" />
              <div className="w-1/2 h-1/2 bg-[#3B82F6]" />
              <div className="w-1/2 h-1/2 bg-[#F59E0B]" />
              <div className="w-1/2 h-1/2 bg-[#10B981]" />
            </div>
            <span className="font-black tracking-tight text-lg text-amber-300 leading-none">+4</span>
          </div>
        );
      default:
        // Number cards 0-9
        return (
          <span className={`font-black font-sans leading-none ${isSmall ? 'text-xs' : 'text-3xl'}`}>
            {card.value}
          </span>
        );
    }
  };

  return (
    <div
      onClick={!disabled && isPlayable && onClick ? onClick : undefined}
      className={`relative select-none border ${sizeStyles} ${theme.bg} ${theme.border} ${theme.text} ${
        isPlayable
          ? `cursor-pointer card-3d ${theme.glow} ring-2 ring-white/60 hover:ring-white z-10`
          : 'cursor-default opacity-90'
      } ${isSelected ? '-translate-y-4 ring-4 ring-yellow-400' : ''} ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } transition-all duration-200 overflow-hidden shadow-lg p-1.5 ${className}`}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* Dynamic central oval */}
      <div className="w-full h-full rounded-[inherit] border border-white/20 bg-black/15 flex items-center justify-center relative overflow-hidden">
        {/* Subtle top-left corner index */}
        <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
          {renderSymbol(true)}
        </div>

        {/* Center symbol */}
        <div className="transform transition-transform duration-200 flex items-center justify-center">
          {renderSymbol(false)}
        </div>

        {/* Bottom-right inverted corner index */}
        <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none transform rotate-180">
          {renderSymbol(true)}
        </div>

        {/* Subtle sheen line */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-md pointer-events-none" />
      </div>
    </div>
  );
}
