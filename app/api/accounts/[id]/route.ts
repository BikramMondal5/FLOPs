import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getAccountByIdService,
  updateAccountService,
  archiveAccountService,
} from "@/features/accounts/services/account.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ─────────────────────────────────────────────
// GET /api/accounts/:id
// ─────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in to continue." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await getAccountByIdService(id, session.user.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}

// ─────────────────────────────────────────────
// PATCH /api/accounts/:id
// ─────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteParams) {
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

  const { id } = await params;
  const result = await updateAccountService(id, session.user.id, body);

  if (!result.success) {
    const status = "errors" in result ? 400 : 404;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result, { status: 200 });
}

// ─────────────────────────────────────────────
// DELETE /api/accounts/:id  (soft delete — archives)
// ─────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in to continue." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const result = await archiveAccountService(id, session.user.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result, { status: 200 });
}
