import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getReportDashboardService } from "@/features/reports/services/report.service";
import type { ReportPeriod } from "@/features/reports/types/report.types";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  let period: ReportPeriod = "Monthly";
  const pParam = searchParams.get("period");

  if (pParam === "Daily" || pParam === "Weekly" || pParam === "Monthly") {
    period = pParam;
  }

  const result = await getReportDashboardService(session.user.id, period);
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
