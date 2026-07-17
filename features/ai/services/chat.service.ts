import { logger } from "@/lib/logger";
import { callGroq } from "./groq.service";
import { buildFinancialContext } from "./context-builder.service";
import {
  buildSystemPrompt,
  formatFinancialContext,
  generateSuggestedQuestions,
} from "./prompt-builder.service";
import type { ApiResponse } from "@/features/accounts/types/account.types";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggestedQuestions: string[];
}

/**
 * Handle AI chat request with conversation history
 * @param userId - Authenticated user ID
 * @param message - User's question
 * @param history - Previous conversation messages (optional)
 * @param userName - Optional user name
 * @returns Chat response with AI reply and suggested questions
 */
export async function handleChatRequest(
  userId: string,
  message: string,
  history: ChatMessage[] = [],
  userName?: string
): Promise<ApiResponse<ChatResponse>> {
  try {
    logger.info("Processing AI chat request", { 
      userId, 
      message,
      historyLength: history.length 
    });

    // Step 1: Build financial context
    const context = await buildFinancialContext(userId, userName);

    // Step 2: Build system prompt and context data
    const systemPrompt = buildSystemPrompt();
    const contextData = formatFinancialContext(context);

    // Step 3: Prepare conversation history (keep last 10 messages for context)
    const recentHistory = history.slice(-10);
    
    // Build messages array for Groq
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: `${systemPrompt}\n\n${contextData}` },
    ];

    // Add conversation history
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({
      role: "user",
      content: message,
    });

    // Step 4: Call Groq with conversation history
    const aiReply = await callGroq(messages, false);

    // Step 5: Generate suggested questions
    const suggestedQuestions = generateSuggestedQuestions(context);

    logger.info("AI chat request completed successfully", {
      userId,
      replyLength: aiReply.length,
      historyCount: recentHistory.length,
    });

    return {
      success: true,
      message: "Chat response generated successfully",
      data: {
        reply: aiReply.trim(),
        suggestedQuestions,
      },
    };
  } catch (error) {
    logger.error("Failed to process AI chat request", error, { userId, message });

    return {
      success: false,
      message: "Unable to contact the AI assistant. Please try again.",
    };
  }
}
