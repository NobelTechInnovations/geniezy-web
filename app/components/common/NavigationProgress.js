'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Lightweight top-loading bar for Next.js App Router.
 * Shows a thin progress bar at the very top of the viewport when the URL
 * changes, so users know immediately that navigation is in flight.
 *
 * Strategy:
 *  - Track the current (previousPathname) value in a ref.
 *  - When pathname/searchParams changes, compare: if different, fire the bar.
 *  - Use two CSS phases: "running" (infinite scroll animation) → "done"
 *    (snap to 100% and fade out).  Both phases are CSS-only so they're
 *    always buttery smooth regardless of JS thread load.
 *
 * No external library needed — no NProgress, no nprogress-bar package.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState('idle'); // 'idle' | 'running' | 'done'
  const prevRef = useRef({ pathname, searchParams: searchParams.toString() });
  const doneTimer = useRef(null);

  useEffect(() => {
    const prev = prevRef.current;
    const curr = { pathname, searchParams: searchParams.toString() };

    const changed = prev.pathname !== curr.pathname || prev.searchParams !== curr.searchParams;
    if (changed) {
      // Navigation completed — flip to done phase, then idle after the
      // CSS transition finishes (600ms matches the CSS transition-duration).
      setState('done');
      clearTimeout(doneTimer.current);
      doneTimer.current = setTimeout(() => setState('idle'), 600);
    }

    prevRef.current = curr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Fire "running" state on any same-origin anchor click so the bar starts
  // immediately — before React has rendered the new page at all.
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only intercept same-origin, non-hash, non-external links
      const isSameOrigin =
        !href.startsWith('http') &&
        !href.startsWith('//') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('#');

      if (isSameOrigin) {
        clearTimeout(doneTimer.current);
        setState('running');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (state === 'idle') return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #004bad, #3b82f6)',
          borderRadius: '0 2px 2px 0',
          // running: animate from 0→75% slowly; done: snap to 100% and fade
          width: state === 'running' ? '70%' : '100%',
          opacity: state === 'done' ? 0 : 1,
          transition:
            state === 'running'
              ? 'width 2.5s cubic-bezier(0.1, 0.05, 0, 1)'
              : 'width 0.2s ease, opacity 0.4s ease 0.15s',
          // Box shadow for a bit of glow
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
        }}
      />
    </div>
  );
}
