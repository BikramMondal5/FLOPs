import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OverviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/overview");
    await this.waitForPageLoad();
  }

  async assertDashboardVisible() {
    await expect(this.page.getByText(/overview/i).first()).toBeVisible();
  }

  async assertSummaryCardsVisible() {
    await expect(this.page.getByText(/net worth|monthly spending|savings rate|daily average/i).first()).toBeVisible();
  }

  async assertChartsVisible() {
    await expect(this.page.getByText(/spending|breakdown|trends/i).first()).toBeVisible();
  }

  async assertRecentTransactionsVisible() {
    await expect(this.page.getByText(/recent transaction|recent ledger/i).first()).toBeVisible();
  }

  async assertQuickActionsVisible() {
    await expect(this.page.getByText(/quick actions/i).first()).toBeVisible();
  }

  async assertFinancialHealthVisible() {
    await expect(this.page.getByText(/financial health/i).first()).toBeVisible();
  }

  async assertRuleInsightsVisible() {
    await expect(this.page.getByText(/rule.?based insight/i).first()).toBeVisible();
  }

  async assertNotificationBadgeVisible() {
    const badge = this.page.locator("button").filter({ has: this.page.locator(".bg-\\[\\#D46A96\\]") }).first();
    await expect(badge).toBeVisible();
  }

  async navigateToAccounts() {
    await this.page.getByRole("link", { name: /my accounts/i }).click();
  }

  async openSidebar() {
    await this.page.getByRole("button").filter({ has: this.page.locator("svg.lucide-menu") }).first().click();
  }
}
