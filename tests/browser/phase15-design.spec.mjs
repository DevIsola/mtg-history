import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

test.use({ reducedMotion: 'reduce' });
const base = '/mtg-history/';
const routes = ['', 'pt-br/', 'chapters/brothers-war/', 'pt-br/chapters/new-phyrexia/', 'timeline/', 'pt-br/timeline/', 'explore/', 'pt-br/explore/', 'characters/urza/', 'archive/', 'pt-br/archive/', 'search/'];
const printings = new Set(readdirSync(new URL('../../src/content/cards/', import.meta.url)).map(file => file.replace('.json', '')));

for (const route of routes) {
  test('editorial design: ' + (route || 'home'), async ({ page }, testInfo) => {
    if (testInfo.project.name === 'desktop-chromium') await page.setViewportSize({ width: 1440, height: 1080 });
    await page.goto(base + route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toHaveCount(1);
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('[data-theme-toggle]').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      await testInfo.attach(theme + '-axe', { body: JSON.stringify(audit.violations), contentType: 'application/json' });
      expect(audit.violations.filter(issue => ['serious', 'critical'].includes(issue.impact))).toEqual([]);
      await page.screenshot({ path: testInfo.outputPath(theme + '.png') });
      const reading = page.locator('.chapter-banner__start');
      if (await reading.count()) {
        await reading.click();
        await page.screenshot({ path: testInfo.outputPath('reading-' + theme + '.png') });
        await page.evaluate(() => scrollTo(0, 0));
      }
      if (route === 'timeline/' || route === 'archive/' || route === 'explore/') {
        const records = page.locator(route === 'timeline/' ? '[data-timeline-era]' : route === 'archive/' ? '.archive-chapter-index' : '.explore-directory');
        await records.first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: testInfo.outputPath('records-' + theme + '.png') });
        await page.evaluate(() => scrollTo(0, 0));
      }
    }
    if (route === 'timeline/' && page.viewportSize().width > 900) {
      const era = page.locator('[data-timeline-era]').first();
      const rail = await era.locator('.atlas-era__rail').boundingBox();
      const artwork = await era.locator('.atlas-era__artwork').boundingBox();
      const title = await era.locator('.atlas-era__content > h3').boundingBox();
      expect(rail.x + rail.width).toBeLessThanOrEqual(artwork.x);
      expect(artwork.x + artwork.width).toBeLessThanOrEqual(title.x);
    }
    const fit = await page.locator('.historical-card img, .printing-miniature img, .atlas-era__artwork img').evaluateAll(images => images.map(image => getComputedStyle(image).objectFit));
    expect(fit.every(value => value === 'contain')).toBe(true);
  });
}

test('homepage story links and chapter archive covers follow all eleven real chapter routes', async ({ page }) => {
  await page.goto(base);
  await expect(page.locator('.home-era-strip a')).toHaveCount(11);
  await page.locator('.home-era-strip a').filter({ hasText: 'Rise of New Phyrexia' }).click();
  await expect(page).toHaveURL(/chapters\/new-phyrexia\/$/);
  await expect(page.locator('.chapter-banner-facts')).toContainText('10 illustrated references');
  await page.goto(base + 'archive/');
  await expect(page.locator('.chapter-cover')).toHaveCount(11);
  await page.locator('.chapter-cover[href="#new-phyrexia"]').click();
  await expect(page.locator('#new-phyrexia [data-archive-card]')).toHaveCount(10);
});

test('palette suggestions search Pagefind and return canonical full-printing thumbnails', async ({ page }) => {
  await page.goto(base);
  await page.locator('.site-header__search').click();
  const dialog = page.locator('[data-search-palette]');
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-palette-suggestion="Yawgmoth"]').click();
  await expect(dialog.locator('[data-palette-query]')).toHaveValue('Yawgmoth');
  const image = dialog.locator('.search-palette__result-image').first();
  await expect(image).toBeVisible({ timeout: 15000 });
  const src = await image.getAttribute('src');
  expect(src).toContain('/small/front/');
  const id = src.split('/').pop().replace('.jpg', '');
  expect(printings.has(id)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('palette.png') });
  await dialog.locator('[data-palette-query]').press('ArrowDown');
  await expect(dialog.locator('.search-palette__result-link').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.site-header__search')).toBeFocused();
});

test('redesign remains readable at 320, 768 and 1440 pixels', async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['', 'explore/', 'timeline/', 'archive/', 'characters/urza/', 'chapters/brothers-war/']) {
      await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), route + ' at ' + width).toBeLessThanOrEqual(1);
    }
  }
});

test('Explore search call-to-action returns focus to the control that opened it', async ({ page }) => {
  await page.goto(base + 'explore/');
  const trigger = page.locator('.explore-reference [data-search-palette-trigger]');
  await trigger.click();
  await expect(page.locator('[data-search-palette]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
