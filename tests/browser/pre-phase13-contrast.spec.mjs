import { test, expect } from '@playwright/test';
const base = '/mtg-history/';
function luminance(rgb) {
  const channels = rgb.match(/[\d.]+/g)?.slice(0, 3).map(x => Number(x)/255) ?? [];
  if (channels.length !== 3) throw new Error('Invalid computed color: '+rgb);
  const [r,g,b] = channels.map(c => c <= .04045 ? c / 12.92 : ((c+.055)/1.055)**2.4);
  return .2126*r + .7152*g + .0722*b;
}
function contrast(a,b) {const [x,y]=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (x+.05)/(y+.05);}
for(const theme of ['light','dark']) {
  test('chapter links contrast against paper in '+theme, async ({page})=>{
    await page.goto(base+'chapters/thran/');
    const computed = await page.evaluate(theme=>{
      document.documentElement.dataset.theme = theme;
      const root = getComputedStyle(document.documentElement);
      const toc = document.querySelector('.chapter-toc__list a[aria-current="location"]');
      const enlarge = document.querySelector('.historical-card__source');
      if (!toc || !enlarge) throw new Error('Missing TOC link or card source link');
      return {
        link:getComputedStyle(toc).color,
        action:getComputedStyle(enlarge).color,
        paper:root.getPropertyValue('--paper-deep').trim(),
      };
    },theme);
    const bg = theme === 'dark' ? 'rgb(32, 49, 55)' : 'rgb(233, 224, 208)';
    // Wait for the 150ms TOC color transition to finish.
    // Still fail if the final color does not meet WCAG AA.
    await expect.poll(async () => {
      const linkColor = await page
        .locator('.chapter-toc__list a[aria-current="location"]')
        .evaluate(element => getComputedStyle(element).color);

      return contrast(linkColor, bg);
    }, { timeout: 3000 }).toBeGreaterThanOrEqual(4.5);
    expect(contrast(computed.action, bg)).toBeGreaterThanOrEqual(4.5);
  });
}
test('mobile chapter TOC attaches to sticky header without showing prose in a gap',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'chapters/thran/');
  await page.locator('.chapter-prose h2').nth(3).scrollIntoViewIfNeeded();
  const geometry=await page.evaluate(()=>({
    header:document.querySelector('.site-header')?.getBoundingClientRect().bottom,
    sidebar:document.querySelector('.chapter-reading-sidebar')?.getBoundingClientRect().top,
  }));
  expect(geometry.header).toBeDefined();
  expect(Math.abs(geometry.sidebar-geometry.header)).toBeLessThanOrEqual(2);
});
test('chapter table of contents shows one numeric prefix and legible body typography',async({page})=>{
  await page.goto(base+'chapters/thran/');
  const label=(await page.locator('.chapter-toc__list a').first().innerText()).trim();
  expect(label).not.toMatch(/^\d+\s+[IVXLCDM]+\./i);
  const body=await page.locator('body').evaluate(el=>getComputedStyle(el).fontFamily);
  expect(body).toContain('Source Sans 3 Variable');
});
