import { test, expect } from '@playwright/test';
const base = '/mtg-history/';
const chapters = [
  ['brothers-war', 8, 11, 12],
  ['ice-age', 10, 11, 12],
  ['weatherlight', 13, 22, 21],
];

for (const [id, sections, cards, events] of chapters) {
  test(`PT-BR ${id}: translated reading, canonical art and event links`, async ({ page }) => {
    const response = await page.goto(`${base}pt-br/chapters/${id}/`);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('[data-pt-batch-section]')).toHaveCount(sections);
    await expect(page.locator('[data-pt-batch-narrative] p')).toHaveCount(sections * 2);
    await expect(page.locator('[data-pt-batch-cards] .historical-card')).toHaveCount(cards);
    await expect(page.locator('[data-pt-batch-events] li')).toHaveCount(events);
    await expect(page.locator('.pt-batch-notice')).toContainText('não é uma tradução integral');
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://devisola.github.io${base}pt-br/chapters/${id}/`);
    await expect(page.locator(`a[href="${base}chapters/${id}/"][hreflang="en"]`).first()).toBeVisible();
  });
}

test('Portuguese timeline links all four adapted chapters', async ({ page }) => {
  await page.goto(`${base}pt-br/timeline/`);
  for (const id of ['thran', ...chapters.map(c => c[0])]) {
    await expect(page.locator(`a[href="${base}pt-br/chapters/${id}/"]`)).toBeVisible();
  }
});

test('Portuguese chapter narratives work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${base}pt-br/chapters/weatherlight/`);
    await expect(page.locator('[data-pt-batch-section]')).toHaveCount(13);
    await expect(page.locator('[data-pt-batch-events] li')).toHaveCount(21);
    await expect(page.locator('nav.pt-batch-toc a')).toHaveCount(13);
  } finally {
    await context.close();
  }
});
