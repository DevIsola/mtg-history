/** Progressive enhancement: the authored term stays a normal link without JS. */
export function setupLoreTerms(root: ParentNode = document): void {
  const items = root.querySelectorAll<HTMLElement>('[data-lore-term]:not([data-lore-ready])');
  for (const item of items) {
    const link = item.querySelector<HTMLAnchorElement>('.lore-term__link');
    const button = item.querySelector<HTMLButtonElement>('[data-lore-button]');
    const panel = item.querySelector<HTMLElement>('[data-lore-panel]');
    if (!link || !button || !panel) continue;
    item.dataset.loreReady = 'true';
    button.hidden = false;

    const setOpen = (open: boolean) => {
      panel.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
      if (open) {
        panel.style.left = '0px';
        const rect = panel.getBoundingClientRect();
        const margin = 12;
        const left = Math.min(Math.max(rect.left, margin), window.innerWidth - margin - rect.width);
        panel.style.left = `${left - rect.left}px`;
        if (rect.bottom > window.innerHeight - margin && rect.top > rect.height + margin) {
          panel.style.top = `-${rect.height + 8}px`;
        } else {
          panel.style.top = '';
        }
      }
    };

    item.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') setOpen(true);
    });
    item.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse' && !item.contains(document.activeElement)) setOpen(false);
    });
    link.addEventListener('focus', () => setOpen(true));
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget as Node | null)) setOpen(false);
    });
    button.addEventListener('click', () => setOpen(panel.hidden));
    document.addEventListener('pointerdown', (event) => {
      if (!item.contains(event.target as Node)) setOpen(false);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        setOpen(false);
        button.focus();
      }
    });
  }
}
