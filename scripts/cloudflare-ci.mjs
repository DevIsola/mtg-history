import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const settings = JSON.parse(readFileSync(new URL('../hosting/cloudflare/workers-builds.json', import.meta.url), 'utf8'));
const receipt = '.cloudflare-build/validated.json';
export const sourceChecks = ['test', 'check:types', 'check:localization', 'check:entities', 'check:cards', 'check:content', 'check:editorial', 'check:provenance', 'check:artwork', 'check:images', 'check:styles', 'check:themes', 'check:glossary'];

export function requireProductionBranch(env) {
  if (env.WORKERS_CI !== '1' || env.WORKERS_CI_BRANCH !== settings.productionBranch || !/^[a-f0-9]{40}$/.test(env.WORKERS_CI_COMMIT_SHA ?? '')) {
    throw new Error('Cloudflare deployment requires Workers Builds on main with a commit SHA');
  }
}

function run(args) {
  const result = spawnSync('pnpm', args, { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`pnpm ${args.join(' ')} failed (${result.status})`);
}

export function artifactDigest(root = 'dist') {
  const hash = createHash('sha256');
  function visit(directory, prefix = '') {
    for (const item of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const name = prefix + item.name;
      if (item.isSymbolicLink()) throw new Error('Symbolic links are not deployable assets');
      if (item.isDirectory()) visit(join(directory, item.name), name + '/');
      else hash.update(name + '\0').update(readFileSync(join(directory, item.name))).update('\0');
    }
  }
  visit(root);
  return hash.digest('hex');
}

export function checkProductionArtifact(root = 'dist') {
  const headers = readFileSync(join(root, '_headers'), 'utf8');
  if (/noindex/i.test(headers)) throw new Error('Production must not contain staging noindex headers');
  if (headers !== readFileSync('hosting/cloudflare/_headers.production', 'utf8')) throw new Error('Production cache headers changed');
  if (readFileSync(join(root, '_redirects'), 'utf8') !== readFileSync('hosting/cloudflare/_redirects', 'utf8')) throw new Error('Legacy redirects changed');
  const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
  if (/Disallow:\s*\/\s*$/im.test(robots) || !robots.includes(settings.origin + '/sitemap.xml')) throw new Error('Incorrect production robots policy');
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const routes = JSON.parse(readFileSync('src/data/translated-routes.json', 'utf8'));
  for (const prefix of ['', 'pt-br/']) for (const suffix of routes) {
    const route = prefix + suffix;
    const html = readFileSync(join(root, route, 'index.html'), 'utf8');
    const url = settings.origin + '/' + route;
    if (!html.includes(`rel="canonical" href="${url}"`) || !html.includes(`property="og:url" content="${url}"`) || !sitemap.includes(`<loc>${url}</loc>`)) throw new Error(`Incorrect production SEO: ${route}`);
    if (/<meta\b(?=[^>]*name=["'](?:robots|googlebot)["'])(?=[^>]*content=["'][^"']*noindex)/i.test(html)) throw new Error(`Production noindex metadata: ${route}`);
  }
  return artifactDigest(root);
}

// Dependency injection tests the failure boundary without a network deployment.
export function buildProduction(execute = run) {
  rmSync(receipt, { force: true });
  rmSync('dist', { recursive: true, force: true });
  for (const task of sourceChecks) execute(['run', task]);
  execute(['run', 'build:cloudflare:production']);
  const digest = checkProductionArtifact();
  mkdirSync('.cloudflare-build', { recursive: true });
  writeFileSync(receipt, JSON.stringify({ commit: process.env.WORKERS_CI_COMMIT_SHA ?? null, digest }) + '\n');
}

export function deployProduction(env = process.env, execute = run) {
  requireProductionBranch(env);
  const validated = JSON.parse(readFileSync(receipt, 'utf8'));
  if (validated.commit !== env.WORKERS_CI_COMMIT_SHA || validated.digest !== checkProductionArtifact()) throw new Error('Missing, stale or changed validated production artifact');
  execute(['exec', 'wrangler', 'deploy', '--config', 'wrangler.production.jsonc']);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
    if (process.version !== `v${settings.buildVariables.NODE_VERSION}` || manifest.packageManager !== `pnpm@${settings.buildVariables.PNPM_VERSION}` || spawnSync('pnpm', ['--version'], { encoding: 'utf8' }).stdout?.trim() !== settings.buildVariables.PNPM_VERSION) throw new Error('Use the pinned Node and pnpm versions');
    if (process.env.WORKERS_CI) requireProductionBranch(process.env);
    if (process.argv[2] === 'build') buildProduction();
    else if (process.argv[2] === 'deploy') deployProduction();
    else throw new Error('Use build or deploy');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
