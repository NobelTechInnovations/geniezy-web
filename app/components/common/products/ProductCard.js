"use client"

import Link from 'next/link';
import { formatIndianPrice } from '@/app/shared/utils/priceFormat';
import S3Image from '@/app/shared/utils/S3Image';
import { slugify } from '@/app/shared/utils/titleFormat';
import { FiPlus } from 'react-icons/fi';
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
        <div className=" bg-white flex flex-col relative">
            <div className=' border border-gray-100 rounded-lg p-2'>
                <S3Image 
                    src={image} 
                    alt={title} 
                    className="mb-2 rounded w-full h-full aspect-square object-contain " 
                />
               
            </div>
            <div className="flex flex-col">
                {/* Main Price */}
                <span className="text-md font-semibold text-gray-800">
                    {formatIndianPrice(priceValue)}
                </span>

                {/* Original Price + Discount */}
                {discount > 0 && originalPrice && (
                    <div className="flex items-baseline gap-2">
                    <span className="line-through text-gray-500 text-xs">
                        {formatIndianPrice(originalPrice)}
                    </span>
                    <span className="text-green-600 text-xs font-semibold">
                        {discount}% off
                    </span>
                    </div>
                )}
            </div>

            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600">
                {product.title}
            </h3>
            <div className="flex items gap-1">
                <span className=" px-2 py-0.5 rounded text-xs font-semibold">4.3★</span>
                <span className="text-xs text-gray-500">(1,58,799)</span>
                
            </div>

            <a
                className=" text-black text-left mt-2 text-sm font-semibold underline"
                onClick={(e) => {
                e.preventDefault(); // prevent link navigation
                alert(`Added "${product.title}" to cart!`);
                }}
            >
                Add to cart
            </a>
        </div>
    </Link>
  );
}

export default ProductCard;