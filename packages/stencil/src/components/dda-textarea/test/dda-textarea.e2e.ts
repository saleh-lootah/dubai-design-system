import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';
import { readPlaceholderColors } from '../../../utils/placeholder-color';

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

// WCAG 1.1.1: the helper/error "info" icon ligature was read as part of the
// text that aria-describedby points at.
describe('dda-textarea decorative icons', () => {
  it('hides every Material icon from assistive technology', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-textarea input_id="input" helper_text="Keep it short" max_characters="100"></dda-textarea>`);

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-textarea i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });
});

// WCAG 1.4.3: the global `::placeholder` colour (#8E9191) was 3.18:1 on the
// white field. input.css now uses --dda-on-surface-variant-40 on the field.
// Chromium's getComputedStyle(el, '::placeholder') returns the element's own
// colour, so readPlaceholderColors resolves the winning ::placeholder rule.
describe('dda-textarea placeholder contrast (WCAG 1.4.3)', () => {
  for (const theme of [undefined, 'dark'] as const) {
    const label = theme ? 'dark' : 'light';

    it(`placeholder clears 4.5:1 against the field background in ${label} theme`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-textarea input_id="input" placeholder="Enter text"></dda-textarea>`);
      if (theme) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        await page.waitForChanges();
      }

      const colors = await page.evaluate(readPlaceholderColors, { field: 'dda-textarea textarea' });

      expect(contrastRatio(colors.placeholder, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

// WAVE "Orphaned form label" / "Missing form label" (WCAG 1.3.1 / 4.1.2):
// without input_id the label got for="" and the field had no id, so they
// were not connected. The component now generates a per-instance id.
describe('dda-textarea label association without input_id', () => {
  it('links the label to the field with a generated id', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea label="Label"></dda-textarea>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-textarea .dda-input-label') as HTMLLabelElement;
      const field = document.querySelector('dda-textarea textarea') as HTMLElement;
      return { htmlFor: label.htmlFor, id: field.id };
    });

    expect(result.htmlFor).not.toBe('');
    expect(result.htmlFor).toBe(result.id);
  });

  it('links helper text with aria-describedby when input_id is not set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea label="Label" helper_text="Helper text"></dda-textarea>');

    const texts = await page.evaluate(() => {
      const field = document.querySelector('dda-textarea textarea');
      const ids = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return ids.map((id) => document.getElementById(id)?.textContent?.trim() ?? null);
    });

    expect(texts.length).toBe(1);
    expect(texts[0]).toContain('Helper text');
  });

  it('gives two instances different ids', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-textarea label="First"></dda-textarea>
      <dda-textarea label="Second"></dda-textarea>
    `);

    const result = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('dda-textarea'));
      return hosts.map((host) => {
        const label = host.querySelector('.dda-input-label') as HTMLLabelElement;
        const field = host.querySelector('textarea') as HTMLElement;
        return { htmlFor: label.htmlFor, id: field.id };
      });
    });

    expect(result.length).toBe(2);
    expect(result[0].id).not.toBe('');
    expect(result[1].id).not.toBe('');
    expect(result[0].id).not.toBe(result[1].id);
    expect(result[0].htmlFor).toBe(result[0].id);
    expect(result[1].htmlFor).toBe(result[1].id);
  });

  it('uses input_id when it is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea input_id="my-field" label="Label"></dda-textarea>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-textarea .dda-input-label') as HTMLLabelElement;
      const field = document.querySelector('dda-textarea textarea') as HTMLElement;
      return { htmlFor: label.htmlFor, id: field.id };
    });

    expect(result.id).toBe('my-field');
    expect(result.htmlFor).toBe('my-field');
  });
});

describe('dda-textarea rich editor label', () => {
  it('names the rich editor with aria-labelledby and does not point the label at a div', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-textarea label="Message" enable_rich_editor></dda-textarea>');
    await page.waitForChanges();

    const wiring = await page.evaluate(() => {
      const label = document.querySelector('dda-textarea .dda-input-label');
      const editor = document.querySelector('dda-textarea [aria-labelledby]');
      return { hasFor: label.hasAttribute('for'), labelledBy: editor?.getAttribute('aria-labelledby'), labelId: label.id };
    });

    expect(wiring.hasFor).toBe(false);
    expect(wiring.labelledBy).toBe(wiring.labelId);
  });
});
