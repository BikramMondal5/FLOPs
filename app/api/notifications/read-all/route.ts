import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markAllNotificationsReadService } from "@/features/notifications/services/notification.service";

export async function PATCH() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const result = await markAllNotificationsReadService(session.user.id);
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
