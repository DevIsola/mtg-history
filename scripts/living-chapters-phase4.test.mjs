import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupChapterArtworkTrail } from '../src/utils/chapter-artwork-trail.mjs';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

function fixture(hash = '') {
  let nextFrame = 1;
  const frames = new Map();
  const events = new Map();
  const linkAttributes = [];
  const create = (tag) => ({
    tag, children: [], textContent: '', dataset: {},
    attributes: new Map(),
    append(...elements) {
      this.children.push(...elements);
      for (const child of elements) child.parentElement = this;
    },
    setAttribute(key, value) { this.attributes.set(key, value); linkAttributes.push([this, key, value]); },
    removeAttribute(key) { this.attributes.delete(key); },
    remove() {
      if (this.parentElement) this.parentElement.children = this.parentElement.children.filter((x) => x !== this);
    },
  });
  const moments = [1200, 2200, 3200].map((top, i) => ({
    top, id: '', dataset: {},
    getBoundingClientRect() { return { top: this.top }; },
    querySelector(selector) {
      if (selector === '.historical-card__caption h3') return { textContent: `Card ${i + 1}` };
      if (selector === '.historical-card__credit') return { textContent: `Artist ${i + 1} · WAR #${i + 1}` };
      if (selector === '[data-card-artwork-open]') return { dataset: { printingId: `printing-${i + 1}` } };
      return null;
    },
    scrollIntoView() {},
  }));
  const list = create('ol');
  const count = create('span');
  const toggle = {
    checked: false,
    addEventListener(_name, fn) { this.handler = fn; },
    removeEventListener() { this.handler = null; },
    change(value) { this.checked = value; this.handler?.(); },
  };
  const panel = {
    dataset: {}, hidden: true,
    querySelector(selector) {
      return ({ '[data-artwork-list]': list, '[data-artwork-count]': count, '[data-artwork-follow]': toggle })[selector];
    },
  };
  const view = {
    innerHeight: 800, location: { hash },
    addEventListener(name, fn) { events.set(name, fn); },
    removeEventListener(name) { events.delete(name); },
    requestAnimationFrame(fn) { const id = nextFrame++; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    flush() { const ready = [...frames.values()]; frames.clear(); for (const fn of ready) fn(); },
    emit(name) { events.get(name)?.(); },
  };
  const document = {
    defaultView: view,
    createElement: create,
    getElementById(id) { return moments.find((element) => element.id === id); },
    querySelector(selector) {
      if (selector === '.site-header') return { getBoundingClientRect: () => ({ bottom: 50 }) };
      return null;
    },
  };
  const root = {
    dataset: {}, ownerDocument: document,
    querySelector(selector) { return selector === '[data-chapter-artwork-trail]' ? panel : null; },
    querySelectorAll() { return moments; },
  };
  return { root, moments, list, panel, toggle, count, view, events, frames, linkAttributes };
}

test('scroll updates coalesce into one animation frame and touch only changed selections', () => {
  const f = fixture();
  const connection = setupChapterArtworkTrail(f.root);
  assert.equal(connection.count, 3);
  assert.equal(f.list.children.length, 3);
  assert.equal(f.list.children[0].children[0].attributes.get('aria-current'), 'location');
  f.moments[1].top = 60;
  for (let i = 0; i < 30; i++) f.view.emit('scroll');
  assert.equal(f.frames.size, 1);
  f.view.flush();
  assert.equal(f.list.children[0].children[0].attributes.has('aria-current'), false);
  assert.equal(f.list.children[1].children[0].attributes.get('aria-current'), 'location');
  assert.equal(f.linkAttributes.filter(([, key]) => key === 'aria-current').length, 2);
  connection.disconnect();
});

test('follow toggle does not change selected item or rescan all cards', () => {
  const f = fixture();
  const connection = setupChapterArtworkTrail(f.root);
  const writes = f.linkAttributes.length;
  f.toggle.change(true);
  assert.equal(f.root.dataset.artworkFollow, 'true');
  assert.equal(f.moments[0].dataset.artworkCurrent, 'true');
  assert.equal(f.linkAttributes.length, writes);
  f.toggle.change(false);
  assert.equal(f.moments[0].dataset.artworkCurrent, undefined);
  f.view.flush();
  connection.disconnect();
});

test('disconnect cancels scroll and fragment frames, removes navigation entries, and is idempotent', () => {
  const f = fixture('#chapter-artwork-02');
  const connection = setupChapterArtworkTrail(f.root);
  assert.equal(f.frames.size, 1); // Pending deep-link resolution.
  f.view.emit('scroll');
  assert.equal(f.frames.size, 2);
  connection.disconnect();
  connection.disconnect();
  assert.equal(f.frames.size, 0);
  assert.equal(f.list.children.length, 0);
  assert.equal(f.panel.hidden, true);
  assert.equal(f.panel.dataset.artworkReady, undefined);
  assert.equal(f.events.size, 0);
  f.view.flush();
  assert.equal(f.moments.some((x) => x.dataset.artworkCurrent), false);
  assert.equal(setupChapterArtworkTrail(f.root).count, 3);
});

test('highlight decoration retains dimensions and respects reduced motion', () => {
  const component = read('src/components/ChapterArtworkTrail.astro');
  const reading = read('src/styles/_reading.scss');
  assert.match(component, /box-shadow: inset 0 3px 0 var\(--era-accent/);
  const highlight = component.split(':global(.chapter-theme[data-artwork-follow="true"]')[1]?.split('}')[0];
  assert.ok(highlight);
  assert.doesNotMatch(highlight, /border-top: 3px solid/);
  assert.match(reading, /prefers-reduced-motion: reduce/);
  assert.match(reading, /historical-moment__illustration \.historical-card img/);
  const util = read('src/utils/chapter-artwork-trail.mjs');
  assert.doesNotMatch(util, /innerHTML\s*=/);
  assert.doesNotMatch(util, /fetch\(/);
});


test('compact artwork context is discoverable without rewriting the native summary label', () => {
  const card = read('src/components/HistoricalCard.astro');
  assert.match(card, /<details class="historical-card__interpretation">/);
  assert.match(card, /<summary>Art and historical context<\/summary>/);
  assert.match(card, /\.historical-card__interpretation summary::after\s*\{/);
  assert.match(card, /\.historical-card__interpretation\[open\] summary::after\s*\{/);
  assert.match(card, /\.historical-card__interpretation summary:focus-visible/);
  assert.match(card, /min-height:\s*44px/);
  assert.match(card, /background:\s*linear-gradient/);
});
