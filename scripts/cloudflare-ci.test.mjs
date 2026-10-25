import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { settings, sourceChecks, requireProductionBranch, buildProduction, deployProduction, checkProductionArtifact } from './cloudflare-ci.mjs';

const repository = process.cwd();
const routes = JSON.parse(readFileSync('src/data/translated-routes.json', 'utf8'));
const headers = readFileSync('hosting/cloudflare/_headers.production', 'utf8');
const redirects = readFileSync('hosting/cloudflare/_redirects', 'utf8');
const sha = 'a'.repeat(40);
const env = { WORKERS_CI: '1', WORKERS_CI_BRANCH: 'main', WORKERS_CI_COMMIT_SHA: sha };
function fixture() {
  mkdirSync('hosting/cloudflare', { recursive: true });
  mkdirSync('src/data', { recursive: true });
  writeFileSync('hosting/cloudflare/_headers.production', headers);
  writeFileSync('hosting/cloudflare/_redirects', redirects);
  writeFileSync('src/data/translated-routes.json', JSON.stringify(routes));
  mkdirSync('dist', { recursive: true });
  writeFileSync('dist/_headers', headers);
  writeFileSync('dist/_redirects', redirects);
  writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${settings.origin}/sitemap.xml\n`);
  let sitemap = '';
  for (const prefix of ['', 'pt-br/']) for (const suffix of routes) {
    const route = prefix + suffix;
    const url = settings.origin + '/' + route;
    mkdirSync(join('dist', route), { recursive: true });
    writeFileSync(join('dist', route, 'index.html'), `<link rel="canonical" href="${url}"><meta property="og:url" content="${url}">`);
    sitemap += `<loc>${url}</loc>`;
  }
  writeFileSync('dist/sitemap.xml', sitemap);
}
function isolated(fn) {
  const directory = mkdtempSync(join(tmpdir(), 'mtg-cloudflare-gate-'));
  const previous = process.env.WORKERS_CI_COMMIT_SHA;
  process.chdir(directory);
  process.env.WORKERS_CI_COMMIT_SHA = sha;
  try { fn(); } finally {
    process.chdir(repository);
    if (previous === undefined) delete process.env.WORKERS_CI_COMMIT_SHA;
    else process.env.WORKERS_CI_COMMIT_SHA = previous;
    rmSync(directory, { recursive: true, force: true });
  }
}

test('production deploy rejects feature branches and missing CI identity before invoking Wrangler', () => {
  requireProductionBranch(env);
  for (const invalid of [{}, { ...env, WORKERS_CI_BRANCH: 'feature/phase16-cloudflare-static-assets' }, { ...env, WORKERS_CI_COMMIT_SHA: '' }]) {
    assert.throws(() => deployProduction(invalid, () => assert.fail('must not deploy')), /requires Workers Builds on main/);
  }
});

test('one build produces an exact artifact; deploy reuses it and rejects stale or modified output', () => isolated(() => {
  const calls = [];
  buildProduction(args => {
    calls.push(args);
    if (args[1] === 'build:cloudflare:production') fixture();
  });
  assert.deepEqual(calls, [...sourceChecks, 'build:cloudflare:production'].map(task => ['run', task]));
  assert.equal(calls.filter(args => args[1].startsWith('build:')).length, 1);
  const deploys = [];
  deployProduction(env, args => deploys.push(args));
  assert.deepEqual(deploys, [['exec', 'wrangler', 'deploy', '--config', 'wrangler.production.jsonc']]);
  assert.throws(() => deployProduction({ ...env, WORKERS_CI_COMMIT_SHA: 'b'.repeat(40) }, () => assert.fail('must not deploy')), /stale/);
  writeFileSync('dist/index.html', 'tampered');
  assert.throws(() => deployProduction(env, () => assert.fail('must not deploy')), /production SEO/);
}));

test('failure at every source/build boundary clears old receipts and prevents deployment', () => isolated(() => {
  for (let failed = 0; failed <= sourceChecks.length; failed++) {
    mkdirSync('.cloudflare-build', { recursive: true });
    mkdirSync('dist', { recursive: true });
    writeFileSync('.cloudflare-build/validated.json', '{}');
    let calls = 0;
    assert.throws(() => buildProduction(() => { if (calls++ === failed) throw new Error('injected failure'); }), /injected failure/);
    assert.equal(calls, failed + 1);
    assert.equal(existsSync('.cloudflare-build/validated.json'), false);
    assert.equal(existsSync('dist'), false);
    assert.throws(() => deployProduction(env, () => assert.fail('must not deploy')), /ENOENT/);
  }
}));

test('production SEO gate rejects staging headers, noindex metadata and missing locale routes', () => isolated(() => {
  fixture();
  checkProductionArtifact();
  writeFileSync('dist/_headers', headers + '\n  X-Robots-Tag: noindex\n');
  assert.throws(() => checkProductionArtifact(), /staging noindex/);
  writeFileSync('dist/_headers', headers);
  const html = readFileSync('dist/index.html', 'utf8');
  writeFileSync('dist/index.html', html + '<meta name="robots" content="noindex">');
  assert.throws(() => checkProductionArtifact(), /noindex metadata/);
  writeFileSync('dist/index.html', html);
  rmSync('dist/pt-br/chapters/thran/index.html');
  assert.throws(() => checkProductionArtifact(), /ENOENT/);
}));

test('prepared settings pin a static-only main pipeline, preserving staging', () => {
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  const production = JSON.parse(readFileSync('wrangler.production.jsonc', 'utf8'));
  assert.equal(settings.repository, 'DevIsola/mtg-history');
  assert.deepEqual(settings.automaticBranches, ['main']);
  assert.equal(settings.previewBuilds, false);
  assert.equal(settings.buildVariables.SKIP_DEPENDENCY_INSTALL, 'true');
  assert.equal(settings.buildVariables.NODE_VERSION, readFileSync('.node-version', 'utf8').trim());
  assert.equal(manifest.packageManager, `pnpm@${settings.buildVariables.PNPM_VERSION}`);
  assert.equal(manifest.devDependencies.wrangler, '4.152.0');
  assert.equal(production.name, 'mtg-history');
  assert.equal(production.assets.directory, './dist');
  assert.equal(production.preview_urls, false);
  assert.equal(production.build, undefined);
  assert.equal(production.bindings, undefined);
  assert.equal(JSON.parse(readFileSync('wrangler.jsonc', 'utf8')).name, 'mtg-history-staging');
});

test('HTTP artifact proof accepts indexable production and rejects staging noindex', async () => {
  const { createServer } = await import('node:http');
  const { spawn } = await import('node:child_process');
  const root = mkdtempSync(join(tmpdir(), 'mtg-http-proof-'));
  const body = '<h1>Reviewed static artifact</h1>';
  writeFileSync(join(root, 'index.html'), body);
  let robots = '';
  const server = createServer((_request, response) => {
    if (robots) response.setHeader('X-Robots-Tag', robots);
    response.end(body);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const probe = production => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(repository, 'scripts/check-hosting-http.mjs'), origin, root], {
      env: { ...process.env, MTG_HOSTING_PRODUCTION: production ? '1' : '0' }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', data => { output += data; });
    child.on('error', reject);
    child.on('close', code => resolve({ code, report: JSON.parse(output) }));
  });
  try {
    assert.equal((await probe(true)).code, 0);
    robots = 'noindex';
    const rejected = await probe(true);
    assert.equal(rejected.code, 1);
    assert.match(rejected.report.mismatches[0].error, /production noindex/);
    assert.equal((await probe(false)).code, 0);
  } finally {
    await new Promise(resolve => server.close(resolve));
    rmSync(root, { recursive: true, force: true });
  }
});
