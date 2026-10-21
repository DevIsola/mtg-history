import { test, expect } from '@playwright/test';
const root='/mtg-history/';
const chapter=root+'chapters/brothers-war/';
test('desktop nav exposes every destination and both languages',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(root);
  const menu=page.locator('[data-site-explore-menu]');
  await menu.locator('summary').click();
  for(const path of ['discover/','events/','relationships/','archive/','glossary/','paths/'])
    await expect(menu.locator('a[href="'+root+path+'"]')).toHaveCount(1);
  await expect(page.locator('.site-header__search')).toHaveAttribute('href',root+'search/');
  await page.locator('.site-header__languages summary').click();
  await expect(page.locator('.site-header__language-menu a[href="'+root+'pt-br/"]')).toBeVisible();
});
test('1600px reader has TOC, legible text, and chapter-level context',async({page})=>{
  await page.setViewportSize({width:1600,height:900});
  await page.goto(chapter);
  const g=await page.evaluate(()=>{
    const box=q=>document.querySelector(q)?.getBoundingClientRect().toJSON();
    return {toc:box('.chapter-reading-sidebar'),article:box('.chapter-reading-content'),rail:box('.chapter-context-rail'),prose:box('.chapter-prose')};
  });
  expect(g.rail).toBeDefined();
  expect(g.toc.right).toBeLessThan(g.article.left);
  expect(g.article.right).toBeLessThan(g.rail.left);
  expect(g.prose.width).toBeGreaterThan(430);
  expect(g.prose.width).toBeLessThan(850);
  await expect(page.locator('[data-chapter-context]')).toContainText('Chapter-wide references');
});
test('1200px reader places chapter context below main article',async({page})=>{
  await page.setViewportSize({width:1200,height:850});
  await page.goto(chapter);
  const g=await page.evaluate(()=>{
    const box=q=>document.querySelector(q).getBoundingClientRect().toJSON();
    return {article:box('.chapter-reading-content'),rail:box('.chapter-context-rail')};
  });
  expect(g.rail.top).toBeGreaterThan(g.article.top);
  expect(g.article.width).toBeGreaterThan(550);
});
test('320px header retains navigation, language and settings without overflow',async({page})=>{
  await page.setViewportSize({width:320,height:700});
  await page.goto(chapter);
  await expect(page.locator('.site-header__languages summary')).toBeVisible();
  const mobile=page.locator('.mobile-navigation');
  await mobile.locator('summary').click();
  await expect(mobile.locator('a[href="'+root+'relationships/"]')).toBeVisible();
  await mobile.locator('summary').click();
  const settings=page.locator('[data-chapter-settings]');
  await settings.locator('summary').click();
  await expect(page.locator('[data-reading-controls]')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
test('Portuguese navigation retains local search and identifies English-only destinations',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto(root+'pt-br/');
  await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
  await expect(page.locator('.site-header__search')).toHaveAttribute('href',root+'pt-br/search/');
  const menu=page.locator('[data-site-explore-menu]');
  await menu.locator('summary').click();
  await expect(menu.getByRole('link',{name:'Relações (EN)'})).toHaveAttribute('href',root+'relationships/');
  await expect(menu.getByRole('link',{name:'Eventos'})).toHaveAttribute('href',root+'pt-br/events/');
});
test.describe('without JavaScript',()=>{
  test.use({javaScriptEnabled:false});
  test('prose and native navigation stay available',async({page})=>{
    await page.goto(chapter);
    await expect(page.locator('.chapter-prose h2').first()).toBeVisible();
    await expect(page.locator('[data-chapter-context] a').first()).toBeAttached();
    await expect(page.locator('[data-chapter-settings]')).toBeHidden();
    // Native disclosures work without JS, but desktop Explore is hidden at mobile widths.
    const mobile = page.locator('.mobile-navigation');
    if (await mobile.isVisible()) {
      await mobile.locator('summary').click();
      await expect(mobile.locator('a[href="'+root+'archive/"]')).toBeVisible();
    } else {
      const desktop = page.locator('[data-site-explore-menu]');
      await desktop.locator('summary').click();
      await expect(desktop.locator('a[href="'+root+'archive/"]')).toBeVisible();
    }
  });
});
