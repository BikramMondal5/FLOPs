import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getFullProfileService, updateProfileService } from "@/features/profile/services/profile.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.name || !session?.user?.email) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const result = await getFullProfileService(session.user.id, session.user.name, session.user.email);
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const result = await updateProfileService(session.user.id, body);
    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
}
