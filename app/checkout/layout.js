'use client';

import Link from 'next/link';
import React, { createContext, useState, useEffect } from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import api from '../redux/services/apiService';
import { useRouter } from 'next/navigation';

// Create context for checkout data
export const CheckoutContext = createContext();

export default function CheckoutLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('geniezy_token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch both checkout and address data in parallel
        const [checkoutResponse, addressResponse] = await Promise.all([
          api.get('/v1/shop/cart/checkout', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/v1/shop/cart/checkout/addressinfo', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (checkoutResponse.data.success && addressResponse.data.success) {
          const checkoutData = checkoutResponse.data.data;
          if (
            !checkoutData.cart ||
            checkoutData.cart.totalItems === 0 ||
            checkoutData.cart.subtotal === 0
          ) {
            // Redirect to cart page
            router.push('/cart'); // assuming you're using Next.js's useRouter
            return;
          }

          setCheckoutData(checkoutResponse.data.data);
          setAddressData(addressResponse.data.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError(err.message || 'Failed to fetch data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-white py-2.5 border-b border-gray-200">
          <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
            <div className="mr-5 font-bold">
              <img src='/4.png' width={120}/>
            </div>
            <h2 className="text-xl font-semibold">Secure checkout</h2>
            <Link href={'/cart'}>
              <div className='flex items-center gap-2'>
                <FiShoppingBag />
                <h2 className="text-md font-semibold">Cart</h2>
              </div>
            </Link>
          </div>
        </header>

        <div className="max-w-screen-xl mx-auto mt-5 p-2">
          <main className="flex gap-5 items-start">
            {/* Skeleton loading UI */}
            <div className="flex-grow-2 w-4/5">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <CheckoutContext.Provider value={{ checkoutData, addressData, setAddressData }}>
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-white py-2.5 border-b border-gray-200">
          <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
            <div className="mr-5 font-bold">
              <img src='/4.png' width={120}/>
            </div>
            <h2 className="text-xl font-semibold">Secure checkout</h2>
            <Link href={'/cart'}>
              <div className='flex items-center gap-2'>
                <FiShoppingBag />
                <h2 className="text-md font-semibold">Cart</h2>
              </div>
            </Link>
          </div>
        </header>

        <div className="max-w-screen-xl mx-auto mt-5 p-2">
          <main className="flex gap-5 items-start">
            {children}
          </main>
        </div>

        <footer className="mt-10 pb-6 text-center text-sm text-white p-6 bg-gray-800">
          <p className="mb-2">Need help? Check our help pages or contact us 24x7</p>
          <p className="mb-1">Conditions of Use & Sale | Privacy Notice | Interest-Based Ads</p>
          <p>© 2025 Geniezy, Inc. or its affiliates</p>
        </footer>
      </div>
    </CheckoutContext.Provider>
  );
}
