'use client';

import S3Image from '@/app/shared/utils/S3Image';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import { slugify } from '@/app/shared/utils/titleFormat';

const MainSingleProductCard = ({ product }) => {
  if (!product) return null;
  return (
    <Link 
      href={`/gspin/${product.gspin}/${slugify(product.name)}?pid=${btoa(product.productId)}&p_sku=${product.sku}&type=${product.product_type}`}
      className="block group"
    >
       <div className="bg-white rounded-lg p-1  transition-shadow">
                <div className="relative aspect-[4/3] mb-3 border border-gray-200 p-1 rounded-md overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                   <button
                    className="absolute bottom-2 right-2 text-black p-1.5 rounded-full shadow-md hover:bg-g-600"
                    onClick={(e) => {
                      e.preventDefault(); // prevent link navigation
                      alert(`Added "${product.title}" to cart!`);
                    }}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-md font-semibold">₹{product.price}</span>
                  </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Free delivery</span>

                  </div>
                </div>
              </div>
    </Link>
  );
};

export default MainSingleProductCard; 