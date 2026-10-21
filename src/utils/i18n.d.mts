export type Locale = 'en' | 'pt-BR';
export interface UiCopy {
  navigation: readonly string[];
  navAria: string;
  mobileAria: string;
  toggle: string;
  menu: string;
  skip: string;
  homeAria: string;
  footerIntro: string;
  footerLinks: readonly string[];
  supportAria: string;
  support: string;
  legal: string;
  credit: string;
}
export function uiFor(locale: Locale): UiCopy;
export function isTranslatedHome(pathname: string, base?: string): boolean;
export function homeAlternates(origin: URL | string | undefined, base?: string): { lang: Locale; href: string }[];
