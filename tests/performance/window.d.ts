// Test-only browser metrics populated by the Playwright performance observer.
// This declaration adds typing; it does not create or change runtime values.
export {};

declare global {
  interface Window {
    __mtgPerformance: {
      lcpMs: number | null;
      cls: number;
    };
  }
}
