import { newSpecPage } from '@stencil/core/testing';
import { DdaBreadcrumb } from '../dda-breadcrumb';

const CRUMBS = [
  { text: 'Home', icon: 'home', url: '/' },
  { text: 'Services', icon: 'work', url: '/services' },
  { text: 'Apply', icon: 'edit' },
];

const render = (html: string) => newSpecPage({ components: [DdaBreadcrumb], html });
const texts = (root: HTMLElement) => Array.from(root.querySelectorAll('.dda-breadcrumb-item span')).map(item => item.textContent.trim());

describe('dda-breadcrumb', () => {
  it('renders items from the breadcrumbs attribute', async () => {
    const page = await render(`<dda-breadcrumb breadcrumbs='${JSON.stringify(CRUMBS)}'></dda-breadcrumb>`);

    expect(texts(page.root)).toEqual(['Home', 'Services', 'Apply']);
  });

  it('renders items set as an array property and re-renders when it changes', async () => {
    const page = await render(`<dda-breadcrumb></dda-breadcrumb>`);
    const el = page.root as HTMLDdaBreadcrumbElement;

    el.breadcrumbs = CRUMBS;
    await page.waitForChanges();
    expect(texts(page.root)).toEqual(['Home', 'Services', 'Apply']);

    el.breadcrumbs = CRUMBS.slice(0, 2);
    await page.waitForChanges();
    expect(texts(page.root)).toEqual(['Home', 'Services']);
  });

  it('still reads the data-breadcrumbs attribute', async () => {
    const page = await render(`<dda-breadcrumb data-breadcrumbs='${JSON.stringify(CRUMBS)}'></dda-breadcrumb>`);

    expect(texts(page.root)).toEqual(['Home', 'Services', 'Apply']);
  });

  it('renders no items for invalid JSON instead of throwing', async () => {
    const page = await render(`<dda-breadcrumb breadcrumbs="not json"></dda-breadcrumb>`);

    expect(texts(page.root)).toEqual([]);
  });

  it('hides the crumb icons and the separators from assistive technology', async () => {
    const page = await render(`<dda-breadcrumb design="icon-text" breadcrumbs='${JSON.stringify(CRUMBS)}'></dda-breadcrumb>`);

    const icons = Array.from(page.root.querySelectorAll('i'));
    expect(icons).toHaveLength(5);
    expect(icons.filter(icon => icon.getAttribute('aria-hidden') !== 'true')).toEqual([]);
  });

  // The last crumb has no url, so its <a> has no href and no link role; aria-label is not allowed
  // there (axe aria-prohibited-attr). Hidden text names every crumb, with or without a url.
  it('names each icon-only crumb with hidden text, not aria-label', async () => {
    const page = await render(`<dda-breadcrumb design="icon" breadcrumbs='${JSON.stringify(CRUMBS)}'></dda-breadcrumb>`);

    const links = Array.from(page.root.querySelectorAll('.dda-breadcrumb-item a'));
    expect(links.map(a => a.querySelector('.visually-hidden')?.textContent)).toEqual(['Home', 'Services', 'Apply']);
    expect(links.map(a => a.getAttribute('aria-label'))).toEqual([null, null, null]);
  });

  it('adds no aria-label when the link shows its text', async () => {
    const page = await render(`<dda-breadcrumb design="icon-text" breadcrumbs='${JSON.stringify(CRUMBS)}'></dda-breadcrumb>`);

    const labels = Array.from(page.root.querySelectorAll('.dda-breadcrumb-item a')).map(a => a.getAttribute('aria-label'));
    expect(labels).toEqual([null, null, null]);
  });
});
