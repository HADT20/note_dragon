'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type, message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-400" />,
    error: <XCircle className="w-6 h-6 text-red-400" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-400" />
  };

  const styles = {
    success: 'bg-green-500/10 border-green-500/50 text-green-400',
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className={`${styles[type]} border rounded-xl shadow-2xl px-5 py-4 flex items-center gap-3 min-w-[320px] max-w-md backdrop-blur-sm`}>
        {icons[type]}
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

