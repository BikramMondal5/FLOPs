import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { AnalyticsDateRange } from "@/features/analytics/types/analytics.types";
import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") ?? "This Month") as AnalyticsDateRange;
  const customStart = searchParams.get("startDate") ?? undefined;
  const customEnd = searchParams.get("endDate") ?? undefined;

  const result = await getDashboardAnalyticsService(session.user.id, range, customStart, customEnd);
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
