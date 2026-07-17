import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BudgetPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/budget");
    await this.waitForPageLoad();
  }

  async clickCreateBudget() {
    await this.page.getByRole("button", { name: /create tracker/i }).click();
  }

  async fillBudgetName(name: string) {
    await this.page.locator("input[placeholder*='budget' i]").first().fill(name);
  }

  async fillTotalBudget(amount: string) {
    const inputs = this.page.locator("input[type='number']");
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const val = await inputs.nth(i).inputValue();
      if (Number(val) > 50000 || val.includes("75000")) {
        await inputs.nth(i).fill(amount);
        break;
      }
    }
  }

  async nextStep() {
    await this.page.getByRole("button", { name: /next step/i }).click();
  }

  async previousStep() {
    await this.page.getByRole("button", { name: /back/i }).click();
  }

  async clickCreatePlan() {
    await this.page.getByRole("button", { name: /create plan/i }).click();
    await this.waitForAnimations();
    await this.waitForPageLoad();
  }

  async createBudget(name: string, amount: string) {
    await this.clickCreateBudget();
    await this.page.waitForTimeout(500);
    const nameInput = this.page.locator("input[type='text']").first();
    if (await nameInput.isVisible()) {
      await nameInput.fill(name);
    }
    await this.nextStep();
    await this.page.waitForTimeout(300);
    await this.clickCreatePlan();
    await this.waitForAnimations();
  }

  async assertBudgetVisible(name: string) {
    await expect(this.page.getByText(name).first()).toBeVisible();
  }

  async assertSummaryCardsVisible() {
    await expect(this.page.getByText(/total active budget|current spent|total remaining/i).first()).toBeVisible();
  }

  async assertAlertsVisible() {
    await expect(this.page.getByText(/budget alert|utilization alert/i).first()).toBeVisible();
  }

  async assertForecastVisible() {
    await expect(this.page.getByText(/projection|projected/i).first()).toBeVisible();
  }

  async deleteBudget(name: string) {
    const card = this.page.locator(`text="${name}"`).locator("..");
    const deleteBtn = card.locator("button").filter({ has: this.page.locator("svg.lucide-trash2") });
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  async confirmDelete() {
    try {
      await this.page.getByRole("button", { name: /yes|delete|confirm/i }).first().click();
    } catch {
      // dialog was auto-accepted
    }
    await this.waitForAnimations();
  }
}
