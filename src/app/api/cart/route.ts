import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

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

    const { db } = await connectDB();
    const cart = await db.collection('cart').findOne({ userId: session.user.id });

    return NextResponse.json({
      success: true,
      data: cart ? cart.items || [] : [],
    });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1, size, color } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId required' }, { status: 400 });
    }

    const { db } = await connectDB();

    // Fetch product details
    let productFilter: Record<string, unknown>;
    if (ObjectId.isValid(productId) && String(new ObjectId(productId)) === productId) {
      productFilter = { _id: new ObjectId(productId) };
    } else {
      productFilter = { id: productId };
    }
    const product = await db.collection('products').findOne(productFilter);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const availableStock = Number(product.stock ?? 0);
    const requestedQuantity = Number(quantity ?? 1);
    if (availableStock <= 0 || requestedQuantity > availableStock) {
      return NextResponse.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
    }

    const cart = await db.collection('cart').findOne({ userId: session.user.id });
    const items = cart?.items || [];

    // Check if item already exists with same size and color
    const existingIdx = items.findIndex(
      (item: { productId: string; size: string; color: string }) =>
        item.productId === productId && item.size === size && item.color === color
    );

    if (existingIdx >= 0) {
      items[existingIdx].quantity += quantity;
    } else {
      items.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity,
        size: size || product.sizes?.[0] || '',
        color: color || product.colors?.[0]?.name || '',
        image: product.image,
        category: product.category,
      });
    }

    await db.collection('cart').updateOne(
      { userId: session.user.id },
      { $set: { items, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity, size, color } = await request.json();
    if (!productId || quantity === undefined) {
      return NextResponse.json({ success: false, error: 'productId and quantity required' }, { status: 400 });
    }

    const { db } = await connectDB();
    const cart = await db.collection('cart').findOne({ userId: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    const items = cart.items || [];
    const idx = items.findIndex(
      (item: { productId: string; size?: string; color?: string }) =>
        item.productId === productId &&
        (!size || item.size === size) &&
        (!color || item.color === color)
    );

    if (idx < 0) {
      return NextResponse.json({ success: false, error: 'Item not in cart' }, { status: 404 });
    }

    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].quantity = quantity;
    }

    await db.collection('cart').updateOne(
      { userId: session.user.id },
      { $set: { items, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, size, color } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId required' }, { status: 400 });
    }

    const { db } = await connectDB();
    const cart = await db.collection('cart').findOne({ userId: session.user.id });
    if (!cart) {
      return NextResponse.json({ success: false, error: 'Cart not found' }, { status: 404 });
    }

    const items = (cart.items || []).filter(
      (item: { productId: string; size?: string; color?: string }) =>
        !(item.productId === productId &&
          (!size || item.size === size) &&
          (!color || item.color === color))
    );

    await db.collection('cart').updateOne(
      { userId: session.user.id },
      { $set: { items, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove item' }, { status: 500 });
  }
}
