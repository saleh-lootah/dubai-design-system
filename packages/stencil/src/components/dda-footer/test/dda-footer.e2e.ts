import { newE2EPage } from '@stencil/core/testing';

describe('dda-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-footer></dda-footer>');

    const el = await page.find('dda-footer');
    expect(el).toHaveClass('hydrated');
  });

  // F-005: dda-footer shipped with shadow: true and a 0-byte dda-footer.css, so no CSS
  // — local or global — could ever reach the markup. Every utility class the template
  // depends on (dda-container, dda-flex, dda-row, ...) is defined only in the
  // unreachable global/global.css. The component rendered as unstyled raw HTML.
  //
  // A test that only checks the element exists would pass against that broken state,
  // so this asserts a genuine global.css rule is actually in effect on the markup.
  it('renders in the light DOM so global stylesheets can reach it (no shadow root)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-footer></dda-footer>');

    const hasShadowRoot = await page.evaluate(() => {
      const el = document.querySelector('dda-footer');
      return !!(el && el.shadowRoot);
    });

    expect(hasShadowRoot).toBe(false);
  });

  it('applies the global .dda-flex utility (display: flex) to its own markup', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-footer></dda-footer>');

    const flexEl = await page.find('dda-footer .dda-flex');
    expect(flexEl).not.toBeNull();

    const display = await page.evaluate(() => {
      const el = document.querySelector('dda-footer .dda-flex');
      return el ? getComputedStyle(el).display : null;
    });

    expect(display).toBe('flex');
  });

  it('applies the website-footer template rule (.WB-footer background) to its root', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-footer></dda-footer>');

    const bg = await page.evaluate(() => {
      const el = document.querySelector('dda-footer .WB-footer');
      return el ? getComputedStyle(el).backgroundColor : null;
    });

    // global/templates/website-footer.css sets `.WB-footer { background-color: var(--dda-surface-100); }`
    // Unstyled/default would be 'rgba(0, 0, 0, 0)' (transparent).
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBeNull();
  });
});
