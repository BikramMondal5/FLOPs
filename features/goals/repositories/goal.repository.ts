import { Db, ObjectId } from "mongodb";
import { GoalDTO } from "../types/goal.types";

const GOALS_COLLECTION = "goals";

function serializeGoal(doc: any): GoalDTO {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    targetAmount: doc.targetAmount,
    currentContribution: doc.currentContribution ?? 0,
    targetDate: doc.targetDate instanceof Date ? doc.targetDate.toISOString() : String(doc.targetDate),
    priority: doc.priority ?? "Medium",
    category: doc.category,
    icon: doc.icon,
    color: doc.color,
    description: doc.description,
    status: doc.status ?? "Active",
    isArchived: doc.isArchived ?? false,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export async function findGoalsByUserId(db: Db, userId: string): Promise<GoalDTO[]> {
  const docs = await db
    .collection(GOALS_COLLECTION)
    .find({ userId: new ObjectId(userId), isArchived: false })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(serializeGoal);
}

export async function findGoalById(db: Db, id: string, userId: string): Promise<GoalDTO | null> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const doc = await db.collection(GOALS_COLLECTION).findOne({
    _id: objectId,
    userId: new ObjectId(userId),
    isArchived: false,
  });

  if (!doc) return null;
  return serializeGoal(doc);
}

export async function createGoal(db: Db, userId: string, data: any): Promise<GoalDTO> {
  const now = new Date();
  const doc = {
    userId: new ObjectId(userId),
    name: data.name.trim(),
    targetAmount: Number(data.targetAmount),
    currentContribution: Number(data.currentContribution ?? 0),
    targetDate: new Date(data.targetDate),
    priority: data.priority || "Medium",
    category: data.category,
    icon: data.icon || "target",
    color: data.color || "#F6B7CF",
    description: data.description?.trim() || "",
    status: data.status || "Active",
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(GOALS_COLLECTION).insertOne(doc);
  const inserted = await db.collection(GOALS_COLLECTION).findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Failed to find inserted goal");

  return serializeGoal(inserted);
}

export async function updateGoal(db: Db, id: string, userId: string, data: any): Promise<GoalDTO | null> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const updateFields: any = { updatedAt: new Date() };

  if (data.name !== undefined) updateFields.name = data.name.trim();
  if (data.targetAmount !== undefined) updateFields.targetAmount = Number(data.targetAmount);
  if (data.currentContribution !== undefined) updateFields.currentContribution = Number(data.currentContribution);
  if (data.targetDate !== undefined) updateFields.targetDate = new Date(data.targetDate);
  if (data.priority !== undefined) updateFields.priority = data.priority;
  if (data.category !== undefined) updateFields.category = data.category;
  if (data.icon !== undefined) updateFields.icon = data.icon;
  if (data.color !== undefined) updateFields.color = data.color;
  if (data.description !== undefined) updateFields.description = data.description.trim();
  if (data.status !== undefined) updateFields.status = data.status;
  if (data.isArchived !== undefined) updateFields.isArchived = data.isArchived;

  const result = await db.collection(GOALS_COLLECTION).findOneAndUpdate(
    { _id: objectId, userId: new ObjectId(userId), isArchived: false },
    { $set: updateFields },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeGoal(result);
}

export async function deleteGoal(db: Db, id: string, userId: string): Promise<boolean> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return false;
  }

  const result = await db.collection(GOALS_COLLECTION).updateOne(
    { _id: objectId, userId: new ObjectId(userId), isArchived: false },
    { $set: { isArchived: true, updatedAt: new Date() } }
  );

  return result.matchedCount > 0;
}
