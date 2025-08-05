'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  }, [addToast]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  }, [addToast]);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  }, [addToast]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          background: 'bg-green-50 border-green-200',
          icon: '✅',
          iconBg: 'bg-green-100 text-green-600',
          title: 'text-green-800',
          message: 'text-green-700'
        };
      case 'error':
        return {
          background: 'bg-red-50 border-red-200',
          icon: '❌',
          iconBg: 'bg-red-100 text-red-600',
          title: 'text-red-800',
          message: 'text-red-700'
        };
      case 'warning':
        return {
          background: 'bg-yellow-50 border-yellow-200',
          icon: '⚠️',
          iconBg: 'bg-yellow-100 text-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      case 'info':
        return {
          background: 'bg-blue-50 border-blue-200',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100 text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700'
        };
      default:
        return {
          background: 'bg-gray-50 border-gray-200',
          icon: 'ℹ️',
          iconBg: 'bg-gray-100 text-gray-600',
          title: 'text-gray-800',
          message: 'text-gray-700'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`${styles.background} border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out hover:shadow-xl`}>
      <div className="flex items-start">
        <div className={`${styles.iconBg} rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3`}>
          <span className="text-sm">{styles.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={`${styles.title} font-semibold text-sm mb-1`}>
            {toast.title}
          </h4>
          <p className={`${styles.message} text-sm`}>
            {toast.message}
          </p>
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 