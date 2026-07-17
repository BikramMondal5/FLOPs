import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AIInsightsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/ai-insights");
    await this.waitForPageLoad();
  }

  async assertDashboardVisible() {
    await expect(this.page.getByText(/ai financial|financial intelligence/i).first()).toBeVisible();
  }

  async assertFinancialSummaryVisible() {
    await expect(this.page.getByText(/executive|stance|actionable/i).first()).toBeVisible();
  }

  async assertRecommendationsVisible() {
    await expect(this.page.getByText(/recommendation/i).first()).toBeVisible();
  }

  async assertRiskAssessmentVisible() {
    await expect(this.page.getByText(/risk/i).first()).toBeVisible();
  }

  async assertChatVisible() {
    await expect(this.page.getByText(/personal assistant/i).first()).toBeVisible();
  }

  async sendChatMessage(message: string) {
    const input = this.page.locator("input[placeholder*='ask ai' i], input[placeholder*='assistant' i]");
    await input.fill(message);
    await this.page.getByRole("button").filter({ has: this.page.locator("svg.lucide-send") }).click();
    await this.page.waitForTimeout(2000);
  }

  async assertChatResponse() {
    await expect(this.page.getByText(/flops ai|assistant|based on|hello/i).first()).toBeVisible();
  }

  async clickSuggestedPrompt(prompt: string) {
    await this.page.getByRole("button", { name: prompt }).click();
    await this.page.waitForTimeout(2000);
  }

  async assertAchievementsVisible() {
    await expect(this.page.getByText(/achievement|key.*achievement/i).first()).toBeVisible();
  }
}
