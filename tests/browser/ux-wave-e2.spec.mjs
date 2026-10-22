import { test, expect } from '@playwright/test';
const root = '/mtg-history/';

test('network provides labeled relationship evidence and theme-aware graph controls', async ({ page }) => {
  await page.goto(root + 'relationships/');
  await expect(page.locator('[data-network-edge]')).toHaveCount(118);
  await expect(page.locator('.network-steps li')).toHaveCount(3);
  await expect(page.locator('.network-visual__legend li')).toHaveCount(6);
  await expect(page.locator('#network-label-density')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('[data-graph-labels]')).toHaveAttribute('data-graph-labels', 'focus');
  await page.locator('#network-label-density').selectOption('all');
  await expect(page.locator('[data-graph-labels]')).toHaveAttribute('data-graph-labels', 'all');
  await expect(page).toHaveURL(/labels=all/);
  await page.locator('#network-show-cards').click();
  await expect(page.locator('[data-network-edge]:visible').first().locator('[data-network-label]')).toBeVisible();
  await expect(page.locator('.network-visual')).toBeHidden();
  await page.locator('#network-show-graph').click();
  await expect(page.locator('.network-visual')).toBeVisible();
});

test('320px layout and JS-disabled historical cards remain usable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 720 }, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(root + 'relationships/');
    await expect(page.locator('[data-network-edge]:visible')).toHaveCount(118);
    await expect(page.locator('[data-network-edge] a[href*="characters/"]').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});
