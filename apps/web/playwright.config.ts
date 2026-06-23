import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,

  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },

  webServer: {
    command: "bun run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
