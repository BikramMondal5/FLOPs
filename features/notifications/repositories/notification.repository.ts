import { Db, ObjectId } from "mongodb";

const READ_COLLECTION = "notification_reads";
const META_COLLECTION = "notification_meta";

export async function findReadNotificationIds(db: Db, userId: string): Promise<string[]> {
  const docs = await db
    .collection(READ_COLLECTION)
    .find({ userId: new ObjectId(userId) })
    .toArray();

  return docs.map((doc) => doc.notificationId);
}

export async function findUserLastReadTimestamp(db: Db, userId: string): Promise<Date | null> {
  const doc = await db
    .collection(META_COLLECTION)
    .findOne({ userId: new ObjectId(userId) });

  return doc ? doc.lastReadAllAt : null;
}

export async function insertReadNotification(db: Db, userId: string, notificationId: string): Promise<void> {
  const now = new Date();
  await db.collection(READ_COLLECTION).updateOne(
    { userId: new ObjectId(userId), notificationId },
    { $set: { userId: new ObjectId(userId), notificationId, readAt: now } },
    { upsert: true }
  );
}

export async function updateLastReadAllTimestamp(db: Db, userId: string): Promise<void> {
  const now = new Date();
  await db.collection(META_COLLECTION).updateOne(
    { userId: new ObjectId(userId) },
    { $set: { userId: new ObjectId(userId), lastReadAllAt: now } },
    { upsert: true }
  );
}
