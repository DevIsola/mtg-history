import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/*
 * README feature tour.
 *
 * Each capture shows one real feature of the built site in a meaningful state
 * (a card moment in the reader, the artwork viewer open, a lore definition
 * expanded, the relationship graph focused on a character...). Card artwork is
 * loaded from Scryfall at capture time; a capture fails rather than committing
 * a screenshot with a missing or broken card image.
 */

const destination = fileURLToPath(new URL('../../docs/screenshots/', import.meta.url));
const base = '/mtg-history/';
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const THEME_KEY = 'mtg-history-theme';

/** Fresh context per capture so theme, scroll and dialogs never leak between shots. */
async function openPage(browser, route, { viewport = DESKTOP, scale = 1, theme = 'light', mobile = false } = {}) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: scale,
    isMobile: mobile,
    hasTouch: mobile,
    reducedMotion: 'reduce',
    colorScheme: theme,
  });
  await context.addInitScript(([key, value]) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [THEME_KEY, theme]);
  const page = await context.newPage();
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response?.ok(), `HTTP response for ${route}`).toBeTruthy();
  await expect(page.locator('main#main-content')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  // Keep hover previews and focus rings out of the frame unless a shot asks for them.
  await page.mouse.move(0, 0);
  return page;
}

/** Scroll so `locator` starts `offset` px below the top edge (clears sticky bars). */
async function scrollToTop(locator, offset = 110) {
  await locator.first().evaluate((element, gap) => {
    const top = element.getBoundingClientRect().top + window.scrollY - gap;
    window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
  }, offset);
}

async function scrollToCenter(locator) {
  await locator.first().evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
}

/** Wait for every image intersecting the viewport, and fail on a broken one. */
async function settleVisibleImages(page) {
  await page.waitForTimeout(250); // let lazy images start after a scroll
  const broken = await page.evaluate(async () => {
    const visible = [...document.images].filter((image) => {
      const box = image.getBoundingClientRect();
      const style = getComputedStyle(image);
      return box.width > 0 && box.bottom > 0 && box.top < innerHeight && style.visibility !== 'hidden';
    });
    await Promise.all(
      visible.map((image) =>
        image.complete
          ? null
          : new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 20_000);
            }),
      ),
    );
    return visible.filter((image) => !image.naturalWidth).map((image) => image.currentSrc || image.src);
  });
  expect(broken, 'every visible card image must load before capture').toEqual([]);
}

async function shoot(page, name, options = {}) {
  await settleVisibleImages(page);
  await page.screenshot({
    path: `${destination}/${name}`,
    type: 'jpeg',
    quality: 82,
    animations: 'disabled',
    caret: 'hide',
    ...options,
  });
  await page.context().close();
}

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => {
  await mkdir(destination, { recursive: true });
});

test('chapter reader — card moment beside the narrative', async ({ browser }) => {
  const page = await openPage(browser, `${base}chapters/brothers-war/`);
  const moment = page.locator('.chapter-prose .historical-moment').first();
  await expect(moment).toBeVisible();
  // Below the site header and the sticky chapter bar.
  await scrollToTop(moment, 190);
  await shoot(page, 'chapter-reader.jpg');
});

test('card artwork viewer — exact printing with attribution', async ({ browser }) => {
  const page = await openPage(browser, `${base}chapters/thran/`);
  const opener = page.locator('.chapter-prose .historical-card [data-card-artwork-open]').first();
  await scrollToCenter(opener);
  await opener.click();
  const dialog = page.locator('#card-artwork-viewer');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-card-artwork-significance]')).not.toBeEmpty();
  await shoot(page, 'card-viewer.jpg');
});

test('lore glossary — inline definition while reading', async ({ browser }) => {
  const page = await openPage(browser, `${base}chapters/thran/`);
  const term = page.locator('.chapter-prose [data-lore-term]').first();
  await scrollToTop(term, 300);
  await term.locator('[data-lore-button]').press('Enter');
  await expect(term.locator('[data-lore-panel]')).toBeVisible();
  await shoot(page, 'glossary-term.jpg');
});

test('timeline atlas — eras, events and filters', async ({ browser }) => {
  const page = await openPage(browser, `${base}timeline/`);
  const controls = page.locator('#timeline-controls');
  await expect(controls).toBeVisible();
  await scrollToTop(page.locator('.atlas-intro'), 100);
  await shoot(page, 'timeline.jpg');
});

test('relationship explorer — Urza’s network two steps out', async ({ browser }) => {
  // Taller frame so the controls and the whole graph fit in one image.
  const page = await openPage(browser, `${base}relationships/?person=urza`, { viewport: { width: 1440, height: 1500 } });
  const explorer = page.locator('[data-relationship-explorer]');
  await expect(explorer).toHaveAttribute('data-graph-state', 'ready', { timeout: 20_000 });
  await page.locator('#network-scope').selectOption('local');
  await page.locator('#network-depth').selectOption('2');
  await expect(page).toHaveURL(/depth=2/);
  await page.locator('#network-fit').click();
  await page.waitForTimeout(1500); // let the force layout settle
  await scrollToTop(page.locator('#network-visual'), 96);
  await page.mouse.move(0, 0);
  await shoot(page, 'relationships.jpg');
});

test('character profile — biography with its card portrait', async ({ browser }) => {
  const page = await openPage(browser, `${base}characters/urza/`);
  const layout = page.locator('.character-profile__layout');
  await expect(layout).toBeVisible();
  await scrollToTop(layout, 100);
  await shoot(page, 'character-profile.jpg');
});

test('illustrated archive — every printing, filterable by chapter', async ({ browser }) => {
  const page = await openPage(browser, `${base}archive/`);
  await expect(page.locator('#archive-filters')).toBeVisible();
  await page.locator('#archive-chapter').selectOption('brothers-war');
  const grid = page.locator('[data-archive-section]:not([hidden]) .archive-card-grid').first();
  await expect(grid).toBeVisible();
  await scrollToTop(grid, 250);
  await shoot(page, 'archive.jpg');
});

test('discovery — one searchable index of chapters, people and events', async ({ browser }) => {
  const page = await openPage(browser, `${base}discover/`);
  const search = page.locator('#discovery-search');
  await expect(search).toBeVisible();
  await search.fill('Phyrexia');
  const total = await page.locator('[data-discovery-record]').count();
  await expect(page.locator('#discovery-status')).not.toHaveText(`Showing ${total} of ${total} records`);
  await search.blur();
  await scrollToTop(page.locator('#discovery-filters'), 100);
  await shoot(page, 'discover.jpg');
});

test('dark theme — the same reader after nightfall', async ({ browser }) => {
  const page = await openPage(browser, `${base}chapters/war-of-the-spark/`, { theme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await scrollToTop(page.locator('.chapter-prose .historical-moment').first(), 190);
  await shoot(page, 'dark-mode.jpg');
});

test('mobile — chapter card moment', async ({ browser }) => {
  const page = await openPage(browser, `${base}chapters/weatherlight/`, { viewport: MOBILE, scale: 2, mobile: true });
  // The collapsed sticky table of contents sits under the header on phones.
  await scrollToTop(page.locator('.chapter-prose .historical-moment .historical-card').first(), 300);
  await shoot(page, 'mobile-chapter.jpg');
});

test('mobile — the archive entrance', async ({ browser }) => {
  const page = await openPage(browser, base, { viewport: MOBILE, scale: 2, mobile: true });
  await expect(page.locator('.hero h1')).toBeVisible();
  await shoot(page, 'mobile-home.jpg');
});
