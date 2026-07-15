import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const userRole = (session.user as { role?: string }).role || 'user';
    if (userRole !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    }

    const { db } = await connectDB();

    // Fetch orders to construct transactions
    const orders = await db
      .collection('orders')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const transactions = orders.map((order) => {
      // Map payment and fulfillment statuses to transaction status
      let status: 'Completed' | 'Pending' | 'Failed' | 'Disputed' = 'Pending';
      if (order.status === 'Cancelled') {
        status = 'Failed';
      } else if (['Shipped', 'Delivered'].includes(order.status)) {
        status = 'Completed';
      }

      return {
        id: `TX-${order._id.toString().substring(18, 24).toUpperCase()}`,
        orderId: order._id.toString(),
        customerName: order.customer || 'Guest Customer',
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'N/A',
        type: order.status === 'Cancelled' ? 'Refund' : 'Sale',
        amount: order.amount,
        status,
      };
    });

    // Build weekly transaction volume from real order data (last 7 days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyMap: Record<string, number> = {};
    dayNames.forEach((d) => (weeklyMap[d] = 0));

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    orders.forEach((order) => {
      if (order.createdAt) {
        const d = new Date(order.createdAt);
        if (d >= sevenDaysAgo && order.status !== 'Cancelled') {
          const dayName = dayNames[d.getDay()];
          weeklyMap[dayName] += order.amount || 0;
        }
      }
    });

    const weeklyData = dayNames.map((day) => ({ day, amount: weeklyMap[day] }));

    return NextResponse.json({ success: true, data: transactions, weeklyData });
  } catch (error) {
    console.error('Admin transactions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
