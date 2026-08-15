'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';
import { orderApi } from '../redux/services/apiService';

const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Confirmed' },
  { key: 'processing', label: 'Packed' },
  { key: 'ready_to_ship', label: 'Out for Delivery' },
  { key: 'shipped', label: 'Arriving Soon' },
  { key: 'delivered', label: 'Delivered' },
];

function doneCountFor(status) {
  const idx = ORDER_STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 1 : idx + 1; // 'pending' -> at least "Confirmed" is done
}

export default function OrderSuccess() {
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('geniezy_token') : null;
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchLatestOrder = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getMyOrders();
        if (response.success && response.data?.length > 0) {
          // getMyOrders is sorted newest-first. A single checkout can split
          // into several orders (one per seller) — show every order that
          // shares the most recent order_group_id together.
          const latestGroupId = response.data[0].order_group_id;
          const latestOrders = latestGroupId
            ? response.data.filter((o) => o.order_group_id === latestGroupId)
            : [response.data[0]];
          setOrders(latestOrders);
        } else {
          setError('No recent order found');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
          return;
        }
        setError(err.response?.data?.message || 'Could not load your order');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [router]);

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Loading your order…</div>
      </main>
    );
  }

  if (error || !orders) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <Link href="/orders" className="text-[#004bad] text-sm hover:underline">
            View your orders
          </Link>
        </div>
      </main>
    );
  }

  const totalAmount = orders.reduce((sum, o) => sum + Number(o.final_amount || 0), 0);
  const delivery = orders[0].orderCustomer;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-6">

        {/* Confirmation banner */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <FiCheckCircle className="text-green-600 text-2xl" />
            <span className="text-green-700 font-semibold">
              {orders.length > 1 ? 'Your orders are confirmed!' : 'Your order is confirmed!'}
            </span>
          </div>
          {delivery?.address && (
            <p className="text-sm text-gray-500 mb-1">
              Delivering to: {delivery.address}{delivery.pincode ? ` - ${delivery.pincode}` : ''}
            </p>
          )}
          <p className="text-gray-900 font-bold text-lg mb-1">
            Total ₹{totalAmount.toLocaleString('en-IN')}
          </p>
          {orders.length > 1 && (
            <p className="text-xs text-gray-500 mb-2">
              Split into {orders.length} shipments — items ship independently from each seller.
            </p>
          )}
          <Link href="/orders">
            <button className="text-sm text-[#004bad] underline font-semibold">
              View Order Details
            </button>
          </Link>
        </div>

        {/* One status card per order (usually one, but a multi-seller
            checkout produces several independent orders) */}
        {orders.map((order) => {
          const doneCount = doneCountFor(order.status);
          const isCancelled = order.status === 'cancelled' || order.status === 'rejected';
          return (
            <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-gray-900">Order #{order.order_number}</p>
                <span className="text-sm font-medium text-gray-700">
                  ₹{Number(order.final_amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-5">Track this order in real time</p>

              {isCancelled ? (
                <span className="inline-block text-sm font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                  {order.status === 'cancelled' ? 'Cancelled' : 'Rejected'}
                </span>
              ) : (
                <div className="flex items-start justify-between relative">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
                  <div
                    className="absolute top-4 left-0 h-0.5 bg-[#004bad] transition-all"
                    style={{ width: `${((doneCount - 1) / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                  {ORDER_STATUS_STEPS.map((step, idx) => {
                    const done = idx < doneCount;
                    return (
                      <div key={step.key} className="flex flex-col items-center z-10 flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            done ? 'bg-[#004bad] border-[#004bad] text-white' : 'bg-white border-gray-200 text-gray-400'
                          }`}
                        >
                          {done ? <FiCheckCircle className="text-sm" /> : <span className="text-xs">{idx + 1}</span>}
                        </div>
                        <p className={`text-xs mt-2 text-center font-medium leading-tight ${done ? 'text-[#004bad]' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
