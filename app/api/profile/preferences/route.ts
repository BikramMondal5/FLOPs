import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updatePreferencesService } from "@/features/profile/services/profile.service";

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
    const result = await updatePreferencesService(session.user.id, body);
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
