import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/auth/signup");
    await this.waitForPageLoad();
  }

  async fillName(name: string) {
    await this.page.locator("#signup-name").fill(name);
  }

  async fillEmail(email: string) {
    await this.page.locator("#signup-email").fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator("#signup-password").fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.page.locator("#signup-confirm").fill(password);
  }

  async clickCreateAccount() {
    await this.page.getByRole("button", { name: /create account/i }).click();
  }

  async signup(name: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.clickCreateAccount();
    await this.waitForAnimations();
  }

  async assertSignupFormVisible() {
    await expect(this.page.getByText(/create account|start your financial journey/i)).toBeVisible();
  }

  async assertErrorVisible() {
    await expect(this.page.getByText(/error|failed|invalid/i)).toBeVisible();
  }

  async clickSignIn() {
    await this.page.getByRole("link", { name: /sign in/i }).click();
  }
}
