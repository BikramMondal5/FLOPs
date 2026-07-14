import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateBudgetService, deleteBudgetService } from "@/features/budget/services/budget.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const result = await updateBudgetService(id, session.user.id, body);
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

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const result = await deleteBudgetService(id, session.user.id);
  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
