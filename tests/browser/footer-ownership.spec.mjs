import { test, expect } from '@playwright/test';

const root = '/mtg-history/';

test('footer grid remains responsive with Astro-scoped styles', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(root);
  const footer = page.locator('footer.site-footer');
  await expect(footer).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Timeline' })).toHaveAttribute('href', /timeline\/$/);
  const desktop = await page.locator('.footer-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(desktop).toBe(2);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.locator('.footer-grid').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
  expect(mobile).toBe(1);
  await expect(page.locator('.footer-links')).toHaveCSS('flex-wrap', 'wrap');
  await expect(page.locator('.footer-legal')).toHaveCSS('display', 'block');
});

test('footer retains semantic links and accessible source attribution', async ({ page }) => {
  await page.goto(root);
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: 'Support DevIsola on Ko-fi' })).toBeVisible();
  await expect(footer).toContainText('unofficial fan content');
});
