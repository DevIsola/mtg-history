import { test, expect } from '@playwright/test';

const base = '/mtg-history/events/';

test('event with an unresolved canonical claim shows an actionable evidence gap', async ({ page }) => {
  await page.goto(`${base}mending-venser-first-walk/`);
  const section = page.locator('.event-evidence__gaps');
  await expect(section.getByRole('heading', { name: 'Claims still awaiting primary-source confirmation' })).toBeVisible();
  await expect(section).toContainText('divergent version of Dominaria');
  await expect(section).toContainText('Time Spiral (2006)');
  await expect(section).toContainText('Planar Chaos (2007)');
  await expect(section).toContainText('edition and page');
  await expect(section).toContainText('Secondary plot summaries are research leads, not primary confirmation.');
});

test('reviewed event with adequate narrow citation does not imply an unresolved gap', async ({ page }) => {
  await page.goto(`${base}phyrexia-seedcore-failure/`);
  await expect(page.locator('.event-evidence')).toHaveCount(1);
  await expect(page.locator('.event-evidence__gaps')).toHaveCount(0);
  await expect(page.locator('.event-evidence')).toContainText('Sources support the claims identified here');
});
