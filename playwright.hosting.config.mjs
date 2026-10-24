import { defineConfig, devices } from '@playwright/test';
const origin = process.env.MTG_SITE_ORIGIN ?? 'https://mtg-history.example.workers.dev';
export default defineConfig({
  testDir: './tests/hosting',
  outputDir: 'test-results/hosting',
  timeout: 45000,
  expect: { timeout: 10000 },
  workers: 2,
  retries: 0,
  use: { baseURL: 'http://127.0.0.1:4325', trace: 'retain-on-failure', reducedMotion: 'reduce' },
  projects: [
    { name: 'desktop-workers', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-workers', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm run build:cloudflare && pnpm run preview:cloudflare',
    env: { MTG_SITE_ORIGIN: origin, WRANGLER_SEND_METRICS: 'false' },
    url: 'http://127.0.0.1:4325/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
