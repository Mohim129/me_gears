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
    const wishlist = await db.collection('wishlist').findOne({ userId: session.user.id });
    const productIds = wishlist?.productIds || [];

    if (productIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Populate product details
    const objectIds = productIds
      .filter((pid: string) => ObjectId.isValid(pid))
      .map((pid: string) => new ObjectId(pid));

    const products = await db
      .collection('products')
      .find({ _id: { $in: objectIds } })
      .toArray();

    const data = products.map((p) => ({
      productId: p._id.toString(),
      name: p.name,
      price: p.price,
      image: p.image,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId required' }, { status: 400 });
    }

    const { db } = await connectDB();
    const wishlist = await db.collection('wishlist').findOne({ userId: session.user.id });
    const productIds: string[] = wishlist?.productIds || [];

    let action: 'added' | 'removed';
    const idx = productIds.indexOf(productId);
    if (idx >= 0) {
      productIds.splice(idx, 1);
      action = 'removed';
    } else {
      productIds.push(productId);
      action = 'added';
    }

    await db.collection('wishlist').updateOne(
      { userId: session.user.id },
      { $set: { productIds, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, action, data: productIds });
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update wishlist' }, { status: 500 });
  }
}
