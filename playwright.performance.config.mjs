import { defineConfig, devices } from '@playwright/test';

// Test the actual Astro production output, not its Vite development server.
// Run `pnpm run build` (or the full `pnpm run verify`) first.
const baseURL = 'http://127.0.0.1:4322';

export default defineConfig({
  testDir: './tests/performance',
  outputDir: 'test-results/performance',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-production', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-production', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm exec astro preview --host 127.0.0.1 --port 4322',
    url: `${baseURL}/mtg-history/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
