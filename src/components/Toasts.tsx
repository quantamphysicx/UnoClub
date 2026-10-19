'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const borderColors = {
          success: 'border-emerald-500/60 bg-[#121E19]/90 text-emerald-200',
          warning: 'border-amber-500/60 bg-[#1E1A12]/90 text-amber-200',
          error: 'border-red-500/60 bg-[#211215]/90 text-red-200',
          info: 'border-violet-500/60 bg-[#171424]/90 text-violet-200',
        }[toast.type || 'info'];

        const Icon = {
          success: CheckCircle2,
          warning: AlertTriangle,
          error: AlertCircle,
          info: Info,
        }[toast.type || 'info'];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${borderColors}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0" />
              <p className="text-xs sm:text-sm font-medium tracking-wide">{toast.text}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
