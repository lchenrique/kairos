import { defineConfig, devices } from "@playwright/test"

const apiUrl = "http://localhost:3341"
const appUrl = "http://localhost:3012"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 240_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  preserveOutput: "always",
  use: {
    baseURL: appUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: [
    {
      command:
        "pnpm --filter @kairos/backend exec prisma migrate reset --force --skip-seed && pnpm --filter @kairos/backend exec tsx src/server.ts",
      url: `${apiUrl}/health`,
      timeout: 120_000,
      reuseExistingServer: false,
      env: {
        PORT: "3341",
        DATABASE_URL: "file:./e2e.db",
        JWT_SECRET: "e2e-only-secret-with-more-than-32-characters",
        FRONTEND_URL: appUrl,
        NODE_ENV: "test",
        TEST_INVITE_TOKENS: "deterministic",
      },
    },
    {
      command: "pnpm --filter @kairos/frontend exec next dev -p 3012",
      url: `${appUrl}/setup`,
      timeout: 180_000,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_API_URL: apiUrl,
        API_INTERNAL_URL: apiUrl,
      },
    },
  ],
})
