'use client';

import React from 'react';
import { MealPlan } from '@/lib/data/meal-plans';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

interface MealCardProps {
  plan: MealPlan;
  onAddToCart: (plan: MealPlan) => void;
}

export const MealCard: React.FC<MealCardProps> = ({ plan, onAddToCart }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Top Image Container with Category Badge */}
      <div className="relative w-full h-52 sm:h-56 bg-stone-100 overflow-hidden">
        {/* Category Badge on Top-Left */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <Badge variant="category">
            {plan.category}
          </Badge>
        </div>

        {/* Meal Food Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={plan.image}
          alt={plan.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Title and Price Row */}
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-[#0D5C53] transition-colors">
              {plan.title}
            </h3>
            <span className="text-lg font-extrabold text-[#0D5C53] whitespace-nowrap">
              Rs. {plan.price}
            </span>
          </div>

          {/* Included Food Items Chips */}
          <div className="flex flex-wrap gap-1.5 min-h-[52px]">
            {plan.items.map((item, idx) => (
              <span
                key={idx}
                className="bg-stone-100 text-stone-700 text-[11px] px-2.5 py-1 rounded-md font-medium tracking-tight"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Action & Status Row */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-2">
          {/* Availability Status */}
          <Badge variant="success" dot>
            Available
          </Badge>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => onAddToCart(plan)}
          >
            Add to Cart
          </Button>
        </div>

      </div>

    </div>
  );
};

export default MealCard;
