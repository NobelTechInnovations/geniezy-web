'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiSearch, FiHeart, FiShoppingBag, FiUser } from 'react-icons/fi';
import TopBar from './Topbar';
import LocationDropdown from '../common/LocationDropdown';
import { useCategories } from '../../hooks/useCategories';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { categories, loading } = useCategories();
  const [searchCategory, setSearchCategory] = useState('');

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
      <TopBar isScrolled={isScrolled} />

      {/* Middle Bar - Always visible, sticky on scroll */}
      <div className={`w-full bg-white py-2 transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-md z-50' : ''}`}>
        <div className="container mx-auto flex items-center px-4 justify-between items-center ">
          <Link href="/" className="mr-6">
            <img src="/3.png" alt="Logo" width={100} height={100} />
          </Link>

          <div className="flex-1 max-w-1xl mx-8">
            <div className="flex items-center">
              <div className="relative inline-block w-24">
                <select 
                  className="appearance-none w-full px-3 h-10 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md focus:outline-none"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {!loading && categories.map((category) => (
                    <option key={category._id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="I'm shopping for..."
                className="flex-1 w-10 h-10 px-4 py-2 border-0 focus:outline-none border-t border-b border-gray-300 focus:outline-none text-black"
              />
              <button className="bg-red-500 h-10 text-white p-2 rounded-r-md">
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="ml-auto">
            <LocationDropdown />
          </div>

          <div className="flex items-center space-x-6 ml-6">
            <Link href="/wishlist" className="relative">
              <FiHeart className="w-6 h-6 text-black" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <Link href="/cart" className="relative">
              <FiShoppingBag className="w-6 h-6 text-black" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <div className="flex items-center">
              <FiUser className="w-6 h-6 mr-2 text-black" />
              <div className="flex flex-col">
                <Link href="/login" className="text-sm text-black">Log In</Link>
                <Link href="/register" className="text-sm font-semibold text-black">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Hidden on scroll */}
      <div className={`w-full bg-white border-t border-gray-200 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
        <div className="container mx-auto">
          <nav className="flex overflow-x-auto px-4 py-2 scrollbar-none text-black">
          <Link href="/" className="whitespace-nowrap flex items-center text-sm font-medium hover:text-red-500 mr-8">
              <span className="text-sm font-medium">Aladin Specials</span>
            </Link>
            {!loading && categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className="whitespace-nowrap flex items-center text-sm font-medium hover:text-red-500 mr-8"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/" className="whitespace-nowrap flex items-center text-sm font-medium hover:text-red-500 mr-8">
              <span className="text-sm font-medium">Buy Again</span>
            </Link>
            
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
    