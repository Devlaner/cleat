import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/app/overview",
  "/app/security/secrets",
  "/app/security/vulnerabilities",
  "/app/security/code-scanning",
  "/app/supply-chain",
  "/app/dependencies",
  "/app/artifacts",
  "/app/repositories",
  "/app/access",
  "/app/notifications",
  "/app/settings",
];

test.describe("Authenticated accessibility checks", () => {
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

  test("accessibility check: repository details", async ({ page }) => {
    await page.goto("/app/repositories");

    await expect(page.locator('[data-testid="repositories-table"]')).toBeVisible();

    const rows = page.locator('[data-testid^="table-row-"]');

    const count = await rows.count();

    if (count === 0) {
      test.skip(true, "No repositories available");
    }

    expect(count).toBeGreaterThan(0);

    const repoIds = await rows.evaluateAll((items) =>
      items
        .map((item) => item.getAttribute("data-testid"))
        .filter(Boolean)
        .map((id) => id!.replace("table-row-", "")),
    );

    expect(repoIds.length).toBeGreaterThan(0);

    for (const repoId of repoIds) {
      const url = `/app/repositories/${repoId}`;

      await page.goto(url);

      await page.waitForLoadState("networkidle");

      await expect(page.locator("h1")).toBeVisible();

      const results = await new AxeBuilder({
        page,
      }).analyze();

      if (results.violations.length > 0) {
        console.log(JSON.stringify(results.violations, null, 2));
      }

      expect(results.violations).toEqual([]);
    }
  });

  for (const path of pages) {
    test(`accessibility check: ${path}`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator("h1")).toBeVisible();

      const results = await new AxeBuilder({
        page,
      }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
