import Link from "next/link";
import { FiChevronLeft, FiCheckCircle, FiPackage, FiMapPin, FiCreditCard } from "react-icons/fi";
import RecentViewProducts from "@/app/components/home/RecentViewProducts";
import Image from "next/image";

// Placeholder — replace with real API fetch using params.orderId
const MOCK_ORDER = {
  id: "DE-20250910-1720008",
  date: "10 September 2025",
  estimatedDelivery: "15 September 2025",
  status: "Packed",
  statusSteps: [
    { label: "Order Placed", done: true },
    { label: "Confirmed", done: true },
    { label: "Packed", done: true },
    { label: "Out for Delivery", done: false },
    { label: "Delivered", done: false },
  ],
  items: [
    { name: "Wireless Earbuds — Black", sku: "WE-BLK-001", price: 1499, qty: 1 },
  ],
  address: {
    name: "Kartik Maandothiya",
    line1: "123 MG Road, Vaishali Nagar",
    city: "Jaipur, Rajasthan — 302021",
    phone: "+91 98280 51996",
  },
  payment: "PhonePe UPI",
  subtotal: 1499,
  shipping: 0,
  tax: 74,
  discount: 0,
};

export default function OrderDetailPage({ params }) {
  const order = MOCK_ORDER; // swap for real fetch when API ready

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        {/* Back link */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-sm text-[#004bad] mb-5 hover:underline"
        >
          <FiChevronLeft /> Back to Orders
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">
                Order number
              </p>
              <p className="font-bold text-gray-900">#{order.id}</p>
            </div>
            <div className="text-sm text-gray-500">
              Placed on <span className="font-medium text-gray-700">{order.date}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 px-6 py-3 border-b border-gray-100">
            <button className="border border-gray-200 px-4 py-1.5 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition">
              Write a product review
            </button>
            <button className="border border-gray-200 px-4 py-1.5 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition">
              Get support
            </button>
            <button className="border border-gray-200 px-4 py-1.5 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition">
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
              <Image
                src="https://via.placeholder.com/50"
                alt="product"
                className="w-12 h-12 object-contain"
              />
              {order.statusSteps.map((step, idx) => (
                <div key={step.label} className="flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      step.done
                        ? "bg-[#004bad] border-[#004bad] text-white"
                        : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    {step.done ? <FiCheckCircle className="text-sm" /> : <span className="text-xs">{idx + 1}</span>}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium text-center max-w-16 ${
                      step.done ? "text-[#004bad]" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-5">
          {/* Delivery address */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-[#004bad]" />
              <p className="font-semibold text-sm text-gray-900">Delivery Address</p>
            </div>
            <p className="text-sm font-medium text-gray-800">{order.address.name}</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {order.address.line1}
              <br />
              {order.address.city}
              <br />
              {order.address.phone}
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiCreditCard className="text-[#004bad]" />
              <p className="font-semibold text-sm text-gray-900">Payment</p>
            </div>
            <p className="text-sm text-gray-700">{order.payment}</p>
            <p className="text-sm text-gray-400 mt-3">Estimated delivery</p>
            <p className="text-sm font-medium text-gray-800">{order.estimatedDelivery}</p>
          </div>

          {/* Order overview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiPackage className="text-[#004bad]" />
              <p className="font-semibold text-sm text-gray-900">Order Overview</p>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Items</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600">{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GST</span>
                <span>₹{order.tax}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>₹{(order.subtotal + order.tax - order.discount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product items */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Items in this order</p>
          </div>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                  <FiPackage className="text-2xl text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    ₹{item.price.toLocaleString("en-IN")} × {item.qty}
                  </p>
                </div>
              </div>
              <button className="border border-gray-200 text-sm px-4 py-1.5 rounded-full text-gray-600 hover:bg-gray-50 transition">
                Write a review
              </button>
            </div>
          ))}
        </div>

        {/* Recently viewed */}
        <RecentViewProducts />
      </div>
    </main>
  );
}
