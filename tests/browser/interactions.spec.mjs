import { test, expect } from '@playwright/test';

const root = '/mtg-history/';
const chapter = `${root}chapters/war-of-the-spark/`;

// These complement site.spec.mjs: they test behavior, not just route availability.
test('theme choice persists between pages', async ({ page }) => {
  await page.goto(root);
  const html = page.locator('html');
  const toggle = page.locator('[data-theme-toggle]');
  await expect(toggle).toBeVisible();
  // Astro renders the button before its component script attaches the click
  // handler. Wait until updateButton() replaces the initial accessible label;
  // otherwise a fast click (especially under parallel test load) does nothing.
  await expect(toggle).toHaveAttribute(
    'aria-label',
    /^(Switch to light theme|Switch to dark theme)$/,
  );

  const original = await html.getAttribute('data-theme');
  expect(['light', 'dark']).toContain(original);
  const next = original === 'light' ? 'dark' : 'light';

  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', next);
  await expect(toggle).toHaveAttribute(
    'aria-label',
    next === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
  );

  await page.goto(`${root}timeline/`);
  await expect(page.locator('html')).toHaveAttribute('data-theme', next);
});

test('character search shows an empty state and reset restores entries', async ({ page }) => {
  await page.goto(`${root}characters/`);
  const cards = page.locator('[data-character-card]');
  const initial = await cards.count();
  expect(initial).toBeGreaterThan(0);

  await page.locator('#character-search').fill('mtg-nonexistent-character-xyz');
  await expect(page.locator('#character-no-results')).toBeVisible();
  await expect(page.locator('[data-character-card]:visible')).toHaveCount(0);
  await expect(page.locator('#character-filter-status')).toContainText('Showing 0 of');

  await page.locator('#character-reset').click();
  await expect(page.locator('#character-no-results')).toBeHidden();
  await expect(page.locator('[data-character-card]:visible')).toHaveCount(initial);
  await expect(page.locator('#character-search')).toBeFocused();
});

test('encyclopedia search resets without losing records', async ({ page }) => {
  await page.goto(`${root}discover/`);
  const cards = page.locator('[data-discovery-record]');
  const initial = await cards.count();
  expect(initial).toBeGreaterThan(0);

  await page.locator('#discovery-search').fill('mtg-nonexistent-record-xyz');
  await expect(page.locator('#discovery-empty')).toBeVisible();
  await expect(page.locator('[data-discovery-record]:visible')).toHaveCount(0);

  await page.locator('#discovery-reset').click();
  await expect(page.locator('#discovery-empty')).toBeHidden();
  await expect(page.locator('[data-discovery-record]:visible')).toHaveCount(initial);
});

test('keyboard card preview can be dismissed with Escape', async ({ page }) => {
  await page.goto(chapter);
  const link = page.locator('[data-card-preview] a').first();
  await expect(link).toBeVisible();
  await link.scrollIntoViewIfNeeded();
  await link.focus();

  const preview = page.locator('#character-card-hover-preview');
  await expect(preview).toBeVisible();
  await expect(link).toHaveAttribute('aria-describedby', 'character-card-hover-preview');
  await page.keyboard.press('Escape');
  await expect(preview).toBeHidden();
  await expect(link).not.toHaveAttribute('aria-describedby', 'character-card-hover-preview');
});

test('desktop pointer preview opens and closes', async ({ page }) => {
  test.skip(test.info().project.name.startsWith('mobile'), 'Desktop pointer interaction');
  await page.goto(chapter);
  const link = page.locator('[data-card-preview] a').first();
  await link.hover();
  await expect(page.locator('#character-card-hover-preview')).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(page.locator('#character-card-hover-preview')).toBeHidden();
});

test('touch preview button toggles and closes on Escape', async ({ page }) => {
  test.skip(!test.info().project.name.startsWith('mobile'), 'Mobile touch interaction');
  await page.goto(chapter);
  const button = page.locator('[data-card-preview-button]').first();
  await expect(button).toBeVisible();
  await button.click();

  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#character-card-hover-preview')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#character-card-hover-preview')).toBeHidden();
});

test('mobile navigation opens and reaches a real page', async ({ page }) => {
  test.skip(!test.info().project.name.startsWith('mobile'), 'Mobile navigation');
  await page.goto(root);
  const menu = page.locator('details.mobile-navigation');
  const summary = menu.locator('summary');
  await expect(summary).toBeVisible();
  await summary.click();
  await expect(menu).toHaveAttribute('open', '');

  await menu.getByRole('link', { name: 'Characters' }).click();
  await expect(page).toHaveURL(/\/mtg-history\/characters\/?$/);
  await expect(page.locator('main h1')).toBeVisible();
});

test('mobile chapter menu Escape closes and restores focus', async ({ page }) => {
  test.skip(!test.info().project.name.startsWith('mobile'), 'Mobile chapter TOC');
  await page.goto(chapter);
  const toggle = page.locator('[data-chapter-toggle]');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});
