import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { PORTUGUESE_BATCH_3 } from '../../src/data/pt-chapter-batch3.mjs';

const base = '/mtg-history/';

function sourceCounts(id) {
  const file = new URL(`../../src/content/chapters/${id}.mdx`, import.meta.url);
  const mdx = readFileSync(file, 'utf8');
  const cardBlock = mdx.match(/^cardIds:\s*\r?\n((?:^  - [^\r\n]+\r?\n?)+)/m)?.[1];
  if (!cardBlock) throw new Error(`Missing card IDs for ${id}`);
  return {
    cards: cardBlock.split(/\r?\n/).filter(Boolean).length,
    events: [...mdx.matchAll(/<HistoricalEventReference\b[^>]*\bid="([^"]+)"/g)].length,
  };
}

for (const chapter of PORTUGUESE_BATCH_3) {
  test(`PT-BR ${chapter.id}: Portuguese reading and canonical resources`, async ({ page }) => {
    const response = await page.goto(`${base}pt-br/chapters/${chapter.id}/`);
    expect(response?.ok()).toBeTruthy();
    const canonical = sourceCounts(chapter.id);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('[data-pt-batch-section]')).toHaveCount(chapter.sections.length);
    await expect(page.locator('[data-pt-batch-narrative] p')).toHaveCount(chapter.sections.length * 2);
    await expect(page.locator('[data-pt-batch-cards] .historical-card')).toHaveCount(canonical.cards);
    await expect(page.locator('[data-pt-batch-events] li')).toHaveCount(canonical.events);
    await expect(page.locator('.pt-batch-notice')).toContainText('não é uma tradução integral');
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://devisola.github.io${base}pt-br/chapters/${chapter.id}/`);
    await expect(page.locator(`a[href="${base}chapters/${chapter.id}/"][hreflang="en"]`).first()).toBeVisible();
  });
}

test('PT-BR timeline exposes all ten adapted chapters while retaining English chapter links', async ({ page }) => {
  await page.goto(`${base}pt-br/timeline/`);
  const ids = ['thran','brothers-war','ice-age','weatherlight','otaria','mending','many-worlds', ...PORTUGUESE_BATCH_3.map(c => c.id)];
  for (const id of ids) {
    await expect(page.locator(`a[href="${base}pt-br/chapters/${id}/"]`)).toBeVisible();
    await expect(page.locator(`a[href="${base}chapters/${id}/"][hreflang="en"]`)).toBeVisible();
  }
});

test('PT-BR Phase 9 chapter remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const chapter = PORTUGUESE_BATCH_3[2];
    await page.goto(`${base}pt-br/chapters/${chapter.id}/`);
    await expect(page.locator('[data-pt-batch-section]')).toHaveCount(chapter.sections.length);
    await expect(page.locator('nav.pt-batch-toc a')).toHaveCount(chapter.sections.length);
    await expect(page.locator('[data-pt-batch-events] li')).toHaveCount(sourceCounts(chapter.id).events);
  } finally {
    await context.close();
  }
});
