import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { OverviewPage } from "../pages/OverviewPage";
import { generateUniqueEmail } from "../helpers/utils";

test.describe("Authentication Flow", () => {
  let login: LoginPage;
  let signup: SignupPage;
  let overview: OverviewPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    signup = new SignupPage(page);
    overview = new OverviewPage(page);
  });

  test.describe("Signup", () => {
    test("should display signup form", async () => {
      await signup.goto();
      await signup.assertSignupFormVisible();
    });

    test("should sign up with valid credentials", async ({ page }) => {
      const email = generateUniqueEmail();
      await signup.goto();
      await signup.signup("E2E User", email, "E2eTest@12345");
      await page.waitForURL(/\/overview|\/auth\/login/, { timeout: 15000 });
      const url = page.url();
      expect(url.includes("/overview") || url.includes("/auth/login?registered=true")).toBeTruthy();
    });

    test("should show error for invalid signup data", async () => {
      await signup.goto();
      await signup.signup("A", "invalid-email", "short");
      await signup.assertErrorVisible();
    });

    test("should navigate to login page", async ({ page }) => {
      await signup.goto();
      await signup.clickSignIn();
      await page.waitForURL(/\/auth\/login/);
      expect(page.url()).toContain("/auth/login");
    });
  });

  test.describe("Login", () => {
    test("should display login form", async () => {
      await login.goto();
      await login.assertLoginFormVisible();
    });

    test("should login with seeded user credentials", async ({ page }) => {
      await login.goto();
      await login.login("testuser@example.com", "Test@12345");
      await page.waitForURL(/\/overview/, { timeout: 15000 });
      expect(page.url()).toContain("/overview");
    });

    test("should show error for invalid credentials", async () => {
      await login.goto();
      await login.login("wrong@example.com", "WrongPass123!");
      await login.assertErrorVisible();
    });

    test("should show error for empty fields", async () => {
      await login.goto();
      await login.fillLoginForm("", "");
      await login.submitLogin();
      await login.assertErrorVisible();
    });

    test("should navigate to forgot password", async ({ page }) => {
      await login.goto();
      await login.clickForgotPassword();
      await page.waitForURL(/\/auth\/forgot-password/);
      expect(page.url()).toContain("/forgot-password");
    });
  });

  test.describe("Session & Protected Routes", () => {
    test("should redirect unauthenticated users to login", async ({ page }) => {
      await page.goto("/overview");
      await page.waitForURL(/\/auth\/login/);
      expect(page.url()).toContain("/auth/login");
    });

    test("should redirect to overview when authenticated user visits login", async ({ page }) => {
      await login.goto();
      await login.login("testuser@example.com", "Test@12345");
      await page.waitForURL(/\/overview/, { timeout: 15000 });
      await page.goto("/auth/login");
      await page.waitForURL(/\/overview/);
      expect(page.url()).toContain("/overview");
    });

    test("should persist session across navigation", async ({ page }) => {
      await login.goto();
      await login.login("testuser@example.com", "Test@12345");
      await page.waitForURL(/\/overview/, { timeout: 15000 });
      await page.goto("/accounts");
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("/accounts");
      await page.goto("/transactions");
      await page.waitForLoadState("networkidle");
      expect(page.url()).toContain("/transactions");
    });

    test("should protect all financial routes", async ({ page }) => {
      const protectedRoutes = ["/overview", "/accounts", "/transactions", "/budget", "/goals", "/ai-insights", "/profile"];
      for (const route of protectedRoutes) {
        await page.goto(route);
        await page.waitForURL(/\/auth\/login/);
        expect(page.url()).toContain("/auth/login");
      }
    });
  });
});
