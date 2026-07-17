import { Page, expect } from "@playwright/test";

export const TEST_USER = {
  name: "E2E Test User",
  email: "e2e-test-user@example.com",
  password: "E2eTest@12345",
};

export const SEED_USER = {
  email: "testuser@example.com",
  password: "Test@12345",
};

export const TEST_ACCOUNT = {
  name: "E2E Test Account",
  type: "Savings",
  balance: "25000",
};

export const TEST_INCOME = {
  merchant: "E2E Salary Client",
  amount: "50000",
};

export const TEST_EXPENSE = {
  merchant: "E2E Grocery Store",
  amount: "1500",
};

export const TEST_BUDGET = {
  name: "E2E Test Budget",
};

export const TEST_GOAL = {
  name: "E2E Test Goal",
  category: "Emergency Fund",
  targetAmount: "100000",
};

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

export async function getConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return errors;
}

export async function getFailedRequests(page: Page): Promise<string[]> {
  const failed: string[] = [];
  page.on("response", (response) => {
    if (!response.ok() && response.status() >= 400) {
      failed.push(`${response.url()} (${response.status()})`);
    }
  });
  return failed;
}

export function generateUniqueEmail(): string {
  const ts = Date.now();
  return `e2e-user-${ts}@example.com`;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function assertNoConsoleErrors(errors: string[]) {
  const filtered = errors.filter(
    (e) => !e.includes("favicon") && !e.includes("next-router") && !e.includes("404")
  );
  expect(filtered.length).toBe(0);
}
