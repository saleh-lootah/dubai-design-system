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
});
