import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
const read = path => JSON.parse(readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8'));
const routes = read('src/data/translated-routes.json');
const printings = read('src/data/pt-printings.json').cards;
const base = '/mtg-history/';

test('every canonical route has a complete Portuguese page and reciprocal language links', async ({ request }) => {
  test.setTimeout(90_000);
  for (let start = 0; start < routes.length; start += 8) {
    await Promise.all(routes.slice(start, start + 8).map(async suffix => {
      const response = await request.get(`${base}pt-br/${suffix}`);
      expect(response.ok(), suffix).toBeTruthy();
      const html = await response.text();
      expect(html, suffix).toContain('<html lang="pt-BR"');
      expect(html, suffix).toContain(`hreflang="en" href="https://devisola.github.io${base}${suffix}"`);
      expect(html, suffix).toContain(`hreflang="pt-BR" href="https://devisola.github.io${base}pt-br/${suffix}"`);
      expect(html, suffix).toMatch(/<h1\b/);
    }));
  }
});

test('chapter illustrations use verified Portuguese variants and retain original references', async ({ page }) => {
  await page.goto(`${base}pt-br/chapters/thran/`);
  const figures = page.locator('.historical-card');
  expect(await figures.count()).toBeGreaterThan(0);
  for (const figure of await figures.all()) {
    const canonical = await figure.getAttribute('data-canonical-id');
    const expected = printings[canonical];
    await expect(figure).toHaveAttribute('data-displayed-id', expected?.id ?? canonical);
    await expect(figure).toHaveAttribute('data-language', expected ? 'pt' : 'en');
    if (expected) {
      await expect(figure.locator('.historical-card__source').last()).toHaveAttribute('href', /scryfall\.com\/card\/.+/);
      await expect(figure.locator('.historical-card__source').last()).toHaveText('Referência histórica: edição original ↗');
    }
  }
  await expect(page.locator('[data-translation-status]')).toContainText('Revisão editorial humana pendente');
});

test('Portuguese character and event pages retain complete narrative paragraphs', async ({ page }) => {
  const people = read('src/data/pt-br/characters.json');
  const events = read('src/data/pt-br/events.json');
  await page.goto(`${base}pt-br/characters/aboshan/`);
  for (const paragraph of people.aboshan.biography) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
  await page.goto(`${base}pt-br/events/akroma-created/`);
  for (const paragraph of events['akroma-created'].narrative) await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
});

for (const suffix of ['', 'timeline/', 'characters/aboshan/', 'events/akroma-created/', 'relationships/', 'archive/', 'discover/', 'chapters/thran/']) {
  test(`Portuguese ${suffix || 'home'} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(`${base}pt-br/${suffix}`);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(result.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  });
}
