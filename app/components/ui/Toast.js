'use client';

import { createContext, useCallback, useContext, useState } from 'react';

// Lightweight toast system — replaces raw `alert()` calls found around the
// app (e.g. ProductCard.js's "Added X to cart!" stub) with a non-blocking,
// dismissible notification instead of a modal JS dialog that halts the page.
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center px-4 w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-white max-w-sm text-center transition-opacity ${
              t.type === 'error' ? 'bg-red-600' : 'bg-gray-900'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Returns a `showToast(message, type)` function. Falls back to a no-op if
// called outside the provider rather than crashing, so components stay
// resilient even before the provider is wired up everywhere.
export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || (() => {});
}
