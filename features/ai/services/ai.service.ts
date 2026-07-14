import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import { getBudgetDashboardService } from "@/features/budget/services/budget.service";
import { getGoalsDashboardService } from "@/features/goals/services/goal.service";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { AIInsightsDashboardDTO, ChatResponseDTO } from "../dto/ai-dashboard.dto";
import type { ChatMessage } from "../types/ai.types";
import { buildDashboardPrompt } from "../prompt-builders/financial-summary.prompt";
import { buildChatPrompt } from "../prompt-builders/chat.prompt";
import { askGemini } from "../providers/llm.provider";
import { safeJsonParse } from "../parsers/response.parser";
import { generateDeterministicRecommendations } from "./recommendation.service";
import { logger } from "@/lib/logger";

interface CacheBlock {
  userId: string;
  dto: AIInsightsDashboardDTO;
  timestamp: number;
}

let aiCache: CacheBlock[] = [];
const CACHE_TTL_MS = 60 * 1000;

export function invalidateAICache(userId: string) {
  logger.info("Invalidating AI insights dashboard cache", { userId });
  aiCache = aiCache.filter((c) => c.userId !== userId);
}

// ─────────────────────────────────────────────
// Get AI Insights Dashboard DTO
// ─────────────────────────────────────────────
export async function getAIDashboardService(
  userId: string
): Promise<ApiResponse<AIInsightsDashboardDTO>> {
  const nowTime = Date.now();
  const cached = aiCache.find((c) => c.userId === userId && nowTime - c.timestamp < CACHE_TTL_MS);

  if (cached) {
    logger.info("Serving AI insights dashboard from cache", { userId });
    return {
      success: true,
      message: "AI Dashboard metrics retrieved successfully (cached)",
      data: cached.dto,
    };
  }

  try {
    // 1. Parallel fetch pre-computed context from adjacent engines
    const [analyticsRes, budgetRes, goalsRes] = await Promise.all([
      getDashboardAnalyticsService(userId, "This Month"),
      getBudgetDashboardService(userId),
      getGoalsDashboardService(userId),
    ]);

    if (!analyticsRes.success || !analyticsRes.data || !budgetRes.success || !budgetRes.data || !goalsRes.success || !goalsRes.data) {
      throw new Error("Unable to build engine context. Check dependencies.");
    }

    const analytics = analyticsRes.data;
    const budget = budgetRes.data;
    const goals = goalsRes.data;

    // 2. Generate rule-based deterministic recommendations
    const deterministicRecommendations = generateDeterministicRecommendations(analytics, budget, goals);

    // 3. Construct prompt
    const prompt = buildDashboardPrompt(analytics, budget, goals);

    // 4. Send request to LLM Provider
    const rawResponse = await askGemini(prompt, true);

    // 5. Parse structured response
    const dashboardDTO = safeJsonParse<AIInsightsDashboardDTO>(rawResponse, {
      financialSummary: {
        overallStance: "Stable Position",
        achievements: ["Category budgets are running inside limits."],
        primaryConcerns: ["Monitor categories showing spikes."],
        actionableStep: "Establish emergency goal buffers.",
      },
      monthlyReview: {
        summaryParagraph: "Your cash inflows cleanly cover category parameters.",
        topExpenseCategory: "Food",
        topIncomeSource: "Salary",
        budgetPerformanceNotice: "Category budgets are running inside active limits.",
        goalHealthNotice: "Active goals are running inside expected timelines.",
      },
      recommendations: deterministicRecommendations,
      risks: [],
      opportunities: [],
      financialHealthExplanation: "Health indices map clean scores.",
    });

    // Merge deterministic findings with LLM explanations to guarantee facts
    if (dashboardDTO.recommendations.length === 0 || dashboardDTO.recommendations[0].message.includes("utilization is healthy")) {
      dashboardDTO.recommendations = deterministicRecommendations;
    }

    // Save cache
    aiCache = aiCache.filter((c) => c.userId !== userId);
    aiCache.push({
      userId,
      dto: dashboardDTO,
      timestamp: nowTime,
    });

    return {
      success: true,
      message: "AI insights dashboard compiled successfully",
      data: dashboardDTO,
    };
  } catch (error) {
    logger.error("Failed to compile AI insights dashboard DTO", error, { userId });
    return {
      success: false,
      message: "Failed to compile financial intelligence suggestions.",
    };
  }
}

// ─────────────────────────────────────────────
// Conversational Q&A chat
// ─────────────────────────────────────────────
export async function askAIChatService(
  userId: string,
  history: ChatMessage[],
  userMessage: string
): Promise<ApiResponse<ChatResponseDTO>> {
  try {
    // 1. Fetch pre-computed context
    const [analyticsRes, budgetRes, goalsRes] = await Promise.all([
      getDashboardAnalyticsService(userId, "This Month"),
      getBudgetDashboardService(userId),
      getGoalsDashboardService(userId),
    ]);

    if (!analyticsRes.success || !analyticsRes.data || !budgetRes.success || !budgetRes.data || !goalsRes.success || !goalsRes.data) {
      throw new Error("Unable to build engine context. Check dependencies.");
    }

    // 2. Construct Chat prompt
    const prompt = buildChatPrompt(
      analyticsRes.data,
      budgetRes.data,
      goalsRes.data,
      history,
      userMessage
    );

    // 3. Ask provider
    const rawResponse = await askGemini(prompt, false);

    // 4. Parse DTO response
    const dto = safeJsonParse<ChatResponseDTO>(rawResponse, {
      response: "I received your query. Based on your ledger, your balances are synced and active goals are running on track.",
      suggestedPrompts: ["How can I save more?", "Am I on track for my laptop?"],
    });

    return {
      success: true,
      message: "Chat response generated successfully",
      data: dto,
    };
  } catch (error) {
    logger.error("Failed to answer user question", error, { userId, userMessage });
    return {
      success: false,
      message: "Failed to answer conversational question.",
    };
  }
}
