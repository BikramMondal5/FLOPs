import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async waitForSelector(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async screenshot(name: string) {
    await this.page.screenshot({
      path: `tests/e2e/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  async getByTestId(id: string): Promise<Locator> {
    return this.page.locator(`#${id}`);
  }

  async clickByTestId(id: string) {
    await this.page.locator(`#${id}`).click();
  }

  async clickByText(text: string, options?: { exact?: boolean }) {
    await this.page.getByText(text, options).click();
  }

  async fillByTestId(id: string, value: string) {
    await this.page.locator(`#${id}`).fill(value);
  }

  async selectByTestId(id: string, value: string) {
    await this.page.locator(`#${id}`).selectOption(value);
  }

  async isVisibleByTestId(id: string): Promise<boolean> {
    return this.page.locator(`#${id}`).isVisible();
  }

  async getTextByTestId(id: string): Promise<string> {
    return this.page.locator(`#${id}`).innerText();
  }

  async checkConsoleErrors() {
    const errors: string[] = [];
    this.page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    return errors;
  }

  async checkFailedRequests() {
    const failed: string[] = [];
    this.page.on("response", (response) => {
      if (!response.ok() && response.status() >= 400) {
        failed.push(`${response.url()} (${response.status()})`);
      }
    });
    return failed;
  }

  async waitForAnimations() {
    await this.page.waitForTimeout(1000);
  }

  async assertHeading(text: string) {
    await expect(this.page.getByRole("heading", { name: text })).toBeVisible();
  }

  async assertTextVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async assertElementVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }
}
