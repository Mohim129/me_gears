'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronRight, SlidersHorizontal, ArrowRight, Eye, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/AccountSidebar';
import BentoCard from '@/components/ui/BentoCard';
import StatusBadge from '@/components/ui/StatusBadge';

interface OrderItem {
  id: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
}

const MOCK_ORDERS: OrderItem[] = [
  { id: 'ME-49201-GL', date: 'Nov 12, 2024', status: 'Shipped', total: 50260 },
  { id: 'ME-48190-KL', date: 'Oct 28, 2024', status: 'Delivered', total: 34770 },
  { id: 'ME-47321-SL', date: 'Oct 15, 2024', status: 'Confirmed', total: 23790 },
  { id: 'ME-46294-OL', date: 'Sep 30, 2024', status: 'Pending', total: 60390 },
  { id: 'ME-45921-PL', date: 'Sep 12, 2024', status: 'Delivered', total: 15490 },
];

export default function OrderHistoryPage() {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logic
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    // Search query match
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter match
    let matchesStatus = true;
    if (filter === 'Active') {
      matchesStatus = ['Pending', 'Confirmed', 'Shipped'].includes(order.status);
    } else if (filter === 'Completed') {
      matchesStatus = order.status === 'Delivered';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-container-max mx-auto px-gutter w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Account Sidebar & Promo Banner Stacked */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0 space-y-6">
            <AccountSidebar />

            {/* Promo Card: Complete your collection */}
            <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-6 shadow-card border border-outline/10 group">
              <div className="absolute inset-0 opacity-40 z-0">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh_qJhJOYtgRJryICIkRUuF6y3nldqeh8NKFUNzaQxGCLOpWCgM4B5SL4-Cb2A97sCiHqTFJXQYVrniAmcqhMxjisp3CFhSDOX1vG5glR6VSk1cDtUQBvqbxrddG2PMcq7BGk0iJXil2dnsHoLuj-welKEU0i0cVxjR5YhYuZ9CRCj1mNa4Ubqnlayt3-RvMIpjSop9b0l-5tPJpYPbBYV2q4bFaFRNpU4RkxjUjskckexoIpIdSdziA"
                  alt="Winter Drop"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="300px"
                />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="inline-block bg-secondary text-on-secondary text-[10px] font-label-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  NEW SEASON
                </span>
                <h3 className="font-headline-md text-base leading-tight">Complete your collection.</h3>
                <p className="text-xs text-on-primary-container font-body-md">
                  Discover technical layers and utility outerwear engineered for the winter drop.
                </p>
                <Link
                  href="/shop?category=outerwear"
                  className="inline-flex items-center gap-1.5 font-label-bold text-xs uppercase tracking-wider text-secondary hover:text-white transition-colors pt-2 group/btn"
                >
                  <span>Winter Drop</span>
                  <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <section className="flex-1 w-full space-y-6">
            <BentoCard>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="font-headline-lg text-xl md:text-2xl text-primary">Order History</h1>
                  <p className="text-xs md:text-sm text-on-surface-variant font-body-md mt-1">
                    Manage and track your recent orders.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search by Order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-outline/20 rounded-xl py-2 pl-9 pr-4 text-sm font-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 border-b border-outline/10 pb-4 mb-6">
                {(['All', 'Active', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-label-bold uppercase tracking-wider transition-all ${
                      filter === tab
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-background hover:bg-surface-container text-on-surface-variant border border-outline/10'
                    }`}
                  >
                    {tab} Orders
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline/10 text-outline text-[11px] font-label-bold uppercase tracking-wider">
                      <th className="py-4 px-2">Order ID</th>
                      <th className="py-4 px-2">Date</th>
                      <th className="py-4 px-2">Status</th>
                      <th className="py-4 px-2">Total</th>
                      <th className="py-4 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline/5">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm font-body-md text-on-surface-variant italic">
                          No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors font-body-md">
                          <td className="py-4 px-2 font-label-bold text-primary text-sm">#{order.id}</td>
                          <td className="py-4 px-2 text-sm text-on-surface-variant">{order.date}</td>
                          <td className="py-4 px-2">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-4 px-2 font-semibold text-primary text-sm">
                            ৳ {order.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <Link
                              href={`/orders/${order.id}`}
                              className="inline-flex items-center gap-1 text-xs font-label-bold text-secondary hover:text-secondary-container transition-colors uppercase tracking-wider"
                            >
                              <Eye size={12} />
                              <span>Details</span>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Static Pagination */}
              {filteredOrders.length > 0 && (
                <div className="flex items-center justify-between pt-6 border-t border-outline/10 mt-6">
                  <span className="text-xs text-on-surface-variant font-body-md">
                    Showing 1-{filteredOrders.length} of {filteredOrders.length} orders
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-outline/10 rounded-lg hover:bg-surface-container cursor-not-allowed opacity-50 transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="px-3 py-1 rounded-lg text-xs font-label-bold bg-primary text-on-primary">
                      1
                    </button>
                    <button className="p-2 border border-outline/10 rounded-lg hover:bg-surface-container cursor-not-allowed opacity-50 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </BentoCard>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
