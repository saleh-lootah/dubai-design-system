import { newSpecPage } from '@stencil/core/testing';
import { DdaHeader } from '../dda-header';

// Spec pages load at "/", the path that used to force the transparent style.
const render = (html: string) => newSpecPage({ components: [DdaHeader], html });

describe('dda-header', () => {
  it('does not make itself transparent from the URL', async () => {
    const page = await render(`<dda-header></dda-header>`);

    expect(page.root.querySelector('header')).not.toHaveClass('transparent');
  });

  it('renders colored and white logos so page CSS can pick one', async () => {
    const page = await render(`
      <dda-header
        first-logo-src="first.svg" first-logo-white-src="first-white.svg" first-logo-alt="First"
        second-logo-src="second.svg" second-logo-white-src="second-white.svg" second-logo-alt="Second">
      </dda-header>`);

    const logo = (sel: string) => page.root.querySelector(`.dda-head-logo ${sel}`).getAttribute('src');
    expect(logo('.govt-logo .logo-colored')).toBe('first.svg');
    expect(logo('.govt-logo .logo-white')).toBe('first-white.svg');
    expect(logo('.entt-logo .logo-colored')).toBe('second.svg');
    expect(logo('.entt-logo .logo-white')).toBe('second-white.svg');
  });
});
