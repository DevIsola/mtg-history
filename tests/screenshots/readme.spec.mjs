import { expect, test, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const destination = fileURLToPath(new URL('../../docs/screenshots/', import.meta.url));
const base = '/mtg-history/';
const desktopPages = [
  ['home-desktop.jpg', base],
  ['timeline-desktop.jpg', `${base}timeline/`],
  ['ice-age-desktop.jpg', `${base}chapters/ice-age/`],
  ['relationships-desktop.jpg', `${base}relationships/`],
  ['glossary-desktop.jpg', `${base}glossary/`],
];

async function capture(page, route, path) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response?.ok(), `HTTP response for ${route}`).toBeTruthy();
  await expect(page.locator('main#main-content')).toBeVisible();
  await expect(page.locator('main h1').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  // Allow page and visible third-party images to settle without hanging on a CDN.
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  if (route.endsWith('/relationships/')) {
    await expect(page.locator('#network-canvas')).toBeVisible({ timeout: 15_000 });
    await page.locator('#network-canvas').scrollIntoViewIfNeeded();
  }
  // Avoid animated screenshots while keeping the actual page content unchanged.
  await page.screenshot({ path: `${destination}/${path}`, type: 'jpeg', quality: 80, animations: 'disabled' });
}

test('capture actual built pages for the README (desktop and mobile)', async ({ browser }) => {
  await mkdir(destination, { recursive: true });
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  try {
    const page = await desktop.newPage();
    for (const [name, route] of desktopPages) await capture(page, route, name);
  } finally {
    await desktop.close();
  }

  const mobile = await browser.newContext({
    ...devices['Pixel 7'],
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  try {
    await capture(await mobile.newPage(), `${base}chapters/ice-age/`, 'ice-age-mobile.jpg');
  } finally {
    await mobile.close();
  }
});
