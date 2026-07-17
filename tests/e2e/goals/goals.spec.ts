import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { GoalsPage } from "../pages/GoalsPage";

test.describe("Goals Workflow", () => {
  let login: LoginPage;
  let goals: GoalsPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    goals = new GoalsPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should display goals page", async ({ page }) => {
    await goals.goto();
    await goals.assertHeading("Financial Goals");
  });

  test("should display seeded goals", async () => {
    await goals.goto();
    await goals.assertGoalVisible("Emergency Fund");
    await goals.assertGoalVisible("New Laptop");
  });

  test("should display summary section", async () => {
    await goals.goto();
    await goals.assertSummaryVisible();
  });

  test("should display recommendations section", async () => {
    await goals.goto();
    await goals.assertRecommendationsVisible();
  });

  test("should open create goal modal", async () => {
    await goals.goto();
    await goals.clickCreateGoal();
    await goals.page.waitForTimeout(500);
    await goals.clickCreateGoal();
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await goals.goto();
    await page.waitForLoadState("networkidle");
    const filtered = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("ResizeObserver")
    );
    expect(filtered.length).toBe(0);
  });
});
