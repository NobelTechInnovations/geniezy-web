'use client';

import Link from 'next/link';
import { FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5">
        <FiAlertCircle className="text-[#004bad] text-4xl" />
      </div>
      <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Page not found</h2>
      <p className="text-gray-500 text-sm mb-7 max-w-xs">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have moved or no longer exists.
      </p>
      <Link
        href="/"
        className="bg-[#004bad] text-white px-7 py-2.5 rounded-full font-semibold text-sm hover:bg-blue-800 transition"
      >
        Go back home
      </Link>
    </div>
  );
}
