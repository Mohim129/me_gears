'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { Button, Badge } from '@heroui/react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#', active: true },
    { name: 'Shop', href: '#' },
    { name: 'Men', href: '#' },
    { name: 'Women', href: '#' },
    { name: 'Accessories', href: '#' },
    { name: 'About', href: '#' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-card transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="#"
              className="font-display-logo text-[24px] font-extrabold tracking-[0.3em] text-primary"
            >
              ME GEARS
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-label-bold text-[14px] pb-1 transition-colors ${link.active
                    ? 'text-primary border-b-2 border-secondary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Wishlist"
              className="text-primary hover:text-secondary min-w-10 w-10 h-10 border-none bg-transparent"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Link href="#" className="relative flex items-center justify-center p-2 group text-primary hover:text-secondary">
              <Badge
                content="2"
                color="warning"
                size="sm"
                className="bg-secondary text-white border-none font-label-bold text-[10px] min-w-4 h-4 p-0 top-1 right-1 rounded-full flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 group-hover:text-secondary transition-all" />
              </Badge>
            </Link>
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Account"
              className="hidden sm:inline-flex text-primary hover:text-secondary min-w-10 w-10 h-10 border-none bg-transparent"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Hamburger toggle */}
            <Button
              isIconOnly
              variant="ghost"
              aria-label="Toggle Menu"
              className="md:hidden text-primary min-w-10 w-10 h-10 border-none bg-transparent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-surface p-6 shadow-2xl flex flex-col justify-between transform transition-transform duration-300">
            <div>
              <div className="flex justify-between items-center mb-10">
                <span className="font-display-logo text-[20px] font-extrabold tracking-[0.2em] text-primary">
                  ME GEARS
                </span>
                <Button
                  isIconOnly
                  variant="ghost"
                  aria-label="Close Menu"
                  className="text-primary min-w-8 w-8 h-8 border-none bg-transparent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-label-bold text-lg pb-1 border-b border-outline/10 ${link.active
                      ? 'text-primary font-semibold'
                      : 'text-on-surface-variant hover:text-primary'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-outline/10 flex items-center justify-around">
              <Button
                variant="ghost"
                className="text-primary gap-2 border-none bg-transparent hover:bg-black/5 flex items-center justify-center"
              >
                <User className="w-4 h-4" />
                <span>Account</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
