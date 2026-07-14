import { Db, ObjectId } from "mongodb";
import { BudgetDTO } from "../types/budget.types";

const BUDGETS_COLLECTION = "budgets";

function serializeBudget(doc: any): BudgetDTO {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    name: doc.name,
    category: doc.category,
    budgetAmount: doc.budgetAmount,
    period: doc.period,
    startDate: doc.startDate instanceof Date ? doc.startDate.toISOString() : String(doc.startDate),
    endDate: doc.endDate instanceof Date ? doc.endDate.toISOString() : String(doc.endDate),
    alertThreshold: doc.alertThreshold ?? 80,
    color: doc.color,
    icon: doc.icon,
    description: doc.description,
    isActive: doc.isActive ?? true,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export async function findBudgetsByUserId(db: Db, userId: string): Promise<BudgetDTO[]> {
  const docs = await db
    .collection(BUDGETS_COLLECTION)
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map(serializeBudget);
}

export async function findBudgetById(db: Db, id: string, userId: string): Promise<BudgetDTO | null> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const doc = await db.collection(BUDGETS_COLLECTION).findOne({
    _id: objectId,
    userId: new ObjectId(userId),
  });

  if (!doc) return null;
  return serializeBudget(doc);
}

export async function createBudget(db: Db, userId: string, data: any): Promise<BudgetDTO> {
  const now = new Date();
  const doc = {
    userId: new ObjectId(userId),
    name: data.name.trim(),
    category: data.category,
    budgetAmount: Number(data.budgetAmount),
    period: data.period || "Monthly",
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    alertThreshold: Number(data.alertThreshold ?? 80),
    color: data.color || "#F6B7CF",
    icon: data.icon || "utensils",
    description: data.description?.trim() || "",
    isActive: data.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(BUDGETS_COLLECTION).insertOne(doc);
  const inserted = await db.collection(BUDGETS_COLLECTION).findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Failed to find inserted budget");

  return serializeBudget(inserted);
}

export async function updateBudget(db: Db, id: string, userId: string, data: any): Promise<BudgetDTO | null> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const updateFields: any = { updatedAt: new Date() };

  if (data.name !== undefined) updateFields.name = data.name.trim();
  if (data.category !== undefined) updateFields.category = data.category;
  if (data.budgetAmount !== undefined) updateFields.budgetAmount = Number(data.budgetAmount);
  if (data.period !== undefined) updateFields.period = data.period;
  if (data.startDate !== undefined) updateFields.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateFields.endDate = new Date(data.endDate);
  if (data.alertThreshold !== undefined) updateFields.alertThreshold = Number(data.alertThreshold);
  if (data.color !== undefined) updateFields.color = data.color;
  if (data.icon !== undefined) updateFields.icon = data.icon;
  if (data.description !== undefined) updateFields.description = data.description.trim();
  if (data.isActive !== undefined) updateFields.isActive = data.isActive;

  const result = await db.collection(BUDGETS_COLLECTION).findOneAndUpdate(
    { _id: objectId, userId: new ObjectId(userId) },
    { $set: updateFields },
    { returnDocument: "after" }
  );

  if (!result) return null;
  return serializeBudget(result);
}

export async function deleteBudget(db: Db, id: string, userId: string): Promise<boolean> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return false;
  }

  const result = await db.collection(BUDGETS_COLLECTION).deleteOne({
    _id: objectId,
    userId: new ObjectId(userId),
  });

  return result.deletedCount > 0;
}
