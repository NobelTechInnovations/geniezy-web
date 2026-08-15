'use client';

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiPackage, FiMapPin, FiCreditCard } from "react-icons/fi";
import { orderApi } from "@/app/redux/services/apiService";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Confirmed" },
  { key: "ready_to_ship", label: "Packed" },
  { key: "shipped", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

function currentStepIndex(status) {
  if (status === "cancelled" || status === "rejected") return -1;
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

const statusLabel = (status) =>
  (status || "pending").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function OrderDetailPage({ params }) {
  const { orderId } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("geniezy_token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrderDetail(orderId);
        if (response.success) {
          setOrder(response.data);
        } else {
          setError(response.message || "Order not found");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          router.push("/login");
          return;
        }
        setError(err.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-5xl px-4 py-6 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-5" />
          <div className="h-40 bg-gray-200 rounded-xl mb-5" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-4">{error || "Order not found"}</p>
          <Link href="/orders" className="text-[#004bad] text-sm hover:underline">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const stepIdx = currentStepIndex(order.status);
  const delivery = order.delivery; // populated OrderCustomer snapshot
  const subtotal = Number(order.sub_total_amount || 0);
  const shipping = Number(order.shipping || 0);
  const tax = Number(order.tax || 0);
  const discount = Number(order.discount || 0);
  const total = Number(order.final_amount || 0);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-6">
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
              <p className="font-bold text-gray-900">#{order.order_number}</p>
            </div>
            <div className="text-sm text-gray-500">
              Placed on{" "}
              <span className="font-medium text-gray-700">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Status stepper */}
          <div className="px-6 py-6 border-b border-gray-100">
            {order.status === "cancelled" || order.status === "rejected" ? (
              <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                {statusLabel(order.status)}
              </span>
            ) : (
              <div className="flex items-center">
                {STATUS_STEPS.map((step, idx) => (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          idx <= stepIdx
                            ? "bg-[#004bad] border-[#004bad] text-white"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        <span className="text-xs">{idx + 1}</span>
                      </div>
                      <p
                        className={`text-xs mt-2 font-medium text-center max-w-16 ${
                          idx <= stepIdx ? "text-[#004bad]" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-5 ${idx < stepIdx ? "bg-[#004bad]" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}
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
            {delivery ? (
              <>
                <p className="text-sm font-medium text-gray-800">{delivery.name}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {delivery.address}
                  {delivery.pincode && <><br />{delivery.pincode}</>}
                  {delivery.phone && <><br />{delivery.phone}</>}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Address not available</p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiCreditCard className="text-[#004bad]" />
              <p className="font-semibold text-sm text-gray-900">Payment</p>
            </div>
            <p className="text-sm text-gray-700">Cash / Online payment</p>
            <p className="text-sm text-gray-400 mt-3">Status</p>
            <p className="text-sm font-medium text-gray-800">{statusLabel(order.status)}</p>
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
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product items */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Items in this order</p>
          </div>
          {(order.items || []).map((item, idx) => (
            <div
              key={item._id || idx}
              className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                  {item.product_instance?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product_instance.image} alt={item.product_instance?.name} className="w-full h-full object-contain" />
                  ) : (
                    <FiPackage className="text-2xl text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.product_instance?.name || "Product"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    ₹{Number(item.product_instance?.order_price || 0).toLocaleString("en-IN")} × {item.qty}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
