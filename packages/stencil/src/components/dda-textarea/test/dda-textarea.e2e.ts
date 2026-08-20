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

// F-015: enable_rich_editor's ternary swaps the labelled <textarea> for a
// Quill <div id="editor">, so the visible <label for> targets an element
// that no longer exists and the rich editor has no accessible name at all.
describe('dda-textarea F-015 rich editor labelling', () => {
  it('plain mode: the label still targets a real element (control case)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input" label="Notes"></dda-textarea>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-textarea label') as HTMLLabelElement;
      const target = label ? document.getElementById(label.htmlFor) : null;
      return { for: label?.htmlFor, targetExists: !!target, targetTag: target?.tagName };
    });

    expect(result.targetExists).toBe(true);
    expect(result.targetTag).toBe('TEXTAREA');
  });

  it('rich-editor mode: the element that actually receives focus resolves an accessible name, description, and invalid state', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-textarea input_id="input" label="Notes" helper_text="Formatting supported" error_message="Required" enable_rich_editor="true"></dda-textarea>'
    );
    // Quill mounts asynchronously in componentDidLoad().
    await page.waitForSelector('.ql-editor');
    await page.waitForChanges();

    // Quill does not make the container passed to `new Quill(...)` editable
    // — it mounts its real editable surface as a child `.ql-editor` div with
    // contenteditable="true", which is what Tab actually lands on (see the
    // focus-indicator suite above for the same Tab-order caveat). Assert
    // against document.activeElement, not the container, so this test
    // follows the user rather than the markup.
    await page.keyboard.press('Tab');
    await page.$eval('.ql-editor', (el: HTMLElement) => el.focus());

    const result = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const labelledbyIds = (el.getAttribute('aria-labelledby') || '').split(' ').filter(Boolean);
      const describedbyIds = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return {
        cls: el.className,
        role: el.getAttribute('role'),
        ariaMultiline: el.getAttribute('aria-multiline'),
        ariaInvalid: el.getAttribute('aria-invalid'),
        labelledbyIds,
        labelledbyText: labelledbyIds.map((id) => document.getElementById(id)?.textContent?.trim()),
        describedbyIds,
        describedbyText: describedbyIds.map((id) => document.getElementById(id)?.textContent?.trim()),
      };
    });

    expect(result).not.toBeNull();
    expect(result.cls).toContain('ql-editor');
    expect(result.role).toBe('textbox');
    expect(result.ariaMultiline).toBe('true');
    expect(result.ariaInvalid).toBe('true');
    expect(result.labelledbyIds.length).toBeGreaterThan(0);
    expect(result.labelledbyText).toContain('Notes');
    expect(result.describedbyIds.length).toBe(2);
    expect(result.describedbyText[0]).toContain('Formatting supported');
    expect(result.describedbyText[1]).toContain('Required');
  });
});

// F-016: same systemic error-labelling gap as dda-input.
describe('dda-textarea F-016 error labelling', () => {
  it('has no aria-invalid/aria-describedby when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input"></dda-textarea>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-textarea textarea');
      return { invalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an existing error element with the error text and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="input" error_message="Too long"></dda-textarea>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-textarea textarea');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id));
      return {
        invalid: el.getAttribute('aria-invalid'),
        ids,
        allExist: texts.every((t) => !!t),
        containsError: texts.some((t) => t?.textContent?.includes('Too long')),
      };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.allExist).toBe(true);
    expect(result.containsError).toBe(true);
  });
});
