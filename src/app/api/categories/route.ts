import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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
  try {
    const { db } = await connectDB();
    const categories = await db
      .collection('categories')
      .find()
      .sort({ name: 1 })
      .toArray();

    const data = categories
      .map((category) => category.name)
      .filter((name): name is string => typeof name === 'string');

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authRes = await verifyAdmin();
  if (authRes.error) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: authRes.status });
  }

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const { db } = await connectDB();
    const existing = await db.collection('categories').findOne({ name });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category already exists' },
        { status: 409 }
      );
    }

    const result = await db.collection('categories').insertOne({
      name,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.insertedId.toString(),
          name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Categories POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
