'use client';

import React from 'react';
import Link from 'next/link';

interface PublicHeaderProps {
  activePage?: 'login' | 'register' | 'forgot-password';
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ activePage }) => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Meal Plans', href: '/meal-plans' },
    { label: 'Contact Us', href: '/contact' },
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Login / Register CTAs */}
        <div className="flex items-center gap-3">
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
