'use client';

import React, { useState, useEffect } from 'react';
import {
  Subscription,
  UpdateSubscriptionPayload,
} from '@/lib/api/subscriptions';
import Button from '@/components/Button';
import {
  X,
  Calendar,
  Save,
  AlertCircle,
} from 'lucide-react';

interface EditScheduleModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onSave: (subscriptionId: number, payload: UpdateSubscriptionPayload) => Promise<void>;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  subscription,
  onClose,
  onSave,
}) => {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subscription) {
      try {
        const d = new Date(subscription.delivery_preferred_date);
        setDeliveryDate(d.toISOString().split('T')[0]);
      } catch {
        setDeliveryDate('');
      }
      setError(null);
    }
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDate) {
      setError('Please choose a valid preferred delivery date.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSave(subscription.subscription_id, {
        delivery_preferred_date: new Date(deliveryDate).toISOString(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update preferred delivery date.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Subscription Management
            </span>
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              Update Preferred Delivery Date
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Subscribed Meal Summary */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Meal Plan</span>
            <span className="text-xs font-bold text-gray-900">
              {subscription.meal_plan?.item_name || `Meal Plan #${subscription.meal_id}`}
            </span>
          </div>

          {/* Next Delivery Preferred Date */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0D5C53]" />
              Preferred Delivery Date
            </label>
            <input
              type="date"
              value={deliveryDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D5C53] bg-white font-medium"
            />
            <p className="text-[11px] text-stone-500 mt-1.5">
              Updates your scheduled delivery date in the database.
            </p>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>Save Date</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
