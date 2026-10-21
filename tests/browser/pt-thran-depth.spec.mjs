import { test, expect } from '@playwright/test';

const url = '/mtg-history/pt-br/chapters/thran/';

test('Thran PT-BR includes thirteen major and eleven editorial subsection headings', async ({ page }) => {
  const response = await page.goto(url);
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('[data-thran-pt-companion] h2')).toHaveCount(13);
  await expect(page.locator('[data-thran-pt-companion] > section > h3')).toHaveCount(11);
  await expect(page.locator('.historical-moment')).toHaveCount(6);
});

test('PT-BR Thran exposes the nine original event references as English-only links', async ({ page }) => {
  await page.goto(url);
  const englishLinks = page.locator('[data-thran-pt-companion] a[hreflang="en"][href*="/events/"]');
  await expect(englishLinks).toHaveCount(9);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(0);
  await expect(page.locator('.chapter-pt-note')).toContainText('não tradução integral');
});

test('new Thran editorial subsections are available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(url);
    await expect(page.locator('[data-thran-pt-companion] > section > h3')).toHaveCount(11);
    await expect(page.locator('[data-thran-pt-companion] > section > h3').first()).toBeVisible();
  } finally {
    await context.close();
  }
});
