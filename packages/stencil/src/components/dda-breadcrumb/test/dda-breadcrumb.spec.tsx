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
});
