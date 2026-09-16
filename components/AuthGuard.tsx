'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];
const GUEST_ALLOWED_PATHS = ['/', '/meal-plans', '/cart', '/about', '/services', '/contact'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isAuthPage = AUTH_PAGES.some(path => pathname?.startsWith(path));
    const isGuestAllowed = pathname === '/' || GUEST_ALLOWED_PATHS.some(path => path !== '/' && pathname?.startsWith(path));

    // If user is NOT logged in and trying to access a protected page (like /orders, /profile, /notifications)
    if (!isAuthenticated && !isAuthPage && !isGuestAllowed) {
      router.push('/login');
    }
    // If user IS logged in and trying to access an auth page (like /login or /register)
    else if (isAuthenticated && isAuthPage) {
      router.push('/');
    }
  }, [isAuthenticated, mounted, pathname, router]);

  // Before mounting, we can just render nothing to avoid flash of content
  if (!mounted) {
    return <div className="min-h-screen bg-[#F9F8F6]" />; // Empty loading state
  }

  return <>{children}</>;
}
