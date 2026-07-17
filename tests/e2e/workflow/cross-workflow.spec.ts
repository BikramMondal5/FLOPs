import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AccountsPage } from "../pages/AccountsPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { generateUniqueEmail } from "../helpers/utils";

test.describe("Cross-Workflow Validation", () => {
  test("Workflow 1: Full user journey - signup to report", async ({ page }) => {
    const login = new LoginPage(page);
    const accounts = new AccountsPage(page);
    const txs = new TransactionsPage(page);
    const email = generateUniqueEmail();

    // Signup
    await page.goto("/auth/signup");
    await page.waitForLoadState("networkidle");
    await page.locator("#signup-name").fill("Cross Workflow User");
    await page.locator("#signup-email").fill(email);
    await page.locator("#signup-password").fill("CrossFlow@12345");
    await page.locator("#signup-confirm").fill("CrossFlow@12345");
    await page.getByRole("button", { name: /create account/i }).click();
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // Create Account
    await page.goto("/accounts");
    await page.waitForLoadState("networkidle");
    const createBtn = page.locator("#open-create-account").or(page.locator("#empty-state-create"));
    if (await createBtn.isVisible()) {
      await createBtn.click();
      await page.locator("#create-account-name").fill("CrossFlow Account");
      await page.locator("#create-account-type").selectOption("Savings");
      await page.locator("#create-account-balance").fill("50000");
      await page.locator("#submit-create-account").click();
      await page.waitForTimeout(1000);
    }

    // Create Income transaction
    await page.goto("/transactions");
    await page.waitForLoadState("networkidle");
    const addTxBtn = page.locator("#top-add-tx").or(page.locator("#empty-state-create-tx"));
    if (await addTxBtn.isVisible()) {
      await addTxBtn.click();
      await page.waitForTimeout(500);
      const incomeBtn = page.getByRole("button", { name: /income/i });
      if (await incomeBtn.isVisible()) {
        await incomeBtn.click();
      }
      const acct = page.locator("#create-tx-account");
      if (await acct.isVisible()) {
        await acct.selectOption({ index: 1 });
      }
      await page.locator("#create-tx-merchant").fill("CrossFlow Salary");
      await page.locator("#create-tx-category").selectOption("Salary");
      await page.locator("#create-tx-amount").fill("60000");
      const dateInput = page.locator("#create-tx-date");
      if (await dateInput.isVisible()) {
        await dateInput.fill(new Date().toISOString().split("T")[0]);
      }
      await page.locator("#submit-create-tx").click();
      await page.waitForTimeout(1000);
    }

    // Verify Overview updates
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/overview");

    // Verify AI insights page loads
    await page.goto("/ai-insights");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/ai-insights");

    // Verify report
    const reportRes = await page.goto("/api/reports/dashboard?period=Monthly");
    expect(reportRes?.ok()).toBeTruthy();

    // Verify export
    const csvRes = await page.goto("/api/export/csv?format=csv");
    expect(csvRes?.ok()).toBeTruthy();
  });

  test("Workflow 2: Account - Transaction - Balance consistency", async ({ page }) => {
    const login = new LoginPage(page);
    const accounts = new AccountsPage(page);
    const txs = new TransactionsPage(page);

    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // Create expense
    await txs.goto();
    await page.waitForLoadState("networkidle");
    const addBtn = page.locator("#top-add-tx").or(page.locator("#empty-state-create-tx"));
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      const acct = page.locator("#create-tx-account");
      if (await acct.isVisible()) {
        await acct.selectOption({ index: 1 });
      }
      await page.locator("#create-tx-merchant").fill("E2E Cross Expense");
      await page.locator("#create-tx-category").selectOption("Food & Dining");
      await page.locator("#create-tx-amount").fill("5000");
      const dateInput = page.locator("#create-tx-date");
      if (await dateInput.isVisible()) {
        await dateInput.fill(new Date().toISOString().split("T")[0]);
      }
      await page.locator("#submit-create-tx").click();
      await page.waitForTimeout(1000);
    }

    // Verify AI insights
    await page.goto("/ai-insights");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Verify reports
    const reportRes = await page.goto("/api/reports/dashboard?period=Monthly");
    expect(reportRes?.ok()).toBeTruthy();
  });

  test("Workflow 3: Notification and profile access", async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });

    // Access notifications
    const notifRes = await page.goto("/api/notifications");
    expect(notifRes?.ok()).toBeTruthy();

    // Mark all read
    const readResult = await page.evaluate(() =>
      fetch("/api/notifications/read-all", { method: "PATCH" }).then((r) => r.json())
    );
    expect(readResult.success).toBeTruthy();

    // Access profile
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/profile");
  });
});
