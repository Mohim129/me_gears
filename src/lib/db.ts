import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME || 'me_gears_db';

if (!uri) {
  throw new Error('Please add your Mongo URI to .env');
}

let client: MongoClient;
let db: Db;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClient?: MongoClient;
    _mongoDb?: Db;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }
  client = globalWithMongo._mongoClient;

  if (!globalWithMongo._mongoDb) {
    globalWithMongo._mongoDb = client.db(dbName);
  }
  db = globalWithMongo._mongoDb;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri);
  db = client.db(dbName);
}

export async function connectDB() {
  await client.connect();
  return { client, db };
}
