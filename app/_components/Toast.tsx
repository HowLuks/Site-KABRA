'use strict';
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const showToast = (msg: string) => {
    setMessage(msg);
    setIsActive(true);

    setTimeout(() => {
      setIsActive(false);
    }, 4500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div id="kabra-toast" className={`kabra-toast ${isActive ? 'active' : ''}`}>
        ✅ &nbsp; {message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
