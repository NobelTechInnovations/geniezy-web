export default function CheckoutPage() {
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
                <div className="ml-5 mt-1 text-sm text-gray-600">
                  <span className="mr-5">Nickname</span>
                  <span>Shalini Panwar</span>
                  <p className="mt-1 text-xs text-gray-600">EMI available</p>
                </div>
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

          {/* Section: Review items and shipping */}
          <div className="mt-3 pb-5 border-b border-gray-300">
            <h3 className="mb-2 text-lg font-bold">Review items and shipping</h3>
            {/* ... Placeholder for item details ... */}
            <p className="text-sm text-gray-600">Item details will go here.</p>
          </div>

          {/* Optional: Back to cart and Return Policy links */}
           <div className="mt-5 text-sm text-gray-600">
             <p className="mb-1">Need help? Check our <a href="#" className="text-blue-700 hover:underline">help pages</a> or <a href="#" className="text-blue-700 hover:underline">contact us 24x7</a></p>
             <p className="mb-1">When your order is placed, we'll send you an e-mail message acknowledging receipt of your order. If you choose to pay using an electronic payment method (credit card, debit card or net banking), you will be directed to your bank's website to complete your payment. Your contract to purchase an item will not be complete until we receive your item. If you choose to pay using Pay on Delivery (POD), you can pay using cash/card/net banking when you receive your item.</p>
             <p className="mt-2">See Amazon.in's <a href="#" className="text-blue-700 hover:underline">Return Policy</a>.</p>
             <p className="mt-2"><a href="#" className="text-blue-700 hover:underline">Back to cart</a></p>
           </div>

            </div>

            <div className="w-1/3 border border-gray-200 p-4 bg-gray-50">

                <h3 className="text-lg font-bold mb-3">Order Summary</h3>

                <button className="w-full py-2.5 bg-yellow-400 border border-yellow-500 rounded text-sm font-semibold cursor-pointer hover:bg-yellow-500 shadow">
                    Use this payment method
                </button>
            </div>

        </>
    );
}