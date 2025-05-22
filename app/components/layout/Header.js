'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiSearch, FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full bg-white">
      {/* Top Bar - Hidden on scroll */}
      <div className={`w-full bg-[#0c2540] text-white py-2 px-4 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm">Welcome to GenieZy Online Shopping Store !</p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center cursor-pointer">
              <span>English</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="flex items-center cursor-pointer">
              <span>US Dollar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <Link href="/track" className="hover:text-gray-300">Track Your Order</Link>
            <Link href="/locations" className="hover:text-gray-300">Store Location</Link>
          </div>
        </div>
      </div>

      {/* Middle Bar - Always visible, sticky on scroll */}
      <div className={`w-full bg-white py-4 px-4 ${isScrolled ? 'sticky top-0 shadow-md z-50' : ''}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">
              <span className="text-black">genie</span>
              <span className="text-red-500">zy</span>
            </span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="flex">
                <div className="relative inline-block text-left w-32">
                  <button className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md">
                    <span>All</span>
                    <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="I'm shopping for..."
                  className="flex-1 px-4 py-2 border-t border-b border-gray-300 focus:outline-none"
                />
                <button className="bg-red-500 text-white px-6 py-2 rounded-r-md">
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/wishlist" className="flex flex-col items-center">
              <div className="relative">
                <FiHeart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  0
                </span>
              </div>
            </Link>
            <Link href="/cart" className="flex flex-col items-center">
              <div className="relative">
                <FiShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  0
                </span>
              </div>
            </Link>
            <div className="flex items-center">
              <FiUser className="w-6 h-6 mr-2" />
              <div className="flex flex-col">
                <Link href="/login" className="text-sm text-gray-800">Log In</Link>
                <Link href="/register" className="text-sm font-semibold">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Hidden on scroll */}
      <div className={`w-full bg-white border-t border-gray-200 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
        <div className="container mx-auto">
          <nav className="flex space-x-8 py-3 px-4">
            <Link href="/hot-deals" className="flex items-center text-sm font-medium hover:text-red-500">
              <span className="mr-2">✨</span>
              HOT DEALS
            </Link>
            <Link href="/home-electronics" className="flex items-center text-sm font-medium hover:text-red-500">
              <span className="mr-2">🏠</span>
              HOME ELECTRONICS
            </Link>
            <Link href="/computers" className="flex items-center text-sm font-medium hover:text-red-500">
              <span className="mr-2">💻</span>
              COMPUTERS & TECHNOLOGY
            </Link>
            <Link href="/camera" className="flex items-center text-sm font-medium hover:text-red-500">
              <span className="mr-2">📷</span>
              CAMERA & VIDEOS
            </Link>
            <Link href="/office" className="flex items-center text-sm font-medium hover:text-red-500">
              <span className="mr-2">🖨️</span>
              OFFICE ELECTRONICS
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
    