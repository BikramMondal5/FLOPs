import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteReportService, getReportByIdService } from "@/features/reports/services/report.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await getReportByIdService(id, session.user.id);
  return NextResponse.json(result, {
    status: result.success ? 200 : 404,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await deleteReportService(id, session.user.id);
  return NextResponse.json(result, {
    status: result.success ? 200 : 404,
  });
}
