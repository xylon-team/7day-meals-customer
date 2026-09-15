'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore, CartItem } from '@/store/useStore';
import { createOrder } from '@/lib/api/orders';
import {
  MapPin,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Package,
  ClipboardList,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'delivery' | 'payment' | 'confirmation';

interface DeliveryFormData {
  address: string;
  startDate: string;
  specialInstructions: string;
}

interface PaymentFormData {
  selectedCard: 'saved' | 'new';
  cardNumber: string;
  expiry: string;
  cvv: string;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string; num: number }[] = [
  { key: 'delivery', label: 'Delivery', num: 1 },
  { key: 'payment', label: 'Payment', num: 2 },
  { key: 'confirmation', label: 'Confirmation', num: 3 },
];

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={step.key}>
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-semibold text-sm
                  ${isDone
                    ? 'bg-[#0D5C53] border-[#0D5C53] text-white'
                    : isActive
                    ? 'bg-white border-[#0D5C53] text-[#0D5C53]'
                    : 'bg-white border-stone-300 text-stone-400'
                  }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 fill-white stroke-[#0D5C53]" />
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-[#0D5C53] font-semibold' : isDone ? 'text-[#0D5C53]' : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {!isLast && (
              <div
                className={`h-0.5 w-24 sm:w-40 mb-5 mx-1 transition-all duration-500 ${
                  isDone ? 'bg-[#0D5C53]' : 'bg-stone-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────

function OrderSummary({ items, totalAmount }: { items: CartItem[]; totalAmount: number }) {
  const deliveryFee = 0;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-6 sticky top-28">
      <h2 className="font-serif text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-[#0D5C53]" />
        Order Summary
      </h2>

      {/* Items list */}
      <div className="space-y-3 mb-5">
        {items.length === 0 ? (
          <p className="text-sm text-stone-500 text-center py-4">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <span className="text-sm text-stone-700">
                <span className="font-semibold text-gray-900">{item.quantity}×</span>{' '}
                {item.name}
              </span>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-stone-100 pt-4 space-y-2 mb-4">
        <div className="flex justify-between text-sm text-stone-500">
          <span>Subtotal</span>
          <span>Rs. {totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-stone-500">
          <span>Delivery</span>
          <span className="text-[#0D5C53] font-medium">{deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee}`}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t border-stone-200">
        <span className="text-base font-bold text-gray-900">Total</span>
        <span className="text-xl font-extrabold text-[#0D5C53]">
          Rs. {totalAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Step 1: Delivery Details ─────────────────────────────────────────────────

function DeliveryStep({
  data,
  onChange,
  onContinue,
}: {
  data: DeliveryFormData;
  onChange: (d: Partial<DeliveryFormData>) => void;
  onContinue: () => void;
}) {
  const [errors, setErrors] = useState<Partial<DeliveryFormData>>({});

  const validate = () => {
    const errs: Partial<DeliveryFormData> = {};
    if (!data.address.trim()) errs.address = 'Delivery address is required.';
    if (!data.startDate) errs.startDate = 'Please select a start date.';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onContinue();
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-8">
      {/* Section Header */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
        <MapPin className="w-5 h-5 text-[#0D5C53]" />
        Delivery Details
      </h2>

      <div className="space-y-5">
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="delivery-address">
            Delivery Address <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="delivery-address"
            rows={3}
            placeholder="Enter your full delivery address…"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            className={`w-full px-4 py-3 text-sm rounded-xl border bg-[#F9F8F6] text-gray-900 placeholder-stone-400 resize-none outline-none transition-all
              focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53]
              ${errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 hover:border-stone-300'}`}
          />
          {errors.address && (
            <p className="mt-1 text-xs text-rose-500">{errors.address}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="start-date">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-[#0D5C53]" />
              Start Date <span className="text-rose-500">*</span>
            </span>
          </label>
          <input
            type="date"
            id="start-date"
            value={data.startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className={`w-full px-4 py-3 text-sm rounded-xl border bg-[#F9F8F6] text-gray-900 outline-none transition-all
              focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53]
              ${errors.startDate ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200 hover:border-stone-300'}`}
          />
          {errors.startDate && (
            <p className="mt-1 text-xs text-rose-500">{errors.startDate}</p>
          )}
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="special-instructions">
            Special Instructions{' '}
            <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="special-instructions"
            rows={3}
            placeholder="E.g. Leave at the front desk…"
            value={data.specialInstructions}
            onChange={(e) => onChange({ specialInstructions: e.target.value })}
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 bg-[#F9F8F6] text-gray-900 placeholder-stone-400 resize-none outline-none transition-all hover:border-stone-300 focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53]"
          />
        </div>

        {/* CTA */}
        <button
          id="continue-to-payment"
          onClick={handleSubmit}
          className="w-full mt-2 bg-[#0D5C53] hover:bg-[#09433D] active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          Continue to Payment
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Payment ──────────────────────────────────────────────────────────

function PaymentStep({
  data,
  totalAmount,
  onChange,
  onPay,
  onBack,
  isSubmitting,
  submitError,
}: {
  data: PaymentFormData;
  totalAmount: number;
  onChange: (d: Partial<PaymentFormData>) => void;
  onPay: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  submitError?: string;
}) {
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});

  const validate = () => {
    const errs: Partial<PaymentFormData> = {};
    if (data.selectedCard === 'new') {
      if (!data.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        errs.cardNumber = 'Enter a valid 16-digit card number.';
      }
      if (!data.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        errs.expiry = 'Use MM/YY format.';
      }
      if (!data.cvv.match(/^\d{3,4}$/)) {
        errs.cvv = 'Enter a valid CVV.';
      }
    }
    return errs;
  };

  const handlePay = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onPay();
  };

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

  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-8">
      {/* Section Header */}
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2.5">
        <CreditCard className="w-5 h-5 text-[#0D5C53]" />
        Payment Method
      </h2>

      <div className="space-y-4">
        {/* Saved Card Option */}
        <label
          htmlFor="saved-card"
          className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
            data.selectedCard === 'saved'
              ? 'border-[#0D5C53] bg-teal-50/40'
              : 'border-stone-200 hover:border-stone-300 bg-[#F9F8F6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="saved-card"
              name="payment-method"
              checked={data.selectedCard === 'saved'}
              onChange={() => onChange({ selectedCard: 'saved' })}
              className="accent-[#0D5C53] w-4 h-4"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Visa ending in 4242</p>
              <p className="text-xs text-stone-500">Expires 12/25</p>
            </div>
          </div>
          <CreditCard className="w-5 h-5 text-stone-400" />
        </label>

        {/* Add New Card Option */}
        <div>
          <label
            htmlFor="new-card"
            className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              data.selectedCard === 'new'
                ? 'border-[#0D5C53] bg-teal-50/40'
                : 'border-stone-200 hover:border-stone-300 bg-[#F9F8F6]'
            }`}
          >
            <input
              type="radio"
              id="new-card"
              name="payment-method"
              checked={data.selectedCard === 'new'}
              onChange={() => onChange({ selectedCard: 'new' })}
              className="accent-[#0D5C53] w-4 h-4"
            />
            <span className="text-sm font-semibold text-gray-900">Add New Card</span>
          </label>

          {/* New card fields — animated */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              data.selectedCard === 'new' ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-3 px-1">
              {/* Card Number */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="card-number">
                  Card Number
                </label>
                <input
                  id="card-number"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={data.cardNumber}
                  onChange={(e) => onChange({ cardNumber: formatCardNumber(e.target.value) })}
                  className={`w-full px-4 py-3 text-sm rounded-xl border bg-[#F9F8F6] text-gray-900 placeholder-stone-400 outline-none transition-all
                    focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53]
                    ${errors.cardNumber ? 'border-rose-400' : 'border-stone-200 hover:border-stone-300'}`}
                />
                {errors.cardNumber && <p className="mt-1 text-xs text-rose-500">{errors.cardNumber}</p>}
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="card-expiry">
                    Expiry
                  </label>
                  <input
                    id="card-expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={data.expiry}
                    onChange={(e) => onChange({ expiry: formatExpiry(e.target.value) })}
                    className={`w-full px-4 py-3 text-sm rounded-xl border bg-[#F9F8F6] text-gray-900 placeholder-stone-400 outline-none transition-all
                      focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53]
                      ${errors.expiry ? 'border-rose-400' : 'border-stone-200 hover:border-stone-300'}`}
                  />
                  {errors.expiry && <p className="mt-1 text-xs text-rose-500">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="card-cvv">
                    CVV
                  </label>
                  <input
                    id="card-cvv"
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    value={data.cvv}
                    onChange={(e) => onChange({ cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    className={`w-full px-4 py-3 text-sm rounded-xl border bg-[#F9F8F6] text-gray-900 placeholder-stone-400 outline-none transition-all
                      focus:ring-2 focus:ring-[#0D5C53]/30 focus:border-[#0D5C53]
                      ${errors.cvv ? 'border-rose-400' : 'border-stone-200 hover:border-stone-300'}`}
                  />
                  {errors.cvv && <p className="mt-1 text-xs text-rose-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm flex items-center gap-2">
            <span className="font-semibold">Error:</span> {submitError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            id="back-to-delivery"
            onClick={onBack}
            className="flex items-center gap-1.5 px-6 py-3 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-semibold hover:bg-stone-50 hover:border-stone-300 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            id="pay-now"
            onClick={handlePay}
            disabled={isSubmitting}
            className="flex-1 bg-gray-900 hover:bg-gray-800 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
          >
            {isSubmitting ? 'Processing...' : `Pay Rs. ${totalAmount.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Confirmation ─────────────────────────────────────────────────────

function ConfirmationStep({
  orderRef,
  onTrackOrder,
  onDashboard,
}: {
  orderRef: string;
  onTrackOrder: () => void;
  onDashboard: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm p-10 flex flex-col items-center text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center mb-6 animate-bounce-once">
        <CheckCircle2 className="w-10 h-10 text-[#0D5C53] stroke-[1.5]" />
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        Order Confirmed!
      </h1>
      <p className="text-stone-500 text-sm mb-8">
        Your authentic Sri Lankan meals are being prepared.
      </p>

      {/* Order Reference */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl px-8 py-5 mb-8">
        <p className="text-xs text-stone-500 mb-1 font-medium tracking-wide uppercase">
          Order Reference
        </p>
        <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {orderRef}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          id="track-order"
          onClick={onTrackOrder}
          className="flex-1 bg-[#0D5C53] hover:bg-[#09433D] active:scale-[0.99] text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
        >
          <Package className="w-4 h-4" />
          Track Order
        </button>
        <button
          id="back-to-dashboard"
          onClick={onDashboard}
          className="flex-1 border border-stone-200 bg-white text-gray-800 font-semibold py-3 px-6 rounded-xl hover:bg-stone-50 hover:border-stone-300 active:scale-[0.99] transition-all duration-200 cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, cart: items, clearCart } = useStore();
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [currentStep, setCurrentStep] = useState<Step>('delivery');
  const [orderRef, setOrderRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [delivery, setDelivery] = useState<DeliveryFormData>({
    address: '',
    startDate: '',
    specialInstructions: '',
  });

  const [payment, setPayment] = useState<PaymentFormData>({
    selectedCard: 'saved',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  // Pre-fill delivery address from user profile
  useEffect(() => {
    if (user?.address) {
      setDelivery((prev) => ({ ...prev, address: user.address }));
    }
  }, [user]);

  const handleConfirmPayment = async () => {
    if (!user?.customer_id || !token || items.length === 0) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      let firstOrderId = '';
      
      // Submit an order for each cart item
      for (const item of items) {
        const payload = {
          customer_id: user.customer_id,
          meal_id: (typeof item.id === 'number' && !isNaN(item.id)) ? item.id : (parseInt(String(item.id), 10) || 1),
          order_status: 'PENDING',
          payment_status: 'PAID',
          delivery_status: 'PROCESSING',
          delivery_preferred_date: new Date(delivery.startDate).toISOString(),
          is_a_subscribed_meal: false,
        };
        const order = await createOrder(user.customer_id, payload, token);
        if (!firstOrderId) {
           firstOrderId = `#ORD-${order.order_id || Math.floor(1000 + Math.random() * 9000)}`;
        }
      }

      setOrderRef(firstOrderId);
      setCurrentStep('confirmation');
      clearCart();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrder = () => {
    router.push('/orders');
  };

  const handleDashboard = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900 flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
      {/* Header */}
      <Header activeTab="Orders" />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Checkout
          </h1>
          <p className="mt-1 text-stone-500 text-sm">
            Complete your order in a few easy steps.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Body: Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Active Step Form */}
          <div className="lg:col-span-2">
            {currentStep === 'delivery' && (
              <DeliveryStep
                data={delivery}
                onChange={(d) => setDelivery((prev) => ({ ...prev, ...d }))}
                onContinue={() => setCurrentStep('payment')}
              />
            )}
            {currentStep === 'payment' && (
              <PaymentStep
                data={payment}
                totalAmount={totalAmount}
                onChange={(d) => setPayment((prev) => ({ ...prev, ...d }))}
                onPay={handleConfirmPayment}
                onBack={() => setCurrentStep('delivery')}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
            {currentStep === 'confirmation' && (
              <ConfirmationStep
                orderRef={orderRef}
                onTrackOrder={handleTrackOrder}
                onDashboard={handleDashboard}
              />
            )}
          </div>

          {/* Right: Order Summary — hide on Confirmation step */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <OrderSummary items={items} totalAmount={totalAmount} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
