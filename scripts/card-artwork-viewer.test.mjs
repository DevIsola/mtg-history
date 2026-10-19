import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCardArtworkViewerModel, shouldAnimateCardArtwork } from '../src/utils/card-artwork-viewer.mjs';

const id = 'a736df42-18e9-4259-b0b8-54d21143e72e';
const record = {
  id,
  name: 'Glacian, Powerstone Engineer',
  artist: 'Magali Villeneuve',
  setCode: 'cmr',
  collectorNumber: '72',
  significance: 'A curated historical interpretation.',
};

test('viewer uses the selected exact printing, full-card image and human credit', () => {
  const model = buildCardArtworkViewerModel(record);
  assert.equal(model.printingId, id);
  assert.equal(model.imageUrl, `https://cards.scryfall.io/normal/front/a/7/${id}.jpg`);
  assert.match(model.imageSrcset, /small\/front\/.*146w, .*normal\/front\/.*488w, .*large\/front\/.*672w/);
  assert.equal(model.cardUrl, 'https://scryfall.com/card/cmr/72');
  assert.equal(model.attribution, 'Illustrated by Magali Villeneuve · CMR #72');
  assert.equal(model.significance, record.significance);
});

test('printing UUID is normalized, but a title cannot substitute for an ID', () => {
  assert.equal(buildCardArtworkViewerModel({ ...record, id: id.toUpperCase() }).printingId, id);
  assert.throws(() => buildCardArtworkViewerModel({ ...record, id: record.name }), /Invalid Scryfall printing UUID/);
});

test('rejects missing credit, invalid set code, and bad collector metadata', () => {
  assert.throws(() => buildCardArtworkViewerModel({ ...record, artist: '' }), /credited artist/);
  assert.throws(() => buildCardArtworkViewerModel({ ...record, setCode: '../../other' }), /canonical set/);
  assert.throws(() => buildCardArtworkViewerModel({ ...record, collectorNumber: '../99' }), /canonical set/);
});

test('untrusted descriptive fields remain text and are never parsed as HTML', () => {
  const model = buildCardArtworkViewerModel({ ...record, name: '<img onerror=alert(1)>', significance: '<script>bad</script>' });
  assert.equal(model.title, '<img onerror=alert(1)>');
  assert.equal(model.significance, '<script>bad</script>');
});

test('View Transitions require API support, loaded source and motion preference', () => {
  assert.equal(shouldAnimateCardArtwork({ reducedMotion: false, supported: true, sourceLoaded: true }), true);
  for (const options of [
    { reducedMotion: true, supported: true, sourceLoaded: true },
    { reducedMotion: false, supported: false, sourceLoaded: true },
    { reducedMotion: false, supported: true, sourceLoaded: false },
  ]) assert.equal(shouldAnimateCardArtwork(options), false);
});
