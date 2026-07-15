import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { adjustOrderItemStock, getStockDelta } from '@/lib/order-stock';

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await connectDB();
    const userRole = (session.user as { role?: string }).role || 'user';

    let order;
    if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
      order = await db.collection('orders').findOne({ _id: new ObjectId(id) });
    } else {
      order = await db.collection('orders').findOne({ id: id });
    }

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Check permission: owner or admin
    if (order.userId !== session.user.id && userRole !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const data = {
      ...order,
      id: order._id.toString(),
      _id: order._id.toString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as { role?: string }).role || 'user';
    if (userRole !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ success: false, error: 'Status required' }, { status: 400 });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const { db } = await connectDB();

    let filter: Record<string, unknown>;
    if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { id: id };
    }

    const existingOrder = await db.collection('orders').findOne(filter);

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const delta = getStockDelta(existingOrder.status, status);
    if (delta !== 0) {
      await adjustOrderItemStock(db, existingOrder.items || [], delta);
    }

    const result = await db.collection('orders').updateOne(
      filter,
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order updated' });
  } catch (error) {
    console.error('Order PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
