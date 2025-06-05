'use client';

import { formatIndianPrice } from "../shared/utils/priceFormat";
import { useEffect, useState } from "react";
import api from "../redux/services/apiService";
import { useRouter } from "next/navigation";
import S3Image from "../shared/utils/S3Image";

export default function CheckoutPage() {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCheckoutData = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('geniezy_token');
                
                if (!token) {
                    // Redirect to login if no token
                    router.push('/login');
                    return;
                }

                const response = await api.get('/v1/shop/cart/checkout', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setCartData(response.data.data);
                } else {
                    setError('Failed to fetch checkout data');
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    // Handle unauthorized error
                    router.push('/login');
                } else {
                    setError(err.message || 'Failed to fetch checkout data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutData();
    }, [router]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
    }

    return(
        <>
        <div className="flex-grow-2 w-4/5">
          {/* Add the content for the left column here */}

          {/* Section: Delivering to... */}
          <div className="mb-5 pb-4 border-b bg-white p-4 border border-gray-200">
             <h3 className="mb-2 text-lg font-bold">Delivering to kartik</h3>
             <p className="text-sm text-gray-600 mb-1">B 122, Ganga path B block, Vaishali Nagar, Jaipur, RAJASTHAN, 302021, India</p>
             <a href="#" className="text-sm text-blue-700 hover:underline">Change Delivery Address</a>
          </div>

          {/* Section: Payment method */}
          <div className="mb-5 border-b bg-white p-4 border border-gray-200">
            <h3 className="mb-4 text-lg font-bold">Payment method</h3>

            <div className="border border-gray-200 p-4 mb-4">
            {/* CREDIT & DEBIT CARDS */}
            <div className="mb-5 pb-5 border-b border-gray-300">
              <h4 className="mb-3 text-base font-bold">CREDIT & DEBIT CARDS</h4>
              {/* IndusInd Bank Card */}
              <div className="mb-4">
                <input type="radio" id="indusind" name="paymentMethod" value="indusind" className="align-middle" />
                <label htmlFor="indusind" className="ml-1 text-sm align-middle">IndusInd Bank Credit Card ending in 5702</label>
                <img src="/visa-logo.png" alt="Visa" className="h-3.5 inline-block align-middle ml-1" />
              </div>
            </div>

            {/* Another payment method */}
            <div className="mb-5">
              <h4 className="mb-3 text-base font-bold">Another payment method</h4>
              <div className="mb-3">
                <input type="radio" id="creditDebit" name="paymentMethod" value="creditDebit" className="align-middle" />
                <label htmlFor="creditDebit" className="ml-1 text-sm align-middle">Credit or debit card</label>
                 <img className="h-15 inline-block align-middle ml-2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtwhmsmpbA3Jo1K55nsOJ-nE8IiDnm0lIyOVVeDg90hxzlYR3-IldsED941duJk1dUGA&usqp=CAU" alt="Visa" />
              </div>

              {/* Net Banking */}
              <div className="mb-3">
                 <input type="radio" id="netBanking" name="paymentMethod" value="netBanking" className="align-middle" />
                 <label htmlFor="netBanking" style={{ marginLeft: '5px', fontSize: '14px', verticalAlign: 'middle' }}>Net Banking</label>
                 <select className="ml-2 px-2 py-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-300">
                   <option>Choose an Option</option>
                 </select>
              </div>

              {/* Other UPI Apps */}
              <div className="mb-3 p-4 border border-gray-300 bg-gray-50">
                 <input type="radio" id="upi" name="paymentMethod" value="upi" checked className="align-top" />
                 <label htmlFor="upi" className="ml-1 text-sm align-top">Other UPI Apps</label>
                 <p className="text-sm text-gray-600 mt-2 mb-1 ml-5">Please enter your UPI ID</p>
                 <input type="text" placeholder="Enter UPI ID" className="p-2 mr-2 border border-gray-300 rounded text-sm outline-none focus:ring-2 focus:ring-blue-300 ml-5" />
                 <button className="px-3 py-2 bg-gray-200 border border-gray-400 rounded text-sm cursor-pointer hover:bg-gray-300 shadow-sm">Verify</button>
                 <p className="text-xs text-gray-600 mt-1 ml-5">The UPI ID is in the format of name/phone number@bankname</p>
              </div>

              {/* EMI radio */}
              <div className="mb-3">
                <input type="radio" id="emi" name="paymentMethod" value="emi" className="align-middle" />
                <label htmlFor="emi" className="ml-1 text-sm align-middle">EMI</label>
              </div>

              {/* Cash on Delivery radio */}
              <div>
                <input type="radio" id="cod" name="paymentMethod" value="cod" disabled className="align-middle" />
                <label htmlFor="cod" className="ml-1 text-sm text-gray-500 align-middle">Cash on Delivery/Pay on Delivery</label>
                <span className="ml-2 text-xs text-gray-500">(Unavailable for this payment)</span>
              </div>
            </div>
            </div>
          </div>

          {/* Section: Arriving... (Product Review) */}
          <div className="mb-5 border-b bg-white p-4 border border-gray-200">
            <h3 className="mb-4 text-lg font-bold">Arriving Today</h3>
            {/* <p className="text-sm text-gray-600 mb-4">If you order in the next 2 hours and 7 minutes</p> */}

            {cartData?.items?.map((item, index) => (
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
            <button className="w-1/3 flex-grow mr-4 py-1 bg-red-600 border border-red-700 rounded-full text-sm font-semibold cursor-pointer hover:bg-red-700 text-white">
              Place your order
            </button>
            <div className="w-2/3 text-xs text-gray-700">
              <p>Order Total: <span className="font-bold text-lg">{formatIndianPrice(cartData?.cart?.finalAmount || 0)}</span></p>
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
            <button className="w-full py-1 bg-red-600 text-white border border-red-700 rounded-full text-sm font-semibold cursor-pointer hover:bg-red-700 shadow">
                Place Order
            </button>
            <p className="text-xs mt-2">By placing your order, you agree to Geniezy's privacy notice and conditions of use.</p>

            <h3 className="text-lg font-bold mb-3 mt-3">Order Summary</h3>
            <div className="text-sm text-gray-700 mb-4">
                <div className="flex justify-between mb-1">
                    <span>Items ({cartData?.cart?.totalItems || 0}):</span>
                    <span>{formatIndianPrice(cartData?.cart?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span>Delivery:</span>
                    <span>{formatIndianPrice(0)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                    <span>Order Total:</span>
                    <span>{formatIndianPrice(cartData?.cart?.finalAmount || 0)}</span>
                </div>
            </div>
        </div>
        </>
    );
}