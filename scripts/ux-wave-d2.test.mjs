import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { localizedArchiveCard, verifiedPortugueseVariant } from '../src/utils/pt-printings.mjs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const id = '12345678-1234-1234-1234-123456789abc';
const ptId = '87654321-4321-4321-4321-cba987654321';
const illustrationId = 'aaaabbbb-cccc-dddd-eeee-ffffffffffff';
const canonical = { scryfallId:id, name:'Test Card', setCode:'bro', collectorNumber:'13', artist:'Illustrator' };
const englishCard = { object:'card', id, lang:'en', set:'bro', collector_number:'13', illustration_id:illustrationId, image_uris:{normal:'url'} };
const ptCard = { object:'card', id:ptId, lang:'pt', set:'bro', collector_number:'13', illustration_id:illustrationId, artist:'Illustrator', printed_name:'Carta de teste', image_uris:{normal:'url'} };

test('unmapped cards retain their exact English canonical printing', () => {
  const result = localizedArchiveCard(canonical, {version:1, cards:{}});
  assert.equal(result.printingId, id);
  assert.equal(result.language, 'en');
  assert.match(result.imageUrl, new RegExp(id));
});
test('verified same-art PT printings provide real printed name without changing canonical identity', () => {
  const verified = verifiedPortugueseVariant(canonical, englishCard, ptCard);
  assert.equal(verified.printedName, 'Carta de teste');
  const display = localizedArchiveCard(canonical, {version:1, cards:{[id]:verified}});
  assert.equal(display.printingId, ptId);
  assert.equal(display.canonicalId, id);
  assert.equal(display.language, 'pt');
  assert.match(display.scryfallUrl, /\/bro\/13\/pt$/);
});
test('different illustrations, edition, or untranslated text do not qualify as a PT printing', () => {
  assert.equal(verifiedPortugueseVariant(canonical, englishCard, {...ptCard, illustration_id:ptId}), null);
  assert.equal(verifiedPortugueseVariant(canonical, englishCard, {...ptCard, set:'dmu'}), null);
  assert.equal(verifiedPortugueseVariant(canonical, englishCard, {...ptCard, printed_name:undefined}), null);
  assert.throws(() => localizedArchiveCard(canonical, {cards:{[id]:{id:ptId,lang:'pt'}}}), /Invalid PT printing/);
});
test('D2 site integrates bilingual gallery and Ko-fi button without extra runtime search', () => {
  const pt = read('src/components/PortugueseArchiveGallery.astro');
  const en = read('src/pages/archive/index.astro');
  const header = read('src/components/SiteHeader.astro');
  for (const token of ['chapters.map', 'chapterCardUse', 'archiveCard', 'data-pt-archive-card', 'canonicalId', 'href', 'em inglês']) assert.ok(pt.includes(token),token);
  assert.match(en, /data-canonical-id=/);
  assert.match(en, /Illustrative reference/);
  assert.match(header, /site-header__support/);
  assert.match(header, /https:\/\/ko-fi\.com\/B1H328PBAR/);
  assert.match(header, /rel="noopener noreferrer"/);
  assert.match(read('scripts/sync-pt-printings.mjs'), /verifiedPortugueseVariant/);
});
