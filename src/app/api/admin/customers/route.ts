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

    // Fetch all users with role "user"
    const users = await db
      .collection('user')
      .find({ role: 'user' })
      .toArray();

    // For each user, fetch their total order count
    const customers = await Promise.all(
      users.map(async (u) => {
        const orderCount = await db.collection('orders').countDocuments({ userId: u._id.toString() });
        const nameParts = (u.name || 'User').split(' ');
        const initials = nameParts.map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

        return {
          id: u._id.toString(),
          name: u.name || 'Anonymous User',
          initials: initials || 'U',
          joinDate: u.createdAt ? new Date(u.createdAt).getFullYear().toString() : '2024',
          email: u.email,
          totalOrders: orderCount,
          status: orderCount > 5 ? 'Premium' : orderCount > 0 ? 'Active' : 'New',
          bgColor: 'bg-primary-fixed',
          textColor: 'text-primary',
        };
      })
    );

    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('Admin customers error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
  }
}
