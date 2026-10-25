import { test, expect } from '@playwright/test';
const base = '/mtg-history/';

test('English character directory has 88 exact-printing portraits and retains filtering', async ({ page }) => {
  await page.goto(base + 'characters/');
  await expect(page.locator('[data-character-card]')).toHaveCount(88);
  await expect(page.locator('[data-character-portrait]')).toHaveCount(88);
  const first = page.locator('[data-character-portrait]').first();
  await expect(first).toHaveAttribute('data-canonical-id', /^[a-f0-9-]{36}$/i);
  await expect(first).toHaveAttribute('data-printing-id', /^[a-f0-9-]{36}$/i);
  await expect(first).toHaveAttribute('data-language', 'en');
  await page.locator('#character-search').fill('Urza');
  await expect(page.locator('[data-character-card]:visible').first()).toBeVisible();
  await page.locator('#character-reset').click();
  await expect(page.locator('[data-character-card]:visible')).toHaveCount(88);
});

test('Portuguese directory uses verified alternatives without losing canonical identity', async ({ page }) => {
  await page.goto(base + 'pt-br/characters/');
  await expect(page.locator('[data-character-card]')).toHaveCount(88);
  await expect(page.locator('[data-character-portrait]')).toHaveCount(88);
  const portraits = page.locator('[data-character-portrait]');
  const count = await portraits.count();
  for (let i = 0; i < count; i++) {
    const p = portraits.nth(i);
    const lang = await p.getAttribute('data-language');
    expect(['en', 'pt']).toContain(lang);
    if (lang === 'en') expect(await p.getAttribute('data-printing-id')).toBe(await p.getAttribute('data-canonical-id'));
  }
  for (const href of await page.locator('[data-character-card]').evaluateAll(cards => cards.map(card => card.getAttribute('href')))) {
    expect(href).toMatch(/^\/mtg-history\/pt-br\/characters\/[a-z0-9-]+\/$/);
  }
  await page.getByRole('searchbox', { name: 'Pesquisar personagens' }).fill('Urza');
  await expect(page.locator('[data-character-card]:visible').first()).toBeVisible();
});

test('character biography presents navigable evidence sections and a curated card', async ({ page }) => {
  await page.goto(base + 'characters/urza/');
  await expect(page.locator('.character-profile__sections')).toBeVisible();
  await expect(page.locator('#character-biography')).toBeVisible();
  await expect(page.locator('.character-profile__aside')).toBeVisible();
  await expect(page.locator('#character-reference a[href^="https://"]')).toHaveCount(1);
});

test('character directories remain within 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const route of ['characters/', 'pt-br/characters/']) {
    await page.goto(base + route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
});
