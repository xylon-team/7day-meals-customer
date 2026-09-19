'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';
import {
  fetchUserNotifications,
  updateNotificationReadStatus,
  ApiNotification,
} from '@/lib/api/notifications';
import { Bell, Package, CreditCard, Info, RefreshCw, LogIn } from 'lucide-react';

const FALLBACK_NOTIFICATIONS: ApiNotification[] = [
  {
    notif_id: 1,
    customer_id: 1,
    title: 'Order Delivered',
    message: 'Your order #ORD-001 has been delivered successfully. Enjoy your meal!',
    type: 'orders',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read_at: null,
  },
  {
    notif_id: 2,
    customer_id: 1,
    title: 'Subscription Renewed',
    message: 'Your Standard Weekly Plan has been renewed for the upcoming week.',
    type: 'subscriptions',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    notif_id: 3,
    customer_id: 1,
    title: 'New Menu Items',
    message: 'Check out our new authentic Jaffna style curries added to the menu!',
    type: 'general',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return 'Just now';

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useStore();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Orders' | 'Subscriptions'>('All');
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadNotifications = useCallback(async (isInitial = false) => {
    if (!user?.customer_id) {
      setNotifications(FALLBACK_NOTIFICATIONS);
      setLoading(false);
      return;
    }

    if (isInitial) {
      setLoading(true);
      setError(null);
    }
    try {
      const data = await fetchUserNotifications(user.customer_id, token);
      setNotifications(data);
    } catch (err: any) {
      console.error('Failed to load notifications from backend:', err);
      if (isInitial) {
        setError(err?.message || 'Failed to load notifications from server.');
        setNotifications(FALLBACK_NOTIFICATIONS);
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, [user?.customer_id, token]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      loadNotifications(true);
      const interval = setInterval(() => {
        loadNotifications(false);
      }, 1000); // Live update every 1 second without page refresh

      return () => clearInterval(interval);
    } else if (mounted && !isAuthenticated) {
      setNotifications(FALLBACK_NOTIFICATIONS);
      setLoading(false);
    }
  }, [mounted, isAuthenticated, loadNotifications]);

  const handleMarkAllAsRead = async () => {
    const unreadItems = notifications.filter((item) => !item.read_at);
    if (unreadItems.length === 0) return;

    // Optimistic UI update
    const nowIso = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read_at: item.read_at ?? nowIso }))
    );

    // Call backend for each unread notification if authenticated
    if (user?.customer_id && token) {
      try {
        await Promise.allSettled(
          unreadItems.map((item) =>
            updateNotificationReadStatus(user.customer_id!, item.notif_id, true, token)
          )
        );
      } catch (err) {
        console.error('Failed to mark all as read on backend:', err);
      }
    }
  };

  const handleToggleRead = async (notifId: number, currentReadAt: string | null) => {
    const newIsRead = !currentReadAt;
    const nowIso = new Date().toISOString();

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((item) =>
        item.notif_id === notifId
          ? { ...item, read_at: newIsRead ? nowIso : null }
          : item
      )
    );

    // Sync with backend if authenticated
    if (user?.customer_id && token) {
      try {
        await updateNotificationReadStatus(user.customer_id, notifId, newIsRead, token);
      } catch (err) {
        console.error('Failed to update read status on backend:', err);
        // Revert on error
        setNotifications((prev) =>
          prev.map((item) =>
            item.notif_id === notifId ? { ...item, read_at: currentReadAt } : item
          )
        );
      }
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    const isUnread = !item.read_at;
    const typeLower = (item.type || '').toLowerCase();

    if (activeFilter === 'Unread') return isUnread;
    if (activeFilter === 'Orders') return typeLower.includes('order');
    if (activeFilter === 'Subscriptions') return typeLower.includes('sub');
    return true;
  });

  const renderIcon = (type: string) => {
    const lowerType = (type || '').toLowerCase();
    if (lowerType.includes('order')) {
      return (
        <div className="w-12 h-12 rounded-full bg-[#E6F4F1] text-[#0D5C53] flex items-center justify-center shrink-0">
          <Package className="w-6 h-6 stroke-[1.8]" />
        </div>
      );
    }
    if (lowerType.includes('sub')) {
      return (
        <div className="w-12 h-12 rounded-full bg-[#E8F6F4] text-[#0D5C53] flex items-center justify-center shrink-0">
          <CreditCard className="w-6 h-6 stroke-[1.8]" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-[#FDE8E8] text-[#C53030] flex items-center justify-center shrink-0">
        <Info className="w-6 h-6 stroke-[1.8]" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900 flex flex-col font-sans">
      <Header activeTab="Notifications" />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#0D5C53] stroke-[1.8]" />
            <h1
              className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Notifications
            </h1>
          </div>

          <button
            onClick={handleMarkAllAsRead}
            className="text-[#0D5C53] hover:text-[#09433D] font-bold text-sm tracking-wide transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-1">
          {(['All', 'Unread', 'Orders', 'Subscriptions'] as const).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-stone-50 border border-stone-200/80 shadow-2xs'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Guest Warning / Unauthenticated Notice */}
        {mounted && !isAuthenticated && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
            <p className="text-sm">
              <span className="font-semibold">Guest View:</span> Log in to your 7Day Meals account to view your live personal notifications.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-[#0D5C53] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#09433D] flex items-center gap-1.5 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" /> Log In
            </button>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-between gap-4">
            <span className="text-sm font-medium">{error}</span>
            <button
              onClick={() => loadNotifications(true)}
              className="text-xs font-bold underline flex items-center gap-1 hover:text-rose-900"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D5C53]" />
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center text-stone-500 shadow-2xs">
                No notifications found for this filter.
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isUnread = !item.read_at;
                return (
                  <div
                    key={item.notif_id}
                    onClick={() => handleToggleRead(item.notif_id, item.read_at)}
                    className={`bg-white rounded-2xl p-5 sm:p-6 flex items-start justify-between gap-4 sm:gap-6 shadow-2xs transition-all cursor-pointer ${
                      isUnread
                        ? 'border-2 border-[#0D5C53]/60'
                        : 'border border-stone-200/80 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      {renderIcon(item.type)}
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                          {item.title}
                        </h2>
                        <p className="text-stone-500 text-sm mt-1 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                      <span className="text-stone-400 text-xs sm:text-sm font-medium">
                        {formatRelativeTime(item.created_at)}
                      </span>
                      {isUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0D5C53] shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
