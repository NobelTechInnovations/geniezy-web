'use client';

import S3Image from '@/app/shared/utils/S3Image';
import Link from 'next/link';
import { slugify } from '@/app/shared/utils/titleFormat';

const MainSingleProductCard = ({ product }) => {
  if (!product) return null;
  return (
    <Link 
      href={`/gspin/${product.gspin}/${slugify(product.name)}?pid=${btoa(product.productId)}&p_sku=${product.sku}&type=${product.product_type}`}
      className="block group"
    >
      <div className="bg-white rounded-lg p-2 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="aspect-[4/3] mb-3 rounded-md overflow-hidden ">
          <S3Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain product-image"
          />
        </div>
        <div>
          <h3 className="text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          )}
          {product.categoryName && (
            <p className="text-xs text-gray-500">{product.categoryName}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MainSingleProductCard; 