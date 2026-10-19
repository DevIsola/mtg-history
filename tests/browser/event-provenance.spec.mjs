import { expect, test } from '@playwright/test';

const base = '/mtg-history/';

test('reviewed historical event exposes bounded sources and relative chronology', async ({ page }) => {
  await page.goto(`${base}events/thran-glacian-stones-implanted/`);
  const panel = page.locator('.event-evidence');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('heading', { name: 'Evidence for selected claims' })).toBeVisible();
  await expect(panel).toContainText('Ancient Thran period');
  await expect(panel).toContainText('not the implantation itself');
  await expect(panel.getByRole('link', { name: /Legendary Characters of Commander Legends/ }))
    .toHaveAttribute('href', /^https:\/\/magic\.wizards\.com\//);
});

test('an unreviewed event does not present itself as source-certified', async ({ page }) => {
  await page.goto(`${base}events/legacy-weapon/`);
  await expect(page.locator('.historical-event-detail__narrative')).toBeVisible();
  await expect(page.locator('.event-evidence')).toHaveCount(0);
});
