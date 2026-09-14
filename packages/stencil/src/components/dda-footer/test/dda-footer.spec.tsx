import { newSpecPage } from '@stencil/core/testing';
import { DdaFooter } from '../dda-footer';

const render = (html: string) => newSpecPage({ components: [DdaFooter], html });

describe('dda-footer', () => {
  it('renders the logo description from the logo-description attribute', async () => {
    const page = await render(`<dda-footer logo-description="Government services in one place."></dda-footer>`);

    expect(page.root.querySelector('img.entt-logo + p').textContent.trim()).toBe('Government services in one place.');
  });

  it('renders no placeholder text when logo-description is not set', async () => {
    const page = await render(`<dda-footer></dda-footer>`);

    expect(page.root.textContent).not.toContain('Figma');
    expect(page.root.querySelector('img.entt-logo + p')).toBeNull();
  });
});
