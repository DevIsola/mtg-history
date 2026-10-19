import test from 'node:test';
import assert from 'node:assert/strict';
import { isScryfallCardImageUrl, cardImageFallbackLabel } from '../src/utils/card-image-recovery.mjs';
import { parseProbeArgs, selectProbeIds, probeImage } from './probe-card-images.mjs';

const id = 'a736df42-18e9-4259-b0b8-54d21143e72e';
const good = `https://cards.scryfall.io/normal/front/a/7/${id}.jpg`;

test('identifies only exact full-card Scryfall images', () => {
  assert.equal(isScryfallCardImageUrl(good), true);
  assert.equal(isScryfallCardImageUrl(good.replace('/normal/', '/small/')), true);
  for (const src of ['', null, 'https://example.com/normal/front/a/7/' + id + '.jpg',
    'http://cards.scryfall.io/normal/front/a/7/' + id + '.jpg',
    'https://cards.scryfall.io/art_crop/front/a/7/' + id + '.jpg',
    'https://cards.scryfall.io/normal/front/b/7/' + id + '.jpg',
    good + '?tracking=1']) {
    assert.equal(isScryfallCardImageUrl(src), false, String(src));
  }
});

test('fallback labels retain authored card names and provide generic alternative', () => {
  assert.equal(cardImageFallbackLabel('Glacian, illustrated by Magali Villeneuve'),
    'Glacian, illustrated by Magali Villeneuve — image unavailable');
  assert.equal(cardImageFallbackLabel(''), 'Magic: The Gathering card — image unavailable');
});

test('optional availability probe has bounded sample and rejects extra arguments', () => {
  assert.deepEqual(parseProbeArgs([]), { sample: 3, output: undefined });
  assert.deepEqual(parseProbeArgs(['--sample', '5', '--output', '/tmp/report.json']),
    { sample: 5, output: '/tmp/report.json' });
  for (const value of ['0', '11', '-1', 'bad', '1.5']) {
    assert.throws(() => parseProbeArgs(['--sample', value]));
  }
  assert.throws(() => parseProbeArgs(['--retry-forever']));
  assert.deepEqual(selectProbeIds(['c','a','b','a'], 2), ['a','c']);
});

test('probe collects cache metadata but treats blocked HEAD as inconclusive', async () => {
  const fake = async (_url, options) => {
    assert.equal(options.method, 'HEAD');
    return { ok: false, status: 405, headers: new Map([['content-type','text/html']]) };
  };
  const result = await probeImage(id, fake);
  assert.equal(result.outcome, 'inconclusive');
  assert.equal(result.status, 405);
  assert.equal(result.declaredBytes, null);
});

test('probe records declared length without claiming downloaded payload size', async () => {
  const fake = async () => ({ ok: true, status: 200,
    headers: new Map([['content-type','image/jpeg'],['content-length','210123'],['cache-control','public, max-age=86400']]) });
  const result = await probeImage(id, fake);
  assert.equal(result.outcome, 'reachable');
  assert.equal(result.declaredBytes, 210123);
  assert.equal(result.cacheControl, 'public, max-age=86400');
});
