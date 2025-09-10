import RecentViewProducts from "@/app/components/home/RecentViewProducts";

export default function OrdersDetail() {
  return (
    <main className="container mx-auto flex flex-col bg-white">
      <div className="w-full md:w-3/4 mx-auto my-6">
        {/* Order Card */}
        <div className="border border-gray-200 rounded-md shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-3 p-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              Ordered on <span className="font-medium">09-09-2025</span>
            </p>
            <p className="text-sm text-gray-600">
              Order number <span className="font-medium">#DE-20250909-1720008</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-gray-200">
            <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
              Write a product review
            </button>
            <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
              Get support
            </button>
            <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
              Submit seller rating
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 px-4 py-6 border-b border-gray-200 text-sm">
            {/* Address */}
            <div>
              <h3 className="font-semibold mb-2">Billing address</h3>
              <p className="text-gray-600">
                Kartik Maandothiya <br />
                123 MG Road, Jaipur, Rajasthan <br />
                +91 98280 51996
              </p>
              <h3 className="font-semibold mt-4 mb-2">Delivery address</h3>
              <p className="text-gray-600">
                Kartik Maandothiya <br />
                123 MG Road, Jaipur, Rajasthan <br />
                +91 98280 51996
              </p>
            </div>

            {/* Payment */}
            <div>
              <h3 className="font-semibold mb-2">Payment method</h3>
              <p className="text-gray-600">Bank transfer</p>
              <p className="font-semibold mt-3">Your estimated delivery date is:</p>
              <p className="text-gray-600">September 23, 2025</p>
            </div>

            {/* Order Overview */}
            <div>
              <h3 className="font-semibold mb-2">Order overview</h3>
              <div className="flex justify-between mb-1">
                <span>Subtotal of items:</span>
                <span>€9.08</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Shipment:</span>
                <span>€0.00</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Tax fee:</span>
                <span>€1.73</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Discount:</span>
                <span>€0.00</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>In total:</span>
                <span>€10.81</span>
              </div>
            </div>
          </div>

          {/* Product Item */}
          <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src="https://via.placeholder.com/50"
                alt="product"
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-medium">
                  High-performance Motul C2 Chain Lube Road - 400 ml
                </p>
                <p className="text-sm text-gray-600">€9.08 x 1</p>
              </div>
            </div>
            <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
              Write a product review
            </button>
          </div>

          {/* Bank Transfer Note */}
          <div className="px-4 py-6 text-sm">
            <p className="text-gray-700 mb-3">
              Please send the payment confirmation after successful transfer.
            </p>
            <p>
              <span className="font-semibold">Bank Name:</span> ABN Bank
            </p>
            <p>
              <span className="font-semibold">Account number:</span> 64687438468686
            </p>
            <p>
              <span className="font-semibold">Bank address:</span> Test address here
            </p>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products */}
      <RecentViewProducts />
    </main>
  );
}
