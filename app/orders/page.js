"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import { orderApi } from "../redux/services/apiService";

const STATUS_STYLE = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  ready_to_ship: "bg-blue-100 text-blue-700",
  ready_to_pickup: "bg-blue-100 text-blue-700",
  driver_accepted: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
  returned: "bg-gray-100 text-gray-700",
  refunded: "bg-gray-100 text-gray-700",
};

const statusLabel = (status) =>
  (status || "pending").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("geniezy_token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getMyOrders();
        if (response.success) {
          setOrders(response.data || []);
        } else {
          setError(response.message || "Failed to load orders");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Your Orders</h1>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse">
              <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6 text-center text-red-600 text-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
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
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const firstItem = order.items?.[0]?.product_instance;
            const extraCount = Math.max((order.items?.length || 1) - 1, 0);
            return (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                    <span>
                      <span className="text-gray-400 uppercase tracking-wide font-medium mr-1">
                        Order placed
                      </span>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span>
                      <span className="text-gray-400 uppercase tracking-wide font-medium mr-1">
                        Total
                      </span>
                      ₹{Number(order.final_amount || 0).toLocaleString("en-IN")}
                    </span>
                    <span>
                      <span className="text-gray-400 uppercase tracking-wide font-medium mr-1">
                        Order
                      </span>
                      #{order.order_number}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${STATUS_STYLE[order.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {statusLabel(order.status)}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 px-5 py-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FiPackage className="text-[#004bad] text-xl" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {firstItem?.name || "Order item"}
                        {extraCount > 0 && (
                          <span className="text-gray-400 font-normal"> +{extraCount} more</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.total_qty} item{order.total_qty === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-start">
                    <Link
                      href={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-xs text-[#004bad] border border-[#004bad] px-3 py-1.5 rounded-full hover:bg-[#004bad] hover:text-white transition"
                    >
                      View details <FiChevronRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
