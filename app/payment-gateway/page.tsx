'use client';

import PaymentGatewayPage from '@/pages/payment-gateway/page';
import { Suspense } from 'react';

export default function PaymentGateway() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#0D5C53] border-t-transparent rounded-full"></div></div>}>
      <PaymentGatewayPage />
    </Suspense>
  );
}
