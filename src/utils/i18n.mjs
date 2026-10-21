/** Phase 1 translates the landing page only; other URLs remain English. */
export const LANGUAGES = Object.freeze(['en', 'pt-BR']);

const strings = {
  en: {
    navigation: ['Home', 'Discover', 'Search', 'Timeline', 'Characters', 'Archive', 'About'],
    navAria: 'Main navigation', mobileAria: 'Mobile navigation', toggle: 'Toggle navigation',
    menu: 'Menu', skip: 'Skip to content', homeAria: 'Chronicles of the Multiverse, home',
    footerIntro: 'An independent historical guide to the stories behind Magic: The Gathering.',
    footerLinks: ['Timeline', 'Lore glossary', 'About this project'],
    supportAria: 'Support DevIsola on Ko-fi', support: 'Support on Ko-fi ↗',
    legal: 'This is unofficial fan content, not approved or endorsed by Wizards of the Coast. Magic: The Gathering and related marks belong to Wizards of the Coast.',
    credit: 'Created and maintained with love 🖤 by',
  },
  'pt-BR': {
    navigation: ['Início', 'Cronologia (EN)', 'Pessoas (EN)', 'Busca (EN)', 'Sobre (EN)'],
    navAria: 'Navegação principal', mobileAria: 'Navegação móvel', toggle: 'Abrir navegação',
    menu: 'Menu', skip: 'Pular para o conteúdo', homeAria: 'Chronicles of the Multiverse, início',
    footerIntro: 'Um guia histórico independente sobre as histórias de Magic: The Gathering.',
    footerLinks: ['Linha do tempo (EN)', 'Glossário (EN)', 'Sobre o projeto (EN)'],
    supportAria: 'Apoie DevIsola no Ko-fi', support: 'Apoiar no Ko-fi ↗',
    legal: 'Conteúdo não oficial de fãs, sem aprovação ou endosso da Wizards of the Coast. Magic: The Gathering e marcas relacionadas pertencem à Wizards of the Coast.',
    credit: 'Criado e mantido com carinho 🖤 por',
  },
};

export function uiFor(locale) {
  if (!LANGUAGES.includes(locale)) throw new Error(`Unsupported locale: ${locale}`);
  return strings[locale];
}

export function isTranslatedHome(pathname, base = '/mtg-history/') {
  return pathname === base || pathname === `${base}pt-br/`;
}

export function homeAlternates(origin, base = '/mtg-history/') {
  if (!origin || !base.startsWith('/') || !base.endsWith('/')) {
    throw new Error('Invalid localized origin or base');
  }
  return [
    { lang: 'en', href: new URL(base, origin).href },
    { lang: 'pt-BR', href: new URL(`${base}pt-br/`, origin).href },
  ];
}
