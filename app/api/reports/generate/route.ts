import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateReportService } from "@/features/reports/services/report.service";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const result = await generateReportService(session.user.id, session.user.name || "User", body);
    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
