"use client"

import Link from 'next/link';
import { formatIndianPrice } from '@/app/shared/utils/priceFormat';
import S3Image from '@/app/shared/utils/S3Image';
import { getProductRoute } from '@/app/shared/utils/getProductRoute';
import { cartService } from '@/app/services/cart/cartService';
import { useToast } from '@/app/components/ui/Toast';
import LoadingButton from '@/app/components/ui/LoadingButton';
import { eventApi } from '@/app/redux/services/apiService';
import { getAnonymousId } from '@/app/services/browsingHistory/anonymousId';

/**
 * Safely extracts a JS number from whatever shape MongoDB/Mongoose returns
 * for a Decimal128 or plain numeric field:
 *   { $numberDecimal: "33990.00" }  →  33990
 *   33990 (plain Number)            →  33990
 *   "33990"                         →  33990
 *   undefined / null                →  null
 */
function toNum(val) {
  if (val == null) return null;
  if (typeof val === 'object' && val.$numberDecimal != null)
    return parseFloat(val.$numberDecimal);
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

/**
 * Returns { priceValue, originalPrice, discount } from whatever price shape
 * the API hands back (simple ProductPrice doc vs variable Decimal128 field).
 */
function extractPriceInfo(price, type) {
  if (!price) return { priceValue: null, originalPrice: null, discount: 0 };

  if (type === 'simple' || type === undefined) {
    // price is a ProductPrice document: { selling_price: Decimal128, mrp: Decimal128, … }
    const sp = toNum(price.selling_price);
    const mrp = toNum(price.mrp);
    if (sp != null) {
      const disc = mrp && mrp > sp ? Math.round(((mrp - sp) / mrp) * 100) : 0;
      return { priceValue: sp, originalPrice: mrp, discount: disc };
    }
  }

  // Variable combination — price is a Decimal128 directly
  const direct = toNum(price);
  if (direct != null) return { priceValue: direct, originalPrice: null, discount: 0 };

  return { priceValue: null, originalPrice: null, discount: 0 };
}

const ProductCard = ({ product, onCardClick }) => {
  const {
    _id,
    product_id,
    slug,
    sku,
    images = [],
    type = 'simple',
    title,
    price,
    delivery_type,
  } = product;

  const showToast = useToast();
  const { priceValue, originalPrice, discount } = extractPriceInfo(price, type);

  const image = images[0]?.thumbnail_image || null;

  const handleAddToCart = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const response = await cartService.addToCart({
      gspin: product_id,
      pid: _id,
      p_sku: sku,
      type,
      quantity: 1,
      title,
      price,
      images,
      brand: product.brand,
    });

    if (response?.success) {
      showToast(`"${title}" added to cart`);
      eventApi.track({
        eventType: 'add_to_cart',
        productId: product_id,
        categoryId: product.category_id?._id,
        price: priceValue,
        quantity: 1,
        value: priceValue,
        anonId: getAnonymousId(),
      }).catch(() => {});
    } else {
      showToast(response?.message || 'Could not add to cart', 'error');
    }
  };

  return (
    <Link
      href={getProductRoute({ product_id, title, _id, sku, type })}
      onClick={() => onCardClick?.(product)}
      className="group block"
    >
      <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">

        {/* Image area */}
        <div className="relative bg-gray-50 rounded-t-xl overflow-hidden aspect-square">
          <S3Image
            src={image}
            alt={title}
            className="w-full h-full"
            objectFit="contain"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {discount}% off
            </span>
          )}
          {delivery_type === 'same_day' && (
            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
              Same-day
            </span>
          )}
          {delivery_type === 'standard' && (
            <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
              Std delivery
            </span>
          )}
        </div>

        {/* Info area */}
        <div className="flex flex-col flex-1 p-2 gap-1">
          <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
            {title}
          </h3>

          {priceValue != null ? (
            <div className="mt-auto pt-1">
              <span className="text-sm font-bold text-gray-900">
                {formatIndianPrice(priceValue)}
              </span>
              {originalPrice && originalPrice > priceValue && (
                <span className="text-[11px] text-gray-400 line-through ml-1.5">
                  {formatIndianPrice(originalPrice)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400 mt-auto pt-1">Price unavailable</span>
          )}

          <LoadingButton
            className="mt-1 w-full py-1 text-[11px] font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={handleAddToCart}
          >
            Add to cart
          </LoadingButton>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
