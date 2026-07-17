import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ReportsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/overview");
    await this.waitForPageLoad();
  }

  async navigateToReports() {
    const sidebarLink = this.page.locator("a").filter({ hasText: /report/i }).first();
    if (await sidebarLink.isVisible()) {
      await sidebarLink.click();
    }
  }

  async assertReportDashboardVisible() {
    await expect(this.page.locator("text=/report|dashboard/i").first()).toBeVisible();
  }

  async downloadCSV() {
    const csvBtn = this.page.getByRole("button", { name: /csv|export csv/i });
    if (await csvBtn.isVisible()) {
      await csvBtn.click();
    } else {
      await this.page.goto("/api/export/csv?format=csv");
    }
  }

  async downloadJSON() {
    const jsonBtn = this.page.getByRole("button", { name: /json|export json/i });
    if (await jsonBtn.isVisible()) {
      await jsonBtn.click();
    } else {
      await this.page.goto("/api/export/csv?format=json");
    }
  }

  async selectPeriod(period: string) {
    const select = this.page.locator("select").first();
    if (await select.isVisible()) {
      await select.selectOption(period);
      await this.waitForAnimations();
    }
  }

  async assertExportAvailable() {
    const hasBtn = await this.page.getByRole("button", { name: /csv|json|export/i }).first().isVisible().catch(() => false);
    const hasLink = await this.page.locator("a").filter({ hasText: /csv|json|export/i }).first().isVisible().catch(() => false);
    expect(hasBtn || hasLink).toBeTruthy();
  }
}
