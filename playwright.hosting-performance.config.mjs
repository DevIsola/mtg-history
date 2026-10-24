import { defineConfig } from '@playwright/test';
import performanceConfig from './playwright.performance.config.mjs';
process.env.MTG_TEST_BASE = '/';
export default defineConfig({
  ...performanceConfig,
  outputDir: 'test-results/hosting-performance',
  use: { ...performanceConfig.use, baseURL: 'http://127.0.0.1:4325' },
  webServer: {
    command: 'pnpm run preview:cloudflare',
    env: { WRANGLER_SEND_METRICS: 'false' },
    url: 'http://127.0.0.1:4325/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
