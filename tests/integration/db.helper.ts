import { MongoClient, Db } from "mongodb";
import { ensureAccountIndexes } from "@/lib/models/Account";
import { ensureTransactionIndexes } from "@/lib/models/Transaction";

let client: MongoClient | null = null;

export async function connect(): Promise<Db> {
  if (!client) {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in process.env. Ensure vitest.setup.ts starts the MongoMemoryServer first.");
    }
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }

  const db = client.db("flops");
  await ensureAccountIndexes(db);
  await ensureTransactionIndexes(db);

  return db;
}

export async function disconnect(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}

export async function clearDatabase(): Promise<void> {
  if (client) {
    const db = client.db("flops");
    const collections = await db.collections();
    for (const col of collections) {
      if (col.collectionName.startsWith("system.")) {
        continue;
      }
      await col.deleteMany({});
    }
  }
}

export function getClient(): MongoClient {
  if (!client) {
    throw new Error("Database not connected. Call connect() first.");
  }
  return client;
}
