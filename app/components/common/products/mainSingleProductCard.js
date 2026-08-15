'use client';

import S3Image from '@/app/shared/utils/S3Image';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import { slugify } from '@/app/shared/utils/titleFormat';
import { formatIndianPrice } from '@/app/shared/utils/priceFormat';
import { cartService } from '@/app/services/cart/cartService';
import { useToast } from '@/app/components/ui/Toast';

/**
 * Safely converts a Decimal128 object, plain number, or numeric string
 * into a JS number. Returns null for unresolvable values.
 */
function toNum(val) {
  if (val == null) return null;
  if (typeof val === 'object' && val.$numberDecimal != null)
    return parseFloat(val.$numberDecimal);
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

const MainSingleProductCard = ({ product }) => {
  const showToast = useToast();

  if (!product) return null;

  // Normalise price — the home-feed pipeline may hand us the raw Decimal128
  // object, a plain number, or a numeric string. Accept all three.
  const priceValue = toNum(product.price) ?? toNum(product.price?.selling_price);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await cartService.addToCart({
      gspin: product.gspin,
      pid: product.productId,
      p_sku: product.sku,
      type: product.product_type,
      quantity: 1,
      title: product.title ?? product.name,
      price: product.price,
      images: product.image ? [{ thumbnail_image: product.image }] : [],
    });

    if (response?.success) {
      showToast(`"${product.title ?? product.name}" added to cart`);
    } else {
      showToast(response?.message || 'Could not add to cart', 'error');
    }
  };

  const href = `/gspin/${product.gspin}/${slugify(product.name ?? product.title)}?pid=${product.productId}&p_sku=${product.sku}&type=${product.product_type}`;

  return (
    <Link href={href} className="block group">
      <div className="p-1">
        <div className="relative aspect-[4/3] mb-2 border border-gray-200 bg-white rounded-lg overflow-hidden">
          <S3Image
            src={product.image}
            alt={product.title ?? product.name}
            className="w-full h-full"
            objectFit="contain"
          />
          <button
            className="absolute bottom-2 right-2 bg-white border border-gray-200 text-gray-700 p-1.5 rounded-full shadow hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <FiPlus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-baseline gap-1">
          {priceValue != null ? (
            <span className="text-sm font-bold text-gray-900">
              {formatIndianPrice(priceValue)}
            </span>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>

        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 leading-snug mt-0.5">
          {product.title ?? product.name}
        </h3>

        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-xs text-green-600 font-medium">Free delivery</span>
        </div>
      </div>
    </Link>
  );
};

export default MainSingleProductCard;
