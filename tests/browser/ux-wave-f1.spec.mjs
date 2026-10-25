import { test, expect } from '@playwright/test';
const base = '/mtg-history/';
for (const [route, locale, minimum] of [['', 'en', 6], ['pt-br/', 'pt-BR', 6]]) {
  test(`F1 homepage ${locale}: authentic illustrated sections and responsive hierarchy`, async ({ page }) => {
    await page.goto(base + route);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('[data-home-artwork]')).toHaveCount(minimum);
    await expect(page.locator('[data-home-artwork]').first()).toHaveAttribute('data-canonical-id', /^[0-9a-f-]{36}$/);
    await expect(page.locator('.homepage-numbers dd')).toHaveCount(4);
    await expect(page.locator('.homepage-hero__grid h1')).toBeVisible();
    await expect(page.locator('.homepage-artwork a').first()).toHaveAttribute('href', /scryfall\.com\/card\//);
    await page.setViewportSize({width: 320, height: 720});
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}
test('F1 network shows distinguishable category swatches and original relationship context', async ({ page }) => {
  await page.goto(base + 'relationships/');
  await expect(page.locator('.network-visual__legend li')).toHaveCount(6);
  await expect(page.locator('[data-network-edge]')).toHaveCount(118);
  await expect(page.locator('.network-legend--family')).toHaveCSS('border-color', /.+/);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  const color = await page.locator('.network-legend--creation').evaluate(el => getComputedStyle(el).getPropertyValue('--legend-color').trim());
  expect(color.toLowerCase()).toBe('#ff99df');
});
