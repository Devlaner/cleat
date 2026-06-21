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

test("code scanning page loads", async ({ page }) => {
  await page.goto("/app/security/code-scanning");

  await expect(page.getByTestId("code-scanning-page")).toBeVisible();
});
