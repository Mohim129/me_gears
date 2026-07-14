'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Eye, SlidersHorizontal, ShoppingBag, Clock, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import BentoCard from '@/components/ui/BentoCard';

interface AdminOrder {
  id: string;
  customerName: string;
  customerInitials: string;
  date: string;
  total: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  fulfillmentStatus: 'Shipped' | 'Processing' | 'Delivered' | 'Cancelled';
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ME-90210',
    customerName: 'Elena Kovic',
    customerInitials: 'EK',
    date: 'Oct 24, 2023',
    total: 173300, // 1420.50 * 122 rounded
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Shipped',
  },
  {
    id: 'ME-90211',
    customerName: 'Jaxon Wright',
    customerInitials: 'JW',
    date: 'Oct 24, 2023',
    total: 108600, // 890 * 122 rounded
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Processing',
  },
  {
    id: 'ME-90212',
    customerName: 'Sarah Sterling',
    customerInitials: 'SS',
    date: 'Oct 23, 2023',
    total: 256800, // 2105.20 * 122 rounded
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Delivered',
  },
  {
    id: 'ME-90213',
    customerName: 'Riley Thorne',
    customerInitials: 'RT',
    date: 'Oct 23, 2023',
    total: 41500, // 340 * 122 rounded
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Cancelled',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Shipped'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle order status update
  const handleUpdateStatus = (id: string) => {
    const nextStatus = prompt(
      'Enter new fulfillment status (Shipped, Processing, Delivered, Cancelled):'
    );
    if (!nextStatus) return;

    const normalized = nextStatus.trim().toLowerCase();
    let statusToSet: 'Shipped' | 'Processing' | 'Delivered' | 'Cancelled' = 'Processing';

    if (normalized === 'shipped') statusToSet = 'Shipped';
    else if (normalized === 'processing') statusToSet = 'Processing';
    else if (normalized === 'delivered') statusToSet = 'Delivered';
    else if (normalized === 'cancelled') statusToSet = 'Cancelled';
    else {
      alert('Invalid status. Status not updated.');
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, fulfillmentStatus: statusToSet } : o))
    );
  };

  const handleExportCSV = () => {
    alert('Orders list exported to CSV successfully!');
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'Pending') {
      matchesTab = order.fulfillmentStatus === 'Processing';
    } else if (activeTab === 'Shipped') {
      matchesTab = order.fulfillmentStatus === 'Shipped';
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold">Orders Management</h1>
        <p className="text-sm text-on-surface-variant font-body-md mt-1">
          Fulfill customer orders, review statuses, and track invoice payments.
        </p>
      </div>

      {/* Summary Metrics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={ShoppingBag}
          label="Total Orders (MTD)"
          value="1,284"
          trend="+12.5%"
        />
        <StatsCard
          icon={Clock}
          label="Pending Fulfillment"
          value="42 Orders"
          trend="Avg. wait: 14h"
          alert
        />
        <StatsCard
          icon={CreditCard}
          label="Revenue Today"
          value="৳ 20,26,200"
          trend="Projected: ৳ 26.4L"
        />
      </section>

      {/* Table Filter controls */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-surface-container-lowest p-6 rounded-xl border border-outline/10 shadow-card">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-surface-container-low font-label-bold text-xs uppercase text-on-surface flex items-center gap-2 hover:bg-surface-container-high transition-colors active:scale-95 border border-outline/10">
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-1 bg-surface-container-low border border-outline/15 rounded-lg p-0.5">
            {(['All', 'Pending', 'Shipped'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-label-bold transition-all ${
                  activeTab === tab
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-outline/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg border border-outline/15 transition-all"
            title="Export orders"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
      <BentoCard className="overflow-hidden p-0 md:p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 text-[11px] font-label-bold uppercase tracking-widest text-outline border-b border-outline/10">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Fulfillment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5 font-body-md">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-on-surface-variant italic">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/30 transition-colors">
                    {/* ID */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-label-bold text-secondary hover:underline text-sm"
                      >
                        #{order.id}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-[10px] flex items-center justify-center font-bold text-primary">
                          {order.customerInitials}
                        </div>
                        <span className="font-body-md text-sm text-primary font-medium">
                          {order.customerName}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-on-surface-variant text-sm">{order.date}</td>

                    {/* Total */}
                    <td className="px-6 py-4 font-semibold text-primary text-sm">
                      ৳ {order.total.toLocaleString('en-IN')}
                    </td>

                    {/* Payment status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-label-bold ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.paymentStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Fulfillment status Badge */}
                    <td className="px-6 py-4">
                      <StatusBadge status={order.fulfillmentStatus} />
                    </td>

                    {/* Row actions */}
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-xs font-label-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleUpdateStatus(order.id)}
                        className="text-xs font-label-bold text-secondary hover:text-secondary-container transition-colors uppercase tracking-wider"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Static Pagination */}
        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline/5 flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              Showing 1-{filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-surface-container-high disabled:opacity-30" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-md bg-secondary text-on-secondary text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-md hover:bg-surface-container-high text-xs font-bold">2</button>
              <button className="p-1.5 rounded-md hover:bg-surface-container-high">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </BentoCard>
    </div>
  );
}
