import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";

test.describe("Profile Workflow", () => {
  let login: LoginPage;
  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    profile = new ProfilePage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should display profile page", async () => {
    await profile.goto();
    await profile.assertProfileHeadingVisible();
  });

  test("should display profile hero section", async () => {
    await profile.goto();
    await profile.assertProfileHeroVisible();
  });

  test("should display personal info tab", async () => {
    await profile.goto();
    await profile.assertPersonalInfoTab();
  });

  test("should navigate to financial tab", async () => {
    await profile.goto();
    await profile.clickTab("Financial");
    await profile.assertFinancialInfoVisible();
  });

  test("should navigate to security tab", async () => {
    await profile.goto();
    await profile.clickTab("Security");
    await profile.assertSecuritySettingsVisible();
  });

  test("should navigate to appearance tab", async () => {
    await profile.goto();
    await profile.clickTab("Appearance");
    await profile.assertAppearanceSettingsVisible();
  });

  test("should navigate to activity tab", async () => {
    await profile.goto();
    await profile.clickTab("Activity");
    await profile.assertActivityTimelineVisible();
  });

  test("should display user avatar", async () => {
    await profile.goto();
    await profile.assertUserAvatarVisible();
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await profile.goto();
    await page.waitForLoadState("networkidle");
    const filtered = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("ResizeObserver")
    );
    expect(filtered.length).toBe(0);
  });
});
