'use client';

import { formatIndianPrice } from "../shared/utils/priceFormat";
import { useContext, useState } from "react";
import S3Image from "../shared/utils/S3Image";
import { CheckoutContext } from "./layout";
import { useRouter } from 'next/navigation';
import api from "@/app/redux/services/apiService";

export default function CheckoutPage() {
    const { checkoutData, addressData, setAddressData } = useContext(CheckoutContext);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(
        addressData?.addresses?.find(addr => addr.isDefault) || addressData?.addresses?.[0]
    );
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [showNewUPIInput, setShowNewUPIInput] = useState(false);
    const [newUPIId, setNewUPIId] = useState('');
    const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '' });
    const router = useRouter();

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(false);
    };

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        setShowNewUPIInput(false);
        setNewUPIId('');
    };

    const handleNewUPISubmit = () => {
        // Here you would typically make an API call to save the new UPI ID
        console.log('New UPI ID:', newUPIId);
        setShowNewUPIInput(false);
        setNewUPIId('');
    };

    // Get saved payment methods by type
    const savedUPIs = addressData?.paymentMethods?.filter(method => method.methodType === 'upi') || [];
    const savedCards = addressData?.paymentMethods?.filter(method => method.methodType === 'card') || [];
    const savedBanks = addressData?.paymentMethods?.filter(method => method.methodType === 'bank') || [];

    // List of popular banks for net banking (from API or static)
    const popularBanks = [
        { name: 'HDFC Bank', code: 'HDFC' },
        { name: 'ICICI Bank', code: 'ICIC' },
        { name: 'State Bank of India', code: 'SBIN' },
        { name: 'Axis Bank', code: 'UTIB' },
        { name: 'Kotak Mahindra Bank', code: 'KKBK' }
    ];
    const [selectedNetBank, setSelectedNetBank] = useState('');

    // Helper for radio selection
    const isSelected = (type, id = null) => {
        if (selectedPaymentMethod?.type !== type) return false;
        if (id && selectedPaymentMethod?.id !== id) return false;
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }
        if (!selectedAddress) {
            alert('Please select a delivery address');
            return;
        }
        // For testing, skip API and redirect immediately
        router.push('/order-success');
    };

    return (
        <>
            <div className="flex-grow-2 w-4/5">
                {/* Section: Delivering to... */}
                <div className="mb-5 pb-4 border-b bg-white p-4 border border-gray-200">
                    <h3 className="mb-2 text-lg font-bold">Delivering to {addressData?.name}, <span className="text-gray-500 text-sm">{addressData?.phone}</span></h3>
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
                    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
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
                                        <p style={{fontSize: '10px'}} className="bg-gray-100 border border-gray-200 inline-block text-dark px-2 py-0.5 rounded-md mb-2">{address.addressType}</p>
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

                {/* Section: Payment method */}
                <div className="mb-5 border-b bg-white p-4 border border-gray-200">
                    <h3 className="mb-4 text-lg font-bold">Payment method</h3>
                    <div className="border border-gray-200 p-4 mb-4">
                        {/* CREDIT & DEBIT CARDS */}
                        <div className="mb-5 pb-5 border-b border-gray-300">
                            <h4 className="mb-3 text-base font-bold">CREDIT & DEBIT CARDS</h4>
                            {savedCards.map((card) => (
                                <div key={card._id} className="mb-4 flex items-center bg-orange-50 border border-orange-200 rounded p-2">
                                    <input
                                        type="radio"
                                        id={`card_${card._id}`}
                                        name="paymentMethod"
                                        checked={isSelected('card', card._id)}
                                        onChange={() => handlePaymentMethodSelect({ type: 'card', id: card._id })}
                                        className="align-middle mr-2"
                                    />
                                    <label htmlFor={`card_${card._id}`} className="text-sm font-semibold align-middle flex-1">
                                        {card.details?.bankName || 'Card'} ending in {card.details?.cardNumber?.slice(-4)}
                                        <img src="/visa-logo.png" alt="Visa" className="h-4 inline-block align-middle ml-2" />
                                    </label>
                                </div>
                            ))}
                            <div className="mb-4 flex items-center">
                                <input
                                    type="radio"
                                    id="newCard"
                                    name="paymentMethod"
                                    checked={isSelected('newCard')}
                                    onChange={() => handlePaymentMethodSelect({ type: 'newCard' })}
                                    className="align-middle mr-2"
                                />
                                <label htmlFor="newCard" className="text-sm align-middle">Add a new card</label>
                            </div>
                            {/* Show card input fields if 'Add a new card' is selected */}
                            {isSelected('newCard') && (
                                <div className="ml-6 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        value={newCard.number}
                                        onChange={e => setNewCard({ ...newCard, number: e.target.value })}
                                        className="p-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={newCard.expiry}
                                        onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                                        className="p-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <input
                                        type="password"
                                        placeholder="CVV"
                                        value={newCard.cvv}
                                        onChange={e => setNewCard({ ...newCard, cvv: e.target.value })}
                                        className="p-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                </div>
                            )}
                        </div>
                        {/* Net Banking */}
                        <div className="mb-5 pb-5 border-b border-gray-300">
                            <h4 className="mb-3 text-base font-bold">Net Banking</h4>
                            <div className="mb-3 flex items-center">
                                <input
                                    type="radio"
                                    id="netBanking"
                                    name="paymentMethod"
                                    checked={isSelected('netBanking')}
                                    onChange={() => handlePaymentMethodSelect({ type: 'netBanking' })}
                                    className="align-middle mr-2"
                                />
                                <label htmlFor="netBanking" className="text-sm align-middle flex-1">Net Banking</label>
                                <select
                                    className="ml-2 px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                    value={selectedNetBank}
                                    onChange={e => setSelectedNetBank(e.target.value)}
                                    disabled={!isSelected('netBanking')}
                                >
                                    <option value="">Choose an Option</option>
                                    {/* Show saved banks from API first, then popular banks */}
                                    {savedBanks.map(bank => (
                                        <option key={bank._id} value={bank.details?.bankName}>{bank.details?.bankName} (A/C {bank.details?.accountNumber?.slice(-4)})</option>
                                    ))}
                                    {popularBanks.map(bank => (
                                        <option key={bank.code} value={bank.name}>{bank.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* UPI Section */}
                        <div className="mb-5 pb-5 border-b border-gray-300">
                            <h4 className="mb-3 text-base font-bold">UPI</h4>
                            {/* List saved UPI IDs as radios */}
                            {savedUPIs.map((upi) => (
                                <div key={upi._id} className="mb-2 flex items-center">
                                    <input
                                        type="radio"
                                        id={`upi_${upi._id}`}
                                        name="paymentMethod"
                                        checked={isSelected('upi', upi._id)}
                                        onChange={() => handlePaymentMethodSelect({ type: 'upi', id: upi._id })}
                                        className="align-middle mr-2"
                                    />
                                    <label htmlFor={`upi_${upi._id}`} className="text-xs align-middle">{upi.details?.upiId}</label>
                                </div>
                            ))}
                            {/* Add new UPI ID radio */}
                            <div className="mb-2 flex items-center">
                                <input
                                    type="radio"
                                    id="addNewUpi"
                                    name="paymentMethod"
                                    checked={isSelected('upi', 'new')}
                                    onChange={() => handlePaymentMethodSelect({ type: 'upi', id: 'new' })}
                                    className="align-middle mr-2"
                                />
                                <label htmlFor="addNewUpi" className="text-xs align-middle">Add new UPI ID</label>
                            </div>
                            {/* Show input if 'Add new UPI ID' is selected */}
                            {isSelected('upi', 'new') && (
                                <div className="ml-6 mt-2">
                                    <input
                                        type="text"
                                        value={newUPIId}
                                        onChange={e => setNewUPIId(e.target.value)}
                                        placeholder="Enter UPI ID"
                                        className="p-2 mr-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-300"
                                    />
                                    <button
                                        onClick={handleNewUPISubmit}
                                        className="px-3 py-2 bg-gray-200 border border-gray-400 rounded text-sm cursor-pointer hover:bg-gray-300 shadow-sm"
                                    >
                                        Verify
                                    </button>
                                    <p className="text-xs text-gray-600 mt-1">The UPI ID is in the format of name/phone number@bankname</p>
                                </div>
                            )}
                        </div>
                        {/* EMI Unavailable */}
                        <div className="mb-3 flex items-center">
                            <input type="radio" id="emi" name="paymentMethod" disabled className="align-middle mr-2" />
                            <label htmlFor="emi" className="text-sm text-gray-400 align-middle flex-1">EMI Unavailable <span className="text-blue-600 cursor-pointer ml-1">Why?</span></label>
                        </div>
                        {/* Cash on Delivery */}
                        <div className="mb-3 flex items-center">
                            <input type="radio" id="cod" name="paymentMethod" checked={isSelected('cod')} onChange={() => handlePaymentMethodSelect({ type: 'cod' })} className="align-middle mr-2" />
                            <label htmlFor="cod" className="text-sm align-middle flex-1">Cash on Delivery/Pay on Delivery <span className="text-xs text-gray-500">Cash, UPI and Cards accepted. <span className="text-blue-600 cursor-pointer">Know more.</span></span></label>
                        </div>
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

                            {/* Product Details and Shipping Options */}
                            <div className="w-3/5 bg-gray-100 rounded flex-1 gap-2 p-2">
                                {/* Product Name and Deal */}
                                <h4 className="text-sm font-semibold mb-1">{item.productDetails.title}</h4>
                                <p className="text-sm mb-1">{formatIndianPrice(item.price)}</p>
                                <p className="text-xs text-gray-600 mb-1">Ships from Geniezy 
                                    <span className="bg-blue-700 text-white text-xs font-semibold px-1 py-0.5 rounded ml-2">G. assured</span>
                                </p>
                                <p className="text-xs text-gray-600 mb-3">Sold by <a href="#" className="text-blue-700 hover:underline">{item.productDetails.seller.business_name}</a></p>
                            </div>

                            {/* Shipping Options */}
                            <div className="w-2/5">
                                <div className="mb-3">
                                    <h5 className="text-sm font-bold mb-2">Choose your shipping options:</h5>
                                    {/* Option 1 */}
                                    <div className="mb-1 text-xs">
                                        <input type="radio" id={`shippingOption1_${index}`} name={`shippingMethod_${index}`} value="option1" className="align-middle" />
                                        <label htmlFor={`shippingOption1_${index}`} className="ml-1 align-middle font-semibold">Today (Instant Delivery)</label>
                                        <span className="ml-2">{formatIndianPrice(50)} Delivery</span>
                                    </div>
                                    {/* Option 2 */}
                                    <div className="mb-1 text-xs">
                                        <input type="radio" id={`shippingOption2_${index}`} name={`shippingMethod_${index}`} value="option2" className="align-middle" />
                                        <label htmlFor={`shippingOption2_${index}`} className="ml-1 align-middle font-semibold">Today 2pm - 4pm</label>
                                        <span className="ml-2">{formatIndianPrice(30)} Same-Day Delivery at Rs. 30 per order. FREE with Prime</span>
                                    </div>
                                    {/* Option 3 */}
                                    <div className="mb-1 text-xs">
                                        <input type="radio" id={`shippingOption3_${index}`} name={`shippingMethod_${index}`} value="option3" checked className="align-middle" />
                                        <label htmlFor={`shippingOption3_${index}`} className="ml-1 align-middle font-semibold">Today, 2pm - 8pm</label>
                                        <span className="ml-2">{formatIndianPrice(25)} Same-Day Delivery at Rs. 25 per order. FREE with Prime</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Place your order button section at the bottom */}
                <div className="mt-2 mb-6 p-4 bg-white border border-gray-200 flex items-center justify-between">
                    <button className="w-1/3 flex-grow mr-4 py-1 bg-red-600 border border-red-700 rounded-full text-sm font-semibold cursor-pointer hover:bg-red-700 text-white"
                        onClick={handlePlaceOrder}
                        disabled={!selectedPaymentMethod}>
                        Place your order
                    </button>
                    <div className="w-2/3 text-xs text-gray-700">
                        <p>Order Total: <span className="font-bold text-lg">{formatIndianPrice(checkoutData?.cart?.finalAmount || 0)}</span></p>
                        <p>By placing your order, you agree to Geniezy's <a href="#" className="text-blue-700 hover:underline">privacy notice</a> and <a href="#" className="text-blue-700 hover:underline">conditions of use</a>.</p>
                    </div>
                </div>

                {/* Optional: Back to cart and Return Policy links */}
                <div className="mt-5 text-sm text-gray-600">
                    <p className="mb-1">Need help? Check our <a href="#" className="text-blue-700 hover:underline">help pages</a> or <a href="#" className="text-blue-700 hover:underline">contact us 24x7</a></p>
                    <p className="mb-1">When your order is placed, we'll send you an e-mail message acknowledging receipt of your order. If you choose to pay using an electronic payment method (credit card, debit card or net banking), you will be directed to your bank's website to complete your payment. Your contract to purchase an item will not be complete until we receive your item. If you choose to pay using Pay on Delivery (POD), you can pay using cash/card/net banking when you receive your item.</p>
                    <p className="mt-2">See Geniezy.in's <a href="#" className="text-blue-700 hover:underline">Return Policy</a>.</p>
                </div>
            </div>

            <div className="w-1/3 border border-gray-200 p-4 bg-gray-50 sticky top-4">
                <button className="w-full py-1 bg-red-600 text-white border border-red-700 rounded-full text-sm font-semibold cursor-pointer hover:bg-red-700 shadow"
                    onClick={handlePlaceOrder}
                    disabled={!selectedPaymentMethod}>
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