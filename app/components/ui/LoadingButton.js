'use client';

import { useState } from 'react';

/**
 * A button that disables itself and shows a spinner + "Processing..." text
 * while its onClick handler is in flight — prevents the double-click/
 * duplicate-request problem (double add-to-cart, double order placement)
 * that plain buttons throughout the app currently have no protection
 * against. `onClick` may be sync or async; loading state clears whether it
 * resolves or throws.
 */
export default function LoadingButton({
  onClick,
  children,
  loadingText = 'Processing...',
  className = '',
  disabled = false,
  type = 'button',
  ...rest
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    if (loading || disabled) return;
    try {
      setLoading(true);
      await onClick?.(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {loading ? loadingText : children}
    </button>
  );
}
