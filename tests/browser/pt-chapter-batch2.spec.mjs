import { test, expect } from '@playwright/test';

const base = '/mtg-history/';
const chapters = [
  ['otaria', 15, 20, 15],
  ['mending', 16, 12, 16],
  ['many-worlds', 13, 11, 11],
];

for (const [id, sectionCount, cardCount, eventCount] of chapters) {
  test(`PT-BR ${id}: narrative, source printing inventory and linked event records`, async ({ page }) => {
    const response = await page.goto(`${base}pt-br/chapters/${id}/`);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('[data-pt-batch-section]')).toHaveCount(sectionCount);
    await expect(page.locator('[data-pt-batch-narrative] p')).toHaveCount(sectionCount * 2);
    await expect(page.locator('[data-pt-batch-cards] .historical-card')).toHaveCount(cardCount);
    await expect(page.locator('[data-pt-batch-events] li')).toHaveCount(eventCount);
    await expect(page.locator('.pt-batch-notice')).toContainText('não é uma tradução integral');
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://devisola.github.io${base}pt-br/chapters/${id}/`);
    await expect(page.locator(`a[href="${base}chapters/${id}/"][hreflang="en"]`).first()).toBeVisible();
  });
}

test('PT-BR timeline advertises all seven adaptations and preserves canonical English links', async ({ page }) => {
  await page.goto(`${base}pt-br/timeline/`);
  for (const id of ['thran', 'brothers-war', 'ice-age', 'weatherlight', ...chapters.map(c => c[0])]) {
    await expect(page.locator(`a[href="${base}pt-br/chapters/${id}/"]`)).toBeVisible();
    await expect(page.locator(`a[href="${base}chapters/${id}/"][hreflang="en"]`)).toBeVisible();
  }
});

test('PT-BR Phase 8 chapters remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${base}pt-br/chapters/otaria/`);
    await expect(page.locator('[data-pt-batch-section]')).toHaveCount(15);
    await expect(page.locator('nav.pt-batch-toc a')).toHaveCount(15);
    await expect(page.locator('[data-pt-batch-events] li')).toHaveCount(15);
    await expect(page.locator('[data-pt-batch-cards] .historical-card')).toHaveCount(20);
  } finally {
    await context.close();
  }
});
