import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';
import ledger from '../../docs/phase14c-migration-identities.json' with { type: 'json' };
const origin = process.env.MTG_SITE_ORIGIN ?? 'https://mtg-history.example.workers.dev';
for (const route of ['', 'pt-br/', 'chapters/brothers-war/', 'pt-br/chapters/new-phyrexia/', 'timeline/', 'pt-br/timeline/', 'explore/', 'pt-br/explore/', 'characters/urza/', 'archive/', 'pt-br/archive/', 'search/', 'pt-br/search/']) {
  test('root static hosting: ' + (route || 'home'), async ({ page }, info) => {
    const response = await page.goto('/' + route);
    expect(response.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', origin + '/' + route);
    await expect(page.locator('html')).toHaveAttribute('lang', route.startsWith('pt-br/') ? 'pt-BR' : 'en');
    expect(await page.locator('a[href^="/mtg-history/"]').count()).toBe(0);
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('[data-theme-toggle]').click();
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      await writeFile(info.outputPath(theme + '-axe.json'), JSON.stringify({ route, theme, violations: audit.violations, incomplete: audit.incomplete }, null, 2));
      expect(audit.violations.filter(v => ['serious', 'critical'].includes(v.impact))).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: info.outputPath(theme + '.png') });
    }
  });
}
test('legacy project paths redirect with queries and missing pages stay 404', async ({ request }) => {
  const legacy = await request.get('/mtg-history/pt-br/chapters/thran/?from=legacy', { maxRedirects: 0 });
  expect(legacy.status()).toBe(301);
  expect(legacy.headers().location).toMatch(/\/pt-br\/chapters\/thran\/\?from=legacy$/);
  const canonical = await request.get('/chapters/thran', { maxRedirects: 0 });
  expect([301, 307, 308]).toContain(canonical.status());
  expect(canonical.headers().location).toMatch(/\/chapters\/thran\/$/);
  expect((await request.get('/missing-phase16-page/')).status()).toBe(404);
});
test('fingerprinted assets cache immutably while HTML and Pagefind revalidate', async ({ page, request }) => {
  const response = await page.goto('/');
  expect(response.headers()['cache-control']).toContain('must-revalidate');
  if (process.env.MTG_HOSTING_PRODUCTION === '1') expect(response.headers()['x-robots-tag'] ?? '').not.toMatch(/noindex/i);
  else expect(response.headers()['x-robots-tag']).toBe('noindex');
  const asset = await page.locator('link[rel="stylesheet"][href*="/_astro/"]').first().getAttribute('href');
  const css = await request.get(asset);
  expect(css.headers()['cache-control']).toContain('immutable');
  const index = await request.get('/pagefind/pagefind.js');
  expect(index.status()).toBe(200);
  expect(index.headers()['cache-control']).toContain('must-revalidate');
  expect(index.headers()['content-type']).toMatch(/javascript/);
});
test('Pagefind, PT search and card artwork viewer work at the root', async ({ page }) => {
  await page.goto('/');
  await page.locator('.site-header__search').click();
  const dialog = page.locator('[data-search-palette]');
  await dialog.locator('[data-palette-query]').fill('Yawgmoth');
  const result = dialog.locator('.search-palette__result-link').first();
  await expect(result).toBeVisible({ timeout: 15000 });
  expect(await result.getAttribute('href')).not.toContain('/mtg-history/');
  await dialog.locator('[data-palette-query]').press('ArrowDown');
  await expect(result).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-header__search')).toBeFocused();
  await page.goto('/pt-br/search/');
  await page.locator('#fulltext-query').fill('Phyrexia');
  await expect(page.locator('[data-fulltext-results] a').first()).toHaveAttribute('href', /^\/pt-br\//, { timeout: 15000 });
  await page.goto('/pt-br/chapters/thran/');
  const card = page.locator('[data-card-artwork-open]').first();
  await card.click();
  await expect(page.locator('#card-artwork-viewer')).toBeVisible();
  await expect(page.locator('[data-card-artwork-source]')).toHaveAttribute('href', /scryfall\.com\/card\//);
  await page.keyboard.press('Escape');
  await expect(card).toBeFocused();
});


test.describe('no-JavaScript migration links', () => {
  test.use({ javaScriptEnabled: false });
  test('legacy prefix redirects preserve moved EN/PT fragment navigation', async ({ page }) => {
    await page.route('https://cards.scryfall.io/**', route => route.abort());
    for (const [locale, anchor] of [['', ledger.movedAnchors[0]], ['pt-br/', 'a-missao-ao-nucleo-semente']]) {
      await page.goto('/mtg-history/' + locale + 'chapters/march-of-the-machine/#' + anchor, { waitUntil: 'domcontentloaded' });
      expect(new URL(page.url()).pathname).toBe('/' + locale + 'chapters/march-of-the-machine/');
      expect(new URL(page.url()).hash).toBe('#' + anchor);
      const target = await page.locator('[id="' + anchor + '"] a').getAttribute('href');
      await page.locator('[id="' + anchor + '"] a').click();
      expect(new URL(page.url()).pathname).toBe('/' + locale + 'chapters/new-phyrexia/');
      expect(new URL(page.url()).hash).toBe(new URL(target, page.url()).hash);
      await expect(page.locator('[id="' + decodeURIComponent(new URL(page.url()).hash.slice(1)) + '"]')).toBeVisible();
    }
  });
});
