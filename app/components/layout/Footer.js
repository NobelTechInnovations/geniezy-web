'use client';

import Link from 'next/link';
import { FiTruck, FiRefreshCw, FiCreditCard, FiHeadphones } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaYoutube, FaInstagram, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-white">

{/* Benefits section */}
      <div className="w-full border-t border-b border-gray-200 py-4">
        <div className="container mx-auto max-w-6xl ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center">
              <div className="text-blue-500 text-2xl mr-4">
                <FiTruck />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">Free Delivery</h3>
                <p className="text-xs text-gray-600">For all orders over ₹399</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-blue-500 text-2xl mr-4">
                <FiRefreshCw />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">Same Days Return</h3>
                <p className="text-xs text-gray-600">If goods have problems</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-blue-500 text-2xl mr-4">
                <FiCreditCard />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">Secure Payment</h3>
                <p className="text-xs text-gray-600">100% secure payment</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-blue-500 text-2xl mr-4">
                <FiHeadphones />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">24/7 Support</h3>
                <p className="text-xs text-gray-600">Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Categories section — flex-wrap instead of inline pipe-separated
          text, so this doesn't overflow horizontally on mobile the way a
          long unbroken inline span does. */}
      <div className="w-full border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col gap-3">
          {[
            { label: 'Consumer Electric', items: ['Air Conditioners', 'Audios & Theaters', 'Car Electronics', 'Office Electronics', 'TV Televisions', 'Washing Machines'] },
            { label: 'TV Televisions', items: ['Desktop PC', 'Laptop', 'Smartphones', 'Tablet', 'Game Controller', 'Audio & Video', 'Wireless Speaker', 'Drone'] },
            { label: 'Computer & Technologies', items: ['Desktop PC', 'Laptop', 'Smartphones', 'Tablet', 'Game Controller', 'Audio & Video', 'Wireless Speaker', 'Drone'] },
          ].map((group) => (
            <div key={group.label} className="flex flex-wrap items-baseline gap-x-1 gap-y-1 text-sm">
              <span className="font-semibold text-gray-700 mr-1">{group.label}:</span>
              {group.items.map((item, i) => (
                <span key={item} className="flex items-center">
                  <Link href="#" className="text-gray-600 hover:text-red-500">{item}</Link>
                  {i < group.items.length - 1 && <span className="text-gray-300 ml-1">|</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer main content */}
      <div className="container mx-auto py-2 px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-600 hover:text-red-500">Term & Conditions</Link></li>
              <li><Link href="/faqs" className="text-gray-600 hover:text-red-500">FAQs</Link></li>
            </ul>
          </div>
          
          {/* Company (was previously duplicated 3x in this grid — a
              copy-paste bug, not intentional repeated content) */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-red-500">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-red-500">Contact</Link></li>
            </ul>
          </div>


          {/* Business */}
          <div>
            <h3 className="text-lg font-bold mb-4">Business</h3>
            <ul className="space-y-2">
              <li><Link href="/press" className="text-gray-600 hover:text-red-500">Our Press</Link></li>
              <li><Link href="/shop" className="text-gray-600 hover:text-red-500">Shop</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow us </h3>
            
            {/* Social icons */}
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="w-16 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#004bad] hover:text-white">
                <FaFacebookF />
              </Link>
              <Link href="#" className="w-16 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#004bad] hover:text-white">
                <FaTwitter />
              </Link>
              <Link href="#" className="w-16 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#004bad] hover:text-white">
                <FaGooglePlusG />
              </Link>
              <Link href="#" className="w-16 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#004bad] hover:text-white">
                <FaYoutube />
              </Link>
              <Link href="#" className="w-16 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-[#004bad] hover:text-white">
                <FaInstagram />
              </Link>
            </div>
          </div>

          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-2 pb-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">© 2024 GenieZy. All Rights Reserved</p>
            
            <div className="flex space-x-4 text-gray-600">
              <FaCcPaypal className="h-8 w-8" />
              <FaCcVisa className="h-8 w-8" />
              <FaCcMastercard className="h-8 w-8" />
              <FaCcAmex className="h-8 w-8" />
            </div>
          </div>
        
        
      </div>
      
      {/* Back to top button — bottom-20 on mobile so it clears
          MobileBottomNav (fixed bottom-0, ~56px tall) instead of
          overlapping it; bottom-8 once md: the bottom nav is hidden. */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-brand text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-dark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
