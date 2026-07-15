import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

async function findProductById(db: any, productId: string) {
  let filter: Record<string, unknown> = { id: productId };

  if (ObjectId.isValid(productId) && String(new ObjectId(productId)) === productId) {
    filter = { _id: new ObjectId(productId) };
  } else {
    filter = {
      $or: [{ id: productId }, { _id: new ObjectId(productId) }],
    };
  }

  return db.collection('products').findOne(filter);
}

async function userHasPurchasedProduct(db: any, userId: string, productId: string) {
  const product = await findProductById(db, productId);
  const productKey = product?._id?.toString() || product?.id || productId;

  const order = await db.collection('orders').findOne({
    userId,
    status: { $nin: ['Cancelled'] },
    items: {
      $elemMatch: {
        productId: { $in: [productId, productKey] },
      },
    },
  });

  return Boolean(order);
}

async function recalculateProductRating(db: any, productId: string) {
  const product = await findProductById(db, productId);
  if (!product) return;

  const reviews = await db.collection('reviews').find({ productId }).toArray();
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? Number((reviews.reduce((sum: number, review: any) => sum + Number(review.rating || 0), 0) / reviewCount).toFixed(1))
    : 0;

  await db.collection('products').updateOne(
    { _id: product._id },
    { $set: { rating: averageRating, reviewCount } }
  );
}

function normalizeReview(review: any) {
  return {
    ...review,
    id: review.id || review._id?.toString(),
    _id: review._id?.toString(),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    const { db } = await connectDB();

    const product = await findProductById(db, id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const reviews = await db
      .collection('reviews')
      .find({ productId: id })
      .sort({ createdAt: -1 })
      .toArray();

    const mappedReviews = reviews.map(normalizeReview);
    const myReview = session?.user
      ? mappedReviews.find((review: any) => review.userId === session.user.id) || null
      : null;

    let hasPurchased = false;
    if (session?.user) {
      hasPurchased = await userHasPurchasedProduct(db, session.user.id, id);
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews: mappedReviews,
        myReview,
        hasPurchased,
      },
    });
  } catch (error) {
    console.error('Product reviews GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const rating = Number(body.rating || 0);
    const comment = String(body.comment || '').trim();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Please provide a rating between 1 and 5' }, { status: 400 });
    }
    if (!comment) {
      return NextResponse.json({ success: false, error: 'Please write a review' }, { status: 400 });
    }

    const { db } = await connectDB();
    const product = await findProductById(db, id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const hasPurchased = await userHasPurchasedProduct(db, session.user.id, id);
    if (!hasPurchased) {
      return NextResponse.json({ success: false, error: 'You must purchase this product before leaving a review' }, { status: 403 });
    }

    const existingReview = await db.collection('reviews').findOne({ productId: id, userId: session.user.id });
    if (existingReview) {
      return NextResponse.json({ success: false, error: 'You have already reviewed this product' }, { status: 409 });
    }

    const reviewDoc = {
      productId: id,
      userId: session.user.id,
      userName: session.user.name || 'Customer',
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('reviews').insertOne(reviewDoc);
    const insertedReview = {
      ...reviewDoc,
      id: result.insertedId.toString(),
      _id: result.insertedId.toString(),
    };

    await recalculateProductRating(db, id);

    return NextResponse.json({ success: true, data: insertedReview });
  } catch (error) {
    console.error('Product reviews POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create review' }, { status: 500 });
  }
}
