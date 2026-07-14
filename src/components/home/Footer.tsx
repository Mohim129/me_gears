import Link from 'next/link';
import { Globe, Mail, Share2 } from 'lucide-react';
import { Button } from '@heroui/react';

export default function Footer() {
  const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Store Locator', href: '#' },
    { name: 'Sustainability', href: '#' },
  ];

  const quickLinks = [
    { name: 'Track Order', href: '#' },
    { name: 'Shipping Policy', href: '#' },
    { name: 'Size Guide', href: '#' },
    { name: 'Returns', href: '#' },
  ];

  const categoryLinks = [
    { name: "Men's New Arrivals", href: '#' },
    { name: "Women's Collection", href: '#' },
    { name: 'Limited Drops', href: '#' },
    { name: 'Gifts & Kits', href: '#' },
  ];

  return (
    <footer className="w-full pt-16 pb-8 bg-primary text-on-primary">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <span className="font-display-logo text-[24px] font-extrabold tracking-[0.3em] text-white">
            ME GEARS
          </span>
          <p className="text-on-primary-container font-body-md text-[16px] leading-relaxed">
            Crafting industrial-chic apparel for those who lead with confidence and edge. Precision engineering meets high fashion.
          </p>
          <div className="flex gap-2">
            <Button
              isIconOnly
              variant="ghost"
              className="text-on-primary-container hover:text-secondary min-w-10 w-10 h-10 hover:bg-white/10 border-none bg-transparent"
              aria-label="Website"
            >
              <Globe className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="ghost"
              className="text-on-primary-container hover:text-secondary min-w-10 w-10 h-10 hover:bg-white/10 border-none bg-transparent"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="ghost"
              className="text-on-primary-container hover:text-secondary min-w-10 w-10 h-10 hover:bg-white/10 border-none bg-transparent"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-label-bold text-secondary text-[14px] font-semibold tracking-wider uppercase mb-6">
            Company Info
          </h4>
          <ul className="flex flex-col gap-4">
            {companyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-on-primary-container hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-[16px]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-label-bold text-secondary text-[14px] font-semibold tracking-wider uppercase mb-6">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-on-primary-container hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-[16px]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-label-bold text-secondary text-[14px] font-semibold tracking-wider uppercase mb-6">
            Categories
          </h4>
          <ul className="flex flex-col gap-4">
            {categoryLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-on-primary-container hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-[16px]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto px-6 mt-16 pt-8 border-t border-on-primary-container/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-primary-container font-body-md text-[14px]">
          © 2024 ME GEARS. All rights reserved.
        </p>
        <div className="flex gap-8 text-[12px] font-label-bold text-on-primary-container">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
}
