'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiHome, FiGrid, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { cartService } from '@/app/services/cart/cartService';

// Fixed bottom tab bar shown only on small screens (< md). Mirrors the
// same nav destinations already reachable from the desktop Header so it
// doesn't introduce new pages/flows — just a faster, thumb-reachable way
// to get to them on mobile, where there's no room for the full header.
const MobileBottomNav = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await cartService.getCartItems();
        if (response.success) {
          const items = Array.isArray(response.data)
            ? response.data
            : (response.data?.items || []);
          setCartCount(items.length);
        }
      } catch {
        setCartCount(0);
      }
    };

    fetchCount();
    window.addEventListener('cartUpdate', fetchCount);
    return () => window.removeEventListener('cartUpdate', fetchCount);
  }, []);

  const tabs = [
    { href: '/', label: 'Home', icon: FiHome, match: (p) => p === '/' },
    { href: '/gc/electronics?gc_id=681cabfed9abf241b6aa6d37', label: 'Categories', icon: FiGrid, match: (p) => p.startsWith('/gc') || p.startsWith('/delivery-now') },
    { href: '/cart', label: 'Cart', icon: FiShoppingBag, match: (p) => p.startsWith('/cart'), badge: cartCount },
    { href: isAuthenticated ? '/orders' : '/login', label: isAuthenticated ? 'Account' : 'Login', icon: FiUser, match: (p) => p.startsWith('/orders') || p.startsWith('/login') },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      {tabs.map(({ href, label, icon: Icon, match, badge }) => {
        const active = match(pathname);
        return (
          <Link
            key={label}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${
              active ? 'text-[#004bad]' : 'text-gray-500'
            }`}
          >
            <span className="relative">
              <Icon className="w-5 h-5" />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#004bad] text-white rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] leading-none">
                  {badge}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
