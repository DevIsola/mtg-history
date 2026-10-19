/**
 * TypeScript surface for the runtime implementation in entity-continuity.mjs.
 * The evidence index denotes shared character citations, not causation or
 * a universal in-world chronology. Keep this contract in sync with the engine.
 */
export interface ContinuityChapter {
  id: string;
  data: { order: number; title: string };
}

export interface ContinuityCharacter {
  id: string;
  name: string;
}

export interface ContinuityEvent {
  id: string;
  chapterId: string;
  characterIds: string[];
}

export interface ContinuityRelationship {
  a: string;
  b: string;
  category: string;
  chapterId: string;
}

export interface ContinuityPerson {
  id: string;
  name: string;
  fromEventId: string;
  toEventId: string;
}

export interface ContinuityTie {
  a: string;
  b: string;
  category: string;
  chapterId: string;
}

export interface ContinuityConnection {
  id: string;
  fromId: string;
  toId: string;
  fromTitle: string;
  toTitle: string;
  people: ContinuityPerson[];
  ties: ContinuityTie[];
}

export function deriveEntityContinuity(
  chapters: ContinuityChapter[],
  characters: ContinuityCharacter[],
  events: ContinuityEvent[],
  relationships: ContinuityRelationship[],
): ContinuityConnection[];

export function entityConnectionsForChapter(
  chapterId: string,
  connections: ContinuityConnection[],
  limit?: number,
): ContinuityConnection[];
