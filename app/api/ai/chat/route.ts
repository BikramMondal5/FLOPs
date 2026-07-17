import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handleChatRequest, ChatMessage } from "@/features/ai/services/chat.service";

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
    const { message, history } = body;
    
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Message is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // Validate history if provided
    let validatedHistory: ChatMessage[] = [];
    if (history && Array.isArray(history)) {
      validatedHistory = history
        .filter((msg: any) => 
          msg && 
          typeof msg === "object" && 
          (msg.role === "user" || msg.role === "assistant") &&
          typeof msg.content === "string"
        )
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }));
    }

    const result = await handleChatRequest(
      session.user.id,
      message.trim(),
      validatedHistory,
      session.user.name || undefined
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
