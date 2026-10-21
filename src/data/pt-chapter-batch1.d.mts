export interface PortugueseChapterSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
}
export interface PortugueseChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  sections: readonly PortugueseChapterSection[];
  eventIds: readonly string[];
}
export const PORTUGUESE_BATCH_1: readonly PortugueseChapter[];
export const BATCH_1_IDS: readonly string[];
export function portugueseChapter(id: string): PortugueseChapter | null;
