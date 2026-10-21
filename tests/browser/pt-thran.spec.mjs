import { test, expect } from '@playwright/test';

const base = '/mtg-history/';
const companion = `${base}pt-br/chapters/thran/`;

test('Portuguese Thran companion is a readable and accurately attributed page', async ({ page }) => {
  const response = await page.goto(companion);
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('main h1')).toContainText('Os Thran e as origens de Phyrexia');
  await expect(page.locator('article[data-thran-pt-companion] section')).toHaveCount(13);
  await expect(page.locator('.historical-moment')).toHaveCount(6);
  await expect(page.locator('.chapter-pt-note')).toContainText('não tradução integral');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://devisola.github.io/mtg-history/pt-br/chapters/thran/');
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(0);
  await expect(page.locator('a[href="/mtg-history/chapters/thran/"][hreflang="en"]')).not.toHaveCount(0);
});

test('Thran companion table of contents reaches the chapter sections', async ({ page }) => {
  await page.goto(companion);
  await page.locator('.chapter-pt-toc a[href="#dyfed"]').click();
  await expect(page).toHaveURL(/#dyfed$/);
  await expect(page.locator('section#dyfed h2')).toContainText('Dyfed');
});

test('Portuguese timeline provides both the companion and the English canonical chapter', async ({ page }) => {
  await page.goto(`${base}pt-br/timeline/`);
  await expect(page.locator('a[href="/mtg-history/pt-br/chapters/thran/"]')).toBeVisible();
  await expect(page.locator('a[href="/mtg-history/chapters/thran/"][hreflang="en"]')).toBeVisible();
  await page.locator('a[href="/mtg-history/pt-br/chapters/thran/"]').click();
  await expect(page).toHaveURL(/\/pt-br\/chapters\/thran\/$/);
});

test('Thran companion remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(companion);
    await expect(page.locator('article[data-thran-pt-companion] section')).toHaveCount(13);
    await expect(page.locator('.chapter-pt-toc a')).toHaveCount(13);
  } finally {
    await context.close();
  }
});
