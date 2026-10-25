import { test, expect } from '@playwright/test';
const base = '/mtg-history/';

test('English archive retains full canonical inventory and interpretation', async ({page}) => {
  await page.goto(base + 'archive/');
  await expect(page.locator('[data-archive-card]')).toHaveCount(136);
  await expect(page.locator('[data-archive-card]').first()).toHaveAttribute('data-canonical-id', /^[a-f\d-]{36}$/i);
  await expect(page.locator('.archive-card__classification').first()).toContainText('Illustrative reference');
});
test('Portuguese archive is a complete gallery with explicit language and canonical record', async ({page}) => {
  await page.goto(base + 'pt-br/archive/');
  await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
  await expect(page.locator('[data-archive-card]')).toHaveCount(136);
  await expect(page.locator('[data-archive-card]').first().locator('a[href^="https://scryfall.com/card/"]')).toHaveCount(1);
  await expect(page.locator('[data-archive-card]').first()).toHaveAttribute('data-canonical-id', /^[a-f\d-]{36}$/i);
  await expect(page.locator('.archive-card__classification').first()).toContainText('Referência ilustrativa');
});
test('Ko-fi header stays accessible on desktop and mobile', async ({page}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({width,height:760});
    await page.goto(base + 'pt-br/archive/');
    const link = page.locator('.site-header__support');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href','https://ko-fi.com/B1H328PBAR');
    expect(await page.evaluate(() => document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});
