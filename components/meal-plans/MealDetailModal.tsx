'use client';

import React, { useState, useEffect } from 'react';
import { MealPlan } from '@/lib/data/meal-plans';
import { fetchMealPlanById, ApiMealPlan, ApiMealPlanFoodItem } from '@/lib/api/meals';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { X, Calendar, Utensils, AlertCircle, ShoppingBag } from 'lucide-react';

interface MealDetailModalProps {
  plan: MealPlan | null;
  onClose: () => void;
  onAddToCart: (plan: MealPlan) => void;
}

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

  if (!plan) return null;

  const foodItems: ApiMealPlanFoodItem[] = detailData?.meal_plan_food_item || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner Image */}
        <div className="relative h-48 sm:h-56 bg-stone-100 overflow-hidden">
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
              Included Dishes & Ingredients
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
                        <span className="text-[10px] text-stone-500 font-semibold bg-stone-200 px-2 py-0.5 rounded-full">
                          {item.day} • {item.meal_type}
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
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4">
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
