import { newE2EPage } from '@stencil/core/testing';

describe('dda-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button></dda-button>');

    const element = await page.find('dda-button');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button>Click me</dda-button>');

    const element = await page.find('dda-button');
    expect(element.textContent).toEqual('Click me');
  });

  // shadow: false, so the button is in the light DOM. A `>>>` piercing
  // selector finds nothing here. The prop is custom_class, not custom-class.
  it('renders with custom class', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button custom_class="custom-class"></dda-button>');

    const button = await page.find('dda-button button');
    expect(button).toHaveClass('custom-class');
  });

  it('triggers click event', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button>Click me</dda-button>');

    // The spy must be attached after setContent, because setContent
    // replaces the document and discards any earlier listener.
    const clickSpy = await page.spyOnEvent('click');

    const button = await page.find('dda-button button');
    await button.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });

  // Task 9d: F-019 (default-primary, error-primary — malformed `outline: <color>`
  // shorthand resets outline-style to `none`), F-020 (onsurface-primary — no
  // `:focus` outline declared at all), F-021 (disabled-styled button — no focus
  // rule of any kind). A real keyboard Tab, not a synthetic `.focus()` call, is
  // required for `:focus-visible` to match.
  const variants = ['default-primary', 'error-primary', 'onsurface-primary', 'disabled'];

  for (const button_color of variants) {
    it(`shows no focus ring before focus (${button_color})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-button button_color="${button_color}">Click me</dda-button>`);

      const resting = await page.evaluate(() => {
        const btn = document.querySelector('dda-button button') as HTMLElement;
        const s = getComputedStyle(btn);
        return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
      });

      expect(resting.outlineStyle).toBe('none');
      expect(resting.boxShadow).toBe('none');
    });

    it(`shows a real focus ring under keyboard focus (${button_color})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-button button_color="${button_color}">Click me</dda-button>`);

      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        return { tag: el.tagName, boxShadow: s.boxShadow, outlineStyle: s.outlineStyle };
      });

      expect(focused).not.toBeNull();
      expect(focused.tag).toBe('BUTTON');
      // The fix is a box-shadow ring on `:focus-visible`, not the malformed
      // `outline: <color>` shorthand — assert the property that actually renders.
      expect(focused.boxShadow).not.toBe('none');
    });
  }

  // Task 9d review follow-up: btn-color-default-link/error-link/onsurface-
  // link already had a working native `outline: auto:focus` before this
  // task and were never part of F-019/F-020/F-021 - dda-button.css:41-56
  // explicitly suppresses the shared box-shadow ring for them so the
  // family doesn't end up with two focus treatments layered at once. This
  // is the test that would have caught the original review finding (the
  // `variants` array above omitted the -link colours entirely).
  const linkVariants = ['default-link', 'error-link', 'onsurface-link'];

  for (const button_color of linkVariants) {
    it(`shows no focus ring before focus (${button_color})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-button button_color="${button_color}">Click me</dda-button>`);

      const resting = await page.evaluate(() => {
        const btn = document.querySelector('dda-button button') as HTMLElement;
        const s = getComputedStyle(btn);
        return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
      });

      expect(resting.outlineStyle).toBe('none');
      expect(resting.boxShadow).toBe('none');
    });

    it(`shows only the native outline under keyboard focus, not the shared ring (${button_color})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-button button_color="${button_color}">Click me</dda-button>`);

      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        return {
          tag: el.tagName,
          boxShadow: s.boxShadow,
          outlineStyle: s.outlineStyle,
          outlineWidth: parseFloat(s.outlineWidth),
        };
      });

      expect(focused).not.toBeNull();
      expect(focused.tag).toBe('BUTTON');
      // The native `outline: auto` ring is the only indicator here - the
      // shared box-shadow ring must stay suppressed, or this variant would
      // show two focus treatments at once.
      expect(focused.outlineStyle).not.toBe('none');
      expect(focused.outlineWidth).toBeGreaterThan(0);
      expect(focused.boxShadow).toBe('none');
    });
  }
});
