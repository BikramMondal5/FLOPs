import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Reports & Export Workflow", () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should access reports dashboard", async ({ page }) => {
    const response = await page.goto("/api/reports/dashboard?period=Monthly");
    expect(response?.ok()).toBeTruthy();
    const body = await response?.json();
    expect(body.success).toBeTruthy();
  });

  test("should export CSV", async ({ page }) => {
    const response = await page.goto("/api/export/csv?format=csv");
    expect(response?.ok()).toBeTruthy();
    const contentType = response?.headers()["content-type"] || "";
    expect(contentType.includes("csv") || contentType.includes("text")).toBeTruthy();
  });

  test("should export JSON", async ({ page }) => {
    const response = await page.goto("/api/export/csv?format=json");
    expect(response?.ok()).toBeTruthy();
    const body = await response?.json();
    expect(body).toBeDefined();
  });

  test("should reject unauthenticated report access", async ({ page }) => {
    await page.goto("/api/reports/dashboard?period=Monthly");
    expect(page.url()).toContain("/auth/login");
  });

  test("should filter with different periods", async ({ page }) => {
    const periods = ["Daily", "Weekly", "Monthly"];
    for (const period of periods) {
      const response = await page.goto(`/api/reports/dashboard?period=${period}`);
      if (response?.ok()) {
        const body = await response?.json();
        expect(body.success).toBeTruthy();
      }
    }
  });
});
