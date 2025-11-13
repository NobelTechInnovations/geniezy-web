"use client";

import { formatIndianPrice } from "../shared/utils/priceFormat";
import { useContext, useState, useMemo } from "react";
import S3Image from "../shared/utils/S3Image";
import { CheckoutContext } from "./layout";
import { useRouter } from 'next/navigation';
import { OrderService } from "../services/cart/orderPlaceService";

export default function CheckoutPage() {
  const { checkoutData, addressData } = useContext(CheckoutContext);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    addressData?.addresses?.find(addr => addr.isDefault) || addressData?.addresses?.[0]
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({ type: 'phonepe' }); // default PhonePe
  const [placingOrder, setPlacingOrder] = useState(false);
  const router = useRouter();

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  // Normalize checkout data shape to support both older and newer payloads
  const normalized = useMemo(() => {
    // if checkoutData already in new shape: { cart: { ... }, items: [...] }
    if (!checkoutData) return { cart: null, items: [] };

    // support different wrappers: checkoutData.data or direct checkoutData
    const data = checkoutData.data ? checkoutData.data : checkoutData;

    const cart = data.cart ?? data.cartDetails ?? null;
    const items = Array.isArray(data.items) ? data.items :
                  Array.isArray(data.cartItems) ? data.cartItems : [];

    return { cart, items };
  }, [checkoutData]);

  // Step 1: Initiate PhonePe Payment
  const initiatePayment = async () => {
    try {
      const payload = {
        redirectUrl: `${window.location.origin}/checkout`, // Your callback URL
      };
      setPlacingOrder(true);
      const paymentInitResponse = await OrderService.paymentInit(payload);

      if (paymentInitResponse.success && paymentInitResponse.redirectUrl) {
        // redirect to PhonePe
        window.location.href = paymentInitResponse.redirectUrl;
        return true;
      } else {
        console.warn("Payment initiation failed", paymentInitResponse);
        return false;
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      return false;
    } finally {
      // Note: if redirect happens, this code will not run; else stop spinner after a small delay
      if (!window.location.href.includes('phonepe')) {
        setPlacingOrder(false);
      }
    }
  };

  // Final place order handler (will call phonepe or fallback to orderPlace)
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    // Use PhonePe flow
    setPlacingOrder(true);
    const initiated = await initiatePayment();
    if (initiated) return; // redirected away

    // If payment initiation didn't redirect, fall back to orderPlace (optional)
    try {
      const response = await OrderService.orderPlace(selectedAddress);

      //todo implimmet here after paymennt

      if (response?.success) {
        router.push('/order-success');
      } else {
        console.log(response?.message || 'Order placement failed');
        alert("Something went wrong while placing the order");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong while placing the order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // UI helpers
  const items = normalized.items || [];
  const cart = normalized.cart || {};

  return (
    <>
      <div className="flex-grow-2 w-4/5">
        {/* Section: Delivering to... */}
        <div className="mb-5 pb-4 border-b bg-white p-4 border border-gray-200">
          <h3 className="mb-2 text-lg font-bold">
            Delivering to {addressData?.name},{" "}
            <span className="text-gray-500 text-sm">{addressData?.phone}</span>
          </h3>
          {selectedAddress && (
            <p className="text-sm text-gray-600 mb-1">
              {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.pincode}, {selectedAddress.country}
            </p>
          )}
          <button
            onClick={() => setShowAddressModal(true)}
            className="text-sm text-blue-700 hover:underline"
          >
            Change Delivery Address
          </button>
        </div>

        {/* Address Selection Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/3 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Select Delivery Address</h3>
              <div className="space-y-4">
                {addressData?.addresses?.map((address) => (
                  <div
                    key={address._id}
                    className={`py-2 px-4 border rounded-lg cursor-pointer hover:border-blue-500 ${
                      selectedAddress?._id === address._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <p style={{fontSize: '10px'}} className="bg-gray-100 border border-gray-200 inline-block text-dark px-2 py-0.5 rounded-md mb-2">
                      {address.addressType}
                    </p>
                    <p className="text-xs text-gray-600">
                      {address.address}, {address.city}, {address.state}, {address.pincode}, {address.country}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="px-2 border border-gray-300 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section: Payment method (simplified) */}
        <div className="mb-5 border-b bg-white p-4 border border-gray-200">
          <h3 className="mb-4 text-lg font-bold">Payment method</h3>
          <div className="flex items-center p-2 border border-gray-300 rounded bg-blue-50">
            <input
              type="radio"
              id="phonepe"
              name="paymentMethod"
              checked
              readOnly
              className="mr-2"
            />
            <label htmlFor="phonepe" className="text-sm font-semibold">
              Pay with PhonePe PG
            </label>
            <img
              src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png"
              alt="PhonePe"
              className="h-12 ml-2"
            />
          </div>
        </div>

        {/* Section: Arriving... (Product Review) */}
        <div className="mb-5 border-b bg-white p-4 border border-gray-200">
          <h3 className="mb-4 text-lg font-bold">Arriving Today</h3>

          {items.length === 0 && (
            <div className="text-sm text-gray-600">No items in the cart</div>
          )}

          {items.map((item, index) => {
            // item shape from your payload:
            // {
            //   quantity, price, total, type, sku, additional, productDetails: { title, thumbnail, seller, ... }
            // }
            const product = item.productDetails || {};
            const thumbnail = product.thumbnail || product.image || product.images?.[0] || '';
            const title = product.title || product.product_name || product.name || 'Product';

            return (
              <div key={index} className="flex gap-2 mb-4 items-start">
                {/* Product Image */}
                <div className="w-20 flex-shrink-0">
                  <S3Image src={thumbnail} alt={title} className="w-full h-auto object-contain" />
                </div>

                {/* Product Details */}
                <div className="flex-1 bg-gray-50 rounded p-2">
                  <h4 className="text-sm font-semibold mb-1">{title}</h4>
                  <p className="text-sm mb-1">{formatIndianPrice(item.price ?? product.price ?? 0)}</p>
                  <p className="text-xs text-gray-600 mb-1">Qty: {item.quantity ?? 1}</p>
                  <p className="text-xs text-gray-600 mb-1">Ships via snapzo partners</p>
                  <p className="text-xs text-gray-600 mb-3">
                    Sold by <a href="#" className="text-blue-700 hover:underline">{product?.seller?.business_name || product?.seller?.businessName || 'Seller'}</a>
                  </p>
                </div>

                {/* Item total */}
                <div className="w-32 text-right">
                  <div className="text-sm font-semibold">{formatIndianPrice(item.total ?? (item.price * (item.quantity ?? 1)))}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Place your order button section - removed old commented block */}
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-1/3 border border-gray-200 p-4 bg-gray-50 sticky top-4">
        <button
          className={`w-full py-1 bg-[#004bad] text-white border rounded-full font-semibold text-base cursor-pointer hover:bg-[#003a8c] shadow flex items-center justify-center ${placingOrder ? 'opacity-70 cursor-wait' : ''}`}
          onClick={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
        <p className="text-xs mt-2">By placing your order, you agree to Geniezy's privacy notice and conditions of use.</p>

        <h3 className="text-lg font-bold mb-3 mt-3">Order Summary</h3>
        <div className="text-sm text-gray-700 mb-4">
          <div className="flex justify-between mb-1">
            <span>Items ({cart?.total_items ?? cart?.totalItems ?? items.length}):</span>
            <span>{formatIndianPrice(cart?.cart_subtotal ?? cart?.subtotal ?? 0)}</span>
          </div>

          {/* show fees if present */}
          { (cart?.platform_fee_amount || cart?.handling_fee_amount) && (
            <>
              {cart?.platform_fee_amount ? (
                <div className="flex justify-between mb-1">
                  <span>Platform fee:</span>
                  <span>{formatIndianPrice(cart.platform_fee_amount)}</span>
                </div>
              ) : null}
              {cart?.handling_fee_amount ? (
                <div className="flex justify-between mb-1">
                  <span>Handling fee:</span>
                  <span>{formatIndianPrice(cart.handling_fee_amount)}</span>
                </div>
              ) : null}
            </>
          )}

          <div className="flex justify-between mb-1">
            <span>Delivery:</span>
            <span>{cart?.delivery_fee_amount ? formatIndianPrice(cart.delivery_fee_amount) : 'Free'}</span>
          </div>

          <div className="flex justify-between font-bold mt-2">
            <span>Order Total:</span>
            <span>{formatIndianPrice(cart?.cart_final_amount + cart?.platform_fee_amount + cart?.handling_fee_amount + cart?.delivery_fee_amount)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
