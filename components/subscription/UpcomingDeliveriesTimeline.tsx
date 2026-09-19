'use client';

import React from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import Badge from '@/components/Badge';
import {
  Calendar,
  Truck,
  Sparkles,
  CalendarDays,
} from 'lucide-react';

interface UpcomingDeliveriesTimelineProps {
  subscriptions: Subscription[];
  onEditSchedule: (subscription: Subscription) => void;
}

interface DeliveryCycle {
  id: string;
  cycleWeek: number;
  date: Date;
  subscription: Subscription;
}

export const UpcomingDeliveriesTimeline: React.FC<UpcomingDeliveriesTimelineProps> = ({
  subscriptions,
  onEditSchedule,
}) => {
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status !== 'CANCELLED' && !s.canceled_date
  );

  if (activeSubscriptions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 p-10 text-center">
        <CalendarDays className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
          No Upcoming Deliveries
        </h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          You don't have any active meal subscriptions. Subscribe to a weekly meal plan to schedule automatic deliveries.
        </p>
      </div>
    );
  }

  // Generate 4 weekly recurring delivery cycles based on delivery_preferred_date
  const deliveryCycles: DeliveryCycle[] = [];
  activeSubscriptions.forEach((sub) => {
    const baseDate = new Date(sub.delivery_preferred_date);
    for (let i = 0; i < 4; i++) {
      const cycleDate = new Date(baseDate);
      cycleDate.setDate(baseDate.getDate() + i * 7);

      deliveryCycles.push({
        id: `${sub.subscription_id}-week-${i + 1}`,
        cycleWeek: i + 1,
        date: cycleDate,
        subscription: sub,
      });
    }
  });

  // Sort cycles by date ascending
  deliveryCycles.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6">
      {/* Header & Notice */}
      <div className="bg-teal-50/70 border border-teal-100 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0D5C53] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#0D5C53] text-base">
              4-Week Recurring Delivery Calendar
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Automated delivery orders are placed weekly based on your preferred delivery date.
            </p>
          </div>
        </div>
        <Badge variant="success" dot className="self-start sm:self-auto">
          Automated Deliveries Active
        </Badge>
      </div>

      {/* Delivery Cycles Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveryCycles.map((cycle, index) => {
          const isFirst = index === 0;
          const formattedDate = cycle.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div
              key={cycle.id}
              className={`p-5 rounded-3xl border transition-all duration-200 bg-white relative overflow-hidden flex flex-col justify-between ${
                isFirst
                  ? 'border-teal-300 shadow-sm ring-2 ring-teal-500/10'
                  : 'border-stone-200/80 hover:border-teal-200'
              }`}
            >
              {/* Top Row: Week Indicator & Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    Week {cycle.cycleWeek} Cycle
                  </span>
                  {isFirst && (
                    <span className="text-[10px] font-extrabold text-[#0D5C53] bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0D5C53]" />
                      Next Scheduled Drop
                    </span>
                  )}
                </div>

                <Badge variant={isFirst ? 'success' : 'info'} dot={isFirst}>
                  {isFirst ? 'Scheduled' : 'Upcoming'}
                </Badge>
              </div>

              {/* Middle: Delivery Date & Plan */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
                  <Calendar className="w-4 h-4 text-[#0D5C53] shrink-0" />
                  <span>{formattedDate}</span>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 truncate">
                    {cycle.subscription.meal_plan?.item_name || `Meal Plan #${cycle.subscription.meal_id}`}
                  </span>
                  <span className="font-mono text-stone-500 shrink-0">
                    Rs. {Number(cycle.subscription.meal_plan?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
                <button
                  onClick={() => onEditSchedule(cycle.subscription)}
                  className="text-stone-500 hover:text-[#0D5C53] text-xs font-semibold hover:underline cursor-pointer"
                >
                  Change Delivery Date
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
