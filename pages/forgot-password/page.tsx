'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Inbox, ShieldCheck, Zap } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const INFO_ITEMS = [
  {
    icon: Inbox,
    title: 'Check your inbox',
    desc: "We'll email a secure reset link to your registered address.",
  },
  {
    icon: ShieldCheck,
    title: 'Safe and secure',
    desc: 'The link expires after a short time to keep your account protected.',
  },
  {
    icon: Zap,
    title: 'Back to your meals fast',
    desc: 'Reset your password in seconds and pick up right where you left off.',
  },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    if (!email.trim()) {
      setEmailError('Email address is required.');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
      <div className="flex flex-1 min-h-screen">

        {/* Left Panel — Hero */}
        <div className="hidden md:flex md:w-[48%] lg:w-[44%] relative bg-[#131624] flex-col justify-between p-10 lg:p-14 overflow-hidden shrink-0">
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,_rgba(13,92,83,0.30)_0%,_transparent_70%)] pointer-events-none" />

          {/* Logo */}
          <div className="relative flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#0D5C53] flex items-center justify-center text-white font-bold text-base shadow-sm">
              7D
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              7Day Meals
            </span>
          </div>

          {/* Hero Content */}
          <div className="relative space-y-8">
            <div>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight">
                Forgot your password?
              </h1>
              <p className="mt-3 font-serif text-2xl lg:text-3xl font-bold text-[#00C8B4] leading-tight">
                We&apos;ve got<br />you covered.
              </p>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              No worries — it happens. Enter the email linked to your account and we&apos;ll send you a link to get back to your weekly meals.
            </p>

            {/* Info items */}
            <ul className="space-y-5">
              {INFO_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full border border-teal-700/40 bg-teal-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-stone-400 text-xs mt-0.5 leading-relaxed max-w-xs">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Spacer */}
          <div />
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 flex flex-col">
          <PublicHeader />

          <main className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-10 max-w-xl w-full mx-auto lg:mx-0">

            {/* Back to Sign In */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-medium mb-8 transition-colors group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to Sign In
            </Link>

            {submitted ? (
              /* ── Success state ── */
              <div className="text-center space-y-5 py-6">
                <div className="w-16 h-16 rounded-full bg-[#E7EFED] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-[#0D5C53]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">Check your inbox</h2>
                  <p className="mt-2 text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
                    We sent a password reset link to{' '}
                    <span className="font-semibold text-gray-800">{email}</span>.
                    It may take a moment to arrive.
                  </p>
                </div>
                <p className="text-xs text-stone-400">
                  Didn&apos;t receive it?{' '}
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); }}
                    className="font-semibold text-[#0D5C53] hover:text-[#09433D] transition-colors cursor-pointer"
                  >
                    Try again
                  </button>
                </p>
                <Link
                  href="/login"
                  className="inline-block mt-2 text-sm font-semibold text-[#0D5C53] hover:text-[#09433D] transition-colors"
                >
                  ← Back to Sign In
                </Link>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                {/* Heading */}
                <div className="mb-8">
                  <h2 className="font-serif text-3xl font-bold text-gray-900">Forgot Password</h2>
                  <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
                    Enter the email address linked to your account and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                  {/* Email Field */}
                  <div>
                    <label htmlFor="forgot-email" className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="kasun@gmail.com"
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                        emailError
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                      }`}
                    />
                    {emailError && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {emailError}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0D5C53] hover:bg-[#09433D] text-white font-bold text-sm py-3.5 rounded-full transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>

                  {/* Sign in link */}
                  <p className="text-center text-sm text-stone-500 pt-1">
                    Remembered your password?{' '}
                    <Link href="/login" className="font-semibold text-[#0D5C53] hover:text-[#09433D] transition-colors">
                      Sign in
                    </Link>
                  </p>

                </form>
              </>
            )}

          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
