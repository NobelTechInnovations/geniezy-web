"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import S3Image from '@/app/shared/utils/S3Image';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';

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
        <Link href="/" className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-sm font-semibold shadow transition">Return to Home</Link>
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="mb-6">
        <FiCheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Thank you for adding {itemName} to your cart!</h2>
      {itemImage && (
        <div className="w-32 h-32 mb-6 rounded-md border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
          <S3Image src={itemImage} alt={itemName} className="w-full h-full object-contain" />
        </div>
      )}
      <Link href="/cart" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-1 rounded-sm font-semibold shadow transition">Go to Cart</Link>
    </div>
  );
}