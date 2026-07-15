import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectDB();
    const review = await db.collection('reviews').findOne({
      _id: new ObjectId(reviewId),
    });

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    if (review.userId !== session.user.id && (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updateDoc: Record<string, unknown> = { updatedAt: new Date() };

    if (body.rating !== undefined) updateDoc.rating = Number(body.rating);
    if (body.comment !== undefined) updateDoc.comment = String(body.comment).trim();

    await db.collection('reviews').updateOne({ _id: review._id }, { $set: updateDoc });

    return NextResponse.json({ success: true, message: 'Review updated' });
  } catch (error) {
    console.error('Review PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const { reviewId } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectDB();
    const review = await db.collection('reviews').findOne({
      _id: new ObjectId(reviewId),
    });

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    if (review.userId !== session.user.id && (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.collection('reviews').deleteOne({ _id: review._id });
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Review DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete review' }, { status: 500 });
  }
}
