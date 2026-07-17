import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AccountsPage } from "../pages/AccountsPage";

test.describe("Accounts Workflow", () => {
  let login: LoginPage;
  let accounts: AccountsPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    accounts = new AccountsPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should display accounts page for authenticated user", async ({ page }) => {
    await accounts.goto();
    await accounts.assertHeading("Accounts");
  });

  test("should show seeded accounts", async ({ page }) => {
    await accounts.goto();
    await accounts.assertAccountVisible("Main Savings");
    await accounts.assertAccountVisible("Daily Wallet");
  });

  test("should create a new account", async ({ page }) => {
    await accounts.goto();
    await accounts.createAccount("E2E Test Savings", "Savings", "10000");
    await accounts.waitForPageLoad();
    await accounts.assertAccountVisible("E2E Test Savings");
  });

  test("should search accounts", async ({ page }) => {
    await accounts.goto();
    await accounts.searchAccounts("Main Savings");
    await accounts.assertAccountVisible("Main Savings");
  });

  test("should sort accounts", async ({ page }) => {
    await accounts.goto();
    await accounts.selectSort("alphabetical");
    await accounts.waitForAnimations();
    await accounts.assertAccountVisible("Main Savings");
  });

  test("should toggle filters", async ({ page }) => {
    await accounts.goto();
    await accounts.toggleFilters();
    await page.waitForTimeout(300);
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await accounts.goto();
    await page.waitForLoadState("networkidle");
    const filtered = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("ResizeObserver")
    );
    expect(filtered.length).toBe(0);
  });
});
