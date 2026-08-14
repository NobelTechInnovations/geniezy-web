import Link from "next/link";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import RecentViewProducts from "../components/home/RecentViewProducts";
import Link from "next/link";
import Image from "next/image";

// Placeholder order data — replace with real API data when ready
const PLACEHOLDER_ORDERS = [
  {
    id: "12345",
    date: "10 Sept 2025",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
    item: "Wireless Earbuds",
    price: 1499,
    qty: 1,
  },
  {
    id: "12344",
    date: "05 Sept 2025",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-700",
    item: "Samsung Galaxy S25",
    price: 79999,
    qty: 1,
  },
];

export default function OrdersPage() {
  return (
    <main className="container mx-auto flex flex-col bg-white">
      <div className="flex w-6xl my-4 mx-auto gap-4">
        {/* Orders Section */}
        <div className="flex flex-col gap-4 w-2/3">
          {/* Example Order Card */}
          <div className="rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
            {/* Left: Order Info */}
            <div className="flex-1">
            <h2 className="font-semibold text-lg">Order #12345</h2>
              <p className="text-gray-500 text-sm mt-1">
                Placed on: 10 Sept 2025
              </p>
              <div className="mt-3 text-sm">
                <p>Item: Wireless Earbuds</p>
                <p>Price: ₹1,499</p>
              </div>
              <Link
                href="/orders/43435t453e4"
                className="text-sm underline mt-2 inline-block"
              >
                View full details
              </Link>
            </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Orders list ──────────────────────────────────── */}
          <section className="flex-1 flex flex-col gap-4">
            {PLACEHOLDER_ORDERS.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex gap-6 text-xs text-gray-500">
                    <span>
                      <span className="text-gray-400 uppercase tracking-wide font-medium mr-1">
                        Order placed
                      </span>
                      {order.date}
                    </span>
                    <span>
                      <span className="text-gray-400 uppercase tracking-wide font-medium mr-1">
                        Total
                      </span>
                      ₹{order.price.toLocaleString("en-IN")}
                    </span>
                    <span>
                      <span className="text-gray-400 uppercase tracking-wide font-medium mr-1">
                        Order
                      </span>
                      #{order.id}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Card body */}
                <div className="flex flex-col md:flex-row gap-4 px-5 py-4">
                  {/* Icon + product */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FiPackage className="text-[#004bad] text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{order.item}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ₹{order.price.toLocaleString("en-IN")} × {order.qty}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 items-start">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-1 text-xs text-[#004bad] border border-[#004bad] px-3 py-1.5 rounded-full hover:bg-[#004bad] hover:text-white transition"
                    >
                      View details <FiChevronRight className="text-xs" />
                    </Link>
                    <button className="text-xs text-gray-600 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition">
                      Write a review
                    </button>
                    <button className="text-xs text-gray-600 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition">
                      Get support
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state */}
            {PLACEHOLDER_ORDERS.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center py-16 text-center">
                <FiPackage className="text-5xl text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Looks like you haven&apos;t placed any orders yet.
                </p>
                <Link
                  href="/"
                  className="bg-[#004bad] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-blue-800 transition"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </section>

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Sponsored</h3>
              <div className="rounded-lg overflow-hidden mb-3 bg-gray-50">
                <img
                  src="https://placehold.co/300x180"
                  alt="Sponsored product"
                  className="w-full object-cover"
                />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-0.5">Premium Headphones</p>
              <p className="text-xs text-gray-500 mb-3">Only ₹4,999</p>
              <button className="w-full bg-[#004bad] text-white py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition">
                Shop Now
              </button>
            </div>
          </aside>
        </div>

        {/* Sponsored Product */}
        <div className="w-1/3">
          <div className="p-3 bg-gray-50 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-3">Samsung</h3>
            <Image
              src="https://via.placeholder.com/300x200"
              alt="Sponsored Product"
              className="rounded-lg mb-3"
            />
            <p className="font-medium">Premium Headphones</p>
            <p className="text-sm text-gray-500 mb-3">Only ₹4,999</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-700">
              Shop Now
            </button>
          </div>
          <span className="text-xs block text-right mt-1">Sponsored</span>
        </div>
      </div>
    </main>
  );
}
