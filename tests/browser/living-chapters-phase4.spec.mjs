import { test, expect } from '@playwright/test';

const chapter = '/mtg-history/chapters/war-of-the-spark/';

test('opting into the illustration highlight never shifts its measured card position', async ({ page }) => {
  await page.goto(chapter);
  const moment = page.locator('.chapter-prose .historical-moment').first();
  const trail = page.locator('[data-chapter-artwork-trail]');
  await expect(trail).toBeVisible();
  const toggle = trail.locator('[data-artwork-follow]');
  const firstBox = await moment.boundingBox();
  await toggle.check();
  await expect(moment).toHaveAttribute('data-artwork-current', 'true');
  const highlightedBox = await moment.boundingBox();
  expect(highlightedBox?.height).toBeCloseTo(firstBox.height, 1);
  await toggle.uncheck();
  const restoredBox = await moment.boundingBox();
  expect(restoredBox?.height).toBeCloseTo(firstBox.height, 1);
  await expect(moment.locator('.historical-card__source')).toHaveAttribute('href', /scryfall\.com\/card\//);
});

test('chapter illustration reader remains usable at the narrowest and intermediate widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mtg-history/chapters/ice-age/');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(page.locator('.chapter-prose h2').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `Unexpected horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    await expect(page.locator('[data-chapter-artwork-trail]')).toBeVisible();
    const rawDurations = await page.locator('.historical-moment__illustration .historical-card img').first()
      .evaluate((img) => getComputedStyle(img).transitionDuration);
    // The global reduced-motion rule intentionally uses 0.01ms !important.
    // Chromium serializes this as 1e-05s rather than 0s; compare actual time.
    const durationsInSeconds = rawDurations.split(',').map((value) => {
      const token = value.trim();
      const magnitude = Number.parseFloat(token);
      return token.endsWith('ms') ? magnitude / 1000 : magnitude;
    });
    expect(durationsInSeconds.length).toBeGreaterThan(0);
    for (const seconds of durationsInSeconds) {
      expect(Number.isFinite(seconds), `Invalid CSS duration: ${rawDurations}`).toBe(true);
      expect(seconds, `Reduced-motion duration must be negligible: ${rawDurations}`)
        .toBeLessThanOrEqual(0.0001);
    }
  }
});

test('refreshing a chapter illustration deep link preserves provenance and in-page location', async ({ page }) => {
  await page.goto('/mtg-history/chapters/thran/');
  const trail = page.locator('[data-chapter-artwork-trail]');
  await trail.locator('summary').click();
  await trail.locator('ol a').last().click();
  const fragment = new URL(page.url()).hash;
  expect(fragment).toMatch(/^#chapter-artwork-/);
  await page.reload();
  await expect(page.locator(fragment)).toBeInViewport();
  await expect(page.locator(fragment).locator('.historical-card__credit')).toBeVisible();
  await expect(page.locator(fragment).locator('.historical-card__source')).toHaveAttribute('href', /scryfall\.com\/card\//);
});
