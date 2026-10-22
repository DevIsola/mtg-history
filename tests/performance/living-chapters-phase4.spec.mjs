import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Production-preview diagnostics only: do not mistake local lab data for field CWV.
for (const slug of ['thran', 'ice-age', 'war-of-the-spark']) {
  test(`${slug}: living chapter interaction/performance snapshot`, async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      window.__livingChapterLab = { cls: 0, longTasks: 0 };
      if (!('PerformanceObserver' in window)) return;
      try {
        new PerformanceObserver((entries) => {
          for (const entry of entries.getEntries()) {
            if (!entry.hadRecentInput) window.__livingChapterLab.cls += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch { /* Unsupported: report status separately. */ }
      try {
        new PerformanceObserver((entries) => {
          window.__livingChapterLab.longTasks += entries.getEntries().length;
        }).observe({ type: 'longtask', buffered: true });
      } catch { /* Unsupported: report status separately. */ }
    });

    const route = `/mtg-history/chapters/${slug}/`;
    const response = await page.goto(route, { waitUntil: 'load' });
    expect(response?.ok()).toBeTruthy();
    const trail = page.locator('[data-chapter-artwork-trail]');
    await expect(trail).toBeVisible();
    const moments = page.locator('.chapter-prose .historical-moment');
    const momentCount = await moments.count();
    expect(momentCount).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await page.waitForTimeout(250);

    const signals = await page.evaluate(() => {
      const supported = PerformanceObserver?.supportedEntryTypes ?? [];
      const nav = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      const local = resources.filter((item) => new URL(item.name).origin === location.origin);
      const metrics = window.__livingChapterLab;
      return {
        navigationEndMs: nav?.domContentLoadedEventEnd ?? null,
        firstPartyResourceCount: local.length,
        firstPartyTransferBytes: local.reduce((sum, item) => sum + (item.transferSize ?? 0), 0),
        supported: { layoutShift: supported.includes('layout-shift'), longTask: supported.includes('longtask') },
        clsInCaptureWindow: supported.includes('layout-shift') ? metrics.cls : null,
        longTasksInCaptureWindow: supported.includes('longtask') ? metrics.longTasks : null,
        selectedIllustrations: document.querySelectorAll('.historical-moment[data-artwork-current="true"]').length,
        horizontalOverflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        motionPreference: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'no-preference',
      };
    });
    expect(signals.horizontalOverflowPx).toBeLessThanOrEqual(1);
    expect(signals.selectedIllustrations).toBeLessThanOrEqual(1);
    const report = {
      recordedAt: new Date().toISOString(), project: testInfo.project.name,
      route, momentCount, ...signals,
      caveat: 'Single local Chromium sample after partial scrolling. Compare repeat runs; not real-user Web Vitals.',
    };
    await writeFile(testInfo.outputPath('living-chapter-performance.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`[LIVING PERF] ${testInfo.project.name} ${slug}: ${momentCount} moments, ` +
      `first-party transfer=${signals.firstPartyTransferBytes}B, ` +
      `CLS=${signals.clsInCaptureWindow ?? 'n/a'}, long tasks=${signals.longTasksInCaptureWindow ?? 'n/a'}`);
  });
}
