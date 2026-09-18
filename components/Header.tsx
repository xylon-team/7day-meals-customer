'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ShoppingCart, ChevronDown, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  cartCount?: number;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, activeTab = 'Home' }) => {
  const navItems = ['Home', 'Meals', 'Orders', 'Subscription'];
  const { user, isAuthenticated, token, logout, cart } = useStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = mounted ? user.name.split(' ')[0] : '';
  const displayInitial = mounted ? (user.name.charAt(0).toUpperCase() || '?') : '?';

  const displayCartCount = cartCount !== undefined 
    ? cartCount 
    : (mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0);

  const handleLogout = async () => {
    // Best-effort: notify backend to invalidate the token version
    if (token) {
      try {
        const { apiLogout } = await import('@/lib/api/auth');
        await apiLogout(token);
      } catch {
        // Ignore errors — local logout still proceeds
      }
    }
    logout();
    router.push('/login');
  };

  return (
    <header className="w-full bg-[#FAF8F5] border-b border-[#EAE7DF]/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#0E5A52] flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:bg-[#09433D] transition-colors">
            7D
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-gray-900">
            7Day Meals
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = item === activeTab;
            return (
              <Link
                key={item}
                href={item === 'Meals' ? '/meal-plans' : item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors relative py-1 ${isActive
                    ? 'text-[#0E5A52] font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                  }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E5A52] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Notification, Cart, User Profile & Logout */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <Link
            href="/notifications"
            className={`relative p-2 transition-colors cursor-pointer ${
              activeTab === 'Notifications' ? 'text-[#0D5C53]' : 'text-gray-700 hover:text-[#0D5C53]'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
          </Link>

          {/* Shopping Cart Icon */}
          <Link href="/cart" className="relative text-stone-700 hover:text-[#0E5A52] p-2 transition-colors cursor-pointer" aria-label="Shopping Cart">
            <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
            {displayCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0E5A52] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                {displayCartCount}
              </span>
            )}
          </Link>

          {/* User Profile Pill */}
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 rounded-full bg-[#0E5A52] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {mounted && isAuthenticated && displayName ? displayInitial : 'K'}
            </div>
            <span className="text-sm font-medium text-stone-800">
              {mounted && isAuthenticated && displayName ? displayName : 'Kasun'}
            </span>
            <ChevronDown className="w-4 h-4 text-stone-500" />
          </Link>

          {/* Logout Button — only show when authenticated */}
          {mounted && isAuthenticated && (
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-rose-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
