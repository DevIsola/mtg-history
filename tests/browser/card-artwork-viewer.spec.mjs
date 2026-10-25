import { test, expect } from '@playwright/test';

const chapter = '/mtg-history/chapters/thran/';

test('enlarges the exact card printing and preserves both Scryfall links', async ({ page }) => {
  await page.goto(chapter);
  const card = page.locator('.chapter-prose .historical-card').first();
  const opener = card.locator('[data-card-artwork-open]');
  await expect(opener).toBeVisible();
  const id = await opener.getAttribute('data-printing-id');
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Glacian, Powerstone Engineer' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveAttribute('src', new RegExp(`${id}\\.jpg$`));
  await expect(dialog.locator('img')).toHaveAttribute('srcset', /small\/front\/.*146w, .*normal\/front\/.*488w, .*large\/front\/.*672w/);
  await expect(dialog.locator('[data-card-artwork-attribution]')).toContainText('Illustrated by');
  await expect(dialog.getByRole('link', { name: /exact printing on Scryfall/i })).toHaveAttribute('href', /scryfall\.com\/card\/cmr\/72/);
  await expect(card.locator('.historical-card__source')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('viewing another card replaces image and restores focus on close', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(chapter);
  const cards = page.locator('.chapter-prose .historical-card');
  const first = cards.nth(0).locator('[data-card-artwork-open]');
  const second = cards.nth(1).locator('[data-card-artwork-open]');
  const firstId = await first.getAttribute('data-printing-id');
  await first.click();
  await page.getByRole('button', { name: /close image/i }).click();
  await expect(first).toBeFocused();
  const secondId = await second.getAttribute('data-printing-id');
  expect(secondId).not.toBe(firstId);
  await second.click();
  await expect(page.locator('#card-artwork-viewer img')).toHaveAttribute('src', new RegExp(`${secondId}\\.jpg$`));
});

test('reduced-motion readers can open and close the dialog conventionally', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(chapter);
  const button = page.locator('[data-card-artwork-open]').first();
  await button.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(button).toBeFocused();
});

test('image CDN failure leaves card credit, interpretation and source accessible', async ({ page }) => {
  await page.route('https://cards.scryfall.io/**', (route) => route.abort());
  await page.goto(chapter);
  await page.locator('[data-card-artwork-open]').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-card-artwork-attribution]')).toContainText('Illustrated by');
  await expect(dialog.locator('[data-card-artwork-significance]')).not.toBeEmpty();
  await expect(dialog.getByRole('link', { name: /exact printing on Scryfall/i })).toHaveAttribute('href', /scryfall\.com\/card\//);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('leaves original image and source links accessible', async ({ page }) => {
    await page.goto(chapter);
    await expect(page.locator('[data-card-artwork-open]').first()).toBeVisible();
    await expect(page.locator('[data-card-artwork-open]').first()).toHaveAttribute('href', /cards\.scryfall\.io\/normal\/front\//);
    await expect(page.locator('.historical-card__enlarge')).toHaveCount(0);
    await expect(page.locator('.historical-moment .historical-card__source').first()).toHaveAttribute('href', /scryfall\.com\/card\//);
    await expect(page.locator('.historical-moment .historical-card img').first()).toHaveAttribute('alt', /illustrated by/i);
  });
});

for (const locale of ['', 'pt-br/']) {
  test(`${locale || 'en/'}card images enlarge on every Scryfall-linked surface without a separate button`, async ({ page }) => {
    for (const route of ['', 'timeline/', 'archive/', 'explore/', 'chapters/thran/']) {
      await page.goto(`/mtg-history/${locale}${route}`);
      const imageLink = page.locator('a[data-card-artwork-open]').first();
      await expect(imageLink.locator('img')).toHaveCount(1);
      await expect(page.locator('.historical-card__enlarge, button[data-card-artwork-open]')).toHaveCount(0);
      const id = await imageLink.getAttribute('data-printing-id');
      const url = page.url();
      await imageLink.focus();
      await imageLink.press('Space');
      const dialog = page.locator('#card-artwork-viewer');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('[data-card-artwork-image]')).toHaveAttribute('src', new RegExp(`${id}\\.jpg$`));
      await expect(dialog.locator('[data-card-artwork-source]')).toHaveAttribute('href', /scryfall\.com\/card\//);
      expect(page.url()).toBe(url);
      await page.keyboard.press('Escape');
      await expect(imageLink).toBeFocused();
    }
  });
}
