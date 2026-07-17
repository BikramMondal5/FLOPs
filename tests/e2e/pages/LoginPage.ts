import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/auth/login");
    await this.waitForPageLoad();
  }

  async fillEmail(email: string) {
    await this.page.locator("#login-email").fill(email);
  }

  async fillPassword(password: string) {
    await this.page.locator("#login-password").fill(password);
  }

  async clickSignIn() {
    await this.page.getByRole("button", { name: /sign in/i }).click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
    await this.page.waitForURL(/\/overview|\/auth\/login/);
    await this.waitForAnimations();
  }

  async assertErrorVisible() {
    await expect(this.page.getByText(/invalid|error|failed/i)).toBeVisible();
  }

  async assertLoginFormVisible() {
    await expect(this.page.getByText(/sign in/i)).toBeVisible();
  }

  async clickForgotPassword() {
    await this.page.getByRole("link", { name: /forgot password/i }).click();
  }

  async clickCreateAccount() {
    await this.page.getByRole("link", { name: /create account/i }).click();
  }

  async fillLoginForm(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  async submitLogin() {
    await this.clickSignIn();
  }
}
