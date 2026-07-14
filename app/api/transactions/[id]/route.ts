import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getTransactionByIdService,
  updateTransactionService,
  archiveTransactionService,
} from "@/features/transactions/services/transaction.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ─────────────────────────────────────────────
// GET /api/transactions/:id
// ─────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await getTransactionByIdService(id, session.user.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}

// ─────────────────────────────────────────────
// PATCH /api/transactions/:id
// ─────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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

  const { id } = await params;
  const result = await updateTransactionService(id, session.user.id, body);

  if (!result.success) {
    const status = "errors" in result ? 400 : 404;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result, { status: 200 });
}

// ─────────────────────────────────────────────
// DELETE /api/transactions/:id  (soft delete)
// ─────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await archiveTransactionService(id, session.user.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}
