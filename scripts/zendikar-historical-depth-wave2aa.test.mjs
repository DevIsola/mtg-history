import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';

const read = p =>
  readFileSync(new URL('../' + p, import.meta.url), 'utf8')
    .replace(/\r\n?/g, '\n');

const chapter = read('src/content/chapters/many-worlds.mdx');
const notes = read('docs/zendikar-historical-depth-wave2aa.md');

const digest = text =>
  createHash('sha256').update(text).digest('hex');

const zendikarStart = '## VI. Zendikar: A Living, Dangerous World';
const innistradStart = '## IX. Innistrad: Humanity in the Shadow of Monsters';

const headings = [
  'The Roil was already part of the first Zendikar setting',
  'Forty years of lithomancy and a three-walker lock',
  'The first near-escape preceded the Worldwake crisis',
  'An activated Eye released broods before Nissa freed the titans',
  'The later defense of Sea Gate belongs to a separate campaign',
];

test('five new Zendikar sections occur once, in historical reading order', () => {
  const starts = headings.map(title => {
    const marker = '### ' + title;

    assert.equal(chapter.split(marker).length - 1, 1, title);
    return chapter.indexOf(marker);
  });

  assert.deepEqual(starts, [...starts].sort((a, b) => a - b));
  assert.ok(starts[0] > chapter.indexOf(zendikarStart));
  assert.ok(starts.at(-1) < chapter.indexOf(innistradStart));
});

test('construction and earlier near-escape are distinct historical episodes', () => {
  assert.match(chapter, /forty years.*shaping the hedrons/);
  assert.match(chapter, /require three planeswalkers acting together/);
  assert.match(chapter, /earlier near-escape/);
  assert.match(chapter, /Nahiri repaired the prison herself/);
  assert.match(chapter, /exact calendar year is not supplied/);
});

test('the Eye breach, brood release and Nissa decision remain separate', () => {
  assert.match(chapter, /Sarkhan Vol at the Eye of Ugin/);
  assert.match(chapter, /released Eldrazi spawn/);
  assert.match(chapter, /Nissa instead broke the final bonds/);
  assert.match(chapter, /The \*\*Eye's initial activation\*\*/);
  assert.match(chapter, /2015-2016 return to Zendikar/);
});

test('2009 worldbuilding is distinguished from the subsequent prison reveal', () => {
  assert.match(chapter, /original \*A Planeswalker's Guide to Zendikar\* \(2009\)/);
  assert.match(chapter, /The Roil is not an Eldrazi titan/);
  assert.match(chapter, /guide does not establish that every earthquake/);
  assert.match(notes, /original 2009 guide/);
});

test('Ravnica and Innistrad bodies remain byte-identical after LF normalization', () => {
  const withoutAddedSource = chapter.split(zendikarStart)[0].replace(
    /  - title: "A Planeswalker's Guide to Zendikar"\n    kind: official\n    url: "https:\/\/magic\.wizards\.com\/en\/news\/feature\/a-planeswalkers-guide-to-zendikar"\n\n/,
    ''
  );

  assert.equal(
    digest(withoutAddedSource),
    "c67a16b4b2260f8197e0406548b4374e2fa3eb00d5cf4ff0867d01399c86a99d"
  );

  assert.equal(
    digest(innistradStart + chapter.split(innistradStart)[1]),
    "cfa1927e512632c37f4d053f3080a6b95401668a78e8cfd8c39ab3032df8aeb6"
  );
});

test('exact printings, scenes, events, and source attribution are preserved', () => {
  const ids = [...chapter.matchAll(
    /^  - ([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/gm
  )].map(x => x[1]);

  const events = [...chapter.matchAll(
    /<HistoricalEventReference id="([^"]+)"/g
  )].map(x => x[1]);

  assert.deepEqual(ids, ["2882793e-5d7d-47f0-9308-652a5e036c2c","e525be2e-26e6-4082-b713-ac74fcbd13d3","9eb856e6-8f63-4048-9818-cc3e65748855","45f43bd0-d4d9-4a64-a829-f1ea3dfc9e90","c3b21941-1b7d-4fde-8b1d-7edbd5e5b796","225e3cc6-34d0-4f81-9f49-162d97e2ea59","67600383-bbb8-411c-b8e6-2296650bc747","27bb371f-d49f-41bd-bbe0-d5e1e2067e36","16d2448c-1b2e-466a-a0ab-e20ba1de6bc9","ba149706-cd17-4da6-8403-ccfe2d6cb437","b51666ae-2aef-4cb1-9cd4-44aec81530f8"]);
  assert.deepEqual(events, ["ravnica-guildpact-collapse","ravnica-project-kraj","ravnica-nonmagical-guild-accord","zendikar-nahiri-chooses-prison","zendikar-hedrons","zendikar-eye-rupture","zendikar-eldrazi-awakening","innistrad-avacyn-created","innistrad-helvault-imprisonment","innistrad-thalia-breaks-helvault","innistrad-avacyn-restored"]);

  assert.equal(
    (chapter.match(/<HistoricalMoment cardId=/g) ?? []).length,
    11
  );

  for (const title of [
    "A Planeswalker's Guide to Zendikar",
    'The Lithomancer',
    'The Battle of Fort Keff',
    'Battle for Zendikar Story Summary',
  ]) {
    assert.equal(
      chapter.split('  - title: "' + title + '"').length - 1,
      1,
      title
    );
  }

  assert.equal((chapter.match(/^  - title: /gm) ?? []).length, 14);
  assert.match(notes, /No new historical event records or card references/);
});
