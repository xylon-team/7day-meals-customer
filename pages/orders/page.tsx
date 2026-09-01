'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';
import { fetchUserOrders } from '@/lib/api/orders';
import { Package, CalendarDays, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/Badge';

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadOrders = async () => {
      if (user?.customer_id && token) {
        try {
          const data = await fetchUserOrders(user.customer_id, token);
          setOrders(data);
        } catch (err: any) {
          setError(err.message || 'Failed to load orders.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, router, user, token]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900 flex flex-col font-sans">
      <Header activeTab="Orders" />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Order History
          </h1>
          <p className="mt-1 text-stone-500 text-sm">
            Track and manage your meal plan orders.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D5C53]" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-12 text-center flex flex-col items-center justify-center">
            <Package className="w-16 h-16 text-stone-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-stone-500 max-w-md mb-6">
              You haven't placed any orders. Browse our meal plans to get started with delicious, healthy meals!
            </p>
            <button
              onClick={() => router.push('/meal-plans')}
              className="bg-[#0D5C53] hover:bg-[#09433D] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Browse Meals
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">Order #{order.order_id}</h3>
                      <Badge variant={getStatusColor(order.order_status) as any}>{order.order_status}</Badge>
                    </div>
                    <p className="text-sm text-stone-500 flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      Ordered on {new Date(order.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-stone-500 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">Rs. {order.total_amount?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-[#0D5C53]" />
                      Order Details
                    </h4>
                    <div className="space-y-1.5 text-sm text-stone-600">
                      <p><span className="font-medium text-gray-700">Meal Plan ID:</span> {order.meal_id}</p>
                      <p><span className="font-medium text-gray-700">Payment:</span> {order.payment_status}</p>
                      <p><span className="font-medium text-gray-700">Delivery Status:</span> {order.delivery_status}</p>
                      <p><span className="font-medium text-gray-700">Subscribed:</span> {order.is_a_subscribed_meal ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#0D5C53]" />
                      Delivery Information
                    </h4>
                    <div className="space-y-1.5 text-sm text-stone-600">
                      <p><span className="font-medium text-gray-700">Expected Start:</span> {new Date(order.delivery_preferred_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
