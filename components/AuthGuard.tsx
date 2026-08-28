'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

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

    const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path));

    // If user is NOT logged in and trying to access a private page (like Home, Profile, etc.)
    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    }
    // If user IS logged in and trying to access a public auth page (like Login)
    else if (isAuthenticated && isPublicPath) {
      router.push('/'); // Redirect them back home
    }
  }, [isAuthenticated, mounted, pathname, router]);

  // Before mounting, we can just render nothing to avoid flash of content
  if (!mounted) {
    return <div className="min-h-screen bg-[#F9F8F6]" />; // Empty loading state
  }

  return <>{children}</>;
}
