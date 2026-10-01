import { newE2EPage } from '@stencil/core/testing';

// legacy-compat.css sized headings with --font-h1…--font-h6, which nothing defined, and marked
// them !important, so every heading and .dda-h* class rendered at body size.
describe('global heading styles', () => {
  const fontSize = (page, selector: string) => page.evaluate(sel => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize), selector);

  it('sizes h1–h6 from the type scale instead of body size', async () => {
    const page = await newE2EPage();
    await page.setContent('<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4><h5>E</h5><h6>F</h6><p id="body">G</p>');

    const sizes = await page.evaluate(() => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '#body'].map(sel => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize)));
    const [h1, h2, h3, h4, h5, h6, body] = sizes;

    expect(h6).toBeGreaterThan(body);
    expect([h1, h2, h3, h4, h5]).toEqual([...[h1, h2, h3, h4, h5]].sort((a, b) => b - a));
    expect(h1).toBeGreaterThan(h2);
    expect(h5).toBeGreaterThan(h6);
  });

  it('sizes the .dda-h1 class like an h1', async () => {
    const page = await newE2EPage();
    await page.setContent('<h1 id="tag">A</h1><p id="cls" class="dda-h1">B</p>');

    expect(await fontSize(page, '#cls')).toBe(await fontSize(page, '#tag'));
  });

  it('lets a component class set the size of a heading element', async () => {
    const page = await newE2EPage();
    await page.setContent('<h2 id="plain">A</h2><h2 id="classed" class="dda-fs-body-lg">B</h2><p id="body">C</p>');

    expect(await fontSize(page, '#classed')).toBe(await fontSize(page, '#body'));
    expect(await fontSize(page, '#plain')).toBeGreaterThan(await fontSize(page, '#classed'));
  });

  it('lets a site change heading sizes through the tokens', async () => {
    const page = await newE2EPage();
    // --dda-h1 drives h1 and .dda-h1; the legacy --font-h1 still drives the legacy .h1 class.
    await page.setContent('<style>:root { --dda-h1: 44px; --font-h1: 40px; }</style><h1 id="tag">A</h1><p id="legacy" class="h1">B</p>');

    expect(await fontSize(page, '#tag')).toBe(44);
    expect(await fontSize(page, '#legacy')).toBe(40);
  });

  it('gives legacy font-weight classes a real weight', async () => {
    const page = await newE2EPage();
    await page.setContent('<h1 id="bold" class="Bold">A</h1>');

    expect(await page.evaluate(() => getComputedStyle(document.querySelector('#bold')).fontWeight)).toBe('700');
  });
});

// 3.x (3.11.3 to 3.12.10) defined these legacy tokens on :root with a responsive scale (4 breakpoints). 5.x mapped
// them to the larger, fixed --dda-h* sizes instead, so 3.x pages that use .h1, .display, .small
// and the like grew. The compatibility layer must give them the 3.x values.
describe('legacy 3.x type tokens', () => {
  const tokens = async (width: number) => {
    const page = await newE2EPage();
    await page.setViewport({ width, height: 800 });
    await page.setContent('<p id="legacy" class="h1">A</p>');
    return page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const get = (name: string) => root.getPropertyValue(name).trim();
      return {
        display: get('--font-display'),
        h1: get('--font-h1'),
        h6: get('--font-h6'),
        body: get('--font-body'),
        lineH1: get('--line-height-h1'),
        lineBody: get('--line-height-body'),
        gapLg: get('--gap-lg'),
        legacyH1: getComputedStyle(document.querySelector('#legacy')).fontSize,
      };
    });
  };

  it('uses the 3.x mobile scale below 600px', async () => {
    expect(await tokens(390)).toEqual({ display: '3rem', h1: '2rem', h6: '1rem', body: '0.875rem', lineH1: '3rem', lineBody: '1.25rem', gapLg: '1rem', legacyH1: '32px' });
  });

  it('uses the 3.x tablet scale from 600px', async () => {
    expect(await tokens(800)).toEqual({ display: '3.75rem', h1: '2.5rem', h6: '1.125rem', body: '1rem', lineH1: '3rem', lineBody: '1.5rem', gapLg: '1rem', legacyH1: '40px' });
  });

  it('uses the 3.x desktop scale from 1024px', async () => {
    expect(await tokens(1280)).toEqual({ display: '4.25rem', h1: '3rem', h6: '1.25rem', body: '1rem', lineH1: '3.5rem', lineBody: '1.5rem', gapLg: '1rem', legacyH1: '48px' });
  });

  it('uses the 3.x wide scale from 1440px', async () => {
    expect(await tokens(1600)).toEqual({
      display: '4.75rem',
      h1: '3.375rem',
      h6: '1.375rem',
      body: '1.125rem',
      lineH1: '4rem',
      lineBody: '1.75rem',
      gapLg: '1rem',
      legacyH1: '54px',
    });
  });
});
