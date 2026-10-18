import { test, expect } from '@playwright/test';

const root = '/mtg-history/';

test('timeline filters historical eras and resets without hiding source records permanently', async ({ page }) => {
  await page.goto(`${root}timeline/`);
  const eras = page.locator('[data-timeline-era]');
  const initial = await eras.count();
  expect(initial).toBeGreaterThan(1);
  await expect(page.locator('#timeline-search')).toBeVisible();

  await page.locator('#timeline-era').selectOption('thran');
  await expect(page.locator('[data-timeline-era]:visible')).toHaveCount(1);
  await page.locator('#timeline-search').fill('zzzz-unmatched-timeline-xyz');
  await expect(page.locator('#timeline-empty')).toBeVisible();

  await page.locator('#timeline-reset').click();
  await expect(page.locator('#timeline-empty')).toBeHidden();
  await expect(page.locator('[data-timeline-era]:visible')).toHaveCount(initial);
  await expect(page.locator('#timeline-search')).toBeFocused();
});

test('timeline native event panels can be expanded and read', async ({ page }) => {
  await page.goto(`${root}timeline/`);
  const panels = page.locator('[data-timeline-details]');
  expect(await panels.count()).toBeGreaterThan(0);
  await page.locator('#timeline-expand').click();
  await expect(page.locator('#timeline-expand')).toHaveAttribute('aria-pressed', 'true');
  await expect(panels.first()).toHaveAttribute('open', '');
  await expect(panels.first().locator('a').first()).toHaveAttribute('href', /\/events\//);
});

test('relationship explorer opens from character deep link and traverses the network', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  await expect(page.locator('#network-person')).toHaveValue('urza');
  const visible = page.locator('[data-network-edge]:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  const firstFocusButton = visible.first().locator('button[data-network-focus]:visible');
  const nextId = await firstFocusButton.getAttribute('data-network-focus');
  expect(nextId).toBeTruthy();
  await firstFocusButton.click();
  await expect(page.locator('#network-person')).toHaveValue(nextId);
  await expect(page).toHaveURL(new RegExp('person=' + nextId));
  await expect(page.locator('#network-profile')).toHaveAttribute('href', new RegExp(`/characters/${nextId}/`));
});

test('relationship category filter is reversible', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  const first = page.locator('[data-network-edge]:visible').first();
  const category = await first.getAttribute('data-category');
  await page.locator('#network-category').selectOption(category);
  const visible = page.locator('[data-network-edge]:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  for (const value of await visible.evaluateAll((nodes) => nodes.map((node) => node.dataset.category))) {
    expect(value).toBe(category);
  }
  await page.locator('#network-reset').click();
  await expect(page.locator('#network-category')).toHaveValue('');
});

test('archive offers accessible gallery and compact layouts with chapter-local sorting', async ({ page }) => {
  await page.goto(`${root}archive/`);
  await page.locator('[data-archive-view="compact"]').click();
  await expect(page.locator('.archive-directory')).toHaveClass(/archive-directory--compact/);
  await expect(page.locator('[data-archive-view="compact"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#archive-sort').selectOption('title');
  const section = page.locator('[data-archive-section]').first();
  const titles = await section.locator('[data-archive-card]').evaluateAll((cards) => cards.map((card) => card.dataset.cardTitle));
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  await page.locator('[data-archive-view="grid"]').click();
  await expect(page.locator('.archive-directory')).not.toHaveClass(/archive-directory--compact/);
});

test('discover category navigation and alphabetical order work together', async ({ page }) => {
  await page.goto(`${root}discover/`);
  await page.locator('[data-discovery-tab][data-type="character"]').click();
  await expect(page.locator('#discovery-type')).toHaveValue('character');
  const visible = page.locator('[data-discovery-record]:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  const types = await visible.evaluateAll((nodes) => nodes.map((node) => node.dataset.type));
  expect(types.every((type) => type === 'character')).toBe(true);
  await page.locator('#discovery-sort').selectOption('alphabetical');
  const titles = await visible.evaluateAll((nodes) => nodes.map((node) => node.dataset.title));
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  await page.locator('#discovery-reset').click();
  await expect(page.locator('#discovery-type')).toHaveValue('');
});
