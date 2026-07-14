'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag, User, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Dashboard', href: '/admin' },
  { label: 'Profile', href: '/profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

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
          {NAV_LINKS.map((link) => (
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
          <Link href="/wishlist" className="hover:text-secondary transition-all duration-300" aria-label="Wishlist">
            <Heart size={22} />
          </Link>
          <Link href="/cart" className="relative group hover:text-secondary transition-all duration-300" aria-label="Cart">
            <ShoppingBag size={22} />
            <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </Link>
          <Link href="/login" className="hover:text-secondary transition-all duration-300 hidden sm:block" aria-label="Account">
            <User size={22} />
          </Link>

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
            {NAV_LINKS.map((link) => (
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
          </div>
        </div>
      )}
    </nav>
  );
}
