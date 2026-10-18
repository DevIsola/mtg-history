import { test, expect } from '@playwright/test';

const root = '/mtg-history/';

const routes = [
  ['Home', root],
  ['Timeline', `${root}timeline/`],
  ['Characters', `${root}characters/`],
  ['Relationships', `${root}relationships/`],
  ['Events', `${root}events/`],
  ['Archive', `${root}archive/`],
  ['Discovery', `${root}discover/`],
  ['Chapter 08', `${root}chapters/war-of-the-spark/`],
];

for (const [label, path] of routes) {
  test(`${label}: page loads with a main landmark and heading`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
}

test('skip link reaches the main content by keyboard', async ({ page }) => {
  await page.goto(root);
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toHaveAttribute('href', '#main-content');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
});

test('chapter navigation exposes working table-of-contents destinations', async ({ page }) => {
  await page.goto(`${root}chapters/war-of-the-spark/`);
  if (test.info().project.name === 'mobile-chromium') {
    const toggle = page.locator('[data-chapter-toggle]');
    await toggle.click();
  }
  const tocLink = page.locator('[data-chapter-link]').first();
  await expect(tocLink).toBeVisible();
  const hash = await tocLink.getAttribute('href');
  expect(hash).toMatch(/^#[^#]+$/);
  await tocLink.click();
  expect(decodeURIComponent(new URL(page.url()).hash)).toBe(hash);
});

test('no horizontal overflow at the chosen viewport', async ({ page }) => {
  await page.goto(`${root}chapters/war-of-the-spark/`);
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.viewport + 1);
});
