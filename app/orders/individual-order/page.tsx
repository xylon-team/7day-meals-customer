'use client';

import React, { Suspense } from 'react';
import IndividualOrderPage from '@/pages/orders/individual-order/page';

export default function IndividualOrderRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E5A52]" />
      </div>
    }>
      <IndividualOrderPage />
    </Suspense>
  );
}
