import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTrendsAnalyticsService } from "@/features/analytics/services/analytics.service";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const paymentMethod = searchParams.get("paymentMethod") ?? undefined;
  const accountId = searchParams.get("accountId") ?? undefined;

  const refDateStr = searchParams.get("referenceDate");
  const referenceDate = refDateStr && !isNaN(new Date(refDateStr).getTime()) 
    ? new Date(refDateStr) 
    : undefined;

  const result = await getTrendsAnalyticsService(session.user.id, {
    search,
    category,
    paymentMethod,
    accountId,
    referenceDate,
  });

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
