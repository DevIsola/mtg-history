/**
 * One-time, exact-match consumer migration. Each replacement is asserted to
 * occur exactly once. Changes are only written after ALL files pass preflight.
 * Removing the legacy printing fields is a separate editorial migration.
 */
const edit = (from, to) => ({ from, to });

export const transformations = {
  'src/components/HistoricalCard.astro': [
    edit("import type { CollectionEntry } from 'astro:content';",
      "import { getEntry } from 'astro:content';\nimport type { CollectionEntry } from 'astro:content';"),
    edit(`const { card } = Astro.props;

const id = card.scryfallId.toLowerCase();

const imageUrl =
  \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`;

const cardUrl =
  \`https://scryfall.com/card/\${card.setCode}/\${card.collectorNumber}\`;`,
`const { card: legacyCard } = Astro.props;
const printing = await getEntry('cards', legacyCard.scryfallId);
if (!printing) throw new Error(\`Missing canonical card \${legacyCard.scryfallId}\`);
// Printing fields come only from the canonical collection. Significance is local.
const card = { ...printing.data, scryfallId: printing.id, significance: legacyCard.significance };
const id = printing.id;
const imageUrl =
  \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`;
const cardUrl =
  \`https://scryfall.com/card/\${card.setCode}/\${card.collectorNumber}\`;`),
  ],
  'src/components/HistoricalMoment.astro': [
    edit("import type { CollectionEntry } from 'astro:content';", "import { getEntry } from 'astro:content';\nimport type { CollectionEntry } from 'astro:content';"),
    edit("const { card } = Astro.props;\n---", `const { card } = Astro.props;
const printing = await getEntry('cards', card.scryfallId);
if (!printing) throw new Error(\`Missing canonical card \${card.scryfallId}\`);
---`),
    edit("aria-label={'Historical illustration: ' + card.name}", "aria-label={'Historical illustration: ' + printing.data.name}"),
  ],
  'src/components/CardHoverPreview.astro': [
    edit(`import type { CharacterProfile } from '../data/characters';`, `import { getEntry } from 'astro:content';
import { cardImageUrl } from '../utils/card-printings';`),
    edit(`  card: CharacterProfile['featuredCard'];`, `  cardId: string;`),
    edit(`const { name, card } = Astro.props;
const id = card.scryfallId.toLowerCase();
const imageUrl =
  \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`;`,
`const { name, cardId } = Astro.props;
const printing = await getEntry('cards', cardId);
if (!printing) throw new Error(\`Missing canonical card \${cardId}\`);
const card = printing.data;
const imageUrl = cardImageUrl(printing.id);`),
  ],
  'src/components/CharacterLink.astro': [
    edit(`<CardHoverPreview name={character.name} card={character.featuredCard}>`,
      `<CardHoverPreview name={character.name} cardId={character.featuredCardId}>`),
  ],
  'src/data/characters.ts': [
    edit(`  chapterIds: string[];
  featuredCard: HistoricalCard;`,
      `  chapterIds: string[];
  featuredCardId: string;
  featuredCard: HistoricalCard;`),
  ],
  'src/data/events.ts': [
    edit(`  characterIds: string[];
  cardName: string;`,
      `  characterIds: string[];
  cardName: string;
  cardId: string;`),
  ],
  'src/pages/characters/[id].astro': [
    edit(`import { getCollection } from 'astro:content';`, `import { getCollection, getEntry } from 'astro:content';`),
    edit(`const { profile } = Astro.props as {
  profile: CharacterProfile;
};`,
`const { profile } = Astro.props as {
  profile: CharacterProfile;
};
const featuredPrinting = await getEntry('cards', profile.featuredCardId);
if (!featuredPrinting) throw new Error(\`Missing canonical portrait \${profile.featuredCardId}\`);
const featuredCard = {
  ...featuredPrinting.data,
  scryfallId: featuredPrinting.id,
  significance: profile.featuredCard.significance,
};`),
    edit(`aria-label={\`Illustrated card: \${profile.featuredCard.name}\`}`, `aria-label={\`Illustrated card: \${featuredCard.name}\`}`),
    edit(`<HistoricalCard card={profile.featuredCard} />`, `<HistoricalCard card={featuredCard} />`),
  ],
  'src/pages/archive/index.astro': [
    edit(`import { withBase } from '../../utils/paths';`,
`import { withBase } from '../../utils/paths';
import { chapterCardUse, cardImageUrl, cardScryfallUrl } from '../../utils/card-printings';`),
    edit(`const sections = chapters`, `const cardCatalog = new Map((await getCollection('cards')).map(({ id, data }) => [id, data]));

const sections = chapters`),
    edit(`  .filter((chapter) => chapter.data.cards.length > 0)`, `  .filter((chapter) => chapter.data.cardIds.length > 0)`),
    edit(`    cards: chapter.data.cards.map((card) => {
      const id = card.scryfallId.toLowerCase();

      return {
        ...card,
        imageUrl:
          \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`,
        cardUrl:
          \`https://scryfall.com/card/\${card.setCode}/\${card.collectorNumber}\`,
      };
    }),`,
`    cards: chapter.data.cardIds.map((id, index) => {
      const card = chapterCardUse(chapter, index, cardCatalog);
      return { ...card, imageUrl: cardImageUrl(id), cardUrl: cardScryfallUrl(card) };
    }),`),
  ],
  'src/pages/events/index.astro': [
    edit(`import { withBase } from '../../utils/paths';`,
`import { withBase } from '../../utils/paths';
import { resolvePrinting, cardImageUrl } from '../../utils/card-printings';`),
    edit(`const sections = chapters`, `const cardCatalog = new Map((await getCollection('cards')).map(({ id, data }) => [id, data]));

const sections = chapters`),
    edit(`        const card = chapter.data.cards.find(
          (entry) => entry.name === event.cardName
        );

        if (!card) {
          throw new Error(
            \`Missing card "\${event.cardName}" for event "\${event.id}"\`
          );
        }

        const id = card.scryfallId.toLowerCase();

        return {
          event,
          imageUrl:
            \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`,
        };`,
`        if (!chapter.data.cardIds.includes(event.cardId)) {
          throw new Error(\`Event \${event.id}: printing \${event.cardId} not curated in chapter \${chapter.id}\`);
        }
        const card = resolvePrinting(cardCatalog, event.cardId, \`event \${event.id}\`);
        return { event, cardName: card.name, imageUrl: cardImageUrl(event.cardId) };`),
    edit(`{events.map(({ event, imageUrl }) => (`, `{events.map(({ event, imageUrl, cardName }) => (`),
    edit('alt={`${event.cardName}, a card illustrating this historical period`}',
      'alt={`${cardName}, a card illustrating this historical period`}'),
  ],
  'src/pages/events/[id].astro': [
    edit(`import { withBase } from '../../utils/paths';`,
`import { withBase } from '../../utils/paths';
import { chapterCardUse } from '../../utils/card-printings';`),
    edit(`type Card = Chapter['data']['cards'][number];`, `type Card = ReturnType<typeof chapterCardUse>;`),
    edit(`  const chapters = await getCollection('chapters');`,
`  const chapters = await getCollection('chapters');
  const cardCatalog = new Map((await getCollection('cards')).map(({ id, data }) => [id, data]));`),
    edit(`    const card = chapter.data.cards.find(
      (entry) => entry.name === event.cardName
    );

    if (!card) {
      throw new Error(
        \`Missing card "\${event.cardName}" for event "\${event.id}"\`
      );
    }`,
`    const index = chapter.data.cardIds.indexOf(event.cardId);
    if (index < 0) throw new Error(\`Event \${event.id}: card not curated in \${chapter.id}\`);
    const card = chapterCardUse(chapter, index, cardCatalog);`),
  ],
  'src/pages/discover/index.astro': [
    edit(`import { withBase } from '../../utils/paths';`,
`import { withBase } from '../../utils/paths';
import { chapterCardUse, resolvePrinting, cardImageUrl } from '../../utils/card-printings';`),
    edit(`const cardImage = (scryfallId: string): string => {
  const id = scryfallId.toLowerCase();
  return \`https://cards.scryfall.io/normal/front/\${id[0]}/\${id[1]}/\${id}.jpg\`;
};`,
`const cardCatalog = new Map((await getCollection('cards')).map(({ id, data }) => [id, data]));`),
    edit(`  const illustration = chapter.data.cards[0];`,
`  const illustration = chapter.data.cardIds.length
    ? chapterCardUse(chapter, 0, cardCatalog) : undefined;`),
    edit(`? cardImage(illustration.scryfallId)`, `? cardImageUrl(illustration.scryfallId)`),
    edit(`      ...chapter.data.cards.flatMap((card) => [
        card.name,
        card.significance,
      ]),`,
`      ...chapter.data.cardIds.flatMap((_, index) => {
        const card = chapterCardUse(chapter, index, cardCatalog);
        return [card.name, card.significance];
      }),`),
    edit(`    return {
      id: character.id,
      type: 'character',`,
`    const portrait = resolvePrinting(cardCatalog, character.featuredCardId, \`character \${character.id}\`);

    return {
      id: character.id,
      type: 'character',`),
    edit(`illustration: character.featuredCard.name,`, `illustration: portrait.name,`),
    edit(`imageUrl: cardImage(character.featuredCard.scryfallId),`, `imageUrl: cardImageUrl(portrait.scryfallId),`),
    edit(`        character.featuredCard.name,`, `        portrait.name,`),
    edit(`    const card = chapter.data.cards.find(
      (entry) => entry.name === event.cardName
    );

    if (!card) {
      throw new Error(
        \`Missing illustration "\${event.cardName}" for event "\${event.id}"\`
      );
    }`,
`    if (!chapter.data.cardIds.includes(event.cardId)) {
      throw new Error(\`Event \${event.id}: card not curated in \${chapter.id}\`);
    }
    const card = resolvePrinting(cardCatalog, event.cardId, \`event \${event.id}\`);`),
    edit(`imageUrl: cardImage(card.scryfallId),`, `imageUrl: cardImageUrl(card.scryfallId),`),
    edit(`        event.cardName,`, `        card.name,`),
  ],
};

/** Fail on missing/ambiguous anchors, even if previous edits in the same file succeed. */
export function transformConsumer(path, source) {
  const edits = transformations[path];
  if (!edits) throw new Error(`Unrecognized consumer path ${path}`);
  let output = source;
  for (const { from, to } of edits) {
    const first = output.indexOf(from);
    if (first < 0 || output.indexOf(from, first + from.length) !== -1) {
      throw new Error(`${path}: missing or ambiguous migration anchor: ${from.slice(0, 60)}`);
    }
    output = output.slice(0, first) + to + output.slice(first + from.length);
  }
  return output;
}
