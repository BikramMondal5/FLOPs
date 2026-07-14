import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBudgetsListService, createBudgetService } from "@/features/budget/services/budget.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const result = await getBudgetsListService(session.user.id);
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

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
    const result = await createBudgetService(session.user.id, body);
    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
