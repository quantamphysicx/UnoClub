'use client';

import React from 'react';

export interface AvatarOption {
  id: string;
  name: string;
  bgColor: string;
  fgColor: string;
  svgIcon: (size?: number) => React.ReactNode;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'geom-1',
    name: 'Prism',
    bgColor: '#1E1E1E',
    fgColor: '#D6FF62',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#D6FF62" />
        <polyline points="2 17 12 22 22 17" stroke="#D6FF62" />
        <polyline points="2 12 12 17 22 12" stroke="#D6FF62" />
      </svg>
    ),
  },
  {
    id: 'geom-2',
    name: 'Flare',
    bgColor: '#1E1E1E',
    fgColor: '#F57F17',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F57F17" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="23" />
        <line x1="1" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="23" y2="12" />
      </svg>
    ),
  },
  {
    id: 'geom-3',
    name: 'Matrix',
    bgColor: '#1E1E1E',
    fgColor: '#2E7D32',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#66BB6A" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: 'geom-4',
    name: 'Shield',
    bgColor: '#1E1E1E',
    fgColor: '#D32F2F',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: 'geom-5',
    name: 'Vortex',
    bgColor: '#1E1E1E',
    fgColor: '#1976D2',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#42A5F5" strokeWidth="2">
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'geom-6',
    name: 'Star',
    bgColor: '#1E1E1E',
    fgColor: '#E0E0E0',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="2">
        <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2" />
      </svg>
    ),
  },
  {
    id: 'geom-7',
    name: 'Crown',
    bgColor: '#1E1E1E',
    fgColor: '#F57F17',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFCA28" strokeWidth="2">
        <path d="M2 4l3 12h14l3-12-5 6-5-6-5 6-5-6z" />
        <rect x="5" y="17" width="14" height="3" />
      </svg>
    ),
  },
  {
    id: 'geom-8',
    name: 'Hex',
    bgColor: '#1E1E1E',
    fgColor: '#90CAF9',
    svgIcon: (size = 20) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#90CAF9" strokeWidth="2">
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    ),
  },
];

interface AvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ avatarId, size = 'md', className = '' }: AvatarProps) {
  const opt = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];

  const sizeClasses = {
    sm: 'w-7 h-7 rounded',
    md: 'w-9 h-9 rounded-md',
    lg: 'w-14 h-14 rounded-lg',
    xl: 'w-20 h-20 rounded-xl',
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 26,
    xl: 36,
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center border border-[#333333] bg-[#1C1C1C] ${sizeClasses} ${className}`}
    >
      {opt.svgIcon(iconSizes)}
    </div>
  );
}
