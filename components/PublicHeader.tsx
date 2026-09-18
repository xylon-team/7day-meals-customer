'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface PublicHeaderProps {
  activePage?: 'home' | 'about' | 'services' | 'meal-plans' | 'contact' | 'login' | 'register' | 'forgot-password' | string;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ activePage }) => {
  const { cart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCartCount = mounted
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const navItems = [
    { label: 'Home', href: '/', id: 'home' },
    { label: 'About Us', href: '/about', id: 'about' },
    { label: 'Services', href: '/services', id: 'services' },
    { label: 'Meal Plans', href: '/meal-plans', id: 'meal-plans' },
    { label: 'Contact Us', href: '/contact', id: 'contact' },
  ];

  return (
    <header className="w-full bg-[#F9F8F6] border-b border-stone-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#0D5C53] flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:bg-[#09433D] transition-colors">
            7D
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-gray-900">
            7Day Meals
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#0D5C53] font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C53] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Cart Icon, Login / Register CTAs */}
        <div className="flex items-center gap-3">
          {/* Shopping Cart Icon */}
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-[#0D5C53] p-2 transition-colors cursor-pointer mr-1"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
            {displayCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0D5C53] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                {displayCartCount}
              </span>
            )}
          </Link>

          <Link
            href="/login"
            className={`text-sm font-semibold transition-colors px-3 py-2 ${
              activePage === 'login'
                ? 'text-[#0D5C53]'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-sm ${
              activePage === 'register'
                ? 'bg-[#09433D] text-white'
                : 'bg-[#0D5C53] hover:bg-[#09433D] text-white hover:shadow'
            }`}
          >
            Register
          </Link>
        </div>

      </div>
    </header>
  );
};

export default PublicHeader;
