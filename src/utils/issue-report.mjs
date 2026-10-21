/** Pre-filled GitHub issue links for the ten Portuguese reading editions. */
export const ISSUE_CATEGORIES = Object.freeze([
  Object.freeze({ id: 'traducao', label: 'Tradução' }),
  Object.freeze({ id: 'historico', label: 'Precisão histórica' }),
  Object.freeze({ id: 'arte', label: 'Arte e ilustração' }),
  Object.freeze({ id: 'link', label: 'Link quebrado' }),
  Object.freeze({ id: 'acessibilidade', label: 'Acessibilidade' }),
]);

const ISSUE_DESTINATION = 'https://github.com/DevIsola/mtg-history/issues/new';

/** Build a link; submission remains entirely under the reader's control on GitHub. */
export function reportIssueUrl({ chapterId, chapterTitle, category, pageUrl }) {
  if (typeof chapterId !== 'string' || !/^[a-z][a-z0-9-]*$/.test(chapterId)) {
    throw new Error('Invalid historical chapter ID');
  }
  if (typeof chapterTitle !== 'string' || chapterTitle.trim().length < 3) {
    throw new Error('Missing historical chapter title');
  }
  const selected = ISSUE_CATEGORIES.find(item => item.id === category);
  if (!selected) throw new Error('Unknown issue category');

  const source = new URL(pageUrl);
  if (!['https:', 'http:'].includes(source.protocol) ||
      !source.pathname.endsWith(`/pt-br/chapters/${chapterId}/`)) {
    throw new Error('Invalid Portuguese chapter URL');
  }
  const issue = new URL(ISSUE_DESTINATION);
  issue.search = new URLSearchParams({
    title: `[PT-BR][${selected.label}] ${chapterTitle.trim()}`,
    body: [
      '## Página e capítulo',
      `- Capítulo: ${chapterTitle.trim()} (${chapterId})`,
      `- URL: ${source.href}`,
      `- Categoria: ${selected.label}`,
      '',
      '## Descrição do problema',
      '[Descreva o trecho, o problema encontrado e onde ele aparece.]',
      '',
      '## Correção sugerida',
      '[Explique como deveria aparecer, se souber.]',
      '',
      '## Fontes ou evidências (opcional)',
      '[Inclua referências, capturas de tela ou links que apoiem a correção.]',
      '',
      '---',
      'O envio será feito apenas quando você publicar esta issue no GitHub.',
    ].join('\n'),
  }).toString();
  return issue.href;
}
