import { test, expect } from '@playwright/test';

const base = '/mtg-history/';

test('unavailable remote full-card images have an accessible replacement', async ({ page }) => {
  await page.route('https://cards.scryfall.io/**', (route) => route.abort('failed'));
  await page.goto(`${base}chapters/thran/`);
  const figure = page.locator('.historical-card').first();
  await figure.scrollIntoViewIfNeeded();
  const fallback = figure.locator('.card-image-fallback');
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveAttribute('role', 'img');
  await expect(fallback).toHaveAttribute('aria-label', /Glacian.*image unavailable/i);
  await expect(figure.locator('.historical-card__credit')).toContainText('Magali Villeneuve');
  await expect(figure.getByRole('link', { name: /View Glacian.*Scryfall/ }).first())
    .toHaveAttribute('href', /scryfall\.com/);
});

test('image-failure recovery is scoped to card images, not arbitrary site images', async ({ page }) => {
  await page.goto(base);
  await page.evaluate(() => {
    const image = document.createElement('img');
    image.id = 'external-broken-image';
    image.alt = 'Unrelated image';
    image.src = 'https://example.invalid/unrelated.jpg';
    document.body.appendChild(image);
    image.dispatchEvent(new Event('error'));
  });
  await expect(page.locator('#external-broken-image + .card-image-fallback')).toHaveCount(0);
});
