import Link from 'next/link';
import Image from 'next/image';
import { formatIndianPrice } from '@/app/shared/utils/priceFormat';
import { slugify } from '@/app/shared/utils/titleFormat';
import S3Image from '@/app/shared/utils/S3Image';

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.thumbnail_image || '/placeholder.png';
  
  // Handle different price formats
  let price = '0';
  let originalPrice = null;
  
  if (product.type === 'simple') {
    // Simple product price format
    price = product.price?.selling_price?.$numberDecimal || product.price?.selling_price || '0';
    originalPrice = product.price?.mrp?.$numberDecimal || product.price?.mrp;
  } else {
    // Variable product price format
    price = product.price?.$numberDecimal || product.price || '0';
  }

  // Calculate discount if original price exists
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

  return (
    <Link href={`/gspin/${product.product_id}/${slugify(product.title)}?pid=${product._id}&p_sku=${product.sku || product.unified_sku}&type=${product.type}`} 
          className="block bg-white rounded-md border border-gray-100 shadow-xs hover:shadow-xs transition-shadow duration-200">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg">
        <S3Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          {product.title}
          
        </h3>
        {product.type === 'variable_combination' && product.selected_variation && (
          <span className="text-xs text-gray-500">
            {Object.values(product.selected_variation).map(v => v.value).join(', ')}
          </span>
        )}
        
        <div className="space-y-1">
          <div className=" items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatIndianPrice(price)}
            </span>
            <div className='flex gap-2'>
              {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatIndianPrice(originalPrice)}
              </span>
            )}
            {discount && (
              <span className="text-xs font-medium text-green-600">
                {discount}% off
              </span>
            )}
            </div>
          </div>
          <div className="flex items-center justify-between">

            {product.stock > 0 ? (
              <span className="text-xs text-green-600">In Stock</span>
            ) : (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
            
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 