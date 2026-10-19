import { test, expect } from '@playwright/test';

const base = '/mtg-history/';

test('glossary directory is navigable and links to curated chapter context', async ({ page }) => {
  await page.goto(`${base}glossary/`);
  await expect(page.getByRole('heading', { name: /lore glossary/i })).toBeVisible();
  await expect(page.locator('.glossary-entry')).toHaveCount(10);
  const thran = page.locator('#thran');
  await expect(thran.getByRole('heading', { name: 'The Thran' })).toBeVisible();
  await expect(thran.locator('a[href*="chapters/thran/"]')).toHaveCount(1);
});

test('term opens on keyboard focus, Escape restores controls, and full entry link works', async ({ page }) => {
  await page.goto(`${base}chapters/thran/`);
  const item = page.locator('[data-lore-term]').first();
  const link = item.locator('.lore-term__link');
  const button = item.locator('[data-lore-button]');
  const panel = item.locator('[data-lore-panel]');
  await expect(button).toBeVisible();
  await link.focus();
  await expect(panel).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(button).toBeFocused();
  await button.press('Enter');
  await expect(panel).toBeVisible();
  await expect(panel.locator('a[href*="glossary/#"]')).toHaveCount(1);
});

test('pointer interactions and outside click close the definition', async ({ page }) => {
  await page.goto(`${base}chapters/omenpaths/`);
  const item = page.locator('[data-lore-term]').first();
  const button = item.locator('[data-lore-button]');
  const panel = item.locator('[data-lore-panel]');
  await button.press('Enter');
  await expect(panel).toBeVisible();
  await page.locator('.page-banner h1').click();
  await expect(panel).toBeHidden();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('terms remain normal navigable glossary links', async ({ page }) => {
    await page.goto(`${base}chapters/thran/`);
    const term = page.locator('[data-lore-term]').first();
    await expect(term.locator('.lore-term__link')).toHaveAttribute('href', /\/glossary\/#/);
    await expect(term.locator('[data-lore-button]')).toBeHidden();
    await expect(term.locator('.lore-term__link')).toBeVisible();
  });
});

test('mouse hovering a term opens its context without changing the link destination', async ({ page }) => {
  test.skip(test.info().project.name !== 'desktop-chromium', 'Pointer-hover test is desktop only');
  await page.goto(`${base}chapters/many-worlds/`);
  const item = page.locator('[data-lore-term]').first();
  const link = item.locator('.lore-term__link');
  const href = await link.getAttribute('href');
  await link.hover();
  await expect(item.locator('[data-lore-panel]')).toBeVisible();
  expect(await link.getAttribute('href')).toBe(href);
});

test('touch-friendly explanation button reveals the same definition', async ({ page }) => {
  test.skip(test.info().project.name !== 'mobile-chromium', 'Tap test is mobile only');
  await page.goto(`${base}chapters/omenpaths/`);
  const item = page.locator('[data-lore-term]').first();
  await item.locator('[data-lore-button]').tap();
  await expect(item.locator('[data-lore-panel]')).toBeVisible();
  await expect(item.locator('[data-lore-button]')).toHaveAttribute('aria-expanded', 'true');
});
