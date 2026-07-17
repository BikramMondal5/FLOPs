import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AIInsightsPage } from "../pages/AIInsightsPage";

test.describe("AI Workflow", () => {
  let login: LoginPage;
  let ai: AIInsightsPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    ai = new AIInsightsPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should display AI insights page", async () => {
    await ai.goto();
    await ai.assertDashboardVisible();
  });

  test("should display financial summary", async () => {
    await ai.goto();
    await ai.assertFinancialSummaryVisible();
  });

  test("should display recommendations", async () => {
    await ai.goto();
    await ai.assertRecommendationsVisible();
  });

  test("should display risk assessments", async () => {
    await ai.goto();
    await ai.assertRiskAssessmentVisible();
  });

  test("should display chat interface", async () => {
    await ai.goto();
    await ai.assertChatVisible();
  });

  test("should send chat message and receive response", async ({ page }) => {
    await ai.goto();
    await ai.sendChatMessage("How can I save more?");
    await ai.assertChatResponse();
  });

  test("should click suggested prompts", async ({ page }) => {
    await ai.goto();
    await page.waitForTimeout(1000);
    const prompts = page.locator("button").filter({ hasText: /save|track|laptop|spend/i });
    if ((await prompts.count()) > 0) {
      await prompts.first().click();
      await page.waitForTimeout(2000);
      await ai.assertChatResponse();
    }
  });

  test("should display achievements section", async () => {
    await ai.goto();
    await ai.assertAchievementsVisible();
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await ai.goto();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    const filtered = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("ResizeObserver") && !e.includes("Failed to load")
    );
    expect(filtered.length).toBe(0);
  });
});
