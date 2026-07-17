import { logger } from "@/lib/logger";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message: string;
  };
}

/**
 * Call Groq API with the specified messages
 * @param messages - Array of chat messages
 * @param expectJson - Whether to expect JSON response format
 * @returns The AI response text
 */
export async function callGroq(
  messages: GroqMessage[],
  expectJson = false
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    logger.warn("GROQ_API_KEY environment variable is not defined. Returning fallback response.");
    throw new Error("AI service is not configured. Please contact support.");
  }

  try {
    const requestBody: any = {
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    };

    // If expecting JSON, use response format
    if (expectJson) {
      requestBody.response_format = { type: "json_object" };
    }

    logger.info("Calling Groq API", { model: MODEL, messageCount: messages.length });

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("Groq API call failed", {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as GroqResponse;

    if (data.error) {
      logger.error("Groq API returned error", { error: data.error });
      throw new Error(`Groq error: ${data.error.message}`);
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      logger.error("Empty response from Groq API", { data });
      throw new Error("Empty response from AI service");
    }

    logger.info("Groq API call successful", {
      responseLength: content.length,
    });

    return content;
  } catch (error) {
    logger.error("Groq service error", error);
    throw error;
  }
}

/**
 * Simple wrapper for single-turn requests
 */
export async function askGroq(
  systemPrompt: string,
  userMessage: string,
  expectJson = false
): Promise<string> {
  const messages: GroqMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  return callGroq(messages, expectJson);
}
