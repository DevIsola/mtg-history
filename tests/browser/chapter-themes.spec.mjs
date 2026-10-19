import { test, expect } from '@playwright/test';

const base = '/mtg-history/chapters/';

for (const id of ['thran', 'ice-age', 'war-of-the-spark', 'omenpaths']) {
  test(`${id} uses its own responsive light/dark chapter palette`, async ({ page }) => {
    await page.goto(`${base}${id}/`);
    const theme = page.locator('.chapter-theme');
    await expect(theme).toHaveAttribute('data-era-theme', id);
    const colors = await page.evaluate(() => {
      const wrapper = document.querySelector('.chapter-theme');
      if (!wrapper) throw new Error('missing themed chapter');
      const inspect = () => ({
        accent: getComputedStyle(wrapper).getPropertyValue('--era-accent').trim(),
        banner: getComputedStyle(wrapper.querySelector('.page-banner')).backgroundImage,
      });
      document.documentElement.dataset.theme = 'light';
      const light = inspect();
      document.documentElement.dataset.theme = 'dark';
      const dark = inspect();
      return { light, dark };
    });
    expect(colors.light.accent).toMatch(/^#[0-9a-f]{6}$/i);
    expect(colors.dark.accent).toMatch(/^#[0-9a-f]{6}$/i);
    expect(colors.light.accent).not.toBe(colors.dark.accent);
    expect(colors.light.banner).toContain('gradient');
    await expect(page.getByRole('navigation', { name: 'Switch chapters' })).toBeVisible();
  });
}

test('themed accents do not leak from a chapter to the timeline', async ({ page }) => {
  await page.goto(`${base}thran/`);
  await expect(page.locator('.chapter-theme')).toHaveCount(1);
  await page.goto('/mtg-history/timeline/');
  await expect(page.locator('.chapter-theme')).toHaveCount(0);
});
