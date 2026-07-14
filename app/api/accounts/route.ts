import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getAccountsService,
  createAccountService,
} from "@/features/accounts/services/account.service";

// ─────────────────────────────────────────────
// GET /api/accounts
// Query params: search, type, archived, sort
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in to continue." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const rawParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    rawParams[key] = value;
  });

  const result = await getAccountsService(session.user.id, rawParams);

  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

// ─────────────────────────────────────────────
// POST /api/accounts
// Body: CreateAccountInput
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in to continue." },
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

  const result = await createAccountService(session.user.id, body);

  if (!result.success && "errors" in result) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result, {
    status: result.success ? 201 : 500,
  });
}
