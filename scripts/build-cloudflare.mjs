import { spawnSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';
import { hostingConfig } from '../config/hosting.mjs';

if (!process.env.MTG_SITE_ORIGIN) throw new Error('Set MTG_SITE_ORIGIN to the actual workers.dev or custom-domain origin before building');
const env = { ...process.env, MTG_SITE_BASE: '/' };
hostingConfig(env);
for (const task of ['build', 'check:search', 'check:links']) {
  const result = spawnSync('pnpm', ['run', task], { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
for (const file of ['_headers', '_redirects']) copyFileSync(`hosting/cloudflare/${file}`, `dist/${file}`);
