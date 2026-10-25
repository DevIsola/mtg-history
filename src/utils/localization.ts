import characters from '../data/pt-br/characters.json';
import events from '../data/pt-br/events.json';
import relationships from '../data/pt-br/relationships.json';
import glossary from '../data/pt-br/glossary.json';
import paths from '../data/pt-br/paths.json';
import provenance from '../data/pt-br/provenance.json';
import type { Locale } from './locale';
export { localeForPath, localPath } from './locale';
const catalogs = { characters, events, relationships, glossary, paths, provenance };
export function localized<T extends object>(kind: keyof typeof catalogs, record: T, locale: Locale): T {
  if (locale === 'en') return record;
  const catalog: Record<string, object> = catalogs[kind];
  const identity = record as Partial<Record<'id' | 'a' | 'b' | 'category' | 'chapterId', string>>;
  const id = identity.id ?? (kind === 'relationships'
    ? [...[identity.a!, identity.b!].sort(), identity.category, identity.chapterId].join('--')
    : undefined);
  const translation = id ? catalog[id] : undefined;
  if (!translation) throw new Error(`Missing complete PT-BR ${kind} translation: ${id}`);
  return { ...record, ...translation };
}
export function text(locale: Locale, english: string, portuguese: string): string {
  return locale === 'pt-BR' ? portuguese : english;
}
