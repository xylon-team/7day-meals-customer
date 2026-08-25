'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ChevronDown, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  cartCount?: number;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({ cartCount = 0, activeTab = 'Meals' }) => {
  const navItems = ['Dashboard', 'Meals', 'Orders', 'Subscription'];
  const { user, isAuthenticated, logout } = useStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = mounted ? user.name.split(' ')[0] : 'Kasun';
  const displayInitial = mounted ? user.name.charAt(0).toUpperCase() : 'K';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="w-full bg-[#F9F8F6] border-b border-stone-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#0D5C53] flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-[#09433D] transition-colors">
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
                href={item === 'Meals' ? '/meal-plans' : `/${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors relative py-1 ${isActive
                    ? 'text-[#0D5C53] font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C53] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Cart, User Profile & Logout */}
        <div className="flex items-center gap-4">
          {/* Shopping Cart Icon */}
          <button className="relative text-gray-700 hover:text-[#0D5C53] p-2 transition-colors cursor-pointer" aria-label="Shopping Cart">
            <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0D5C53] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Pill */}
          {mounted && (isAuthenticated || true) && (
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-[#0D5C53] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {displayInitial}
              </div>
              <span className="text-sm font-medium text-gray-800">{displayName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Link>
          )}

          {/* Logout Button — only show when authenticated */}
          {mounted && isAuthenticated && (
            <button
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
              className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-rose-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-rose-50"
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
