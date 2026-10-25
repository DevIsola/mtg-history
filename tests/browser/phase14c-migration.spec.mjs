import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import ledger from '../../docs/phase14c-migration-identities.json' with { type: 'json' };

// Audit settled theme colors rather than sampling the 150ms color transition.
test.use({ reducedMotion: 'reduce' });
const base = '/mtg-history/';
for (const locale of ['', 'pt-br/']) {
  for (const id of ['new-phyrexia', 'march-of-the-machine']) {
    test(locale + id + ' preserves canonical printing inventory, metadata and responsive reading', async ({ page }) => {
      await page.goto(base + locale + 'chapters/' + id + '/');
      await expect(page.locator('h1')).toBeVisible();
      const href = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(href).toBe('https://devisola.github.io' + base + locale + 'chapters/' + id + '/');
      await expect(page.locator('link[hreflang="pt-BR"]')).toHaveAttribute('href', 'https://devisola.github.io' + base + 'pt-br/chapters/' + id + '/');
      const printings = await page.locator('.historical-card[data-canonical-id]').evaluateAll(nodes => nodes.map(node => node.dataset.canonicalId));
      const source = readFileSync(new URL(`../../src/content/chapters/${id}.mdx`, import.meta.url), 'utf8');
      const narrativeIds = [...source.matchAll(/<HistoricalMoment cardId=\{frontmatter\.cardIds\[(\d+)\]\}/g)].map(match => ledger.printings[id][Number(match[1])].id);
      expect(printings).toEqual(narrativeIds);
      expect(printings.every(printing => ledger.printings[id].some(p => p.id === printing))).toBe(true);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        expect(overflow).toBe(false);
        const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        expect(audit.violations.filter(issue => ['serious', 'critical'].includes(issue.impact))).toEqual([]);
        await page.screenshot({ path: test.info().outputPath(theme + '.png') });
      }
    });
  }
}

test('old English section links reach the moved material with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route('https://cards.scryfall.io/**', route => route.abort());
  const first = ledger.movedAnchors[0];
  await page.goto(base + 'chapters/march-of-the-machine/#' + first, { waitUntil: 'domcontentloaded' });
  for (const anchor of ledger.movedAnchors) {
    await expect(page.locator('[id="' + anchor + '"] a')).toHaveAttribute('href', '../new-phyrexia/#' + anchor);
  }
  await page.locator('[id="' + first + '"] a').click();
  await expect(page).toHaveURL(new RegExp('/chapters/new-phyrexia/#' + first + '$'));
  for (const anchor of ledger.movedAnchors) {
    await expect(page.locator('[id="' + anchor + '"]')).toBeVisible();
  }
  await page.goto(base + 'pt-br/chapters/march-of-the-machine/#a-missao-ao-nucleo-semente', { waitUntil: 'domcontentloaded' });
  const target = await page.locator('#a-missao-ao-nucleo-semente a').getAttribute('href');
  await page.locator('#a-missao-ao-nucleo-semente a').click();
  expect(decodeURI(new URL(page.url()).pathname + new URL(page.url()).hash)).toBe(target);
  await expect(page.locator('[id=' + JSON.stringify(decodeURIComponent(new URL(page.url()).hash.slice(1))) + ']')).toBeVisible();
  await context.close();
});
