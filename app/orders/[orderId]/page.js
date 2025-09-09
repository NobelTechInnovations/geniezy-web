import RecentViewProducts from "@/app/components/home/RecentViewProducts";

export default function OrdersDetail() {
    return (
        <main className="container mx-auto flex flex-col bg-white">
        <div className="w-full md:w-2/3 mx-auto my-6">
          {/* Order Card */}
          <div className="border border-gray-200 rounded-xl shadow-sm p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Order #12345</h2>
              <span className="bg-yellow-100 text-yellow-700 px-3 text-xs py-1 rounded-full">
                Pending
              </span>
            </div>
  
            <p className="text-gray-500 text-sm mb-4">
              Placed on: <span className="font-medium">10 Sept 2025</span>
            </p>
  
            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Wireless Earbuds</p>
                  <p className="text-sm text-gray-500">Qty: 1</p>
                </div>
                <p className="font-semibold">₹1,499</p>
              </div>
  
              <div className="flex justify-between border-b pb-3">
                <div>
                  <p className="font-medium">Phone Case</p>
                  <p className="text-sm text-gray-500">Qty: 2</p>
                </div>
                <p className="font-semibold">₹799</p>
              </div>
            </div>
  
            {/* Summary */}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>₹2,298</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shipping</span>
                <span>₹50</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹2,348</span>
              </div>
            </div>
  
            {/* Customer Info */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                Kartik Maandothiya <br />
                123 MG Road, Jaipur, Rajasthan <br />
                +91 98280 51996
              </p>
            </div>
  
            {/* CTA */}
            <div className="mt-6 flex gap-3">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Track Order
              </button>
              <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200">
                Download Invoice
              </button>
            </div>
          </div>
        </div>

        <RecentViewProducts />

      </main>
    );
  }
  