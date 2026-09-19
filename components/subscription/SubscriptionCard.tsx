'use client';

import React from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import { getMealImage } from '@/lib/api/meals';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import {
  Calendar,
  CalendarDays,
  Repeat,
  Settings,
  XCircle,
  Utensils,
  PlayCircle,
  Sparkles,
} from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEditSchedule: (subscription: Subscription) => void;
  onCancel: (subscription: Subscription) => void;
  onViewMenu: (subscription: Subscription) => void;
  onReactivate?: (subscription: Subscription) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEditSchedule,
  onCancel,
  onViewMenu,
  onReactivate,
}) => {
  const meal = subscription.meal_plan;
  const isCancelled = subscription.status === 'CANCELLED' || Boolean(subscription.canceled_date);
  const isActive = !isCancelled;

  // Calculate days until delivery
  const deliveryDate = new Date(subscription.delivery_preferred_date);
  const now = new Date();
  const diffTime = deliveryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formatDeliveryDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
        isCancelled
          ? 'border-stone-200 opacity-80'
          : 'border-stone-200/80 hover:border-teal-200'
      }`}
    >
      {/* Top Banner / Plan Summary */}
      <div className="p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-stone-100">
        <div className="flex items-start sm:items-center gap-4">
          {/* Meal Image Thumbnail */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getMealImage(meal)}
              alt={meal?.item_name || 'Meal Plan'}
              className="w-full h-full object-cover"
            />
            {/* Recurrence Chip */}
            <div className="absolute bottom-0 inset-x-0 bg-[#0D5C53]/90 text-white text-[9px] font-bold text-center py-0.5 backdrop-blur-xs flex items-center justify-center gap-0.5">
              <Repeat className="w-2.5 h-2.5" />
              Weekly
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              {isActive ? (
                <Badge variant="success" dot className="shadow-xs">
                  Active Subscription
                </Badge>
              ) : (
                <Badge variant="default" className="shadow-xs text-rose-700 bg-rose-50 border-rose-200">
                  Cancelled
                </Badge>
              )}
              {meal?.category && <Badge variant="category">{meal.category}</Badge>}
              <span className="text-xs text-stone-400 font-mono">
                #SUB-{String(subscription.subscription_id).slice(-4)}
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {meal?.item_name || `Meal Plan #${subscription.meal_id}`}
            </h3>

            <p className="text-xs sm:text-sm text-stone-500 line-clamp-1 mt-0.5">
              {meal?.description || 'Curated 7-day Sri Lankan meal plan with recurring automated deliveries.'}
            </p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="text-left md:text-right shrink-0 bg-stone-50 md:bg-transparent p-3.5 md:p-0 rounded-2xl w-full md:w-auto flex md:flex-col justify-between items-center md:items-end border md:border-0 border-stone-100">
          <div>
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
              Recurring Amount
            </span>
            <div className="flex items-baseline md:justify-end gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0D5C53] tracking-tight">
                Rs. {meal?.price ? Number(meal.price).toLocaleString() : 'N/A'}
              </span>
              <span className="text-xs text-stone-500 font-medium">/ week</span>
            </div>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Automated Delivery
          </span>
        </div>
      </div>

      {/* Middle: Database Dates Grid */}
      <div className="p-6 sm:p-7 bg-[#FAFAF8] grid grid-cols-1 sm:grid-cols-3 gap-5 border-b border-stone-100 text-sm">
        {/* Preferred Delivery Date */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1.5">
            <Calendar className="w-4 h-4 text-[#0D5C53]" />
            <span>Preferred Delivery Date</span>
          </div>
          <div className="font-bold text-gray-900 text-base">
            {formatDeliveryDate(subscription.delivery_preferred_date)}
          </div>
          {isActive && (
            <span className="text-[11px] text-teal-700 font-medium mt-1 inline-block">
              {diffDays <= 0
                ? 'Delivery scheduled for today!'
                : diffDays === 1
                ? 'Arriving tomorrow'
                : `In ${diffDays} days`}
            </span>
          )}
          {isCancelled && subscription.canceled_date && (
            <span className="text-[11px] text-stone-400 mt-1 inline-block">
              Cancelled on {formatDeliveryDate(subscription.canceled_date)}
            </span>
          )}
        </div>

        {/* Next Delivery Date */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1.5">
            <CalendarDays className="w-4 h-4 text-[#0D5C53]" />
            <span>Next Cycle Delivery</span>
          </div>
          <div className="font-bold text-gray-900 text-base">
            {subscription.next_delivery_date
              ? formatDeliveryDate(subscription.next_delivery_date)
              : formatDeliveryDate(
                  new Date(
                    new Date(subscription.delivery_preferred_date).getTime() +
                      7 * 24 * 60 * 60 * 1000
                  ).toISOString()
                )}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 inline-block">
            Auto-renews every 7 days
          </span>
        </div>

        {/* Subscribe Date */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1.5">
            <Repeat className="w-4 h-4 text-[#0D5C53]" />
            <span>Subscribed Since</span>
          </div>
          <div className="font-bold text-gray-900 text-base">
            {formatDeliveryDate(subscription.subscribe_date)}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 inline-block">
            Orders created automatically
          </span>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="p-5 sm:p-6 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left Secondary Action */}
        <button
          onClick={() => onViewMenu(subscription)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#0D5C53] bg-stone-100 hover:bg-stone-200/70 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <Utensils className="w-3.5 h-3.5 text-[#0D5C53]" />
          View 7-Day Menu
        </button>

        {/* Right Management Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isCancelled ? (
            <>
              {/* Edit Preferred Delivery Date */}
              <Button
                variant="secondary"
                size="md"
                onClick={() => onEditSchedule(subscription)}
                className="flex-1 sm:flex-initial"
              >
                <Settings className="w-4 h-4 mr-1.5 text-stone-600" />
                Edit Delivery Date
              </Button>

              {/* Cancel Button */}
              <button
                onClick={() => onCancel(subscription)}
                className="text-stone-400 hover:text-rose-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer flex items-center justify-center gap-1"
                title="Cancel Subscription"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </>
          ) : (
            onReactivate && (
              <Button
                variant="primary"
                size="md"
                onClick={() => onReactivate(subscription)}
                className="flex-1 sm:flex-initial"
              >
                <PlayCircle className="w-4 h-4 mr-1.5" />
                Reactivate Subscription
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
