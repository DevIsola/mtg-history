import { test, expect } from '@playwright/test';

const base = '/mtg-history/';
const portuguese = `${base}pt-br/search/`;

test('PT-BR full-text search finds accented history terms and stays in Portuguese', async ({ page }) => {
  const response = await page.goto(portuguese);
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('searchbox', { name: 'Pesquisar o conteúdo em português' })).toBeVisible();
  await page.locator('#fulltext-query').fill('reparacao');
  await expect(page.locator('[data-fulltext-results] a').first()).toBeVisible({ timeout: 20000 });
  await expect(page.locator('[data-fulltext-status]')).toContainText('registros encontrados');
  const paths = await page.locator('[data-fulltext-results] a').evaluateAll(nodes => nodes.map(a => new URL(a.href).pathname));
  expect(paths.length).toBeGreaterThan(0);
  expect(paths.every(path => path.startsWith(`${base}pt-br/`))).toBe(true);
});

test('PT-BR search clears results for short inputs and handles no matching terms', async ({ page }) => {
  await page.goto(portuguese);
  const input = page.locator('#fulltext-query');
  await input.fill('reparação');
  await expect(page.locator('[data-fulltext-results] a').first()).toBeVisible({ timeout: 20000 });
  await input.fill('a');
  await expect(page.locator('[data-fulltext-status]')).toContainText('pelo menos dois caracteres');
  await expect(page.locator('[data-fulltext-results] a')).toHaveCount(0);
});

test('search language switch keeps English and Portuguese indexes separate', async ({ page }) => {
  await page.goto(portuguese);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://devisola.github.io/mtg-history/search/');
  const languages = page.locator('.site-header__languages');
  await languages.locator('summary').click();
  const english = languages.locator('a[hreflang="en"]');
  await expect(english).toHaveAttribute('href', `${base}search/`);
  await english.click();
  await expect(page).toHaveURL(/\/mtg-history\/search\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('#fulltext-query').fill('phthisis');
  await expect(page.locator('[data-fulltext-results] a').first()).toBeVisible({ timeout: 20000 });
  const englishLanguages = page.locator('.site-header__languages');
  await englishLanguages.locator('summary').click();
  const portugueseLink = englishLanguages.locator('a[hreflang="pt-BR"]');
  await expect(portugueseLink).toHaveAttribute('href', portuguese);
  await portugueseLink.click();
  await expect(page).toHaveURL(/\/mtg-history\/pt-br\/search\/$/);
});

test('PT-BR search fits narrow mobile widths', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(portuguese);
  await expect(page.getByRole('searchbox', { name: 'Pesquisar o conteúdo em português' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('Portuguese catalog fallback remains available', async ({ page }) => {
    await page.goto(portuguese);
    await expect(page.locator('noscript')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'A cronologia em português', exact: true })).toHaveAttribute('href', `${base}pt-br/timeline/`);
  });
});
