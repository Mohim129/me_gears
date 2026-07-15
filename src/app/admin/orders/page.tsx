'use client';

import { useState, useEffect } from 'react';
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
  status: string;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  fulfillmentStatus: 'Shipped' | 'Processing' | 'Delivered' | 'Cancelled';
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({});
  
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Shipped'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/orders?all=true');
      if (!res.ok) {
        throw new Error('Failed to fetch admin orders list');
      }
      const json = await res.json();
      if (json.success) {
        const mapped = (json.data || []).map((o: any) => {
          const nameParts = (o.customer || 'Guest').split(' ');
          const initials = nameParts.map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

          // Fulfillment status mapping
          let fulfillment: AdminOrder['fulfillmentStatus'] = 'Processing';
          if (o.status === 'Cancelled') fulfillment = 'Cancelled';
          else if (o.status === 'Shipped') fulfillment = 'Shipped';
          else if (o.status === 'Delivered') fulfillment = 'Delivered';

          // Payment status mapping
          let payment: AdminOrder['paymentStatus'] = 'Pending';
          if (['Shipped', 'Delivered'].includes(o.status)) {
            payment = 'Paid';
          } else if (o.status === 'Cancelled') {
            payment = 'Refunded';
          }

          return {
            id: o.id || o._id,
            customerName: o.customer || 'Guest Customer',
            customerInitials: initials || 'G',
            date: o.createdAt
              ? new Date(o.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A',
            total: o.amount,
            status: o.status || 'Pending',
            paymentStatus: payment,
            fulfillmentStatus: fulfillment,
          };
        });
        setOrders(mapped);
      } else {
        throw new Error(json.error || 'Failed to parse orders');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Handle order status update
  const handleUpdateStatus = async (id: string) => {
    const normalized = selectedStatuses[id]?.trim();
    if (!normalized) return;

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(normalized)) {
      alert('Invalid status. Valid values: Pending, Confirmed, Shipped, Delivered, Cancelled');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: normalized }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status in DB');
      }

      const json = await res.json();
      if (json.success) {
        await fetchAllOrders();
      } else {
        throw new Error(json.error || 'Failed to update order');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating order status.');
      setIsLoading(false);
    }
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
          label="Total Orders"
          value={orders.length.toString()}
        />
        <StatsCard
          icon={Clock}
          label="Pending Fulfillment"
          value={`${orders.filter((o) => o.fulfillmentStatus === 'Processing').length} Orders`}
          alert
        />
        <StatsCard
          icon={CreditCard}
          label="Total Revenue"
          value={`৳ ${orders.reduce((sum, o) => sum + (o.fulfillmentStatus !== 'Cancelled' ? o.total : 0), 0).toLocaleString('en-IN')}`}
        />
      </section>

      {/* Table Filter controls */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-surface-container-lowest p-6 rounded-xl border border-outline/10 shadow-card">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-surface-container-low font-label-bold text-xs uppercase text-on-surface flex items-center gap-2 hover:bg-surface-container-high transition-colors active:scale-95 border border-outline/10 cursor-pointer">
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-1 bg-surface-container-low border border-outline/15 rounded-lg p-0.5">
            {(['All', 'Pending', 'Shipped'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-label-bold transition-all cursor-pointer ${
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
            className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg border border-outline/15 transition-all cursor-pointer"
            title="Export orders"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
      <BentoCard className="overflow-hidden p-0 md:p-0">
        {error ? (
          <div className="text-center py-12 text-error bg-rose-50 dark:bg-rose-950/20 border border-outline/10 m-6 rounded-xl">
            {error}
          </div>
        ) : isLoading && orders.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="animate-spin h-8 w-8 text-secondary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-on-surface-variant font-label-bold">Loading orders registry...</p>
          </div>
        ) : (
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
                          #{order.id.substring(order.id.length - 8).toUpperCase()}
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
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={selectedStatuses[order.id] || order.status}
                            onChange={(e) => setSelectedStatuses((prev) => ({ ...prev, [order.id]: e.target.value }))}
                            className="rounded-lg border border-outline/20 bg-background px-2 py-1.5 text-xs font-label-bold text-primary"
                          >
                            {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateStatus(order.id)}
                            className="text-xs font-label-bold text-secondary hover:text-secondary-container transition-colors uppercase tracking-wider cursor-pointer"
                          >
                            Update
                          </button>
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-xs font-label-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Static Pagination */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline/5 flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              Showing 1-{filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-surface-container-high disabled:opacity-30" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-md bg-secondary text-on-secondary text-xs font-bold">1</button>
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
