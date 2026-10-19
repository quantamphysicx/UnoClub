'use client';

import React from 'react';

export interface AvatarOption {
  id: string;
  name: string;
  gradient: string;
  borderColor: string;
  svgIcon: (size?: number) => React.ReactNode;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'geom-1',
    name: 'Cyber Prism',
    gradient: 'from-violet-600 to-indigo-900',
    borderColor: '#7C3AED',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" stroke="#A78BFA" />
        <polyline points="2 17 12 22 22 17" stroke="#818CF8" />
        <polyline points="2 12 12 17 22 12" stroke="#C4B5FD" />
      </svg>
    ),
  },
  {
    id: 'geom-2',
    name: 'Solar Flare',
    gradient: 'from-amber-500 to-red-800',
    borderColor: '#F59E0B',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" stroke="#FBBF24" fill="#F59E0B" fillOpacity="0.3" />
        <line x1="12" y1="1" x2="12" y2="3" stroke="#FDE68A" />
        <line x1="12" y1="21" x2="12" y2="23" stroke="#FDE68A" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#FDE68A" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#FDE68A" />
        <line x1="1" y1="12" x2="3" y2="12" stroke="#FDE68A" />
        <line x1="21" y1="12" x2="23" y2="12" stroke="#FDE68A" />
      </svg>
    ),
  },
  {
    id: 'geom-3',
    name: 'Matrix Ring',
    gradient: 'from-emerald-500 to-teal-900',
    borderColor: '#10B981',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#34D399" />
        <circle cx="12" cy="12" r="4" stroke="#6EE7B7" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#A7F3D0" />
      </svg>
    ),
  },
  {
    id: 'geom-4',
    name: 'Crimson Shield',
    gradient: 'from-red-600 to-rose-950',
    borderColor: '#EF4444',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#F87171" fill="#EF4444" fillOpacity="0.25" />
        <path d="M12 8v8M8 12h8" stroke="#FECACA" />
      </svg>
    ),
  },
  {
    id: 'geom-5',
    name: 'Azure Vortex',
    gradient: 'from-blue-600 to-cyan-950',
    borderColor: '#3B82F6',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 12l10 10 10-10L12 2z" stroke="#60A5FA" />
        <circle cx="12" cy="12" r="3" stroke="#93C5FD" fill="#3B82F6" fillOpacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'geom-6',
    name: 'Nebula Star',
    gradient: 'from-fuchsia-600 to-purple-950',
    borderColor: '#C026D3',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#E879F9" fill="#C026D3" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    id: 'geom-7',
    name: 'Golden Crown',
    gradient: 'from-yellow-500 to-amber-950',
    borderColor: '#EAB308',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4l3 12h14l3-12-5 6-5-6-5 6-5-6z" stroke="#FDE047" fill="#EAB308" fillOpacity="0.3" />
        <rect x="5" y="17" width="14" height="3" rx="1" stroke="#FEF08A" />
      </svg>
    ),
  },
  {
    id: 'geom-8',
    name: 'Phantom Eye',
    gradient: 'from-violet-700 to-slate-950',
    borderColor: '#8B5CF6',
    svgIcon: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#A78BFA" />
        <circle cx="12" cy="12" r="3" stroke="#C4B5FD" fill="#8B5CF6" fillOpacity="0.5" />
      </svg>
    ),
  },
];

interface AvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export function Avatar({ avatarId, size = 'md', className = '', glow = false }: AvatarProps) {
  const opt = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[0];

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  }[size];

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 32,
    xl: 48,
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-gradient-to-br ${opt.gradient} border ${sizeClasses} shadow-md overflow-hidden transition-all duration-200 ${className}`}
      style={{
        borderColor: opt.borderColor,
        boxShadow: glow ? `0 0 16px ${opt.borderColor}80` : undefined,
      }}
    >
      <div className="flex items-center justify-center">
        {opt.svgIcon(iconSizes)}
      </div>
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
    </div>
  );
}
