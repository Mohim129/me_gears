'use client';

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, AlertTriangle, RotateCcw } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import StatsCard from '@/components/admin/StatsCard';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';

interface DashboardFilters {
  startDate: string;
  endDate: string;
  month: string;
  productId: string;
}

interface ProductOption {
  id: string;
  name: string;
}

const DEFAULT_FILTERS: DashboardFilters = {
  startDate: '',
  endDate: '',
  month: '',
  productId: '',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [products, setProducts] = useState<ProductOption[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=100');
        if (!res.ok) {
          return;
        }
        const json = await res.json();
        if (json.success) {
          setProducts(json.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch products for dashboard filters', err);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.startDate) params.set('startDate', filters.startDate);
        if (filters.endDate) params.set('endDate', filters.endDate);
        if (filters.month) params.set('month', filters.month);
        if (filters.productId) params.set('productId', filters.productId);

        const res = await fetch(`/api/admin/stats?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Failed to fetch admin stats');
        }
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          throw new Error(json.error || 'Failed to parse stats');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [filters.startDate, filters.endDate, filters.month, filters.productId]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 w-1/4 bg-surface-container rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-surface-container rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-surface-container rounded-2xl" />
          <div className="h-64 bg-surface-container rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-16 text-error bg-rose-50 dark:bg-rose-950/20 border border-rose-200/10 rounded-2xl">
        <p className="mb-4">Error loading dashboard stats: {error || 'Unknown error'}</p>
        <button onClick={() => window.location.reload()} className="bg-primary text-on-primary px-6 py-2 rounded-xl font-label-bold text-sm">
          Reload Dashboard
        </button>
      </div>
    );
  }

  const MONTHLY_REVENUE = stats.monthlyData.map((m: any) => m.total);
  const maxRevenue = Math.max(...MONTHLY_REVENUE, 1);

  // Month labels helper
  const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  const revenueChartData = stats.monthlyData.map((m: any, i: number) => ({
    ...m,
    monthLabel: m.month || MONTH_LABELS[i],
  }));

  const categoryChartData = stats.categories.map((cat: any) => ({
    name: cat.label,
    value: cat.percent ?? 0,
  }));

  const CHART_COLORS = ['#2563eb', '#f97316', '#14b8a6', '#c084fc', '#facc15', '#fb7185'];

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Dashboard Overview</h1>
        <p className="text-on-surface-variant font-body-md mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-2xl shadow-card p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
            <label className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <span className="font-label-bold uppercase tracking-wider">Start date</span>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <span className="font-label-bold uppercase tracking-wider">End date</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <span className="font-label-bold uppercase tracking-wider">Month</span>
              <input
                type="month"
                value={filters.month}
                onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <span className="font-label-bold uppercase tracking-wider">Product</span>
              <select
                value={filters.productId}
                onChange={(e) => setFilters((prev) => ({ ...prev, productId: e.target.value }))}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/40"
              >
                <option value="">All products</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/30 px-4 py-2 text-sm font-label-bold text-on-surface-variant transition-colors hover:bg-surface-container-highest"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value={`৳ ${stats.totalRevenue.toLocaleString('en-IN')}`}
        />
        <StatsCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.totalOrders.toLocaleString()}
        />
        <StatsCard 
          icon={Package} 
          label="Total Products" 
          value={stats.totalProducts.toLocaleString()} 
        />
        <StatsCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value={`${stats.lowStockItems} Items`}
          alert={stats.lowStockItems > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl shadow-card p-6">
          <h3 className="font-headline-md text-[20px] text-primary font-semibold mb-6">
            Monthly Revenue ({new Date().getFullYear()})
          </h3>
          <div className="flex items-end gap-2 h-48">
            {stats.monthlyData.map((m: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-primary/80 hover:bg-secondary rounded-t-md transition-colors cursor-pointer"
                  style={{ height: `${(m.total / maxRevenue) * 100}%`, minHeight: m.total > 0 ? '4px' : '0px' }}
                  title={`৳ ${m.total.toLocaleString('en-IN')}`}
                />
                <span className="text-[10px] text-on-surface-variant font-label-bold">
                  {MONTH_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-panel rounded-2xl shadow-card p-6">
          <h3 className="font-headline-md text-[20px] text-primary font-semibold mb-6">
            Sales by Category
          </h3>
          <div className="space-y-5">
            {stats.categories.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic py-8 text-center">No sales data recorded yet.</p>
            ) : (
              stats.categories.map((cat: any) => {
                const colorMap: Record<string, string> = {
                  'Outerwear': 'bg-primary',
                  'Footwear': 'bg-secondary',
                  'Accessories': 'bg-secondary-container',
                  'Performance Tops': 'bg-on-primary-container',
                };
                const color = colorMap[cat.label] || 'bg-outline';

                return (
                  <div key={cat.label}>
                    <div className="flex justify-between mb-2">
                      <span className="font-label-bold text-sm text-on-surface">{cat.label}</span>
                      <span className="font-label-bold text-sm text-on-surface-variant">
                        {cat.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2.5">
                      <div
                        className={`${color} h-2.5 rounded-full transition-all`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={stats.recentOrders.map((o: any) => ({
        id: o.id || o._id,
        customer: o.customer,
        segment: o.segment,
        amount: o.amount,
        status: o.status,
      }))} />
    </div>
  );
}
