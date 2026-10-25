import { spawnSync } from 'node:child_process';
import { copyFileSync, readFileSync } from 'node:fs';
import { hostingConfig } from '../config/hosting.mjs';

const production = process.argv.includes('--production');
const settings = JSON.parse(readFileSync('hosting/cloudflare/workers-builds.json', 'utf8'));
if (production && process.env.MTG_SITE_ORIGIN && process.env.MTG_SITE_ORIGIN !== settings.origin) throw new Error('Production origin must match the approved Workers Builds settings');
if (!production && !process.env.MTG_SITE_ORIGIN) throw new Error('Set MTG_SITE_ORIGIN to the actual workers.dev or custom-domain origin before building');
const env = { ...process.env, MTG_SITE_BASE: '/', ...(production ? { MTG_SITE_ORIGIN: settings.origin } : {}) };
hostingConfig(env);
for (const task of ['build', 'check:search', 'check:links']) {
  const result = spawnSync('pnpm', ['run', task], { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
copyFileSync(production ? 'hosting/cloudflare/_headers.production' : 'hosting/cloudflare/_headers', 'dist/_headers');
copyFileSync('hosting/cloudflare/_redirects', 'dist/_redirects');
