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

describe('dda-footer heading level', () => {
  const titleTag = async (attrs = '') => {
    const page = await newE2EPage();
    await page.setContent(`<dda-footer footer-title="Stay in touch" ${attrs}></dda-footer>`);
    await page.waitForChanges();
    return page.evaluate(() => {
      const title = document.querySelector('dda-footer .dda-fs-display-sm');
      return { tag: title.tagName.toLowerCase(), text: title.textContent, className: title.className };
    });
  };

  it('renders the title as h4 by default', async () => {
    expect(await titleTag()).toEqual({ tag: 'h4', text: 'Stay in touch', className: 'dda-fs-display-sm dda-fw-700 dda-color-black' });
  });

  it('renders the title at heading_level, with the same classes', async () => {
    expect(await titleTag('heading_level="2"')).toEqual({ tag: 'h2', text: 'Stay in touch', className: 'dda-fs-display-sm dda-fw-700 dda-color-black' });
  });

  it('clamps heading_level to 1-6', async () => {
    expect((await titleTag('heading_level="9"')).tag).toBe('h6');
    expect((await titleTag('heading_level="0"')).tag).toBe('h1');
  });

  it('keeps the same title size at every heading level', async () => {
    const fontSize = async (attrs: string) => {
      const page = await newE2EPage();
      await page.setContent(`<dda-footer footer-title="Stay in touch" ${attrs}></dda-footer>`);
      await page.waitForChanges();
      return page.evaluate(() => getComputedStyle(document.querySelector('dda-footer .dda-fs-display-sm')).fontSize);
    };

    expect(await fontSize('heading_level="2"')).toBe(await fontSize(''));
  });
});
