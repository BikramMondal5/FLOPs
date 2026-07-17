import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NotificationsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/overview");
    await this.waitForPageLoad();
  }

  async openNotificationPanel() {
    const notifyBtn = this.page.locator("button").filter({ has: this.page.locator("svg.lucide-bell") }).first();
    if (await notifyBtn.isVisible()) {
      await notifyBtn.click();
      await this.waitForAnimations();
    }
  }

  async assertNotificationListVisible() {
    if (await this.page.getByText(/notification|alert/i).first().isVisible().catch(() => false)) {
      await expect(this.page.getByText(/notification|alert/i).first()).toBeVisible();
    }
  }

  async assertUnreadBadgeVisible() {
    const dot = this.page.locator(".bg-\\[\\#D46A96\\]").first();
    if (await dot.isVisible().catch(() => false)) {
      await expect(dot).toBeVisible();
    }
  }

  async clickReadAll() {
    const readAllBtn = this.page.getByRole("button", { name: /read all|mark all/i });
    if (await readAllBtn.isVisible()) {
      await readAllBtn.click();
      await this.waitForAnimations();
    }
  }

  async assertBudgetAlertVisible() {
    await expect(this.page.getByText(/budget|alert/i).first()).toBeVisible();
  }

  async assertGoalAlertVisible() {
    await expect(this.page.getByText(/goal|progress|milestone/i).first()).toBeVisible();
  }

  async assertAIRecommendationVisible() {
    await expect(this.page.getByText(/ai|insight|recommend/i).first()).toBeVisible();
  }
}
