'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';
import { fetchUserOrders } from '@/lib/api/orders';
import { submitReview, fetchOrderReview } from '@/lib/api/reviews';
import {
  Package,
  Search,
  SlidersHorizontal,
  Star,
  X,
  Check,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  rawId: string;
  mealId?: string | number;
  status: 'Delivered' | 'Pending' | 'Processing' | 'Cancelled' | string;
  date: string;
  items: string;
  price: string;
  rawPrice?: number;
  deliveryAddress?: string;
  paymentStatus?: string;
}

const SAMPLE_ORDERS: OrderItem[] = [
  {
    id: 'ord-9823',
    orderNumber: '#ORD-9823',
    rawId: '9823',
    status: 'Delivered',
    date: 'Oct 24, 2023',
    items: '2x Classic Sri Lankan Breakfast, 1x Chicken Rice & Curry',
    price: 'Rs. 2900',
    rawPrice: 2900,
    deliveryAddress: '123 Galle Road, Colombo 03',
    paymentStatus: 'PAID',
  },
  {
    id: 'ord-9810',
    orderNumber: '#ORD-9810',
    rawId: '9810',
    status: 'Delivered',
    date: 'Oct 17, 2023',
    items: '2x Kottu Roti (Chicken)',
    price: 'Rs. 2600',
    rawPrice: 2600,
    deliveryAddress: '123 Galle Road, Colombo 03',
    paymentStatus: 'PAID',
  },
  {
    id: 'ord-9755',
    orderNumber: '#ORD-9755',
    rawId: '9755',
    status: 'Delivered',
    date: 'Oct 10, 2023',
    items: '3x Vegetarian Rice & Curry',
    price: 'Rs. 2850',
    rawPrice: 2850,
    deliveryAddress: '123 Galle Road, Colombo 03',
    paymentStatus: 'PAID',
  },
];

// ─── Star Rating Component ─────────────────────────────────────────────────────
function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (star: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center justify-center gap-1 py-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-1 transition-transform hover:scale-110 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-stone-300 fill-stone-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Rating label helper ───────────────────────────────────────────────────────
const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { user, token } = useStore();
  const [orders, setOrders] = useState<OrderItem[]>(SAMPLE_ORDERS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Rate Modal State
  const [selectedOrderRate, setSelectedOrderRate] = useState<OrderItem | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [rateSuccess, setRateSuccess] = useState<boolean>(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingSubmitting, setRatingSubmitting] = useState<boolean>(false);

  // Already-reviewed check state (keyed by orderId)
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());
  const [checkingReview, setCheckingReview] = useState<boolean>(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (user?.customer_id && token) {
        try {
          const apiData = await fetchUserOrders(user.customer_id, token);
          if (apiData && apiData.length > 0) {
            const mappedApiOrders: OrderItem[] = apiData.map((order: any) => ({
              id: `ord-${order.order_id}`,
              orderNumber: `#ORD-${order.order_id}`,
              rawId: String(order.order_id),
              mealId: order.meal_id,
              status: order.order_status || 'Processing',
              date: new Date(order.order_timestamp || order.created_at || Date.now()).toLocaleDateString(
                'en-US',
                { month: 'short', day: 'numeric', year: 'numeric' },
              ),
              items: order.meal_name || order.items_description || `Meal Plan #${order.meal_id || '101'}`,
              price: `Rs. ${order.total_amount || '0'}`,
              rawPrice: order.total_amount || 0,
              deliveryAddress: order.address || 'Colombo, Sri Lanka',
              paymentStatus: order.payment_status || 'PAID',
            }));

setOrders(mappedApiOrders);
          }
        } catch {
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
    const matchesFilter =
      activeFilter === 'All' ||
      order.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Open rating modal — check if already reviewed from API
  const handleOpenRateModal = async (order: OrderItem) => {
    setSelectedOrderRate(order);
    setRateSuccess(false);
    setRatingStars(0);
    setRatingComment('');
    setRatingError(null);

    // Check if already reviewed (only when authenticated)
    if (user?.customer_id && token) {
      setCheckingReview(true);
      try {
        await fetchOrderReview(user.customer_id, order.rawId, token);
        // No error = review exists
        setReviewedOrders((prev) => new Set(prev).add(order.rawId));
      } catch (err: any) {
        // 404 = not reviewed yet; other errors we ignore silently
        if (err?.status !== 404) {
          console.warn('Could not check review status:', err?.message);
        }
      } finally {
        setCheckingReview(false);
      }
    }
  };

  // Submit rating to backend API
  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ratingStars === 0) {
      setRatingError('Please select a star rating before submitting.');
      return;
    }
    if (ratingComment.length > 500) {
      setRatingError('Your review must be 500 characters or less.');
      return;
    }
    if (!selectedOrderRate) return;

    setRatingSubmitting(true);
    setRatingError(null);

    try {
      if (user?.customer_id && token) {
        // Authenticated — call real API
        await submitReview(token, {
          order_id: Number(selectedOrderRate.rawId),
          rating_value: ratingStars,
          description: ratingComment.trim() || undefined,
        });
      }
      // Mark as reviewed locally
      setReviewedOrders((prev) => new Set(prev).add(selectedOrderRate.rawId));
      setRateSuccess(true);
    } catch (err: any) {
      const status = (err as any)?.status;
      if (status === 409) {
        setRatingError('You have already submitted a review for this order.');
        setReviewedOrders((prev) => new Set(prev).add(selectedOrderRate.rawId));
      } else if (status === 400) {
        setRatingError(err.message || 'You can only review delivered orders.');
      } else if (status === 403) {
        setRatingError('You are not authorised to review this order.');
      } else {
        setRatingError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setRatingSubmitting(false);
    }
  };

  const closeModal = () => {
    if (ratingSubmitting) return; // prevent closing mid-request
    setSelectedOrderRate(null);
    setRatingStars(0);
    setRatingComment('');
    setRatingError(null);
    setRateSuccess(false);
  };

  const isAlreadyReviewed = selectedOrderRate
    ? reviewedOrders.has(selectedOrderRate.rawId)
    : false;

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
            {filteredOrders.map((order) => {
              const alreadyReviewed = reviewedOrders.has(order.rawId);
              return (
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
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                          href={`/orders/individual-order?id=${order.rawId}`}
                          className="font-bold text-[#111827] text-base sm:text-lg hover:text-[#0E5A52] transition-colors"
                        >
                          {order.orderNumber}
                        </Link>
                        <span
                          className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-md ${
                            order.status.toLowerCase() === 'delivered'
                              ? 'bg-[#D7EFE7] text-[#0E5A52]'
                              : order.status.toLowerCase() === 'cancelled'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {order.status}
                        </span>
                        {alreadyReviewed && (
                          <span className="bg-amber-50 text-amber-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            Reviewed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 font-normal">{order.date}</p>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1.5 font-normal">{order.items}</p>
                    </div>
                  </div>

                  {/* Right section: Price & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                    <div className="text-left md:text-right">
                      <span className="font-bold text-[#0E5A52] text-lg sm:text-xl">{order.price}</span>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Link
                        href={`/orders/individual-order?id=${order.rawId}`}
                        className="bg-[#F3F0E6] hover:bg-[#EAE6DA] text-[#111827] font-semibold text-xs py-2 px-4 rounded-full transition-colors text-center"
                      >
                        View Details
                      </Link>
                      {order.status.toLowerCase() === 'delivered' ? (
                        <button
                          onClick={() => handleOpenRateModal(order)}
                          disabled={alreadyReviewed}
                          className={`font-semibold text-xs py-1.5 px-4 rounded-full transition-colors flex items-center justify-center gap-1 ${
                            alreadyReviewed
                              ? 'bg-amber-50 text-amber-600 border border-amber-200 cursor-default'
                              : 'bg-transparent border border-[#0E5A52] hover:bg-[#EBF4F1] text-[#0E5A52] cursor-pointer'
                          }`}
                          aria-label={alreadyReviewed ? 'Already reviewed' : 'Rate this order'}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${alreadyReviewed ? 'fill-amber-500 text-amber-500' : 'fill-current stroke-none'}`}
                          />
                          <span>{alreadyReviewed ? 'Reviewed' : 'Rate'}</span>
                        </button>
                      ) : (
                        <div className="h-7" /> // spacer for non-delivered orders
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Rate Order Modal ──────────────────────────────────────────────────── */}
      {selectedOrderRate && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Rate Your Order</h3>
                <p className="text-xs text-stone-400 mt-0.5">{selectedOrderRate.orderNumber}</p>
              </div>
              <button
                onClick={closeModal}
                disabled={ratingSubmitting}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-xl hover:bg-stone-100 cursor-pointer disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 pb-6 pt-4">
              {/* ── Success State ── */}
              {rateSuccess ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-base mb-1">Thank You!</h4>
                  <p className="text-sm text-stone-500">Your feedback has been submitted successfully.</p>
                </div>
              ) : checkingReview ? (
                /* ── Loading State while checking existing review ── */
                <div className="py-10 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0E5A52] mx-auto mb-3" />
                  <p className="text-sm text-stone-500">Checking review status...</p>
                </div>
              ) : isAlreadyReviewed ? (
                /* ── Already Reviewed State ── */
                <div className="py-8 text-center">
                  <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-7 h-7 fill-amber-500 text-amber-500" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-base mb-1">Already Reviewed</h4>
                  <p className="text-sm text-stone-500 max-w-xs mx-auto">
                    You have already submitted a review for this order. Thank you for your feedback!
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-6 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 px-8 rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* ── Review Form ── */
                <form onSubmit={handleRateSubmit} className="space-y-5 pt-2">
                  {/* Star Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1 text-center">
                      How was your experience?
                    </label>
                    <StarRating
                      value={ratingStars}
                      onChange={(star) => {
                        setRatingStars(star);
                        if (ratingError) setRatingError(null);
                      }}
                      disabled={ratingSubmitting}
                    />
                    {ratingStars > 0 && (
                      <p className="text-center text-xs font-medium text-[#0E5A52] mt-1">
                        {RATING_LABELS[ratingStars]}
                      </p>
                    )}
                  </div>

                  {/* Review Textarea */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Write a review{' '}
                      <span className="text-stone-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about the taste, delivery, or packaging..."
                      value={ratingComment}
                      maxLength={500}
                      disabled={ratingSubmitting}
                      onChange={(e) => {
                        setRatingComment(e.target.value);
                        if (ratingError) setRatingError(null);
                      }}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#0E5A52] resize-none transition-colors disabled:opacity-60"
                    />
                    <div
                      className={`text-right mt-1 text-[10px] ${ratingComment.length >= 480 ? 'text-rose-500' : 'text-stone-400'}`}
                    >
                      {ratingComment.length}/500
                    </div>
                  </div>

                  {/* Error Banner */}
                  {ratingError && (
                    <div className="flex items-center gap-2.5 text-rose-700 text-xs bg-rose-50 border border-rose-200 rounded-xl p-3">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{ratingError}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={ratingSubmitting}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={ratingSubmitting || ratingStars === 0}
                      className="flex-1 bg-[#0E5A52] hover:bg-[#09433D] disabled:bg-[#0E5A52]/50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {ratingSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Rating'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
