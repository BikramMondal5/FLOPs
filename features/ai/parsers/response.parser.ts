import { logger } from "@/lib/logger";

export function safeJsonParse<T>(rawText: string, fallback: T): T {
  // Enforce codeblock cleanups if markdown output was returned by the LLM
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  }
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    logger.error("JSON parsing of LLM response content failed", error, { rawText });
    return fallback;
  }
}
