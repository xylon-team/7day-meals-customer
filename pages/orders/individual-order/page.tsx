'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';
import { fetchOrderById } from '@/lib/api/orders';
import { fetchMealPlanById, getMealImage } from '@/lib/api/meals';
import { 
  ArrowLeft, 
  ClipboardList, 
  CheckCircle2, 
  Bike, 
  Package, 
  Utensils, 
  MapPin, 
  CreditCard,
  AlertTriangle,
} from 'lucide-react';

interface OrderDetailData {
  orderId: string;
  placedDate: string;
  preferredDate: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  mealTitle: string;
  mealDescription: string;
  mealTags: string[];
  mealImage: string;
  totalAmount: string;
  customerId: string | number;
  mealId: string | number;
  riderId: string;
  offerId: string;
  subscribedMeal: string;
  orderStep: 'ordered' | 'confirmed' | 'dispatched' | 'delivered';
}

const SAMPLE_INDIVIDUAL_ORDER: OrderDetailData = {
  orderId: '#9841',
  placedDate: 'Sep 15, 2026, 7:42 AM',
  preferredDate: 'Sep 16, 2026, 12:00 PM',
  orderStatus: 'Pending',
  paymentStatus: 'Unpaid',
  deliveryStatus: 'Not dispatched',
  mealTitle: 'Traditional Weekly Feast',
  mealDescription: 'Our flagship seven-day plan. Rotating rice and curry with fish, chicken and village vegetables, cooked the way it is at home.',
  mealTags: ['Weekly', 'Non-Veg'],
  mealImage: '/sri_lankan_traditional_feast.png',
  totalAmount: 'Rs. 8,500',
  customerId: 1,
  mealId: 1,
  riderId: 'Not assigned',
  offerId: 'None',
  subscribedMeal: 'No',
  orderStep: 'ordered'
};

export default function IndividualOrderPage() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams ? searchParams.get('id') : null;
  const { user, token } = useStore();
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (orderIdParam && user?.customer_id && token) {
      const numericId = orderIdParam.replace(/[^0-9]/g, '');
      if (numericId) {
        setLoading(true);
        setFetchError(null);
        fetchOrderById(user.customer_id, numericId, token)
          .then(async (data: any) => {
            if (data) {
              let mealData: any = null;
              if (data.meal_id) {
                try {
                  mealData = await fetchMealPlanById(data.meal_id);
                } catch (err) {
                  console.warn('Failed to fetch meal details for order', err);
                }
              }

              setOrder({
                orderId: `#${data.order_id || numericId}`,
                placedDate: new Date(data.order_timestamp || data.created_at || Date.now()).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }),
                preferredDate: data.delivery_preferred_date
                  ? new Date(data.delivery_preferred_date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  : 'Not specified',
                orderStatus: data.order_status || 'Pending',
                paymentStatus: data.payment_status || 'Unpaid',
                deliveryStatus: data.delivery_status || 'Not dispatched',
                mealTitle: mealData ? mealData.item_name : (data.meal_name || 'Meal Plan'),
                mealDescription: mealData ? mealData.description : (data.meal_description || ''),
                mealTags: mealData ? [mealData.category, mealData.dietary_preference].filter(Boolean) : ['Weekly', 'Non-Veg'],
                mealImage: getMealImage(mealData),
                totalAmount: `Rs. ${mealData ? Number(mealData.price).toLocaleString() : (data.total_amount ? Number(data.total_amount).toLocaleString() : '0')}`,
                customerId: data.customer_id || '',
                mealId: data.meal_id || '',
                riderId: data.rider_id || 'Not assigned',
                offerId: data.offer_id || 'None',
                subscribedMeal: data.is_a_subscribed_meal ? 'Yes' : 'No',
                orderStep: (data.order_status?.toLowerCase() === 'delivered'
                  ? 'delivered'
                  : data.delivery_status?.toLowerCase() === 'dispatched'
                  ? 'dispatched'
                  : data.order_status?.toLowerCase() === 'confirmed'
                  ? 'confirmed'
                  : 'ordered')
              });
            }
          })
          .catch((err: any) => {
            // Show a real error state — do NOT display fabricated sample data
            setFetchError(err?.message || 'Could not load order details. Please try again.');
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setFetchError('Invalid order ID.');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [orderIdParam, token, user?.customer_id]);

  const rawOrderIdNumber = order?.orderId?.replace('#', '') ?? orderIdParam ?? '';

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Header activeTab="Orders" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to orders</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E5A52]" />
          </div>
        ) : fetchError ? (
          /* Error / Not Found State */
          <div className="bg-white rounded-2xl border border-[#ECE9E0] p-12 text-center flex flex-col items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-rose-300 mb-3" />
            <h2 className="text-lg font-bold text-stone-900 mb-1">Order Not Found</h2>
            <p className="text-stone-500 text-sm max-w-sm mb-6">{fetchError}</p>
            <Link
              href="/orders"
              className="bg-[#0E5A52] hover:bg-[#09433D] text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        ) : order ? (
          <div className="space-y-6">

            {/* Top Summary Card with Timeline Tracker */}
            <div className="bg-white rounded-2xl border border-[#ECE9E0] p-6 sm:p-8 shadow-2xs">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111827]">
                    Order <span className="font-serif font-semibold text-[#111827]">#{rawOrderIdNumber}</span>
                  </h1>
                  <p className="text-xs text-stone-400 mt-1 font-normal">
                    Placed {order.placedDate}
                  </p>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span className="bg-[#FEF3C7] text-[#92400E] font-medium text-[11px] sm:text-xs px-3 py-1 rounded-full">
                    Order · {order.orderStatus}
                  </span>
                  <span className="bg-[#FEF3C7] text-[#92400E] font-medium text-[11px] sm:text-xs px-3 py-1 rounded-full">
                    Payment · {order.paymentStatus}
                  </span>
                  <span className="bg-[#FEF3C7] text-[#92400E] font-medium text-[11px] sm:text-xs px-3 py-1 rounded-full">
                    Delivery · {order.deliveryStatus}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="mt-8 pt-8 border-t border-stone-100 relative max-w-3xl mx-auto px-4">
                {/* Connecting Line */}
                <div className="absolute top-[52px] left-12 right-12 h-0.5 bg-stone-200" />

                <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                  {/* Step 1: Ordered */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#0E5A52] text-white flex items-center justify-center shadow-xs">
                      <ClipboardList className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold text-stone-900 mt-2.5">
                      Ordered
                    </span>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-white border border-stone-300 text-stone-400 flex items-center justify-center ${
                      order.orderStep === 'confirmed' || order.orderStep === 'dispatched' || order.orderStep === 'delivered'
                        ? 'bg-[#0E5A52] text-white border-[#0E5A52]'
                        : ''
                    }`}>
                      <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-xs font-medium text-stone-400 mt-2.5">
                      Confirmed
                    </span>
                  </div>

                  {/* Step 3: Dispatched */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-white border border-stone-300 text-stone-400 flex items-center justify-center ${
                      order.orderStep === 'dispatched' || order.orderStep === 'delivered'
                        ? 'bg-[#0E5A52] text-white border-[#0E5A52]'
                        : ''
                    }`}>
                      <Bike className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-xs font-medium text-stone-400 mt-2.5">
                      Dispatched
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-white border border-stone-300 text-stone-400 flex items-center justify-center ${
                      order.orderStep === 'delivered'
                        ? 'bg-[#0E5A52] text-white border-[#0E5A52]'
                        : ''
                    }`}>
                      <Package className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-xs font-medium text-stone-400 mt-2.5">
                      Delivered
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 2-Column Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Meal Ordered Card */}
                <div className="bg-white rounded-2xl border border-[#ECE9E0] p-6 shadow-2xs">
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="w-5 h-5 text-[#0E5A52]" />
                    <h2 className="font-serif text-lg font-bold text-[#111827]">
                      Meal ordered
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4 pt-1">
                    <img
                      src={order.mealImage}
                      alt={order.mealTitle}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-stone-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-900 text-base">
                        {order.mealTitle}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {order.mealTags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                              tag === 'Weekly'
                                ? 'bg-stone-100 text-stone-600'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-stone-500 text-xs leading-relaxed mt-2.5">
                        {order.mealDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Card */}
                <div className="bg-white rounded-2xl border border-[#ECE9E0] p-6 shadow-2xs">
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="w-5 h-5 text-[#0E5A52]" />
                    <h2 className="font-serif text-lg font-bold text-[#111827]">
                      Delivery
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-stone-400 font-medium mb-1">
                        Preferred date
                      </p>
                      <p className="font-bold text-stone-900 text-sm">
                        {order.preferredDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-medium mb-1">
                        Delivery status
                      </p>
                      <p className="font-bold text-stone-900 text-sm">
                        {order.deliveryStatus}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#ECE9E0] rounded-xl p-4 text-xs text-stone-500 font-medium">
                    No rider assigned yet — one is allocated once your order is dispatched.
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Payment Card */}
                <div className="bg-white rounded-2xl border border-[#ECE9E0] p-6 shadow-2xs">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-[#0E5A52]" />
                    <h2 className="font-serif text-lg font-bold text-[#111827]">
                      Payment
                    </h2>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <span className="text-stone-500">Meal plan</span>
                      <span className="font-semibold text-stone-900">{order.totalAmount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <span className="font-bold text-stone-900 text-sm">Total</span>
                      <span className="font-bold text-[#0E5A52] text-base">{order.totalAmount}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-stone-500">Status</span>
                      <span className="bg-[#FEF3C7] text-[#92400E] font-semibold text-xs px-2.5 py-0.5 rounded-md">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Record Card */}
                <div className="bg-white rounded-2xl border border-[#ECE9E0] p-6 shadow-2xs">
                  <h2 className="font-serif text-lg font-bold text-[#111827] mb-4">
                    Order record
                  </h2>

                  <div className="divide-y divide-stone-100 text-xs">
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-stone-500">Order ID</span>
                      <span className="font-bold text-stone-900">{order.orderId}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-stone-500">Customer</span>
                      <span className="font-semibold text-stone-900">{user?.name || 'Customer'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-stone-500">Rider ID</span>
                      <span className="font-semibold text-stone-900">{order.riderId}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-stone-500">Offer ID</span>
                      <span className="font-semibold text-stone-900">{order.offerId}</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="text-stone-500">Subscribed meal</span>
                      <span className="font-semibold text-stone-900">{order.subscribedMeal}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}
