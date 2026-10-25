import { test, expect } from '@playwright/test';

const chapterUrl = '/mtg-history/chapters/thran/';

test('scrolling progressively reveals contextual cards without hiding content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(chapterUrl);
  const pending = page.locator('.chapter-prose .historical-moment[data-living-reveal="pending"]');
  await expect.poll(() => pending.count()).toBeGreaterThan(0);
  const target = page.locator('.chapter-prose .historical-moment').last();
  await expect(target).toHaveAttribute('data-living-reveal', 'pending');
  await expect(target.locator('.historical-card > a[data-card-artwork-open][data-card-source*="scryfall.com/card/"]')).toHaveCount(1);
  await expect(target.locator('.historical-card__source[href*="scryfall.com/card/"]')).toHaveCount(1);
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveAttribute('data-living-reveal', 'visible');
  await expect(target).toHaveCSS('opacity', '1');
  await expect(target.locator('img')).toHaveAttribute('alt', /illustrated by/i);
});

test('reduced-motion setting leaves every illustrated moment fully visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(chapterUrl);
  await expect(page.locator('.chapter-prose .historical-moment').first()).toBeVisible();
  await expect(page.locator('[data-living-reveal]')).toHaveCount(0);
});

test('incoming anchor navigation does not animate the visible target', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${chapterUrl}#chapter-reader`);
  await expect(page.locator('#chapter-reader')).toBeInViewport();
  // Deep links must never acquire temporary reveal cues, even before the
  // IntersectionObserver can react to the browser's fragment scroll.
  await expect(page.locator('.chapter-prose [data-living-reveal]')).toHaveCount(0);
  const revealedState = await page.evaluate(() => [...document.querySelectorAll('.chapter-prose h2, .chapter-prose .historical-moment')]
    .filter((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top >= 0 && bounds.top < innerHeight && bounds.height > 0;
    })
    .map((element) => element.getAttribute('data-living-reveal')));
  expect(revealedState).not.toContain('pending');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the historical narrative and card links remain accessible', async ({ page }) => {
    await page.goto(chapterUrl);
    await expect(page.locator('.chapter-prose h2').first()).toBeVisible();
    await expect(page.locator('.historical-moment').first()).toBeVisible();
    await expect(page.locator('.historical-moment a[href*="scryfall.com/card/"]').first()).toBeAttached();
    await expect(page.locator('[data-living-reveal]')).toHaveCount(0);
  });
});
