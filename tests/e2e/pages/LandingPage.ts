import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/");
    await this.waitForPageLoad();
  }

  async assertHeroSectionVisible() {
    await expect(this.page.locator("section").first()).toBeVisible();
  }

  async assertNavigationVisible() {
    await expect(this.page.getByRole("navigation").first()).toBeVisible();
  }

  async clickGetStarted() {
    await this.page.getByRole("link", { name: /get started/i }).first().click();
  }

  async clickLearnMore() {
    await this.page.getByRole("link", { name: /learn more/i }).first().click();
  }

  async navigateToSignup() {
    await this.page.getByRole("link", { name: /sign.?up|create account|get started/i }).first().click();
  }

  async navigateToLogin() {
    await this.page.getByRole("link", { name: /sign.?in|log.?in/i }).first().click();
  }

  async assertFeaturesSectionVisible() {
    await expect(this.page.getByText(/ai.?powered|smart budget|goal.?based/i).first()).toBeVisible();
  }

  async assertFAQSectionVisible() {
    await expect(this.page.getByText(/frequently asked|faq/i).first()).toBeVisible();
  }

  async assertCTASectionVisible() {
    await expect(this.page.getByText(/ready to|get started|start your/i).first()).toBeVisible();
  }

  async scrollToFeatures() {
    await this.page.getByText(/features|how it works/i).first().scrollIntoViewIfNeeded();
  }

  async scrollToFAQ() {
    await this.page.getByText(/faq|frequently asked/i).first().scrollIntoViewIfNeeded();
  }
}
