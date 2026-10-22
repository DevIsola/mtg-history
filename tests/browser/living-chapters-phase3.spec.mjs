import { test, expect } from '@playwright/test';
const base = '/mtg-history/chapters/';

test('chapter visual trail indexes actual illustrated card moments and deep-links in place', async ({ page }) => {
  await page.goto(base + 'thran/');
  const trail = page.getByRole('complementary', { name: 'Illustrated moments' });
  await expect(trail).toBeVisible();
  const moments = page.locator('.chapter-prose .historical-moment');
  const total = await moments.count();
  expect(total).toBeGreaterThan(1);
  await trail.locator('summary').click();
  await expect(trail.locator('ol li')).toHaveCount(total);
  const cardTitle = (await moments.first().locator('.historical-card__caption h3').textContent()).trim();
  await expect(trail.locator('ol li').first()).toContainText(cardTitle);
  await trail.locator('ol a').first().click();
  await expect(page).toHaveURL(/#chapter-artwork-01$/);
  await expect(moments.first()).toBeInViewport();
  // The printed reference, original artist and outside source link remain in place.
  await expect(moments.first().locator('.historical-card__credit')).toBeVisible();
  await expect(moments.first().locator('.historical-card__source')).toHaveAttribute('href', /scryfall\.com\/card\//);
});

test('opt-in highlighting never conceals historical text or external references', async ({ page }) => {
  await page.goto(base + 'war-of-the-spark/');
  const trail = page.locator('[data-chapter-artwork-trail]');
  const toggle = trail.locator('[data-artwork-follow]');
  await expect(toggle).not.toBeChecked();
  await toggle.check();
  await expect(page.locator('.chapter-theme')).toHaveAttribute('data-artwork-follow', 'true');
  await expect(page.locator('.chapter-prose .historical-moment[data-artwork-current="true"]')).toHaveCount(1);
  await toggle.uncheck();
  await expect(page.locator('.chapter-theme')).toHaveAttribute('data-artwork-follow', 'false');
  await expect(page.locator('.chapter-prose .historical-moment[data-artwork-current]')).toHaveCount(0);
});

test('small screens, reduced motion, and the original card viewer coexist', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base + 'ice-age/');
  await expect(page.locator('[data-chapter-artwork-trail]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator('.chapter-prose .historical-moment[data-living-reveal]')).toHaveCount(0);
  const image = page.locator('.chapter-prose .historical-moment [data-card-artwork-open]').first();
  await image.click();
  await expect(page.locator('#card-artwork-viewer')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#card-artwork-viewer')).not.toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the prose and exact Scryfall printing links remain readable', async ({ page }) => {
    await page.goto(base + 'thran/');
    await expect(page.locator('[data-chapter-artwork-trail]')).toBeHidden();
    await expect(page.locator('.chapter-prose .historical-moment').first()).toBeVisible();
    await expect(page.locator('.chapter-prose .historical-moment a[href*="scryfall.com/card/"]').first()).toBeAttached();
  });
});
