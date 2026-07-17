import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/profile");
    await this.waitForPageLoad();
  }

  async assertProfileHeadingVisible() {
    await expect(this.page.getByRole("heading", { name: /profile/i })).toBeVisible();
  }

  async assertProfileHeroVisible() {
    await expect(this.page.getByText(/personal|information|settings/i).first()).toBeVisible();
  }

  async assertPersonalInfoTab() {
    await expect(this.page.getByRole("button", { name: /personal info/i })).toBeVisible();
  }

  async clickTab(tabName: string) {
    await this.page.getByRole("button", { name: tabName }).click();
    await this.waitForAnimations();
  }

  async assertFinancialInfoVisible() {
    await expect(this.page.getByText(/financial preferences|financial info/i).first()).toBeVisible();
  }

  async assertSecuritySettingsVisible() {
    await expect(this.page.getByText(/security settings/i).first()).toBeVisible();
  }

  async assertAppearanceSettingsVisible() {
    await expect(this.page.getByText(/appearance|theme/i).first()).toBeVisible();
  }

  async assertActivityTimelineVisible() {
    await expect(this.page.getByText(/activity|account activity/i).first()).toBeVisible();
  }

  async assertUserAvatarVisible() {
    const avatar = this.page.locator("img[alt*='logo'], div.rounded-full").first();
    await expect(avatar).toBeVisible();
  }

  async clickSaveChanges() {
    await this.page.getByRole("button", { name: /save changes/i }).click();
  }

  async clickEditProfile() {
    await this.page.getByRole("button", { name: /edit profile/i }).click();
  }

  async openAIAssistant() {
    const brainBtn = this.page.locator("button").filter({ has: this.page.locator("svg.lucide-brain") });
    if (await brainBtn.isVisible()) {
      await brainBtn.click();
      await this.waitForAnimations();
    }
  }
}
