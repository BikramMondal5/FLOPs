import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { exportTransactionsService, ExportFormat } from "@/features/exports/services/export.service";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const formatParam = searchParams.get("format") || "csv";

  let format: ExportFormat = "csv";
  if (formatParam === "json" || formatParam === "xlsx") {
    format = formatParam;
  }

  const result = await exportTransactionsService(session.user.id, format);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  if (format === "csv") {
    return new NextResponse(result.data, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=transactions_export_${Date.now()}.csv`,
      },
    });
  }

  return NextResponse.json(result);
}
