import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class GoalsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/goals");
    await this.waitForPageLoad();
  }

  async clickCreateGoal() {
    await this.page.getByRole("button", { name: /create goal/i }).first().click();
  }

  async fillGoalName(name: string) {
    const input = this.page.locator("input[placeholder*='goal' i], input[type='text']").first();
    await input.fill(name);
  }

  async selectCategory(category: string) {
    const select = this.page.locator("select").first();
    await select.selectOption(category);
  }

  async fillTargetAmount(amount: string) {
    const inputs = this.page.locator("input[type='number']");
    await inputs.first().fill(amount);
  }

  async nextStep() {
    await this.page.getByRole("button", { name: /next step/i }).click();
  }

  async previousStep() {
    await this.page.getByRole("button", { name: /back/i }).click();
  }

  async clickSubmitGoal() {
    await this.page.getByRole("button", { name: /create goal$/i }).click();
    await this.waitForAnimations();
    await this.waitForPageLoad();
  }

  async createGoal(name: string, category: string, targetAmount: string) {
    await this.clickCreateGoal();
    await this.page.waitForTimeout(500);
    await this.fillGoalName(name);
    await this.selectCategory(category);
    await this.nextStep();
    await this.page.waitForTimeout(300);
    await this.fillTargetAmount(targetAmount);
    await this.nextStep();
    await this.page.waitForTimeout(300);
    await this.clickSubmitGoal();
    await this.waitForAnimations();
  }

  async assertGoalVisible(name: string) {
    await expect(this.page.getByText(name).first()).toBeVisible();
  }

  async assertSummaryVisible() {
    await expect(this.page.getByText(/active goal|target|saved|completion/i).first()).toBeVisible();
  }

  async assertRecommendationsVisible() {
    await expect(this.page.getByText(/recommendation|goal.*recommend/i).first()).toBeVisible();
  }

  async clickAddMoney(name: string, amount: string = "5000") {
    const card = this.page.locator(`text="${name}"`).locator("..");
    const addBtn = card.locator("button").filter({ hasText: /add|₹|\+|contribute/i });
    if (await addBtn.isVisible()) {
      await addBtn.first().click();
    }
  }

  async deleteGoal(name: string) {
    const card = this.page.locator(`text="${name}"`).locator("..");
    const deleteBtn = card.locator("button").filter({ has: this.page.locator("svg.lucide-trash2") });
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  async viewGoalDetails(name: string) {
    await this.page.getByText(name).first().click();
    await this.waitForAnimations();
  }
}
