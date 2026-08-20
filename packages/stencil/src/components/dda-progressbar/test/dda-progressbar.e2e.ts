import { newE2EPage } from '@stencil/core/testing';

// F-013: dda-progressbar had no `role`, `aria-valuenow`, `aria-valuemin`, or
// `aria-valuemax` anywhere — the bar's progress was conveyed only through
// inline `width`. Repair: role="progressbar" on the bar track, with the
// value attributes bound to the real `progress` prop, checked across
// several values (not just one) so a stale/hardcoded value can't pass.

describe('dda-progressbar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-progressbar progress="40"></dda-progressbar>');

    const el = await page.find('dda-progressbar');
    expect(el).toHaveClass('hydrated');
  });

  it('has role="progressbar" with min/max bounds on the bar track', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-progressbar progress="40"></dda-progressbar>');

    const bar = await page.find('dda-progressbar .dda-progress-bar');
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('tracks aria-valuenow to the real progress prop across several values', async () => {
    // Separate pages per value — reusing one page across repeated
    // setContent() calls races Stencil's request interception in this
    // Puppeteer version ("Request is already handled!").
    for (const value of [0, 37, 100]) {
      const page = await newE2EPage();
      await page.setContent(`<dda-progressbar progress="${value}"></dda-progressbar>`);

      const bar = await page.find('dda-progressbar .dda-progress-bar');
      expect(bar.getAttribute('aria-valuenow')).toBe(`${value}`);
    }
  });

  it('updates aria-valuenow live when the progress prop changes on an existing instance', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-progressbar progress="10"></dda-progressbar>');

    const el = await page.find('dda-progressbar');
    el.setProperty('progress', 65);
    await page.waitForChanges();

    const bar = await page.find('dda-progressbar .dda-progress-bar');
    expect(bar.getAttribute('aria-valuenow')).toBe('65');
  });

  it('defaults aria-valuenow to 0 when no progress prop is given', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-progressbar></dda-progressbar>');

    const bar = await page.find('dda-progressbar .dda-progress-bar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
  });
});
