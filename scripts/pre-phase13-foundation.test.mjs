import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
function luminance(hex) {
  const v = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255)
    .map(c => c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
  return .2126*v[0]+.7152*v[1]+.0722*v[2];
}
function contrast(a,b){const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (x+.05)/(y+.05);}
test('semantic links and paper-surface gold text pass contrast in both themes',()=>{
  const light=read('src/styles/_tokens.scss'), dark=read('src/styles/_theme.scss');
  assert.match(light,/--link-color: #785528/);
  assert.match(dark,/--link-color: #e2c28a/);
  for(const bg of ['#f4efe5','#faf7f0','#e9e0d0']) assert.ok(contrast('#785528',bg)>=4.5,bg);
  for(const bg of ['#172529','#203137','#111d20']) assert.ok(contrast('#e2c28a',bg)>=4.5,bg);
  assert.doesNotMatch(dark,/:root\[data-theme=[^\n]+\] \.[a-z]/);
});
test('gold remains decorative, surface text uses a contrast-safe semantic token',()=>{
  const files=['_discovery.scss','_characters.scss','_events.scss','_exploration.scss'];
  for(const p of files) assert.doesNotMatch(read('src/styles/'+p),/(?<![\w-])color:\s*var\(--gold\);/,p);
  assert.match(read('src/styles/_foundation.scss'),/color: var\(--accent-text\)/);
});
test('no component or SCSS microtype below .75rem remains',()=>{
  function walk(base){return readdirSync(new URL(base,root)).flatMap(name=>{
    const path=base+name, st=statSync(new URL(path,root));
    return st.isDirectory()?walk(path+'/'): /\.(?:scss|astro)$/.test(name)?[path]:[];
  });}
  for(const p of walk('src/')) {
    for(const match of read(p).matchAll(/font-size:\s*(0?\.\d+)rem\b/g))
      assert.ok(Number(match[1])>=.75, p+': '+match[0]);
  }
});
test('mobile TOC has no unbacked sticky gap; chapter index does not double-number',()=>{
  const s=read('src/styles/_reading.scss'), toc=read('src/components/ChapterToc.astro');
  assert.match(s,/\.chapter-reader \.chapter-reading-sidebar \{ top: var\(--site-header-height\); \}/);
  assert.match(toc,/section\.text\.replace\(/);
  assert.match(s,/max-width: 68ch;/);
  assert.match(s,/line-height: 1\.72;/);
});
test('both open-license variable font families self-host through the Astro build',()=>{
  const l=read('src/layouts/BaseLayout.astro'), t=read('src/styles/_tokens.scss');
  for(const name of ['source-sans-3','fraunces']) {
    assert.ok(l.includes("@fontsource-variable/"+name+"/wght.css"));
    assert.ok(l.includes("@fontsource-variable/"+name+"/wght-italic.css"));
  }
  const manifest=JSON.parse(read('package.json'));
  for(const name of ['source-sans-3','fraunces'])
    assert.equal(manifest.dependencies['@fontsource-variable/'+name],'5.3.0');
  assert.match(t,/--font-reading-serif/);
});
