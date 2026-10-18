/**
 * Relationship graph Phase 2. The server-rendered HTML relationship cards are
 * the canonical accessible record and the only input to the visual network.
 */
type GraphNode = { id: string; label: string; value: number };
type GraphEdge = {
  id: string;
  from: string;
  to: string;
  category: string;
  labelForA: string;
  labelForB: string;
  context: string;
  chapterHref: string;
  chapterTitle: string;
};
type GraphScope = 'global' | 'local';
type GraphView = 'graph' | 'cards';
type AtlasState = { person: string; category: string };

const categoryColors: Record<string, string> = {
  family: '#d19f56',
  friendship: '#2d9a86',
  alliance: '#3a87ad',
  rivalry: '#c96b63',
  mentorship: '#9679c5',
  creation: '#ac8a62',
};

/** Breadth-first traversal along documented ties, after applying category. */
function neighborhood(edges: GraphEdge[], focus: string, depth: number): Set<string> {
  const reached = new Set([focus]);
  let frontier = new Set([focus]);
  for (let level = 0; level < depth; level++) {
    const next = new Set<string>();
    for (const edge of edges) {
      if (frontier.has(edge.from) && !reached.has(edge.to)) next.add(edge.to);
      if (frontier.has(edge.to) && !reached.has(edge.from)) next.add(edge.from);
    }
    if (!next.size) break;
    for (const id of next) reached.add(id);
    frontier = next;
  }
  return reached;
}

export async function initializeRelationshipGraph(root: HTMLElement): Promise<void> {
  const query = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector);
  const panel = query<HTMLElement>('#network-visual');
  const canvas = query<HTMLElement>('#network-canvas');
  const cards = query<HTMLElement>('#network-grid');
  const controls = query<HTMLElement>('#network-view-switch');
  const graphButton = query<HTMLButtonElement>('#network-show-graph');
  const cardsButton = query<HTMLButtonElement>('#network-show-cards');
  const status = query<HTMLElement>('#network-graph-status');
  const error = query<HTMLElement>('#network-graph-error');
  const select = query<HTMLSelectElement>('#network-person');
  const category = query<HTMLSelectElement>('#network-category');
  const reset = query<HTMLButtonElement>('#network-reset');
  const scope = query<HTMLSelectElement>('#network-scope');
  const depth = query<HTMLSelectElement>('#network-depth');
  const search = query<HTMLInputElement>('#network-search');
  const searchForm = query<HTMLFormElement>('#network-search-form');
  const searchStatus = query<HTMLElement>('#network-search-status');
  const inspectorKind = query<HTMLElement>('#network-inspector-kind');
  const inspectorHeading = query<HTMLElement>('#network-inspector-heading');
  const inspectorSummary = query<HTMLElement>('#network-inspector-summary');
  const inspectorCount = query<HTMLElement>('#network-inspector-count');
  const inspectorRelation = query<HTMLSelectElement>('#network-inspector-relation');
  const inspectorLink = query<HTMLAnchorElement>('#network-inspector-link');
  const inspectorChapter = query<HTMLAnchorElement>('#network-inspector-chapter');
  const zoomIn = query<HTMLButtonElement>('#network-zoom-in');
  const zoomOut = query<HTMLButtonElement>('#network-zoom-out');
  const fit = query<HTMLButtonElement>('#network-fit');

  if (!panel || !canvas || !cards || !controls || !graphButton || !cardsButton ||
      !status || !error || !select || !category || !reset || !scope || !depth ||
      !search || !searchForm || !searchStatus || !inspectorKind || !inspectorHeading ||
      !inspectorSummary || !inspectorCount || !inspectorRelation || !inspectorLink || !inspectorChapter ||
      !zoomIn || !zoomOut || !fit) return;

  const options = Array.from(select.options).filter((item) => item.value);
  const validIds = new Set(options.map((item) => item.value));
  const byId = new Map(options.map((option) => [option.value, option]));
  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-network-edge]'));
  const allEdges: GraphEdge[] = elements.flatMap((element, index) => {
    const from = element.dataset.a;
    const to = element.dataset.b;
    if (!from || !to || !validIds.has(from) || !validIds.has(to)) return [];
    const chapter = element.querySelector<HTMLAnchorElement>('.network-edge__chapter');
    return [{
      id: `relation-${index}`,
      from, to,
      category: element.dataset.category ?? '',
      labelForA: element.dataset.labelA ?? '',
      labelForB: element.dataset.labelB ?? '',
      context: element.querySelector<HTMLElement>(':scope > p')?.textContent?.trim() ?? '',
      chapterHref: chapter?.href ?? '',
      chapterTitle: chapter?.textContent?.trim() ?? '',
    }];
  });
  if (!options.length || !allEdges.length) return;

  const degree = new Map<string, number>();
  for (const edge of allEdges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }
  const allNodes: GraphNode[] = options.map((option) => ({
    id: option.value,
    label: option.textContent?.trim() ?? option.value,
    value: Math.max(1, degree.get(option.value) ?? 0),
  }));
  const state = (): AtlasState => ({ person: select.value, category: category.value });

  try {
    // The only route that loads vis-network. No duplicate graph data or API calls.
    const { DataSet, Network } = await import('vis-network/standalone');
    let view: GraphView = 'graph';
    let inspectedEdge: string | null = null;
    let visibleIds = new Set<string>();
    let visibleEdges: GraphEdge[] = [];
    let settling = true;

    const tokens = () => {
      const styles = getComputedStyle(document.documentElement);
      const value = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
      return {
        background: value('--paper-white', '#ffffff'),
        border: value('--jade', '#0f9877'),
        text: value('--ink', '#172326'),
        focus: value('--gold', '#d5ad58'),
      };
    };
    const palette = () => {
      const theme = tokens();
      return {
        node: {
          background: theme.background,
          border: theme.border,
          highlight: { background: theme.focus, border: theme.focus },
          hover: { background: theme.background, border: theme.focus },
        },
        font: { color: theme.text, face: 'system-ui', size: 13, strokeWidth: 0 },
      };
    };
    const styles = palette();
    const nodeSet = new DataSet(allNodes.map((node) => ({
      ...node, color: styles.node, font: styles.font,
    })));
    const edgeSet = new DataSet(allEdges.map((edge) => ({
      ...edge,
      color: { color: categoryColors[edge.category] ?? '#819497', opacity: 0.78 },
    })));

    panel.hidden = false;
    cards.hidden = true;
    status.textContent = 'Positioning character connections…';
    const graph = new Network(canvas, { nodes: nodeSet, edges: edgeSet }, {
      autoResize: true,
      layout: { randomSeed: 19, improvedLayout: false },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -65,
          centralGravity: 0.018,
          springLength: 105,
          springConstant: 0.07,
          damping: 0.6,
          avoidOverlap: 0.55,
        },
        stabilization: { enabled: true, iterations: 180, updateInterval: 40, fit: true },
      },
      nodes: {
        shape: 'dot',
        scaling: { min: 9, max: 27, label: { enabled: true, min: 11, max: 15 } },
        borderWidth: 2,
        color: styles.node,
        font: styles.font,
      },
      edges: {
        width: 1.6,
        smooth: { enabled: true, type: 'continuous', roundness: 0.15 },
        selectionWidth: 2,
        hoverWidth: 2,
      },
      interaction: {
        hover: true, dragNodes: true, dragView: true, zoomView: true,
        tooltipDelay: 350, navigationButtons: false,
        keyboard: false, // Native selector and relationship cards remain keyboard accessible.
      },
    });

    const persist = (replace = false) => {
      const url = new URL(window.location.href);
      if (scope.value === 'local') url.searchParams.set('mode', 'local');
      else url.searchParams.delete('mode');
      if (scope.value === 'local' && depth.value !== '1') url.searchParams.set('depth', depth.value);
      else url.searchParams.delete('depth');
      if (view === 'cards') url.searchParams.set('view', 'cards');
      else url.searchParams.delete('view');
      if (url.href !== window.location.href) {
        window.history[replace ? 'replaceState' : 'pushState'](null, '', url.pathname + url.search + url.hash);
      }
    };
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      scope.value = params.get('mode') === 'local' ? 'local' : 'global';
      const requestedDepth = params.get('depth');
      depth.value = requestedDepth === '2' || requestedDepth === '3' ? requestedDepth : '1';
      return params.get('view') === 'cards' ? 'cards' : 'graph';
    };
    const show = (next: GraphView, save = false, replace = false) => {
      view = next;
      panel.hidden = next !== 'graph';
      cards.hidden = next !== 'cards';
      graphButton.setAttribute('aria-pressed', String(next === 'graph'));
      cardsButton.setAttribute('aria-pressed', String(next === 'cards'));
      root.dataset.networkView = next;
      if (next === 'graph') graph.redraw();
      if (save) persist(replace);
    };
    const fitVisible = () => {
      if (view === 'graph' && visibleIds.size) graph.fit({ nodes: Array.from(visibleIds), animation: false });
    };
    const inspect = () => {
      const current = state();
      const directEdges = visibleEdges.filter((item) => item.from === current.person || item.to === current.person);
      inspectorRelation.replaceChildren(new Option('Selected character overview', ''));
      for (const item of directEdges) {
        const other = item.from === current.person ? item.to : item.from;
        const title = `${byId.get(other)?.textContent?.trim() ?? other} — ${item.category}`;
        inspectorRelation.add(new Option(title, item.id));
      }
      inspectorRelation.value = directEdges.some((item) => item.id === inspectedEdge) ? inspectedEdge ?? '' : '';
      const edge = visibleEdges.find((item) => item.id === inspectedEdge);
      if (edge) {
        inspectorKind.textContent = `Documented ${edge.category === 'rivalry' ? 'conflict' : edge.category}`;
        inspectorHeading.textContent = `${byId.get(edge.from)?.textContent ?? edge.from} · ${byId.get(edge.to)?.textContent ?? edge.to}`;
        const fromFocus = current.person === edge.from ? edge.labelForA : current.person === edge.to ? edge.labelForB : '';
        inspectorSummary.textContent = edge.context;
        inspectorCount.textContent = fromFocus ? `From the selected character’s perspective: ${fromFocus}` : '';
        inspectorLink.hidden = true;
        inspectorChapter.hidden = !edge.chapterHref;
        inspectorChapter.href = edge.chapterHref;
        inspectorChapter.textContent = edge.chapterTitle;
        root.dataset.graphSelectedEdge = edge.id;
      } else {
        inspectedEdge = null;
        const person = byId.get(current.person);
        const direct = directEdges.length;
        inspectorKind.textContent = 'Selected character';
        inspectorHeading.textContent = person?.textContent?.trim() ?? current.person;
        inspectorSummary.textContent = person?.dataset.summary ?? '';
        inspectorCount.textContent = `${direct} visible direct ${direct === 1 ? 'relationship' : 'relationships'} in this graph view.`;
        inspectorLink.href = root.querySelector<HTMLAnchorElement>('#network-profile')?.href ?? '';
        inspectorLink.hidden = false;
        inspectorChapter.hidden = true;
        delete root.dataset.graphSelectedEdge;
      }
    };
    const matchingSearch = () => {
      const term = search.value.trim().toLocaleLowerCase();
      const matches = term ? allNodes.filter((node) => node.label.toLocaleLowerCase().includes(term)) : [];
      searchStatus.textContent = term
        ? `${matches.length} matching ${matches.length === 1 ? 'character' : 'characters'}. ${matches.length ? 'Press Find to focus the first match.' : 'Try another name.'}`
        : '';
      return matches;
    };
    const refresh = () => {
      const current = state();
      const matching = allEdges.filter((edge) => !current.category || edge.category === current.category);
      depth.disabled = scope.value !== 'local';
      visibleIds = scope.value === 'local'
        ? neighborhood(matching, current.person, Number(depth.value))
        : new Set(matching.flatMap((edge) => [edge.from, edge.to]));
      visibleEdges = matching.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to));
      const highlighted = new Set(matchingSearch().map((node) => node.id));
      const theme = palette();
      nodeSet.update(nodeSet.get().map((node) => ({
        ...node,
        hidden: !visibleIds.has(node.id),
        borderWidth: highlighted.has(node.id) ? 4 : 2,
        color: highlighted.has(node.id)
          ? { ...theme.node, border: tokens().focus }
          : theme.node,
        font: theme.font,
      })));
      const visibleEdgeIds = new Set(visibleEdges.map((edge) => edge.id));
      edgeSet.update(edgeSet.get().map((edge) => ({
        ...edge, hidden: !visibleEdgeIds.has(edge.id),
      })));
      if (inspectedEdge && !visibleEdgeIds.has(inspectedEdge)) inspectedEdge = null;
      if (inspectedEdge) graph.selectEdges([inspectedEdge]);
      else if (visibleIds.has(current.person)) graph.selectNodes([current.person], false);
      else graph.unselectAll();
      status.textContent = `${visibleIds.size} characters and ${visibleEdges.length} documented relationships in the graph.`;
      canvas.setAttribute('aria-label', status.textContent);
      root.dataset.graphVisibleNodes = String(visibleIds.size);
      root.dataset.graphVisibleEdges = String(visibleEdges.length);
      root.dataset.networkScope = scope.value;
      inspect();
    };

    graph.on('click', (event: { nodes: Array<string | number>; edges: Array<string | number> }) => {
      const picked = String(event.nodes[0] ?? '');
      if (validIds.has(picked)) {
        inspectedEdge = null;
        select.value = picked;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        if (scope.value === 'local') fitVisible();
        return;
      }
      const edgeId = String(event.edges[0] ?? '');
      if (visibleEdges.some((edge) => edge.id === edgeId)) {
        inspectedEdge = edgeId;
        inspect();
      }
    });
    graph.once('stabilizationIterationsDone', () => {
      settling = false;
      graph.setOptions({ physics: { enabled: false } });
      fitVisible();
    });
    graph.once('stabilized', () => {
      if (settling) graph.setOptions({ physics: { enabled: false } });
    });

    const zoom = (factor: number) => graph.moveTo({
      scale: Math.min(2.5, Math.max(0.2, graph.getScale() * factor)), animation: false,
    });
    zoomIn.addEventListener('click', () => zoom(1.3));
    zoomOut.addEventListener('click', () => zoom(1 / 1.3));
    fit.addEventListener('click', fitVisible);
    graphButton.addEventListener('click', () => show('graph', true));
    cardsButton.addEventListener('click', () => show('cards', true));
    scope.addEventListener('change', () => { inspectedEdge = null; refresh(); persist(); fitVisible(); });
    depth.addEventListener('change', () => { inspectedEdge = null; refresh(); persist(); fitVisible(); });
    search.addEventListener('input', refresh);
    inspectorRelation.addEventListener('change', () => {
      inspectedEdge = inspectorRelation.value || null;
      if (inspectedEdge) graph.selectEdges([inspectedEdge]);
      else if (visibleIds.has(select.value)) graph.selectNodes([select.value], false);
      inspect();
    });
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const term = search.value.trim().toLocaleLowerCase();
      if (!term) return;
      const matches = matchingSearch();
      const found = matches.find((node) => node.label.toLocaleLowerCase() === term) ?? matches[0];
      if (!found) return;
      inspectedEdge = null;
      select.value = found.id;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      if (visibleIds.has(found.id)) graph.focus(found.id, { scale: 1, animation: false });
      else searchStatus.textContent = 'Character selected, but hidden by the current relationship filter. Try All relationships.';
    });
    root.addEventListener('relationship:change', () => {
      inspectedEdge = null;
      refresh();
      if (scope.value === 'local') fitVisible();
    });
    reset.addEventListener('click', () => {
      scope.value = 'global'; depth.value = '1'; search.value = ''; inspectedEdge = null;
      refresh(); show('graph', true, true); fitVisible();
    });
    window.addEventListener('popstate', () => {
      const restoredView = restore();
      inspectedEdge = null;
      refresh(); show(restoredView);
      if (scope.value === 'local') fitVisible();
    });

    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pagehide', () => { observer.disconnect(); graph.destroy(); }, { once: true });

    const initialView = restore();
    refresh();
    controls.hidden = false;
    show(initialView);
    if (scope.value === 'local') fitVisible();
    root.dataset.graphState = 'ready';
  } catch (reason) {
    console.error('Relationship graph could not initialize', reason);
    panel.hidden = true;
    cards.hidden = false;
    controls.hidden = true;
    error.hidden = false;
    root.dataset.graphState = 'error';
  }
}
