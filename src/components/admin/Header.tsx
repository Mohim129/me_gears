'use client';

import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md shadow-card h-16 flex items-center justify-between px-8">
      {/* Search */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search orders, products..."
          className="w-full bg-surface-container-low border-0 rounded-xl py-2.5 pl-10 pr-4 text-on-surface focus:ring-2 focus:ring-primary placeholder:text-outline-variant font-body-md transition-all outline-none"
        />
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative hover:text-secondary transition-all" aria-label="Notifications">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Admin greeting */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-label-bold text-primary">Welcome back</p>
            <p className="text-xs text-on-surface-variant">Admin Chief</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-bold text-sm">
            AC
          </div>
        </div>
      </div>
    </header>
  );
}
