import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const DEFAULT_SETTINGS = {
  storeName: 'ME GEARS',
  supportEmail: 'support@megears.io',
  currency: 'USD',
  twoFactor: true,
  sessionTimeout: '30 Minutes',
  orderAlerts: true,
  inventoryWarnings: true,
  newSignups: false,
  timezone: '(GMT-08:00) Pacific Time (US & Canada)',
  language: 'English (US)',
};

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
    const settingsDoc = await db.collection('settings').findOne({});

    return NextResponse.json({
      success: true,
      data: {
        ...DEFAULT_SETTINGS,
        ...(settingsDoc || {}),
      },
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authRes = await verifyAdmin();
  if (authRes.error) {
    return NextResponse.json({ success: false, error: authRes.error }, { status: authRes.status });
  }

  try {
    const body = await request.json();
    const { db } = await connectDB();
    const payload = {
      ...DEFAULT_SETTINGS,
      ...body,
      updatedAt: new Date(),
    };

    await db.collection('settings').updateOne(
      {},
      { $set: payload },
      { upsert: true }
    );

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
