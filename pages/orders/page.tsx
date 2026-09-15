'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';
import { fetchUserOrders } from '@/lib/api/orders';
import { Package, Search, SlidersHorizontal, Star, X, Check, CalendarDays, MapPin, CreditCard } from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  status: 'Delivered' | 'Pending' | 'Processing' | 'Cancelled' | string;
  date: string;
  items: string;
  price: string;
  rawPrice?: number;
  deliveryAddress?: string;
  paymentStatus?: string;
}

// Sample orders matching the design mock
const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: 'ord-9823',
    orderNumber: '#ORD-9823',
    status: 'Delivered',
    date: 'Oct 24, 2023',
    items: '2x Classic Sri Lankan Breakfast, 1x Chicken Rice & Curry',
    price: 'Rs. 2900',
    rawPrice: 2900,
    deliveryAddress: '123 Galle Road, Colombo 03',
    paymentStatus: 'PAID'
  },
  {
    id: 'ord-9810',
    orderNumber: '#ORD-9810',
    status: 'Delivered',
    date: 'Oct 17, 2023',
    items: '2x Kottu Roti (Chicken)',
    price: 'Rs. 2600',
    rawPrice: 2600,
    deliveryAddress: '123 Galle Road, Colombo 03',
    paymentStatus: 'PAID'
  },
  {
    id: 'ord-9755',
    orderNumber: '#ORD-9755',
    status: 'Delivered',
    date: 'Oct 10, 2023',
    items: '3x Vegetarian Rice & Curry',
    price: 'Rs. 2850',
    rawPrice: 2850,
    deliveryAddress: '123 Galle Road, Colombo 03',
    paymentStatus: 'PAID'
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useStore();
  const [orders, setOrders] = useState<OrderItem[]>(SAMPLE_ORDERS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal states
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderItem | null>(null);
  const [selectedOrderRate, setSelectedOrderRate] = useState<OrderItem | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [rateSuccess, setRateSuccess] = useState<boolean>(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (user?.customer_id && token) {
        try {
          const apiData = await fetchUserOrders(user.customer_id, token);
          if (apiData && apiData.length > 0) {
            const mappedApiOrders: OrderItem[] = apiData.map((order: any) => ({
              id: `ord-${order.order_id}`,
              orderNumber: `#ORD-${order.order_id}`,
              status: order.order_status || 'Processing',
              date: new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              items: order.meal_name || order.items_description || `Meal Plan #${order.meal_id || '101'}`,
              price: `Rs. ${order.total_amount || '0'}`,
              rawPrice: order.total_amount || 0,
              deliveryAddress: order.address || 'Colombo, Sri Lanka',
              paymentStatus: order.payment_status || 'PAID'
            }));

            // Merge API orders with sample orders ensuring unique IDs
            const existingIds = new Set(mappedApiOrders.map(o => o.orderNumber));
            const filteredSamples = SAMPLE_ORDERS.filter(s => !existingIds.has(s.orderNumber));
            setOrders([...mappedApiOrders, ...filteredSamples]);
          }
        } catch {
          // Fall back to mock sample data if fetch fails or unauthenticated
          setOrders(SAMPLE_ORDERS);
        } finally {
          setLoading(false);
        }
      } else {
        setOrders(SAMPLE_ORDERS);
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, token]);

  const categories = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'All' || order.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRateSuccess(true);
    setTimeout(() => {
      setRateSuccess(false);
      setSelectedOrderRate(null);
      setRatingComment('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans">
      <Header activeTab="Orders" />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title and Top Search/Filter Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
              Order History
            </h1>
            <p className="mt-1 text-stone-500 text-sm font-normal">
              Track your current orders and view past deliveries.
            </p>
          </div>

          {/* Search bar and Filter icon */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-[#E5E2D9] rounded-lg pl-9 pr-4 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#0E5A52] w-64 shadow-2xs transition-colors"
              />
            </div>
            <button
              type="button"
              className="p-2.5 bg-white border border-[#E5E2D9] rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
              title="Filter"
              aria-label="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1E252B] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E5E2D9] hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Order Cards Container */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E5A52]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#ECE9E0] p-12 text-center flex flex-col items-center justify-center my-6">
            <Package className="w-12 h-12 text-stone-300 mb-3" />
            <h3 className="text-lg font-bold text-stone-900 mb-1">No orders found</h3>
            <p className="text-stone-500 text-sm max-w-sm mb-6">
              {searchQuery
                ? `No orders matching "${searchQuery}"`
                : `You don't have any ${activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} orders yet.`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-[#0E5A52] hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#ECE9E0] p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left section: Icon & Details */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="w-11 h-11 rounded-full bg-[#EBF4F1] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <Package className="w-5 h-5 text-[#0E5A52]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-[#111827] text-base sm:text-lg">
                        {order.orderNumber}
                      </h3>
                      <span className="bg-[#D7EFE7] text-[#0E5A52] font-semibold text-[11px] px-2.5 py-0.5 rounded-md">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5 font-normal">
                      {order.date}
                    </p>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-normal">
                      {order.items}
                    </p>
                  </div>
                </div>

                {/* Right section: Price & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                  <div className="text-left md:text-right">
                    <span className="font-bold text-[#0E5A52] text-lg sm:text-xl">
                      {order.price}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[110px]">
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="bg-[#F3F0E6] hover:bg-[#EAE6DA] text-[#111827] font-semibold text-xs py-2 px-4 rounded-full transition-colors text-center cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrderRate(order);
                        setRateSuccess(false);
                        setRatingStars(5);
                      }}
                      className="bg-transparent border border-[#0E5A52] hover:bg-[#EBF4F1] text-[#0E5A52] font-semibold text-xs py-1.5 px-4 rounded-full transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-current stroke-none" />
                      <span>Rate</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* View Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Order Details</h3>
                <p className="text-xs text-stone-400">{selectedOrderDetails.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-100 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                  Ordered Items
                </span>
                <p className="font-medium text-stone-800">{selectedOrderDetails.items}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-1">Order Date</span>
                  <span className="font-semibold text-stone-800 flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-[#0E5A52]" />
                    {selectedOrderDetails.date}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block mb-1">Status</span>
                  <span className="font-semibold text-[#0E5A52] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {selectedOrderDetails.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    Delivery Address:
                  </span>
                  <span className="font-medium text-stone-800">
                    {selectedOrderDetails.deliveryAddress || '123 Galle Road, Colombo 03'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                    Payment Status:
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {selectedOrderDetails.paymentStatus || 'PAID'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="font-semibold text-stone-700 text-sm">Total Paid</span>
                <span className="font-bold text-xl text-[#0E5A52]">
                  {selectedOrderDetails.price}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full mt-2 bg-[#0E5A52] hover:bg-[#09433D] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rate Order Modal */}
      {selectedOrderRate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Rate Your Meal</h3>
                <p className="text-xs text-stone-400">{selectedOrderRate.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrderRate(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rateSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-stone-900 text-base">Thank You!</h4>
                <p className="text-xs text-stone-500">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleRateSubmit} className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    How was your order?
                  </label>
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingStars(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= ratingStars ? 'fill-amber-400 stroke-amber-400' : 'text-stone-300 stroke-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Write a review (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the taste, delivery, or packaging..."
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#0E5A52]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderRate(null)}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0E5A52] hover:bg-[#09433D] text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
