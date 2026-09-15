'use client';

import React, { useState, useEffect } from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import { fetchMealPlanById, ApiMealPlan, ApiMealPlanFoodItem } from '@/lib/api/meals';
import Badge from '@/components/Badge';
import {
  X,
  Utensils,
  AlertCircle,
} from 'lucide-react';

interface SubscriptionDetailModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  isOpen,
  subscription,
  onClose,
}) => {
  const [detailedMeal, setDetailedMeal] = useState<ApiMealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subscription) {
      setDetailedMeal(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchMealPlanById(subscription.meal_id)
      .then((data) => {
        if (isMounted) {
          setDetailedMeal(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Could not fetch full meal details:', err);
          setError(err?.message || 'Could not load full menu');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const meal = detailedMeal || subscription.meal_plan;
  const foodItems: ApiMealPlanFoodItem[] = detailedMeal?.meal_plan_food_item || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Image & Header */}
        <div className="relative h-48 bg-stone-100 overflow-hidden shrink-0">
          {meal?.image_path ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={meal.image_path}
              alt={meal.item_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-teal-50 flex items-center justify-center text-[#0D5C53]">
              <Utensils className="w-10 h-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Info on Banner */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {meal?.category && <Badge variant="category">{meal.category}</Badge>}
              <Badge variant="success" dot>
                Subscribed Plan
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              {meal?.item_name || `Meal Plan #${subscription.meal_id}`}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Plan Description & Recurring Price */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <p className="text-sm text-stone-600 max-w-lg leading-relaxed">
              {meal?.description ||
                'Enjoy authentic Sri Lankan flavors delivered right to your doorstep with our 7-day revolving meal rotation.'}
            </p>
            <div className="text-right shrink-0">
              <span className="text-xs text-stone-500 font-medium block">Weekly Subscription</span>
              <span className="text-2xl font-extrabold text-[#0D5C53]">
                Rs. {Number(meal?.price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Current Schedule Summary */}
          <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-stone-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-stone-500 block mb-1 font-medium">Next Delivery</span>
              <span className="font-bold text-gray-900">
                {new Date(subscription.delivery_preferred_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-1 font-medium">Time Window</span>
              <span className="font-bold text-gray-900 capitalize">
                {subscription.delivery_time_slot}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block mb-1 font-medium">Schedule Days</span>
              <span className="font-bold text-gray-900">
                {subscription.delivery_days?.length || 7} Days / Week
              </span>
            </div>
          </div>

          {/* Food Items Breakdown */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#0D5C53]" />
              7-Day Menu Dishes & Ingredients
            </h3>

            {loading ? (
              <div className="py-10 text-center text-stone-400 text-sm">
                <div className="w-6 h-6 border-2 border-[#0D5C53] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading weekly dish menu...
              </div>
            ) : error ? (
              <div className="p-4 bg-amber-50 text-amber-800 rounded-2xl text-xs flex items-center gap-2 border border-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Showing base menu preview ({error}).</span>
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
                        <span className="text-[10px] text-stone-500 font-semibold bg-stone-200 px-2 py-0.5 rounded-full">
                          {item.day} • {item.meal_type}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                        {item.food_item.ingredient_list || 'Authentic fresh ingredients'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-stone-50 rounded-2xl text-xs text-stone-600">
                Freshly rotated 7-day balanced dishes prepared daily with locally sourced ingredients.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
