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
    const doc = await db.collection('addresses').findOne({ userId: session.user.id });

    return NextResponse.json({
      success: true,
      data: doc?.addresses || [],
    });
  } catch (error: any) {
    console.error('Addresses GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { tag, street, cityStateZip } = await request.json();
    if (!tag || !street || !cityStateZip) {
      return NextResponse.json({ success: false, error: 'All address fields are required' }, { status: 400 });
    }

    const newAddress = {
      id: new ObjectId().toString(),
      tag,
      street,
      cityStateZip,
    };

    const { db } = await connectDB();
    await db.collection('addresses').updateOne(
      { userId: session.user.id },
      { $push: { addresses: newAddress } as any },
      { upsert: true }
    );

    return NextResponse.json({ success: true, data: newAddress });
  } catch (error: any) {
    console.error('Address POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add address' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, tag, street, cityStateZip } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Address ID is required' }, { status: 400 });
    }

    const { db } = await connectDB();
    await db.collection('addresses').updateOne(
      { userId: session.user.id, 'addresses.id': id },
      {
        $set: {
          'addresses.$.tag': tag,
          'addresses.$.street': street,
          'addresses.$.cityStateZip': cityStateZip,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Address PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Address ID is required' }, { status: 400 });
    }

    const { db } = await connectDB();
    await db.collection('addresses').updateOne(
      { userId: session.user.id },
      { $pull: { addresses: { id } } as any }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Address DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete address' }, { status: 500 });
  }
}
