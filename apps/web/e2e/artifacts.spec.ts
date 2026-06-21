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

test("artifacts page loads", async ({ page }) => {
  await page.goto("/app/artifacts");

  await expect(page.getByTestId("artifacts-page")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Artifacts & cost" })).toBeVisible();

  await expect(page.locator("button", { hasText: "Caches" })).toBeVisible();

  await expect(page.locator("button", { hasText: "Packages" })).toBeVisible();
});
