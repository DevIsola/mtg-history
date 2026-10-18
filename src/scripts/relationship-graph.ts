/**
 * Phase 1 — a progressive-enhancement graph for the existing relationship atlas.
 * HTML relationship cards remain the canonical, accessible representation.
 */
type GraphNode = { id: string; label: string; value: number };
type GraphEdge = { id: string; from: string; to: string; category: string };

type AtlasState = { person: string; category: string };

const categoryColors: Record<string, string> = {
  family: '#d19f56',
  friendship: '#2d9a86',
  alliance: '#3a87ad',
  rivalry: '#c96b63',
  mentorship: '#9679c5',
  creation: '#ac8a62',
};

export async function initializeRelationshipGraph(root: HTMLElement): Promise<void> {
  const panel = root.querySelector<HTMLElement>('#network-visual');
  const canvas = root.querySelector<HTMLElement>('#network-canvas');
  const cards = root.querySelector<HTMLElement>('#network-grid');
  const controls = root.querySelector<HTMLElement>('#network-view-switch');
  const graphButton = root.querySelector<HTMLButtonElement>('#network-show-graph');
  const cardsButton = root.querySelector<HTMLButtonElement>('#network-show-cards');
  const status = root.querySelector<HTMLElement>('#network-graph-status');
  const error = root.querySelector<HTMLElement>('#network-graph-error');
  const select = root.querySelector<HTMLSelectElement>('#network-person');
  const category = root.querySelector<HTMLSelectElement>('#network-category');
  const zoomIn = root.querySelector<HTMLButtonElement>('#network-zoom-in');
  const zoomOut = root.querySelector<HTMLButtonElement>('#network-zoom-out');
  const fit = root.querySelector<HTMLButtonElement>('#network-fit');

  if (!panel || !canvas || !cards || !controls || !graphButton || !cardsButton ||
      !status || !error || !select || !category || !zoomIn || !zoomOut || !fit) return;

  // Read the server-rendered, integrity-checked records; never infer new edges.
  const options = Array.from(select.options).filter((item) => item.value);
  const validIds = new Set(options.map((item) => item.value));
  const rawEdges = Array.from(root.querySelectorAll<HTMLElement>('[data-network-edge]'));
  const allEdges: GraphEdge[] = rawEdges.flatMap((element, index) => {
    const from = element.dataset.a;
    const to = element.dataset.b;
    if (!from || !to || !validIds.has(from) || !validIds.has(to)) return [];
    return [{ id: `relation-${index}`, from, to, category: element.dataset.category ?? '' }];
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
    // Keeps vis-network out of every other route and out of the no-JS fallback.
    const { DataSet, Network } = await import('vis-network/standalone');
    let view: 'graph' | 'cards' = 'graph';
    let selected = state();
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
    const nodeSet = new DataSet(allNodes.map((node) => ({
      ...node,
      color: palette().node,
      font: palette().font,
    })));
    const edgeSet = new DataSet(allEdges.map((edge) => ({
      ...edge,
      color: { color: categoryColors[edge.category] ?? '#819497', opacity: 0.78 },
    })));

    // The graph must be visible while Network measures its canvas dimensions.
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
        color: palette().node,
        font: palette().font,
      },
      edges: {
        width: 1.6,
        smooth: { enabled: true, type: 'continuous', roundness: 0.15 },
        selectionWidth: 2,
        hoverWidth: 2,
      },
      interaction: {
        hover: true,
        dragNodes: true,
        dragView: true,
        zoomView: true,
        tooltipDelay: 350,
        navigationButtons: false,
        keyboard: false, // Semantic controls above and relationship cards remain keyboard-accessible.
      },
    });

    const show = (next: 'graph' | 'cards') => {
      view = next;
      panel.hidden = next !== 'graph';
      cards.hidden = next !== 'cards';
      graphButton.setAttribute('aria-pressed', String(next === 'graph'));
      cardsButton.setAttribute('aria-pressed', String(next === 'cards'));
      root.dataset.networkView = next;
      if (next === 'graph') {
        graph.redraw();
        // Leave user-controlled coordinates intact; only fit when explicitly requested.
      }
    };

    const refresh = () => {
      selected = state();
      const matching = allEdges.filter((edge) => !selected.category || edge.category === selected.category);
      const visibleIds = new Set(matching.flatMap((edge) => [edge.from, edge.to]));
      // Hide filtered records without dropping positions from the simulation.
      nodeSet.update(nodeSet.get().map((node) => ({
        ...node,
        hidden: !visibleIds.has(node.id),
      })));
      edgeSet.update(edgeSet.get().map((edge) => ({
        ...edge,
        hidden: !!selected.category && edge.category !== selected.category,
      })));
      if (visibleIds.has(selected.person)) graph.selectNodes([selected.person], false);
      else graph.unselectAll();
      status.textContent = `${visibleIds.size} characters and ${matching.length} documented relationships in the graph.`;
      canvas.setAttribute('aria-label', status.textContent);
    };

    graph.on('click', (event: { nodes: Array<string | number> }) => {
      const picked = String(event.nodes[0] ?? '');
      if (!validIds.has(picked)) return;
      select.value = picked;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    graph.once('stabilizationIterationsDone', () => {
      settling = false;
      graph.setOptions({ physics: { enabled: false } });
      graph.fit({ animation: false });
    });
    // A graph with a small component can settle before the scheduled event.
    graph.once('stabilized', () => { if (settling) graph.setOptions({ physics: { enabled: false } }); });

    const zoom = (factor: number) => graph.moveTo({ scale: Math.min(2.5, Math.max(0.2, graph.getScale() * factor)), animation: false });
    zoomIn.addEventListener('click', () => zoom(1.3));
    zoomOut.addEventListener('click', () => zoom(1 / 1.3));
    fit.addEventListener('click', () => graph.fit({ animation: false }));
    graphButton.addEventListener('click', () => show('graph'));
    cardsButton.addEventListener('click', () => show('cards'));
    root.addEventListener('relationship:change', refresh);

    // Keep the canvas readable when the user switches light/dark theme.
    const observer = new MutationObserver(() => {
      const styles = palette();
      nodeSet.update(nodeSet.get().map((node) => ({ ...node, color: styles.node, font: styles.font })));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('pagehide', () => { observer.disconnect(); graph.destroy(); }, { once: true });

    refresh();
    controls.hidden = false;
    graphButton.disabled = false;
    cardsButton.disabled = false;
    show(new URLSearchParams(location.search).get('view') === 'cards' ? 'cards' : 'graph');
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
