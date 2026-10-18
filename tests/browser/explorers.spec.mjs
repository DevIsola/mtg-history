import { test, expect } from '@playwright/test';

const root = '/mtg-history/';

test('timeline filters historical eras and resets without hiding source records permanently', async ({ page }) => {
  await page.goto(`${root}timeline/`);
  const eras = page.locator('[data-timeline-era]');
  const initial = await eras.count();
  expect(initial).toBeGreaterThan(1);
  await expect(page.locator('#timeline-search')).toBeVisible();

  await page.locator('#timeline-era').selectOption('thran');
  await expect(page.locator('[data-timeline-era]:visible')).toHaveCount(1);
  await page.locator('#timeline-search').fill('zzzz-unmatched-timeline-xyz');
  await expect(page.locator('#timeline-empty')).toBeVisible();

  await page.locator('#timeline-reset').click();
  await expect(page.locator('#timeline-empty')).toBeHidden();
  await expect(page.locator('[data-timeline-era]:visible')).toHaveCount(initial);
  await expect(page.locator('#timeline-search')).toBeFocused();
});

test('timeline native event panels can be expanded and read', async ({ page }) => {
  await page.goto(`${root}timeline/`);
  const panels = page.locator('[data-timeline-details]');
  expect(await panels.count()).toBeGreaterThan(0);
  await page.locator('#timeline-expand').click();
  await expect(page.locator('#timeline-expand')).toHaveAttribute('aria-pressed', 'true');
  await expect(panels.first()).toHaveAttribute('open', '');
  await expect(panels.first().locator('a').first()).toHaveAttribute('href', /\/events\//);
});

test('relationship explorer opens from character deep link and traverses the network', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  await expect(page.locator('#network-person')).toHaveValue('urza');
  await page.locator('#network-show-cards').click();
  const visible = page.locator('[data-network-edge]:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  const firstFocusButton = visible.first().locator('button[data-network-focus]:visible');
  const nextId = await firstFocusButton.getAttribute('data-network-focus');
  expect(nextId).toBeTruthy();
  await firstFocusButton.click();
  await expect(page.locator('#network-person')).toHaveValue(nextId);
  await expect(page).toHaveURL(new RegExp('person=' + nextId));
  await expect(page.locator('#network-profile')).toHaveAttribute('href', new RegExp(`/characters/${nextId}/`));
});

test('relationship category filter is reversible', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  await page.locator('#network-show-cards').click();
  const first = page.locator('[data-network-edge]:visible').first();
  const category = await first.getAttribute('data-category');
  await page.locator('#network-category').selectOption(category);
  const visible = page.locator('[data-network-edge]:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  for (const value of await visible.evaluateAll((nodes) => nodes.map((node) => node.dataset.category))) {
    expect(value).toBe(category);
  }
  await page.locator('#network-reset').click();
  await expect(page.locator('#network-category')).toHaveValue('');
});

test('archive offers accessible gallery and compact layouts with chapter-local sorting', async ({ page }) => {
  await page.goto(`${root}archive/`);
  await page.locator('[data-archive-view="compact"]').click();
  await expect(page.locator('.archive-directory')).toHaveClass(/archive-directory--compact/);
  await expect(page.locator('[data-archive-view="compact"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#archive-sort').selectOption('title');
  const section = page.locator('[data-archive-section]').first();
  const titles = await section.locator('[data-archive-card]').evaluateAll((cards) => cards.map((card) => card.dataset.cardTitle));
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  await page.locator('[data-archive-view="grid"]').click();
  await expect(page.locator('.archive-directory')).not.toHaveClass(/archive-directory--compact/);
});

test('discover category navigation and alphabetical order work together', async ({ page }) => {
  await page.goto(`${root}discover/`);
  await page.locator('[data-discovery-tab][data-type="character"]').click();
  await expect(page.locator('#discovery-type')).toHaveValue('character');
  const visible = page.locator('[data-discovery-record]:visible');
  expect(await visible.count()).toBeGreaterThan(0);
  const types = await visible.evaluateAll((nodes) => nodes.map((node) => node.dataset.type));
  expect(types.every((type) => type === 'character')).toBe(true);
  await page.locator('#discovery-sort').selectOption('alphabetical');
  const titles = await visible.evaluateAll((nodes) => nodes.map((node) => node.dataset.title));
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  await page.locator('#discovery-reset').click();
  await expect(page.locator('#discovery-type')).toHaveValue('');
});


test('timeline event search narrows visible event records and restores them on clear', async ({ page }) => {
  await page.goto(`${root}timeline/`);
  const firstEra = page.locator('[data-timeline-era]').first();
  const titles = await firstEra.locator('[data-timeline-event] strong').allTextContents();
  const eraText = (await firstEra.getAttribute('data-era-search') ?? '').toLowerCase();
  const title = titles.find((value) => !eraText.includes(value.trim().toLowerCase()))?.trim();
  expect(title).toBeTruthy();
  const total = await firstEra.locator('[data-timeline-event]').count();
  expect(total).toBeGreaterThan(1);
  await page.locator('#timeline-search').fill(title);
  await expect(firstEra).toBeVisible();
  await expect(firstEra.locator('[data-timeline-details]')).toHaveAttribute('open', '');
  await expect(firstEra.locator('[data-timeline-event]:visible').first()).toContainText(title);
  const narrowed = await firstEra.locator('[data-timeline-event]:visible').count();
  expect(narrowed).toBeLessThan(total);
  await page.locator('#timeline-reset').click();
  await expect(firstEra.locator('[data-timeline-event]:visible')).toHaveCount(total);
});

test('relationship category and focused character are restored by browser history', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  await page.locator('#network-show-cards').click();
  const selected = page.locator('[data-network-edge]:visible').first();
  const category = await selected.getAttribute('data-category');
  expect(category).toBeTruthy();
  await page.locator('#network-category').selectOption(category);
  await expect(page).toHaveURL(new RegExp(`type=${category}`));
  await page.goBack();
  await expect(page.locator('#network-category')).toHaveValue('');
  await expect(page.locator('#network-person')).toHaveValue('urza');
  await page.goForward();
  await expect(page.locator('#network-category')).toHaveValue(category);
});

test('archive reset restores layout and editorial sorting', async ({ page }) => {
  await page.goto(`${root}archive/`);
  await page.locator('#archive-sort').selectOption('title');
  await page.locator('[data-archive-view="compact"]').click();
  await expect(page.locator('#archive-reset')).toBeEnabled();
  await page.locator('#archive-reset').click();
  await expect(page.locator('#archive-sort')).toHaveValue('editorial');
  await expect(page.locator('[data-archive-view="grid"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.archive-directory')).not.toHaveClass(/archive-directory--compact/);
});

test('discover reset restores editorial sorting, and category links navigate', async ({ page }) => {
  await page.goto(`${root}discover/`);
  await page.locator('#discovery-sort').selectOption('alphabetical');
  await expect(page.locator('#discovery-reset')).toBeEnabled();
  await page.locator('#discovery-reset').click();
  await expect(page.locator('#discovery-sort')).toHaveValue('editorial');
  await page.locator('[data-discovery-tab][data-type="character"]').click();
  await expect(page).toHaveURL(/#discovery-heading-character$/);
  await expect(page.locator('#discovery-type')).toHaveValue('character');
});

for (const route of ['timeline/', 'relationships/', 'archive/', 'discover/']) {
  test(`${route}: 320px narrow viewport has no horizontal page overflow`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(root + route);
    await expect(page.locator('main h1')).toBeVisible();
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test.describe('no-JavaScript fallback', () => {
  test.use({ javaScriptEnabled: false });

  test('timeline eras and native event disclosures remain readable', async ({ page }) => {
    await page.goto(`${root}timeline/`);
    await expect(page.locator('#timeline-controls')).toBeHidden();
    const entry = page.locator('[data-timeline-era]').first();
    await expect(entry).toBeVisible();
    const details = entry.locator('details[data-timeline-details]');
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('a').first()).toHaveAttribute('href', /\/events\//);
  });

  test('relationship records provide accessible static character links', async ({ page }) => {
    await page.goto(`${root}relationships/`);
    await expect(page.locator('#network-controls')).toBeHidden();
    const edge = page.locator('[data-network-edge]').first();
    await expect(edge).toBeVisible();
    await expect(edge.locator('a').first()).toHaveAttribute('href', /\/characters\//);
  });
});

// Graph Phase 1: network rendering is progressive and preserves existing cards.
test('relationship graph renders, zooms, and retains accessible card navigation', async ({ page }) => {
  await page.goto(`${root}relationships/`);
  const explorer = page.locator('[data-relationship-explorer]');
  await expect(explorer).toHaveAttribute('data-graph-state', 'ready');
  await expect(page.locator('#network-view-switch')).toBeVisible();
  await expect(page.locator('#network-visual')).toBeVisible();
  await expect(page.locator('#network-canvas canvas')).toBeVisible();
  await expect(page.locator('#network-show-graph')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#network-grid')).toBeHidden();
  await expect(page.locator('#network-graph-status')).toContainText('documented relationships');

  await page.locator('#network-zoom-in').click();
  await page.locator('#network-zoom-out').click();
  await page.locator('#network-fit').click();
  await page.locator('#network-show-cards').click();
  await expect(page.locator('#network-grid')).toBeVisible();
  await expect(page.locator('[data-network-edge]:visible').first()).toBeVisible();
  await expect(page.locator('#network-show-cards')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#network-show-graph').click();
  await expect(page.locator('#network-canvas canvas')).toBeVisible();
});

test('relationship graph keeps its filters and selected character synchronized', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  await expect(page.locator('[data-relationship-explorer]')).toHaveAttribute('data-graph-state', 'ready');
  await page.locator('#network-category').selectOption('rivalry');
  await expect(page.locator('#network-graph-status')).toContainText('documented relationships');
  await expect(page).toHaveURL(/person=urza/);
  await expect(page).toHaveURL(/type=rivalry/);
  await page.locator('#network-person').selectOption('mishra');
  await expect(page.locator('#network-focus-name')).toHaveText('Mishra');
  await page.locator('#network-show-cards').click();
  await expect(page.locator('[data-network-edge]:visible').first()).toBeVisible();
});

test('relationship graph fits narrow mobile screens without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto(`${root}relationships/`);
  await expect(page.locator('[data-relationship-explorer]')).toHaveAttribute('data-graph-state', 'ready');
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

// Phase 2: local graph traversal is based strictly on curated relationship edges.
test('relationship graph switches between global and one-to-three-hop local views', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  const atlas = page.locator('[data-relationship-explorer]');
  await expect(atlas).toHaveAttribute('data-graph-state', 'ready');
  const totalEdges = await page.locator('[data-network-edge]').count();
  expect(Number(await atlas.getAttribute('data-graph-visible-edges'))).toBe(totalEdges);
  const globalNodes = Number(await atlas.getAttribute('data-graph-visible-nodes'));

  await page.locator('#network-scope').selectOption('local');
  await expect(page.locator('#network-depth')).toBeEnabled();
  await expect(atlas).toHaveAttribute('data-network-scope', 'local');
  await expect(page).toHaveURL(/mode=local/);
  const oneHop = Number(await atlas.getAttribute('data-graph-visible-nodes'));
  expect(oneHop).toBeGreaterThan(1);
  expect(oneHop).toBeLessThan(globalNodes);

  await page.locator('#network-depth').selectOption('2');
  await expect(page).toHaveURL(/depth=2/);
  const twoHops = Number(await atlas.getAttribute('data-graph-visible-nodes'));
  expect(twoHops).toBeGreaterThanOrEqual(oneHop);
  await page.locator('#network-depth').selectOption('3');
  const threeHops = Number(await atlas.getAttribute('data-graph-visible-nodes'));
  expect(threeHops).toBeGreaterThanOrEqual(twoHops);
  expect(threeHops).toBeLessThanOrEqual(globalNodes);

  await page.locator('#network-scope').selectOption('global');
  await expect(page.locator('#network-depth')).toBeDisabled();
  expect(Number(await atlas.getAttribute('data-graph-visible-edges'))).toBe(totalEdges);
});

test('relationship graph finds named characters and handles missing searches', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  await expect(page.locator('[data-relationship-explorer]')).toHaveAttribute('data-graph-state', 'ready');
  await page.locator('#network-search').fill('yawgm');
  await expect(page.locator('#network-search-status')).toContainText('matching character');
  await page.locator('#network-find').click();
  await expect(page.locator('#network-person')).toHaveValue('yawgmoth');
  await expect(page.locator('#network-inspector-heading')).toContainText('Yawgmoth');
  await expect(page).toHaveURL(/person=yawgmoth/);
  await page.locator('#network-search').fill('a-name-that-is-not-an-mtg-character');
  await expect(page.locator('#network-search-status')).toContainText('0 matching characters');
  await page.locator('#network-find').click();
  await expect(page.locator('#network-person')).toHaveValue('yawgmoth');
});

test('relationship inspector provides character summaries and source-chapter links', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza&mode=local`);
  await expect(page.locator('[data-relationship-explorer]')).toHaveAttribute('data-graph-state', 'ready');
  await expect(page.locator('#network-inspector-summary')).not.toBeEmpty();
  await expect(page.locator('#network-inspector-link')).toHaveAttribute('href', /\/characters\/urza\//);
  const chooser = page.locator('#network-inspector-relation');
  expect(await chooser.locator('option').count()).toBeGreaterThan(1);
  await chooser.selectOption({ index: 1 });
  await expect(page.locator('#network-inspector-kind')).toContainText('Documented');
  await expect(page.locator('#network-inspector-summary')).not.toBeEmpty();
  await expect(page.locator('#network-inspector-chapter')).toBeVisible();
  await expect(page.locator('#network-inspector-chapter')).toHaveAttribute('href', /\/chapters\//);
  await chooser.selectOption('');
  await expect(page.locator('#network-inspector-kind')).toHaveText('Selected character');
  await expect(page.locator('#network-inspector-link')).toBeVisible();
});

test('relationship scope and graph/card mode survive browser history and deep links', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza&mode=local&depth=2&view=cards`);
  const atlas = page.locator('[data-relationship-explorer]');
  await expect(atlas).toHaveAttribute('data-graph-state', 'ready');
  await expect(page.locator('#network-scope')).toHaveValue('local');
  await expect(page.locator('#network-depth')).toHaveValue('2');
  await expect(page.locator('#network-show-cards')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#network-show-graph').click();
  await expect(page).not.toHaveURL(/view=cards/);
  await page.locator('#network-depth').selectOption('3');
  await expect(page).toHaveURL(/depth=3/);
  await page.goBack();
  await expect(page.locator('#network-depth')).toHaveValue('2');
  await expect(page.locator('#network-show-graph')).toHaveAttribute('aria-pressed', 'true');
  await page.goBack();
  await expect(page.locator('#network-show-cards')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#network-grid')).toBeVisible();
  await page.goForward();
  await expect(page.locator('#network-visual')).toBeVisible();
});

test('local graph rivalry filter uses exactly the source direct ties', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  const explorer = page.locator('[data-relationship-explorer]');
  await expect(explorer).toHaveAttribute('data-graph-state', 'ready');
  const expected = await page.locator('[data-network-edge]').evaluateAll((elements) => {
    const hits = elements.filter((element) =>
      element.dataset.category === 'rivalry' &&
      (element.dataset.a === 'urza' || element.dataset.b === 'urza'));
    const ids = new Set(['urza']);
    for (const hit of hits) {
      ids.add(hit.dataset.a);
      ids.add(hit.dataset.b);
    }
    return { nodes: ids.size, edges: hits.length };
  });
  await page.locator('#network-scope').selectOption('local');
  await page.locator('#network-category').selectOption('rivalry');
  expect(Number(await explorer.getAttribute('data-graph-visible-nodes'))).toBe(expected.nodes);
  expect(Number(await explorer.getAttribute('data-graph-visible-edges'))).toBe(expected.edges);
});

test('relationship reset restores the default global graph controls', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  await expect(page.locator('[data-relationship-explorer]')).toHaveAttribute('data-graph-state', 'ready');
  await page.locator('#network-scope').selectOption('local');
  await page.locator('#network-depth').selectOption('3');
  await page.locator('#network-search').fill('Yawgmoth');
  await page.locator('#network-show-cards').click();
  await page.locator('#network-reset').click();
  await expect(page.locator('#network-scope')).toHaveValue('global');
  await expect(page.locator('#network-depth')).toHaveValue('1');
  await expect(page.locator('#network-depth')).toBeDisabled();
  await expect(page.locator('#network-search')).toHaveValue('');
  await expect(page.locator('#network-show-graph')).toHaveAttribute('aria-pressed', 'true');
  await expect(page).not.toHaveURL(/mode=|depth=|view=/);
});

// Phase 3: graph-only chapter selection uses chapter-tagged documented edges.
test('graph chapter filtering never creates inferred relationships', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza`);
  const explorer = page.locator('[data-relationship-explorer]');
  await expect(explorer).toHaveAttribute('data-graph-state', 'ready');
  const expected = await page.locator('[data-network-edge]').evaluateAll((items) => {
    const chapter = 'war-of-the-spark';
    const matching = items.filter((item) => item.dataset.chapter === chapter);
    const people = new Set(matching.flatMap((item) => [item.dataset.a, item.dataset.b]));
    return { edgeCount: matching.length, nodeCount: people.size };
  });
  expect(expected.edgeCount).toBeGreaterThan(0);
  await page.locator('#network-era').selectOption('war-of-the-spark');
  await expect(page).toHaveURL(/chapter=war-of-the-spark/);
  await expect(explorer).toHaveAttribute('data-graph-visible-edges', String(expected.edgeCount));
  await expect(explorer).toHaveAttribute('data-graph-visible-nodes', String(expected.nodeCount));
  await expect(page.locator('#network-chapter-legend')).toBeVisible();
  await expect(page.locator('#network-graph-status')).toContainText('War of the Spark');
  await page.locator('#network-era').selectOption('');
  await expect(page).not.toHaveURL(/chapter=/);
});

test('chapter layout, node color preference and browser history are shareable', async ({ page }) => {
  await page.goto(`${root}relationships/?person=urza&layout=chapter&colors=neutral`);
  const explorer = page.locator('[data-relationship-explorer]');
  await expect(explorer).toHaveAttribute('data-graph-state', 'ready');
  await expect(page.locator('#network-layout')).toHaveValue('chapter');
  await expect(explorer).toHaveAttribute('data-graph-layout', 'chapter');
  await expect(page.locator('#network-color')).toHaveValue('neutral');
  await expect(page.locator('#network-chapter-legend')).toBeHidden();
  await page.locator('#network-color').selectOption('chapter');
  await expect(page).not.toHaveURL(/colors=neutral/);
  await expect(page.locator('#network-chapter-legend')).toBeVisible();
  await page.locator('#network-layout').selectOption('organic');
  await expect(explorer).toHaveAttribute('data-graph-layout', 'organic');
  await page.goBack();
  await expect(page.locator('#network-layout')).toHaveValue('chapter');
  await expect(explorer).toHaveAttribute('data-graph-layout', 'chapter');
  await page.goBack();
  await expect(page.locator('#network-color')).toHaveValue('neutral');
  await page.locator('#network-reset').click();
  await expect(page.locator('#network-layout')).toHaveValue('organic');
  await expect(page.locator('#network-color')).toHaveValue('chapter');
  await expect(page.locator('#network-era')).toHaveValue('');
  await expect(page).not.toHaveURL(/layout=|colors=|chapter=/);
});

test('chapter graph controls remain usable in a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(`${root}relationships/?chapter=thran&layout=chapter`);
  await expect(page.locator('[data-relationship-explorer]')).toHaveAttribute('data-graph-state', 'ready');
  await expect(page.locator('#network-era')).toHaveValue('thran');
  await expect(page.locator('#network-layout')).toHaveValue('chapter');
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
