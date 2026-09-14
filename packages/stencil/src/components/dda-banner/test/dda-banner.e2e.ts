import { newE2EPage } from '@stencil/core/testing';

const SLIDES = JSON.stringify([
  { image: '/assets/a.jpg', title: 'Slide A', subtitle: 'Sub A', link: '/a' },
  { image: '/assets/b.jpg', title: 'Slide B', subtitle: 'Sub B', link: '/b' },
]);

// dda-banner has no .stories.tsx (confirmed by directory listing: only
// dda-banner.css, dda-banner.tsx and readme.md exist in this folder). Per
// F-039, that means the axe sweep and the WCAG 2.5.8/2.1.1 checks - which
// only ever visit stories - have never run against this component; its
// component-matrix row reads N/A, not PASS, for exactly that reason. This
// file is therefore the only automated coverage dda-banner gets in this
// repo, so it is deliberately more thorough than a typical "renders" check.
//
// dda-banner is also the only component in the codebase built with
// `shadow: true` (every other dda-* component uses `shadow: false`), so
// its content lives behind a real shadow root and must be queried through
// element.shadowRoot / the `>>>` piercing selector, not a plain selector.
describe('dda-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const el = await page.find('dda-banner');
    expect(el).toHaveClass('hydrated');
  });

  it('attaches a real shadow root (the one shadow: true component in this library)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const hasShadowRoot = await page.evaluate(() => !!document.querySelector('dda-banner').shadowRoot);
    expect(hasShadowRoot).toBe(true);
  });

  // Asserts the actual content a user would see: one slide per parsed
  // entry, each carrying its own image src and a non-empty accessible
  // alt text sourced from the slide's title - not just an element count.
  it('renders one slide per parsed entry, each with its own image src and alt text', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const images = await page.evaluate(() => {
      const root = document.querySelector('dda-banner').shadowRoot;
      return Array.from(root.querySelectorAll('.dda-banner-slide img')).map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
      }));
    });

    expect(images).toEqual([
      { src: '/assets/a.jpg', alt: 'Slide A' },
      { src: '/assets/b.jpg', alt: 'Slide B' },
    ]);
  });

  it('sizes each slide image from the slider_width and slider_height props', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}' slider_width="480px" slider_height="240px"></dda-banner>`);

    const sizes = await page.evaluate(() => {
      const root = document.querySelector('dda-banner').shadowRoot;
      return Array.from(root.querySelectorAll('.dda-banner-slide img')).map(img => ({
        width: (img as HTMLImageElement).style.width,
        height: (img as HTMLImageElement).style.height,
      }));
    });

    expect(sizes).toEqual([
      { width: '480px', height: '240px' },
      { width: '480px', height: '240px' },
    ]);
  });

  it('lays slides out in a horizontal, scroll-snapping row', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const layout = await page.evaluate(() => {
      const root = document.querySelector('dda-banner').shadowRoot;
      const slider = getComputedStyle(root.querySelector('.dda-banner-slider'));
      const [a, b] = Array.from(root.querySelectorAll('.dda-banner-slide')).map(s => s.getBoundingClientRect());
      return { display: slider.display, snap: slider.scrollSnapType, sameRow: a.top === b.top && b.left > a.left };
    });

    expect(layout).toEqual({ display: 'flex', snap: 'x mandatory', sameRow: true });
  });

  it('does not log an error when the slides attribute is missing', async () => {
    const page = await newE2EPage();
    const errors: string[] = [];
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await page.setContent('<dda-banner></dda-banner>');
    await page.waitForChanges();

    expect(errors).toEqual([]);
  });

  // F-026: the component has no autoplay, no navigation controls, and no
  // per-slide link (the parsed `link` field is never rendered). Its only
  // interaction is scrolling the overflow row, so the row itself is the one
  // keyboard focus stop (axe scrollable-region-focusable, WCAG 2.1.1): a
  // named region with tabindex="0" that arrow keys scroll natively.
  it('has exactly one keyboard focus stop: the slider region', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const focusables = await page.evaluate(() => {
      const root = document.querySelector('dda-banner').shadowRoot;
      return Array.from(root.querySelectorAll('a, button, [tabindex]')).map(el => el.classList.contains('dda-banner-slider'));
    });
    expect(focusables).toEqual([true]);
  });

  it('makes the slider a focusable, named region', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const slider = await page.evaluate(() => {
      const el = document.querySelector('dda-banner').shadowRoot.querySelector('.dda-banner-slider');
      return { tabindex: el.getAttribute('tabindex'), role: el.getAttribute('role'), label: el.getAttribute('aria-label') };
    });
    expect(slider).toEqual({ tabindex: '0', role: 'region', label: 'Slides' });
  });

  it('names the slider region from aria_label', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}' aria_label="Service centres"></dda-banner>`);

    const label = await page.evaluate(() => document.querySelector('dda-banner').shadowRoot.querySelector('.dda-banner-slider').getAttribute('aria-label'));
    expect(label).toBe('Service centres');
  });

  it('does not make the host itself focusable', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const host = await page.evaluate(() => {
      const el = document.querySelector('dda-banner') as HTMLElement;
      return { tabIndex: el.tabIndex, tabindexAttr: el.getAttribute('tabindex'), role: el.getAttribute('role') };
    });
    expect(host).toEqual({ tabIndex: -1, tabindexAttr: null, role: null });
  });

  it('focuses the slider on the first Tab press and shows a focus ring', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    await page.keyboard.press('Tab');
    await page.waitForChanges();

    const focus = await page.evaluate(() => {
      const host = document.querySelector('dda-banner');
      const active = host.shadowRoot.activeElement as HTMLElement | null;
      const style = active ? getComputedStyle(active) : null;
      return {
        hostIsActive: document.activeElement === host,
        activeIsSlider: !!active && active.classList.contains('dda-banner-slider'),
        focusVisible: active ? active.matches(':focus-visible') : false,
        ringVisible: !!style && (style.boxShadow !== 'none' || style.outlineStyle !== 'none'),
      };
    });
    expect(focus).toEqual({ hostIsActive: true, activeIsSlider: true, focusVisible: true, ringVisible: true });
  });

  it('draws the design-system ring box-shadow on the keyboard-focused slider', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    await page.keyboard.press('Tab');
    await page.waitForChanges();

    const boxShadow = await page.evaluate(() => {
      const slider = document.querySelector('dda-banner').shadowRoot.querySelector('.dda-banner-slider');
      return getComputedStyle(slider).boxShadow;
    });
    expect(boxShadow).not.toBe('none');
    expect(boxShadow).toContain('rgb(255, 255, 255)');
  });

  // componentWillLoad guards JSON.parse(this.slides): a missing or invalid
  // slides attribute renders an empty banner instead of throwing.
  it('renders no slides and does not crash the page when the slides attribute is missing', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-banner></dda-banner>');

    const el = await page.find('dda-banner');
    expect(el).toHaveClass('hydrated');

    const slideCount = await page.evaluate(() => document.querySelector('dda-banner').shadowRoot.querySelectorAll('.dda-banner-slide').length);
    expect(slideCount).toBe(0);
  });
});
