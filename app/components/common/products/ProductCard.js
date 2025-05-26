"use client"

import Link from 'next/link';
import { formatIndianPrice } from '@/app/shared/utils/priceFormat';
import S3Image from '@/app/shared/utils/S3Image';
import { slugify } from '@/app/shared/utils/titleFormat';
const ProductCard = ({ product }) => {
  const {
    _id,
    product_id,
    slug,
    sku,
    images = [],
    type = "simple",
    title,
    price,
    stock = 0,
  } = product;

  const image = images[0]?.thumbnail_image || "https://via.placeholder.com/300";
  
  // Handle different price structures based on product type
  let priceValue, originalPrice, discount;
  
  if (type === "simple" && price?.selling_price && price?.mrp) {
    priceValue = parseFloat(price.selling_price.$numberDecimal || "0");
    originalPrice = parseFloat(price.mrp.$numberDecimal || "0");
    discount = Math.round(((originalPrice - priceValue) / originalPrice) * 100);
  } else {
    // For variable products or if price structure is different
    priceValue = parseFloat(price?.$numberDecimal || "0");
    originalPrice = priceValue;
    discount = 0;
  }

  return (
    <Link href={`/gspin/${product_id}/${slugify(title)}?pid=${_id}&p_sku=${sku}&type=${type}`}>
      <div className="bg-white border border-gray-100 rounded-lg p-2 flex flex-col items-center hover:shadow-md transition-shadow">
        <S3Image 
          src={image} 
          alt={title} 
          className="mb-2 rounded w-full aspect-square object-contain" 
        />
        <div className="font-medium text-gray-800 text-center line-clamp-2">{title}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">4.3★</span>
          <span className="text-xs text-gray-500">(1,58,799)</span>
        </div>
        <div className="mt-2 text-lg font-bold text-gray-900">
          ₹{formatIndianPrice(priceValue)}
          {discount > 0 && (
            <span className="text-sm font-normal line-through text-gray-400 ml-2">
              ₹{formatIndianPrice(originalPrice)}
            </span>
          )}
        </div>
        {discount > 0 && (
          <div className="text-green-600 text-xs font-semibold">{discount}% off</div>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;