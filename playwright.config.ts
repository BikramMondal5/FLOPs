import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "tests/e2e/reports/html", open: "never" }],
    ["junit", { outputFile: "tests/e2e/reports/junit/e2e-results.xml" }],
    ["list"],
  ],

  timeout: 60000,
  expect: {
    timeout: 15000,
  },

  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10000,
    navigationTimeout: 120000,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        launchOptions: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      },
    },
  ],

  webServer: {
    command: "bash tests/e2e/setup/e2e-server.sh",
    port: 3000,
    timeout: 120000,
    reuseExistingServer: false,
  },
});
