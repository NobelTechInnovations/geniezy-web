"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import S3Image from '@/app/shared/utils/S3Image';
import { FiShoppingBag } from 'react-icons/fi';

// Dummy cart data for UI only
const DUMMY_CART = [
  {
    id: '1',
    name: 'HIPOP Printed Women Round Neck White T-Shirt',
    image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/2/0/2/xl-hp-301-blisswear-original-imagz6y2gqzqzqzq.jpeg',
    price: 341,
    originalPrice: 1499,
    discount: 77,
    seller: 'BLISSWEAR',
    size: 'XL',
    quantity: 1,
    delivery: 'Free',
    deliveryDate: 'Sun Jun 8',
  },
  {
    id: '2',
    name: 'HIPOP Printed Women Round Neck White T-Shirt',
    image: 'https://rukminim2.flixcart.com/image/832/832/xif0q/t-shirt/2/0/2/xl-hp-301-blisswear-original-imagz6y2gqzqzqzq.jpeg',
    price: 341,
    originalPrice: 1499,
    discount: 77,
    seller: 'BLISSWEAR',
    size: 'XL',
    quantity: 1,
    delivery: 'Free',
    deliveryDate: 'Sun Jun 8',
  },
  // Add more items if you want to test multiple
];

export default function CartPage() {
  // For demo, you can set this to [] to see the empty state
  const [cartItems, setCartItems] = useState(DUMMY_CART);

  // Handlers for quantity (UI only)
  const handleQtyChange = (id, delta) => {
    setCartItems(items => items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };
  const handleRemove = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Cart summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 px-4">
        <div className="mb-6">
        <FiShoppingBag className="w-15 h-15 text-gray-800" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Your Cart is empty</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">Looks like you haven&apos;t added anything to your cart yet. Start shopping and discover premium products at the best prices!</p>
        <Link href="/" className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-sm font-semibold shadow transition">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <main className="flex container mx-auto flex-col bg-white">
      <div className="flex flex-1 w-full px-2 md:px-6 gap-8 mt-6">
        {/* Cart Items Section */}
        <section className="flex-1 flex flex-col border border-gray-200 rounded-sm shadow-xs p-2 mb-2">
          <h1 className="text-2xl md:text-2xl font-bold mb-6 text-gray-900">Shopping Cart</h1>
          <div className="flex flex-col gap-4">
            {cartItems.map((item, idx) => (
              <div key={item.id} className={`flex flex-col md:flex-row gap-4 md:gap-8 p-2 bg-white  border-t border-gray-200 ${idx !== cartItems.length - 1 ? '' : ''}`}>
                <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-sm border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
                  <S3Image src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 text-base md:text-lg mb-1 line-clamp-2">{item.name}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                      <span>Size: <span className="font-semibold text-gray-700">{item.size}</span></span>
                      <span>Seller: <span className="font-semibold text-gray-700">{item.seller}</span></span>
                    </div>
                    <div className="text-xs text-green-700 mb-1">Delivery by {item.deliveryDate} | <span className="font-semibold">{item.delivery}</span></div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <button onClick={() => handleQtyChange(item.id, -1)} className="border border-gray-300 rounded w-7 h-7 flex items-center justify-center text-lg font-bold bg-white hover:bg-gray-100">-</button>
                    <span className="px-2 text-base font-medium">{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item.id, 1)} className="border border-gray-300 rounded w-7 h-7 flex items-center justify-center text-lg font-bold bg-white hover:bg-gray-100">+</button>
                    <button onClick={() => handleRemove(item.id)} className="ml-4 text-red-500 hover:underline text-xs font-medium">Remove</button>
                    <button className="ml-2 text-blue-600 hover:underline text-xs font-medium">Save for later</button>
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[100px] justify-between">
                  <div>
                    <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="block text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                    )}
                    {item.discount && (
                      <span className="inline-block mt-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">{item.discount}% Off</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Summary Sidebar */}
        <aside className="w-full md:w-[340px] flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm shadow-xs p-6 sticky top-24">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900">Price Details</h2>
            <div className="flex justify-between mb-2 text-sm">
              <span>Price ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
              <span>₹{subtotal + totalDiscount}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Discount</span>
              <span className="text-green-600">-₹{totalDiscount}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Delivery Charges</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total Amount</span>
              <span>₹{subtotal}</span>
            </div>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded-sm font-semibold text-base shadow transition mt-2">Place Order</button>
          </div>
        </aside>
      </div>
    </main>
  );
}