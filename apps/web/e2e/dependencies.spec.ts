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

test("dependencies page loads", async ({ page }) => {
  await page.goto("/app/dependencies");

  await expect(page.getByTestId("dependencies-page")).toBeVisible();

  await expect(page.getByText("Total dependencies")).toBeVisible();

  await expect(page.getByText("Export SBOM")).toBeVisible();

  await expect(page.getByText("Download")).toBeVisible();
});
