'use client';

import React, { useState, useEffect } from 'react';
import { ApiMealPlan } from '@/lib/api/meals';
import {
  CreateSubscriptionPayload,
  DeliveryTimeSlot,
  SubscriptionFrequency,
} from '@/lib/api/subscriptions';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import {
  X,
  Calendar,
  Clock,
  Truck,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Utensils,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

interface SubscribeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMeals: ApiMealPlan[];
  preselectedMealId?: number | null;
  onConfirm: (payload: CreateSubscriptionPayload) => Promise<void>;
}

type WizardStep = 'plan' | 'schedule' | 'confirm';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_SLOTS: { key: DeliveryTimeSlot; label: string; desc: string; icon: string }[] = [
  {
    key: 'morning',
    label: 'Morning Delivery',
    desc: '7:00 AM - 9:00 AM • Great for Breakfast & Lunch prep',
    icon: '🌅',
  },
  {
    key: 'lunch',
    label: 'Lunch Delivery',
    desc: '11:30 AM - 1:30 PM • Delivered hot & ready to eat',
    icon: '☀️',
  },
  {
    key: 'dinner',
    label: 'Evening Delivery',
    desc: '6:00 PM - 8:00 PM • Freshly cooked dinner delivery',
    icon: '🌙',
  },
];

export const SubscribeWizardModal: React.FC<SubscribeWizardModalProps> = ({
  isOpen,
  onClose,
  availableMeals,
  preselectedMealId,
  onConfirm,
}) => {
  const { user } = useStore();
  const [step, setStep] = useState<WizardStep>('plan');

  // Form State
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<DeliveryTimeSlot>('lunch');
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('weekly');
  const [selectedDays, setSelectedDays] = useState<string[]>(DAYS_OF_WEEK);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize minimum start date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setStartDate(dateStr);

    if (user?.address) {
      setDeliveryAddress(user.address);
    }
  }, [user]);

  // Handle preselection
  useEffect(() => {
    if (preselectedMealId) {
      setSelectedMealId(preselectedMealId);
      setStep('schedule');
    } else if (availableMeals.length > 0 && !selectedMealId) {
      setSelectedMealId(availableMeals[0].meal_id);
    }
  }, [preselectedMealId, availableMeals, selectedMealId]);

  if (!isOpen) return null;

  const selectedMeal = availableMeals.find((m) => m.meal_id === selectedMealId);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return; // Must have at least 1 day
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleNext = () => {
    setError(null);
    if (step === 'plan') {
      if (!selectedMealId) {
        setError('Please choose a meal plan to continue.');
        return;
      }
      setStep('schedule');
    } else if (step === 'schedule') {
      if (!startDate) {
        setError('Please select a start date for your recurring deliveries.');
        return;
      }
      setStep('confirm');
    }
  };

  const handleSubmit = async () => {
    if (!selectedMealId || !startDate) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm({
        customer_id: user?.customer_id || 1,
        meal_id: selectedMealId,
        delivery_preferred_date: new Date(startDate).toISOString(),
        delivery_time_slot: timeSlot,
        frequency,
        delivery_days: selectedDays,
        special_instructions: specialInstructions,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Step Wizard Indicator */}
        <div className="p-6 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#0D5C53] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0D5C53]" />
                Automated Meal Subscription
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              {step === 'plan' && 'Choose Your Weekly Meal Plan'}
              {step === 'schedule' && 'Set Recurring Schedule & Preferences'}
              {step === 'confirm' && 'Review & Start Subscription'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-3 bg-stone-100 h-1.5">
          <div
            className={`h-full transition-all duration-300 ${
              step === 'plan' || step === 'schedule' || step === 'confirm'
                ? 'bg-[#0D5C53]'
                : 'bg-stone-200'
            }`}
          />
          <div
            className={`h-full transition-all duration-300 ${
              step === 'schedule' || step === 'confirm' ? 'bg-[#0D5C53]' : 'bg-stone-200'
            }`}
          />
          <div
            className={`h-full transition-all duration-300 ${
              step === 'confirm' ? 'bg-[#0D5C53]' : 'bg-stone-200'
            }`}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PLAN SELECTION */}
          {step === 'plan' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500">
                Select the meal plan you would like delivered automatically every week. You can pause or switch anytime.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableMeals.map((meal) => {
                  const isSelected = selectedMealId === meal.meal_id;
                  return (
                    <div
                      key={meal.meal_id}
                      onClick={() => setSelectedMealId(meal.meal_id)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#0D5C53] bg-teal-50/40 shadow-sm'
                          : 'border-stone-200/80 hover:border-teal-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                          {meal.image_path ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={meal.image_path}
                              alt={meal.item_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-teal-50 flex items-center justify-center text-[#0D5C53]">
                              <Utensils className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <Badge variant="category">{meal.category}</Badge>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#0D5C53] shrink-0" />
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm truncate">
                            {meal.item_name}
                          </h4>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                            {meal.description || 'Nutritious balanced Sri Lankan meal plan.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs text-stone-500 font-medium">Weekly Cost</span>
                        <span className="text-base font-extrabold text-[#0D5C53]">
                          Rs. {Number(meal.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: RECURRING SCHEDULE & PREFERENCES */}
          {step === 'schedule' && (
            <div className="space-y-6">
              {/* Selected Plan Summary Pill */}
              {selectedMeal && (
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                      {selectedMeal.image_path && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={selectedMeal.image_path}
                          alt={selectedMeal.item_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        {selectedMeal.item_name}
                      </span>
                      <span className="text-[11px] text-[#0D5C53] font-semibold">
                        Rs. {Number(selectedMeal.price).toLocaleString()} / week
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('plan')}
                    className="text-xs text-stone-500 hover:text-[#0D5C53] font-semibold underline cursor-pointer"
                  >
                    Change Plan
                  </button>
                </div>
              )}

              {/* Start Date */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0D5C53]" />
                  First Delivery Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C53] bg-white font-medium"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Deliveries recur every 7 days from this date.
                </p>
              </div>

              {/* Preferred Time Slot */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0D5C53]" />
                  Preferred Delivery Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = timeSlot === slot.key;
                    return (
                      <div
                        key={slot.key}
                        onClick={() => setTimeSlot(slot.key)}
                        className={`p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'border-[#0D5C53] bg-teal-50/40 text-gray-900 font-semibold'
                            : 'border-stone-200/80 hover:border-teal-200 text-stone-600'
                        }`}
                      >
                        <div className="text-xl mb-1">{slot.icon}</div>
                        <div className="text-xs font-bold">{slot.label}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">{slot.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recurring Delivery Days */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#0D5C53]" />
                  Weekly Delivery Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D5C53] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Delivery Instructions */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Special Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Leave with apartment security, ring doorbell twice, less spicy..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C53] bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 'confirm' && (
            <div className="space-y-6">
              {/* Order Summary Card */}
              <div className="bg-[#FAFAF8] rounded-2xl border border-stone-200/80 p-5 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm border-b border-stone-200 pb-2 flex items-center justify-between">
                  <span>Subscription Summary</span>
                  <Badge variant="success" dot>
                    Ready to Activate
                  </Badge>
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">Selected Plan:</span>
                  <span className="text-xs font-bold text-gray-900">
                    {selectedMeal?.item_name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">First Delivery:</span>
                  <span className="text-xs font-bold text-gray-900">
                    {new Date(startDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">Time Window:</span>
                  <span className="text-xs font-bold text-gray-900 capitalize">
                    {timeSlot} (
                    {timeSlot === 'morning'
                      ? '7:00 AM - 9:00 AM'
                      : timeSlot === 'lunch'
                      ? '11:30 AM - 1:30 PM'
                      : '6:00 PM - 8:00 PM'}
                    )
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">Delivery Days:</span>
                  <span className="text-xs font-bold text-gray-900">
                    {selectedDays.length === 7 ? 'Everyday (7 Days)' : `${selectedDays.length} Days/Week`}
                  </span>
                </div>

                {specialInstructions && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs text-stone-600">Notes:</span>
                    <span className="text-xs font-medium text-stone-800 text-right">
                      {specialInstructions}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Weekly Total</span>
                    <span className="text-[10px] text-stone-500">Includes all taxes & delivery</span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#0D5C53]">
                    Rs. {Number(selectedMeal?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Subscriber Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2.5 text-xs text-stone-700">
                  <ShieldCheck className="w-5 h-5 text-[#0D5C53] shrink-0" />
                  <span>Pause, reschedule, or cancel anytime with one click.</span>
                </div>
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2.5 text-xs text-stone-700">
                  <Sparkles className="w-5 h-5 text-[#0D5C53] shrink-0" />
                  <span>Fresh eco-insulated packaging delivered daily.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          {step !== 'plan' ? (
            <button
              type="button"
              onClick={() => setStep(step === 'confirm' ? 'schedule' : 'plan')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2.5 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step !== 'confirm' ? (
            <Button variant="primary" size="md" onClick={handleNext}>
              <span>Continue</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activating Subscription...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Activate Subscription</span>
                </div>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
