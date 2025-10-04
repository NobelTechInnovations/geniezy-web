'use client';

import { formatIndianPrice } from "../shared/utils/priceFormat";
import { useContext, useState } from "react";
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
    const router = useRouter();

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(false);
    };

  // Step 1: Initiate PhonePe Payment
    const initiatePayment = async () => {
        try {
        const payload = {
            redirectUrl: `${window.location.origin}/checkout`, // Your callback URL
        };
        const paymentInitResponse = await OrderService.paymentInit(payload);

        console.log(paymentInitResponse);

            if (paymentInitResponse.success && paymentInitResponse.redirectUrl) {
                window.location.href = paymentInitResponse.redirectUrl; // Redirect to PhonePe
            } else {
                alert(`Payment initiation failed: ${paymentInitResponse.error || "Unknown error"}`);
            }
        } catch (err) {
            console.error("Payment initiation error:", err);
        }
    };


    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        initiatePayment();
        return false;

        try {
            const response = await OrderService.orderPlace(selectedAddress);
            if (response?.success) {
                router.push('/order-success');
            } else {
                console.log(response?.message || 'Order placement failed');
                alert("Something went wrong while placing the order");
            }
        } catch (error) {
            console.error("Order error:", error);
            alert("Something went wrong while placing the order");
        }
    };


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
                    {checkoutData?.items?.map((item, index) => (
                        <div key={index} className="flex gap-2 mb-4">
                            {/* Product Image */}
                            <div className="w-1/8">
                                <S3Image src={item.productDetails.thumbnail} alt={item.productDetails.title} className="w-full h-auto" />
                            </div>

                            {/* Product Details */}
                            <div className="w-3/5 bg-gray-50 rounded flex-1 gap-2 p-2">
                                <h4 className="text-sm font-semibold mb-1">{item.productDetails.title}</h4>
                                <p className="text-sm mb-1">{formatIndianPrice(item.price)}</p>
                                <p className="text-xs text-gray-600 mb-1">
                                    Ships via snapzo partners 
                                </p>
                                <p className="text-xs text-gray-600 mb-3">
                                    Sold by <a href="#" className="text-blue-700 hover:underline">{item.productDetails.seller.business_name}</a>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Place your order button section */}
                {/* <div className="mt-2 mb-6 p-4 bg-white border border-gray-200 flex items-center justify-between">
                    <button 
                        className="w-1/3 flex-grow mr-4 py-1 bg-[#004bad] border rounded-full font-semibold text-base cursor-pointer hover:bg-[#003a8c] text-white"
                        onClick={handlePlaceOrder}
                    >
                        Place your order
                    </button>
                    <div className="w-2/3 text-xs text-gray-700">
                        <p>Order Total: <span className="font-bold text-lg">{formatIndianPrice(checkoutData?.cart?.finalAmount || 0)}</span></p>
                        <p>
                            By placing your order, you agree to Geniezy's 
                            <a href="#" className="text-blue-700 hover:underline"> privacy notice</a> and 
                            <a href="#" className="text-blue-700 hover:underline"> conditions of use</a>.
                        </p>
                    </div>
                </div> */}
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-1/3 border border-gray-200 p-4 bg-gray-50 sticky top-4">
                <button 
                    className="w-full py-1 bg-[#004bad] text-white border rounded-full font-semibold text-base cursor-pointer hover:bg-[#003a8c] shadow"
                    onClick={handlePlaceOrder}
                >
                    Place Order
                </button>
                <p className="text-xs mt-2">By placing your order, you agree to Geniezy's privacy notice and conditions of use.</p>

                <h3 className="text-lg font-bold mb-3 mt-3">Order Summary</h3>
                <div className="text-sm text-gray-700 mb-4">
                    <div className="flex justify-between mb-1">
                        <span>Items ({checkoutData?.cart?.totalItems || 0}):</span>
                        <span>{formatIndianPrice(checkoutData?.cart?.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Delivery:</span>
                        <span>{formatIndianPrice(0)}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2">
                        <span>Order Total:</span>
                        <span>{formatIndianPrice(checkoutData?.cart?.finalAmount || 0)}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
