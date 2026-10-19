import { test, expect } from '@playwright/test';

const root = '/mtg-history/';

test('the Thran chapter shows canonical Glacian printing with contextual significance', async ({ page }) => {
  await page.goto(`${root}chapters/thran/`);
  const figure = page.locator('.historical-card').first();
  await expect(figure.getByRole('img', {
    name: 'Glacian, Powerstone Engineer, illustrated by Magali Villeneuve',
  })).toBeVisible();
  await expect(figure.locator('.historical-card__credit')).toContainText('CMR');
  await expect(figure.locator('.historical-card__credit')).toContainText('#72');
  await expect(figure.locator('.historical-card__significance')).toContainText('powerstones');
});

test('the Urza profile renders its exact featured printing and local interpretation', async ({ page }) => {
  await page.goto(`${root}characters/urza/`);
  const figure = page.locator('.character-profile__aside .historical-card');
  await expect(figure.getByRole('img', { name: /Urza, Lord Protector, illustrated by Ryan Pancoast/ })).toBeVisible();
  await expect(figure.locator('.historical-card__significance')).toContainText('Brothers');
});

test('event illustration is selected by exact printing ID', async ({ page }) => {
  await page.goto(`${root}events/omenpaths-desparking-consequences/`);
  await expect(page.locator('.historical-card img')).toHaveAttribute('src', /248c76d3-b5cb-4582-be17-7cd1d0cb0f58/);
});
