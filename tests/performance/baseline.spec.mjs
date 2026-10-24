import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const root = process.env.MTG_TEST_BASE ?? '/mtg-history/';
const routes = [
  ['home', root],
  ['timeline', `${root}timeline/`],
  ['characters', `${root}characters/`],
  ['archive', `${root}archive/`],
  ['discovery', `${root}discover/`],
  ['chapter-08', `${root}chapters/war-of-the-spark/`],
];

for (const [name, path] of routes) {
  test(`${name}: production performance snapshot`, async ({ page }, testInfo) => {
    // Install observers before navigation. Layout shift excludes recent input.
    await page.addInitScript(() => {
      window.__mtgPerformance = { lcpMs: null, cls: 0 };
      if (!('PerformanceObserver' in window)) return;
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__mtgPerformance.lcpMs = entry.startTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        // Unsupported metric: record null rather than inventing a measurement.
      }
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__mtgPerformance.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Unsupported metric: remain at zero, and identify support below.
      }
    });

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
    // Give buffered paint / layout-shift entries a short, consistent window.
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const entries = performance.getEntriesByType('resource');
      const local = entries.filter((entry) => new URL(entry.name).origin === location.origin);
      const total = (xs, key) => xs.reduce((sum, entry) => sum + (entry[key] || 0), 0);
      const paint = performance.getEntriesByType('paint').find((entry) =>
        entry.name === 'first-contentful-paint');
      const supported = PerformanceObserver.supportedEntryTypes || [];
      const vitals = window.__mtgPerformance;

      return {
        url: location.pathname,
        userAgent: navigator.userAgent,
        navigation: {
          responseEndMs: nav?.responseEnd ?? null,
          domContentLoadedMs: nav?.domContentLoadedEventEnd ?? null,
          htmlTransferBytes: nav?.transferSize ?? null,
          htmlDecodedBytes: nav?.decodedBodySize ?? null,
        },
        paints: {
          fcpMs: paint?.startTime ?? null,
          lcpMs: supported.includes('largest-contentful-paint') ? vitals.lcpMs : null,
          cls: supported.includes('layout-shift') ? vitals.cls : null,
        },
        firstPartyResources: {
          count: local.length,
          transferBytes: total(local, 'transferSize'),
          decodedBytes: total(local, 'decodedBodySize'),
        },
      };
    });

    expect(metrics.navigation.domContentLoadedMs).toBeGreaterThan(0);
    expect(metrics.firstPartyResources.count).toBeGreaterThanOrEqual(0);

    const report = {
      recordedAt: new Date().toISOString(),
      project: testInfo.project.name,
      route: path,
      caveat: 'Local Chromium lab snapshot, not field Core Web Vitals or a public-site score',
      metrics,
    };
    await writeFile(
      testInfo.outputPath('production-performance.json'),
      JSON.stringify(report, null, 2) + '\n',
    );
    console.log(
      `[PERF BASELINE] ${testInfo.project.name} ${name}: ` +
        `FCP=${metrics.paints.fcpMs?.toFixed(0) ?? 'n/a'}ms; ` +
        `LCP=${metrics.paints.lcpMs?.toFixed(0) ?? 'n/a'}ms; ` +
        `CLS=${metrics.paints.cls ?? 'n/a'}; ` +
        `first-party transfer=${metrics.firstPartyResources.transferBytes}B`,
    );
  });
}
