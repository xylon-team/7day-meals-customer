'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Lock, ArrowLeft, ShieldCheck, XCircle } from 'lucide-react';

export default function PaymentGatewayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams?.get('amount') || '0';

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCard = cardNumber.replace(/\s/g, '');
    
    if (cleanCard !== '1111111111111111' || cvv !== '111' || expiry.length !== 5) {
      setError('Payment declined. Please use the designated test card credentials.');
      return;
    }

    setIsProcessing(true);

    // Simulate network delay
    setTimeout(() => {
      router.push('/checkout?payment_success=true');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 selection:bg-[#0D5C53] selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0D5C53] p-6 text-white text-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex justify-center items-center gap-2 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold tracking-wide">Secure Checkout</h1>
          <p className="text-teal-100 text-sm mt-1">Sandbox Environment</p>
        </div>

        {/* Amount Summary */}
        <div className="bg-stone-100/50 p-4 border-b border-stone-200 flex justify-between items-center">
          <span className="text-stone-600 font-medium">Total to pay</span>
          <span className="text-2xl font-bold text-gray-900">Rs. {Number(amount).toLocaleString()}</span>
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm animate-shake">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="card-number">
              Card Number
            </label>
            <div className="relative">
              <input
                id="card-number"
                type="text"
                placeholder="1111 1111 1111 1111"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-stone-200 bg-[#F9F8F6] text-gray-900 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53] transition-all"
                required
              />
              <CreditCard className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs text-stone-500 mt-2">Test card: 1111 1111 1111 1111</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="expiry">
                Expiry Date
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="w-full px-4 py-3.5 text-sm rounded-xl border border-stone-200 bg-[#F9F8F6] text-gray-900 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53] transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="cvv">
                CVV
              </label>
              <input
                id="cvv"
                type="text"
                placeholder="111"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-4 py-3.5 text-sm rounded-xl border border-stone-200 bg-[#F9F8F6] text-gray-900 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53] transition-all"
                required
              />
              <p className="text-xs text-stone-500 mt-2">Test CVV: 111</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md"
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay Rs. {Number(amount).toLocaleString()}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 text-center flex justify-center items-center gap-2 text-stone-500 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-[#0D5C53]" />
          Secured by MockPay
        </div>
      </div>
    </div>
  );
}
