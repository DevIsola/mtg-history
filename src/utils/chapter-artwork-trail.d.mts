export const ARTWORK_MOMENT_SELECTOR: string;
export function chapterArtworkEntries(root: Element | null): Array<{
  element: Element;
  title: string;
  credit: string;
  printingId: string;
}>;
export function activeArtworkIndex(tops: number[], activationLine: number): number;
export function setupChapterArtworkTrail(root: Element | null): {
  count: number;
  disconnect(): void;
};
