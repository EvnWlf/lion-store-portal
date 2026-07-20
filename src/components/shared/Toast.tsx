'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000); // Se oculta automáticamente tras 4 segundos

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/30';
      case 'error':
        return 'border-red-500/30';
      case 'warning':
        return 'border-amber-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 min-w-75 max-w-md bg-surface-1/95 backdrop-blur-md border ${getBorderColor()} rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5`}
    >
      {getIcon()}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-xs font-semibold text-text">{toast.title}</h4>
        {toast.description && (
          <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 text-text-secondary hover:text-text hover:bg-surface-2 rounded-lg transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};