'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { label: 'Personal Info', href: '/profile', icon: User },
  { label: 'Order History', href: '/orders', icon: ShoppingBag },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Settings', href: '/profile/settings', icon: Settings },
];

interface AccountSidebarProps {
  name?: string;
  initials?: string;
  memberSince?: string;
}

export default function AccountSidebar({
  name = 'Marcus Sterling',
  initials = 'MS',
  memberSince = 'Nov 2024',
}: AccountSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/profile') return pathname === '/profile';
    if (href === '/orders') return pathname === '/orders' || pathname.startsWith('/orders/');
    return pathname === href;
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-surface-container-lowest border border-outline/10 shadow-card p-6 rounded-xl flex flex-col gap-6">
      {/* Profile Header card in sidebar */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-outline/10">
        <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-lg text-2xl shadow-md mb-3">
          {initials}
        </div>
        <h3 className="font-headline-md text-lg text-primary">{name}</h3>
        <p className="text-xs text-on-surface-variant font-body-md mt-1">Member since {memberSince}</p>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-sm transition-all ${
                active
                  ? 'bg-secondary text-on-secondary shadow-md shadow-secondary/15'
                  : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-primary'
              }`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}

        {/* Log Out */}
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-sm text-on-surface-variant hover:bg-rose-50 hover:text-error dark:hover:bg-rose-950/20 transition-all mt-4 border-t border-outline/5 pt-4"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </Link>
      </nav>
    </aside>
  );
}
