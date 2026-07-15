'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag, User, Menu, X, Search, LogIn, UserPlus } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';

const loggedOutLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const userLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Profile', href: '/profile' },
];

const adminLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Dashboard', href: '/admin' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const role = (session?.user as unknown as { role?: string })?.role;
  const isLoggedIn = !!session?.user;
  const isAdmin = role === 'admin';

  const navLinks = isLoggedIn
    ? isAdmin
      ? adminLinks
      : userLinks
    : loggedOutLinks;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const totalQty = json.data.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setCartCount(totalQty);
        }
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
      window.addEventListener('cart-updated', fetchCartCount);
      return () => {
        window.removeEventListener('cart-updated', fetchCartCount);
      };
    } else {
      setCartCount(0);
    }
  }, [isLoggedIn]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-card h-20">
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display-logo text-display-logo tracking-[0.3em] text-primary"
        >
          ME GEARS
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-label-bold text-label-bold pb-1 transition-colors ${
                isActive(link.href)
                  ? 'text-primary border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-6">
          {isPending ? (
            /* Loading skeleton */
            <div className="flex items-center gap-6">
              <div className="w-5 h-5 rounded-full bg-outline/10 animate-pulse" />
              <div className="w-5 h-5 rounded-full bg-outline/10 animate-pulse" />
            </div>
          ) : isLoggedIn ? (
            isAdmin ? (
              /* Admin: Search + User icon linking to /admin */
              <>
                <button className="hover:text-secondary transition-all duration-300" aria-label="Search">
                  <Search size={22} />
                </button>
                <Link href="/admin" className="hover:text-secondary transition-all duration-300 hidden sm:block" aria-label="Admin Dashboard">
                  {session?.user?.image ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-outline/25">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Admin'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <User size={22} />
                  )}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hover:text-error transition-all duration-300 hidden sm:block text-sm font-label-bold cursor-pointer"
                  aria-label="Sign Out"
                >
                  Logout
                </button>
              </>
            ) : (
              /* User: Search + Heart + Cart (badge) + User icon linking to /profile */
              <>
                <button className="hover:text-secondary transition-all duration-300 hidden sm:block" aria-label="Search">
                  <Search size={22} />
                </button>
                <Link href="/wishlist" className="hover:text-secondary transition-all duration-300" aria-label="Wishlist">
                  <Heart size={22} />
                </Link>
                <Link href="/cart" className="relative group hover:text-secondary transition-all duration-300" aria-label="Cart">
                  <ShoppingBag size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className="hover:text-secondary transition-all duration-300 hidden sm:block" aria-label="Account">
                  {session?.user?.image ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-outline/25">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <User size={22} />
                  )}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hover:text-error transition-all duration-300 hidden sm:block text-sm font-label-bold"
                  aria-label="Sign Out"
                >
                  Logout
                </button>
              </>
            )
          ) : (
            /* Logged out: Login and Sign Up buttons */
            <>
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 font-label-bold text-label-bold text-primary hover:text-secondary transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-label-bold text-label-bold rounded-xl hover:bg-primary-container transition-all duration-300"
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </Link>
              {/* Mobile: just show user icon linking to login */}
              <Link href="/login" className="hover:text-secondary transition-all duration-300 sm:hidden" aria-label="Account">
                <User size={22} />
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden hover:text-secondary transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-surface/95 backdrop-blur-md shadow-lg border-t border-outline-variant">
          <div className="flex flex-col py-4 px-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-4 rounded-lg font-label-bold transition-colors ${
                  isActive(link.href)
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile-only auth actions */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleSignOut();
                }}
                className="py-3 px-4 rounded-lg font-label-bold text-error hover:bg-error/10 transition-colors text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-lg font-label-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-lg font-label-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
