'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const iconColor = {
          success: 'text-[#D6FF62]',
          warning: 'text-[#F57F17]',
          error: 'text-[#D32F2F]',
          info: 'text-[#A5A39E]',
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
            className="pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-3 rounded-lg border border-[#333333] bg-[#1C1C1C] shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
              <p className="text-xs font-medium text-[#F2F0EB] tracking-normal truncate">{toast.text}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-[#282828] transition text-[#777570] hover:text-[#F2F0EB] shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
