import React from 'react';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-slate-50 text-slate-700 border-slate-200'
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <div className={`flex items-center justify-between gap-3 border px-4 py-3 rounded-2xl shadow-lg ${toastStyles[toast.type]}`}>
      <span className="text-sm font-semibold">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-full hover:bg-white/60 transition"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
