import { expect, test } from '@playwright/test';

const root = '/mtg-history/';

test('reading paths expose separate editorial routes and canonical evidence links', async ({ page }) => {
  await page.goto(`${root}paths/`);
  await expect(page.locator('[data-historical-path]')).toHaveCount(4);
  const index = page.locator('#entity-evidence');
  await expect(index).toBeVisible();
  await expect(index.getByRole('heading', { name: /Shared characters across chapters/i })).toBeVisible();
  await expect(index).toContainText('event in each chapter');
  const cards = index.locator('.entity-evidence__card');
  expect(await cards.count()).toBeGreaterThan(0);
  const links = index.locator('a[href*="/events/"]');
  expect(await links.count()).toBeGreaterThan(0);
  const first = links.first();
  const href = await first.getAttribute('href');
  expect(href).toMatch(/^\/mtg-history\/events\/[a-z0-9-]+\/$/);
});

test('chapter reader shows evidence-backed connections as a separate section', async ({ page }) => {
  await page.goto(`${root}chapters/thran/`);
  const sections = page.locator('[data-entity-continuity]');
  await expect(sections).toBeVisible();
  await expect(sections).toContainText('evidence-index links');
  await expect(sections.getByRole('link', { name: /Explore the full cross-chapter evidence index/i }))
    .toHaveAttribute('href', `${root}paths/#entity-evidence`);
  await expect(page.locator('[data-history-paths]')).toBeVisible();
});
