import { test, expect } from '@playwright/test';
const base = '/mtg-history/pt-br/';

for (const [route, expectedCount] of [['timeline',11], ['characters',88], ['events',133], ['archive',11]]) {
  test(`PT-BR ${route}: accessible filtering preserves English-only record links`, async ({ page }) => {
    const response = await page.goto(`${base}${route}/`);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
    const records = page.locator('[data-pt-entry]');
    await expect(records).toHaveCount(expectedCount);
    const input = page.getByRole('searchbox', { name: 'Filtrar registros neste catálogo' });
    await expect(input).toBeVisible();
    await expect(page.locator('[data-pt-status]')).toContainText(`${expectedCount} de ${expectedCount}`);
    await input.fill('zzzxxy-no-record');
    await expect(page.locator('[data-pt-entry]:visible')).toHaveCount(0);
    await expect(page.locator('[data-pt-status]')).toHaveText('Nenhum registro encontrado.');
    if (route === 'events') await expect(page.locator('[data-pt-group]:visible')).toHaveCount(0);
    await page.getByRole('button', { name: 'Limpar busca' }).click();
    await expect(page.locator('[data-pt-entry]:visible')).toHaveCount(expectedCount);
    await expect(page.locator('[data-pt-status]')).toContainText(`${expectedCount} de ${expectedCount}`);
    await expect(page.locator('[data-pt-entry] a[hreflang="en"]').first()).toBeVisible();
  });
}

test('PT-BR timeline: Portuguese era summaries remain searchable without changing canonical links', async ({ page }) => {
  await page.goto(`${base}timeline/`);
  await page.getByRole('searchbox', { name: 'Filtrar registros neste catálogo' }).fill('reparação');
  await expect(page.locator('[data-pt-entry]:visible')).toHaveCount(1);
  await expect(page.locator('[data-pt-entry]:visible a[hreflang="en"]')).toHaveAttribute('href', '/mtg-history/chapters/mending/');
});


test('Portuguese directory listings remain readable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${base}events/`);
    await expect(page.locator('[data-pt-entry]:visible')).toHaveCount(133);
    await expect(page.locator('[data-pt-controls]')).toBeHidden();
  } finally {
    await context.close();
  }
});
