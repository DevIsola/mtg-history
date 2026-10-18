import { defineConfig, devices } from '@playwright/test';

// Dedicated production-preview port: never reuse an Astro dev/HMR server.
const port = 4323;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Build here so standalone Playwright runs test the current source too.
    command: `pnpm run build && pnpm exec astro preview --host 127.0.0.1 --port ${port}`,
    url: `${baseURL}/mtg-history/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
