'use client';

import React, { useState, useEffect } from 'react';
import { ApiMealPlan, getMealImage } from '@/lib/api/meals';
import { CreateSubscriptionPayload } from '@/lib/api/subscriptions';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import {
  X,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Utensils,
  AlertCircle,
} from 'lucide-react';

interface SubscribeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMeals: ApiMealPlan[];
  preselectedMealId?: number | null;
  onConfirm: (payload: CreateSubscriptionPayload) => Promise<void>;
}

type WizardStep = 'plan' | 'schedule' | 'confirm';

export const SubscribeWizardModal: React.FC<SubscribeWizardModalProps> = ({
  isOpen,
  onClose,
  availableMeals,
  preselectedMealId,
  onConfirm,
}) => {
  const [step, setStep] = useState<WizardStep>('plan');

  // Form State (strictly fields saved to DB)
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize minimum start date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setStartDate(dateStr);
  }, []);

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

  const handleNext = () => {
    setError(null);
    if (step === 'plan') {
      if (!selectedMealId) {
        setError('Please choose a meal plan to continue.');
      } else {
        setStep('schedule');
      }
    } else if (step === 'schedule') {
      if (!startDate) {
        setError('Please select a preferred delivery start date.');
      } else {
        setStep('confirm');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedMealId || !startDate) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm({
        meal_id: selectedMealId,
        delivery_preferred_date: new Date(startDate).toISOString(),
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
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Step Wizard Indicator */}
        <div className="p-6 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-[#0D5C53] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0D5C53]" />
                Meal Subscription
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              {step === 'plan' && 'Choose Your Meal Plan'}
              {step === 'schedule' && 'Set Preferred Delivery Date'}
              {step === 'confirm' && 'Review & Confirm Subscription'}
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
                Select the meal plan you want to subscribe to. Deliveries will repeat automatically every 7 days.
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getMealImage(meal)}
                            alt={meal.item_name}
                            className="w-full h-full object-cover"
                          />
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
                            {meal.description || 'Nutritious balanced meal plan.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs text-stone-500 font-medium">Price</span>
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

          {/* STEP 2: PREFERRED DELIVERY DATE */}
          {step === 'schedule' && (
            <div className="space-y-6">
              {/* Selected Plan Summary Pill */}
              {selectedMeal && (
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMealImage(selectedMeal)}
                        alt={selectedMeal.item_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        {selectedMeal.item_name}
                      </span>
                      <span className="text-[11px] text-[#0D5C53] font-semibold">
                        Rs. {Number(selectedMeal.price).toLocaleString()}
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
                  Preferred Delivery Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C53] bg-white font-medium"
                />
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Your first recurring delivery order will be scheduled for this date.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 'confirm' && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-[#FAFAF8] rounded-2xl border border-stone-200/80 p-5 space-y-4">
                <h4 className="font-bold text-gray-900 text-sm border-b border-stone-200 pb-2 flex items-center justify-between">
                  <span>Subscription Summary</span>
                  <Badge variant="success" dot>
                    Ready to Activate
                  </Badge>
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">Selected Meal Plan:</span>
                  <span className="text-xs font-bold text-gray-900">
                    {selectedMeal?.item_name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">First Delivery Date:</span>
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
                  <span className="text-xs text-stone-600">Recurrence:</span>
                  <span className="text-xs font-bold text-gray-900">
                    Weekly (Every 7 Days)
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Total Amount</span>
                    <span className="text-[10px] text-stone-500">Per weekly delivery</span>
                  </div>
                  <span className="text-2xl font-extrabold text-[#0D5C53]">
                    Rs. {Number(selectedMeal?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Benefits Banner */}
              <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-2.5 text-xs text-stone-700">
                <ShieldCheck className="w-5 h-5 text-[#0D5C53] shrink-0" />
                <span>Automated weekly delivery order is created on your preferred date.</span>
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
                  <span>Creating Subscription...</span>
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
