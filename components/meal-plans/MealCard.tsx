'use client';

import React from 'react';
import { MealPlan } from '@/lib/data/meal-plans';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { Eye, Repeat } from 'lucide-react';

interface MealCardProps {
  plan: MealPlan;
  onAddToCart: (plan: MealPlan) => void;
  onViewDetails?: (plan: MealPlan) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  plan,
  onAddToCart,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Image Container with Category Badge */}
      <div
        className={`relative w-full h-52 sm:h-56 bg-stone-100 overflow-hidden ${
          onViewDetails ? 'cursor-pointer' : ''
        }`}
        onClick={() => onViewDetails && onViewDetails(plan)}
      >
        {/* Category Badge on Top-Left */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <Badge variant="category">{plan.category}</Badge>
        </div>

        {/* Quick View Button on Hover */}
        {onViewDetails && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <span className="bg-white/95 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5 text-[#0D5C53]" />
              View Details
            </span>
          </div>
        )}

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
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h3
              onClick={() => onViewDetails && onViewDetails(plan)}
              className={`text-lg font-bold text-gray-900 tracking-tight group-hover:text-[#0D5C53] transition-colors ${
                onViewDetails ? 'cursor-pointer' : ''
              }`}
            >
              {plan.title}
            </h3>
            <span className="text-lg font-extrabold text-[#0D5C53] whitespace-nowrap">
              Rs. {plan.price.toLocaleString()}
            </span>
          </div>

          {/* Description Snippet if available */}
          {plan.description && (
            <p className="text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed">
              {plan.description}
            </p>
          )}

          {/* Included Food Items Chips */}
          <div className="flex flex-wrap gap-1.5 min-h-[44px]">
            {plan.items.slice(0, 5).map((item, idx) => (
              <span
                key={idx}
                className="bg-stone-100 text-stone-700 text-[11px] px-2.5 py-1 rounded-md font-medium tracking-tight"
              >
                {item}
              </span>
            ))}
            {plan.items.length > 5 && (
              <span className="bg-stone-100 text-stone-500 text-[11px] px-2 py-1 rounded-md font-medium">
                +{plan.items.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom Action & Status Row */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-2">
          {/* Availability Status */}
          <Badge
            variant={plan.status === 'Available' ? 'success' : 'default'}
            dot
          >
            {plan.status}
          </Badge>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(plan)}
                className="text-stone-500 hover:text-[#0D5C53] text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Details
              </button>
            )}
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
    </div>
  );
};
