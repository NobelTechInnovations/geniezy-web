"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import S3Image from '@/app/shared/utils/S3Image';
import { FiShoppingBag } from 'react-icons/fi';
import { cartService } from '@/app/services/cart/cartService';
import { formatIndianPrice } from '../shared/utils/priceFormat';
import api from '../redux/services/apiService';

// Note: this component now expects API to return snake_case keys
export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [savedForLaterItems, setSavedForLaterItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    totalQuantity: 0,
    subtotal: 0,
    totalDiscount: 0,
    finalAmount: 0,
    fees: { platform: 0, handling: 0, delivery: 0 }
  });
  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('geniezy_token');

  const mapApiItemToUi = (raw) => {
    // raw is expected in snake_case shape from your API
    return {
      id: raw.id ?? raw._id,
      _id: raw.id ?? raw._id,
      cartId: raw.cart_id,
      productId: raw.product_id,
      quantity: Number(raw.quantity ?? 1),
      sku: raw.p_sku,
      type: raw.product_type,
      price: Number(raw.price ?? raw.product_details?.product_price ?? 0),
      basePrice: Number(raw.base_price ?? raw.base_price ?? 0),
      taxAmount: Number(raw.tax_amount ?? 0),
      discountAmount: Number(raw.discount_amount ?? 0),
      total: Number(raw.product_total ?? 0),
      additional: Array.isArray(raw.additional) ? raw.additional : [],
      saveForLater: !!raw.saveForLater,
      // productDetails shaped like earlier JSX expects: { name, images, price }
      productDetails: {
        name: raw.product_details?.product_name ?? raw.productDetails?.name ?? '',
        images: raw.product_details?.product_images ?? raw.productDetails?.images ?? [],
        price: Number(raw.product_details?.product_price ?? raw.productDetails?.price ?? raw.price ?? 0)
      },
      // keep raw if needed
      _raw: raw
    };
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCartItems();
      console.log('cart response', response);

      if (!response.success) {
        setError(response.message || 'Failed to fetch cart items');
        setCartItems([]);
        setSavedForLaterItems([]);
        setCartSummary({
          totalItems: 0,
          totalQuantity: 0,
          subtotal: 0,
          totalDiscount: 0,
          finalAmount: 0,
          fees: { platform: 0, handling: 0, delivery: 0 }
        });
        return;
      }

      // API returns snake_case structure as you provided
      const apiCart = response.data?.cart ?? null;
      const apiItems = Array.isArray(response.data?.items) ? response.data.items : [];

      // Map each item to UI-friendly structure (no extra normalizer file)
      const mappedItems = apiItems.map(mapApiItemToUi);

      // Partition into active cart & saved for later
      const inCartItems = mappedItems.filter(i => !i.saveForLater);
      const savedItems = mappedItems.filter(i => i.saveForLater);

      setCartItems(inCartItems);
      setSavedForLaterItems(savedItems);

      // If API provides cart summary, use it (snake_case)
      if (apiCart) {
        const platformFee = Number(apiCart.platform_fee_amount ?? 0);
        const handlingFee = Number(apiCart.handling_fee_amount ?? 0);
        const deliveryFee = Number(apiCart.delivery_fee_amount ?? 0);

        // cart_subtotal from API is base subtotal (without fees)
        const cartSubtotal = Number(apiCart.cart_subtotal ?? 0);
        const cartDiscount = Number(apiCart.cart_discount ?? 0);
        const cartTax = Number(apiCart.cart_tax ?? 0);
        const cartFinalBase = Number(apiCart.cart_final_amount ?? (cartSubtotal + cartTax - cartDiscount));

        const finalAmount = cartFinalBase + platformFee + handlingFee + deliveryFee;

        setCartSummary({
          totalItems: Number(apiCart.total_items ?? inCartItems.length),
          totalQuantity: Number(apiCart.total_quantity ?? inCartItems.reduce((s,i)=> s + (i.quantity||0),0)),
          subtotal: cartSubtotal,
          totalDiscount: cartDiscount,
          finalAmount,
          fees: { platform: platformFee, handling: handlingFee, delivery: deliveryFee }
        });
      } else {
        // fallback: compute from items (no fees)
        const calculatedSubtotal = inCartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        const calculatedTotalQuantity = inCartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartSummary({
          totalItems: inCartItems.length,
          totalQuantity: calculatedTotalQuantity,
          subtotal: calculatedSubtotal,
          totalDiscount: 0,
          finalAmount: calculatedSubtotal,
          fees: { platform: 0, handling: 0, delivery: 0 }
        });
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('An error occurred while fetching cart items');
      setCartItems([]);
      setSavedForLaterItems([]);
      setCartSummary({
        totalItems: 0,
        totalQuantity: 0,
        subtotal: 0,
        totalDiscount: 0,
        finalAmount: 0,
        fees: { platform: 0, handling: 0, delivery: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQtyChange = async ({ item, quantity: newQuantity }) => {
    newQuantity = Math.max(1, newQuantity);
    if (newQuantity === item.quantity) return;

    const originalItems = [...cartItems];

    // Optimistically update UI
    const updatedCartItems = cartItems.map(ci => (ci.id === item.id || ci._id === item._id) ? { ...ci, quantity: newQuantity } : ci);
    setCartItems(updatedCartItems);

    // recalc summary optimistic (exclude fees, keep final calculation consistent)
    const calculatedSubtotal = updatedCartItems.reduce((sum, ci) => sum + (ci.price || 0) * (ci.quantity || 1), 0);
    setCartSummary(prev => ({
      ...prev,
      subtotal: calculatedSubtotal,
      finalAmount: calculatedSubtotal + (prev.fees.platform || 0) + (prev.fees.handling || 0) + (prev.fees.delivery || 0),
      totalQuantity: updatedCartItems.reduce((s, ci) => s + (ci.quantity || 1), 0),
      totalItems: updatedCartItems.length
    }));

    try {
      const response = await cartService.updateQuantity(item.id || item._id, newQuantity);
      if (response.success) {
        // refresh summary from server to be accurate
        await fetchCartItems();
      } else {
        // revert if failed
        setCartItems(originalItems);
        await fetchCartItems();
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setCartItems(originalItems);
      await fetchCartItems();
    }
  };

  const handleRemove = async (id) => {
    const originalItems = [...cartItems];
    const updatedCartItems = cartItems.filter(ci => ci.id !== id && ci._id !== id);
    setCartItems(updatedCartItems);

    const calculatedSubtotal = updatedCartItems.reduce((sum, ci) => sum + (ci.price || 0) * (ci.quantity || 1), 0);
    setCartSummary(prev => ({
      ...prev,
      subtotal: calculatedSubtotal,
      finalAmount: calculatedSubtotal + (prev.fees.platform || 0) + (prev.fees.handling || 0) + (prev.fees.delivery || 0),
      totalQuantity: updatedCartItems.reduce((s, ci) => s + (ci.quantity || 1), 0),
      totalItems: updatedCartItems.length
    }));

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
      // local remove (if you have one)
      await cartService.removeItem(id);
      // server remove
      const response = await api.delete(`/v1/shop/cart/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response?.success) {
        await fetchCartItems();
      } else {
        // revert if failed
        setCartItems(originalItems);
        await fetchCartItems();
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setCartItems(originalItems);
      await fetchCartItems();
    }
  };

  const handleSaveForLater = async (id) => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
      await api.post(`/v1/shop/cart/items/${id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCartItems();
    } catch (err) {
      console.error('Error saving for later:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToCart = async (id) => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
      await api.post(`/v1/shop/cart/items/${id}/move`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCartItems();
    } catch (err) {
      console.error('Error moving to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-90">
        loading...
        {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> */}
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

  if (cartItems.length === 0 && savedForLaterItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 px-4">
        <div className="mb-6">
          <FiShoppingBag className="w-15 h-15 text-gray-800" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Your Cart is empty</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">Looks like you haven&apos;t added anything to your cart yet. Start shopping and discover premium products at the best prices!</p>
        <Link href="/" className="bg-[#004bad] hover:bg-[#004bad] text-white px-4 py-1 rounded-sm font-semibold shadow transition">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <main className="flex container mx-auto flex-col bg-white">
      <div className="flex flex-1 w-6xl px-2 mx-auto gap-4 my-6">
        {/* Cart Items Section */}
        <div className="flex flex-col gap-4 w-full">
          <section className="flex-1 flex flex-col border border-gray-200 rounded-sm shadow-xs p-2 mb-2">
            <h1 className="text-lg font-semibold">Shopping Cart</h1>
            <div className="flex flex-col gap-2">
              {cartItems.length === 0 && (
                <div className=" text-gray-500 py-4">Check your Saved for later items below or continue shopping.</div>
              )}
              {cartItems.map((item, idx) => (
                <div key={item.sku || item.id || item._id} className={`flex flex-col md:flex-row gap-4 md:gap-8 p-2 bg-white  border-t border-gray-200 ${idx !== cartItems.length - 1 ? '' : ''}`}>
                  <div className="w-full md:w-16 h-16 flex-shrink-0 rounded-sm border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden ">
                    <S3Image src={item.productDetails?.images?.[0]} alt={item.productDetails?.name} className="w-full h-full object-contain product-image" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-md line-clamp-2">{item.productDetails?.name}</div>
                      {Array.isArray(item.additional) && item.additional.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                          {item.additional.map((attributeObj, index) => {
                            const key = Object.keys(attributeObj)[0];
                            const value = attributeObj[key];
                            return (
                              <span key={`${key}-${index}`}>
                                <span className="font-medium">{key}:</span>{' '}
                                <span className="font-semibold text-gray-700">{value}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <div className="text-xs  text-gray-700 mb-1">Shipping by <span className="font-semibold underline rounded-sm">Snapzo Partners</span></div>
                    </div>
                    <div className='flex items-center mt-2'>
                      <div className="flex items-center gap-1  flex-wrap">
                        <button onClick={() => handleQtyChange({item, quantity: item.quantity - 1})} className="border border-gray-300  w-5 h-5 flex items-center justify-center text-sm font-bold bg-white hover:bg-gray-100">-</button>
                        <span className="px-2 text-sm  font-medium border border-gray-200">{item.quantity}</span>
                        <button onClick={() => handleQtyChange({item, quantity: item.quantity + 1})} className="border border-gray-300  w-5 h-5 flex items-center justify-center text-sm font-bold bg-white hover:bg-gray-100">+</button>
                      </div>
                      <div className="flex">
                        <button onClick={() => handleRemove(item.id || item._id)} className="ml-4 text-red-500 hover:underline text-xs font-medium">Delete</button>
                        {isAuthenticated && (
                          <button onClick={() => handleSaveForLater(item.id || item._id)} className="ml-4 text-gray-500 hover:underline text-xs font-medium">Save later</button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end min-w-[100px] justify-between">
                    <div>
                      <span className="text-md font-bold text-gray-900">{formatIndianPrice((item.price || item.productDetails?.price || 0) * (item.quantity || 1))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Saved for Later Section */}
          </section>
          {savedForLaterItems.length > 0 && (
            <section className="flex-1 flex flex-col border border-gray-200 rounded-sm shadow-xs p-2 mb-2">
              <div className="mt-1">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Saved for Later</h2>
                <div className="flex flex-col gap-4">
                  {savedForLaterItems.map((item, idx) => (
                    <div key={item.sku || item.id || item._id} className="flex flex-col md:flex-row gap-4 md:gap-8 p-2 bg-gray-50 border-t border-gray-200">
                      <div className="w-full md:w-16 h-16 flex-shrink-0 rounded-sm border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden ">
                        <S3Image src={item.productDetails?.images?.[0]} alt={item.productDetails?.name} className="w-full h-full object-contain product-image" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 text-base md:text-md mb-1 line-clamp-2">{item.productDetails?.name}</div>
                          {Array.isArray(item.additional) && item.additional.length > 0 && (
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-1">
                              {item.additional.map((attributeObj, index) => {
                                const key = Object.keys(attributeObj)[0];
                                const value = attributeObj[key];
                                return (
                                  <span key={`${key}-${index}`}>
                                    <span className="font-medium">{key}:</span>{' '}
                                    <span className="font-semibold text-gray-700">{value}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          <div className="text-xs text-gray-700 mb-1">Shipping by <span className="font-semibold">g. assuerd</span></div>
                        </div>
                        <div className='flex items-center mt-2'>
                          <div className="flex">
                            <button onClick={() => handleRemove(item.id || item._id)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                            {isAuthenticated && (
                              <button onClick={() => handleMoveToCart(item.id || item._id)} className="ml-4 text-blue-500 hover:underline text-xs font-medium">Move to Cart</button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end min-w-[100px] justify-between">
                        <div>
                          <span className="text-md font-bold text-gray-900">{formatIndianPrice((item.price || item.productDetails?.price || 0) * (item.quantity || 1))}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Summary Sidebar */}
        <aside className="w-full md:w-[340px] flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm shadow-xs p-6 sticky top-24">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900">Price Details</h2>

            <div className="flex justify-between mb-2 text-sm">
              <span>Price ({cartSummary.totalItems} item{cartSummary.totalItems > 1 ? 's' : ''})</span>
              <span>{formatIndianPrice(cartSummary.subtotal)}</span>
            </div>

            {cartSummary.totalDiscount > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span>Discount</span>
                <span className="text-green-600">-{formatIndianPrice(cartSummary.totalDiscount)}</span>
              </div>
            )}

            {/* Platform fee */}
            {cartSummary.fees?.platform > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span>Platform fee</span>
                <span>{formatIndianPrice(cartSummary.fees.platform)}</span>
              </div>
            )}

            {/* Handling fee */}
            {cartSummary.fees?.handling > 0 && (
              <div className="flex justify-between mb-2 text-sm">
                <span>Handling fee</span>
                <span>{formatIndianPrice(cartSummary.fees.handling)}</span>
              </div>
            )}

            {/* Delivery */}
            <div className="flex justify-between mb-2 text-sm">
              <span>Delivery Charges</span>
              <span className={cartSummary.fees?.delivery === 0 ? 'text-green-600' : ''}>
                {cartSummary.fees?.delivery === 0 ? 'Free' : formatIndianPrice(cartSummary.fees?.delivery)}
              </span>
            </div>

            <div className="border-t my-3"></div>

            <div className="flex justify-between font-bold text-md mb-4">
              <span>Total Amount</span>
              <span>{formatIndianPrice(cartSummary.finalAmount)}</span>
            </div>

            <Link href={'checkout'}>
              <button 
              className={`w-full bg-[#004bad] hover:bg-[#004bad] text-white py-1 rounded-full font-semibold text-base shadow transition mt-2 ${cartSummary.totalItems === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
              disabled={cartSummary.totalItems === 0}
              >
                Place Order
              </button>
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
