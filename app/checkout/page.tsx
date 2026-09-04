'use client';

import CheckoutPage from '@/pages/checkout/page';
import { Suspense } from 'react';

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#0D5C53] border-t-transparent rounded-full"></div></div>}>
      <CheckoutPage />
    </Suspense>
  );
}
