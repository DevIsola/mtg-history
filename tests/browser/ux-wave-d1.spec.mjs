import { test, expect } from '@playwright/test';
const root = '/mtg-history/';

test('D1 timeline connects every published era to its exact illustrated printing', async ({ page }) => {
  await page.goto(root + 'timeline/');
  const eras = page.locator('[data-timeline-era]');
  await expect(eras).toHaveCount(11);
  await expect(page.locator('[data-timeline-artwork]')).toHaveCount(11);
  const first = eras.first();
  await expect(first.locator('[data-timeline-artwork]')).toHaveAttribute('data-printing-id', /^[a-f\d-]{36}$/i);
  await expect(first.locator('.atlas-era__artwork figcaption')).toContainText('#');
  await expect(first.locator('.atlas-era__artwork a')).toHaveAttribute('href', /scryfall\.com\/card\//);
  await expect(first.locator('.atlas-era__chronology')).toContainText('Story period');
  await expect(first.locator('.atlas-era__chronology')).toContainText('In publication');
});

test('filtering and historical events still work with editorial layout', async ({ page }) => {
  await page.goto(root + 'timeline/');
  await page.locator('#timeline-era').selectOption('thran');
  await expect(page.locator('[data-timeline-era]:visible')).toHaveCount(1);
  const first = page.locator('[data-timeline-era]:visible');
  await first.locator('[data-timeline-details] summary').click();
  await expect(first.locator('[data-timeline-event]:visible').first()).toBeVisible();
  await page.locator('#timeline-reset').click();
  await expect(page.locator('[data-timeline-era]:visible')).toHaveCount(11);
});

test('320px timeline and search results do not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(root + 'timeline/');
  await expect(page.locator('.atlas-era__artwork').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('palette result is an accessible structured row', async ({ page }) => {
  await page.goto(root + 'timeline/');
  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.locator('[data-search-palette]');
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-palette-query]').fill('Yawgmoth');
  const item = dialog.locator('.search-palette__result-link').first();
  await expect(item).toBeVisible({ timeout: 15000 });
  await expect(item.locator('.search-palette__result-kind')).not.toBeEmpty();
  await expect(item.locator('.search-palette__result-title')).not.toBeEmpty();
  await expect(item.locator('.search-palette__result-arrow')).toHaveText('↗');
});
