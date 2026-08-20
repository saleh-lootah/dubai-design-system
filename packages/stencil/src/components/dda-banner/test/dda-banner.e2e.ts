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

  // F-026: the component has no autoplay, no navigation controls, and no
  // interaction model of any kind - each slide's `link` field (present in
  // the parsed-slide type) is never rendered as an anchor or button. There
  // is nothing interactive to reach with a keyboard. This test documents
  // that real, current state (a real defect, already tracked - not fixed
  // here) rather than asserting a keyboard operation the component does
  // not implement.
  it('has no interactive element for a keyboard to reach (documents F-026: no interaction model)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-banner slides='${SLIDES}'></dda-banner>`);

    const interactiveCount = await page.evaluate(() => {
      const root = document.querySelector('dda-banner').shadowRoot;
      return root.querySelectorAll('a, button, [tabindex]').length;
    });
    expect(interactiveCount).toBe(0);
  });

  // componentWillLoad calls JSON.parse(this.slides) with no guard (unlike
  // dda-breadcrumb's equivalent, which checks first). With no slides
  // attribute the parse throws internally; Stencil's lazy-loader swallows
  // it (logged as a console error) rather than crashing the page, and the
  // banner is left permanently empty. Documented as real behaviour.
  it('renders no slides and does not crash the page when the slides attribute is missing', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-banner></dda-banner>');

    const el = await page.find('dda-banner');
    expect(el).toHaveClass('hydrated');

    const slideCount = await page.evaluate(() => document.querySelector('dda-banner').shadowRoot.querySelectorAll('.dda-banner-slide').length);
    expect(slideCount).toBe(0);
  });
});
