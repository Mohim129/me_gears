'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import Image from 'next/image';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const name = session?.user?.name || 'Admin Chief';
  const email = session?.user?.email || 'admin@megears.com';
  const avatar = session?.user?.image || null;

  const nameParts = name.split(' ');
  const initials = nameParts.map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'A';

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-on-primary/10">
        <Link
          href="/"
          className="font-display-logo text-[20px] tracking-[0.3em] text-on-primary"
        >
          ME GEARS
        </Link>
        <p className="text-on-primary-container text-xs mt-1 font-label-bold tracking-wider">
          ADMIN PANEL
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto hide-scrollbar">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-bold text-sm transition-all ${
              isActive(href)
                ? 'bg-secondary text-on-secondary'
                : 'text-on-primary-container hover:bg-on-primary/10 hover:text-on-primary'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-on-primary/10">
        <div className="flex items-center gap-3 mb-3">
          {avatar ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md">
              <Image
                src={avatar}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-label-bold text-sm">
              {initials}
            </div>
          )}
          <div>
            <p className="text-on-primary text-sm font-label-bold">{name}</p>
            <p className="text-on-primary-container text-xs truncate max-w-[150px]">{email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-on-primary-container hover:text-error text-sm font-label-bold transition-colors w-full px-2 py-1 text-left cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
