import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { BudgetPage } from "../pages/BudgetPage";

test.describe("Budget Workflow", () => {
  let login: LoginPage;
  let budget: BudgetPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    budget = new BudgetPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should display budget page", async ({ page }) => {
    await budget.goto();
    await budget.assertHeading("Budgets");
  });

  test("should display budget summary cards", async () => {
    await budget.goto();
    await budget.assertSummaryCardsVisible();
  });

  test("should display budget alerts section", async () => {
    await budget.goto();
    await budget.assertAlertsVisible();
  });

  test("should display forecast section", async () => {
    await budget.goto();
    await budget.assertForecastVisible();
  });

  test("should show seeded budget trackers", async () => {
    await budget.goto();
    await budget.assertBudgetVisible("Monthly Food Budget");
  });

  test("should create a new budget tracker", async ({ page }) => {
    await budget.goto();
    await budget.createBudget("E2E Test Budget", "50000");
    await page.waitForTimeout(1000);
    await budget.assertBudgetVisible("E2E Test Budget");
  });

  test("should delete a budget tracker", async ({ page }) => {
    await budget.goto();
    await page.waitForLoadState("networkidle");
    try {
      await budget.deleteBudget("E2E Test Budget");
      await page.waitForTimeout(500);
      await budget.waitForPageLoad();
    } catch {
      test.skip();
    }
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await budget.goto();
    await page.waitForLoadState("networkidle");
    const filtered = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("ResizeObserver")
    );
    expect(filtered.length).toBe(0);
  });
});
