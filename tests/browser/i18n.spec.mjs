import { test, expect } from '@playwright/test';
const root = '/mtg-history/';

test('Portuguese home uses pt-BR and has reciprocal hreflang links', async ({ page }) => {
  const response = await page.goto(`${root}pt-br/`);
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('main h1')).toContainText('Cada mundo');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://devisola.github.io/mtg-history/pt-br/');
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://devisola.github.io/mtg-history/');
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', 'https://devisola.github.io/mtg-history/pt-br/');
  await expect(page.locator('main')).toContainText('Tradução em andamento');
});

test('home language switcher keeps existing English home reachable', async ({ page }) => {
  await page.goto(`${root}pt-br/`);
  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(new RegExp('/mtg-history/$'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('link', { name: 'Mudar para português brasileiro' })).toHaveAttribute('href', `${root}pt-br/`);
});

test('untranslated chapters retain English language and no false hreflang', async ({ page }) => {
  await page.goto(`${root}chapters/thran/`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(0);
});
