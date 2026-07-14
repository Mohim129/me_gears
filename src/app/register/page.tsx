'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim()) newErrors.email = 'Email address is required.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!termsAccepted) newErrors.terms = 'You must agree to the Terms of Service.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const inputBaseClass =
    'w-full px-4 py-3 pr-12 rounded-xl bg-surface-dim/30 border focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 outline-none font-body-md';

  return (
    <main className="min-h-screen flex overflow-hidden">
      {/* ── Left Side: Background Image with Overlay ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Dark overlay */}
        <div className="absolute inset-0 z-10 bg-primary/40 mix-blend-multiply" />
        {/* Background image */}
        <div
          className="w-full h-full bg-cover bg-center scale-105 transition-transform duration-1000 hover:scale-100"
          style={{
            backgroundImage: 'url("https://i.ibb.co.com/NdVQJLt0/signup-image.png")',
          }}
          role="img"
          aria-label="Cinematic industrial interior with raw concrete pillars, weathered steel beams, and warm amber lighting"
        />
        {/* Branding overlay */}
        <div className="absolute bottom-16 left-16 z-20 max-w-md">
          <h2 className="font-headline-xl text-headline-xl text-white mb-4">
            STYLE WITHOUT LIMITS.
          </h2>
          <p className="font-body-lg text-body-lg text-white/80">
            Join a community of trendsetters and explorers. Premium urban apparel for every journey.
          </p>
        </div>
      </div>

      {/* ── Right Side: Registration Form ── */}
      <div className="w-full lg:w-1/2 bg-surface flex flex-col justify-center items-center px-gutter py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <span className="font-display-logo text-display-logo tracking-[0.3em] text-primary">
              ME GEARS
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
              Create Account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Step into the industrial revolution of style.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="register-fullname"
                className="font-label-bold text-label-bold text-on-surface-variant"
              >
                FULL NAME
              </label>
              <div className="relative">
                <input
                  id="register-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearError('fullName');
                  }}
                  placeholder="Alexander Gear"
                  className={`${inputBaseClass} ${
                    errors.fullName ? 'border-error' : 'border-outline/10'
                  }`}
                />
                <User
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50"
                />
              </div>
              {errors.fullName && (
                <p className="text-error text-xs font-label-bold">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="register-email"
                className="font-label-bold text-label-bold text-on-surface-variant"
              >
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  placeholder="alex@megears.com"
                  className={`${inputBaseClass} ${
                    errors.email ? 'border-error' : 'border-outline/10'
                  }`}
                />
                <Mail
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50"
                />
              </div>
              {errors.email && (
                <p className="text-error text-xs font-label-bold">{errors.email}</p>
              )}
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="register-password"
                  className="font-label-bold text-label-bold text-on-surface-variant"
                >
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError('password');
                    }}
                    placeholder="••••••••"
                    className={`${inputBaseClass} ${
                      errors.password ? 'border-error' : 'border-outline/10'
                    }`}
                  />
                  <Lock
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50"
                  />
                </div>
                {errors.password && (
                  <p className="text-error text-xs font-label-bold">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="register-confirm-password"
                  className="font-label-bold text-label-bold text-on-surface-variant"
                >
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="register-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError('confirmPassword');
                    }}
                    placeholder="••••••••"
                    className={`${inputBaseClass} ${
                      errors.confirmPassword ? 'border-error' : 'border-outline/10'
                    }`}
                  />
                  <ShieldCheck
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-xs font-label-bold">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <div className="flex items-start gap-3 py-2">
                <input
                  id="register-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    clearError('terms');
                  }}
                  className="mt-1 w-5 h-5 rounded border-outline/20 text-secondary focus:ring-secondary/20"
                />
                <label
                  htmlFor="register-terms"
                  className="text-sm font-body-md text-on-surface-variant leading-tight"
                >
                  I agree to the{' '}
                  <Link href="#" className="text-primary font-label-bold hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-primary font-label-bold hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.terms && (
                <p className="text-error text-xs font-label-bold pl-8">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-label-bold shadow-lg transform active:scale-95 transition-all duration-200 uppercase tracking-widest ${
                isLoading
                  ? 'bg-secondary/70 text-white cursor-not-allowed'
                  : 'bg-secondary text-white hover:bg-on-secondary-fixed-variant'
              }`}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-surface px-4 text-on-surface-variant">Or sign up with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="pt-2">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-outline/10 rounded-xl hover:bg-surface-dim transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="font-label-bold text-xs uppercase">Google</span>
              </button>
            </div>

            {/* Redirect to Login */}
            <p className="text-center font-body-md text-on-surface-variant mt-8">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-label-bold hover:text-secondary transition-colors underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Legal footer */}
        <div className="mt-16 text-[10px] text-outline uppercase tracking-widest opacity-60">
          © 2024 ME GEARS. All rights reserved. Industrial Aesthetics &amp; Engineered Quality.
        </div>
      </div>
    </main>
  );
}
