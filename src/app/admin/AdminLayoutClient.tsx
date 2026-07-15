'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col md:ml-64 ml-0 min-h-screen">
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
