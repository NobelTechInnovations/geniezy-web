"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import S3Image from '@/app/shared/utils/S3Image';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';
import RecentViewProducts from '@/app/components/home/RecentViewProducts';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const itemName = searchParams.get('itemName');
  const itemImage = searchParams.get('itemImage');
  const error = searchParams.get('error');

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="mb-6">
          <FiCheckCircle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Failed to add item to cart</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">There was an error adding the item to your cart. Please try again.</p>
        <Link href="/" className="bg-[#004bad] hover:bg-[#004bad] text-white px-4 py-1 rounded-sm font-semibold shadow transition">Return to Home</Link>
      </div>
    );
  }

  if (!itemName) {
     // If no item name is present, it means the user likely navigated directly
     // or there was an issue. Redirect to the main cart page.
     // This is a basic fallback. A more robust solution might involve fetching cart here.
     // For now, assuming direct navigation to the thank you page is not the primary flow.
    return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
         <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Thank You</h2>
         <p className="text-gray-600 mb-6 text-center max-w-md">Your action was processed.</p>
         <Link href="/cart" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-sm font-semibold shadow transition">Go to Cart</Link>
       </div>
    );
  }

  return (
    <>
      <div className='mb-4'>
        <div className="flex flex-col items-center justify-center min-h-100 bg-gray-50">
          <div className="mb-2 flex gap-2">
            <FiCheckCircle className="w-8 h-8 text-green-500" />Thank you!
          </div>
          <h2 className="text-2xl md:text-lg font-bold mb-2 text-gray-900">{itemName} added in your cart.</h2>
        
          {itemImage && (
            <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
              <S3Image src={itemImage} alt={itemName} className="w-full h-full object-contain" />
            </div>
          )}
          
          <Link href="/cart" className=" text-black  text-md font-semibold underline">Go to Cart</Link>
        </div>
        <RecentViewProducts />
      </div>
     </>
  );
}