import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const month = searchParams.get('month');
    const productId = searchParams.get('productId');

    const allowedStatuses = ['Delivered', 'Shipped'];

    const buildCreatedAtFilter = () => {
      if (month) {
        const [year, monthNumber] = month.split('-').map(Number);
        if (!Number.isNaN(year) && !Number.isNaN(monthNumber)) {
          return {
            $gte: new Date(year, monthNumber - 1, 1),
            $lt: new Date(year, monthNumber, 1),
          };
        }
      }

      const createdAtFilter: Record<string, Date> = {};
      if (startDate) {
        createdAtFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        createdAtFilter.$lte = new Date(`${endDate}T23:59:59.999Z`);
      }
      return createdAtFilter;
    };

    const orderFilter: Record<string, unknown> = {};
    const createdAtFilter = buildCreatedAtFilter();
    if (Object.keys(createdAtFilter).length > 0) {
      orderFilter.createdAt = createdAtFilter;
    }
    if (productId) {
      orderFilter['items.productId'] = productId;
    }

    const completedOrderFilter = { ...orderFilter, status: { $in: allowedStatuses } };

    // Total revenue
    const revenueResult = await db.collection('orders').aggregate([
      { $match: completedOrderFilter },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]).toArray();
    const totalRevenue = revenueResult[0]?.total || 0;

    // Total orders
    const totalOrders = await db.collection('orders').countDocuments(orderFilter);

    // Total products
    const totalProducts = await db.collection('products').countDocuments();

    // Low stock items (stock <= 10)
    const lowStockItems = await db.collection('products').countDocuments({ stock: { $lte: 10 } });

    // Recent orders (last 5)
    const recentOrders = await db.collection('orders')
      .find(orderFilter)
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentOrdersData = recentOrders.map((o) => ({
      ...o,
      id: o._id?.toString() || o.id,
      _id: o._id?.toString(),
    }));

    // Monthly sales data
    const currentYear = new Date().getFullYear();
    const selectedYear = month ? Number(month.split('-')[0]) : startDate ? new Date(startDate).getFullYear() : currentYear;
    const monthlySales = await db.collection('orders').aggregate([
      {
        $match: {
          ...completedOrderFilter,
          createdAt: {
            $gte: new Date(`${selectedYear}-01-01`),
            $lt: new Date(`${selectedYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    // Fill in all 12 months
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const found = monthlySales.find((m) => m._id === i + 1);
      return { month: i + 1, total: found?.total || 0, count: found?.count || 0 };
    });

    // Category breakdown
    const categoryBreakdown = await db.collection('orders').aggregate([
      { $match: completedOrderFilter },
      { $unwind: { path: '$items', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: { $ifNull: ['$items.category', 'Other'] },
          total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { total: -1 } },
    ]).toArray();

    const totalCategoryRevenue = categoryBreakdown.reduce((sum, c) => sum + c.total, 0);
    const categories = categoryBreakdown.map((c) => ({
      label: c._id || 'Other',
      percent: totalCategoryRevenue > 0 ? Math.round((c.total / totalCategoryRevenue) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockItems,
        recentOrders: recentOrdersData,
        monthlyData,
        categories,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
