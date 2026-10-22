/** A chapter navigation enhancement, built exclusively from existing card markup. */
export const ARTWORK_MOMENT_SELECTOR = '.chapter-prose .historical-moment';

export function chapterArtworkEntries(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(ARTWORK_MOMENT_SELECTOR)).flatMap((element) => {
    const title = element.querySelector('.historical-card__caption h3')?.textContent?.trim();
    const credit = element.querySelector('.historical-card__credit')?.textContent?.trim();
    const printingId = element.querySelector('[data-card-artwork-open]')?.dataset.printingId;
    // Do not construct links or descriptions from inferred, unverified cards.
    return title && credit && printingId ? [{ element, title, credit, printingId }] : [];
  });
}

/** Index of the latest illustration above the reading activation line. */
export function activeArtworkIndex(tops, activationLine) {
  if (!tops.length) return -1;
  let index = 0;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] <= activationLine) index = i;
  }
  return index;
}

export function setupChapterArtworkTrail(root) {
  const noop = { count: 0, disconnect() {} };
  const panel = root?.querySelector('[data-chapter-artwork-trail]');
  const list = panel?.querySelector('[data-artwork-list]');
  const count = panel?.querySelector('[data-artwork-count]');
  const toggle = panel?.querySelector('[data-artwork-follow]');
  if (!root || !panel || !list || !count || !toggle || panel.dataset.artworkReady === 'true') return noop;

  const entries = chapterArtworkEntries(root);
  if (!entries.length) return noop;
  const document = root.ownerDocument;
  const view = document.defaultView;
  if (!view) return noop;
  const links = [];
  const fragmentPrefix = 'chapter-artwork-';

  for (const [index, entry] of entries.entries()) {
    // Stable, meaningful links; do not overwrite authored heading IDs.
    let id = `${fragmentPrefix}${String(index + 1).padStart(2, '0')}`;
    while (document.getElementById(id) && document.getElementById(id) !== entry.element) {
      id += '-illustration';
    }
    if (!entry.element.id) entry.element.id = id;
    else id = entry.element.id;

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(id)}`;
    // Accessible name comes directly from the visible card title and credit.
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    const title = document.createElement('strong');
    title.textContent = entry.title;
    const credit = document.createElement('small');
    credit.textContent = entry.credit;
    link.append(number, title, credit);
    li.append(link);
    list.append(li);
    links.push(link);
  }

  let selected = -1;
  let pending = false;
  const update = () => {
    pending = false;
    const header = document.querySelector('.site-header');
    const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
    const activation = headerBottom + Math.min(180, view.innerHeight * 0.25);
    const index = activeArtworkIndex(entries.map(({ element }) => element.getBoundingClientRect().top), activation);
    if (index === selected) return;
    selected = index;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}`;
    for (const [n, { element }] of entries.entries()) {
      if (n === index) links[n].setAttribute('aria-current', 'location');
      else links[n].removeAttribute('aria-current');
      if (n === index && toggle.checked) element.dataset.artworkCurrent = 'true';
      else delete element.dataset.artworkCurrent;
    }
  };
  const schedule = () => {
    if (pending) return;
    pending = true;
    view.requestAnimationFrame(update);
  };
  const change = () => {
    root.dataset.artworkFollow = toggle.checked ? 'true' : 'false';
    selected = -1;
    update();
  };
  toggle.addEventListener('change', change);
  view.addEventListener('scroll', schedule, { passive: true });
  view.addEventListener('resize', schedule, { passive: true });
  view.addEventListener('pageshow', schedule);
  panel.hidden = false;
  panel.dataset.artworkReady = 'true';
  root.dataset.artworkFollow = 'false';
  update();

  // Dynamic fragments do not exist until hydration. Resolve only our own IDs.
  let incoming = view.location?.hash?.slice(1) ?? '';
  try { incoming = decodeURIComponent(incoming); } catch { /* Ignore malformed fragments. */ }
  if (incoming.startsWith(fragmentPrefix)) {
    view.requestAnimationFrame(() => {
      const target = document.getElementById(incoming);
      if (target && entries.some((entry) => entry.element === target)) target.scrollIntoView();
      schedule();
    });
  }

  return {
    count: entries.length,
    disconnect() {
      view.removeEventListener('scroll', schedule);
      view.removeEventListener('resize', schedule);
      view.removeEventListener('pageshow', schedule);
      toggle.removeEventListener('change', change);
      delete root.dataset.artworkFollow;
      for (const { element } of entries) delete element.dataset.artworkCurrent;
      delete panel.dataset.artworkReady;
    },
  };
}
