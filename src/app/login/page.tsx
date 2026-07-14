'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = 'Email address is required.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    // Submit logic would go here
  };

  const handleDemoLogin = () => {
    setEmail('demo@megears.com');
    setPassword('demo123');
    setErrors({});
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-primary via-secondary-container to-surface">
      {/* ── Left Side: 2×2 Image Grid ── */}
      <section className="hidden md:block md:w-1/2 lg:w-3/5 relative overflow-hidden">
        <div className="grid grid-cols-2 h-full w-full">
          {/* Top-left: image */}
          <div className="relative overflow-hidden">
            <Image
              src="https://img.magnific.com/free-photo/studio-close-up-portrait-young-fresh-blonde-woman-brown-straw-poncho-wool-black-trendy-hat-round-glasses-looking-camera-green-leather-had-bag_273443-1121.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Fashion portrait — woman in brown poncho and trendy hat"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 30vw, 25vw"
              unoptimized
            />
          </div>
          {/* Top-right: solid primary */}
          <div className="bg-primary" />
          {/* Bottom-left: solid primary */}
          <div className="bg-primary" />
          {/* Bottom-right: image */}
          <div className="relative overflow-hidden">
            <Image
              src="https://img.magnific.com/free-photo/happy-lady-stylish-skirt-boater-posing-pink-wall_197531-23653.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Lifestyle fashion — woman in stylish skirt posing against pink wall"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 30vw, 25vw"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* ── Right Side: Login Form ── */}
      <section className="w-full md:w-1/2 lg:w-2/5 min-h-screen flex items-center justify-center bg-surface relative px-gutter py-12">
        <div className="w-full max-w-[440px] space-y-10 relative z-10">
          {/* Logo & Header */}
          <div className="text-center md:text-left">
            <div className="font-display-logo text-display-logo text-primary mb-12 tracking-[0.3em]">
              ME GEARS
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant font-body-md">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* Form */}
          <div className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6 mb-8" noValidate>
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block font-label-bold text-label-bold text-on-surface-variant"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="name@company.com"
                  className={`w-full h-12 px-4 rounded-xl border bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md ${
                    errors.email ? 'border-error' : 'border-outline/20'
                  }`}
                />
                {errors.email && (
                  <p className="text-error text-xs font-label-bold">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="login-password"
                    className="block font-label-bold text-label-bold text-on-surface-variant"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-label-bold text-secondary hover:underline text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={`w-full h-12 px-4 rounded-xl border bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md ${
                    errors.password ? 'border-error' : 'border-outline/20'
                  }`}
                />
                {errors.password && (
                  <p className="text-error text-xs font-label-bold">{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-outline/20 text-primary focus:ring-primary"
                />
                <label htmlFor="login-remember" className="ml-2 font-body-md text-on-surface-variant">
                  Keep me signed in
                </label>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                className="w-full h-14 bg-primary text-white font-label-bold text-label-bold rounded-xl shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all duration-300"
              >
                SIGN IN
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline/10" />
              <span className="flex-shrink mx-4 text-on-surface-variant font-label-bold text-[12px] tracking-widest">
                OR CONTINUE WITH
              </span>
              <div className="flex-grow border-t border-outline/10" />
            </div>

            {/* Google button */}
            <button
              type="button"
              className="w-full h-14 bg-white border border-outline/10 hover:bg-surface-container-low text-on-surface font-label-bold text-label-bold rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            {/* Demo Login button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full h-14 mt-4 bg-secondary-fixed text-on-secondary-container font-label-bold text-label-bold rounded-xl shadow-sm border border-secondary-fixed-dim/30 hover:bg-secondary-fixed-dim active:scale-[0.98] transition-all duration-300"
            >
              Demo Login
            </button>

            {/* Register link */}
            <p className="text-center font-body-md text-on-surface-variant mt-8">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-primary font-label-bold hover:text-secondary transition-colors underline-offset-4 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative dot-grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-b from-primary/10 to-transparent"
          style={{
            backgroundImage: 'radial-gradient(rgb(22, 40, 57) 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
        />
      </section>
    </main>
  );
}
