import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET as getGoals, POST as postGoal } from "@/app/api/goals/route";
import { GET as getGoalDashboard } from "@/app/api/goals/dashboard/route";
import { PATCH as patchGoal, DELETE as deleteGoal } from "@/app/api/goals/[id]/route";
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

describe("API Routes: /api/goals", () => {
  let db: any;
  let goalsServer: any;
  let goalDashboardServer: any;
  let goalDetailServer: any;

  beforeAll(async () => {
    db = await connect();
    goalsServer = createRouteServer({ GET: getGoals, POST: postGoal });
    goalDashboardServer = createRouteServer({ GET: getGoalDashboard });
    goalDetailServer = createRouteServer({
      PATCH: patchGoal,
      DELETE: deleteGoal,
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

  it("POST, GET, PATCH, DELETE - should handle full goal CRUD and fetch dashboard status", async () => {
    // 1. Create goal
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + 2);

    const postRes = await request(goalsServer)
      .post("/api/goals")
      .send({
        name: "New Laptop",
        targetAmount: 50000,
        currentAmount: 5000,
        category: "Electronics",
        targetDate: targetDate.toISOString(),
      })
      .expect(201);
    expect(postRes.body.success).toBe(true);
    const goalId = postRes.body.data._id;

    // 2. Fetch dashboard
    const dashboardRes = await request(goalDashboardServer)
      .get("/api/goals/dashboard")
      .expect(200);
    expect(dashboardRes.body.success).toBe(true);
    expect(dashboardRes.body.data.goals.length).toBe(1);

    // 3. Update goal
    const patchRes = await request(goalDetailServer)
      .patch(`/api/goals/${goalId}`)
      .send({ currentAmount: 6000 })
      .expect(200);
    expect(patchRes.body.data.currentAmount).toBe(6000);

    // 4. Delete goal
    await request(goalDetailServer)
      .delete(`/api/goals/${goalId}`)
      .expect(200);

    // Verify it is gone
    const listRes = await request(goalsServer)
      .get("/api/goals")
      .expect(200);
    expect(listRes.body.data.length).toBe(0);
  });
});
