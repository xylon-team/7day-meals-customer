'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import { fetchMealPlans, ApiMealPlan } from '@/lib/api/meals';
import {
  Subscription,
  fetchUserSubscriptions,
  createSubscription,
  updateSubscriptionSchedule,
  cancelSubscription,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
} from '@/lib/api/subscriptions';

import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { UpcomingDeliveriesTimeline } from '@/components/subscription/UpcomingDeliveriesTimeline';
import { SubscribeWizardModal } from '@/components/subscription/SubscribeWizardModal';
import { EditScheduleModal } from '@/components/subscription/EditScheduleModal';
import { PauseResumeModal } from '@/components/subscription/PauseResumeModal';
import { CancelSubscriptionModal } from '@/components/subscription/CancelSubscriptionModal';
import { SubscriptionDetailModal } from '@/components/subscription/SubscriptionDetailModal';

import {
  Repeat,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Utensils,
  History,
  CalendarDays,
  Flame,
} from 'lucide-react';

type TabType = 'active' | 'timeline' | 'explore' | 'history';

export default function SubscriptionPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, cart } = useStore();
  const [mounted, setMounted] = useState(false);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [availableMeals, setAvailableMeals] = useState<ApiMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('active');

  // Modal States
  const [isSubscribeWizardOpen, setIsSubscribeWizardOpen] = useState(false);
  const [wizardPreselectedMealId, setWizardPreselectedMealId] = useState<number | null>(null);

  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [pauseResumeSub, setPauseResumeSub] = useState<Subscription | null>(null);
  const [cancellingSub, setCancellingSub] = useState<Subscription | null>(null);
  const [viewingDetailSub, setViewingDetailSub] = useState<Subscription | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load subscriptions & available meal plans from real backend
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const mealsData = await fetchMealPlans().catch(() => []);
      setAvailableMeals(mealsData);

      if (user?.customer_id && token) {
        const subsData = await fetchUserSubscriptions(user.customer_id, token);
        setSubscriptions(subsData);
      } else {
        setSubscriptions([]);
      }
    } catch (err: any) {
      console.error('Failed to load subscription data:', err);
      setError(err?.message || 'Failed to load subscription information.');
    } finally {
      setLoading(false);
    }
  }, [user?.customer_id, token]);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      loadData();
    }
  }, [mounted, isAuthenticated, loadData, router]);

  // Derived collections
  const activeSubs = useMemo(
    () => subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'PAUSED'),
    [subscriptions]
  );

  const cancelledSubs = useMemo(
    () => subscriptions.filter((s) => s.status === 'CANCELLED'),
    [subscriptions]
  );

  // Metrics
  const totalWeeklySpend = useMemo(() => {
    return activeSubs
      .filter((s) => s.status === 'ACTIVE')
      .reduce((sum, s) => sum + Number(s.meal_plan?.price || 0), 0);
  }, [activeSubs]);

  const nextUpcomingDelivery = useMemo(() => {
    const activeOnly = activeSubs.filter((s) => s.status === 'ACTIVE');
    if (activeOnly.length === 0) return null;
    const sorted = [...activeOnly].sort(
      (a, b) =>
        new Date(a.delivery_preferred_date).getTime() -
        new Date(b.delivery_preferred_date).getTime()
    );
    return sorted[0];
  }, [activeSubs]);

  // Handlers
  const handleCreateSubscription = async (payload: CreateSubscriptionPayload) => {
    if (!user?.customer_id || !token) {
      router.push('/login');
      return;
    }
    const created = await createSubscription(user.customer_id, payload, token);
    setSubscriptions((prev) => [created, ...prev]);
    showToast(`Weekly subscription for "${created.meal_plan?.item_name || 'meal plan'}" activated!`);
    setActiveTab('active');
  };

  const handleSaveSchedule = async (
    subscriptionId: number,
    payload: UpdateSubscriptionPayload
  ) => {
    if (!user?.customer_id || !token) {
      showToast('Please login to update your schedule', 'info');
      return;
    }
    if (!payload.delivery_preferred_date) return;

    const updated = await updateSubscriptionSchedule(
      user.customer_id,
      subscriptionId,
      payload.delivery_preferred_date,
      token
    );
    setSubscriptions((prev) =>
      prev.map((s) => (s.subscription_id === subscriptionId ? { ...s, ...updated } : s))
    );
    showToast('Delivery schedule updated successfully!');
  };

  const handleTogglePause = async (subscriptionId: number, isPaused: boolean) => {
    // Local pause simulation if needed
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.subscription_id === subscriptionId
          ? { ...s, status: isPaused ? 'PAUSED' : 'ACTIVE' }
          : s
      )
    );
    showToast(
      isPaused
        ? 'Subscription paused. Deliveries on hold.'
        : 'Subscription resumed! Automated deliveries active.'
    );
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    if (!user?.customer_id || !token) {
      showToast('Please login to cancel subscription', 'info');
      return;
    }
    const updated = await cancelSubscription(user.customer_id, subscriptionId, token);
    setSubscriptions((prev) =>
      prev.map((s) => (s.subscription_id === subscriptionId ? { ...s, ...updated } : s))
    );
    showToast('Subscription cancelled.', 'info');
  };

  const handleReactivate = (subscription: Subscription) => {
    setWizardPreselectedMealId(subscription.meal_id);
    setIsSubscribeWizardOpen(true);
  };

  const openSubscribeForMeal = (mealId: number) => {
    setWizardPreselectedMealId(mealId);
    setIsSubscribeWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900 flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
      {/* Navigation Header */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        activeTab="Subscription"
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D5C53] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium border border-teal-600/40 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-teal-200" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Page Title & Top CTA Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#0D5C53] bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60 uppercase tracking-wider flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-[#0D5C53]" />
                Automated Meal Deliveries
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Meal Subscriptions
            </h1>
            <p className="mt-1 text-stone-600 text-sm sm:text-base">
              Manage your recurring weekly Sri Lankan meal deliveries and delivery schedules.
            </p>
          </div>

          {/* Quick Action Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setWizardPreselectedMealId(null);
              setIsSubscribeWizardOpen(true);
            }}
            className="self-start md:self-auto shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            New Subscription
          </Button>
        </div>

        {/* Top Metrics Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Subscriptions */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0D5C53] flex items-center justify-center shrink-0">
              <Repeat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Active Plans
              </span>
              <span className="text-2xl font-extrabold text-gray-900">
                {activeSubs.filter((s) => s.status === 'ACTIVE').length}
              </span>
              <span className="text-[10px] text-stone-400 block">
                {activeSubs.filter((s) => s.status === 'PAUSED').length} paused
              </span>
            </div>
          </div>

          {/* Card 2: Next Delivery */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Next Drop-off
              </span>
              <span className="text-sm font-bold text-gray-900 block truncate max-w-[140px]">
                {nextUpcomingDelivery
                  ? new Date(nextUpcomingDelivery.delivery_preferred_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'No scheduled drops'}
              </span>
              <span className="text-[10px] text-[#0D5C53] font-semibold">
                {nextUpcomingDelivery ? `${nextUpcomingDelivery.delivery_time_slot} slot` : 'All caught up'}
              </span>
            </div>
          </div>

          {/* Card 3: Weekly Recurring Total */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Weekly Total
              </span>
              <span className="text-xl font-extrabold text-[#0D5C53]">
                Rs. {totalWeeklySpend.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium block">
                Auto-renews weekly
              </span>
            </div>
          </div>

          {/* Card 4: Subscriber Perks */}
          <div className="bg-gradient-to-br from-[#0D5C53] to-[#083E38] text-white p-5 rounded-3xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">
                Subscriber Perk
              </span>
              <Sparkles className="w-4 h-4 text-teal-300" />
            </div>
            <div className="my-1">
              <div className="text-sm font-bold leading-tight">10% Weekly Discount</div>
              <div className="text-[10px] text-teal-100/90 mt-0.5">Free hot-box delivery included</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200/80 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3.5 px-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'text-[#0D5C53]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>Active Subscriptions</span>
            {activeSubs.length > 0 && (
              <span className="bg-teal-100 text-[#0D5C53] text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activeSubs.length}
              </span>
            )}
            {activeTab === 'active' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C53] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-3.5 px-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'text-[#0D5C53]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Upcoming Deliveries Timeline</span>
            {activeTab === 'timeline' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C53] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`pb-3.5 px-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'explore'
                ? 'text-[#0D5C53]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Explore Meal Plans</span>
            {activeTab === 'explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C53] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3.5 px-4 text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'text-[#0D5C53]'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Subscription History</span>
            {cancelledSubs.length > 0 && (
              <span className="bg-stone-200 text-stone-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {cancelledSubs.length}
              </span>
            )}
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C53] rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {loading ? (
            <div className="py-20 text-center text-stone-400 text-sm">
              <div className="w-8 h-8 border-3 border-[#0D5C53] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading your meal subscriptions...
            </div>
          ) : error ? (
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              {/* TAB 1: ACTIVE SUBSCRIPTIONS */}
              {activeTab === 'active' && (
                <div className="space-y-6">
                  {activeSubs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-xl mx-auto shadow-xs">
                      <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#0D5C53] flex items-center justify-center mx-auto mb-4">
                        <Repeat className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                        No Active Meal Subscriptions
                      </h3>
                      <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                        Automate your weekly Sri Lankan meals! Choose a meal plan, pick your preferred delivery time, and enjoy fresh hot meals delivered right to your door every week.
                      </p>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          setWizardPreselectedMealId(null);
                          setIsSubscribeWizardOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Start Your First Subscription
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {activeSubs.map((sub) => (
                        <SubscriptionCard
                          key={sub.subscription_id}
                          subscription={sub}
                          onEditSchedule={(s) => setEditingSub(s)}
                          onTogglePause={(s) => setPauseResumeSub(s)}
                          onCancel={(s) => setCancellingSub(s)}
                          onViewMenu={(s) => setViewingDetailSub(s)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: UPCOMING DELIVERIES TIMELINE */}
              {activeTab === 'timeline' && (
                <UpcomingDeliveriesTimeline
                  subscriptions={activeSubs}
                  onEditSchedule={(s) => setEditingSub(s)}
                />
              )}

              {/* TAB 3: EXPLORE & SUBSCRIBE */}
              {activeTab === 'explore' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-900">
                        Available Weekly Meal Plans
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Choose any plan below to start a recurring weekly subscription.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableMeals.map((meal) => (
                      <div
                        key={meal.meal_id}
                        className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                      >
                        <div className="relative h-48 bg-stone-100 overflow-hidden">
                          {meal.image_path ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={meal.image_path}
                              alt={meal.item_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-teal-50 flex items-center justify-center text-[#0D5C53]">
                              <Utensils className="w-10 h-10" />
                            </div>
                          )}
                          <div className="absolute top-3.5 left-3.5">
                            <Badge variant="category">{meal.category}</Badge>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex items-baseline justify-between gap-2 mb-1.5">
                              <h4 className="font-bold text-gray-900 text-lg group-hover:text-[#0D5C53] transition-colors">
                                {meal.item_name}
                              </h4>
                              <span className="text-lg font-extrabold text-[#0D5C53] shrink-0">
                                Rs. {Number(meal.price).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-2">
                              {meal.description || 'Nutritious balanced Sri Lankan 7-day meal plan.'}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                              Save 10% Weekly
                            </span>
                            <Button
                              variant="primary"
                              size="md"
                              onClick={() => openSubscribeForMeal(meal.meal_id)}
                            >
                              <Repeat className="w-3.5 h-3.5 mr-1" />
                              Subscribe Weekly
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SUBSCRIPTION HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  {cancelledSubs.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-stone-200/80 p-10 text-center text-stone-500 text-sm">
                      <History className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                      <h4 className="font-bold text-gray-900 mb-1">No Subscription History</h4>
                      <p className="text-xs text-stone-400">
                        Past and cancelled subscriptions will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cancelledSubs.map((sub) => (
                        <SubscriptionCard
                          key={sub.subscription_id}
                          subscription={sub}
                          onEditSchedule={() => {}}
                          onTogglePause={() => {}}
                          onCancel={() => {}}
                          onViewMenu={(s) => setViewingDetailSub(s)}
                          onReactivate={(s) => handleReactivate(s)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* MODALS */}
      <SubscribeWizardModal
        isOpen={isSubscribeWizardOpen}
        onClose={() => setIsSubscribeWizardOpen(false)}
        availableMeals={availableMeals}
        preselectedMealId={wizardPreselectedMealId}
        onConfirm={handleCreateSubscription}
      />

      <EditScheduleModal
        isOpen={Boolean(editingSub)}
        subscription={editingSub}
        onClose={() => setEditingSub(null)}
        onSave={handleSaveSchedule}
      />

      <PauseResumeModal
        isOpen={Boolean(pauseResumeSub)}
        subscription={pauseResumeSub}
        onClose={() => setPauseResumeSub(null)}
        onConfirm={handleTogglePause}
      />

      <CancelSubscriptionModal
        isOpen={Boolean(cancellingSub)}
        subscription={cancellingSub}
        onClose={() => setCancellingSub(null)}
        onConfirmCancel={handleCancelSubscription}
        onSwitchToPause={(s) => {
          setCancellingSub(null);
          setPauseResumeSub(s);
        }}
      />

      <SubscriptionDetailModal
        isOpen={Boolean(viewingDetailSub)}
        subscription={viewingDetailSub}
        onClose={() => setViewingDetailSub(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
