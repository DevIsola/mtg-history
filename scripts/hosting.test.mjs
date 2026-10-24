import test from 'node:test';
import assert from 'node:assert/strict';
import { hostingConfig } from '../config/hosting.mjs';

test('hosting defaults preserve the published Pages origin and project base', () => {
  assert.deepEqual(hostingConfig({}), { site: 'https://devisola.github.io', base: '/mtg-history/' });
});
test('root hosting accepts a workers.dev origin and localized paths', () => {
  assert.deepEqual(hostingConfig({ MTG_SITE_ORIGIN: 'https://mtg-history.example.workers.dev/', MTG_SITE_BASE: '/' }), { site: 'https://mtg-history.example.workers.dev', base: '/' });
});
test('hosting rejects origins with paths or credentials and ambiguous base paths', () => {
  for (const origin of ['file:///tmp/', 'https://user:pass@example.org', 'https://example.org/sub/', 'https://example.org/?q=1', 'https://example.org/#x']) {
    assert.throws(() => hostingConfig({ MTG_SITE_ORIGIN: origin }), /MTG_SITE_ORIGIN/);
  }
  for (const base of ['', 'mtg-history/', '/mtg-history', '//', '/../', '/a?b/']) {
    assert.throws(() => hostingConfig({ MTG_SITE_BASE: base }), /MTG_SITE_BASE/);
  }
});
