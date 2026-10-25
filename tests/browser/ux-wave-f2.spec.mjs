import { test, expect } from '@playwright/test';
import { REVIEW_ROUTES } from '../../src/utils/ux-f2-audit.mjs';

const base = '/mtg-history/';

test('F2 paired and historical routes have a visible heading, correct locale and no missing image alt', async ({ page }) => {
  test.setTimeout(180_000);
  for (const target of REVIEW_ROUTES) {
    const response = await page.goto(base + target.route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), target.route).toBeTruthy();
    await expect(page.locator('html'), target.id).toHaveAttribute('lang', target.locale);
    await expect(page.locator('main h1').first(), target.id).toBeVisible();
    expect(await page.locator('main img:not([alt])').count(), `${target.id}: images missing alt`).toBe(0);
  }
});

test('F2 viewport gate checks overflow at 320, 390, 768 and 1440 pixels', async ({ page }) => {
  test.setTimeout(240_000);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 820 });
    for (const path of ['', 'pt-br/', 'archive/', 'pt-br/archive/', 'characters/', 'relationships/']) {
      await page.goto(base + path, { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${width}px: ${path || 'home'} scrolls horizontally`).toBeLessThanOrEqual(1);
    }
  }
});

test('F2 keyboard skip-link and header locale selection remain operable', async ({ page }) => {
  await page.goto(base);
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await page.goto(base + 'archive/');
  const languages = page.locator('.site-header__languages');
  await languages.locator('summary').click();
  const pt = languages.locator('a[hreflang="pt-BR"]');
  await expect(pt).toBeVisible();
  await pt.click();
  await expect(page).toHaveURL(/\/mtg-history\/pt-br\/archive\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('F2 English and Portuguese home hero share their canonical artwork reference', async ({ page }) => {
  await page.goto(base);
  const original = page.locator('[data-home-artwork]').first();
  const id = await original.getAttribute('data-canonical-id');
  expect(id).toMatch(/^[0-9a-f-]{36}$/);
  await expect(original.locator('a').first()).toHaveAttribute('data-card-source', /scryfall\.com\/card\//);
  await expect(original.locator('.homepage-artwork__credit')).toContainText('#');
  await page.goto(base + 'pt-br/');
  const translated = page.locator('[data-home-artwork]').first();
  await expect(translated).toHaveAttribute('data-canonical-id', id);
  await expect(translated.locator('.homepage-artwork__classification')).toContainText(/português|original \(EN\)/);
  await expect(translated.locator('a').first()).toHaveAttribute('data-card-source', /scryfall\.com\/card\//);
});

test('F2 network exposes text evidence, legend labels and accessible non-graph alternative', async ({ page }) => {
  await page.goto(base + 'relationships/');
  await expect(page.locator('[data-network-edge]')).toHaveCount(118);
  await expect(page.locator('.network-visual__legend li')).toHaveCount(6);
  await expect(page.locator('#network-show-cards')).toBeVisible({ timeout: 20_000 });
  await page.locator('#network-show-cards').click();
  await expect(page.locator('[data-network-edge]:visible').first()).toBeVisible();
  await expect(page.locator('[data-network-edge]:visible').first().locator('.network-edge__chapter')).toHaveAttribute('href', /\/chapters\//);
});

test('F2 relationships remain readable without JavaScript', async ({ page, browser }) => {
  await page.goto(base);
  const absoluteRoute = new URL('relationships/', page.url()).href;
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 760 } });
  try {
    const page = await context.newPage();
    await page.goto(absoluteRoute, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-network-edge]:visible')).toHaveCount(118);
    await expect(page.locator('[data-network-edge] a[href*="characters/"]').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});
