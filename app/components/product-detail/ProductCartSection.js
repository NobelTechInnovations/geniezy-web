'use client';

import { FiHeart, FiShare2, FiShoppingCart, FiTruck, FiPackage } from 'react-icons/fi';
import { formatIndianPrice } from '../../shared/utils/priceFormat';
import LoadingButton from '@/app/components/ui/LoadingButton';
import { useToast } from '@/app/components/ui/Toast';

const ProductCartSection = ({
    productData,
    quantity,
    exchange,
    setQuantity,
    setExchange,
    estimatedDelivery,
    onAddToCart,
    onBuyNow,
    isWishlisted,
    onToggleWishlist,
}) => {
    const showToast = useToast();

    const handleShare = async () => {
        const shareData = {
            title: productData.title,
            url: typeof window !== 'undefined' ? window.location.href : '',
        };
        if (typeof navigator !== 'undefined' && navigator.share) {
            try { await navigator.share(shareData); } catch (_) {}
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(shareData.url);
            showToast('Link copied to clipboard');
        }
    };

    const hasDiscount = productData.originalPrice && parseFloat(productData.originalPrice) > parseFloat(productData.price);

    return (
        <div className="lg:col-span-3 flex flex-col gap-0">
            {/* Price card */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Price header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-2xl font-bold text-gray-900">
                            {formatIndianPrice(productData.price)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatIndianPrice(productData.originalPrice)}
                                </span>
                                {productData.discount && (
                                    <span className="text-sm font-semibold text-green-600">
                                        {productData.discount} off
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Inclusive of all taxes</p>
                </div>

                {/* Delivery + seller info */}
                <div className="px-4 py-3 flex flex-col gap-2.5 border-b border-gray-100">
                    <div className="flex items-start gap-2.5">
                        <FiTruck className="text-blue-600 mt-0.5 flex-none" size={15} />
                        <div>
                            <p className="text-xs font-semibold text-gray-800">Delivery estimate</p>
                            <p className="text-xs text-gray-500 mt-0.5">{estimatedDelivery}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                        <FiPackage className="text-blue-600 mt-0.5 flex-none" size={15} />
                        <div>
                            <p className="text-xs font-semibold text-gray-800">
                                {productData.seller?.businessName || productData.seller?.name || 'Marketplace Seller'}
                            </p>
                            {productData.seller?.businessAddress && (
                                <p className="text-xs text-gray-400 mt-0.5">{productData.seller.businessAddress}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-0.5">Cash on Delivery available</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${productData.inStock ? 'text-green-600' : 'text-red-500'}`}>
                            {productData.inStock ? '● In stock' : '● Out of stock'}
                        </span>
                    </div>
                </div>

                {/* Quantity + actions */}
                <div className="px-4 py-3 flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                        <label className="text-xs text-gray-600 font-medium w-16 flex-none">Qty:</label>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none"
                        >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <LoadingButton
                        onClick={onBuyNow}
                        className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        loadingText="Please wait..."
                        disabled={!productData.inStock}
                    >
                        Buy Now
                    </LoadingButton>

                    <LoadingButton
                        onClick={onAddToCart}
                        className="w-full bg-white border-2 border-brand text-brand hover:bg-brand/5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        loadingText="Adding..."
                        disabled={!productData.inStock}
                    >
                        <FiShoppingCart />
                        Add to Cart
                    </LoadingButton>
                </div>

                {/* Wishlist / share */}
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <LoadingButton
                        onClick={onToggleWishlist}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        <FiHeart className={`text-base ${isWishlisted ? 'fill-current' : ''}`} />
                        {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                    </LoadingButton>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-500 transition-colors"
                    >
                        <FiShare2 className="text-base" />
                        Share
                    </button>
                </div>
            </div>

            {/* Safe shopping note */}
            <p className="text-[10px] text-gray-400 text-center mt-2 px-2">
                🔒 Secure, encrypted checkout · Easy 7-day returns
            </p>
        </div>
    );
}

export default ProductCartSection;
