import Link from 'next/link';
import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

export default function CheckoutLayout({ children }) {
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
              {children} 
          </main>
      </div>

      {/* Optional: Footer */}
       <footer className="mt-10 pb-6 text-center text-sm text-white p-6 bg-gray-800">
         <p className="mb-2">Need help? Check our help pages or contact us 24x7</p>
         <p className="mb-1">Conditions of Use & Sale | Privacy Notice | Interest-Based Ads</p>
         <p>© 2025 Geniezy, Inc. or its affiliates</p>
       </footer>
    </div>
  );
}
