import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (title: string, description?: string, type?: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, type: ToastType = 'success', duration = 3500) => {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastMessage = { id, title, description, type, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const typeStyles = {
            success: 'bg-[#FFF8F3] border-[#B82E5F] text-[#181416]',
            info: 'bg-[#FFF8F3] border-[#571C31] text-[#181416]',
            warning: 'bg-[#FFF8F3] border-amber-600 text-[#181416]',
            error: 'bg-[#FFF8F3] border-red-600 text-[#181416]',
          }[toast.type];

          const IconComponent = {
            success: CheckCircle2,
            info: Info,
            warning: AlertTriangle,
            error: AlertTriangle,
          }[toast.type];

          const iconColor = {
            success: 'text-[#B82E5F]',
            info: 'text-[#571C31]',
            warning: 'text-amber-600',
            error: 'text-red-600',
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-l-4 border shadow-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${typeStyles}`}
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className=" text-sm font-semibold tracking-tight text-[#181416]">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs text-[#571C31]/75 mt-0.5 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-[#571C31]/40 hover:text-[#571C31] transition-colors p-0.5"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
