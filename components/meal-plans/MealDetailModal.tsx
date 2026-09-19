'use client';

import React, { useState, useEffect } from 'react';
import { MealPlan } from '@/lib/data/meal-plans';
import { fetchMealPlanById, ApiMealPlan, ApiMealPlanFoodItem } from '@/lib/api/meals';
import { fetchReviewsByMealId, ReviewRecord } from '@/lib/api/reviews';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { X, Calendar, Utensils, AlertCircle, ShoppingBag, Star, MessageSquare } from 'lucide-react';

interface MealDetailModalProps {
  plan: MealPlan | null;
  onClose: () => void;
  onAddToCart: (plan: MealPlan) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeAverage(reviews: ReviewRecord[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating_value, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

function StarDisplay({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${
            star <= value ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200'
          }`}
        />
      ))}
    </div>
  );
}

function formatReviewDate(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsSection({ mealId }: { mealId: string }) {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchReviewsByMealId(mealId)
      .then((data) => {
        if (isMounted) {
          setReviews(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load reviews:', err);
          setError('Could not load reviews');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [mealId]);

  const average = computeAverage(reviews);
  const count = reviews.length;

  return (
    <div>
      {/* Section Header */}
      <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          Customer Reviews
        </span>
        {!loading && !error && count > 0 && (
          <span className="text-xs font-medium text-stone-500">
            {average} / 5 &nbsp;·&nbsp; {count} {count === 1 ? 'review' : 'reviews'}
          </span>
        )}
      </h3>

      {/* Overall Rating Bar */}
      {!loading && !error && count > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-100 mb-4">
          <span className="text-3xl font-extrabold text-amber-500">{average}</span>
          <div>
            <StarDisplay value={Math.round(average)} size="md" />
            <p className="text-[11px] text-stone-500 mt-0.5">Based on {count} {count === 1 ? 'review' : 'reviews'}</p>
          </div>
        </div>
      )}

      {/* States */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 animate-pulse">
              <div className="flex justify-between mb-2">
                <div className="h-3 bg-stone-200 rounded w-24" />
                <div className="h-3 bg-stone-200 rounded w-16" />
              </div>
              <div className="h-2.5 bg-stone-200 rounded w-20 mb-2" />
              <div className="h-3 bg-stone-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-xs flex items-center gap-2 border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Unable to load reviews. Please try again later.</span>
        </div>
      ) : count === 0 ? (
        <div className="py-8 text-center flex flex-col items-center gap-2">
          <MessageSquare className="w-8 h-8 text-stone-300" />
          <p className="text-sm text-stone-400 font-medium">No reviews yet</p>
          <p className="text-xs text-stone-400">Be the first to review this meal plan!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.feedback_id}
              className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-gray-900">{review.reviewer_name}</span>
                  {review.created_at && (
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      {formatReviewDate(review.created_at)}
                    </span>
                  )}
                </div>
                <StarDisplay value={review.rating_value} />
              </div>
              {review.description && (
                <p className="text-xs text-stone-600 leading-relaxed">{review.description}</p>
              )}
              {review.reply && (
                <div className="mt-1 pl-3 border-l-2 border-[#0D5C53]/30">
                  <p className="text-[10px] font-semibold text-[#0D5C53] mb-0.5">Response from 7Day Meals</p>
                  <p className="text-[11px] text-stone-600 italic">{review.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  plan,
  onClose,
  onAddToCart,
}) => {
  const [detailData, setDetailData] = useState<ApiMealPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plan) {
      setDetailData(null);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchMealPlanById(plan.id)
      .then((data) => {
        if (isMounted) {
          setDetailData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to fetch meal plan details:', err);
          setError(err.message || 'Could not load details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [plan]);

  // Close on backdrop click
  const handleBackdropClick = () => onClose();

  if (!plan) return null;

  const foodItems: ApiMealPlanFoodItem[] = detailData?.meal_plan_food_item || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner Image */}
        <div className="relative h-48 sm:h-56 bg-stone-100 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={plan.image}
            alt={plan.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badges Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="category">{plan.category}</Badge>
              <Badge variant="success" dot>
                {plan.status}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              {plan.title}
            </h2>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* Description & Price */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <p className="text-stone-600 text-sm leading-relaxed max-w-md">
              {plan.description || detailData?.description || 'Authentic Sri Lankan balanced meal plan.'}
            </p>
            <div className="text-right shrink-0">
              <span className="text-xs text-stone-500 font-medium block">Total Plan Price</span>
              <span className="text-2xl font-extrabold text-[#0D5C53]">
                Rs. {plan.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Included Food Items Section */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#0D5C53]" />
              Included Dishes &amp; Ingredients
            </h3>

            {loading ? (
              <div className="py-8 text-center text-stone-400 text-sm">
                <div className="w-6 h-6 border-2 border-[#0D5C53] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading food items breakdown...
              </div>
            ) : error ? (
              <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl text-xs flex items-center gap-2 border border-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Unable to load detailed item list ({error}). Displaying base menu items.</span>
              </div>
            ) : foodItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {foodItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start gap-3"
                  >
                    {item.food_item.image_path ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.food_item.image_path}
                        alt={item.food_item.item_name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#0D5C53] flex items-center justify-center font-bold text-sm shrink-0">
                        {item.food_item.item_name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.food_item.item_name}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-semibold bg-stone-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {item.day} · {item.meal_type}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                        {item.food_item.ingredient_list || 'Fresh authentic ingredients'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {plan.items.map((itemName, idx) => (
                  <span
                    key={idx}
                    className="bg-stone-100 text-stone-800 text-xs px-3 py-1.5 rounded-xl font-medium border border-stone-200/50"
                  >
                    {itemName}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Delivery & Schedule Info */}
          <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center gap-3 text-xs text-stone-700">
            <Calendar className="w-5 h-5 text-[#0D5C53] shrink-0" />
            <div>
              <span className="font-bold block text-[#0D5C53]">7-Day Fresh Delivery</span>
              Flexible delivery options available during checkout. Delivered hot and fresh.
            </div>
          </div>

          {/* Customer Reviews — Live from API */}
          <ReviewsSection mealId={plan.id} />
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onAddToCart(plan);
              onClose();
            }}
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Add to Cart (Rs. {plan.price})
          </Button>
        </div>
      </div>
    </div>
  );
};
