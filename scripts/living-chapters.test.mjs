import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LIVING_REVEAL_SELECTOR, setupLivingChapterReveals } from '../src/utils/living-chapters.mjs';

function fixture() {
  const make = (top, height = 180) => ({
    dataset: {},
    getBoundingClientRect: () => ({ top, height }),
  });
  const current = make(150);
  const upcoming = make(1300);
  const later = make(2400);
  const hidden = make(2600, 0);
  const observed = [];
  const unobserved = [];
  let disconnected = false;
  let callback;
  let settings;
  class Observer {
    constructor(cb, options) { callback = cb; settings = options; }
    observe(element) { observed.push(element); }
    unobserve(element) { unobserved.push(element); }
    disconnect() { disconnected = true; }
  }
  const root = {
    querySelectorAll(selector) {
      assert.equal(selector, LIVING_REVEAL_SELECTOR);
      return [current, upcoming, later, hidden];
    },
  };
  return { root, current, upcoming, later, hidden, observed, unobserved, Observer,
    trigger(entries) { callback(entries, { unobserve: (element) => unobserved.push(element) }); },
    settings() { return settings; },
    wasDisconnected() { return disconnected; },
  };
}

test('registers only offscreen narrative headings and illustrations', () => {
  const f = fixture();
  const handle = setupLivingChapterReveals(f.root, { Observer: f.Observer, viewportHeight: 800, reducedMotion: false });
  assert.equal(handle.count, 2);
  assert.deepEqual(f.observed, [f.upcoming, f.later]);
  assert.equal(f.current.dataset.livingReveal, undefined);
  assert.equal(f.hidden.dataset.livingReveal, undefined);
  assert.equal(f.upcoming.dataset.livingReveal, 'pending');
  assert.equal(f.settings().threshold, 0.08);
});

test('incoming chapter fragments do not register pending reveals before anchor scrolling', () => {
  for (const locationHash of ['#chapter-reader', '#thran-powerstones']) {
    const f = fixture();
    const handle = setupLivingChapterReveals(f.root, {
      Observer: f.Observer, viewportHeight: 800, reducedMotion: false, locationHash,
    });
    assert.equal(handle.count, 0);
    assert.deepEqual(f.observed, []);
    for (const element of [f.current, f.upcoming, f.later, f.hidden]) {
      assert.equal(element.dataset.livingReveal, undefined);
    }
  }
});

test('an ordinary chapter visit continues to observe future reveals', () => {
  const f = fixture();
  const handle = setupLivingChapterReveals(f.root, {
    Observer: f.Observer, viewportHeight: 800, reducedMotion: false, locationHash: '',
  });
  assert.equal(handle.count, 2);
  assert.deepEqual(f.observed, [f.upcoming, f.later]);
});

test('reveals intersecting content once and does not alter unrelated elements', () => {
  const f = fixture();
  setupLivingChapterReveals(f.root, { Observer: f.Observer, viewportHeight: 800, reducedMotion: false });
  f.trigger([{ target: f.upcoming, isIntersecting: true }, { target: f.later, isIntersecting: false }]);
  assert.equal(f.upcoming.dataset.livingReveal, 'visible');
  assert.equal(f.later.dataset.livingReveal, 'pending');
  assert.deepEqual(f.unobserved, [f.upcoming]);
});

test('reduced motion performs no observation or DOM mutation', () => {
  const f = fixture();
  const handle = setupLivingChapterReveals(f.root, { Observer: f.Observer, viewportHeight: 800, reducedMotion: true });
  assert.equal(handle.count, 0);
  assert.deepEqual(f.observed, []);
});

test('unsupported observer preserves normal content', () => {
  const f = fixture();
  const handle = setupLivingChapterReveals(f.root, { Observer: false, viewportHeight: 800, reducedMotion: false });
  assert.equal(handle.count, 0);
  assert.equal(f.upcoming.dataset.livingReveal, undefined);
});

test('disconnect removes only still-pending cues and preserves revealed state', () => {
  const f = fixture();
  const handle = setupLivingChapterReveals(f.root, { Observer: f.Observer, viewportHeight: 800, reducedMotion: false });
  f.trigger([{ target: f.upcoming, isIntersecting: true }]);
  handle.disconnect();
  assert.equal(f.wasDisconnected(), true);
  assert.equal(f.upcoming.dataset.livingReveal, 'visible');
  assert.equal(f.later.dataset.livingReveal, undefined);
});

test('missing chapter or no eligible elements is a no-op', () => {
  assert.equal(setupLivingChapterReveals(null).count, 0);
  const f = fixture();
  assert.equal(setupLivingChapterReveals(f.root, { Observer: f.Observer, viewportHeight: 4000, reducedMotion: false }).count, 0);
});

test('chapter script and scoped styling are progressive enhancements', () => {
  const page = readFileSync(new URL('../src/pages/chapters/[id].astro', import.meta.url), 'utf8');
  const scss = readFileSync(new URL('../src/styles/_chapter-themes.scss', import.meta.url), 'utf8');
  assert.match(page, /import \{ setupLivingChapterReveals \} from '\.\.\/\.\.\/utils\/living-chapters\.mjs';/);
  assert.match(page, /setupLivingChapterReveals\(document\.querySelector\('\.chapter-theme'\)\)/);
  assert.match(scss, /\[data-living-reveal='pending'\]/);
  assert.match(scss, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(scss, /display:\s*none/);
  assert.doesNotMatch(scss, /visibility:\s*hidden/);
  assert.doesNotMatch(scss, /opacity:\s*0\s*(?:;|})/);
});
