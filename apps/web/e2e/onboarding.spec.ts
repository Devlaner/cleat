import { test, expect } from "@playwright/test";

test("user can start onboarding", async ({ page }) => {
  await page.goto("/connect");

  await expect(
    page.getByRole("button", {
      name: /authorize & continue/i,
    }),
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: /authorize & continue/i,
    })
    .click();

  await expect(page).toHaveURL(/onboarding/);
});
