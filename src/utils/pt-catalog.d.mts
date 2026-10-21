export interface PortugueseEra { name: string; summary: string }
export const PORTUGUESE_ERAS: Readonly<Record<string, PortugueseEra>>;
export function portugueseEra(id: string): PortugueseEra;
export function normalizePortugueseQuery(value: unknown): string;
export function matchesPortugueseQuery(terms: unknown, candidate: unknown): boolean;
export function portugueseCatalogStatus(visible: number, total: number): string;
export function setupPortugueseCatalog(documentRoot?: Document): void;
