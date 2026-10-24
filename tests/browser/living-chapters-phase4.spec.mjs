import { test, expect } from '@playwright/test';

const chapter = '/mtg-history/chapters/war-of-the-spark/';

test('opting into the illustration highlight never shifts its measured card position', async ({ page }) => {
  await page.goto(chapter);

  const moment = page.locator('.chapter-prose .historical-moment').first();
  await expect(page.locator('[data-chapter-artwork-trail]')).toBeVisible();
  await expect(moment).toBeVisible();

  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  // Measure the visual change synchronously, without unrelated
  // network, scroll, font or animation activity between samples.
  const result = await page.evaluate(() => {
    const card = document.querySelector(
      '.chapter-prose .historical-moment'
    );
    const toggle = document.querySelector(
      '[data-chapter-artwork-trail] [data-artwork-follow]'
    );

    if (!card || !(toggle instanceof HTMLInputElement)) {
      throw new Error('Artwork highlight controls are missing');
    }

    const measure = () => {
      const { x, y, width, height } = card.getBoundingClientRect();
      return { x, y, width, height };
    };

    const initial = measure();
    const initialShadow = getComputedStyle(card).boxShadow;

    toggle.click();

    const highlighted = {
      box: measure(),
      checked: toggle.checked,
      current: card.dataset.artworkCurrent,
      shadow: getComputedStyle(card).boxShadow,
    };

    toggle.click();

    const restored = {
      box: measure(),
      checked: toggle.checked,
      current: card.dataset.artworkCurrent,
    };

    return { initial, initialShadow, highlighted, restored };
  });

  expect(result.highlighted.checked).toBe(true);
  expect(result.highlighted.current).toBe('true');
  expect(result.highlighted.shadow).not.toBe(result.initialShadow);

  expect(result.restored.checked).toBe(false);
  expect(result.restored.current).toBeUndefined();

  for (const box of [result.highlighted.box, result.restored.box]) {
    for (const dimension of ['x', 'y', 'width', 'height']) {
      expect(
        Math.abs(box[dimension] - result.initial[dimension]),
        `Highlight changed card ${dimension}`
      ).toBeLessThanOrEqual(0.5);
    }
  }

  await expect(
    moment.locator('.historical-card__source')
  ).toHaveAttribute('href', /scryfall[.]com[/]card[/]/);
});

test('chapter illustration reader remains usable at the narrowest and intermediate widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/mtg-history/chapters/ice-age/');
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await expect(page.locator('.chapter-prose h2').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `Unexpected horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    await expect(page.locator('[data-chapter-artwork-trail]')).toBeVisible();
    const rawDurations = await page.locator('.historical-moment__illustration .historical-card img').first()
      .evaluate((img) => getComputedStyle(img).transitionDuration);
    // The global reduced-motion rule intentionally uses 0.01ms !important.
    // Chromium serializes this as 1e-05s rather than 0s; compare actual time.
    const durationsInSeconds = rawDurations.split(',').map((value) => {
      const token = value.trim();
      const magnitude = Number.parseFloat(token);
      return token.endsWith('ms') ? magnitude / 1000 : magnitude;
    });
    expect(durationsInSeconds.length).toBeGreaterThan(0);
    for (const seconds of durationsInSeconds) {
      expect(Number.isFinite(seconds), `Invalid CSS duration: ${rawDurations}`).toBe(true);
      expect(seconds, `Reduced-motion duration must be negligible: ${rawDurations}`)
        .toBeLessThanOrEqual(0.0001);
    }
  }
});

test('refreshing a chapter illustration deep link preserves provenance and in-page location', async ({ page }) => {
  await page.goto('/mtg-history/chapters/thran/');
  const trail = page.locator('[data-chapter-artwork-trail]');
  await trail.locator('summary').click();
  await trail.locator('ol a').last().click();
  const fragment = new URL(page.url()).hash;
  expect(fragment).toMatch(/^#chapter-artwork-/);
  await page.reload();
  await expect(page.locator(fragment)).toBeInViewport();
  await expect(page.locator(fragment).locator('.historical-card__credit')).toBeVisible();
  await expect(page.locator(fragment).locator('.historical-card__source')).toHaveAttribute('href', /scryfall\.com\/card\//);
});


test('illustrated card historical context has a visible plus/minus cue and native keyboard toggle', async ({ page }) => {
  await page.goto('/mtg-history/chapters/thran/');
  const card = page.locator('.chapter-prose .historical-moment .historical-card--plate').first();
  const disclosure = card.locator('.historical-card__interpretation');
  const summary = disclosure.locator('summary');

  await expect(summary).toBeVisible();
  await expect(summary).toHaveText('Art and historical context');
  await expect(summary).toHaveCSS('cursor', 'pointer');
  await expect(summary).toHaveCSS('border-top-style', 'solid');

  const indicators = () => summary.evaluate((element) => {
    const image = getComputedStyle(element, '::after').backgroundImage;
    return (image.match(/linear-gradient\(/g) ?? []).length;
  });
  expect(await indicators()).toBe(2); // + when closed
  await expect(disclosure).not.toHaveAttribute('open', '');

  await summary.click();
  await expect(disclosure).toHaveAttribute('open', '');
  expect(await indicators()).toBe(1); // - when open
  await expect(disclosure.locator('.historical-card__significance')).toBeVisible();
  await expect(card.locator('.historical-card__credit')).toBeVisible();
  await expect(card.locator('.historical-card__source')).toHaveAttribute('href', /scryfall\.com\/card\//);

  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(disclosure).not.toHaveAttribute('open', '');
  expect(await indicators()).toBe(2);
});
