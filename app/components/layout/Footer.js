'use client';

import Link from 'next/link';
import { FiTruck, FiRefreshCw, FiCreditCard, FiHeadphones } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaYoutube, FaInstagram, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-white">

{/* Benefits section */}
<div className="w-full border-t border-b border-gray-200 py-8">
        <div className="container mx-auto max-w-6xl ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center">
              <div className="text-red-500 text-3xl mr-4">
                <FiTruck />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Free Delivery</h3>
                <p className="text-sm text-gray-600">For all orders over $99</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-red-500 text-3xl mr-4">
                <FiRefreshCw />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">90 Days Return</h3>
                <p className="text-sm text-gray-600">If goods have problems</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-red-500 text-3xl mr-4">
                <FiCreditCard />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-red-500 text-3xl mr-4">
                <FiHeadphones />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">24/7 Support</h3>
                <p className="text-sm text-gray-600">Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Categories section */}
      <div className="w-full border-t border-gray-200 py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Consumer Electric:</span>
              <span className="text-sm text-gray-600 ml-2">
                <Link href="#" className="hover:text-red-500">Air Conditioners</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Audios & Theaters</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Car Electronics</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Office Electronics</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">TV Televisions</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Washing Machines</Link>
              </span>
            </div>
            
            <div className="mb-2">
              <span className="font-semibold text-gray-700">TV Televisions:</span>
              <span className="text-sm text-gray-600 ml-2">
                <Link href="#" className="hover:text-red-500">Desktop PC</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Laptop</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Smartphones</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Tablet</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Game Controller</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Audio & Video</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Wireless Speaker</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Drone</Link>
              </span>
            </div>
            
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Computer & Technologies:</span>
              <span className="text-sm text-gray-600 ml-2">
                <Link href="#" className="hover:text-red-500">Desktop PC</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Laptop</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Smartphones</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Tablet</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Game Controller</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Audio & Video</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Wireless Speaker</Link> | 
                <Link href="#" className="hover:text-red-500 ml-1">Drone</Link>
              </span>
            </div>
          </div>
          
          {/* Copyright and Payment */}
          
        </div>
      </div>

      
      {/* Footer main content */}
      <div className="container mx-auto py-2 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-600 hover:text-red-500">Term & Conditions</Link></li>
              <li><Link href="/faqs" className="text-gray-600 hover:text-red-500">FAQs</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-red-500">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-red-500">Contact</Link></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-red-500">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-red-500">Contact</Link></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 hover:text-red-500">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-red-500">Contact</Link></li>
            </ul>
          </div>
          {/* Company */}
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
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <div className="flex mb-4">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="px-4 py-2 border border-gray-300 focus:outline-none flex-grow"
              />
              <button className="bg-red-500 text-white px-4 py-2">
                Subscribe
              </button>
            </div>
            
            {/* Social icons */}
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-red-500 hover:text-white">
                <FaFacebookF />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-red-500 hover:text-white">
                <FaTwitter />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-red-500 hover:text-white">
                <FaGooglePlusG />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-red-500 hover:text-white">
                <FaYoutube />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-red-500 hover:text-white">
                <FaInstagram />
              </Link>
            </div>
          </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">© 2024 GenieZy. All Rights Reserved</p>
            
            <div className="flex space-x-4 text-gray-600">
              <FaCcPaypal className="h-8 w-8" />
              <FaCcVisa className="h-8 w-8" />
              <FaCcMastercard className="h-8 w-8" />
              <FaCcAmex className="h-8 w-8" />
            </div>
          </div>
        
        
      </div>
      
      {/* Back to top button */}
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600"
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
