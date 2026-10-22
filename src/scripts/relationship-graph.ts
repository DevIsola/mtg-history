/**
 * Relationship graph Phase 2. The server-rendered HTML relationship cards are
 * the canonical accessible record and the only input to the visual network.
 */
import 'vis-network/styles/vis-network.css';
import { relationshipColor, relationshipLabel, relationshipDash } from '../utils/relationship-colors.mjs';

type GraphNode = { id: string; label: string; value: number; chapterId: string };
type GraphEdge = {
  id: string;
  from: string;
  to: string;
  category: string;
  chapterId: string;
  labelForA: string;
  labelForB: string;
  context: string;
  chapterHref: string;
  chapterTitle: string;
};
type GraphView = 'graph' | 'cards';
type AtlasState = { person: string; category: string };

// Node colors reflect each character's first indexed historical chapter.
// This is an editorial grouping, never a claim of faction or relationship.
const chapterColors = [
  { border: '#be8254', background: '#f1d9bc' },
  { border: '#698bb1', background: '#d9e6f7' },
  { border: '#658f8e', background: '#d2eae5' },
  { border: '#ae7994', background: '#f0d8e8' },
  { border: '#a49355', background: '#f0e9c6' },
  { border: '#8c81b8', background: '#e3ddf6' },
  { border: '#6e9f79', background: '#dcefdc' },
  { border: '#c0796d', background: '#f5dcd7' },
  { border: '#6d98a4', background: '#d9ebef' },
  { border: '#9c8d84', background: '#e8e0da' },
];

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
  const era = query<HTMLSelectElement>('#network-era');
  const colorMode = query<HTMLSelectElement>('#network-color');
  const layout = query<HTMLSelectElement>('#network-layout');
  const labelDensity = query<HTMLSelectElement>('#network-label-density');
  const chapterLegend = query<HTMLElement>('#network-chapter-legend');
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
      !status || !error || !select || !category || !reset || !scope || !depth || !era || !colorMode || !layout || !labelDensity || !chapterLegend ||
      !search || !searchForm || !searchStatus || !inspectorKind || !inspectorHeading ||
      !inspectorSummary || !inspectorCount || !inspectorRelation || !inspectorLink || !inspectorChapter ||
      !zoomIn || !zoomOut || !fit) return;

  const options = Array.from(select.options).filter((item) => item.value);
  const validIds = new Set(options.map((item) => item.value));
  const byId = new Map(options.map((option) => [option.value, option]));
  const chapterOptions = Array.from(era.options).filter((item) => item.value);
  const chapterIndex = new Map(chapterOptions.map((item, index) => [item.value, index]));
  const chapterStyle = (id: string) => chapterColors[(chapterIndex.get(id) ?? 0) % chapterColors.length];
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
      chapterId: element.dataset.chapter ?? '',
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
    chapterId: option.dataset.primaryChapter ?? '',
    value: Math.max(1, degree.get(option.value) ?? 0),
  }));
  const state = (): AtlasState => ({ person: select.value, category: category.value });

  try {
    // The only route that loads vis-network. No duplicate graph data or API calls.
    // ESNext packages keep vis-network dependencies as split, cacheable ESM
    // modules instead of placing the entire standalone renderer in one chunk.
    const [{ DataSet }, { Network }] = await Promise.all([
      import('vis-data/esnext'),
      import('vis-network/esnext'),
    ]);
    let view: GraphView = 'graph';
    let inspectedEdge: string | null = null;
    let visibleIds = new Set<string>();
    let visibleEdges: GraphEdge[] = [];
    let settling = true;
    let organicPositions: Record<string, { x: number; y: number }> | null = null;

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
        // A halo in the canvas color makes names legible across crossing edges.
        font: { color: theme.text, face: 'system-ui', size: 15,
          strokeWidth: 4, strokeColor: theme.background },
      };
     };
    const styles = palette();
    const nodeNames = new Map(allNodes.map((node) => [node.id, node.label]));
    const nodeChapters = new Map(allNodes.map((node) => [node.id, node.chapterId]));
    const colorForNode = (id: string, base: ReturnType<typeof palette>['node']) => {
      if (colorMode.value === 'neutral') return base;
      const shade = chapterStyle(era.value || nodeChapters.get(id) || '');
      return { ...base, background: shade.background, border: shade.border };
    };
    const chapterSwatches = new Map(chapterOptions.map((item) => [item.value, chapterStyle(item.value)]));
    for (const item of chapterOptions) {
      const swatch = document.createElement('span');
      swatch.className = 'network-chapter-legend__item';
      const mark = document.createElement('i');
      mark.setAttribute('aria-hidden', 'true');
      mark.style.backgroundColor = chapterSwatches.get(item.value)?.border ?? '#819497';
      swatch.append(mark, document.createTextNode(item.textContent?.trim() ?? item.value));
      chapterLegend.append(swatch);
    }
    const updateChapterLegend = () => {
      chapterLegend.hidden = colorMode.value !== 'chapter';
      Array.from(chapterLegend.children).forEach((element, index) => {
        (element as HTMLElement).hidden = !!era.value && chapterOptions[index]?.value !== era.value;
      });
    };
    const nodeSet = new DataSet(allNodes.map((node) => ({
      ...node, color: colorForNode(node.id, styles.node), font: styles.font,
    })));
    const edgeSet = new DataSet(allEdges.map((edge) => ({
      ...edge,
      color: { color: relationshipColor(edge.category, document.documentElement.dataset.theme === 'dark'), opacity: 1 },
        width: 2.8, dashes: relationshipDash(edge.category),
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
        width: 2.8,
        smooth: { enabled: true, type: 'continuous', roundness: 0.15 },
        selectionWidth: 3,
        hoverWidth: 3,
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
      if (era.value) url.searchParams.set('chapter', era.value);
      else url.searchParams.delete('chapter');
      if (colorMode.value === 'neutral') url.searchParams.set('colors', 'neutral');
      else url.searchParams.delete('colors');
      if (layout.value === 'chapter') url.searchParams.set('layout', 'chapter');
      else url.searchParams.delete('layout');
      if (labelDensity.value === 'all') url.searchParams.set('labels', 'all');
      else url.searchParams.delete('labels');
      if (url.href !== window.location.href) {
        window.history[replace ? 'replaceState' : 'pushState'](null, '', url.pathname + url.search + url.hash);
      }
    };
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      scope.value = params.get('mode') === 'local' ? 'local' : 'global';
      const requestedDepth = params.get('depth');
      depth.value = requestedDepth === '2' || requestedDepth === '3' ? requestedDepth : '1';
      const requestedEra = params.get('chapter');
      era.value = requestedEra && chapterIndex.has(requestedEra) ? requestedEra : '';
      colorMode.value = params.get('colors') === 'neutral' ? 'neutral' : 'chapter';
      layout.value = params.get('layout') === 'chapter' ? 'chapter' : 'organic';
      labelDensity.value = params.get('labels') === 'all' ? 'all' : 'focus';
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
    // Spatial clusters are layout-only: they introduce no inferred edges and
    // do not merge characters into artificial relationship groups.
    const arrange = () => {
      root.dataset.graphLayout = layout.value;
      if (settling) return;
      if (layout.value === 'chapter') {
        if (!organicPositions) organicPositions = graph.getPositions();
        graph.setOptions({ physics: { enabled: false } });
        const orderedGroups = chapterOptions.map((option) => option.value);
        const groups = new Map<string, GraphNode[]>();
        for (const node of allNodes) {
          const key = orderedGroups.includes(node.chapterId) ? node.chapterId : '';
          const members = groups.get(key) ?? [];
          members.push(node);
          groups.set(key, members);
        }
        const total = orderedGroups.length + (groups.has('') ? 1 : 0);
        for (const [groupIndex, chapterId] of [...orderedGroups, ...(groups.has('') ? [''] : [])].entries()) {
          const members = (groups.get(chapterId) ?? []).sort((a, b) => a.label.localeCompare(b.label));
          const angle = 2 * Math.PI * groupIndex / Math.max(total, 1) - Math.PI / 2;
          const anchorX = 520 * Math.cos(angle);
          const anchorY = 520 * Math.sin(angle);
          for (const [index, node] of members.entries()) {
            const ring = Math.floor(Math.sqrt(index));
            const theta = index * 2.399963229728653; // Golden-angle spacing
            const radius = 26 + 29 * ring;
            graph.moveNode(node.id, anchorX + radius * Math.cos(theta), anchorY + radius * Math.sin(theta));
          }
        }
      } else if (organicPositions) {
        for (const [id, point] of Object.entries(organicPositions)) graph.moveNode(id, point.x, point.y);
      }
      if (view === 'graph' && visibleIds.size) graph.fit({ nodes: Array.from(visibleIds), animation: false });
    };
    const inspect = () => {
      const current = state();
      const directEdges = visibleEdges.filter((item) => item.from === current.person || item.to === current.person);
      inspectorRelation.replaceChildren(new Option('Selected character overview', ''));
      for (const item of directEdges) {
        const other = item.from === current.person ? item.to : item.from;
        const title = `${byId.get(other)?.textContent?.trim() ?? other} — ${relationshipLabel(item.category)}`;
        inspectorRelation.add(new Option(title, item.id));
      }
      inspectorRelation.value = directEdges.some((item) => item.id === inspectedEdge) ? inspectedEdge ?? '' : '';
      const edge = visibleEdges.find((item) => item.id === inspectedEdge);
      if (edge) {
        inspectorKind.textContent = `Documented relationship · ${relationshipLabel(edge.category)}`;
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
      const matching = allEdges.filter((edge) =>
        (!current.category || edge.category === current.category) &&
        (!era.value || edge.chapterId === era.value));
      depth.disabled = scope.value !== 'local';
      visibleIds = scope.value === 'local'
        ? neighborhood(matching, current.person, Number(depth.value))
        : new Set(matching.flatMap((edge) => [edge.from, edge.to]));
      visibleEdges = matching.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to));
      const highlighted = new Set(matchingSearch().map((node) => node.id));
      const adjacentToFocus = new Set(matching.filter((edge) =>
        edge.from === current.person || edge.to === current.person)
        .flatMap((edge) => [edge.from, edge.to]));
      const theme = palette();
      const focusColor = tokens().focus;
      nodeSet.update(nodeSet.get().map((node) => ({
        ...node,
        hidden: !visibleIds.has(node.id),
        label: (labelDensity.value === 'all' || adjacentToFocus.has(node.id) ||
          highlighted.has(node.id) || node.id === current.person)
          ? nodeNames.get(node.id) ?? '' : '',
        borderWidth: highlighted.has(node.id) || node.id === current.person ? 4 : 2,
        color: highlighted.has(node.id) || node.id === current.person
          ? { ...colorForNode(node.id, theme.node), border: focusColor }
          : colorForNode(node.id, theme.node),
        font: theme.font,
      })));
      const visibleEdgeIds = new Set(visibleEdges.map((edge) => edge.id));
      edgeSet.update(edgeSet.get().map((edge) => ({
        ...edge, hidden: !visibleEdgeIds.has(edge.id),
        color: { color: relationshipColor(edge.category, document.documentElement.dataset.theme === 'dark'), opacity: 1 },
        width: 2.8, dashes: relationshipDash(edge.category),
      })));
      if (inspectedEdge && !visibleEdgeIds.has(inspectedEdge)) inspectedEdge = null;
      if (inspectedEdge) graph.selectEdges([inspectedEdge]);
      else if (visibleIds.has(current.person)) graph.selectNodes([current.person], false);
      else graph.unselectAll();
      status.textContent = `${visibleIds.size} characters and ${visibleEdges.length} documented relationships in the graph${era.value ? ` for ${chapterOptions.find((item) => item.value === era.value)?.textContent?.trim() ?? era.value}` : ''}.`;
      updateChapterLegend();
      canvas.setAttribute('aria-label', status.textContent);
      root.dataset.graphVisibleNodes = String(visibleIds.size);
      root.dataset.graphVisibleEdges = String(visibleEdges.length);
      root.dataset.networkScope = scope.value;
      root.dataset.graphLabels = labelDensity.value;
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
      arrange();
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
    era.addEventListener('change', () => { inspectedEdge = null; refresh(); persist(); fitVisible(); });
    colorMode.addEventListener('change', () => { refresh(); persist(); });
    layout.addEventListener('change', () => { arrange(); persist(); });
    labelDensity.addEventListener('change', () => { refresh(); persist(); });
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
      scope.value = 'global'; depth.value = '1'; era.value = ''; colorMode.value = 'chapter'; layout.value = 'organic'; labelDensity.value = 'focus'; search.value = ''; inspectedEdge = null;
      refresh(); show('graph', true, true); arrange(); fitVisible();
    });
    window.addEventListener('popstate', () => {
      const restoredView = restore();
      inspectedEdge = null;
      refresh(); show(restoredView); arrange();
      if (scope.value === 'local') fitVisible();
    });

    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pagehide', () => { observer.disconnect(); graph.destroy(); }, { once: true });

    const initialView = restore();
    refresh();
    controls.hidden = false;
    show(initialView);
    arrange();
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
