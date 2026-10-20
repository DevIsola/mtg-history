import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = p =>
  readFileSync(new URL('../' + p, import.meta.url), 'utf8')
    .replace(/\r\n?/g, '\n');

const chapter = read('src/content/chapters/many-worlds.mdx');
const notes = read('docs/ravnica-historical-depth-wave2z.md');

const headings = [
  'The original Guildpact assigned power as well as responsibility',
  'Savra, Szadek, and the paradox of a lawful arrest',
  'Project Kraj was a separate disaster, not the cause of the first collapse',
  'Agyrem and the Parhelion: another front in the same crisis',
  "The limits of Teysa's replacement accord",
];

test('five unique additions remain inside the Ravnica arc and in reading order', () => {
  const positions = headings.map(h => {
    assert.equal(chapter.split('### ' + h).length - 1, 1, h);
    return chapter.indexOf('### ' + h);
  });

  assert.deepEqual(positions, [...positions].sort((a,b) => a-b));
  assert.ok(positions[0] > chapter.indexOf('## II. Ravnica'));
  assert.ok(positions[4] < chapter.indexOf('## V. Ravnica'));
  assert.ok(positions[4] < chapter.indexOf('## VI. Zendikar'));
});

test('guild founders, House Dimir secrecy, and legal paradox are distinguished', () => {
  assert.match(chapter, /founding leaders, the paruns/);
  assert.match(chapter, /secrecy was part of the original settlement/);
  assert.match(chapter, /Savra was not simply a coauthor/);
  assert.match(chapter, /arrest triggered the very legal paradox/);
  assert.match(chapter, /Augustin IV had anticipated/);
});

test('Project Kraj was a later catastrophe with separate causes', () => {
  assert.match(chapter, /Kos killed Vig before he could take control/);
  assert.match(chapter, /Kraj continued as a destructive force/);
  assert.match(chapter, /Rakdos clashed with it/);
  assert.match(chapter, /not the act that originally dissolved/);
});

test('Agyrem distinguishes interplanar causes from Ravnican political events', () => {
  assert.match(chapter, /temporal-planar damage centered on Dominaria/);
  assert.match(chapter, /Razia led the Parhelion through the Schism/);
  assert.match(chapter, /an Azorius contract kept him serving as a spirit/);
  assert.match(chapter, /aftermath of the initial Guildpact break/);
});

test('Teysa accord retains its nonmagical and incomplete character', () => {
  assert.match(chapter, /House Dimir was believed destroyed and was omitted/);
  assert.match(chapter, /It did not magically compel participation/);
  assert.match(chapter, /much later Living Guildpact/);
  assert.match(notes, /No new chapter, card printings, character records, or event IDs/);
});

test('all original printing identities, moments, event links and bibliography remain intact', () => {
  const ids = [...chapter.matchAll(
    /^  - ([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/gm
  )].map(m => m[1]);

  const events = [...chapter.matchAll(
    /<HistoricalEventReference id="([^"]+)"/g
  )].map(m => m[1]);

  assert.deepEqual(ids, ["2882793e-5d7d-47f0-9308-652a5e036c2c","e525be2e-26e6-4082-b713-ac74fcbd13d3","9eb856e6-8f63-4048-9818-cc3e65748855","45f43bd0-d4d9-4a64-a829-f1ea3dfc9e90","c3b21941-1b7d-4fde-8b1d-7edbd5e5b796","225e3cc6-34d0-4f81-9f49-162d97e2ea59","67600383-bbb8-411c-b8e6-2296650bc747","27bb371f-d49f-41bd-bbe0-d5e1e2067e36","16d2448c-1b2e-466a-a0ab-e20ba1de6bc9","ba149706-cd17-4da6-8403-ccfe2d6cb437","b51666ae-2aef-4cb1-9cd4-44aec81530f8"]);
  assert.deepEqual(events, ["ravnica-guildpact-collapse","ravnica-project-kraj","ravnica-nonmagical-guild-accord","zendikar-nahiri-chooses-prison","zendikar-hedrons","zendikar-eye-rupture","zendikar-eldrazi-awakening","innistrad-avacyn-created","innistrad-helvault-imprisonment","innistrad-thalia-breaks-helvault","innistrad-avacyn-restored"]);
  assert.equal((chapter.match(/<HistoricalMoment cardId=/g) || []).length, 11);

  for (const title of [
    'Ravnica, Then and Now',
    'The Known Multiverse',
    'A Flavorful Guide to the Guilds of Ravnica',
  ]) {
    assert.equal(
      chapter.split('  - title: "' + title + '"').length - 1,
      1,
      title
    );
  }
});
