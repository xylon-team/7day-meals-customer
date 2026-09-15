'use client';

import React, { useState } from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import Button from '@/components/Button';
import { X, AlertTriangle, AlertCircle, PauseCircle } from 'lucide-react';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onConfirmCancel: (subscriptionId: number, reason: string) => Promise<void>;
  onSwitchToPause: (subscription: Subscription) => void;
}

const CANCEL_REASONS = [
  'I am traveling or taking a break (Try pausing instead!)',
  'Too much food / Portions are too large',
  'Want to try a different meal plan',
  'Delivery schedule or timing was inconvenient',
  'Financial / Cost reasons',
  'Other reason',
];

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  subscription,
  onClose,
  onConfirmCancel,
  onSwitchToPause,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !subscription) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const finalReason = selectedReason === 'Other reason' ? customReason : selectedReason;
      await onConfirmCancel(subscription.subscription_id, finalReason);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Cancel Meal Subscription?
        </h3>

        <p className="text-sm text-stone-600 leading-relaxed mb-4">
          Are you sure you want to cancel your recurring subscription for{' '}
          <strong className="text-gray-900">
            {subscription.meal_plan?.item_name || 'this meal plan'}
          </strong>
          ? All future automated recurring deliveries will be stopped.
        </p>

        {/* Alternative: Suggest Pausing */}
        <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl mb-5 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#0D5C53] block">Going away for a while?</span>
            <span className="text-[11px] text-stone-600">
              You can pause deliveries instead of cancelling and keep your preferences intact.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onSwitchToPause(subscription);
            }}
            className="shrink-0 bg-white hover:bg-teal-50 text-[#0D5C53] border border-teal-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            Pause Instead
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Reason Selection */}
        <div className="mb-6 space-y-2">
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
            Please tell us why you are cancelling:
          </label>
          <div className="space-y-1.5">
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer text-xs text-stone-700"
              >
                <input
                  type="radio"
                  name="cancel_reason"
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="accent-[#0D5C53]"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          {selectedReason === 'Other reason' && (
            <textarea
              rows={2}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Tell us what we could improve..."
              className="w-full px-3.5 py-2 mt-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#0D5C53]"
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Keep Subscription
          </button>

          <Button
            variant="danger"
            size="md"
            disabled={loading}
            onClick={handleConfirm}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Cancelling...</span>
              </div>
            ) : (
              'Confirm Cancellation'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
