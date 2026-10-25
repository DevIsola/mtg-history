import { test, expect } from '@playwright/test';
const root = '/mtg-history/';

for (const [suffix, language, search] of [
  ['explore/', 'en', root + 'search/'],
  ['pt-br/explore/', 'pt-BR', root + 'pt-br/search/'],
]) {
  test(`${language} Explore offers verified collections and existing Pagefind search`, async ({ page }) => {
    await page.goto(root + suffix);
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    await expect(page.locator('[data-explore-landing] h1')).toBeVisible();
    await expect(page.locator(`.explore-reference a[href="${search}"]`)).toHaveCount(1);
    for (const destination of ['chapters', 'characters', 'events', 'relationships', 'archive', 'glossary', 'paths', 'directory']) {
      await expect(page.locator(`[data-explore-destination="${destination}"]`)).toHaveCount(1);
    }
    await expect(page.locator('.explore-hero__artifact a[href^="https://scryfall.com/card/"]')).toHaveCount(language === 'pt-BR' ? 2 : 1);
    await expect(page.locator('.explore-hero__artifact figcaption')).toContainText('#');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `https://devisola.github.io${root}explore/`);
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', `https://devisola.github.io${root}pt-br/explore/`);
  });
}

test('Portuguese Explore links translated destinations and links to translated chapters', async ({ page }) => {
  await page.goto(root + 'pt-br/explore/');
  await expect(page.locator('[data-explore-destination="relationships"]')).toHaveAttribute('href', root + 'pt-br/relationships/');
  await expect(page.locator('[data-explore-destination="directory"]')).toHaveAttribute('href', root + 'pt-br/discover/');
  await expect(page.locator('.explore-feature').first()).toHaveAttribute('href', root + 'pt-br/chapters/thran/');
  await page.locator('.site-header__languages summary').click();
  await expect(page.locator('.site-header__language-menu a[hreflang="en"]')).toHaveAttribute('href', root + 'explore/');
});

test('Explore is reachable through C1 navigation on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(root);
  await page.locator('[data-site-explore-menu] summary').click();
  await expect(page.locator(`[data-site-explore-menu] a[href="${root}explore/"]`)).toBeVisible();
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(root + 'explore/');
  await page.locator('.mobile-navigation summary').click();
  await expect(page.locator(`.mobile-navigation a[href="${root}explore/"]`)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });
  test('Explore remains usable and directs readers to existing directories', async ({ page }) => {
    await page.goto(root + 'explore/');
    await expect(page.locator('.explore-feature')).toHaveCount(3);
    await expect(page.locator('[data-explore-destination]')).toHaveCount(8);
    await expect(page.locator('[data-explore-destination="archive"]')).toHaveAttribute('href', root + 'archive/');
  });
});
