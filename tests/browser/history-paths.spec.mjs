import { expect, test } from '@playwright/test';

const base = '/mtg-history/';

test('four canonical reading paths render as navigable event-to-chapter routes', async ({ page }) => {
  await page.goto(`${base}paths/`);
  await expect(page.getByRole('heading', { name: /Stories across the chapters/i })).toBeVisible();
  const paths = page.locator('[data-historical-path]');
  await expect(paths).toHaveCount(4);
  for (const path of await paths.all()) {
    await expect(path.locator('ol li')).toHaveCount(await path.locator('a[href*="/events/"]').count());
    await expect(path.locator('a[href*="/chapters/"]')).toHaveCount(await path.locator('ol li').count());
  }
  await paths.first().getByRole('link', { name: 'The Rise of Yawgmoth' }).click();
  await expect(page).toHaveURL(/\/events\/rise-of-yawgmoth\/$/);
});

test('chapters expose cross-era continuation without replacing sequential navigation', async ({ page }) => {
  await page.goto(`${base}chapters/thran/`);
  const section = page.locator('[data-history-paths]');
  await expect(section).toBeVisible();
  await expect(section.getByText('The long shadow of Phyrexia')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Chapter navigation' })).toBeVisible();
  await section.getByRole('link', { name: 'The long shadow of Phyrexia' }).click();
  await expect(page).toHaveURL(/\/paths\/#phyrexian-legacy$/);
  await expect(page.locator('#phyrexian-legacy')).toBeInViewport();
});

test('historical paths remain usable with scripts disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${base}paths/`);
    await expect(page.locator('[data-historical-path]')).toHaveCount(4);
    await expect(page.getByRole('link', { name: 'Read chapter →' }).first()).toBeVisible();
  } finally {
    await context.close();
  }
});
