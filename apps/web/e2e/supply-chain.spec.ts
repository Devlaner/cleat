import { test, expect } from "@playwright/test";

// Инициализируем сессию в localStorage перед тестом supply-chain
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

test("supply chain page loads", async ({ page }) => {
  await page.goto("/app/supply-chain");

  await expect(page.getByTestId("supply-chain-page")).toBeVisible();
});
