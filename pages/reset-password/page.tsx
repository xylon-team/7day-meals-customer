'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle, Lock, RefreshCw, Shield } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

// ─── Password strength criteria ────────────────────────────────────────────────
interface Criteria {
  label: string;
  test: (pw: string) => boolean;
}

const CRITERIA: Criteria[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter',  test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One number',            test: (pw) => /[0-9]/.test(pw) },
  { label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function getStrengthScore(pw: string): number {
  return CRITERIA.filter((c) => c.test(pw)).length;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', 'bg-rose-500', 'bg-amber-400', 'bg-yellow-400', 'bg-[#0D5C53]'];
const STRENGTH_TEXT_COLORS = ['', '#f43f5e', '#f59e0b', '#eab308', '#0D5C53'];

// ─── Left-panel info items ─────────────────────────────────────────────────────
const INFO_ITEMS = [
  {
    icon: Shield,
    title: 'Encrypted end-to-end',
    desc: 'Your new password is stored securely and never shared.',
  },
  {
    icon: RefreshCw,
    title: 'Use a unique password',
    desc: 'Avoid reusing passwords from other sites to stay protected.',
  },
  {
    icon: Lock,
    title: 'Takes less than a minute',
    desc: "Set your new password and you're signed back in instantly.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Email comes from the ?email= query param set by the forgot-password page
  const [emailFromUrl, setEmailFromUrl] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams?.get('email') ?? '';
    setEmailFromUrl(emailParam);
    setEmail(emailParam);
  }, [searchParams]);

  const [otp, setOtp]                                 = useState('');
  const [password, setPassword]                       = useState('');
  const [confirmPassword, setConfirmPassword]         = useState('');
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirm, setShowConfirm]                 = useState(false);
  const [otpError, setOtpError]                       = useState<string | null>(null);
  const [passwordError, setPasswordError]             = useState<string | null>(null);
  const [confirmError, setConfirmError]               = useState<string | null>(null);
  const [generalError, setGeneralError]               = useState<string | null>(null);
  const [isLoading, setIsLoading]                     = useState(false);
  const [success, setSuccess]                         = useState(false);

  const strengthScore  = getStrengthScore(password);
  const allCriteriaMet = strengthScore === CRITERIA.length;

  const validate = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setGeneralError('Email address is missing. Please go back to the Forgot Password page.');
      valid = false;
    }

    if (!otp.trim() || otp.trim().length !== 4) {
      setOtpError('Please enter the 4-digit OTP sent to your email.');
      valid = false;
    } else {
      setOtpError(null);
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (!allCriteriaMet) {
      setPasswordError('Please meet all password requirements.');
      valid = false;
    } else {
      setPasswordError(null);
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password.');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      valid = false;
    } else {
      setConfirmError(null);
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { apiResetPassword } = await import('@/lib/api/auth');
      await apiResetPassword({
        email: email.trim(),
        otp: otp.trim(),
        new_password: password,
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: any) {
      setGeneralError(err.message ?? 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
      <div className="flex flex-1 min-h-screen">

        {/* ── Left Panel ── */}
        <div className="hidden md:flex md:w-[48%] lg:w-[44%] relative bg-[#131624] flex-col justify-between p-10 lg:p-14 overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_55%,_rgba(13,92,83,0.30)_0%,_transparent_70%)] pointer-events-none" />

          {/* Logo */}
          <div className="relative flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#0D5C53] flex items-center justify-center text-white font-bold text-base shadow-sm">
              7D
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              7Day Meals
            </span>
          </div>

          {/* Hero text */}
          <div className="relative space-y-6">
            <div>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight">
                Almost there.
              </h1>
              <p className="font-serif text-3xl lg:text-4xl font-bold text-[#00C8B4] leading-tight mt-1">
                Set a<br />new password.
              </p>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              Enter the OTP we sent to your email and choose a strong new password.
            </p>

            {/* Info items */}
            <ul className="space-y-5 pt-2">
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

          <div />
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex flex-col">
          <PublicHeader />

          <main className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-10 max-w-xl w-full mx-auto lg:mx-0">

            {/* Back link */}
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 font-medium mb-8 transition-colors group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to Forgot Password
            </Link>

            {success ? (
              /* ── Success state ── */
              <div className="text-center space-y-5 py-6">
                <div className="w-16 h-16 rounded-full bg-[#E7EFED] flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-[#0D5C53]" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">Password reset!</h2>
                  <p className="mt-2 text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
                    Your password has been updated successfully. Redirecting you to sign in…
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-block text-sm font-semibold text-[#0D5C53] hover:text-[#09433D] transition-colors"
                >
                  Go to Sign In →
                </Link>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <div className="mb-7">
                  <h2 className="font-serif text-3xl font-bold text-gray-900">Reset Password</h2>
                  <p className="mt-1.5 text-sm text-stone-500">
                    {emailFromUrl ? (
                      <>
                        Enter the OTP sent to{' '}
                        <span className="font-semibold text-gray-700">{emailFromUrl}</span>{' '}
                        and create a new password.
                      </>
                    ) : (
                      'Enter the OTP from your email and create a new password.'
                    )}
                  </p>
                </div>

                {/* General error */}
                {generalError && (
                  <div className="mb-5 flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {generalError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">

                  {/* Email field (pre-filled, editable) */}
                  {!emailFromUrl && (
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Email Address
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="kasun@gmail.com"
                        className="w-full border border-stone-300 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15 transition-all"
                      />
                    </div>
                  )}

                  {/* OTP field */}
                  <div>
                    <label htmlFor="reset-otp" className="block text-sm font-semibold text-gray-800 mb-1.5">
                      OTP Code
                      <span className="ml-1.5 text-xs font-normal text-stone-400">(4-digit code from your email)</span>
                    </label>
                    <input
                      id="reset-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setOtp(v);
                        if (otpError) setOtpError(null);
                      }}
                      placeholder="e.g. 1234"
                      className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all tracking-widest text-center text-lg font-bold ${
                        otpError
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
                      }`}
                    />
                    {otpError && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {otpError}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="reset-password" className="block text-sm font-semibold text-gray-800 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="reset-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError(null);
                        }}
                        placeholder="Enter new password"
                        className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                          passwordError
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
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                step <= strengthScore ? STRENGTH_COLORS[strengthScore] : 'bg-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                        {strengthScore > 0 && (
                          <p className="text-xs font-semibold" style={{ color: STRENGTH_TEXT_COLORS[strengthScore] }}>
                            Password strength: {STRENGTH_LABELS[strengthScore]}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Criteria checklist */}
                    <ul className="mt-3 space-y-1.5">
                      {CRITERIA.map((criterion) => {
                        const met = criterion.test(password);
                        return (
                          <li key={criterion.label} className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                met ? 'border-[#0D5C53] bg-[#0D5C53]' : 'border-stone-300 bg-white'
                              }`}
                            >
                              {met && (
                                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 8 8">
                                  <path
                                    d="M1.5 4l2 2 3-3"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                            <span className={`text-xs transition-colors ${met ? 'text-[#0D5C53] font-medium' : 'text-stone-500'}`}>
                              {criterion.label}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {passwordError && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="reset-confirm-password" className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="reset-confirm-password"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (confirmError) setConfirmError(null);
                        }}
                        placeholder="Re-enter new password"
                        className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 transition-all ${
                          confirmError
                            ? 'border-rose-400 focus:ring-rose-200'
                            : confirmPassword && password === confirmPassword
                              ? 'border-[#0D5C53] focus:ring-[#0D5C53]/15'
                              : 'border-stone-300 focus:border-[#0D5C53] focus:ring-[#0D5C53]/15'
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

                    {/* Real-time match indicator */}
                    {confirmPassword && !confirmError && (
                      <p className={`mt-1.5 text-xs flex items-center gap-1 ${
                        password === confirmPassword ? 'text-[#0D5C53]' : 'text-stone-400'
                      }`}>
                        {password === confirmPassword ? (
                          <><CheckCircle className="w-3 h-3 shrink-0" /> Passwords match</>
                        ) : (
                          <><AlertCircle className="w-3 h-3 shrink-0" /> Passwords do not match yet</>
                        )}
                      </p>
                    )}
                    {confirmError && (
                      <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {confirmError}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0D5C53] hover:bg-[#09433D] text-white font-bold text-sm py-3.5 rounded-full transition-all shadow-sm active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Resetting…
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>

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
