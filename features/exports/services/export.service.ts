import { connectDB } from "@/lib/mongodb";
import { TRANSACTIONS_COLLECTION, serializeTransaction } from "@/lib/models/Transaction";
import { ObjectId } from "mongodb";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";

export type ExportFormat = "csv" | "json" | "xlsx";

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportTransactionsService(
  userId: string,
  format: ExportFormat = "csv"
): Promise<ApiResponse<string | any>> {
  try {
    const db = await connectDB();
    const txCol = db.collection(TRANSACTIONS_COLLECTION);
    const docs = await txCol
      .find({ userId: new ObjectId(userId), isArchived: false })
      .sort({ transactionDate: -1 })
      .toArray();

    const transactions = docs.map(serializeTransaction) as unknown as TransactionDTO[];

    if (format === "csv") {
      const headers = ["ID", "Date", "Merchant", "Type", "Category", "Amount", "Payment Method", "Notes"];
      const rows = transactions.map((t) => [
        t._id,
        t.transactionDate,
        t.merchant,
        t.type,
        t.category,
        t.amount,
        t.paymentMethod,
        t.notes ?? "",
      ]);

      const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
      ].join("\n");

      return {
        success: true,
        message: "CSV export compiled successfully",
        data: csvContent,
      };
    }

    if (format === "xlsx") {
      // Return XLSX-compatible flat JSON structure representing tabular rows
      const tabularData = transactions.map((t) => ({
        "Transaction ID": t._id,
        "Date": t.transactionDate,
        "Merchant": t.merchant,
        "Type": t.type,
        "Category": t.category,
        "Amount": t.amount,
        "Payment Method": t.paymentMethod,
        "Notes": t.notes ?? "",
      }));

      return {
        success: true,
        message: "XLSX JSON compiled successfully",
        data: tabularData,
      };
    }

    // Default JSON
    return {
      success: true,
      message: "JSON export compiled successfully",
      data: transactions,
    };
  } catch (error) {
    logger.error("Failed to export transactions", error, { userId, format });
    return {
      success: false,
      message: "Failed to compile transaction export.",
    };
  }
}
