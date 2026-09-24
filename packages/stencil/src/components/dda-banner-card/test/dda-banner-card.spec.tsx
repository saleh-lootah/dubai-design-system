import { newSpecPage } from '@stencil/core/testing';
import { DdaBannerCard } from '../dda-banner-card';

const render = (html: string) => newSpecPage({ components: [DdaBannerCard], html });

describe('dda-banner-card', () => {
  it('is a link when it has a URL', async () => {
    const page = await render(
      `<dda-banner-card banner_card_href="/about" image_src="i.svg" image_alt="icon" banner_card_title="About" banner_card_description="Who we are"></dda-banner-card>`,
    );
    const link = page.root.querySelector('a.dda-banner-card.link-item') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/about');
    expect(link.querySelector('.title').textContent).toBe('About');
    expect(link.querySelector('.subtitle').textContent).toBe('Who we are');
    const img = link.querySelector('img');
    expect(img.getAttribute('alt')).toBe('');
    expect(img.getAttribute('aria-hidden')).toBe('true');
  });

  it('accepts the 3.x banner_card_url', async () => {
    const page = await render(`<dda-banner-card banner_card_url="/data" banner_card_title="Data"></dda-banner-card>`);
    expect(page.root.querySelector('a').getAttribute('href')).toBe('/data');
  });

  it('is a button with value and name when it has no URL', async () => {
    const page = await render(`<dda-banner-card banner_card_title="Pick" banner_card_value="v1" banner_card_name="n1" banner_card_id="c1"></dda-banner-card>`);
    const button = page.root.querySelector('button.dda-banner-card') as HTMLButtonElement;
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('value')).toBe('v1');
    expect(button.getAttribute('name')).toBe('n1');
    expect(button.getAttribute('id')).toBe('c1');
  });

  it('renders no description element when the description is empty', async () => {
    const page = await render(`<dda-banner-card banner_card_href="/x" banner_card_title="X" banner_card_description=""></dda-banner-card>`);
    expect(page.root.querySelector('.subtitle')).toBeNull();
  });
});
