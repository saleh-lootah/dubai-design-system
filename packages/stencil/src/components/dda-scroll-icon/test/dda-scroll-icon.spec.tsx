import { newSpecPage } from '@stencil/core/testing';
import { DdaScrollIcon } from '../dda-scroll-icon';

const render = (html: string) => newSpecPage({ components: [DdaScrollIcon], html });

describe('dda-scroll-icon', () => {
  it('renders a small white icon by default, hidden from assistive technology', async () => {
    const page = await render(`<dda-scroll-icon></dda-scroll-icon>`);
    expect(page.root.getAttribute('aria-hidden')).toBe('true');
    const icon = page.root.querySelector('.dda-scroll-icon-scroll');
    expect(icon).toHaveClass('scroll-icon-size-sm');
    expect(icon).toHaveClass('scroll-icon-color-white');
    expect(icon.querySelector('.dda-scroll-icon-scroll-dot')).not.toBeNull();
  });

  it('uses the 3.x size and colour attributes', async () => {
    const page = await render(`<dda-scroll-icon scroll_icon_size="lg" scroll_icon_color="black" custom_class="extra"></dda-scroll-icon>`);
    const icon = page.root.querySelector('.dda-scroll-icon-scroll');
    expect(icon).toHaveClass('scroll-icon-size-lg');
    expect(icon).toHaveClass('scroll-icon-color-black');
    expect(icon).toHaveClass('extra');
  });
});
