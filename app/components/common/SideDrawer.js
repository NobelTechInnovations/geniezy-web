import S3Image from '@/app/shared/utils/S3Image';
import React from 'react';
import Link from 'next/link';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import { formatIndianPrice } from '@/app/shared/utils/priceFormat';

// Cart transformer returns snake_case: product_details.{ product_name, product_images, product_price }
// Local (IndexedDB) items use productData.{ title, image, price } via cartService
// This helper normalises both shapes so the drawer renders correctly.
function getItemDisplay(item) {
  // API-backed items (logged in) use product_details
  if (item.product_details) {
    return {
      name: item.product_details.product_name || 'Product',
      image: item.product_details.product_images?.[0] || null,
      price: Number(item.product_details.product_price ?? item.price ?? 0),
    };
  }
  // camelCase shape (mapApiItemToUi in cart/page.js) — productDetails
  if (item.productDetails) {
    return {
      name: item.productDetails.name || 'Product',
      image: item.productDetails.images?.[0] || null,
      price: Number(item.productDetails.price ?? item.price ?? 0),
    };
  }
  // Guest/IndexedDB items — productData
  if (item.productData) {
    return {
      name: item.productData.title || 'Product',
      image: item.productData.image || null,
      price: Number(item.productData.price ?? 0),
    };
  }
  return { name: 'Product', image: null, price: 0 };
}

const SideDrawer = ({ isOpen, onClose, cartItems }) => {
  const subtotal = (cartItems || []).reduce((sum, item) => {
    const { price } = getItemDisplay(item);
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer — wider than the old 120px */}
      <div
        className={`fixed top-0 right-0 h-full w-80 border-l bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="text-gray-700 w-5 h-5" />
            <span className="font-semibold text-gray-800">
              Cart ({cartItems?.length || 0})
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded"
            aria-label="Close cart"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {(!cartItems || cartItems.length === 0) ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              Your cart is empty
            </div>
          ) : (
            cartItems.map((item, index) => {
              const { name, image, price } = getItemDisplay(item);
              const qty = item.quantity || 1;
              return (
                <div key={item.id || item._id || index} className="flex gap-3">
                  <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-100 bg-gray-50">
                    {image ? (
                      <S3Image
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium leading-tight line-clamp-2">
                      {name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatIndianPrice(price)}
                      </span>
                      {qty > 1 && (
                        <span className="text-xs text-gray-400">× {qty}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems && cartItems.length > 0 && (
          <div className="border-t px-4 py-3 space-y-3">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">{formatIndianPrice(subtotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full text-center bg-[#004bad] hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              View Cart &amp; Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SideDrawer;
