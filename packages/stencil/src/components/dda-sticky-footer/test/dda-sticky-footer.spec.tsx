import { newSpecPage } from '@stencil/core/testing';
import { DdaStickyFooter } from '../dda-sticky-footer';

const render = (html: string) => newSpecPage({ components: [DdaStickyFooter], html });
const rightLink = (page, index: number) => page.root.querySelectorAll('.dda-footer-right .foot-icon-btn a')[index] as HTMLAnchorElement;

describe('dda-sticky-footer', () => {
  describe('location and news links', () => {
    it('show a Material icon and a text name when only the icon is set', async () => {
      const page = await render(`
        <dda-sticky-footer
          location-button-icon="location_on" location-button-text="Location"
          news-button-icon="newspaper" news-button-text="Newsroom">
        </dda-sticky-footer>`);

      for (const [index, icon, text] of [
        [0, 'location_on', 'Location'],
        [1, 'newspaper', 'Newsroom'],
      ] as const) {
        const link = rightLink(page, index);
        expect(link.querySelector('img')).toBeNull();
        expect(link.querySelector('i').textContent).toBe(icon);
        expect(link.querySelector('i').getAttribute('aria-hidden')).toBe('true');
        expect(link.querySelector('.visually-hidden').textContent).toBe(text);
      }
    });

    it('keep the image when an image URL is set', async () => {
      const page = await render(`
        <dda-sticky-footer
          location-logo-src="loc.svg" location-button-icon="location_on" location-button-text="Location"
          news-button-src="news.svg" news-button-text="Newsroom">
        </dda-sticky-footer>`);

      expect(rightLink(page, 0).querySelector('img').getAttribute('src')).toBe('loc.svg');
      expect(rightLink(page, 0).querySelector('i')).toBeNull();
      expect(rightLink(page, 1).querySelector('img').getAttribute('src')).toBe('news.svg');
    });
  });

  describe('3.x item rules', () => {
    it('renders only the items that have an image (or services text)', async () => {
      const page = await render(`<dda-sticky-footer happiness-icon-src="h.svg" services-icon-text="Services" chat-icon-src=""></dda-sticky-footer>`);
      const left = page.root.querySelectorAll('.dda-footer-left li');
      expect(left).toHaveLength(2);
      expect(page.root.querySelector('.dda-footer-right img[src=""]')).toBeNull();
    });

    it('shows the middle logos without hide-middle-section, and hides them with it', async () => {
      const shown = await render(`<dda-sticky-footer first-logo-src="1.svg" second-logo-src="2.svg"></dda-sticky-footer>`);
      expect(shown.root.querySelectorAll('.dda-footer-middle li')).toHaveLength(2);
      const hidden = await render(`<dda-sticky-footer first-logo-src="1.svg" hide-middle-section></dda-sticky-footer>`);
      expect(hidden.root.querySelector('.dda-footer-middle')).toBeNull();
    });

    it('renders no middle section when there are no logos', async () => {
      const page = await render(`<dda-sticky-footer></dda-sticky-footer>`);
      expect(page.root.querySelector('.dda-footer-middle')).toBeNull();
    });

    it('puts the 3.x ids on the links', async () => {
      const page = await render(
        `<dda-sticky-footer happiness-icon-src="h.svg" happiness-icon-id="dda-happiness-icon-button" accessibility-icon-src="a.svg" accessibility-icon-id="dda-04-icon-button"></dda-sticky-footer>`,
      );
      expect(page.root.querySelector('#dda-happiness-icon-button').tagName).toBe('A');
      expect(page.root.querySelector('#dda-04-icon-button').tagName).toBe('A');
    });

    it('uses the dark images with color-theme="dark", and the light image when no dark one is set', async () => {
      const page = await render(`<dda-sticky-footer color-theme="dark" happiness-icon-src="h.svg" happiness-icon-src-dark="h-dark.svg" ai-icon-src="ai.svg"></dda-sticky-footer>`);
      const srcs = Array.from(page.root.querySelectorAll('img')).map((i: HTMLImageElement) => i.getAttribute('src'));
      expect(srcs).toContain('h-dark.svg');
      expect(srcs).toContain('ai.svg');
    });
  });

  describe('3.x JSON lists', () => {
    const middle = JSON.stringify([
      { LogoTooltip: 'One', href: '/1', src: '1.svg', alt: 'One logo' },
      { LogoTooltip: 'Two', href: '/2', src: '2.svg', srcDark: '2d.svg', alt: 'Two logo' },
      { LogoTooltip: 'Three', href: '/3', src: '3.svg', alt: 'Three logo' },
      { LogoTooltip: 'Four', href: '/4', src: '4.svg', alt: 'Four logo' },
    ]);
    const right = JSON.stringify([
      { RightLinkTooltip: 'News', href: '/news', LinkText: 'Newsroom', IconFamily: 'material-icons', IconName: 'feed', itemId: 'news-link' },
      { RightLinkTooltip: 'Contact', href: '/contact', LinkText: 'Contact us', IconFamily: 'material-icons', IconName: 'call' },
    ]);

    it('renders any number of middle logos, replacing the fixed logo props', async () => {
      const page = await render(`<dda-sticky-footer first-logo-src="fixed.svg" middle-link='${middle}'></dda-sticky-footer>`);
      const imgs = Array.from(page.root.querySelectorAll('.dda-footer-middle img')) as HTMLImageElement[];
      expect(imgs.map(i => i.getAttribute('src'))).toEqual(['1.svg', '2.svg', '3.svg', '4.svg']);
      expect(imgs[0].getAttribute('alt')).toBe('One logo');
    });

    it('renders right links with a Material icon and text, replacing location and news', async () => {
      const page = await render(`<dda-sticky-footer location-logo-src="loc.svg" right-link='${right}'></dda-sticky-footer>`);
      const links = Array.from(page.root.querySelectorAll('.dda-footer-right a')) as HTMLAnchorElement[];
      expect(links).toHaveLength(2);
      expect(links[0].getAttribute('id')).toBe('news-link');
      expect(links[0].querySelector('i').textContent).toBe('feed');
      expect(links[0].querySelector('i').getAttribute('aria-hidden')).toBe('true');
      expect(links[0].querySelector('span').textContent).toBe('Newsroom');
      expect(links[0].getAttribute('aria-label')).toBeNull();
      expect(page.root.querySelector('img[src="loc.svg"]')).toBeNull();
    });

    it('accepts both lists as array properties', async () => {
      const page = await render(`<dda-sticky-footer></dda-sticky-footer>`);
      page.root.middleLink = JSON.parse(middle);
      page.root.rightLink = JSON.parse(right);
      await page.waitForChanges();
      expect(page.root.querySelectorAll('.dda-footer-middle li')).toHaveLength(4);
      expect(page.root.querySelectorAll('.dda-footer-right li')).toHaveLength(2);
    });

    it('ignores invalid JSON and keeps the fixed props', async () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const page = await render(`<dda-sticky-footer first-logo-src="fixed.svg" middle-link='[{'></dda-sticky-footer>`);
      expect(page.root.querySelector('.dda-footer-middle img').getAttribute('src')).toBe('fixed.svg');
      expect(warn).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    });
  });
});
