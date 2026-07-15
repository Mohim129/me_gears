import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { adjustOrderItemStock } from '@/lib/order-stock';

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

    const { db } = await connectDB();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');
    const userRole = (session.user as { role?: string }).role || 'user';

    let filter: Record<string, unknown> = {};

    if (all === 'true' && userRole === 'admin') {
      // Admin: fetch all orders
      filter = {};
    } else {
      // User: fetch own orders only
      filter = { userId: session.user.id };
    }

    const orders = await db
      .collection('orders')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const data = orders.map((o) => ({
      ...o,
      id: o._id.toString(),
      _id: o._id.toString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
      return NextResponse.json({ success: false, error: 'Shipping address required' }, { status: 400 });
    }

    const { db } = await connectDB();

    // Fetch the user's cart
    const cart = await db.collection('cart').findOne({ userId: session.user.id });
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    const items = cart.items;
    const amount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    const order = {
      userId: session.user.id,
      customer: session.user.name || shippingAddress.fullName,
      segment: 'Standard',
      amount,
      status: 'Pending',
      items,
      shippingAddress,
      paymentMethod,
      createdAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(order);

    await adjustOrderItemStock(db, items, -1);

    // Clear cart
    await db.collection('cart').updateOne(
      { userId: session.user.id },
      { $set: { items: [], updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        id: result.insertedId.toString(),
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
