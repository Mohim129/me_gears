import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectDB();
    const user = await db.collection('user').findOne({ _id: new ObjectId(session.user.id) });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
        phone: user.phone || '',
        birthday: user.birthday || '',
      },
    });
  } catch (error: any) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, image, phone, birthday } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const { db } = await connectDB();
    const updateDoc: Record<string, any> = { name, email };
    if (image !== undefined) {
      updateDoc.image = image;
    }
    if (phone !== undefined) {
      updateDoc.phone = phone;
    }
    if (birthday !== undefined) {
      updateDoc.birthday = birthday;
    }

    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        name,
        email,
        image: image || session.user.image,
        phone,
        birthday,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
