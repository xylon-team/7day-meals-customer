'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle, Check } from 'lucide-react';

import { useStore } from '@/store/useStore';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const FEATURES = [
  {
    title: 'Authentic Recipes',
    desc: 'Traditional home-cooked flavors',
  },
  {
    title: 'Fresh Daily',
    desc: 'No preservatives, no frozen meals',
  },
  {
    title: 'Flexible Plans',
    desc: 'Pause or cancel anytime',
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!address.trim()) newErrors.address = 'Delivery address is required.';

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { apiRegister, apiLogin } = await import('@/lib/api/auth');

      await apiRegister({
        fname: firstName.trim(),
        lname: lastName.trim(),
        email: email.trim(),
        password,
        phone_number: phone.trim(),
        address_line_1: address.trim() || undefined,
      });

      // Auto-login after registration
      const data = await apiLogin({ email: email.trim(), password });

      login(
        {
          customer_id: data.customer.customer_id,
          name: `${data.customer.fname} ${data.customer.lname}`,
          email: data.customer.email,
          phone: phone.trim(),
          address: address.trim(),
        },
        data.access_token,
      );

      setSuccessMessage('Account created! Redirecting to your meal plans…');

      setTimeout(() => {
        router.push('/');
      }, 900);
    } catch (err: any) {
      setErrors({ general: err.message ?? 'Registration failed. Please try again.' } as any);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
      <div className="flex flex-1 min-h-screen">

        {/* Left Panel — Hero */}
        <div className="hidden md:flex md:w-[48%] lg:w-[44%] relative flex-col justify-between p-10 lg:p-14 overflow-hidden shrink-0"
          style={{
            background: 'linear-gradient(145deg, #0A4A42 0%, #0D5C53 40%, #0F6B5E 70%, #127A6C 100%)',
          }}
        >
          {/* Decorative food image overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='80' fill='none' stroke='white' stroke-width='1' stroke-dasharray='4 4'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Logo */}
          <div className="relative flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold text-base">
              7D
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              7Day Meals
            </span>
          </div>

          {/* Hero content */}
          <div className="relative space-y-8">
            <div>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight">
                Join 7Day Meals
              </h1>
              <p className="mt-3 text-teal-100 text-sm leading-relaxed max-w-xs">
                Order authentic Sri Lankan weekly meals delivered fresh to your door.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-5">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{feature.title}</p>
                    <p className="text-teal-200 text-xs mt-0.5">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Spacer */}
          <div />
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 flex flex-col">


          <main className="flex-1 px-6 sm:px-10 lg:px-14 xl:px-20 py-8 max-w-2xl w-full mx-auto lg:mx-0">

            {/* Back to Home */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-medium mb-6 transition-colors group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to Home
            </Link>

            {/* Heading */}
            <div className="mb-7">
              <h2 className="font-serif text-3xl font-bold text-gray-900">Create Your Account</h2>
              <p className="mt-1.5 text-sm text-stone-500">Fill in your details to start ordering.</p>
            </div>

            {/* Success Toast */}
            {successMessage && (
              <div className="mb-5 flex items-center gap-3 bg-[#0D5C53] text-white text-sm font-medium px-4 py-3 rounded-xl">
                <CheckCircle className="w-4 h-4 text-teal-200 shrink-0" />
                {successMessage}
              </div>
            )}

            {/* General error */}
            {(errors as any).general && (
              <div className="mb-5 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {(errors as any).general}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-first-name" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    First Name
                  </label>
                  <input
                    id="reg-first-name"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }}
                    placeholder=""
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.firstName ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-last-name" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="reg-last-name"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }}
                    placeholder=""
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.lastName ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email + Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                    placeholder=""
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
                    placeholder=""
                    className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15 transition-all"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label htmlFor="reg-address" className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  id="reg-address"
                  rows={3}
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); clearError('address'); }}
                  placeholder=""
                  className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all resize-none ${
                    errors.address ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.address}
                  </p>
                )}
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                      placeholder="••••••••"
                      className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.password ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-confirm-password" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                      placeholder="••••••••"
                      className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.confirmPassword ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    id="reg-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => { setAgreeTerms(e.target.checked); clearError('terms'); }}
                    className="w-4 h-4 mt-0.5 rounded border-stone-300 accent-[#0D5C53] cursor-pointer shrink-0"
                  />
                  <span className="text-sm text-stone-600 leading-snug">
                    I agree to the{' '}
                    <Link href="/terms" className="font-semibold text-[#0D5C53] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-semibold text-[#0D5C53] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm py-3.5 rounded-full transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Login link */}
              <p className="text-center text-sm text-stone-500 pt-1">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-[#0D5C53] hover:text-[#09433D] transition-colors">
                  Login here
                </Link>
              </p>

            </form>
          </main>


        </div>
      </div>
    </div>
  );
}
