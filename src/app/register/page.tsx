'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ShieldCheck, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'error' | 'success'>('error');
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showToastMessage = (msg: string, type: 'error' | 'success' = 'error') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signUp.email(
        {
          name: fullName,
          email,
          password,
          image: photoUrl || undefined,
        },
        {
          onSuccess: () => {
            showToastMessage('Account created successfully! Redirecting to login...', 'success');
            setTimeout(() => {
              router.push('/login');
            }, 1500);
          },
          onError: (ctx) => {
            showToastMessage(
              ctx.error?.message || 'Registration failed. Please try again.'
            );
          },
        }
      );
    } catch {
      showToastMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    await signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
  };

  const inputBaseClass =
    'w-full px-4 py-3 pr-12 rounded-xl bg-surface-dim/30 border focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 outline-none font-body-md';

  return (
    <main className="min-h-screen flex overflow-hidden">
      {/* Toast notification */}
      {showToast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-lg font-label-bold text-sm transition-all duration-300 ${
            toastType === 'error'
              ? 'bg-error text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {toastMsg}
        </div>
      )}

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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError('password');
                    }}
                    placeholder="••••••••"
                    className={`${inputBaseClass} pr-20 ${
                      errors.password ? 'border-error' : 'border-outline/10'
                    }`}
                  />
                  <Lock
                    size={18}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-outline/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError('confirmPassword');
                    }}
                    placeholder="••••••••"
                    className={`${inputBaseClass} pr-20 ${
                      errors.confirmPassword ? 'border-error' : 'border-outline/10'
                    }`}
                  />
                  <ShieldCheck
                    size={18}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-outline/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error text-xs font-label-bold">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Photo URL (optional) */}
            <div className="space-y-2">
              <label
                htmlFor="register-photo"
                className="font-label-bold text-label-bold text-on-surface-variant"
              >
                PHOTO URL <span className="text-outline/50 font-body-md text-xs">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="register-photo"
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/your-photo.jpg"
                  className={`${inputBaseClass} border-outline/10`}
                />
                <ImageIcon
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-label-bold shadow-lg transform active:scale-95 transition-all duration-200 uppercase tracking-widest flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-secondary/70 text-white cursor-not-allowed'
                  : 'bg-secondary text-white hover:bg-on-secondary-fixed-variant'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
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
                onClick={handleGoogleSignUp}
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
