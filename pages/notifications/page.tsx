'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Bell, Package, CreditCard, Info } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'orders' | 'subscriptions' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isUnread: boolean;
  iconType: 'package' | 'credit-card' | 'info';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'orders',
    title: 'Order Delivered',
    message: 'Your order #ORD-001 has been delivered successfully. Enjoy your meal!',
    timestamp: '2 hours ago',
    isUnread: true,
    iconType: 'package',
  },
  {
    id: '2',
    type: 'subscriptions',
    title: 'Subscription Renewed',
    message: 'Your Standard Weekly Plan has been renewed for the upcoming week.',
    timestamp: '1 day ago',
    isUnread: false,
    iconType: 'credit-card',
  },
  {
    id: '3',
    type: 'general',
    title: 'New Menu Items',
    message: 'Check out our new authentic Jaffna style curries added to the menu!',
    timestamp: '3 days ago',
    isUnread: false,
    iconType: 'info',
  },
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread' | 'Orders' | 'Subscriptions'>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false }))
    );
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isUnread: !item.isUnread } : item
      )
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'Unread') return item.isUnread;
    if (activeFilter === 'Orders') return item.type === 'orders';
    if (activeFilter === 'Subscriptions') return item.type === 'subscriptions';
    return true;
  });

  const renderIcon = (iconType: NotificationItem['iconType']) => {
    switch (iconType) {
      case 'package':
        return (
          <div className="w-12 h-12 rounded-full bg-[#E6F4F1] text-[#0D5C53] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 stroke-[1.8]" />
          </div>
        );
      case 'credit-card':
        return (
          <div className="w-12 h-12 rounded-full bg-[#E8F6F4] text-[#0D5C53] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 stroke-[1.8]" />
          </div>
        );
      case 'info':
        return (
          <div className="w-12 h-12 rounded-full bg-[#FDE8E8] text-[#C53030] flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 stroke-[1.8]" />
          </div>
        );
    }
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

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center text-stone-500 shadow-2xs">
              No notifications found for this filter.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleRead(item.id)}
                className={`bg-white rounded-2xl p-5 sm:p-6 flex items-start justify-between gap-4 sm:gap-6 shadow-2xs transition-all cursor-pointer ${
                  item.isUnread
                    ? 'border-2 border-[#0D5C53]/60'
                    : 'border border-stone-200/80 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-4 sm:gap-5">
                  {renderIcon(item.iconType)}
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
                    {item.timestamp}
                  </span>
                  {item.isUnread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0D5C53] shrink-0" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
