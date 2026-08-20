import { newE2EPage } from '@stencil/core/testing';

const CRUMBS = JSON.stringify([
  { text: 'Home', icon: 'home', url: '/' },
  { text: 'Library', icon: 'menu_book', url: '/library' },
  { text: 'Data', icon: 'storage', url: '/library/data' },
]);

describe('dda-breadcrumb', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-breadcrumb data-breadcrumbs='${CRUMBS}'></dda-breadcrumb>`);

    const el = await page.find('dda-breadcrumb');
    expect(el).toHaveClass('hydrated');
  });

  // A screen reader traverses this as a labelled nav landmark containing an
  // ordered list, one <li> per crumb, in document order.
  it('renders a labelled nav landmark with an ordered list of crumbs', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-breadcrumb data-breadcrumbs='${CRUMBS}'></dda-breadcrumb>`);

    const nav = await page.find('dda-breadcrumb nav');
    expect(nav.getAttribute('aria-label')).toBe('breadcrumb');

    const list = await page.find('dda-breadcrumb nav ol.dda-breadcrumb');
    expect(list).not.toBeNull();

    const items = await page.findAll('dda-breadcrumb li.dda-breadcrumb-item');
    expect(items).toHaveLength(3);

    const texts = await page.evaluate(() => Array.from(document.querySelectorAll('dda-breadcrumb li.dda-breadcrumb-item span')).map(s => s.textContent));
    expect(texts).toEqual(['Home', 'Library', 'Data']);
  });

  // Only the current (last) crumb is marked as such - via a CSS class, not
  // aria-current (tracked as F-027: no non-visual "you are here" signal).
  // This documents the actual behaviour, not the ideal one.
  it('marks only the last crumb as the current item, via the active class', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-breadcrumb data-breadcrumbs='${CRUMBS}'></dda-breadcrumb>`);

    const activeClasses = await page.evaluate(() => Array.from(document.querySelectorAll('dda-breadcrumb li.dda-breadcrumb-item')).map(li => li.classList.contains('active')));
    expect(activeClasses).toEqual([false, false, true]);

    const ariaCurrents = await page.evaluate(() => Array.from(document.querySelectorAll('dda-breadcrumb li.dda-breadcrumb-item a')).map(a => a.getAttribute('aria-current')));
    expect(ariaCurrents).toEqual([null, null, null]);
  });

  // O-003: every crumb, including the current one, renders as a real link to
  // its own url - so it is reachable/clickable, but a screen reader user
  // gets no signal that the last link points at the page they are already on.
  it('renders every crumb, including the current one, as a real link to its url', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-breadcrumb data-breadcrumbs='${CRUMBS}'></dda-breadcrumb>`);

    const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('dda-breadcrumb li.dda-breadcrumb-item a')).map(a => a.getAttribute('href')));
    expect(hrefs).toEqual(['/', '/library', '/library/data']);
  });

  it('shows the separator icon between crumbs but not after the last one', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-breadcrumb data-breadcrumbs='${CRUMBS}' separator="chevron_right"></dda-breadcrumb>`);

    const separators = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-breadcrumb li.dda-breadcrumb-item > i.material-symbols-outlined')).map(i => i.textContent),
    );
    expect(separators).toEqual(['chevron_right', 'chevron_right']);
  });

  it('the icon design shows only icons, hiding the crumb text', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-breadcrumb data-breadcrumbs='${CRUMBS}' design="icon"></dda-breadcrumb>`);

    const spans = await page.findAll('dda-breadcrumb li.dda-breadcrumb-item a span');
    expect(spans).toHaveLength(0);

    const icons = await page.findAll('dda-breadcrumb li.dda-breadcrumb-item a i.material-icons');
    expect(icons).toHaveLength(3);
  });

  // Without data-breadcrumbs the component must not throw and must render an
  // empty, still-valid nav/ol structure rather than crash.
  it('renders an empty list when no data-breadcrumbs attribute is present', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-breadcrumb></dda-breadcrumb>');

    const el = await page.find('dda-breadcrumb');
    expect(el).toHaveClass('hydrated');

    const items = await page.findAll('dda-breadcrumb li.dda-breadcrumb-item');
    expect(items).toHaveLength(0);
  });
});
