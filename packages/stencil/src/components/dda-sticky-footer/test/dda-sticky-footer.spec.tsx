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
});
