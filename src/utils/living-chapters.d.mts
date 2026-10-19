export const LIVING_REVEAL_SELECTOR: string;
export interface LivingChapterRevealOptions {
  Observer?: typeof IntersectionObserver;
  reducedMotion?: boolean;
  viewportHeight?: number;
}
export interface LivingChapterRevealHandle {
  count: number;
  disconnect(): void;
}
export function setupLivingChapterReveals(
  root: Element | null,
  options?: LivingChapterRevealOptions,
): LivingChapterRevealHandle;
