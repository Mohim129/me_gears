import { Order } from '@/types';

export const orders: Order[] = [
  {
    id: 'ME-2024-001',
    customer: 'Marcus Chen',
    segment: 'Premium',
    amount: 152500,
    status: 'Shipped',
  },
  {
    id: 'ME-2024-002',
    customer: 'Sarah Williams',
    segment: 'Standard',
    amount: 42600,
    status: 'Confirmed',
  },
  {
    id: 'ME-2024-003',
    customer: 'James Rodriguez',
    segment: 'Premium',
    amount: 107300,
    status: 'Pending',
  },
  {
    id: 'ME-2024-004',
    customer: 'Emily Park',
    segment: 'VIP',
    amount: 262300,
    status: 'Shipped',
  },
  {
    id: 'ME-2024-005',
    customer: 'David Mitchell',
    segment: 'Standard',
    amount: 51900,
    status: 'Cancelled',
  },
];
