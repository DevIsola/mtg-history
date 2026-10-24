import { defineConfig, devices } from '@playwright/test';

// Dedicated port avoids confusing screenshots with an already running dev server.
const port = 4326;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/screenshots',
  timeout: 120_000,
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'readme-chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm run build && pnpm exec astro preview --ignore-lock --host 127.0.0.1 --port ${port}`,
    url: `${baseURL}/mtg-history/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
