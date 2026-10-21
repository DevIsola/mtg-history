import { test, expect } from '@playwright/test';
import { BATCH_1_IDS } from '../../src/data/pt-chapter-batch1.mjs';
import { BATCH_2_IDS } from '../../src/data/pt-chapter-batch2.mjs';
import { BATCH_3_IDS } from '../../src/data/pt-chapter-batch3.mjs';

const ids = ['thran', ...BATCH_1_IDS, ...BATCH_2_IDS, ...BATCH_3_IDS];
const base = '/mtg-history/pt-br/chapters/';
const categories = ['traducao', 'historico', 'arte', 'link', 'acessibilidade'];

test('all ten Portuguese reading editions include a report control and category choices', async ({ page }) => {
  for (const id of ids) {
    const result = await page.goto(`${base}${id}/`);
    expect(result?.ok(), id).toBeTruthy();
    const reporting = page.locator('[data-issue-report]');
    await expect(reporting).toHaveAttribute('data-issue-chapter', id);
    await reporting.locator('summary').click();
    for (const category of categories) {
      await expect(reporting.locator(`[data-issue-category="${category}"]`)).toBeVisible();
    }
  }
});

test('generated GitHub issue draft contains correct chapter, URL, and selected category', async ({ page }) => {
  await page.goto(`${base}omenpaths/`);
  await page.locator('[data-issue-report] summary').click();
  const link = page.locator('[data-issue-category="historico"]');
  const href = await link.getAttribute('href');
  const issue = new URL(href);
  expect(issue.origin).toBe('https://github.com');
  expect(issue.pathname).toBe('/DevIsola/mtg-history/issues/new');
  expect(issue.searchParams.get('title')).toContain('Precisão histórica');
  expect(issue.searchParams.get('body')).toContain('https://devisola.github.io/mtg-history/pt-br/chapters/omenpaths/');
  expect(issue.searchParams.get('body')).toContain('## Descrição do problema');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('Thran reporting is available with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${base}thran/`);
    await page.locator('[data-issue-report] summary').click();
    await expect(page.locator('[data-issue-report] a[data-issue-category]')).toHaveCount(5);
    await expect(page.locator('[data-issue-category="traducao"]')).toBeVisible();
  } finally { await context.close(); }
});
