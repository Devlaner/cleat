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

    await page.waitForSelector("h1", { state: "visible" });

    const repositoryLinks = await page
      .locator('a[href^="/app/repositories/"]')
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));

    for (const url of repositoryLinks) {
      await page.goto(url);

      await page.waitForSelector("h1", { state: "visible" });

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    }
  });

  for (const path of pages) {
    test(`accessibility check: ${path}`, async ({ page }) => {
      await page.goto(path);

      await page.waitForSelector("h1", { state: "visible" });

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});
