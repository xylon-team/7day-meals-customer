'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import {
  User,
  Shield,
  Bell,
  AlertTriangle,
  Save,
  CheckCircle2,
  Lock,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { user, token, updateUser, updateToken, updateNotifications, resetStore } = useStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [mounted, setMounted] = useState(false);

  // Personal Info Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification / Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Danger Zone confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and Email are required.', 'error');
      return;
    }
    updateUser({ name, email, phone, address });
    showToast('Personal information saved successfully!');
  };


  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }

    if (!token) {
      showToast('You are not authenticated. Please log in again.', 'error');
      return;
    }

    try {
      const { apiChangePassword } = await import('@/lib/api/auth');
      const result = await apiChangePassword(
        { current_password: currentPassword, new_password: newPassword },
        token,
      );
      // Backend returns a fresh token after password change
      updateToken(result.access_token);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully!');
    } catch (err: any) {
      showToast(err.message ?? 'Failed to update password. Please try again.', 'error');
    }
  };

  const handleToggleNotification = (key: keyof typeof user.notifications) => {
    const updatedVal = !user.notifications[key];
    updateNotifications({ [key]: updatedVal });
    showToast('Notification settings updated!');
  };

  const handleDeleteAccount = () => {
    resetStore();
    setShowDeleteModal(false);
    showToast('Account successfully deleted (simulated reset).');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#0D5C53] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: User,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900 flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium border animate-slide-up ${toastType === 'success'
              ? 'bg-[#0D5C53] text-white border-teal-600/40'
              : 'bg-rose-600 text-white border-rose-500'
            }`}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-teal-200" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-200" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header activeTab="Profile" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-950">
            Profile Settings
          </h1>
          <p className="mt-1.5 text-stone-500 text-sm">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-5 py-4.5 text-[13px] font-bold transition-all duration-200 justify-start w-full border-l-4 cursor-pointer ${
                      isActive
                        ? 'bg-[#E7EFED] text-[#0D7377] border-[#0D7377]'
                        : 'text-stone-500 hover:bg-stone-50 hover:text-gray-900 border-transparent'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#0D7377]' : 'text-stone-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          {/* Content Card */}
          <div className="flex-1 bg-white rounded-2xl border border-stone-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 md:p-8">

              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-2xl font-bold text-gray-950 mb-6">
                    Personal Information
                  </h2>

                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-22 h-22 bg-[#00b4a2] text-gray-950 rounded-full flex items-center justify-center font-bold text-3xl select-none shrink-0 shadow-sm">
                      {name ? name.charAt(0).toUpperCase() : 'K'}
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <button className="bg-[#F2F1EC] hover:bg-[#EAE9E4] text-stone-800 font-bold px-4.5 py-2.5 rounded-full text-xs transition-colors cursor-pointer shadow-sm">
                        Change Avatar
                      </button>
                      <p className="text-[10px] text-stone-400 font-medium">
                        JPG, GIF or PNG. Max size of 800K
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSavePersonalInfo} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-950 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Kasun Peiris"
                          className="w-full bg-[#F5F4F0] border border-transparent rounded-xl px-4.5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#0D5C53] focus:ring-2 focus:ring-[#0D5C53]/10 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-950 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. kasun@example.com"
                          className="w-full bg-[#F5F4F0] border border-transparent rounded-xl px-4.5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#0D5C53] focus:ring-2 focus:ring-[#0D5C53]/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-950 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +94 77 123 4567"
                          className="w-full bg-[#F5F4F0] border border-transparent rounded-xl px-4.5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#0D5C53] focus:ring-2 focus:ring-[#0D5C53]/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-950 mb-2">
                        Default Delivery Address
                      </label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 123 Galle Road, Colombo 03, Sri Lanka"
                        className="w-full bg-[#F5F4F0] border border-transparent rounded-xl px-4.5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#0D5C53] focus:ring-2 focus:ring-[#0D5C53]/10 transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="pt-6 border-t border-stone-200/50 flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#0D5C53] hover:bg-[#09433D] text-white font-bold px-6 py-3.5 rounded-full text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors active:scale-95 duration-150"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-2xl font-bold text-gray-950 mb-6">
                    Security Settings
                  </h2>

                  <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-xs font-bold text-gray-950 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F5F4F0] border border-transparent rounded-xl px-4.5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#0D5C53] focus:ring-2 focus:ring-[#0D5C53]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-950 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F5F4F0] border border-transparent rounded-xl px-4.5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#0D5C53] focus:ring-2 focus:ring-[#0D5C53]/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-950 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#F5F4F0] border border-transparent rounded-xl px-4.5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-[#0D5C53] focus:ring-2 focus:ring-[#0D5C53]/10 transition-all"
                      />
                    </div>

                    <div className="pt-6 border-t border-stone-200/50 flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#0D5C53] hover:bg-[#09433D] text-white font-bold px-6 py-3.5 rounded-full text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-colors active:scale-95 duration-150"
                      >
                        <Lock className="w-4 h-4" /> Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-2xl font-bold text-gray-950 mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        key: 'orderUpdates',
                        title: 'Order Updates',
                        desc: 'Receive real-time notifications about your daily meal delivery status.',
                      },
                      {
                        key: 'subscriptionAlerts',
                        title: 'Subscription Alerts',
                        desc: 'Get reminders about upcoming package renewals and billing statements.',
                      },
                      {
                        key: 'promotions',
                        title: 'Promotions & Offers',
                        desc: 'Be the first to know about seasonal discounts, coupon codes, and new recipe listings.',
                      },
                      {
                        key: 'smsAlerts',
                        title: 'SMS Delivery Alerts',
                        desc: 'Get automated SMS notifications when the delivery driver is in your area.',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start justify-between gap-4 pb-6 border-b border-stone-100 last:border-0 last:pb-0"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-gray-955 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-500 leading-relaxed max-w-lg">
                            {item.desc}
                          </p>
                        </div>
                        {/* Custom Styled Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleNotification(item.key as keyof typeof user.notifications)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            user.notifications[item.key as keyof typeof user.notifications] 
                              ? 'bg-[#0D7377]' 
                              : 'bg-stone-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              user.notifications[item.key as keyof typeof user.notifications]
                                ? 'translate-x-5'
                                : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === 'danger' && (
                <div className="animate-fade-in">
                  <h2 className="font-serif text-2xl font-bold text-[#9F1239] mb-6">
                    Danger Zone
                  </h2>

                  <div className="border border-[#EACACE] bg-[#FAF1EF] rounded-2xl p-6 md:p-8 flex flex-col items-start gap-5">
                    <div>
                      <h4 className="font-bold text-base text-gray-955 mb-2">Delete Account</h4>
                      <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
                        Once you delete your account, there is no going back. Please be certain. All your order history, subscriptions, and saved data will be permanently removed.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-white border border-[#9F1239] text-[#9F1239] hover:bg-[#FAF1EF] font-bold px-6 py-3 rounded-full text-xs transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                    >
                      Request Account Deletion
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop shadow */}
          <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowDeleteModal(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 md:p-8 max-w-md w-full transform transition-all duration-300 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-5 border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Your Account?</h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Are you absolutely sure you want to permanently delete your 7Day Meals profile? All of your meal plan selections, delivery orders, and configurations will be deleted immediately. This cannot be undone.
            </p>

            <div className="flex justify-end gap-3 border-t border-stone-100 pt-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold px-5 py-2.5 rounded-full text-xs shadow-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-full text-xs shadow-sm transition-colors cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}
