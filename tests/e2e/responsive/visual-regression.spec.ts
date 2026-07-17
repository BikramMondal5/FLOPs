import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { LandingPage } from "../pages/LandingPage";
import { OverviewPage } from "../pages/OverviewPage";
import { AccountsPage } from "../pages/AccountsPage";
import * as fs from "fs";
import * as path from "path";

const SCREENSHOT_DIR = "tests/e2e/screenshots";

test.describe("Visual Stability Checks", () => {
  test.beforeAll(() => {
    const dir = path.join(process.cwd(), SCREENSHOT_DIR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  test("capture landing page screenshot", async ({ page }) => {
    const landing = new LandingPage(page);
    await landing.goto();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/landing-page.png`, fullPage: true });
  });

  test("capture overview screenshot", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/overview-dashboard.png`, fullPage: true });
  });

  test("capture accounts screenshot", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    const accounts = new AccountsPage(page);
    await accounts.goto();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/accounts-page.png`, fullPage: true });
  });

  test("capture transactions screenshot", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    await page.goto("/transactions");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/transactions-page.png`, fullPage: true });
  });

  test("capture budget screenshot", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    await page.goto("/budget");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/budget-page.png`, fullPage: true });
  });

  test("capture goals screenshot", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    await page.goto("/goals");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/goals-page.png`, fullPage: true });
  });

  test("capture AI insights screenshot", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    await page.goto("/ai-insights");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/ai-insights-page.png`, fullPage: true });
  });

  test("capture profile screenshot", async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/profile-page.png`, fullPage: true });
  });
});
