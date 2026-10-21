import { test, expect } from '@playwright/test';
const root = '/mtg-history/';
for (const [key, heading] of [
  ['timeline', 'Cronologia histórica'],
  ['characters', 'Personagens históricos'],
  ['events', 'Acontecimentos históricos'],
  ['archive', 'Arquivo ilustrado'],
]) {
  test(`Portuguese ${key} catalog switches language and retains English-only detail links`, async ({ page }) => {
    const response = await page.goto(`${root}pt-br/${key}/`);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `https://devisola.github.io${root}${key}/`);
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute('href', `https://devisola.github.io${root}pt-br/${key}/`);
    await expect(page.locator('main a[hreflang="en"]').first()).toBeVisible();
    await page.getByRole('link', { name: 'Switch to English' }).click();
    await expect(page).toHaveURL(new RegExp(`/mtg-history/${key}/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
}
