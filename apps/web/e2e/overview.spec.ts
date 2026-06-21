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

test("overview page loads", async ({ page }) => {
  await page.goto("/app/overview");

  await expect(page).toHaveURL(/overview/);

  await expect(page.getByTestId("overview-page")).toBeVisible();

  await expect(page.getByTestId("security-posture-card")).toBeVisible();

  await expect(page.getByTestId("open-findings-card")).toBeVisible();
});
