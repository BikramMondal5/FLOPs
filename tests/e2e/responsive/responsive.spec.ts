import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LandingPage } from "../pages/LandingPage";
import { OverviewPage } from "../pages/OverviewPage";
import { AccountsPage } from "../pages/AccountsPage";

const VIEWPORTS = [
  { name: "Desktop", width: 1440, height: 900 },
  { name: "Laptop", width: 1280, height: 800 },
  { name: "Tablet", width: 768, height: 1024 },
  { name: "Mobile Large", width: 414, height: 896 },
  { name: "Mobile Small", width: 375, height: 812 },
];

test.describe("Responsive Layout Tests", () => {
  for (const viewport of VIEWPORTS) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      test("landing page renders correctly", async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const landing = new LandingPage(page);
        await landing.goto();
        await landing.assertHeroSectionVisible();
        await page.waitForTimeout(500);
      });

      test("overview page is accessible after login", async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const login = new LoginPage(page);
        await login.goto();
        await login.login("testuser@example.com", "Test@12345");
        await page.waitForURL(/\/overview/, { timeout: 15000 });
        const overview = new OverviewPage(page);
        await overview.assertDashboardVisible();
      });

      test("accounts page renders with data", async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const login = new LoginPage(page);
        await login.goto();
        await login.login("testuser@example.com", "Test@12345");
        await page.waitForURL(/\/overview/, { timeout: 15000 });
        const accounts = new AccountsPage(page);
        await accounts.goto();
        await accounts.assertHeading("Accounts");
        await page.waitForTimeout(500);
      });
    });
  }
});

test.describe("Accessibility Checks", () => {
  test("landing page has accessible navigation", async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
    const links = nav.locator("a");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(links.nth(i)).toBeVisible();
    }
  });

  test("login page has accessible form elements", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const emailInput = page.locator("#login-email");
    const passwordInput = page.locator("#login-password");
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("signup page has labeled form fields", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.waitForLoadState("networkidle");
    const nameInput = page.locator("#signup-name");
    const emailInput = page.locator("#signup-email");
    const passwordInput = page.locator("#signup-password");
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test("form elements have proper labels", async ({ page }) => {
    await page.goto("/auth/login");
    await page.waitForLoadState("networkidle");
    const labels = page.locator("label");
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const labelFor = await labels.nth(i).getAttribute("for");
      if (labelFor) {
        const input = page.locator(`#${labelFor}`);
        await expect(input).toBeVisible();
      }
    }
  });

  test("focus management works on login form", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await page.locator("#login-email").focus();
    await expect(page.locator("#login-email")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#login-password")).toBeFocused();
  });
});
