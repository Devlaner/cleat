import { test, expect } from "@playwright/test";

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

test("repositories page loads", async ({ page }) => {
  await page.goto("/app/repositories");

  await expect(page).toHaveURL(/repositories/);

  await expect(page.getByTestId("repositories-page")).toBeVisible();
});
