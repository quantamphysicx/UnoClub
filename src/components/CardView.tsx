'use client';

import React from 'react';
import { Card, CardColor } from '@/types/game';

// ==========================================
// UNIFIED COLOR PALETTE — SOLID, VIBRANT & TACTILE
// ==========================================
export const CARD_COLORS: Record<
  CardColor,
  {
    bg: string;
    border: string;
    textColor: string;
    cornerText: string;
    label: string;
  }
> = {
  red: {
    bg: 'bg-[#D32F2F]',
    border: 'border-[#9A0007]',
    textColor: 'text-[#D32F2F]',
    cornerText: 'text-white',
    label: 'Red',
  },
  blue: {
    bg: 'bg-[#1565C0]',
    border: 'border-[#0D47A1]',
    textColor: 'text-[#1565C0]',
    cornerText: 'text-white',
    label: 'Blue',
  },
  green: {
    bg: 'bg-[#2E7D32]',
    border: 'border-[#1B5E20]',
    textColor: 'text-[#2E7D32]',
    cornerText: 'text-white',
    label: 'Green',
  },
  yellow: {
    bg: 'bg-[#EAB308]', // Radiant golden yellow (authentic UNO yellow)
    border: 'border-[#A16207]',
    textColor: 'text-[#A16207]', // Deep amber for maximum contrast on white oval
    cornerText: 'text-[#141414]', // Crisp dark text for max readability on yellow cardstock
    label: 'Yellow',
  },
  wild: {
    bg: 'bg-[#171717]',
    border: 'border-[#2A2A2A]',
    textColor: 'text-white',
    cornerText: 'text-white',
    label: 'Wild',
  },
};

// ==========================================
// VECTOR GRAPHICS & SYMBOLS
// ==========================================

/** Skip Icon: Clean, bold prohibition geometry */
function SkipIcon({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const dim = { xs: 18, sm: 24, md: 38, lg: 48 }[size];
  const stroke = { xs: 3.5, sm: 4, md: 5, lg: 6 }[size];
  return (
    <svg width={dim} height={dim} viewBox="0 0 36 36" fill="none" className="shrink-0 drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.15)]">
      <circle cx="18" cy="18" r="13" stroke="currentColor" strokeWidth={stroke} />
      <line
        x1="8.8"
        y1="8.8"
        x2="27.2"
        y2="27.2"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Reverse Icon: Dynamic twin directional arrows forming a balanced rotational cycle */
function ReverseIcon({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const dim = { xs: 18, sm: 24, md: 38, lg: 48 }[size];
  return (
    <svg width={dim} height={dim} viewBox="0 0 36 36" fill="none" className="shrink-0 drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.15)]">
      {/* Top curved arrow pointing right */}
      <path
        d="M8 15 C8 9.5 12.5 7 18 7 C23.5 7 27 9.5 28.5 13"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <polygon points="23,16 31.5,13.5 27,6" fill="currentColor" />

      {/* Bottom curved arrow pointing left */}
      <path
        d="M28 21 C28 26.5 23.5 29 18 29 C12.5 29 9 26.5 7.5 23"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <polygon points="13,20 4.5,22.5 9,30" fill="currentColor" />
    </svg>
  );
}

/** Draw Two Symbol: A custom pair of overlapping mini-cards with bold "+2" indicator */
function DrawTwoGraphic({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Back mini card */}
      <div className="w-5 h-7 sm:w-6 sm:h-9 md:w-8 md:h-11 rounded-xs bg-white border-2 border-current transform -rotate-12 -translate-x-1 -translate-y-1 shadow-sm" />
      {/* Front mini card */}
      <div className="absolute w-5 h-7 sm:w-6 sm:h-9 md:w-8 md:h-11 rounded-xs bg-white border-2 border-current transform rotate-8 translate-x-1 translate-y-1 shadow-sm flex items-center justify-center">
        <span className="font-black italic font-sans text-current text-[10px] sm:text-xs md:text-sm leading-none tracking-tighter">
          +2
        </span>
      </div>
    </div>
  );
}

/** Wild Graphic: Precision 4-color segmented disc with crisp cross division */
function WildGraphic({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const dim = { xs: 20, sm: 26, md: 42, lg: 52 }[size];
  return (
    <div
      style={{ width: dim, height: dim }}
      className="relative rounded-full border-2 border-black/20 shadow-sm overflow-hidden flex flex-wrap"
    >
      <div className="w-1/2 h-1/2 bg-[#D32F2F] border-r border-b border-white" />
      <div className="w-1/2 h-1/2 bg-[#1565C0] border-l border-b border-white" />
      <div className="w-1/2 h-1/2 bg-[#EAB308] border-r border-t border-white" />
      <div className="w-1/2 h-1/2 bg-[#2E7D32] border-l border-t border-white" />
      {/* Central diamond emblem */}
      <div className="absolute inset-0 m-auto w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rounded-full border border-black/10 shadow-xs flex items-center justify-center">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-xs bg-[#171717] transform rotate-45" />
      </div>
    </div>
  );
}

/** Wild Draw Four Graphic: Four fanned colored cards surmounted by an athletic "+4" emblem */
function WildDrawFourGraphic({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Fanned 4 mini-cards in perspective */}
      <div className="relative w-12 h-9 sm:w-16 sm:h-12 md:w-20 md:h-15 flex items-center justify-center mb-0.5">
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-6.5 md:h-9.5 rounded-xs bg-[#D32F2F] border border-white shadow-xs transform -rotate-24 -translate-x-3.5" />
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-6.5 md:h-9.5 rounded-xs bg-[#1565C0] border border-white shadow-xs transform -rotate-8 -translate-x-1" />
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-6.5 md:h-9.5 rounded-xs bg-[#2E7D32] border border-white shadow-xs transform rotate-8 translate-x-1" />
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-6.5 md:h-9.5 rounded-xs bg-[#EAB308] border border-white shadow-xs transform rotate-24 translate-x-3.5" />
      </div>

      {/* Solid "+4" Plaque Badge */}
      <div className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-sm bg-[#141414] border-2 border-white shadow-md flex items-center justify-center">
        <span className="font-black italic font-sans text-xs sm:text-sm md:text-base text-white leading-none tracking-tight">
          +4
        </span>
      </div>
    </div>
  );
}

/** Number Graphic: High-impact typography with intentional 6/9 underline */
function NumberGraphic({
  num,
  size = 'md',
}: {
  num: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const textSize = {
    xs: 'text-xl',
    sm: 'text-3xl',
    md: 'text-4xl sm:text-5xl',
    lg: 'text-6xl',
  }[size];

  const hasUnderline = num === '6' || num === '9';

  return (
    <div className="flex flex-col items-center justify-center leading-none">
      <span className={`font-black italic font-sans ${textSize} tracking-tighter select-none drop-shadow-[0_2px_1px_rgba(0,0,0,0.18)]`}>
        {num}
      </span>
      {hasUnderline && (
        <div
          className={`h-0.5 sm:h-1 rounded-full bg-current ${
            size === 'xs' ? 'w-2.5 mt-0.5' : size === 'sm' ? 'w-4 mt-0.5' : 'w-5 sm:w-6 mt-0.5'
          }`}
        />
      )}
    </div>
  );
}

/** Corner Index Component: Consistent, high-contrast, fanning-friendly */
function CornerIndex({
  card,
  inverted = false,
  size = 'md',
}: {
  card: Card;
  inverted?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const theme = CARD_COLORS[card.color];
  const is6or9 = card.value === '6' || card.value === '9';

  return (
    <div
      className={`flex flex-col items-center justify-center leading-none ${theme.cornerText} ${
        inverted ? 'transform rotate-180' : ''
      }`}
    >
      {card.value === 'skip' && (
        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="3.5"
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" strokeLinecap="round" />
        </svg>
      )}

      {card.value === 'reverse' && (
        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="3.5"
        >
          <path d="M4 10h11M4 10l3.5-3.5M4 10l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 14H9M20 14l-3.5-3.5M20 14l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {card.value === 'draw2' && (
        <span className="font-black italic font-sans text-[10px] sm:text-xs tracking-tighter leading-none">
          +2
        </span>
      )}

      {card.value === 'wild' && (
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/70 flex flex-wrap overflow-hidden shadow-2xs">
          <div className="w-1/2 h-1/2 bg-[#D32F2F]" />
          <div className="w-1/2 h-1/2 bg-[#1565C0]" />
          <div className="w-1/2 h-1/2 bg-[#EAB308]" />
          <div className="w-1/2 h-1/2 bg-[#2E7D32]" />
        </div>
      )}

      {card.value === 'wild_draw4' && (
        <span className="font-black italic font-sans text-[10px] sm:text-xs text-amber-300 leading-none tracking-tighter">
          +4
        </span>
      )}

      {!['skip', 'reverse', 'draw2', 'wild', 'wild_draw4'].includes(card.value) && (
        <div className="flex flex-col items-center">
          <span className="font-black italic font-sans text-xs sm:text-sm tracking-tighter leading-none">
            {card.value}
          </span>
          {is6or9 && <div className="w-2 h-0.5 rounded-full bg-current mt-0.5" />}
        </div>
      )}
    </div>
  );
}

/** Bespoke Card Back: Branded UNO CLUB casino-grade reverse side */
function CardBackView({
  size = 'md',
  rotation = 0,
  className = '',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rotation?: number;
  className?: string;
}) {
  const sizeStyles = {
    xs: 'w-12 h-17 rounded-md p-1',
    sm: 'w-16 h-24 rounded-lg p-1.5',
    md: 'w-24 h-36 sm:w-26 sm:h-38 rounded-xl p-1.5',
    lg: 'w-32 h-48 rounded-2xl p-2',
  }[size];

  return (
    <div
      className={`relative select-none uno-card bg-[#141414] border-2 border-[#262626] ${sizeStyles} ${className} overflow-hidden shadow-md`}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    >
      {/* Crisp White Inner Margin Frame */}
      <div className="w-full h-full rounded-[inherit] border-[1.5px] border-white/80 bg-[#121212] flex items-center justify-center relative overflow-hidden">
        {/* Subtle Geometric Precision Grid Frame */}
        <div className="absolute inset-1 rounded-[inherit] border border-[#242424] pointer-events-none" />

        {/* Central Tilted Crimson Plate */}
        <div className="w-[82%] h-[56%] rounded-[50%] bg-[#D32F2F] border-2 border-white flex flex-col items-center justify-center transform -rotate-26 shadow-sm">
          {/* Athletic UNO wordmark */}
          <span className="font-black italic text-white tracking-tighter text-xs sm:text-base md:text-lg font-sans leading-none drop-shadow-xs">
            UNO
          </span>
          {/* CLUB Monogram Tag */}
          <div className="mt-0.5 px-1.5 py-0.2 rounded-xs bg-white text-[#101010] font-black text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.2em] leading-none">
            CLUB
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN EXPORTED COMPONENT: CardView
// ==========================================

export interface CardViewProps {
  card?: Card;
  isBack?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isPlayable?: boolean;
  isSuggested?: boolean;
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
  isSuggested = false,
  isSelected = false,
  disabled = false,
  onClick,
  className = '',
  rotation = 0,
}: CardViewProps) {
  // Sizing definitions: authentic 1:1.48 card ratio
  const sizeStyles = {
    xs: 'w-12 h-17 rounded-md p-1',
    sm: 'w-16 h-24 rounded-lg p-1.5',
    md: 'w-24 h-36 sm:w-26 sm:h-38 rounded-xl p-1.5',
    lg: 'w-32 h-48 rounded-2xl p-2',
  }[size];

  // ================= CARD BACK =================
  if (isBack || !card) {
    return <CardBackView size={size} rotation={rotation} className={className} />;
  }

  // ================= CARD FACE =================
  const theme = CARD_COLORS[card.color];
  const isGlowing = isPlayable || isSuggested;

  // Center Graphic Renderer
  const renderCenterGraphic = () => {
    switch (card.value) {
      case 'skip':
        return <SkipIcon size={size} />;
      case 'reverse':
        return <ReverseIcon size={size} />;
      case 'draw2':
        return <DrawTwoGraphic size={size} />;
      case 'wild':
        return <WildGraphic size={size} />;
      case 'wild_draw4':
        return <WildDrawFourGraphic size={size} />;
      default:
        return <NumberGraphic num={card.value} size={size} />;
    }
  };

  return (
    <div
      onClick={!disabled && isPlayable && onClick ? onClick : undefined}
      className={`relative select-none uno-card border-2 ${sizeStyles} ${theme.bg} ${theme.border} opacity-100 ${
        isGlowing
          ? 'uno-card-playable uno-card-glow-outline ring-2 ring-[#D6FF62] shadow-2xl'
          : 'cursor-default shadow-md'
      } ${isSelected ? 'uno-card-selected' : ''} ${
        disabled ? 'pointer-events-none' : ''
      } overflow-hidden transition-all duration-140 ${className}`}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* Crisp White Inner Margin Frame */}
      <div className="w-full h-full rounded-[inherit] border-[1.5px] border-white/85 sm:border-2 sm:border-white/90 flex items-center justify-center relative overflow-hidden">
        {/* Top-Left Corner Index (High Visibility in Hands) */}
        <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 z-10">
          <CornerIndex card={card} size={size} />
        </div>

        {/* Central Iconic White Oval Plate (rotated -26 deg) */}
        <div className="w-[74%] h-[56%] rounded-[50%] bg-white flex items-center justify-center transform -rotate-26 shadow-[0_2px_4px_rgba(0,0,0,0.18)] border border-black/10">
          <div className={`transform rotate-26 ${theme.textColor} flex items-center justify-center`}>
            {renderCenterGraphic()}
          </div>
        </div>

        {/* Bottom-Right Inverted Corner Index */}
        <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 z-10">
          <CornerIndex card={card} inverted size={size} />
        </div>
      </div>
    </div>
  );
}
