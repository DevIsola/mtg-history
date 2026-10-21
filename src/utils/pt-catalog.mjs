/** Portuguese directory labels are editorial summaries, not translated source records. */
export const PORTUGUESE_ERAS = Object.freeze({
  'thran': { name: 'Os Thran e a origem de Phyrexia', summary: 'Halcyon, a ascensão de Yawgmoth e os acontecimentos que antecederam a Guerra dos Irmãos.' },
  'brothers-war': { name: 'A Guerra dos Irmãos', summary: 'A rivalidade entre Urza e Mishra transforma Terisiare e culmina na destruição de Argoth.' },
  'ice-age': { name: 'A Escuridão e a Era Glacial', summary: 'Dominária atravessa perseguições, conflitos em Sarpadia e um inverno encerrado pelo Feitiço Mundial.' },
  'weatherlight': { name: 'A Saga de Bons Ventos', summary: 'A tripulação de Gerrard enfrenta os planos de Yawgmoth e a invasão de Dominária.' },
  'otaria': { name: 'O Mirari e Otaria', summary: 'O Mirari alimenta a disputa entre facções, enquanto as trajetórias de Jeska e Akroma convergem.' },
  'mending': { name: 'Espiral Temporal e a Reparação', summary: 'Fendas temporais ameaçam Dominária e exigem sacrifícios para reparar a realidade.' },
  'many-worlds': { name: 'Histórias entre planos', summary: 'Ravnica, Zendikar e Innistrad enfrentam crises distintas que mudam seus mundos.' },
  'war-of-the-spark': { name: 'A Guerra da Centelha', summary: 'Nicol Bolas reúne planeswalkers em Ravnica e enfrenta a resistência das guildas.' },
  'march-of-the-machine': { name: 'A invasão de Nova Phyrexia', summary: 'A invasão liderada por Elesh Norn se espalha pelo Multiverso e encontra resistência.' },
  'omenpaths': { name: 'A era dos Caminhos Pressagiados', summary: 'Novas passagens entre planos alteram as viagens e os encontros após a invasão.' },
});

export function portugueseEra(id) {
  const entry = PORTUGUESE_ERAS[id];
  if (!entry) throw new Error(`Unknown era for Portuguese directory: ${id}`);
  return entry;
}

export function normalizePortugueseQuery(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesPortugueseQuery(terms, candidate) {
  const query = normalizePortugueseQuery(terms);
  if (!query) return true;
  const haystack = normalizePortugueseQuery(candidate);
  return query.split(' ').every((term) => haystack.includes(term));
}

export function portugueseCatalogStatus(visible, total) {
  if (!Number.isInteger(visible) || !Number.isInteger(total) || visible < 0 || total < visible) {
    throw new Error('Invalid Portuguese catalog result counts');
  }
  return visible === 0 ? 'Nenhum registro encontrado.' : `${visible} de ${total} registros exibidos.`;
}

/** Progressive enhancement: without JavaScript all records remain visible. */
export function setupPortugueseCatalog(documentRoot = document) {
  for (const root of documentRoot.querySelectorAll('[data-pt-catalog]')) {
    const controls = root.querySelector('[data-pt-controls]');
    const search = root.querySelector('[data-pt-query]');
    const clear = root.querySelector('[data-pt-clear]');
    const status = root.querySelector('[data-pt-status]');
    const records = [...root.querySelectorAll('[data-pt-entry]')];
    const groups = [...root.querySelectorAll('[data-pt-group]')];
    if (!controls || !search || !clear || !status || records.length === 0) continue;
    const apply = () => {
      let visible = 0;
      for (const entry of records) {
        const candidate = `${entry.dataset.ptSearch ?? ''} ${entry.textContent ?? ''}`;
        const matches = matchesPortugueseQuery(search.value, candidate);
        entry.hidden = !matches;
        if (matches) visible++;
      }
      for (const group of groups) {
        group.hidden = !group.querySelector('[data-pt-entry]:not([hidden])');
      }
      clear.disabled = !search.value;
      status.textContent = portugueseCatalogStatus(visible, records.length);
    };
    controls.hidden = false;
    search.addEventListener('input', apply);
    search.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && search.value) {
        search.value = '';
        apply();
      }
    });
    clear.addEventListener('click', () => {
      search.value = '';
      apply();
      search.focus();
    });
    apply();
  }
}
