import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { getAIDashboardService, askAIChatService } from "@/features/ai/services/ai.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createTransactionService } from "@/features/transactions/services/transaction.service";
import { createBudgetService } from "@/features/budget/services/budget.service";
import { createGoalService } from "@/features/goals/services/goal.service";
import { ObjectId } from "mongodb";
import { askGemini } from "@/features/ai/providers/llm.provider";

// Mock the Gemini Provider
vi.mock("@/features/ai/providers/llm.provider", () => ({
  askGemini: vi.fn(),
}));

describe("AI Insights Integration Tests", () => {
  let db: any;
  const mockUserId = new ObjectId().toString();
  let accountId: string;

  beforeAll(async () => {
    db = await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
    vi.clearAllMocks();

    // Set up active account, budget, goal to provide full context to the prompt
    const accountRes = await createAccountService(mockUserId, {
      name: "Checking",
      type: "Current",
      balance: 10000,
    });
    accountId = accountRes.data!._id;

    await createBudgetService(mockUserId, {
      name: "Monthly Food",
      category: "Food & Dining",
      budgetAmount: 1000,
      period: "Monthly",
      startDate: "2026-07-01T00:00:00.000Z",
      endDate: "2026-07-31T23:59:59.000Z",
    });

    await createGoalService(mockUserId, {
      name: "New Laptop",
      targetAmount: 50000,
      currentContribution: 5000,
      category: "Electronics",
      targetDate: "2027-12-31T00:00:00.000Z",
    });

    await createTransactionService(mockUserId, {
      accountId,
      amount: 200,
      type: "Expense",
      category: "Food & Dining",
      transactionDate: new Date().toISOString(),
      merchant: "Restaurant",
      paymentMethod: "Cash",
    });
  });

  it("should compile dashboard prompt and return parsed structured insights DTO", async () => {
    const mockDto = {
      financialSummary: {
        overallStance: "Healthy Position",
        achievements: ["Food budget is well controlled."],
        primaryConcerns: ["Goal saving rate is slightly slow."],
        actionableStep: "Increase monthly savings by 500.",
      },
      monthlyReview: {
        summaryParagraph: "Summary paragraph about monthly review.",
        topExpenseCategory: "Food",
        topIncomeSource: "Salary",
        budgetPerformanceNotice: "Within limits.",
        goalHealthNotice: "On track.",
      },
      recommendations: [{ category: "Food", type: "neutral", message: "Nice job" }],
      risks: [],
      opportunities: [],
      financialHealthExplanation: "Good.",
    };

    vi.mocked(askGemini).mockResolvedValueOnce(JSON.stringify(mockDto));

    const result = await getAIDashboardService(mockUserId);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.financialSummary.overallStance).toBe("Healthy Position");
    expect(askGemini).toHaveBeenCalled();
  });

  it("should execute chatbot Q&A matching the history context", async () => {
    const mockChatResponse = {
      response: "To save more, try trimming down Food spending.",
      suggestedPrompts: ["Show me my budget breakdown"],
    };

    vi.mocked(askGemini).mockResolvedValueOnce(JSON.stringify(mockChatResponse));

    const result = await askAIChatService(mockUserId, [], "How do I save more money?");
    expect(result.success).toBe(true);
    expect(result.data?.response).toBe("To save more, try trimming down Food spending.");
    expect(result.data?.suggestedPrompts).toContain("Show me my budget breakdown");
  });
});
