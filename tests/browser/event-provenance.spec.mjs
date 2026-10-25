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

for (const [prefix, pendingHeading] of [['', 'Primary-fiction review pending'], ['pt-br/', 'Revisão da ficção primária pendente']]) {
  test(`Koilos keeps its pending primary-fiction status in ${prefix || 'English'}`, async ({ page }) => {
    await page.goto(`${base}${prefix}events/battle-of-koilos/`);
    await expect(page.locator('.event-research-notice')).toBeVisible();
    await expect(page.getByRole('heading', { name: pendingHeading })).toBeVisible();
    await expect(page.locator('.event-evidence')).toHaveCount(0);
  });
}

test('Portuguese reviewed evidence keeps original source identity and translates its limitations', async ({ page }) => {
  await page.goto(`${base}pt-br/events/thran-glacian-stones-implanted/`);
  const panel = page.locator('.event-evidence');
  await expect(panel.getByRole('heading', { name: 'Evidências para alegações selecionadas' })).toBeVisible();
  await expect(panel).toContainText('Antigo período thran');
  await expect(panel).toContainText('não o próprio implante');
  await expect(panel.getByRole('link', { name: /Legendary Characters of Commander Legends/ }))
    .toHaveAttribute('href', /^https:\/\/magic\.wizards\.com\//);
});
