import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET as getAIDashboard } from "@/app/api/ai/dashboard/route";
import { POST as postAIChat } from "@/app/api/ai/chat/route";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createBudgetService } from "@/features/budget/services/budget.service";
import { createGoalService } from "@/features/goals/services/goal.service";
import { askGemini } from "@/features/ai/providers/llm.provider";
import request from "supertest";
import { ObjectId } from "mongodb";

let mockSession: any = {
  user: {
    id: new ObjectId().toString(),
  },
};

vi.mock("@/lib/auth", () => ({
  auth: () => mockSession,
}));

vi.mock("@/features/ai/providers/llm.provider", () => ({
  askGemini: vi.fn(),
}));

describe("API Routes: /api/ai", () => {
  let db: any;
  let aiDashboardServer: any;
  let aiChatServer: any;
  let accountId: string;

  beforeAll(async () => {
    db = await connect();
    aiDashboardServer = createRouteServer({ GET: getAIDashboard });
    aiChatServer = createRouteServer({ POST: postAIChat });
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
    vi.clearAllMocks();
    mockSession = {
      user: {
        id: new ObjectId().toString(),
      },
    };

    // Set up standard environment context
    const accountRes = await createAccountService(mockSession.user.id, {
      name: "Checking",
      type: "Current",
      balance: 10000,
    });
    accountId = accountRes.data!._id;

    await createBudgetService(mockSession.user.id, {
      name: "Monthly Food",
      category: "Food & Dining",
      budgetAmount: 1000,
      period: "Monthly",
      startDate: "2026-07-01T00:00:00.000Z",
      endDate: "2026-07-31T23:59:59.000Z",
    });

    await createGoalService(mockSession.user.id, {
      name: "Laptop",
      targetAmount: 50000,
      currentContribution: 5000,
      category: "Electronics",
      targetDate: "2027-12-31T00:00:00.000Z",
    });
  });

  it("GET /api/ai/dashboard - should return structured AI suggestions DTO", async () => {
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

    const res = await request(aiDashboardServer)
      .get("/api/ai/dashboard")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.financialSummary.overallStance).toBe("Healthy Position");
  });

  it("POST /api/ai/chat - should return conversational chat Q&A", async () => {
    const mockChatResponse = {
      response: "Keep checking your food budget.",
      suggestedPrompts: ["Help me make a budget"],
    };

    vi.mocked(askGemini).mockResolvedValueOnce(JSON.stringify(mockChatResponse));

    const res = await request(aiChatServer)
      .post("/api/ai/chat")
      .send({ userMessage: "How are my budgets doing?" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.response).toBe("Keep checking your food budget.");
  });
});
