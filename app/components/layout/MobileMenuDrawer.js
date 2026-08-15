'use client';

import Link from 'next/link';
import { FiX } from 'react-icons/fi';
import LocationDropdown from '../common/LocationDropdown';
import { getCategoryRoute } from '@/app/shared/utils/getCategoryRoute';

/**
 * Mobile hamburger menu (Phase 4, M8) — a real slide-in drawer instead of
 * the previous "just let everything wrap/hide" approach. Surfaces
 * LocationDropdown, which was previously `hidden md:block` (i.e.
 * completely unreachable on mobile — a buyer on a phone had no way to
 * change their delivery location at all), plus categories in a scannable
 * grid/card layout instead of the desktop nav row's cramped text-wrap.
 */
export default function MobileMenuDrawer({ isOpen, onClose, categories = [], loading }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-xs bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">Snapzo</h2>
          <button onClick={onClose} aria-label="Close menu" className="text-gray-500 hover:text-gray-700">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Delivery location — reachable on mobile now via this drawer,
            instead of being hidden entirely below md. Only mounted while
            the drawer is actually open (not just CSS-hidden) — the desktop
            LocationDropdown instance is always mounted elsewhere in the
            header, and mounting a second one unconditionally here double-
            loaded the Google Maps script on every page. */}
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Deliver to</p>
          {isOpen && <LocationDropdown />}
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Shop by Category</p>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={getCategoryRoute(category)}
                  onClick={onClose}
                  className="flex items-center justify-center text-center px-3 py-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-800 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
          <Link href="/wishlist" onClick={onClose} className="text-sm font-medium text-gray-700 hover:text-brand">My Wishlist</Link>
          <Link href="/orders" onClick={onClose} className="text-sm font-medium text-gray-700 hover:text-brand">Track Your Order</Link>
          <Link href="/register" onClick={onClose} className="text-sm font-medium text-gray-700 hover:text-brand">Become a Seller</Link>
        </div>
      </div>
    </>
  );
}
