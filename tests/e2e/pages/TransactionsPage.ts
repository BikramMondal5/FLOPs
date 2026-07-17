import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TransactionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/transactions");
    await this.waitForPageLoad();
  }

  async clickCreateTransaction() {
    const btn = this.page.locator("#top-add-tx");
    if (await btn.isVisible()) {
      await btn.click();
    } else {
      await this.page.locator("#empty-state-create-tx").click();
    }
  }

  async selectAccount(accountName: string) {
    await this.page.locator("#create-tx-account").selectOption({ label: accountName });
  }

  async fillMerchant(merchant: string) {
    await this.page.locator("#create-tx-merchant").fill(merchant);
  }

  async selectCategory(category: string) {
    await this.page.locator("#create-tx-category").selectOption(category);
  }

  async selectPaymentMethod(method: string) {
    await this.page.locator("#create-tx-payment").selectOption(method);
  }

  async fillAmount(amount: string) {
    await this.page.locator("#create-tx-amount").fill(amount);
  }

  async fillDate(date: string) {
    await this.page.locator("#create-tx-date").fill(date);
  }

  async fillNotes(notes: string) {
    await this.page.locator("#create-tx-notes").fill(notes);
  }

  async submitCreateTransaction() {
    await this.page.locator("#submit-create-tx").click();
    await this.waitForAnimations();
    await this.waitForPageLoad();
  }

  async createIncome(accountName: string, merchant: string, amount: string) {
    await this.clickCreateTransaction();
    await this.page.getByRole("button", { name: /income/i }).click();
    await this.selectAccount(accountName);
    await this.fillMerchant(merchant);
    await this.selectCategory("Salary");
    await this.selectPaymentMethod("Bank Transfer");
    await this.fillAmount(amount);
    await this.fillDate(new Date().toISOString().split("T")[0]);
    await this.submitCreateTransaction();
  }

  async createExpense(accountName: string, merchant: string, amount: string) {
    await this.clickCreateTransaction();
    await this.page.getByRole("button", { name: /expense/i }).click();
    await this.selectAccount(accountName);
    await this.fillMerchant(merchant);
    await this.selectCategory("Food & Dining");
    await this.selectPaymentMethod("UPI");
    await this.fillAmount(amount);
    await this.fillDate(new Date().toISOString().split("T")[0]);
    await this.submitCreateTransaction();
  }

  async assertTransactionVisible(merchant: string) {
    await expect(this.page.getByText(merchant).first()).toBeVisible();
  }

  async filterByType(type: string) {
    await this.page.locator("button").filter({ hasText: type }).first().click();
    await this.waitForAnimations();
  }

  async searchTransactions(query: string) {
    const searchInput = this.page.locator("input[placeholder*='search' i], input[placeholder*='Search' i]").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(query);
      await this.page.waitForTimeout(500);
    }
  }

  async clickPaginationNext() {
    const nextBtn = this.page.getByRole("button", { name: /next|›/i }).first();
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await this.waitForPageLoad();
    }
  }

  async assertEmptyState() {
    await expect(this.page.getByText(/no transaction|no record|empty/i).first()).toBeVisible();
  }

  async clickEditTransaction(merchant: string) {
    const card = this.page.locator(`text="${merchant}"`).locator("..");
    const editBtn = card.locator("button").filter({ has: this.page.locator("svg.lucide-pencil") });
    if (await editBtn.isVisible()) {
      await editBtn.click();
    }
  }
}
