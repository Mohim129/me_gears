import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { error: 'Unauthorized', status: 401 };
  }
  const userRole = (session.user as { role?: string }).role || 'user';
  if (userRole !== 'admin') {
    return { error: 'Forbidden', status: 403 };
  }
  return { user: session.user };
}

export async function GET() {
  const authRes = await verifyAdmin();
  if (authRes.error) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: authRes.status });
  }

  try {
    const { db } = await connectDB();
    const products = await db
      .collection('products')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const data = products.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: p._id.toString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Inventory GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authRes = await verifyAdmin();
  if (authRes.error) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: authRes.status });
  }

  try {
    const body = await request.json();
    const {
      name,
      price,
      sku,
      category,
      stock = 0,
      description = '',
      image,
      images = [],
      sizes = [],
      colors = [],
      specs = [],
      isNew = false,
      isLimited = false,
    } = body;

    if (!name || price === undefined || !sku || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { db } = await connectDB();

    const newProduct = {
      name,
      price: Number(price),
      sku,
      category,
      stock: Number(stock),
      description,
      image: image || images[0] || '',
      images: images.length > 0 ? images : [image || ''],
      sizes,
      colors,
      specs,
      isNew: Boolean(isNew),
      isLimited: Boolean(isLimited),
      rating: 4.8, // Default rating for new items
      reviewCount: 0,
      createdAt: new Date(),
    };

    const result = await db.collection('products').insertOne(newProduct);

    return NextResponse.json({
      success: true,
      data: {
        ...newProduct,
        id: result.insertedId.toString(),
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('Inventory POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authRes = await verifyAdmin();
  if (authRes.error) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: authRes.status });
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      price,
      sku,
      category,
      stock,
      description,
      image,
      images,
      sizes,
      colors,
      specs,
      isNew,
      isLimited,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const { db } = await connectDB();

    let filter: Record<string, unknown>;
    if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { id: id };
    }

    const updateDoc: Record<string, unknown> = {};
    if (name !== undefined) updateDoc.name = name;
    if (price !== undefined) updateDoc.price = Number(price);
    if (sku !== undefined) updateDoc.sku = sku;
    if (category !== undefined) updateDoc.category = category;
    if (stock !== undefined) updateDoc.stock = Number(stock);
    if (description !== undefined) updateDoc.description = description;
    if (image !== undefined) updateDoc.image = image;
    if (images !== undefined) updateDoc.images = images;
    if (sizes !== undefined) updateDoc.sizes = sizes;
    if (colors !== undefined) updateDoc.colors = colors;
    if (specs !== undefined) updateDoc.specs = specs;
    if (isNew !== undefined) updateDoc.isNew = Boolean(isNew);
    if (isLimited !== undefined) updateDoc.isLimited = Boolean(isLimited);

    updateDoc.updatedAt = new Date();

    const result = await db.collection('products').updateOne(filter, { $set: updateDoc });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Inventory PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authRes = await verifyAdmin();
  if (authRes.error) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: authRes.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const { db } = await connectDB();

    let filter: Record<string, unknown>;
    if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { id: id };
    }

    const result = await db.collection('products').deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Inventory DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
