import { getCollection } from 'astro:content';
import { characters } from '../data/characters';
import { historicalEvents } from '../data/events';
import { chapterCardUse } from './card-printings';
export async function getEventStaticPaths() {
  const chapters = await getCollection('chapters');
  const cardCatalog = new Map((await getCollection('cards')).map(({ id, data }) => [id, data]));

  return historicalEvents.map((event) => {
    const chapter = chapters.find(
      (entry) => entry.id === event.chapterId
    );

    if (!chapter) {
      throw new Error(
        `Missing chapter "${event.chapterId}" for event "${event.id}"`
      );
    }

    const index = chapter.data.cardIds.findIndex((reference) => reference.id === event.cardId);
    if (index < 0) throw new Error(`Event ${event.id}: card not curated in ${chapter.id}`);
    const card = chapterCardUse(chapter, index, cardCatalog);

    for (const id of event.characterIds) {
      if (!characters.some((character) => character.id === id)) {
        throw new Error(
          `Unknown character "${id}" in event "${event.id}"`
        );
      }
    }

    return {
      params: { id: event.id },
      props: { event, chapter, card },
    };
  });
}

