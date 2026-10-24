import { defineConfig } from '@playwright/test';
import performanceConfig from './playwright.performance.config.mjs';
process.env.MTG_TEST_BASE = '/';
const remote = process.env.MTG_HOSTING_URL;
export default defineConfig({
  ...performanceConfig,
  outputDir: 'test-results/hosting-performance',
  use: { ...performanceConfig.use, baseURL: remote ?? 'http://127.0.0.1:4325' },
  webServer: remote ? undefined : {
    command: 'pnpm run preview:cloudflare',
    env: { WRANGLER_SEND_METRICS: 'false' },
    url: 'http://127.0.0.1:4325/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
