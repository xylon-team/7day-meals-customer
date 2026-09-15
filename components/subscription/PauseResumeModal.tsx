'use client';

import React, { useState } from 'react';
import { Subscription } from '@/lib/api/subscriptions';
import Button from '@/components/Button';
import { X, PauseCircle, PlayCircle, AlertCircle, Info } from 'lucide-react';

interface PauseResumeModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onConfirm: (subscriptionId: number, isPaused: boolean) => Promise<void>;
}

export const PauseResumeModal: React.FC<PauseResumeModalProps> = ({
  isOpen,
  subscription,
  onClose,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !subscription) return null;

  const isCurrentlyPaused = subscription.status === 'PAUSED';

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(subscription.subscription_id, !isCurrentlyPaused);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update subscription status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isCurrentlyPaused
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            {isCurrentlyPaused ? (
              <PlayCircle className="w-6 h-6" />
            ) : (
              <PauseCircle className="w-6 h-6" />
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          {isCurrentlyPaused ? 'Resume Meal Deliveries?' : 'Pause Meal Deliveries?'}
        </h3>

        <p className="text-sm text-stone-600 leading-relaxed mb-4">
          {isCurrentlyPaused ? (
            <>
              Resuming will reactivate your weekly automated deliveries for{' '}
              <strong className="text-gray-900">
                {subscription.meal_plan?.item_name || 'your meal plan'}
              </strong>
              . Your next delivery cycle will be scheduled for{' '}
              {new Date(subscription.delivery_preferred_date).toLocaleDateString()}.
            </>
          ) : (
            <>
              Pausing puts your upcoming recurring deliveries on hold. You will not be charged while paused, and you can resume anytime without losing your preferences.
            </>
          )}
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 mb-6 flex items-center gap-2.5 text-xs text-stone-600">
          <Info className="w-4 h-4 text-[#0D5C53] shrink-0" />
          <span>You can always adjust your delivery schedule or meal preferences.</span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <Button
            variant={isCurrentlyPaused ? 'primary' : 'secondary'}
            size="md"
            disabled={loading}
            onClick={handleAction}
            className={!isCurrentlyPaused ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : ''}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </div>
            ) : isCurrentlyPaused ? (
              'Resume Deliveries'
            ) : (
              'Pause Deliveries'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
