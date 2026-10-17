import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const base = '/mtg-history/';
const routes = [
  ['home', base],
  ['timeline', `${base}timeline/`],
  ['characters', `${base}characters/`],
  ['events', `${base}events/`],
  ['archive', `${base}archive/`],
  ['discovery', `${base}discover/`],
  ['chapter-08', `${base}chapters/war-of-the-spark/`],
];

// Baseline mode records ALL violations. Once remediated, set A11Y_ENFORCE=1
// to make serious/critical findings fail CI without editing the tests.
const enforce = process.env.A11Y_ENFORCE === '1';

for (const [name, route] of routes) {
  test(`${name}: capture WCAG accessibility baseline`, async ({ page }, testInfo) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();

    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const violations = result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        html: node.html,
        failureSummary: node.failureSummary,
      })),
    }));

    const report = {
      route,
      project: testInfo.project.name,
      recordedAt: new Date().toISOString(),
      violations,
      incomplete: result.incomplete.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targetCount: nodes.length,
      })),
      passedRules: result.passes.length,
      scannedRules: result.passes.length + result.violations.length + result.incomplete.length,
    };

    await writeFile(
      testInfo.outputPath('accessibility-baseline.json'),
      JSON.stringify(report, null, 2) + '\n',
    );
    console.log(
      `[A11Y BASELINE] ${testInfo.project.name} ${name}: ` +
        `${violations.length} rule violations; ${result.incomplete.length} manual-review rules`,
    );

    if (enforce) {
      expect(
        violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'),
        'Serious and critical axe findings require remediation',
      ).toEqual([]);
    }
  });
}
