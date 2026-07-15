'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Percent,
  TrendingDown,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import BentoCard from '@/components/ui/BentoCard';

interface TransactionItem {
  id: string;
  orderId: string;
  customerName: string;
  date: string;
  type: 'Sale' | 'Refund' | 'Adjustment';
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Disputed';
}



export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; amount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<'All' | 'Sale' | 'Refund' | 'Adjustment'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending' | 'Failed' | 'Disputed'>('All');
  const [dateRange, setDateRange] = useState('All');

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin/transactions');
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data || []);
        setWeeklyData(json.weeklyData || []);
      } else {
        throw new Error(json.error || 'Failed to load ledger');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const maxWeeklyAmount = Math.max(...weeklyData.map((w) => w.amount), 1);

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    let matchesType = true;
    if (typeFilter !== 'All') matchesType = tx.type === typeFilter;

    let matchesStatus = true;
    if (statusFilter !== 'All') matchesStatus = tx.status === statusFilter;

    return matchesType && matchesStatus;
  });

  const handleExportReport = () => {
    alert('Financial Transaction Report has been generated and downloaded.');
  };

  const getStatusIcon = (status: TransactionItem['status']) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="text-emerald-600" size={16} />;
      case 'Pending':
        return <Clock className="text-amber-500" size={16} />;
      case 'Failed':
        return <XCircle className="text-rose-500" size={16} />;
      case 'Disputed':
        return <AlertOctagon className="text-purple-600" size={16} />;
    }
  };

  const netRevenue = transactions.reduce((sum, tx) => sum + (tx.status === 'Completed' ? tx.amount : 0), 0);
  const avgTransaction = transactions.length > 0 ? Math.round(netRevenue / transactions.filter(t => t.status === 'Completed').length || 1) : 0;

  return (
    <div className="space-y-8 w-full">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold">Transactions Ledger</h1>
          <p className="text-sm text-on-surface-variant font-body-md mt-1">
            Audit payments, refund transfers, adjustments, and gateway processing statements.
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-5 py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-label-bold text-label-bold transition-all duration-300 shadow-md active:scale-95 shrink-0 cursor-pointer"
        >
          <Download size={18} />
          <span>Export Financial Report</span>
        </button>
      </div>

      {/* Finance Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Net Revenue */}
        <BentoCard className="flex items-start gap-4 hover:shadow-lg hover:border-primary/20">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] uppercase tracking-wider mb-1">
              Net Revenue MTD
            </p>
            <p className="font-headline-lg text-[24px] font-bold text-primary leading-tight">
              ৳ {netRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-emerald-600 font-label-bold mt-2">
              +12.5% vs last month
            </p>
          </div>
        </BentoCard>

        {/* Avg Transaction */}
        <BentoCard className="flex items-start gap-4 hover:shadow-lg hover:border-primary/20">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary/10 text-secondary">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] uppercase tracking-wider mb-1">
              Avg Transaction
            </p>
            <p className="font-headline-lg text-[24px] font-bold text-primary leading-tight">
              ৳ {avgTransaction.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-secondary font-label-bold mt-2">
              +4.2% vs last month
            </p>
          </div>
        </BentoCard>

        {/* Processing Fees */}
        <BentoCard className="flex items-start gap-4 hover:shadow-lg hover:border-primary/20">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary-container/10 text-primary-container">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] uppercase tracking-wider mb-1">
              Processing Fees
            </p>
            <p className="font-headline-lg text-[24px] font-bold text-primary leading-tight">
              ৳ {Math.round(netRevenue * 0.029).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-outline font-label-bold mt-2">
              Avg. 2.9% + ৳10 flat rate
            </p>
          </div>
        </BentoCard>

        {/* Refund Rate */}
        <BentoCard className="flex items-start gap-4 hover:shadow-lg hover:border-primary/20">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-on-surface-variant font-label-bold text-[10px] uppercase tracking-wider mb-1">
              Refund Rate
            </p>
            <p className="font-headline-lg text-[24px] font-bold text-primary leading-tight">
              {transactions.length > 0 ? (transactions.filter(t => t.type === 'Refund').length / transactions.length * 100).toFixed(2) : 0}%
            </p>
            <p className="text-xs text-rose-600 font-label-bold mt-2">
              +0.8% spikes in outerwear
            </p>
          </div>
        </BentoCard>
      </section>

      {/* Graphical Bar Chart Section */}
      <BentoCard>
        <h3 className="font-headline-md text-[18px] text-primary font-semibold mb-6">
          Weekly Transaction Volume (BDT)
        </h3>
        <div className="flex items-end gap-3 h-48 pt-4">
          {weeklyData.map((w) => (
            <div key={w.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full bg-primary/70 hover:bg-secondary rounded-t-md transition-colors cursor-pointer"
                style={{ height: `${(w.amount / maxWeeklyAmount) * 100}%` }}
                title={`৳ ${w.amount.toLocaleString('en-IN')}`}
              />
              <span className="text-[11px] text-on-surface-variant font-label-bold uppercase tracking-wider">
                {w.day}
              </span>
            </div>
          ))}
        </div>
      </BentoCard>

      {/* Filter and Table ledger */}
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline/10 shadow-card">
          {/* Type Select */}
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-label-bold text-outline uppercase tracking-wider">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-background border border-outline/20 rounded-lg px-3 py-2 text-xs font-body-md focus:border-primary outline-none"
            >
              <option value="All">All Types</option>
              <option value="Sale">Sales Only</option>
              <option value="Refund">Refunds Only</option>
              <option value="Adjustment">Adjustments</option>
            </select>
          </div>

          {/* Status Select */}
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-label-bold text-outline uppercase tracking-wider">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-background border border-outline/20 rounded-lg px-3 py-2 text-xs font-body-md focus:border-primary outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>

          {/* Date range selection */}
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <label className="text-[10px] font-label-bold text-outline uppercase tracking-wider">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-background border border-outline/20 rounded-lg px-3 py-2 text-xs font-body-md focus:border-primary outline-none"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
            </select>
          </div>
        </div>

        {/* Transactions Table Ledger */}
        <BentoCard className="overflow-hidden p-0 md:p-0">
          {error ? (
            <div className="text-center py-12 text-error bg-rose-50 dark:bg-rose-950/20 border border-outline/10 m-6 rounded-xl">
              {error}
            </div>
          ) : isLoading && transactions.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="animate-spin h-8 w-8 text-secondary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-on-surface-variant font-label-bold">Loading transactions ledger...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 text-[11px] font-label-bold uppercase tracking-widest text-outline border-b border-outline/10">
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Order Link</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/5 font-body-md text-sm">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-on-surface-variant italic">
                        No financial records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-6 py-4 font-label-bold text-primary">{tx.id}</td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/orders/${tx.orderId}`}
                            className="font-label-bold text-secondary hover:underline"
                          >
                            #{tx.orderId.substring(tx.orderId.length - 8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-primary font-medium">{tx.customerName}</td>
                        <td className="px-6 py-4 text-on-surface-variant">{tx.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-label-bold uppercase tracking-wider ${
                              tx.type === 'Sale'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tx.type === 'Refund'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 font-semibold ${
                            tx.amount >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {tx.amount >= 0 ? '+' : ''}৳ {tx.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-primary font-medium">
                            {getStatusIcon(tx.status)}
                            <span>{tx.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          <button
                            onClick={() => alert(`Reviewing transaction details for ${tx.id}...`)}
                            className="text-xs font-label-bold text-secondary hover:text-secondary-container transition-colors uppercase tracking-wider cursor-pointer"
                          >
                            Audit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Static Pagination */}
          {!isLoading && filteredTransactions.length > 0 && (
            <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline/5 flex items-center justify-between">
              <p className="text-xs text-on-surface-variant">
                Showing 1-{filteredTransactions.length} of {transactions.length} entries
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
    </div>
  );
}
