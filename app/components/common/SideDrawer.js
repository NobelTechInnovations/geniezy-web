import S3Image from '@/app/shared/utils/S3Image';
import React from 'react';
import Link from 'next/link';

const SideDrawer = ({ isOpen, onClose, cartItems }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[100px] border-l bg-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b">
          <div className="flex-1 ">
            <div className='flex justify-between items-center'>
            <h2 className="text-xs font-semibold">Subtotal</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className='text-xs'>✕</span>
            </button>
            </div>
            <Link href="/cart" className="text-xs border border-gray-500 rounded-lg">Go to cart</Link>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-4 overflow-y-auto">
          {cartItems?.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 flex-shrink-0">
                  <S3Image 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideDrawer; 