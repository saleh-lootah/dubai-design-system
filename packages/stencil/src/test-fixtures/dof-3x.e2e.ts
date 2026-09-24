import { newE2EPage, E2EPage } from '@stencil/core/testing';
import { readFileSync } from 'fs';
import { join } from 'path';

// Dubai Finance built its site on the 3.x API. This page is its real markup (see the comment in
// dof-3x.html). Every check here is a 3.x behavior that the site depends on.
const fixture = readFileSync(join(__dirname, 'dof-3x.html'), 'utf8');

export async function loadDof(page: E2EPage) {
  await page.setViewport({ width: 1440, height: 900 });
  await page.setContent(fixture);
  await page.waitForChanges();
}

describe('DoF 3.x markup on 5.3.0', () => {
  it('upgrades the header and the sticky footer', async () => {
    const page = await newE2EPage();
    await loadDof(page);
    expect(await page.find('dda-header')).toHaveClass('hydrated');
    expect(await page.find('dda-sticky-footer')).toHaveClass('hydrated');
  });

  it('shows the accessibility panel in Arabic, with the screen reader column', async () => {
    const page = await newE2EPage();
    await loadDof(page);
    const headings = await page.$$eval('dda-header .dda-accessibility-wrap h2', els => els.map(e => e.textContent.trim()));
    expect(headings).toEqual(['تباين الألوان', 'قارئ الشاشة', 'حجم النص']);
    // getAttribute('title_text') is not usable here: dda-header creates these dda-radiobutton
    // elements from an already-hydrated bundle, so Stencil sets title_text as a JS property, not
    // a reflected attribute (confirmed independent of this task's change). The rendered label is
    // the observable, user-facing behavior the DoF site depends on, so assert on that instead.
    const radios = await page.$$eval('dda-header .dda-accessibility-wrap dda-radiobutton .radio-title', els => els.map(e => e.textContent.trim()));
    expect(radios).toEqual(['الألوان العادية', 'عمى الألوان', 'ضعف أحمر', 'الضعف الأخضر']);
  });

  it('shows the Arabic toolbar and no Login link', async () => {
    const page = await newE2EPage();
    await loadDof(page);
    expect(await page.find('dda-header dda-link-button')).toBeNull();
    const placeholder = await page.$eval('dda-header .dda-toolbar-menu input', e => e.getAttribute('placeholder'));
    expect(placeholder).toBe('يبحث');
    const icon = await page.$eval('dda-header .dda-toolbar-menu .accessibility-btn i', e => e.textContent.trim());
    expect(icon).toBe('accessible_forward');
  });

  it('shows the 3.x top menu with labels and dropdowns', async () => {
    const page = await newE2EPage();
    await loadDof(page);
    const labels = await page.$$eval('dda-header .dda-mega-menu > li > a', els => els.map(e => e.textContent.trim()));
    expect(labels).toHaveLength(7);
    expect(labels.every(label => label.length > 0)).toBe(true);
    await (await page.find('dda-header .dda-mega-menu > li:nth-child(2) > a')).click();
    await page.waitForChanges();
    const items = await page.$$eval('dda-header .dda-default-submenu.is-visible > ul > li', els => els.length);
    expect(items).toBe(12);
  });

  it('shows the three DoF logos and the two text links with icons', async () => {
    const page = await newE2EPage();
    await loadDof(page);
    const logos = await page.$$eval('dda-sticky-footer .dda-footer-middle img', els => els.map(e => e.getAttribute('src')));
    expect(logos).toEqual(['/Style%20Library/img/digital-logo.svg', '/Style%20Library/img/dfsf-logo.svg', '/Style%20Library/img/dmpf-logo.svg']);
    const icons = await page.$$eval('dda-sticky-footer .dda-footer-right .foot-icon-btn i', els => els.map(e => e.textContent.trim()));
    expect(icons.slice(0, 2)).toEqual(['feed', 'call']);
  });
});
