import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getNotificationsService,
  markNotificationReadService,
} from "@/features/notifications/services/notification.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  const result = await getNotificationsService(session.user.id);
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
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: "notificationId is required" },
        { status: 400 }
      );
    }

    const result = await markNotificationReadService(session.user.id, notificationId);
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
