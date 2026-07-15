import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await connectDB();

    let filter: Record<string, unknown>;
    if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { id: id };
    }

    const product = await db.collection('products').findOne(filter);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const data = {
      ...product,
      stock: typeof product.stock === 'number' ? product.stock : 0,
      id: product._id.toString(),
      _id: product._id.toString(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
