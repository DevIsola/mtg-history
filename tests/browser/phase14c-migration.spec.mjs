import { test, expect } from '@playwright/test';
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
      await expect(page.locator('link[hreflang="pt-BR"]')).toHaveCount(0);
      const printings = await page.locator('[data-printing-id]').evaluateAll(nodes => nodes.map(node => node.dataset.printingId));
      expect(printings.length).toBeGreaterThanOrEqual(locale ? ledger.printings[id].length : 6);
      expect(printings.every(printing => ledger.printings[id].some(p => p.id === printing))).toBe(true);
      if (locale) expect(printings).toEqual(ledger.printings[id].map(p => p.id));
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
  await page.locator('#a-missao-ao-nucleo-semente a').click();
  await expect(page).toHaveURL(/pt-br\/chapters\/new-phyrexia\/#a-missao-ao-nucleo-semente$/);
  await expect(page.locator('#a-missao-ao-nucleo-semente h2')).toBeVisible();
  await context.close();
});
