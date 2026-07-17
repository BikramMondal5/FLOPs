import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getReportsSummaryService } from "@/features/reports/services/report.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const result = await getReportsSummaryService(session.user.id);
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
