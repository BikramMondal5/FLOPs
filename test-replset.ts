import { MongoMemoryReplSet } from "mongodb-memory-server";

async function main() {
  console.log("Starting MongoMemoryReplSet...");
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" }
  });
  console.log("Replica Set URI:", replSet.getUri());
  await replSet.stop();
  console.log("Success!");
}

main().catch(console.error);
