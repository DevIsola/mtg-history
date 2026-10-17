import { test, expect } from '@playwright/test';

const root = '/mtg-history/';
const chapter = `${root}chapters/war-of-the-spark/`;

test('chapter pages show a compact switcher instead of the full chronology grid', async ({ page }) => {
  await page.goto(chapter);
  await expect(page.getByRole('navigation', { name: 'Switch chapters' })).toBeVisible();
  await expect(page.locator('.chronology-strip')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /begin reading/i })).toHaveAttribute('href', '#chapter-reader');
});

test('timeline chapter selection lands directly at the reading area', async ({ page }) => {
  await page.goto(`${root}timeline/`);
  await expect(page.locator('.chronology-strip')).toBeVisible();
  await page.locator('.chronology-strip__link').first().click();
  await expect(page).toHaveURL(/\/chapters\/[a-z-]+\/#chapter-reader$/);
  await expect(page.locator('#chapter-reader')).toBeInViewport();
  await expect(page.locator('.chapter-prose')).toBeVisible();
});

test('chapter chooser marks the current chapter and links to the next chapter reader', async ({ page }) => {
  await page.goto(chapter);
  const chooser = page.locator('[data-chapter-menu]');
  await chooser.locator('summary').click();
  await expect(chooser).toHaveAttribute('open', '');
  await expect(chooser.locator('a[aria-current="page"]')).toHaveCount(1);
  const next = page.getByRole('link', { name: /^Next chapter:/ });
  await next.click();
  await expect(page).toHaveURL(/#chapter-reader$/);
  await expect(page.locator('#chapter-reader')).toBeInViewport();
});
