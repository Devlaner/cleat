import { test, expect } from "@playwright/test";

// Авторизация пользователя перед тестом настроек
test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    localStorage.setItem(
      "cleat-org",
      JSON.stringify({
        state: {
          connected: true,
          connectedAccountIds: ["acct_personal"],
          activeAccountId: "acct_personal",
        },
        version: 0,
      }),
    );
  });

  await page.reload();
});

test("settings page loads", async ({ page }) => {
  await page.goto("/app/settings");

  await expect(page.getByTestId("settings-page")).toBeVisible();
});
