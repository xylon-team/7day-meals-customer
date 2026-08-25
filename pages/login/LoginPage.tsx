'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';
import { useStore } from '@/store/useStore';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    // For demo: any valid credentials work. In production this would call the backend.
    const firstName = email.split('@')[0];
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1) + ' (Customer)';

    login({
      name: displayName,
      email: email.trim(),
      phone: '',
      address: '',
    });

    setSuccessMessage('Signed in successfully! Redirecting…');
    setIsLoading(false);

    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
      <div className="flex flex-col flex-1">

        {/* Two-column layout */}
        <div className="flex flex-1 min-h-screen">

          {/* Left Panel — Hero */}
          <div className="hidden md:flex md:w-[50%] lg:w-[48%] relative bg-[#131624] flex-col justify-between p-10 lg:p-14 overflow-hidden shrink-0">
            {/* Subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,_rgba(13,92,83,0.35)_0%,_transparent_70%)] pointer-events-none" />

            {/* Logo */}
            <div className="relative flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#0D5C53] flex items-center justify-center text-white font-bold text-base shadow-sm">
                7D
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                7Day Meals
              </span>
            </div>

            {/* Hero Text */}
            <div className="relative space-y-5">
              <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Welcome back!<br />
                  <span className="text-white">are waiting.</span>
                </h1>
                <p className="mt-3 font-serif text-3xl lg:text-4xl font-bold text-[#00C8B4]">
                  Your weekly meals
                </p>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
                Authentic Sri Lankan Flavors, Every Day. Weekly meal plans delivered to your door.
              </p>
            </div>

            {/* Spacer */}
            <div />
          </div>

          {/* Right Panel — Form */}
          <div className="flex-1 flex flex-col">
            {/* Public Header inside right panel */}
            <PublicHeader activePage="login" />

            <main className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-10 max-w-xl w-full mx-auto lg:mx-0">

              {/* Back to Home */}
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-medium mb-8 transition-colors group"
              >
                <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                Back to Home
              </Link>

              {/* Heading */}
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-gray-900">Sign In</h2>
                <p className="mt-1.5 text-sm text-stone-500">Enter your details to access your account.</p>
              </div>

              {/* Success Toast */}
              {successMessage && (
                <div className="mb-5 flex items-center gap-3 bg-[#0D5C53] text-white text-sm font-medium px-4 py-3 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-teal-200 shrink-0" />
                  {successMessage}
                </div>
              )}

              {/* General error */}
              {errors.general && (
                <div className="mb-5 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="kasun@gmail.com"
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      placeholder="••••••••"
                      className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.password
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-stone-300 text-[#0D5C53] accent-[#0D5C53] cursor-pointer"
                    />
                    <span className="text-sm text-stone-600">Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-[#0D5C53] hover:text-[#09433D] transition-colors"
                  >
                    Forgot password?
                  </Link>
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
                      Signing in…
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Sign up link */}
                <p className="text-center text-sm text-stone-500 pt-1">
                  New customer?{' '}
                  <Link href="/register" className="font-semibold text-[#0D5C53] hover:text-[#09433D] transition-colors">
                    Create account
                  </Link>
                </p>

                {/* Divider */}
                <div className="flex items-center gap-4 py-1">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-xs text-stone-400 font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>

                {/* Google SSO (cosmetic) */}
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full flex items-center justify-center gap-3 border border-stone-300 bg-white hover:bg-stone-50 text-gray-700 font-semibold text-sm py-3 rounded-full transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  {/* Google G Logo SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

              </form>
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
