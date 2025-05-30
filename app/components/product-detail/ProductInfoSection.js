'use client';

import { FiShoppingCart, FiStar, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import Link from 'next/link';

const ProductInfoSection = ({productData}) => {
    return (
        <div className="lg:col-span-5 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{productData.title}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-700 text-sm font-semibold cursor-pointer hover:underline">Visit the {productData.brand} Store</span>
              <span className="flex items-center text-yellow-500 font-semibold ml-2">
                <FiStar className="mr-1" /> {productData.rating}
              </span>
              <span className="text-gray-600 text-sm">({productData.ratingCount})</span>
              <span className="text-blue-700 text-xs font-medium ml-2 cursor-pointer hover:underline">Search this page</span>
            </div>
            <div className="text-xs text-gray-700 mb-2">{productData.boughtCount}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 font-bold text-xl">-{productData.discount}</span>
              <span className="text-2xl font-bold text-gray-900">₹{productData.price}</span>
              <span className="text-base text-gray-500 line-through">₹{productData.originalPrice}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 text-xs px-2 py-1 rounded font-semibold text-gray-700">g. Assuerd</span>
              <span className="text-xs text-gray-700">Inclusive of all taxes</span>
            </div>
            <div className="text-xs text-gray-700 mb-2">EMI starts at ₹1,697. No Cost EMI available <span className="text-blue-700 cursor-pointer hover:underline">EMI options</span></div>
            {/* Offers as horizontal cards */}
            <div className="flex flex-wrap gap-2 mb-2">
              {productData.offers.map((offer, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs min-w-[140px] flex-1">
                  <div className="font-semibold text-gray-800 mb-1">{offer.title}</div>
                  <div className="text-gray-700 mb-1">{offer.desc}</div>
                  <Link href={offer.link} className="text-blue-700 hover:underline">{offer.title === 'Cashback' ? '2 offers' : offer.title === 'No Cost EMI' ? '1 offer' : '23 offers'}</Link>
                </div>
              ))}
            </div>
            {/* Icons row */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-700 mb-2 items-center">
              <div className="flex flex-col items-center"><FiRefreshCw className="text-lg mb-1" />7 days Service Centre Replacement</div>
              <div className="flex flex-col items-center"><FiTruck className="text-lg mb-1" />Free Delivery</div>
              <div className="flex flex-col items-center"><FiShield className="text-lg mb-1" />1 Year Warranty</div>
              <div className="flex flex-col items-center"><FiShoppingCart className="text-lg mb-1" />Cash/Pay on Delivery</div>
            </div>
          </div>
    );
}

export default ProductInfoSection;