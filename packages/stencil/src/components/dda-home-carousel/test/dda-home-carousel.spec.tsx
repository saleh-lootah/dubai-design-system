import { newSpecPage } from '@stencil/core/testing';
import { DdaHomeCarousel } from '../dda-home-carousel';
import { DdaBannerCard } from '../../dda-banner-card/dda-banner-card';

const render = (html: string) => newSpecPage({ components: [DdaHomeCarousel, DdaBannerCard], html });
const list = JSON.stringify([
  { banner_card_href: '/about', image_src: 'a.svg', image_alt: 'icon', banner_card_title: 'About', banner_card_description: '' },
  { banner_card_href: '/data', image_src: 'd.svg', banner_card_title: 'Open data' },
]);

describe('dda-home-carousel', () => {
  it('renders one list item per card in a named navigation list', async () => {
    const page = await render(`<dda-home-carousel bannercardlist='${list}' aria_label="روابط سريعة"></dda-home-carousel>`);
    const nav = page.root.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('روابط سريعة');
    const items = page.root.querySelectorAll('ul.quick-links > li.dda-home-carousel-item');
    expect(items).toHaveLength(2);
    expect(Array.from(page.root.querySelectorAll('a.dda-banner-card')).map((a: HTMLAnchorElement) => a.getAttribute('href'))).toEqual(['/about', '/data']);
  });

  it('has no carousel role and no live region', async () => {
    const page = await render(`<dda-home-carousel bannercardlist='${list}'></dda-home-carousel>`);
    expect(page.root.querySelector('[aria-roledescription]')).toBeNull();
    expect(page.root.querySelector('[aria-live]')).toBeNull();
  });

  it('sets the cards per view from items_in_view', async () => {
    const page = await render(`<dda-home-carousel bannercardlist='${list}' items_in_view="4"></dda-home-carousel>`);
    expect(page.root.querySelector('ul.quick-links').getAttribute('style')).toContain('--dda-home-carousel-per-view: 4');
  });

  it('accepts the list as an array property', async () => {
    const page = await render(`<dda-home-carousel></dda-home-carousel>`);
    page.root.bannercardlist = JSON.parse(list);
    await page.waitForChanges();
    expect(page.root.querySelectorAll('li.dda-home-carousel-item')).toHaveLength(2);
  });

  it('renders nothing but warns once for invalid JSON', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const page = await render(`<dda-home-carousel bannercardlist='[{'></dda-home-carousel>`);
    expect(page.root.querySelectorAll('li')).toHaveLength(0);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('skips null, number and string entries with one warning', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const page = await render(`<dda-home-carousel bannercardlist='[null,5,"x",{"banner_card_href":"/about","banner_card_title":"About"}]'></dda-home-carousel>`);
    expect(page.root.querySelectorAll('li.dda-home-carousel-item')).toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('emits cardClick with the item and lets the link navigate', async () => {
    const page = await render(`<dda-home-carousel bannercardlist='${list}'></dda-home-carousel>`);
    const spy = jest.fn();
    page.root.addEventListener('cardClick', (e: CustomEvent) => spy(e.detail));
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    page.root.querySelector('a.dda-banner-card').dispatchEvent(event);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ banner_card_title: 'About' }));
    expect(event.defaultPrevented).toBe(false);
  });
});
