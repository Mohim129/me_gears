import { Order } from '@/types';

interface RecentOrdersTableProps {
  orders: Order[];
}

const STATUS_COLORS: Record<Order['status'], string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-green-100 text-green-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="glass-panel rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant/30">
        <h3 className="font-headline-md text-[20px] text-primary font-semibold">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th className="text-left px-6 py-4 font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left px-6 py-4 font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-6 py-4 font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Segment
              </th>
              <th className="text-left px-6 py-4 font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left px-6 py-4 font-label-bold text-xs text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors"
              >
                <td className="px-6 py-4 font-label-bold text-primary text-sm">{order.id}</td>
                <td className="px-6 py-4 text-on-surface text-sm">{order.customer}</td>
                <td className="px-6 py-4 text-on-surface-variant text-sm">{order.segment}</td>
                <td className="px-6 py-4 font-label-bold text-primary text-sm">
                  ৳ {order.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  <span className={`status-pill ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
