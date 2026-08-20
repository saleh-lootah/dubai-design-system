import { newE2EPage } from '@stencil/core/testing';

// Task 9d — F-021: same `.dda-validation-error`/`.dda-input-disabled`
// `box-shadow: none` clobber as dda-input, plus a third, distinct case —
// the rich-text editor's `.ql-editor` (Quill) carries no dda-* class at all
// and has never had any focus rule.
describe('dda-textarea focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input"></dda-textarea>');

    const element = await page.find('dda-textarea');
    expect(element).toHaveClass('hydrated');
  });

  it('shows no focus ring before focus (validation_type=error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input" validation_type="error"></dda-textarea>');

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-textarea textarea') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (validation_type=error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input" validation_type="error"></dda-textarea>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { tag: el.tagName, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.tag).toBe('TEXTAREA');
    expect(focused.boxShadow).not.toBe('none');
  });

  it('shows a real focus ring under keyboard focus (input_status=disabled)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input" input_status="disabled"></dda-textarea>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { tag: el.tagName, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.tag).toBe('TEXTAREA');
    expect(focused.boxShadow).not.toBe('none');
  });

  it('shows a real focus ring under keyboard focus (rich editor)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input" enable_rich_editor="true"></dda-textarea>');
    // Quill mounts asynchronously in componentDidLoad().
    await page.waitForSelector('.ql-editor');
    await page.waitForChanges();

    // Quill's own toolbar (bold/italic/color pickers, ...) sits ahead of the
    // editable region in Tab order and its color/font pickers add their own
    // Tab stops once opened, so a fixed-count Tab loop is not reliable here.
    // A real Tab press first establishes keyboard input modality; Chromium's
    // `:focus-visible` heuristic keys off that modality, not off *how* the
    // specific element was focused, so following it with a direct .focus()
    // on the editor still reflects genuine keyboard-triggered focus.
    await page.keyboard.press('Tab');
    await page.$eval('.ql-editor', (el: HTMLElement) => el.focus());
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('ql-editor');
    expect(focused.boxShadow).not.toBe('none');
  });
});
