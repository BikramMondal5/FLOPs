import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getTransactionsService,
  createTransactionService,
} from "@/features/transactions/services/transaction.service";

// ─────────────────────────────────────────────
// GET /api/transactions
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const rawParams: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    rawParams[key] = val;
  });

  const result = await getTransactionsService(session.user.id, rawParams);
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

// ─────────────────────────────────────────────
// POST /api/transactions
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body. Expected JSON." },
      { status: 400 }
    );
  }

  const result = await createTransactionService(session.user.id, body);

  if (!result.success) {
    const status = "errors" in result ? 400 : 403;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result, { status: 201 });
}
