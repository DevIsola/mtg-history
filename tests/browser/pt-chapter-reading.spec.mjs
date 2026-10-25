import { readFileSync, readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { chapterStructure } from '../../scripts/check-full-localization.mjs';

const base = '/mtg-history/';
const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const printings = JSON.parse(read('src/data/pt-printings.json')).cards;
const eventTranslations = JSON.parse(read('src/data/pt-br/events.json'));
const paragraphSelector = '.chapter-prose > p, .historical-moment__narrative > p';
const chapterIds = readdirSync(new URL('../../src/content/chapters/', import.meta.url))
  .filter(file => file.endsWith('.mdx')).map(file => file.slice(0, -4)).sort();

function chapterFixture(id) {
  const source = read(`src/content/chapters/${id}.mdx`);
  const translated = chapterStructure(read(`src/content/chapters-pt/${id}.mdx`));
  const canonical = chapterStructure(source);
  const moments = [...source.matchAll(/<HistoricalMoment\s+cardId=\{frontmatter\.cardIds\[(\d+)\]\}/g)].map(match => {
    const index = Number(match[1]);
    const canonicalId = canonical.metadata.cardIds[index];
    const printing = JSON.parse(read(`src/content/cards/${canonicalId}.json`));
    const variant = printings[canonicalId];
    return {
      canonicalId, displayId: variant?.id ?? canonicalId, language: variant ? 'pt' : 'en',
      name: variant?.printedName ?? printing.name, artist: variant?.artist ?? printing.artist,
      sourceUrl: `https://scryfall.com/card/${printing.setCode}/${printing.collectorNumber}${variant ? '/pt' : ''}`,
      originalUrl: `https://scryfall.com/card/${printing.setCode}/${printing.collectorNumber}`,
      significance: translated.metadata.cards[index].significance,
    };
  });
  return {
    ...translated, moments,
    eventIds: [...source.matchAll(/<HistoricalEventReference\b[^>]*\bid="([^"]+)"/g)].map(match => match[1]),
    sourceUrls: canonical.metadata.sources.filter(source => source.url).map(source => source.url),
  };
}

for (const id of chapterIds) {
  test(`PT-BR ${id}: full reader preserves paragraph coverage, historical references and exact display variants`, async ({ page, request }) => {
    const fixture = chapterFixture(id);
    const english = await request.get(`${base}chapters/${id}/`);
    expect(english.ok()).toBeTruthy();
    const englishHtml = await english.text();
    const response = await page.goto(`${base}pt-br/chapters/${id}/`);
    expect(response?.ok()).toBeTruthy();
    const paragraphCount = await page.evaluate(({ html, selector }) => new DOMParser().parseFromString(html, 'text/html').querySelectorAll(selector).length,
      { html: englishHtml, selector: paragraphSelector });
    await expect(page.locator(paragraphSelector)).toHaveCount(paragraphCount);
    await expect(page.locator('.chapter-prose > h2, .historical-moment__narrative > h2')).toHaveCount(fixture.headingLevels.filter(level => level === 2).length);
    await expect(page.locator('.chapter-prose > h3, .historical-moment__narrative > h3')).toHaveCount(fixture.headingLevels.filter(level => level === 3).length);
    await expect(page.locator('[data-translation-status="complete-pending-review"]')).toContainText('Revisão editorial humana pendente');

    const cards = await page.locator('.chapter-prose .historical-card').evaluateAll(figures => figures.map(figure => {
      const button = figure.querySelector('[data-card-artwork-open]');
      const sourceLinks = figure.querySelectorAll('.historical-card__source');
      return {
        canonicalId: figure.dataset.canonicalId, displayId: figure.dataset.displayedId, language: figure.dataset.language,
        imageUrl: figure.querySelector('img').getAttribute('src'),
        viewerCanonicalId: button.dataset.canonicalId, viewerDisplayId: button.dataset.printingId,
        sourceUrl: sourceLinks[0].getAttribute('href'), originalUrl: sourceLinks[sourceLinks.length - 1].getAttribute('href'),
        name: figure.querySelector('h3').textContent.trim(),
        significance: figure.querySelector('.historical-card__significance').textContent.trim(),
        languageLabel: figure.querySelector('.historical-card__language').textContent.trim(),
      };
    }));
    expect(cards).toHaveLength(fixture.moments.length);
    cards.forEach((card, index) => {
      const expected = fixture.moments[index];
      expect(card.canonicalId).toBe(expected.canonicalId);
      expect(card.displayId).toBe(expected.displayId);
      expect(card.viewerCanonicalId).toBe(expected.canonicalId);
      expect(card.viewerDisplayId).toBe(expected.displayId);
      expect(card.imageUrl).toContain(expected.displayId);
      expect(card.language).toBe(expected.language);
      expect(card.name).toBe(expected.name);
      expect(card.significance).toBe(expected.significance);
      expect(card.sourceUrl).toBe(expected.sourceUrl);
      expect(card.originalUrl).toBe(expected.originalUrl);
      expect(card.languageLabel).toBe(expected.language === 'pt' ? 'Carta oficial em português (PT)' : 'Imagem da edição original (EN)');
    });

    const eventLinks = page.locator('.chapter-prose .historical-event-reference__link');
    expect(await eventLinks.evaluateAll(links => links.map(link => link.getAttribute('href'))))
      .toEqual(fixture.eventIds.map(eventId => `${base}pt-br/events/${eventId}/`));
    expect(await eventLinks.locator('strong').allTextContents())
      .toEqual(fixture.eventIds.map(eventId => eventTranslations[eventId].title));
    expect(await page.locator('.chapter-sources a[href^="https://"]').evaluateAll(links => links.map(link => link.getAttribute('href'))))
      .toEqual(fixture.sourceUrls);
  });
}

test('Portuguese reader preferences, illustration trail and viewer use translated controls', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${base}pt-br/chapters/thran/`);
  const settings = page.locator('[data-chapter-settings]');
  await expect(settings.locator('summary')).toHaveAccessibleName('Aa Preferências de leitura');
  await settings.locator('summary').click();
  await settings.getByRole('radio', { name: 'Maior', exact: true }).check();
  await expect(page.locator('[data-chapter-reading-root]')).toHaveAttribute('data-reading-size', 'large');
  await expect(settings.locator('[data-reading-status]')).toHaveText('Preferências de leitura salvas.');

  const trail = page.locator('[data-chapter-artwork-trail]');
  await trail.getByText('Explore os momentos ilustrados', { exact: false }).click();
  await expect(trail.locator('ol li')).toHaveCount(chapterFixture('thran').moments.length);
  await expect(trail.locator('ol li small').first()).toContainText(chapterFixture('thran').moments[0].artist);
  await page.locator('[data-card-artwork-open]').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-card-artwork-attribution]')).toContainText('Ilustrada por');
  await dialog.getByRole('button', { name: 'Fechar imagem' }).click();
  await expect(dialog).not.toBeVisible();
});

for (const javaScriptEnabled of [true, false]) {
  test.describe(`retained bookmarks ${javaScriptEnabled ? 'with' : 'without'} JavaScript`, () => {
    test.use({ javaScriptEnabled });
    for (const bookmark of [
      { chapter: 'thran', fragment: 'dyfed', targetChapter: 'thran', targetHeading: 10 },
      { chapter: 'march-of-the-machine', fragment: 'a-missao-ao-nucleo-semente', targetChapter: 'new-phyrexia', targetHeading: 3 },
    ]) {
      test(`${bookmark.chapter}#${bookmark.fragment} reaches its full translated section`, async ({ page }) => {
        await page.goto(`${base}pt-br/chapters/${bookmark.chapter}/#${bookmark.fragment}`);
        const alias = page.locator(`.legacy-alias[id="${bookmark.fragment}"]`);
        await expect(alias).toBeVisible();
        await expect(alias).toContainText('tradução integral');
        const href = await alias.locator('a').getAttribute('href');
        await alias.locator('a').click();
        expect(new URL(page.url()).pathname).toBe(`${base}pt-br/chapters/${bookmark.targetChapter}/`);
        expect(new URL(page.url()).hash).toBe(new URL(href, page.url()).hash);
        const heading = page.locator('.chapter-prose > h2, .historical-moment__narrative > h2').nth(bookmark.targetHeading);
        await expect(heading).toBeVisible();
        expect(decodeURIComponent(new URL(page.url()).hash.slice(1))).toBe(await heading.getAttribute('id'));
      });
    }
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('full prose, static contents, local event records and native interpretation remain available', async ({ page, request }) => {
    const fixture = chapterFixture('thran');
    await page.goto(`${base}pt-br/chapters/thran/`);
    await expect(page.locator('.chapter-prose > h2, .historical-moment__narrative > h2')).toHaveCount(13);
    await expect(page.locator('.chapter-prose > h3, .historical-moment__narrative > h3')).toHaveCount(11);
    await expect(page.locator(paragraphSelector)).toHaveCount(fixture.prose.length);
    await expect(page.locator('[data-chapter-link]')).toHaveCount(13);
    await expect(page.locator('[data-chapter-settings]')).toBeHidden();
    const interpretation = page.locator('.historical-card__interpretation').first();
    await interpretation.getByText('Arte e contexto histórico', { exact: true }).click();
    await expect(interpretation.locator('.historical-card__significance')).toHaveText(fixture.moments[0].significance);
    const firstEvent = page.locator('.historical-event-reference__link').first();
    await expect(firstEvent).toHaveAttribute('href', `${base}pt-br/events/${fixture.eventIds[0]}/`);
    const eventResponse = await request.get(await firstEvent.getAttribute('href'));
    expect(eventResponse.ok()).toBeTruthy();
    expect(await eventResponse.text()).toContain(eventTranslations[fixture.eventIds[0]].title);
  });
});
