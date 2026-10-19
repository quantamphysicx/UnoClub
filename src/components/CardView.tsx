'use client';

import React from 'react';
import { Card, CardColor } from '@/types/game';

// ==========================================
// UNIFIED COLOR PALETTE — SOLID & BALANCED
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
    bg: 'bg-[#C62828]',
    border: 'border-[#8E0000]',
    textColor: 'text-[#C62828]',
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
    bg: 'bg-[#F57F17]',
    border: 'border-[#B45309]',
    textColor: 'text-[#B45309]', // High-contrast amber-orange against white oval
    cornerText: 'text-[#101010]', // Dark text on bright yellow cardstock for max readability
    label: 'Yellow',
  },
  wild: {
    bg: 'bg-[#181818]',
    border: 'border-[#2E2E2E]',
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
  const dim = { xs: 16, sm: 22, md: 36, lg: 46 }[size];
  const stroke = { xs: 3, sm: 3.5, md: 4.5, lg: 5 }[size];
  return (
    <svg width={dim} height={dim} viewBox="0 0 36 36" fill="none" className="shrink-0">
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
  const dim = { xs: 16, sm: 22, md: 36, lg: 46 }[size];
  return (
    <svg width={dim} height={dim} viewBox="0 0 36 36" fill="none" className="shrink-0">
      {/* Top curved arrow pointing right */}
      <path
        d="M9 15 C9 10 13 7.5 18 7.5 C23 7.5 26.5 9.5 28 12.5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <polygon points="24,15 32,13 28,6" fill="currentColor" />

      {/* Bottom curved arrow pointing left */}
      <path
        d="M27 21 C27 26 23 28.5 18 28.5 C13 28.5 9.5 26.5 8 23.5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <polygon points="12,21 4,23 8,30" fill="currentColor" />
    </svg>
  );
}

/** Draw Two Symbol: A custom pair of overlapping mini-cards with bold "+2" indicator */
function DrawTwoGraphic({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Back mini card */}
      <div className="w-5 h-7 sm:w-7 sm:h-9 md:w-9 md:h-12 rounded-xs bg-white border-2 border-current transform -rotate-12 -translate-x-1 -translate-y-1 shadow-xs opacity-60" />
      {/* Front mini card */}
      <div className="absolute w-5 h-7 sm:w-7 sm:h-9 md:w-9 md:h-12 rounded-xs bg-white border-2 border-current transform rotate-8 translate-x-1 translate-y-1 shadow-xs flex items-center justify-center">
        <span className="font-black font-sans text-current text-[10px] sm:text-xs md:text-sm leading-none">
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
      <div className="w-1/2 h-1/2 bg-[#C62828] border-r border-b border-white" />
      <div className="w-1/2 h-1/2 bg-[#1565C0] border-l border-b border-white" />
      <div className="w-1/2 h-1/2 bg-[#F57F17] border-r border-t border-white" />
      <div className="w-1/2 h-1/2 bg-[#2E7D32] border-l border-t border-white" />
      {/* Central diamond emblem */}
      <div className="absolute inset-0 m-auto w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rounded-full border border-black/10 shadow-xs flex items-center justify-center">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-xs bg-[#181818] transform rotate-45" />
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
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-7 md:h-10 rounded-xs bg-[#C62828] border border-white shadow-xs transform -rotate-24 -translate-x-3.5" />
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-7 md:h-10 rounded-xs bg-[#1565C0] border border-white shadow-xs transform -rotate-8 -translate-x-1" />
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-7 md:h-10 rounded-xs bg-[#2E7D32] border border-white shadow-xs transform rotate-8 translate-x-1" />
        <div className="absolute w-4 h-6 sm:w-5 sm:h-8 md:w-7 md:h-10 rounded-xs bg-[#F57F17] border border-white shadow-xs transform rotate-24 translate-x-3.5" />
      </div>

      {/* Solid "+4" Plaque Badge */}
      <div className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-sm bg-[#141414] border-2 border-white shadow-md flex items-center justify-center">
        <span className="font-black font-sans text-xs sm:text-sm md:text-base text-white leading-none tracking-tight">
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
    xs: 'text-lg',
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  }[size];

  const hasUnderline = num === '6' || num === '9';

  return (
    <div className="flex flex-col items-center justify-center leading-none">
      <span className={`font-black font-sans ${textSize} tracking-tight select-none`}>
        {num}
      </span>
      {hasUnderline && (
        <div
          className={`h-0.5 sm:h-1 rounded-full bg-current ${
            size === 'xs' ? 'w-2.5 mt-0.5' : size === 'sm' ? 'w-4 mt-0.5' : 'w-6 mt-1'
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
        <span className="font-black font-sans text-[10px] sm:text-xs tracking-tighter leading-none">
          +2
        </span>
      )}

      {card.value === 'wild' && (
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/70 flex flex-wrap overflow-hidden shadow-2xs">
          <div className="w-1/2 h-1/2 bg-[#C62828]" />
          <div className="w-1/2 h-1/2 bg-[#1565C0]" />
          <div className="w-1/2 h-1/2 bg-[#F57F17]" />
          <div className="w-1/2 h-1/2 bg-[#2E7D32]" />
        </div>
      )}

      {card.value === 'wild_draw4' && (
        <span className="font-black font-sans text-[10px] sm:text-xs text-amber-300 leading-none tracking-tighter">
          +4
        </span>
      )}

      {!['skip', 'reverse', 'draw2', 'wild', 'wild_draw4'].includes(card.value) && (
        <div className="flex flex-col items-center">
          <span className="font-black font-sans text-xs sm:text-sm tracking-tight leading-none">
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
    xs: 'w-11 h-15 rounded-sm p-0.5',
    sm: 'w-16 h-23 rounded-md p-1',
    md: 'w-24 h-34 rounded-lg p-1.5',
    lg: 'w-32 h-45 rounded-xl p-2',
  }[size];

  return (
    <div
      className={`relative select-none uno-card bg-[#141414] border-2 border-[#262626] ${sizeStyles} ${className} overflow-hidden shadow-md`}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    >
      {/* Crisp White Inner Margin Frame */}
      <div className="w-full h-full rounded-[inherit] border border-white/25 bg-[#121212] flex items-center justify-center relative overflow-hidden">
        {/* Subtle Geometric Precision Grid Frame */}
        <div className="absolute inset-1 rounded-[inherit] border border-[#242424] pointer-events-none" />

        {/* Central Tilted Crimson Plate */}
        <div className="w-[84%] h-[56%] rounded-[50%] bg-[#C62828] border-2 border-white flex flex-col items-center justify-center transform -rotate-25 shadow-sm">
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
  // Sizing definitions: authentic 2.5:3.5 card ratio
  const sizeStyles = {
    xs: 'w-11 h-15 rounded-sm p-0.5',
    sm: 'w-16 h-23 rounded-md p-1',
    md: 'w-24 h-34 rounded-lg p-1.5',
    lg: 'w-32 h-45 rounded-xl p-2',
  }[size];

  // ================= CARD BACK =================
  if (isBack || !card) {
    return <CardBackView size={size} rotation={rotation} className={className} />;
  }

  // ================= CARD FACE =================
  const theme = CARD_COLORS[card.color];

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
      className={`relative select-none uno-card border-2 ${sizeStyles} ${theme.bg} ${theme.border} ${
        isPlayable
          ? 'uno-card-playable ring-2 ring-white/90 shadow-md'
          : 'cursor-default opacity-85 shadow-xs'
      } ${isSelected ? 'uno-card-selected' : ''} ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } overflow-hidden transition-all duration-140 ${className}`}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      {/* Crisp White Inner Margin Frame */}
      <div className="w-full h-full rounded-[inherit] border border-white/40 flex items-center justify-center relative overflow-hidden bg-black/5">
        {/* Top-Left Corner Index (High Visibility in Hands) */}
        <div className="absolute top-1 left-1.5 sm:top-1.5 sm:left-2 z-10">
          <CornerIndex card={card} size={size} />
        </div>

        {/* Central Iconic White Oval Plate (rotated -25 deg) */}
        <div className="w-[78%] h-[64%] rounded-[50%] bg-white flex items-center justify-center transform -rotate-25 shadow-xs border border-black/10">
          <div className={`transform rotate-25 ${theme.textColor} flex items-center justify-center`}>
            {renderCenterGraphic()}
          </div>
        </div>

        {/* Bottom-Right Inverted Corner Index */}
        <div className="absolute bottom-1 right-1.5 sm:bottom-1.5 sm:right-2 z-10">
          <CornerIndex card={card} inverted size={size} />
        </div>
      </div>
    </div>
  );
}
