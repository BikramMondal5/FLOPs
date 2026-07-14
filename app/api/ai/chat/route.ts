import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { askAIChatService } from "@/features/ai/services/ai.service";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    const { history, userMessage } = await req.json();
    
    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { success: false, message: "userMessage is required and must be a string." },
        { status: 400 }
      );
    }

    const result = await askAIChatService(
      session.user.id,
      history || [],
      userMessage
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid payload parameters." },
      { status: 400 }
    );
  }
}
