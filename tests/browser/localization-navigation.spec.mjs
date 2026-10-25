import { test, expect } from '@playwright/test';

const base = '/mtg-history/';
const origin = 'https://devisola.github.io';
const catalogs = [
  { route: 'timeline', heading: /Uma cronologia\s*do Multiverso/, records: '[data-timeline-era]', count: 11, detail: '.atlas-primary-link', kind: 'chapters' },
  { route: 'characters', heading: /Personagens do Multiverso/, records: '[data-character-card]', count: 88, detail: '.character-entry', kind: 'characters' },
  { route: 'events', heading: /Acontecimentos que moldaram o Multiverso/, records: '.historical-event-card', count: 133, detail: '.historical-event-card__action', kind: 'events' },
  { route: 'archive', heading: /O arquivo ilustrado/, records: '[data-archive-section]', count: 11, detail: '.archive-era__heading .text-link', kind: 'chapters' },
];

async function switchLanguage(page, language, expectedPath) {
  const menu = page.locator('.site-header__languages');
  await menu.locator('summary').click();
  const link = menu.locator(`a[hreflang="${language}"]`);
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', expectedPath);
  await link.click();
  await expect(page).toHaveURL(new RegExp(expectedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'));
  await expect(page.locator('html')).toHaveAttribute('lang', language);
}

test('home navigation keeps reciprocal English and full Portuguese reading experiences', async ({ page }) => {
  const response = await page.goto(`${base}pt-br/`);
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.locator('main h1')).toContainText('Cada mundo');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${base}pt-br/`);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${origin}${base}`);
  await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', `${origin}${base}pt-br/`);
  await expect(page.locator('main')).not.toContainText(/adaptação condensada|não é uma tradução integral/i);
  await switchLanguage(page, 'en', base);
  await switchLanguage(page, 'pt-BR', `${base}pt-br/`);
});

for (const catalog of catalogs) {
  test(`Portuguese ${catalog.route} keeps all records, local details and the matching language choice`, async ({ page }) => {
    const path = `${base}pt-br/${catalog.route}/`;
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('main h1')).toHaveText(catalog.heading);
    await expect(page.locator(catalog.records)).toHaveCount(catalog.count);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${origin}${base}${catalog.route}/`);
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', `${origin}${path}`);
    const localLinks = await page.locator(catalog.detail).evaluateAll(links => links.map(link => link.getAttribute('href')));
    expect(localLinks.length).toBe(catalog.count);
    for (const href of localLinks) expect(href).toMatch(new RegExp(`^${base}pt-br/${catalog.kind}/[a-z0-9-]+/(?:#chapter-reader)?$`));
    await switchLanguage(page, 'en', `${base}${catalog.route}/`);
    await switchLanguage(page, 'pt-BR', path);
    await page.locator(catalog.detail).first().click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page).toHaveURL(new RegExp(`${base}pt-br/${catalog.kind}/[a-z0-9-]+/`));
  });
}

const searchableCatalogs = [
  { route: 'timeline', records: '[data-timeline-era]', count: 11, search: '#timeline-search', name: 'Pesquisar na história', status: '#timeline-status', empty: '#timeline-empty', reset: '#timeline-reset', controls: '#timeline-controls' },
  { route: 'characters', records: '[data-character-card]', count: 88, search: '#character-search', name: 'Pesquisar personagens', status: '#character-filter-status', empty: '#character-no-results', reset: '#character-reset', controls: '#character-filters' },
  { route: 'archive', records: '[data-archive-card]', count: 136, search: '#archive-search', name: 'Pesquisar no arquivo', status: '#archive-filter-status', empty: '#archive-no-results', reset: '#archive-reset', controls: '#archive-filters' },
];
for (const catalog of searchableCatalogs) {
  test(`Portuguese ${catalog.route} filtering announces empty results and restores the complete collection`, async ({ page }) => {
    await page.goto(`${base}pt-br/${catalog.route}/`);
    const input = page.getByRole('searchbox', { name: catalog.name, exact: true });
    await expect(input).toBeVisible();
    await expect(page.locator(`${catalog.records}:visible`)).toHaveCount(catalog.count);
    await expect(page.locator(catalog.status)).toContainText(`Exibindo ${catalog.count}`);
    await input.fill('zzzxxy-no-record');
    await expect(page.locator(`${catalog.records}:visible`)).toHaveCount(0);
    await expect(page.locator(catalog.empty)).toBeVisible();
    await expect(page.locator(catalog.status)).toContainText('Exibindo 0');
    await page.locator(catalog.reset).click();
    await expect(page.locator(`${catalog.records}:visible`)).toHaveCount(catalog.count);
    await expect(page.locator(catalog.status)).toContainText(`Exibindo ${catalog.count}`);
    await expect(page.locator(catalog.empty)).toBeHidden();
  });
}

test('Portuguese era text remains searchable with the same canonical chapter ID', async ({ page }) => {
  await page.goto(`${base}pt-br/timeline/`);
  await page.locator('#timeline-era').selectOption('mending');
  await page.getByRole('searchbox', { name: 'Pesquisar na história', exact: true }).fill('reparação');
  await expect(page.locator('[data-timeline-era]:visible')).toHaveCount(1);
  await expect(page.locator('[data-timeline-era]:visible .atlas-primary-link')).toHaveAttribute('href', `${base}pt-br/chapters/mending/#chapter-reader`);
});

test('all Portuguese directories and their local record links remain readable without JavaScript', async ({ page, browser }) => {
  await page.goto(`${base}pt-br/events/`);
  const absoluteBase = new URL(`${base}pt-br/`, page.url()).href;
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const noScriptPage = await context.newPage();
    for (const catalog of catalogs) {
      await noScriptPage.goto(`${absoluteBase}${catalog.route}/`);
      await expect(noScriptPage.locator(`${catalog.records}:visible`)).toHaveCount(catalog.count);
      await expect(noScriptPage.locator(catalog.detail).first()).toBeVisible();
      const enhanced = searchableCatalogs.find(entry => entry.route === catalog.route);
      if (enhanced) await expect(noScriptPage.locator(enhanced.controls)).toBeHidden();
    }
    await noScriptPage.locator(catalogs.find(entry => entry.route === 'archive').detail).first().click();
    await expect(noScriptPage.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(noScriptPage.locator('main .chapter-prose')).toBeVisible();
  } finally {
    await context.close();
  }
});
