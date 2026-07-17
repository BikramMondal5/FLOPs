import { Db, ObjectId } from "mongodb";
import { ReportDTO } from "../types/report.types";

const REPORTS_COLLECTION = "reports";

function serializeReport(doc: any): ReportDTO {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    reportType: doc.reportType,
    startDate: doc.startDate instanceof Date ? doc.startDate.toISOString() : String(doc.startDate),
    endDate: doc.endDate instanceof Date ? doc.endDate.toISOString() : String(doc.endDate),
    generatedAt: doc.generatedAt instanceof Date ? doc.generatedAt.toISOString() : String(doc.generatedAt),
    fileName: doc.fileName,
    summary: doc.summary,
    aiSummary: doc.aiSummary,
    fullData: doc.fullData, // Include full report data
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export async function findReportsByUserId(db: Db, userId: string): Promise<ReportDTO[]> {
  const docs = await db
    .collection(REPORTS_COLLECTION)
    .find({ userId: new ObjectId(userId) })
    .sort({ generatedAt: -1 })
    .limit(50)
    .toArray();

  return docs.map(serializeReport);
}

export async function findReportById(db: Db, id: string, userId: string): Promise<ReportDTO | null> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const doc = await db.collection(REPORTS_COLLECTION).findOne({
    _id: objectId,
    userId: new ObjectId(userId),
  });

  if (!doc) return null;
  return serializeReport(doc);
}

export async function createReport(db: Db, userId: string, data: any): Promise<ReportDTO> {
  const now = new Date();
  const doc = {
    userId: new ObjectId(userId),
    reportType: data.reportType,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    generatedAt: now,
    fileName: data.fileName,
    summary: data.summary,
    aiSummary: data.aiSummary || "",
    fullData: data.fullData, // Store complete report data
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection(REPORTS_COLLECTION).insertOne(doc);
  const inserted = await db.collection(REPORTS_COLLECTION).findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Failed to find inserted report");

  return serializeReport(inserted);
}

export async function deleteReport(db: Db, id: string, userId: string): Promise<boolean> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return false;
  }

  const result = await db.collection(REPORTS_COLLECTION).deleteOne({
    _id: objectId,
    userId: new ObjectId(userId),
  });

  return result.deletedCount > 0;
}
