import Link from 'next/link';
import { Share2, Globe, AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary w-full pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand column */}
        <div className="space-y-6">
          <Link href="/" className="font-display-logo text-display-logo text-on-primary">
            ME GEARS
          </Link>
          <p className="text-on-primary-container font-body-md">
            Precision-engineered apparel for those who live on the edge. Modern aesthetics, industrial durability.
          </p>
          <div className="flex gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-on-primary/10 text-on-primary hover:bg-secondary transition-all">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-on-primary/10 text-on-primary hover:bg-secondary transition-all">
              <Globe size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-on-primary/10 text-on-primary hover:bg-secondary transition-all">
              <AtSign size={18} />
            </button>
          </div>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="font-label-bold text-label-bold text-secondary mb-6 uppercase tracking-widest">
            Company Info
          </h4>
          <ul className="space-y-4">
            {[
              { label: 'Our Story', href: '/about' },
              { label: 'Sustainability', href: '/about' },
              { label: 'Manufacturing', href: '/about' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-on-primary-container hover:text-on-primary transition-all block hover:translate-x-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-label-bold text-label-bold text-secondary mb-6 uppercase tracking-widest">
            Support
          </h4>
          <ul className="space-y-4">
            {[
              { label: 'Contact Us', href: '/contact' },
              { label: 'Size Guide', href: '/shop' },
              { label: 'Shipping Policy', href: '/contact' },
              { label: 'Returns & Exchanges', href: '/contact' },
              { label: 'Track Order', href: '/orders' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-on-primary-container hover:text-on-primary transition-all block hover:translate-x-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-label-bold text-label-bold text-secondary mb-6 uppercase tracking-widest">
            Stay Connected
          </h4>
          <p className="text-on-primary-container font-body-md mb-4">
            Join our mission for exclusive technical updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="email@gear.com"
              className="bg-on-primary/10 border-0 rounded-lg py-2 px-4 text-on-primary focus:ring-1 focus:ring-secondary w-full placeholder:text-on-primary/30 outline-none"
            />
            <button className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-bold hover:bg-secondary-container transition-all">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1280px] mx-auto px-6 pt-8 border-t border-on-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-primary-container/60 text-sm font-label-bold">
          © 2024 ME GEARS. All rights reserved.
        </p>
        <div className="flex gap-8">
          <Link
            href="/contact"
            className="text-on-primary-container/60 text-sm font-label-bold hover:text-on-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-on-primary-container/60 text-sm font-label-bold hover:text-on-primary transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
