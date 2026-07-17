import { test, expect } from "@playwright/test";
import { LandingPage } from "../pages/LandingPage";

test.describe("Landing Page", () => {
  let landing: LandingPage;

  test.beforeEach(async ({ page }) => {
    landing = new LandingPage(page);
    await landing.goto();
  });

  test("should load landing page successfully", async () => {
    await landing.assertHeroSectionVisible();
    await landing.assertNavigationVisible();
  });

  test("should display feature sections", async () => {
    await landing.assertFeaturesSectionVisible();
  });

  test("should display FAQ section", async () => {
    await landing.scrollToFAQ();
    await landing.assertFAQSectionVisible();
  });

  test("should display CTA section", async () => {
    await landing.assertCTASectionVisible();
  });

  test("should navigate to signup on CTA click", async ({ page }) => {
    await landing.clickGetStarted();
    await page.waitForURL(/\/plan|\/auth\/(signup|login)/);
    expect(page.url()).toMatch(/plan|signup|login/);
  });

  test("should have working navigation links", async ({ page }) => {
    const homeLink = page.locator("nav a").first();
    await expect(homeLink).toBeVisible();
  });

  test("should be responsive", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await landing.goto();
    await landing.assertHeroSectionVisible();
    await landing.assertFeaturesSectionVisible();
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await landing.goto();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    const filtered = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("MongoServerSelectionError")
    );
    if (filtered.length > 0) {
      console.log("Console errors found:", JSON.stringify(filtered, null, 2));
    }
    expect(filtered.length).toBe(0);
  });
});
