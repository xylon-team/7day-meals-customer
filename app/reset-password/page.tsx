'use client';

import React, { Suspense } from 'react';
import ResetPasswordPage from '@/pages/reset-password/page';

export default function ResetPasswordAppRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0D5C53] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordPage />
    </Suspense>
  );
}
