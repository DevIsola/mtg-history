import { test, expect } from '@playwright/test';
const root = '/mtg-history/';

test('Cmd+K opens keyboard accessible dialog, Escape closes and returns focus', async ({ page }) => {
  await page.goto(root + 'explore/');
  const trigger = page.locator('[data-search-palette-trigger]');
  await trigger.focus();
  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.locator('[data-search-palette]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-palette-query]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('English palette uses indexed documents, keyboard selection and full search fallback', async ({ page }) => {
  await page.goto(root + 'chapters/thran/');
  await page.locator('[data-search-palette-trigger]').click();
  const dialog = page.locator('[data-search-palette]');
  await expect(dialog.locator('a[href="'+root+'search/"]')).toHaveCount(1);
  await dialog.locator('[data-palette-query]').fill('Yawgmoth');
  await expect(dialog.locator('[data-palette-results] a').first()).toBeVisible();
  await dialog.locator('[data-palette-query]').press('ArrowDown');
  await expect(dialog.locator('[data-palette-results] a').first()).toBeFocused();
  const urls = await dialog.locator('[data-palette-results] a').evaluateAll(links => links.map(a => a.getAttribute('href')));
  expect(urls.every(url => url?.startsWith(root) && !url.startsWith(root+'pt-br/'))).toBe(true);
});

test('Portuguese pages keep Portuguese-only palette results', async ({ page }) => {
  await page.goto(root + 'pt-br/explore/');
  await page.locator('[data-search-palette-trigger]').click();
  const dialog = page.locator('[data-search-palette]');
  await expect(dialog.locator('a[href="'+root+'pt-br/search/"]')).toHaveCount(1);
  await dialog.locator('[data-palette-query]').fill('Phyrexia');
  await expect(dialog.locator('[data-palette-results] a').first()).toBeVisible();
  const urls = await dialog.locator('[data-palette-results] a').evaluateAll(links => links.map(a => a.getAttribute('href')));
  expect(urls.every(url => url?.startsWith(root+'pt-br/'))).toBe(true);
});

test('320px palette fits the viewport and is dismissible by button', async ({ page }) => {
  await page.setViewportSize({width:320,height:700});
  await page.goto(root + 'pt-br/');
  await page.locator('[data-search-palette-trigger]').click();
  const dialog = page.locator('[data-search-palette]');
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await dialog.locator('[data-palette-close]').click();
  await expect(dialog).toBeHidden();
});

test.describe('without JavaScript', () => {
  test.use({javaScriptEnabled:false});
  test('search control remains a real search-page link', async ({ page }) => {
    await page.goto(root + 'pt-br/');
    await page.locator('[data-search-palette-trigger]').click();
    await expect(page).toHaveURL(new RegExp('/mtg-history/pt-br/search/$'));
  });
});
