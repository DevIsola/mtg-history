import { test, expect } from '@playwright/test';

const route = '/mtg-history/pt-br/chapters/thran/';

test('expanded PT-BR Thran narrative covers every principal section without losing artwork', async ({ page }) => {
  const response = await page.goto(route);
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('[data-thran-pt-companion] > section > h2')).toHaveCount(13);
  await expect(page.locator('[data-thran-pt-companion] > section > h3')).toHaveCount(11);
  await expect(page.locator('[data-pt-depth]')).toHaveCount(13);
  await expect(page.locator('[data-pt-depth] > p')).toHaveCount(26);
  await expect(page.locator('.historical-moment')).toHaveCount(6);
  await expect(page.locator('[data-thran-pt-companion] a[hreflang="en"][href*="/events/"]')).toHaveCount(9);
});

test('expanded Thran retains visible source limits and an accessible English original', async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('.chapter-pt-note')).toContainText('não tradução integral');
  await expect(page.locator('a[href="/mtg-history/chapters/thran/"][hreflang="en"]').last()).toBeVisible();
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(0);
});

test('expanded Thran editorial passages remain readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(route);
    await expect(page.locator('[data-pt-depth]')).toHaveCount(13);
    await expect(page.locator('[data-pt-depth] > p')).toHaveCount(26);
    await expect(page.locator('[data-pt-depth] > p').first()).toBeVisible();
  } finally {
    await context.close();
  }
});
