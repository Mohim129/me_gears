'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Zap, 
  UserPlus, 
  List, 
  SlidersHorizontal, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Search 
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import BentoCard from '@/components/ui/BentoCard';

interface CustomerItem {
  id: string;
  name: string;
  initials: string;
  joinDate: string;
  email: string;
  totalOrders: number;
  status: 'Active' | 'Premium' | 'New' | 'Inactive';
  bgColor: string;
  textColor: string;
}

const CUSTOMERS_DATA: CustomerItem[] = [
  {
    id: 'STERLING-9021',
    name: 'Julian Sterling',
    initials: 'JS',
    joinDate: '2023',
    email: 'j.sterling@industry.com',
    totalOrders: 42,
    status: 'Active',
    bgColor: 'bg-primary-fixed',
    textColor: 'text-primary',
  },
  {
    id: 'MERCER-8942',
    name: 'Arlo Mercer',
    initials: 'AM',
    joinDate: '2022',
    email: 'arlo.m@designhaus.io',
    totalOrders: 128,
    status: 'Premium',
    bgColor: 'bg-secondary-fixed',
    textColor: 'text-secondary',
  },
  {
    id: 'WEBB-8810',
    name: 'Elena Webb',
    initials: 'EW',
    joinDate: '2024',
    email: 'elena.webb@techgear.net',
    totalOrders: 8,
    status: 'New',
    bgColor: 'bg-tertiary-fixed',
    textColor: 'text-on-tertiary-fixed',
  },
  {
    id: 'KOVIC-8700',
    name: 'Roman Kovic',
    initials: 'RK',
    joinDate: '2021',
    email: 'kovic.roman@logistics.ru',
    totalOrders: 310,
    status: 'Inactive',
    bgColor: 'bg-primary-fixed-dim',
    textColor: 'text-primary',
  },
  {
    id: 'MOON-8692',
    name: 'Silas Moon',
    initials: 'SM',
    joinDate: '2024',
    email: 'silas.m@studio.com',
    totalOrders: 1,
    status: 'New',
    bgColor: 'bg-on-secondary-fixed',
    textColor: 'text-on-secondary',
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Premium' | 'New' | 'Inactive'>('All');

  const filteredCustomers = CUSTOMERS_DATA.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'All' || customer.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200/20">
            Active
          </span>
        );
      case 'Premium':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
            Premium
          </span>
        );
      case 'New':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/20">
            New
          </span>
        );
      case 'Inactive':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/20">
            Inactive
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-surface-container text-on-surface">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Customer Directory Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold">
            Customer Management
          </h1>
          <p className="text-sm text-on-surface-variant font-body-md mt-1">
            Overview, search, and manage your user accounts and customer tiers.
          </p>
        </div>
        <button
          onClick={() => alert('Add Customer modal or action triggered (demo)!')}
          className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-label-bold transition-all duration-300 shadow-md active:scale-95 shrink-0"
        >
          <UserPlus size={18} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Users}
          label="Total Customers"
          value="12,842"
          trend="+12%"
        />
        <StatsCard
          icon={Zap}
          label="Active Today"
          value="1,402"
          trend="+5%"
        />
        <StatsCard
          icon={UserPlus}
          label="New This Month"
          value="849"
          trend="+24.8%"
        />
      </section>

      {/* Filter and search toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-surface-container-lowest p-6 rounded-xl border border-outline/10 shadow-card">
        {/* Status filters */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-surface-container-low font-label-bold text-xs uppercase text-on-surface flex items-center gap-2 hover:bg-surface-container-high transition-colors active:scale-95 border border-outline/10">
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-1 bg-surface-container-low border border-outline/15 rounded-lg p-0.5">
            {(['All', 'Active', 'Premium', 'New', 'Inactive'] as const).map((tab) => (
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

        {/* Search & Export */}
        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-outline/20 rounded-xl py-2.5 pl-10 pr-4 text-sm font-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
          </div>

          <button
            onClick={() => alert('Customer list exported to CSV successfully!')}
            className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg border border-outline/15 transition-all"
            title="Export customers"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Customers Table Container */}
      <BentoCard className="overflow-hidden p-0 md:p-0">
        {/* Table Title Bar */}
        <div className="px-6 py-4 bg-primary text-on-primary flex justify-between items-center">
          <h4 className="font-headline-md text-[18px] flex items-center gap-2 font-bold">
            <List size={20} />
            Registry
          </h4>
          <div className="flex gap-2">
            <button 
              onClick={() => alert('Applying advanced sorting...')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Filter Registry"
            >
              <SlidersHorizontal size={18} />
            </button>
            <button 
              onClick={() => alert('Downloading Registry...')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Download Registry"
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/30 text-[11px] font-label-bold uppercase tracking-widest text-on-surface-variant">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-md text-sm">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant italic">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-surface-container/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${customer.bgColor} ${customer.textColor} flex items-center justify-center font-bold text-xs`}>
                          {customer.initials}
                        </div>
                        <div>
                          <p className="font-body-md text-primary font-semibold">
                            {customer.name}
                          </p>
                          <p className="text-[10px] text-outline uppercase tracking-wider">
                            Member since {customer.joinDate}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 text-primary font-medium">
                      {customer.totalOrders} {customer.totalOrders === 1 ? 'Order' : 'Orders'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}/orders`}
                        className="text-secondary font-label-bold hover:underline underline-offset-4 flex items-center justify-end gap-1"
                      >
                        <span>View Orders</span>
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-outline-variant/20">
          <p className="text-xs text-outline">
            Showing <span className="font-bold">{filteredCustomers.length}</span> of <span className="font-bold">12,842</span> results
          </p>
          <div className="flex gap-1">
            <button 
              className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm border border-outline-variant/30 text-primary hover:bg-primary hover:text-white transition-all"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white shadow-sm font-bold text-xs">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm border border-outline-variant/30 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm border border-outline-variant/30 text-primary hover:bg-primary hover:text-white transition-all font-bold text-xs">
              3
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded bg-white shadow-sm border border-outline-variant/30 text-primary hover:bg-primary hover:text-white transition-all"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </BentoCard>

      {/* Footer Context Info */}
      <div className="flex justify-between items-center pb-6">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs text-outline">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>System Status: Optimal</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-outline">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span>Last Sync: Just now</span>
          </div>
        </div>
        <p className="text-[10px] text-outline uppercase tracking-widest hidden sm:block">
          © 2024 ME GEARS INDUSTRIAL OPERATIONS
        </p>
      </div>
    </div>
  );
}
