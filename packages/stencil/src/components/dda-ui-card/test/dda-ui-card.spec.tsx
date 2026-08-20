import { newSpecPage } from '@stencil/core/testing';
import { DdaUiCard } from '../dda-ui-card';

// dda-ui-card uses shadow: false, so it renders into the light DOM.
const render = (html: string) => newSpecPage({ components: [DdaUiCard], html });

describe('dda-ui-card', () => {
  it('renders the card wrapper', async () => {
    const page = await render(`<dda-ui-card></dda-ui-card>`);

    const card = page.root.querySelector('.dda-card');
    expect(card).not.toBeNull();
    expect(card.querySelector('.dda-card-body')).not.toBeNull();
  });

  it('renders the title and the subtitle', async () => {
    const page = await render(`<dda-ui-card maintitle="Main title" subtitle="Subtitle"></dda-ui-card>`);

    expect(page.root.querySelector('.dda-card-title').textContent).toBe('Main title');
    expect(page.root.querySelector('.dda-card-text-muted').textContent).toBe('Subtitle');
  });

  it('omits the title and the subtitle when they are empty', async () => {
    const page = await render(`<dda-ui-card></dda-ui-card>`);

    expect(page.root.querySelector('.dda-card-title')).toBeNull();
    expect(page.root.querySelector('.dda-card-text-muted')).toBeNull();
  });

  it('renders an icon', async () => {
    const page = await render(`<dda-ui-card icon="home"></dda-ui-card>`);

    const icon = page.root.querySelector('.dda-card-icon i');
    expect(icon.className).toBe('material-icons');
    expect(icon.textContent).toBe('home');
  });

  it('renders an image with the title as its alt text', async () => {
    const page = await render(`<dda-ui-card image="/img/a.png" maintitle="Main title"></dda-ui-card>`);

    const img = page.root.querySelector('.dda-card-icon img');
    expect(img.getAttribute('src')).toBe('/img/a.png');
    expect(img.getAttribute('alt')).toBe('Main title');
  });

  it('renders a link with the default link icon', async () => {
    const page = await render(`<dda-ui-card link="/more" linktext="Read more"></dda-ui-card>`);

    const link = page.root.querySelector('.dda-card-link');
    expect(link.getAttribute('href')).toBe('/more');
    expect(link.textContent).toContain('Read more');
    expect(link.querySelector('i').textContent).toBe('arrow_forward');
  });

  it('omits the built-in content when the type is custom', async () => {
    const page = await render(`<dda-ui-card type="custom" maintitle="Main title"></dda-ui-card>`);

    expect(page.root.querySelector('.dda-card-body')).not.toBeNull();
    expect(page.root.querySelector('.dda-card-title')).toBeNull();
  });
});
