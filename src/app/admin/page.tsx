import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import { orders } from '@/data/orders';

const MONTHLY_REVENUE = [65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 92, 88];
const CATEGORIES = [
  { label: 'Men', percent: 45, color: 'bg-primary' },
  { label: 'Women', percent: 32, color: 'bg-secondary' },
  { label: 'Accessories', percent: 18, color: 'bg-secondary-container' },
  { label: 'Footwear', percent: 5, color: 'bg-on-primary-container' },
];

export default function AdminDashboard() {
  const maxRevenue = Math.max(...MONTHLY_REVENUE);

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary">Dashboard Overview</h1>
        <p className="text-on-surface-variant font-body-md mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          icon={DollarSign}
          label="Total Revenue"
          value="৳ 1,41,27,300"
          trend="+12.4%"
        />
        <StatsCard
          icon={ShoppingCart}
          label="Total Orders"
          value="1,248"
          trend="+8.2%"
        />
        <StatsCard icon={Package} label="Total Products" value="456" />
        <StatsCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value="12 Items"
          alert
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl shadow-card p-6">
          <h3 className="font-headline-md text-[20px] text-primary font-semibold mb-6">
            Monthly Revenue
          </h3>
          <div className="flex items-end gap-2 h-48">
            {MONTHLY_REVENUE.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-primary/80 hover:bg-secondary rounded-t-md transition-colors cursor-pointer"
                  style={{ height: `${(val / maxRevenue) * 100}%` }}
                  title={`৳ ${(val * 154000).toLocaleString('en-IN')}`}
                />
                <span className="text-[10px] text-on-surface-variant font-label-bold">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
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
            {CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <div className="flex justify-between mb-2">
                  <span className="font-label-bold text-sm text-on-surface">{cat.label}</span>
                  <span className="font-label-bold text-sm text-on-surface-variant">
                    {cat.percent}%
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5">
                  <div
                    className={`${cat.color} h-2.5 rounded-full transition-all`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable orders={orders} />
    </div>
  );
}
