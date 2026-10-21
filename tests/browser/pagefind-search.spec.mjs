import { test, expect } from '@playwright/test';

const base = '/mtg-history/';

test('full-text index finds chapter prose and returns base-prefixed links', async ({ page }) => {
  await page.goto(`${base}search/`);
  await page.locator('#fulltext-query').fill('phthisis');
  await expect(page.locator('[data-fulltext-status]')).toContainText(/matching records|No matching historical records/, { timeout: 15000 });
  const matches = page.locator('[data-fulltext-results] a');
  await expect(matches.first()).toBeVisible();
  const paths = await matches.evaluateAll((nodes) => nodes.map((node) => new URL(node.href).pathname));
  expect(paths.every((path) => path.startsWith(base))).toBe(true);
});

test('search clears earlier results and reports minimum query length', async ({ page }) => {
  await page.goto(`${base}search/`);
  const search = page.locator('#fulltext-query');
  await search.fill('phthisis');
  await expect(page.locator('[data-fulltext-results] a').first()).toBeVisible({ timeout: 15000 });
  await search.fill('a');
  await expect(page.locator('[data-fulltext-status]')).toContainText('at least two characters');
  await expect(page.locator('[data-fulltext-results] a')).toHaveCount(0);
});

test('search remains accessible at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(`${base}search/`);
  await expect(page.getByRole('searchbox', { name: 'Search all historical text' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('structured encyclopedia remains reachable', async ({ page }) => {
    await page.goto(`${base}search/`);
    await expect(page.locator('noscript')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'The encyclopedia index' })).toHaveAttribute('href', `${base}discover/`);
  });
});
