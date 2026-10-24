import { test, expect } from '@playwright/test';

const base = '/mtg-history/';
const thran = `${base}chapters/thran/`;

test('desktop: only the header and chapter sidebar remain sticky', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(thran);
  await page.locator('.chapter-prose h2').nth(3).scrollIntoViewIfNeeded();
  const positions = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect();
    return {
      header: rect('.site-header')?.bottom,
      band: rect('.chapter-switcher-band')?.bottom,
      sidebar: rect('.chapter-reading-sidebar')?.top,
      position: getComputedStyle(document.querySelector('.chapter-switcher-band')).position,
    };
  });
  expect(positions.position).toBe('relative');
  expect(positions.band).toBeLessThan(positions.header);
  expect(positions.sidebar).toBeGreaterThanOrEqual(positions.header - 2);
  expect(positions.sidebar).toBeLessThanOrEqual(positions.header + 26);
});

test('illustration plate preserves the full printing and interpretation', async ({ page }) => {
  await page.goto(thran);
  const plate = page.locator('.historical-moment').first();
  await expect(plate.locator('.historical-card--plate')).toHaveCount(1);
  const image = plate.locator('.historical-card img');
  await expect(image).toHaveCSS('object-fit', 'contain');
  const context = plate.locator('.historical-card__interpretation');
  await expect(context).not.toHaveAttribute('open', '');
  await context.locator('summary').click();
  await expect(context).toHaveAttribute('open', '');
  await expect(context.locator('.historical-card__significance')).toBeVisible();
  await expect(plate.locator('.historical-card__source')).toHaveAttribute('href', /scryfall\.com\/card\//);
  await plate.locator('[data-card-artwork-open]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
});

test('mobile: compact opaque TOC remains attached to header without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(thran);
  await page.locator('.chapter-prose h2').nth(3).scrollIntoViewIfNeeded();
  await expect(page.locator('.chapter-toc__toolbar')).toBeHidden();
  const measure = await page.evaluate(() => {
    const toc = document.querySelector('.chapter-toc')?.getBoundingClientRect();
    const header = document.querySelector('.site-header')?.getBoundingClientRect();
    return {
      gap: (toc?.top ?? Infinity) - (header?.bottom ?? -Infinity),
      tocHeight: toc?.height ?? Infinity,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(Math.abs(measure.gap)).toBeLessThanOrEqual(2);
  expect(measure.tocHeight).toBeLessThanOrEqual(92);
  expect(measure.overflow).toBeLessThanOrEqual(1);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('chapter remains readable with complete source and native interpretation disclosure', async ({ page }) => {
    await page.goto(thran);
    await expect(page.locator('.chapter-prose h2').first()).toBeVisible();
    const plate = page.locator('.historical-moment').first();
    await expect(plate.locator('.historical-card__source')).toHaveAttribute('href', /scryfall\.com\/card\//);
    const disclosure = plate.locator('.historical-card__interpretation');
    await disclosure.locator('summary').click();
    await expect(disclosure.locator('.historical-card__significance')).toBeVisible();
  });
});
