import { test, expect } from '@playwright/test';

const base = '/mtg-history/';

for (const [pagePath, selector] of [
  ['chapters/thran/', '.historical-card img'],
  ['archive/', '.archive-card__image img'],
  ['discover/', '.discovery-card__media img'],
  ['events/', '.historical-event-card__image img'],
]) {
  test(`${pagePath} serves exact-printing responsive full card images`, async ({ page }) => {
    await page.goto(`${base}${pagePath}`);
    const img = page.locator(selector).first();
    await expect(img).toHaveAttribute('src', /https:\/\/cards\.scryfall\.io\/normal\/front\/[a-f0-9]\/[a-f0-9]\/[a-f0-9-]{36}\.jpg/);
    await expect(img).toHaveAttribute('srcset', /small\/front\/.*146w, .*normal\/front\/.*488w, .*large\/front\/.*672w/);
    await expect(img).toHaveAttribute('sizes', /\S/);
    await expect(img).toHaveAttribute('width', '488');
    await expect(img).toHaveAttribute('height', '680');
    await expect(img).toHaveAttribute('loading', 'lazy');
  });
}

test('character card preview retains deferred responsive card sources', async ({ page }) => {
  await page.goto(`${base}chapters/thran/`);
  const preview = page.locator('[data-card-preview]').first();
  await expect(preview).toHaveAttribute('data-card-image-set', /normal\/front\/.*488w/);
});
