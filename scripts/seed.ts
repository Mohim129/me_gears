/* eslint-disable @typescript-eslint/no-require-imports */
import { MongoClient } from 'mongodb';
import { hashPassword } from 'better-auth/crypto';
import { products } from './data/products';

// Direct connection string constructed from DNS records to bypass local querySrv DNS issues
const MONGO_URI =
  'mongodb://megears247_db_user:xpNvS27xkvHdu8er@ac-oaaov2j-shard-00-00.06fjy6h.mongodb.net:27017,ac-oaaov2j-shard-00-01.06fjy6h.mongodb.net:27017,ac-oaaov2j-shard-00-02.06fjy6h.mongodb.net:27017/me_gears_db?ssl=true&replicaSet=atlas-qhbl4u-shard-0&authSource=admin&appName=MeGears';
const DB_NAME = 'me_gears_db';

async function seed() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB');

    // ─── Clear existing data ───
    await db.collection('user').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('session').deleteMany({});
    await db.collection('account').deleteMany({});
    await db.collection('verification').deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // ─── Seed Users ───
    const demoPasswordHash = await hashPassword('demo123');
    const adminPasswordHash = await hashPassword('admin123');
    const now = new Date();

    const users = [
      {
        name: 'Demo User',
        email: 'demo@megears.com',
        emailVerified: true,
        role: 'user',
        image: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Admin User',
        email: 'admin@megears.com',
        emailVerified: true,
        role: 'admin',
        image: null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const userResult = await db.collection('user').insertMany(users);
    const userIds = Object.values(userResult.insertedIds);
    console.log(`👤 Inserted ${userIds.length} users`);

    // ─── Seed Accounts (for email/password login via BetterAuth) ───
    const accounts = [
      {
        userId: userIds[0],
        accountId: userIds[0].toString(),
        providerId: 'credential',
        password: demoPasswordHash,
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: userIds[1],
        accountId: userIds[1].toString(),
        providerId: 'credential',
        password: adminPasswordHash,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await db.collection('account').insertMany(accounts);
    console.log('🔐 Inserted credential accounts');

    // ─── Seed Products ───
    if (products.length > 0) {
      const productsWithTimestamp = products.map((p) => ({
        ...p,
        createdAt: now,
      }));
      await db.collection('products').insertMany(productsWithTimestamp);
      console.log(`📦 Inserted ${products.length} products`);
    }


    console.log('\n🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
