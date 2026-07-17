import { Db, ObjectId } from "mongodb";
import type { ProfileDTO, PreferencesDTO, ActivityDTO } from "../types/profile.types";

const PROFILES_COLLECTION = "user_profiles";
const PREFERENCES_COLLECTION = "user_preferences";
const ACTIVITY_COLLECTION = "activity_logs";

function serializeProfile(doc: any): ProfileDTO {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    dateOfBirth: doc.dateOfBirth,
    country: doc.country,
    city: doc.city,
    currency: doc.currency || "INR",
    language: doc.language || "en",
    timezone: doc.timezone,
    location: doc.location,
    profileImage: doc.profileImage,
    emailVerified: doc.emailVerified || false,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

function serializePreferences(doc: any): PreferencesDTO {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    notifications: doc.notifications || {
      budgetAlerts: true,
      goalAlerts: true,
      reportAlerts: true,
      aiAlerts: true,
      securityAlerts: true,
    },
    appearance: doc.appearance || {
      theme: "system",
      accentColor: "#D46A96",
    },
    privacy: doc.privacy || {
      analyticsEnabled: true,
    },
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

function serializeActivity(doc: any): ActivityDTO {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    type: doc.type,
    action: doc.action,
    metadata: doc.metadata,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
  };
}

export async function findProfileByUserId(db: Db, userId: string): Promise<ProfileDTO | null> {
  const doc = await db.collection(PROFILES_COLLECTION).findOne({ userId: new ObjectId(userId) });
  if (!doc) return null;
  return serializeProfile(doc);
}

export async function createProfile(db: Db, userId: string, data: any): Promise<ProfileDTO> {
  const now = new Date();
  const doc = {
    userId: new ObjectId(userId),
    name: data.name,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth,
    country: data.country,
    city: data.city,
    currency: data.currency || "INR",
    language: data.language || "en",
    timezone: data.timezone,
    location: data.location,
    profileImage: data.profileImage,
    emailVerified: data.emailVerified || false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(PROFILES_COLLECTION).insertOne(doc);
  const inserted = await db.collection(PROFILES_COLLECTION).findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Failed to create profile");
  return serializeProfile(inserted);
}

export async function updateProfile(db: Db, userId: string, data: any): Promise<ProfileDTO | null> {
  const result = await db.collection(PROFILES_COLLECTION).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeProfile(result);
}

export async function findPreferencesByUserId(db: Db, userId: string): Promise<PreferencesDTO | null> {
  const doc = await db.collection(PREFERENCES_COLLECTION).findOne({ userId: new ObjectId(userId) });
  if (!doc) return null;
  return serializePreferences(doc);
}

export async function createPreferences(db: Db, userId: string): Promise<PreferencesDTO> {
  const now = new Date();
  const doc = {
    userId: new ObjectId(userId),
    notifications: {
      budgetAlerts: true,
      goalAlerts: true,
      reportAlerts: true,
      aiAlerts: true,
      securityAlerts: true,
    },
    appearance: {
      theme: "system",
      accentColor: "#D46A96",
    },
    privacy: {
      analyticsEnabled: true,
    },
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(PREFERENCES_COLLECTION).insertOne(doc);
  const inserted = await db.collection(PREFERENCES_COLLECTION).findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Failed to create preferences");
  return serializePreferences(inserted);
}

export async function updatePreferences(
  db: Db,
  userId: string,
  data: any
): Promise<PreferencesDTO | null> {
  const result = await db.collection(PREFERENCES_COLLECTION).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializePreferences(result);
}

export async function findRecentActivity(db: Db, userId: string, limit: number = 10): Promise<ActivityDTO[]> {
  const docs = await db
    .collection(ACTIVITY_COLLECTION)
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map(serializeActivity);
}

export async function logActivity(db: Db, userId: string, type: string, action: string, metadata?: any): Promise<void> {
  await db.collection(ACTIVITY_COLLECTION).insertOne({
    userId: new ObjectId(userId),
    type,
    action,
    metadata: metadata || {},
    createdAt: new Date(),
  });
}
