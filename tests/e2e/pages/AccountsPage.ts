import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/accounts");
    await this.waitForPageLoad();
  }

  async clickCreateAccount() {
    const btn = this.page.locator("#open-create-account");
    if (await btn.isVisible()) {
      await btn.click();
    } else {
      await this.page.locator("#empty-state-create").click();
    }
  }

  async fillAccountName(name: string) {
    await this.page.locator("#create-account-name").fill(name);
  }

  async fillAccountInstitution(institution: string) {
    await this.page.locator("#create-account-institution").fill(institution);
  }

  async selectAccountType(type: string) {
    await this.page.locator("#create-account-type").selectOption(type);
  }

  async selectCurrency(currency: string) {
    await this.page.locator("#create-account-currency").selectOption(currency);
  }

  async fillBalance(balance: string) {
    await this.page.locator("#create-account-balance").fill(balance);
  }

  async submitCreateAccount() {
    await this.page.locator("#submit-create-account").click();
    await this.waitForAnimations();
  }

  async createAccount(name: string, type: string, balance: string) {
    await this.clickCreateAccount();
    await this.fillAccountName(name);
    await this.selectAccountType(type);
    await this.fillBalance(balance);
    await this.submitCreateAccount();
    await this.waitForPageLoad();
  }

  async searchAccounts(query: string) {
    await this.page.locator("#accounts-search").fill(query);
    await this.page.waitForTimeout(500);
  }

  async selectSort(sort: string) {
    await this.page.locator("#accounts-sort").selectOption(sort);
    await this.page.waitForTimeout(500);
  }

  async toggleFilters() {
    await this.page.locator("#toggle-filters").click();
  }

  async assertAccountVisible(name: string) {
    await expect(this.page.getByText(name).first()).toBeVisible();
  }

  async assertAccountCount(count: number) {
    const text = this.page.locator("text=/\\d+ account/");
    await expect(text).toBeVisible();
  }

  async clickEditAccount(name: string) {
    const card = this.page.locator(`text="${name}"`).locator("..");
    await card.locator("button").filter({ has: this.page.locator("svg.lucide-pencil") }).click();
  }

  async clickArchiveAccount(name: string) {
    const card = this.page.locator(`text="${name}"`).locator("..");
    await card.locator("button").filter({ has: this.page.locator("svg.lucide-archive") }).click();
  }
}
