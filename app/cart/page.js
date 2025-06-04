"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import S3Image from '@/app/shared/utils/S3Image';
import { FiShoppingBag } from 'react-icons/fi';
import { cartService } from '@/app/services/cart/cartService';
import { formatIndianPrice } from '../shared/utils/priceFormat';

// Removed Dummy cart data
// const DUMMY_CART = [...];

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartSummary, setCartSummary] = useState({ totalItems: 0, totalQuantity: 0, subtotal: 0, totalDiscount: 0, finalAmount: 0 });

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCartItems();
      console.log(response);
      if (response.success) {
        // Assuming API response data for logged-in user has a 'cart' object and 'items' array
        // and IndexedDB response data is also an array of items
        const items = response.data?.items || response.data || [];
        setCartItems(items);

        // Always calculate summary based on the fetched items array
        const calculatedSubtotal = items.reduce((sum, item) => sum + (item.price || item.productDetails?.price || item.productData?.price || 0) * (item.quantity || 1), 0);
        const calculatedTotalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Use API provided summary if available, otherwise use calculated summary
        if (response.data?.cart) {
           setCartSummary({
             totalItems: response.data.cart.totalItems,
             totalQuantity: response.data.cart.totalQuantity,
             subtotal: response.data.cart.subtotal,
             totalDiscount: response.data.cart.discount,
             finalAmount: response.data.cart.finalAmount,
           });
        } else {
           setCartSummary({
             totalItems: items.length,
             totalQuantity: calculatedTotalQuantity,
             subtotal: calculatedSubtotal,
             totalDiscount: 0, // IndexedDB doesn't store discount in this structure
             finalAmount: calculatedSubtotal,
           });
        }

      } else {
        setError(response.message || 'Failed to fetch cart items');
        setCartItems([]);
        setCartSummary({ totalItems: 0, totalQuantity: 0, subtotal: 0, totalDiscount: 0, finalAmount: 0 });
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('An error occurred while fetching cart items');
      setCartItems([]);
      setCartSummary({ totalItems: 0, totalQuantity: 0, subtotal: 0, totalDiscount: 0, finalAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQtyChange = async ({ item, quantity: newQuantity }) => {
    newQuantity = Math.max(1, newQuantity);
    if (newQuantity === item.quantity) return; // No change needed

    // Optimistically update the UI
    const updatedCartItems = cartItems.map(cartItem => {
      // Check both id and _id to handle both API and IndexedDB items
      const itemId = item.id || item._id;
      const cartItemId = cartItem.id || cartItem._id;
      
      if (itemId === cartItemId) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    setCartItems(updatedCartItems);

    // Recalculate summary based on optimistic update
    const calculatedSubtotal = updatedCartItems.reduce((sum, cartItem) => 
      sum + (cartItem.price || cartItem.productDetails?.price || cartItem.productData?.price || 0) * (cartItem.quantity || 1), 0);
    const calculatedTotalQuantity = updatedCartItems.reduce((sum, cartItem) => 
      sum + (cartItem.quantity || 1), 0);
    
    setCartSummary({
      totalItems: updatedCartItems.length,
      totalQuantity: calculatedTotalQuantity,
      subtotal: calculatedSubtotal,
      totalDiscount: 0, // Need to fetch from API for actual discount calculation
      finalAmount: calculatedSubtotal,
    });

    try {
      // Update quantity using cartService (handles API or IndexedDB) in the background
      const response = await cartService.updateQuantity(item.id || item._id, newQuantity);
      if (response.success) {
        console.log('Quantity updated successfully in background');
      } else {
        console.error('Failed to update quantity:', response.message);
        // Revert the optimistic update if the API call fails
        setCartItems(cartItems);
        // Recalculate summary with original items
        const originalSubtotal = cartItems.reduce((sum, cartItem) => 
          sum + (cartItem.price || cartItem.productDetails?.price || cartItem.productData?.price || 0) * (cartItem.quantity || 1), 0);
        const originalTotalQuantity = cartItems.reduce((sum, cartItem) => 
          sum + (cartItem.quantity || 1), 0);
        setCartSummary({
          totalItems: cartItems.length,
          totalQuantity: originalTotalQuantity,
          subtotal: originalSubtotal,
          totalDiscount: 0,
          finalAmount: originalSubtotal,
        });
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert the optimistic update if there's an error
      setCartItems(cartItems);
      // Recalculate summary with original items
      const originalSubtotal = cartItems.reduce((sum, cartItem) => 
        sum + (cartItem.price || cartItem.productDetails?.price || cartItem.productData?.price || 0) * (cartItem.quantity || 1), 0);
      const originalTotalQuantity = cartItems.reduce((sum, cartItem) => 
        sum + (cartItem.quantity || 1), 0);
      setCartSummary({
        totalItems: cartItems.length,
        totalQuantity: originalTotalQuantity,
        subtotal: originalSubtotal,
        totalDiscount: 0,
        finalAmount: originalSubtotal,
      });
    }
  };

  const handleRemove = async (id) => {
    // Optimistically update the UI
    const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== id && cartItem._id !== id);
    setCartItems(updatedCartItems);
     // Recalculate summary based on optimistic update
     const calculatedSubtotal = updatedCartItems.reduce((sum, cartItem) => sum + (cartItem.price || cartItem.productDetails?.price || cartItem.productData?.price || 0) * (cartItem.quantity || 1), 0);
     const calculatedTotalQuantity = updatedCartItems.reduce((sum, cartItem) => sum + (cartItem.quantity || 1), 0);
     setCartSummary({
       totalItems: updatedCartItems.length,
       totalQuantity: calculatedTotalQuantity,
       subtotal: calculatedSubtotal,
       totalDiscount: 0, // Need to fetch from API for actual discount calculation
       finalAmount: calculatedSubtotal,
     });

    try {
      // Remove item using cartService (handles API or IndexedDB) in the background
      const response = await cartService.removeItem(id);
      if (response.success) {
         console.log('Item removed successfully in background');
        // Optionally re-fetch cart after successful removal for perfect consistency
        // fetchCartItems();
      } else {
        console.error('Failed to remove item:', response.message);
        // TODO: Handle error - maybe revert UI change or show a message
      }
    } catch (error) {
      console.error('Error removing item:', error);
      // TODO: Handle error - maybe revert UI change or show a message
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
         <div className="mb-6">
         <FiShoppingBag className="w-15 h-15 text-red-500" />
         </div>
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/" className="text-blue-500 hover:underline">Return to Home</Link>
      </div>
    );
  }


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
              <div key={item.id || item._id} className={`flex flex-col md:flex-row gap-4 md:gap-8 p-2 bg-white  border-t border-gray-200 ${idx !== cartItems.length - 1 ? '' : ''}`}>
                <div className="w-full md:w-16 h-16 flex-shrink-0 rounded-sm border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden ">
                  {/* Use productDetails for API response, productData for IndexedDB */}
                  <S3Image src={item.productData?.image} alt={item.productDetails?.name || item.productData?.title} className="w-full h-full object-contain product-image" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Use productDetails.name for API response, productData.title for IndexedDB */}
                    <div className="font-semibold text-gray-900 text-base md:text-md mb-1 line-clamp-2">{item.productDetails?.name || item.productData?.title}</div>
                    {/* Display additional details if available (from API or IndexedDB) */}
                    {(item.additional || item.productData?.additional) && (
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                            {/* Use item.additional for API, item.productData.additional for IndexedDB */}
                            {Object.entries(item.additional || item.productData?.additional || {}).map(([key, value]) => (
                                <span key={key}>
                                    <span className="font-medium">{key}:</span>{' '}
                                    <span className="font-semibold text-gray-700">
                                        {/* Extract value field if it's an attribute object, otherwise use the value as is */}
                                        {typeof value === 'object' && value !== null && 'value' in value ? value.value : value}
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}
                    {/* TODO: Add delivery info if available in API/IndexedDB response */}
                    <div className="text-xs text-gray-700 mb-1">Delivery by {item.deliveryDate} | <span className="font-semibold">{item.delivery}</span></div>
                    <div className="text-xs text-gray-700 mb-1">Shipping by <span className="font-semibold">g. assuerd</span></div>
                  </div>
                  <div className='flex items-center mt-2'>
                    <div className="flex items-center gap-1  flex-wrap">
                      <button onClick={() => handleQtyChange({item, quantity: item.quantity - 1})} className="border border-gray-300  w-5 h-5 flex items-center justify-center text-sm font-bold bg-white hover:bg-gray-100">-</button>
                      <span className="px-2 text-sm  font-medium border border-gray-200">{item.quantity}</span>
                      <button onClick={() => handleQtyChange({item, quantity: item.quantity + 1})} className="border border-gray-300  w-5 h-5 flex items-center justify-center text-sm font-bold bg-white hover:bg-gray-100">+</button>
                      {/* TODO: Implement Save for later */}
                      {/* <button className="ml-2 text-blue-600 hover:underline text-xs font-medium">Save for later</button> */}
                    </div>
                    <div className="flex">
                      <button onClick={() => handleRemove(item.id || item._id)} className="ml-4 text-red-500 hover:underline text-xs font-medium">Delete</button>
                      <button onClick={() => handleRemove(item.id || item._id)} className="ml-4 text-gray-500 hover:underline text-xs font-medium">Save later</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[100px] justify-between">
                  <div>
                    <span className="text-md font-bold text-gray-900">{formatIndianPrice((item.price || item.productDetails?.price || item.productData?.price || 0) * (item.quantity || 1))}</span>
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
              <span>Price ({cartSummary.totalItems} item{cartSummary.totalItems > 1 ? 's' : ''})</span>
              <span>{formatIndianPrice(cartSummary.subtotal.toFixed(2))}</span>
            </div>
            {cartSummary.totalDiscount > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span>Discount</span>
                <span className="text-green-600">-{formatIndianPrice(cartSummary.totalDiscount.toFixed(2))}</span>
              </div>
            )}
            <div className="flex justify-between mb-2 text-sm">
              <span>Delivery Charges</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between font-bold text-md mb-4">
              <span>Total Amount</span>
              <span>{formatIndianPrice(cartSummary.finalAmount.toFixed(2))}</span>
            </div>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded-sm font-semibold text-base shadow transition mt-2">Place Order</button>
          </div>
        </aside>
      </div>
    </main>
  );
}