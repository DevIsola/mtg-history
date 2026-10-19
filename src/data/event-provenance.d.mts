/** Type contract for curated event provenance; no source/chronology inferred by software. */
export interface EventProvenanceEntry {
  chronology: { precision: 'relative' | 'undated'; label: string; basis: string };
  sources: Array<{ title: string; url: string; role: 'story' | 'retrospective' | 'design-commentary'; supports: string }>;
  artworkNote: string;
}
export declare const eventProvenance: Record<string, EventProvenanceEntry | undefined>;
export declare function validateEventProvenance(
  records: Record<string, EventProvenanceEntry>,
  events: Array<{ id: string; chapterId: string }>,
  sourcesByChapter: Map<string, Array<{ kind: string; title: string; url?: string }>>,
): string[];
