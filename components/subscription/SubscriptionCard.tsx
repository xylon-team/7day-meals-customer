'use client';

import React from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import {
  Calendar,
  Clock,
  Truck,
  Repeat,
  PauseCircle,
  PlayCircle,
  Settings,
  XCircle,
  Utensils,
  Sparkles,
  Info,
} from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEditSchedule: (subscription: Subscription) => void;
  onTogglePause: (subscription: Subscription) => void;
  onCancel: (subscription: Subscription) => void;
  onViewMenu: (subscription: Subscription) => void;
  onReactivate?: (subscription: Subscription) => void;
}

const TIME_SLOT_LABELS: Record<string, string> = {
  morning: 'Morning (7:00 AM - 9:00 AM)',
  lunch: 'Lunch (11:30 AM - 1:30 PM)',
  dinner: 'Dinner (6:00 PM - 8:00 PM)',
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEditSchedule,
  onTogglePause,
  onCancel,
  onViewMenu,
  onReactivate,
}) => {
  const meal = subscription.meal_plan;
  const isCancelled = subscription.status === 'CANCELLED';
  const isPaused = subscription.status === 'PAUSED';
  const isActive = subscription.status === 'ACTIVE';

  // Calculate days until next delivery
  const nextDelivery = new Date(subscription.delivery_preferred_date);
  const now = new Date();
  const diffTime = nextDelivery.getTime() - now.getTime();
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

  const getStatusBadge = () => {
    if (isActive) {
      return (
        <Badge variant="success" dot className="shadow-xs">
          Active Subscription
        </Badge>
      );
    }
    if (isPaused) {
      return (
        <Badge variant="warning" dot className="shadow-xs">
          Deliveries Paused
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="shadow-xs text-rose-700 bg-rose-50 border-rose-200">
        Cancelled
      </Badge>
    );
  };

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
        isPaused
          ? 'border-amber-200/80 bg-stone-50/30'
          : isCancelled
          ? 'border-stone-200 opacity-80'
          : 'border-stone-200/80 hover:border-teal-200'
      }`}
    >
      {/* Top Banner / Plan Summary */}
      <div className="p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-stone-100">
        <div className="flex items-start sm:items-center gap-4">
          {/* Meal Image Thumbnail */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 shadow-xs">
            {meal?.image_path ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={meal.image_path}
                alt={meal.item_name || 'Meal Plan'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-teal-50 flex items-center justify-center text-[#0D5C53]">
                <Utensils className="w-8 h-8" />
              </div>
            )}
            {/* Recurrence Chip */}
            <div className="absolute bottom-0 inset-x-0 bg-[#0D5C53]/90 text-white text-[9px] font-bold text-center py-0.5 backdrop-blur-xs flex items-center justify-center gap-0.5">
              <Repeat className="w-2.5 h-2.5" />
              Weekly
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              {getStatusBadge()}
              {meal?.category && <Badge variant="category">{meal.category}</Badge>}
              <span className="text-xs text-stone-400 font-mono">
                #SUB-{String(subscription.subscription_id).slice(-4)}
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {meal?.item_name || `Meal Plan #${subscription.meal_id}`}
            </h3>

            <p className="text-xs sm:text-sm text-stone-500 line-clamp-1 mt-0.5">
              {meal?.description || 'Curated 7-day Sri Lankan meal plan with fresh daily delivery.'}
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
            Save 10% on Subscription
          </span>
        </div>
      </div>

      {/* Middle: Recurring Schedule & Delivery Details Grid */}
      <div className="p-6 sm:p-7 bg-[#FAFAF8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 border-b border-stone-100 text-sm">
        {/* Next Scheduled Delivery */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1.5">
            <Calendar className="w-4 h-4 text-[#0D5C53]" />
            <span>Next Scheduled Delivery</span>
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
          {isPaused && (
            <span className="text-[11px] text-amber-700 font-medium mt-1 inline-block">
              Deliveries paused until resumed
            </span>
          )}
          {isCancelled && subscription.canceled_date && (
            <span className="text-[11px] text-stone-400 mt-1 inline-block">
              Cancelled on {formatDeliveryDate(subscription.canceled_date)}
            </span>
          )}
        </div>

        {/* Delivery Time Window */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1.5">
            <Clock className="w-4 h-4 text-[#0D5C53]" />
            <span>Preferred Time Slot</span>
          </div>
          <div className="font-bold text-gray-900 text-sm sm:text-base">
            {TIME_SLOT_LABELS[subscription.delivery_time_slot] || 'Lunch (11:30 AM - 1:30 PM)'}
          </div>
          <span className="text-[11px] text-stone-500 mt-1 inline-block">
            Delivered hot & insulated
          </span>
        </div>

        {/* Weekly Schedule Days */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-2xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-2">
            <Truck className="w-4 h-4 text-[#0D5C53]" />
            <span>Recurring Delivery Days</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const fullDay = {
                Mon: 'Monday',
                Tue: 'Tuesday',
                Wed: 'Wednesday',
                Thu: 'Thursday',
                Fri: 'Friday',
                Sat: 'Saturday',
                Sun: 'Sunday',
              }[day];
              const isIncluded =
                !subscription.delivery_days ||
                subscription.delivery_days.length === 0 ||
                subscription.delivery_days.includes(fullDay!);

              return (
                <span
                  key={day}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    isIncluded
                      ? 'bg-teal-50 text-[#0D5C53] border border-teal-200/60'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {day}
                </span>
              );
            })}
          </div>
          <span className="text-[11px] text-stone-500 mt-1.5 block">
            Frequency: Weekly 7-Day Cycle
          </span>
        </div>
      </div>

      {/* Special Instructions preview if present */}
      {subscription.special_instructions && (
        <div className="px-6 py-3 bg-stone-50/70 border-b border-stone-100 text-xs text-stone-600 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="truncate">
            <strong className="text-stone-700">Delivery Notes:</strong> {subscription.special_instructions}
          </span>
        </div>
      )}

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
              {/* Pause / Resume Button */}
              <Button
                variant={isPaused ? 'primary' : 'outline'}
                size="md"
                onClick={() => onTogglePause(subscription)}
                className="flex-1 sm:flex-initial"
              >
                {isPaused ? (
                  <>
                    <PlayCircle className="w-4 h-4 mr-1.5" />
                    Resume Deliveries
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                    Pause Deliveries
                  </>
                )}
              </Button>

              {/* Edit Schedule Button */}
              <Button
                variant="secondary"
                size="md"
                onClick={() => onEditSchedule(subscription)}
                className="flex-1 sm:flex-initial"
              >
                <Settings className="w-4 h-4 mr-1.5 text-stone-600" />
                Edit Schedule
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
