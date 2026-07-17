import { Db, ObjectId } from "mongodb";
import type { NotificationReadStatusDTO } from "../types/notification.types";

const NOTIFICATIONS_COLLECTION = "notification_read_status";

function serializeNotificationStatus(doc: any): NotificationReadStatusDTO {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    notificationId: doc.notificationId,
    read: doc.read,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export async function findReadStatusByUserId(
  db: Db,
  userId: string
): Promise<NotificationReadStatusDTO[]> {
  const docs = await db
    .collection(NOTIFICATIONS_COLLECTION)
    .find({ userId: new ObjectId(userId) })
    .toArray();

  return docs.map(serializeNotificationStatus);
}

export async function markNotificationRead(
  db: Db,
  userId: string,
  notificationId: string
): Promise<void> {
  const now = new Date();
  await db.collection(NOTIFICATIONS_COLLECTION).updateOne(
    {
      userId: new ObjectId(userId),
      notificationId,
    },
    {
      $set: {
        read: true,
        updatedAt: now,
      },
      $setOnInsert: {
        userId: new ObjectId(userId),
        notificationId,
        createdAt: now,
      },
    },
    { upsert: true }
  );
}

export async function markAllNotificationsRead(
  db: Db,
  userId: string,
  notificationIds: string[]
): Promise<void> {
  const now = new Date();
  const operations = notificationIds.map((notificationId) => ({
    updateOne: {
      filter: {
        userId: new ObjectId(userId),
        notificationId,
      },
      update: {
        $set: {
          read: true,
          updatedAt: now,
        },
        $setOnInsert: {
          userId: new ObjectId(userId),
          notificationId,
          createdAt: now,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await db.collection(NOTIFICATIONS_COLLECTION).bulkWrite(operations);
  }
}
