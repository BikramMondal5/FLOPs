import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET as getBudgets, POST as postBudget } from "@/app/api/budgets/route";
import { GET as getBudgetDashboard } from "@/app/api/budgets/dashboard/route";
import { PATCH as patchBudget, DELETE as deleteBudget } from "@/app/api/budgets/[id]/route";
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

describe("API Routes: /api/budgets", () => {
  let db: any;
  let budgetsServer: any;
  let budgetDashboardServer: any;
  let budgetDetailServer: any;

  beforeAll(async () => {
    db = await connect();
    budgetsServer = createRouteServer({ GET: getBudgets, POST: postBudget });
    budgetDashboardServer = createRouteServer({ GET: getBudgetDashboard });
    budgetDetailServer = createRouteServer({
      PATCH: patchBudget,
      DELETE: deleteBudget,
    }, (url) => {
      const parts = url.split("/");
      const id = parts[parts.length - 1] || "";
      return { id };
    });
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
    mockSession = {
      user: {
        id: new ObjectId().toString(),
      },
    };
  });

  it("POST, GET, PATCH, DELETE - should handle full budget CRUD and fetch dashboard status", async () => {
    // 1. Create budget
    const postRes = await request(budgetsServer)
      .post("/api/budgets")
      .send({ category: "Food", limit: 200, period: "monthly" })
      .expect(201);
    expect(postRes.body.success).toBe(true);
    const budgetId = postRes.body.data._id;

    // 2. Fetch dashboard
    const dashboardRes = await request(budgetDashboardServer)
      .get("/api/budgets/dashboard")
      .expect(200);
    expect(dashboardRes.body.success).toBe(true);
    expect(dashboardRes.body.data.budgets.length).toBe(1);

    // 3. Update budget
    const patchRes = await request(budgetDetailServer)
      .patch(`/api/budgets/${budgetId}`)
      .send({ limit: 300 })
      .expect(200);
    expect(patchRes.body.data.limit).toBe(300);

    // 4. Delete budget
    await request(budgetDetailServer)
      .delete(`/api/budgets/${budgetId}`)
      .expect(200);

    // Verify it is gone
    const listRes = await request(budgetsServer)
      .get("/api/budgets")
      .expect(200);
    expect(listRes.body.data.length).toBe(0);
  });
});
