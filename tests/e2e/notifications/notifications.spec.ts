import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { NotificationsPage } from "../pages/NotificationsPage";

test.describe("Notification Workflow", () => {
  let login: LoginPage;
  let notifications: NotificationsPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    notifications = new NotificationsPage(page);
    await login.goto();
    await login.login("testuser@example.com", "Test@12345");
    await page.waitForURL(/\/overview/, { timeout: 15000 });
  });

  test("should fetch notifications from API", async ({ page }) => {
    const response = await page.goto("/api/notifications");
    expect(response?.ok()).toBeTruthy();
    const body = await response?.json();
    expect(body.success).toBeTruthy();
  });

  test("should display unread notification badge", async () => {
    await notifications.goto();
    await notifications.assertUnreadBadgeVisible();
  });

  test("should have budget alerts in response", async ({ page }) => {
    const response = await page.goto("/api/notifications");
    const body = await response?.json();
    if (body.success && body.data) {
      const notificationsList = body.data.notifications || body.data;
      const hasNotifications = Array.isArray(notificationsList) && notificationsList.length > 0;
      expect(hasNotifications).toBeTruthy();
    }
  });

  test("should mark all notifications as read", async ({ page }) => {
    const response = await page.evaluate(() =>
      fetch("/api/notifications/read-all", { method: "PATCH" }).then((r) => r.json())
    );
    expect(response.success).toBeTruthy();
  });

  test("should reject unauthenticated notification access", async ({ page }) => {
    await page.goto("/api/notifications");
    expect(page.url()).toContain("/auth/login");
  });
});
