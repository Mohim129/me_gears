'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Mail,
  TrendingUp,
  Award,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';
import BentoCard from '@/components/ui/BentoCard';

interface OrderRow {
  id: string;
  date: string;
  total: string;
  paymentStatus: 'Paid' | 'Refunded';
  paymentBadge: string;
  fulfillment: 'Processing' | 'Delivered' | 'Cancelled' | 'Shipped';
  fulfillmentDot: string;
}

const ORDERS: OrderRow[] = [
  {
    id: '#ME-90210',
    date: 'Nov 14, 2023',
    total: '৳ 1,40,800',
    paymentStatus: 'Paid',
    paymentBadge: 'bg-green-100 text-green-700',
    fulfillment: 'Processing',
    fulfillmentDot: 'bg-secondary',
  },
  {
    id: '#ME-89421',
    date: 'Oct 28, 2023',
    total: '৳ 70,500',
    paymentStatus: 'Paid',
    paymentBadge: 'bg-green-100 text-green-700',
    fulfillment: 'Delivered',
    fulfillmentDot: 'bg-green-500',
  },
  {
    id: '#ME-88102',
    date: 'Oct 15, 2023',
    total: '৳ 2,32,100',
    paymentStatus: 'Refunded',
    paymentBadge: 'bg-red-100 text-red-700',
    fulfillment: 'Cancelled',
    fulfillmentDot: 'bg-slate-300',
  },
  {
    id: '#ME-87005',
    date: 'Sep 30, 2023',
    total: '৳ 97,900',
    paymentStatus: 'Paid',
    paymentBadge: 'bg-green-100 text-green-700',
    fulfillment: 'Shipped',
    fulfillmentDot: 'bg-blue-500',
  },
  {
    id: '#ME-86921',
    date: 'Sep 12, 2023',
    total: '৳ 1,59,500',
    paymentStatus: 'Paid',
    paymentBadge: 'bg-green-100 text-green-700',
    fulfillment: 'Delivered',
    fulfillmentDot: 'bg-green-500',
  },
];

export default function CustomerOrderHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-8 w-full">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <Link
            href="/admin/customers"
            className="flex items-center gap-2 text-secondary font-label-bold mb-4 hover:opacity-80 transition-all group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to Registry
          </Link>
          <h1 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold leading-none">
            Order History
          </h1>
          <p className="text-on-surface-variant mt-2 font-body-md">
            Customer ID:{' '}
            <span className="font-mono font-semibold">{id}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary-container text-white px-6 py-3 rounded-lg font-label-bold hover:scale-[1.02] active:scale-[0.98] transition-all">
            Edit Profile
          </button>
          <button className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-bold shadow-lg hover:bg-secondary/90 transition-all flex items-center gap-2">
            <Send size={16} />
            Send Statement
          </button>
        </div>
      </header>

      {/* Customer Profile Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Summary Card */}
        <BentoCard className="lg:col-span-5 flex gap-6 lg:gap-8 border-l-4 border-secondary items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-inner bg-surface-variant flex-shrink-0 relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV1pmkd-SfOrzNnDkijNQR8bT3cXn9cKhy6E1jKJ3rTAvhtQ4bEV_Wz9lF3vGIOZbj0ouOk2cGc8-DsFCuWMS8eeL60Ezs5hiqREtWPMEC2TuP4_CpF5SXgbQv-u9Wij82l6R5NNrsItl73HFXt6kP3WrRr2JIOkH0X6W9rPGV-KhIMXsMBnoKP1luLp9p5Daf-2ELrOBsupnHMEGjZ-jfgWI4CMRygF6azjpUq7QQNuPDloMdaJbO5w"
              alt="Julian Thorne"
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <h3 className="font-headline-md text-xl md:text-2xl text-primary truncate font-bold">
              Julian Thorne
            </h3>
            <p className="text-on-surface-variant font-body-md flex items-center gap-2 mt-1 truncate text-sm">
              <Mail size={14} className="flex-shrink-0" />
              <span className="truncate">julian.t@industry.com</span>
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
                <span className="text-on-surface-variant uppercase text-[10px] tracking-widest font-label-bold">
                  Join Date
                </span>
                <span className="font-label-bold text-on-surface">
                  Oct 12, 2021
                </span>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
                <span className="text-on-surface-variant uppercase text-[10px] tracking-widest font-label-bold">
                  Total Spent
                </span>
                <span className="font-label-bold text-secondary">
                  ৳ 15,70,855
                </span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <BentoCard className="flex flex-col justify-between">
            <div>
              <p className="text-on-surface-variant font-label-bold uppercase text-[10px] tracking-widest">
                Lifetime Value
              </p>
              <h4 className="font-headline-lg text-2xl md:text-3xl text-primary mt-2 font-bold">
                ৳ 15.7L
              </h4>
            </div>
            <div className="flex items-center gap-1 text-secondary text-xs font-bold mt-4">
              <TrendingUp size={14} />
              +12% YoY
            </div>
          </BentoCard>

          <BentoCard className="flex flex-col justify-between">
            <div>
              <p className="text-on-surface-variant font-label-bold uppercase text-[10px] tracking-widest">
                Total Orders
              </p>
              <h4 className="font-headline-lg text-2xl md:text-3xl text-primary mt-2 font-bold">
                32
              </h4>
            </div>
            <div className="text-on-surface-variant text-xs font-medium mt-4">
              Last: 4 days ago
            </div>
          </BentoCard>

          <BentoCard className="flex flex-col justify-between">
            <div>
              <p className="text-on-surface-variant font-label-bold uppercase text-[10px] tracking-widest">
                Avg Order Value
              </p>
              <h4 className="font-headline-lg text-2xl md:text-3xl text-primary mt-2 font-bold">
                ৳ 49,100
              </h4>
            </div>
            <div className="text-on-surface-variant text-xs font-medium mt-4">
              Tier: Platinum
            </div>
          </BentoCard>
        </div>
      </section>

      {/* Transaction History Table */}
      <BentoCard className="overflow-hidden p-0 md:p-0">
        {/* Table Header Bar */}
        <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/50">
          <h3 className="font-headline-md text-xl text-primary font-bold">
            Transaction History
          </h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                className="pl-9 pr-4 py-2 bg-surface border border-outline/10 rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="Search orders..."
                type="text"
              />
            </div>
            <button className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-lg font-label-bold text-sm hover:bg-surface-container transition-colors">
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant uppercase text-[11px] tracking-widest border-b border-outline-variant/10">
                <th className="px-8 py-4 font-label-bold">Order ID</th>
                <th className="px-8 py-4 font-label-bold">Date</th>
                <th className="px-8 py-4 font-label-bold">Total</th>
                <th className="px-8 py-4 font-label-bold">Payment Status</th>
                <th className="px-8 py-4 font-label-bold">Fulfillment</th>
                <th className="px-8 py-4 font-label-bold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-primary-container/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <span className="font-mono font-bold text-primary">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-on-surface-variant">
                    {order.date}
                  </td>
                  <td className="px-8 py-5 font-bold text-primary">
                    {order.total}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.paymentBadge}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${order.fulfillmentDot}`}
                      />
                      <span className="text-sm font-medium">
                        {order.fulfillment}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-secondary font-label-bold text-sm hover:underline decoration-2 underline-offset-4">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 bg-surface-container-low/30 border-t border-outline-variant/10 flex justify-between items-center">
          <span className="text-xs text-on-surface-variant font-label-bold uppercase">
            Showing 5 of 32 transactions
          </span>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-outline-variant/20 shadow-sm disabled:opacity-50"
              disabled
            >
              <ChevronLeft size={16} />
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary text-white shadow-md font-bold text-sm">
              1
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-outline-variant/20 shadow-sm hover:bg-surface-container-high transition-colors font-bold text-sm">
              2
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-outline-variant/20 shadow-sm hover:bg-surface-container-high transition-colors font-bold text-sm">
              3
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-outline-variant/20 shadow-sm hover:bg-surface-container-high transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </BentoCard>

      {/* Insights & Admin Notes Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Premium Member Insights */}
        <BentoCard className="md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Award size={36} className="text-secondary" />
            </div>
            <div>
              <h4 className="font-headline-md text-xl text-primary font-bold">
                Premium Member Insights
              </h4>
              <p className="text-on-surface-variant max-w-lg mt-2 text-sm leading-relaxed">
                Julian Thorne has consistently preferred high-end outerwear and
                technical gear. He has a 0% return rate on items over ৳ 55,000.
                Consider offering exclusive early access to the upcoming
                Tech-Luxe Winter collection.
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Internal Admin Notes */}
        <BentoCard className="flex flex-col gap-4">
          <h5 className="font-label-bold text-primary border-b border-outline-variant/10 pb-3">
            Internal Admin Notes
          </h5>
          <div className="bg-surface p-4 rounded-lg text-sm italic text-on-surface-variant">
            &ldquo;High-value client. Ensure all shipments include the signature
            ME Gear brass tag.&rdquo;
            <div className="text-[10px] text-right mt-2 font-label-bold opacity-60">
              — Admin Sarah W.
            </div>
          </div>
          <button className="w-full py-3 border border-dashed border-outline-variant text-on-surface-variant rounded-lg text-xs font-bold hover:bg-surface-variant/20 transition-all">
            + Add New Admin Note
          </button>
        </BentoCard>
      </section>
    </div>
  );
}
