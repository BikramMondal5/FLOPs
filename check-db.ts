import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found in env!");
    return;
  }
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);
  await client.connect();
  
  // List all databases
  const adminDb = client.db().admin();
  const dbs = await adminDb.listDatabases();
  console.log("\n--- Databases on Server ---");
  for (const dbInfo of dbs.databases) {
    console.log(`- Database: ${dbInfo.name} (${dbInfo.sizeOnDisk} bytes)`);
    const db = client.db(dbInfo.name);
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`    * Collection: ${col.name} (${count} docs)`);
    }
  }

  await client.close();
}

main().catch(console.error);
