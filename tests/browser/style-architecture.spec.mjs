import { test, expect } from '@playwright/test';

const root = '/mtg-history/';

test('custom reset preserves authored layout and hidden element behavior', async ({ page }) => {
  await page.goto(root);
  await expect(page.locator('h1').first()).toBeVisible();

  const styles = await page.evaluate(() => {
    const heading = document.createElement('h2');
    document.body.append(heading);
    const hidden = document.createElement('div');
    hidden.hidden = true;
    document.body.append(hidden);
    const result = {
      bodyMargin: getComputedStyle(document.body).margin,
      headingMargin: getComputedStyle(heading).margin,
      headingBox: getComputedStyle(heading).boxSizing,
      hiddenDisplay: getComputedStyle(hidden).display,
    };
    hidden.remove();
    heading.remove();
    return result;
  });

  expect(styles).toEqual({
    bodyMargin: '0px',
    headingMargin: '0px',
    headingBox: 'border-box',
    hiddenDisplay: 'none',
  });
});

test('shared semantic tokens retain light and dark themes', async ({ page }) => {
  await page.goto(root);
  const result = await page.evaluate(() => {
    const rootElement = document.documentElement;
    const read = () => ({
      paper: getComputedStyle(rootElement).getPropertyValue('--paper').trim(),
      ink: getComputedStyle(rootElement).getPropertyValue('--ink').trim(),
      surface: getComputedStyle(document.body).backgroundColor,
    });
    rootElement.dataset.theme = 'light';
    const light = read();
    rootElement.dataset.theme = 'dark';
    const dark = read();
    return { light, dark };
  });

  expect(result.light.paper).toBe('#f4efe5');
  expect(result.dark.paper).toBe('#111d20');
  expect(result.light.ink).not.toBe(result.dark.ink);
  expect(result.light.surface).not.toBe(result.dark.surface);
});
