import { withBase } from './paths';
import ui from '../data/pt-br/ui.json';
import pageUi from '../data/pt-br/page-ui.json';
import readerUi from '../data/pt-br/reader-ui.json';
const messages: Record<string, string> = { ...ui, ...pageUi, ...readerUi };
export type Locale = 'en' | 'pt-BR';
export const localeForPath = (path: string): Locale => /(?:^|\/)pt-br(?:\/|$)/.test(path) ? 'pt-BR' : 'en';
export const localPath = (path: string, locale: Locale) => withBase((locale === 'pt-BR' ? 'pt-br/' : '') + path);
export function phrase(locale: Locale, english: string): string {
  if (locale === 'en') return english;
  const value = messages[english];
  if (!value) throw new Error(`Missing PT-BR UI phrase: ${english}`);
  return value;
}
