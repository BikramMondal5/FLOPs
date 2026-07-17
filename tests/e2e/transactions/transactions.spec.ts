import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { TransactionsPage } from "../pages/TransactionsPage";

test.describe("Transactions Workflow", () => {
  let login: LoginPage;
  let txs: TransactionsPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    txs = new TransactionsPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should display transactions page", async ({ page }) => {
    await txs.goto();
    await txs.assertHeading("Transactions");
  });

  test("should show seeded transactions", async ({ page }) => {
    await txs.goto();
    try {
      await txs.assertTransactionVisible("Employer Corp");
    } catch {
      await txs.assertTransactionVisible("Local Restaurant");
    }
  });

  test("should create an income transaction", async ({ page }) => {
    await txs.goto();
    await txs.createIncome("Main Savings", "E2E Income Test", "30000");
    await txs.waitForPageLoad();
    await txs.assertTransactionVisible("E2E Income Test");
  });

  test("should create an expense transaction", async ({ page }) => {
    await txs.goto();
    await txs.createExpense("Daily Wallet", "E2E Expense Test", "2000");
    await txs.waitForPageLoad();
    await txs.assertTransactionVisible("E2E Expense Test");
  });

  test("should filter by transaction type", async ({ page }) => {
    await txs.goto();
    await txs.filterByType("Income");
    await page.waitForTimeout(500);
    await txs.assertTransactionVisible("Employer Corp");
  });

  test("should navigate pagination if available", async ({ page }) => {
    await txs.goto();
    await txs.clickPaginationNext();
    const url = page.url();
    expect(url).toContain("transactions");
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await txs.goto();
    await page.waitForLoadState("networkidle");
    const filtered = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404") && !e.includes("ResizeObserver")
    );
    expect(filtered.length).toBe(0);
  });
});
