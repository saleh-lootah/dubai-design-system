import { newE2EPage } from '@stencil/core/testing';

// Task 9d.
// - F-019: show_button=true renders a `.dda-btn.btn-color-default-primary`
//   search button (dda-search-input.tsx:46), sharing dda-button.css's
//   malformed `outline: <color>` shorthand.
// - F-021: has_error/input_status=disabled route the real <input> through
//   the same `.dda-validation-error`/`.dda-input-disabled` box-shadow:none
//   clobber as dda-input.
describe('dda-search-input focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input button_id="button"></dda-search-input>');

    const element = await page.find('dda-search-input');
    expect(element).toHaveClass('hydrated');
  });

  it('shows a real focus ring on the slotted search button (show_button)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input button_id="button" show_button="true"></dda-search-input>');

    // Tab order: text input, then the close button, then the search button.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('btn-color-default-primary');
    expect(focused.boxShadow).not.toBe('none');
  });

  it('shows no focus ring before focus (has_error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input button_id="button" has_error="true"></dda-search-input>');

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-search-input input') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (has_error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input button_id="button" has_error="true"></dda-search-input>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { tag: el.tagName, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.tag).toBe('INPUT');
    expect(focused.boxShadow).not.toBe('none');
  });

  it('shows a real focus ring under keyboard focus (input_status=disabled)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input button_id="button" input_status="disabled"></dda-search-input>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { tag: el.tagName, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.tag).toBe('INPUT');
    expect(focused.boxShadow).not.toBe('none');
  });
});
