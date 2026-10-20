import { test, expect } from '@playwright/test';

const base = '/mtg-history/chapters/';

test('reading preferences change prose and persist across chapters', async ({ page }) => {
  await page.goto(base + 'thran/');
  const reader = page.locator('[data-chapter-reading-root]');
  const controls = page.locator('[data-reading-controls]');
  await expect(controls).toBeVisible();
  await controls.getByLabel('Larger', { exact: true }).check();
  await controls.getByLabel('Classic serif').check();
  await controls.getByLabel('Relaxed').check();
  await expect(reader).toHaveAttribute('data-reading-size', 'large');
  await expect(reader).toHaveAttribute('data-reading-typeface', 'classic');
  await expect(reader).toHaveAttribute('data-reading-spacing', 'relaxed');
  await expect(page.locator('.chapter-prose')).toHaveCSS('font-size', '19.2px');
  await expect(controls.getByRole('status')).toContainText('saved');

  await page.goto(base + 'brothers-war/');
  const nextReader = page.locator('[data-chapter-reading-root]');
  await expect(nextReader).toHaveAttribute('data-reading-size', 'large');
  await expect(nextReader).toHaveAttribute('data-reading-typeface', 'classic');
  await expect(nextReader).toHaveAttribute('data-reading-spacing', 'relaxed');
  await page.locator('[data-reading-reset]').click();
  await expect(nextReader).toHaveAttribute('data-reading-size', 'regular');
  await expect(nextReader).toHaveAttribute('data-reading-typeface', 'modern');
  await expect(nextReader).toHaveAttribute('data-reading-spacing', 'comfortable');
});

test('reader controls remain usable on a 320px screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(base + 'thran/');
  await page.getByLabel('Larger', { exact: true }).check();
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test.describe('reading without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('content remains readable while preference controls stay hidden', async ({ page }) => {
    await page.goto(base + 'thran/');
    await expect(page.locator('[data-reading-controls]')).toBeHidden();
    await expect(page.locator('.chapter-prose')).toBeVisible();
    await expect(page.locator('.chapter-prose h2').first()).toBeVisible();
  });
});
