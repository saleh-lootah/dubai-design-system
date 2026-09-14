import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';
import { readPlaceholderColors } from '../../../utils/placeholder-color';

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

// F-017: the visible <label> targeted button_id, which is applied to the
// clear/close button, not the search field — the label named the wrong
// control and the search input itself was unlabelled (hardcoded id="search").
describe('dda-search-input F-017 label association', () => {
  it('the label targets the search input, not the clear button', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-search-input button_id="button" input_id="search-a" label="Site search"></dda-search-input>'
    );

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-search-input label') as HTMLLabelElement;
      const target = label ? document.getElementById(label.htmlFor) : null;
      return { for: label?.htmlFor, targetTag: target?.tagName, targetClass: target?.className };
    });

    expect(result.targetTag).toBe('INPUT');
    expect(result.targetClass).toContain('dda-search-field');
  });

  it('the search input and the clear button carry distinct ids', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input button_id="button" input_id="search-a"></dda-search-input>');

    const result = await page.evaluate(() => {
      const input = document.querySelector('dda-search-input .dda-search-field');
      const clearButton = document.querySelector('dda-search-input .icon-close');
      return { inputId: input?.id, buttonId: clearButton?.id };
    });

    expect(result.inputId).toBe('search-a');
    expect(result.buttonId).toBe('button');
    expect(result.inputId).not.toBe(result.buttonId);
  });

  it('two instances on one page do not collide on the search input id', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-search-input button_id="button-a" input_id="search-a"></dda-search-input>
      <dda-search-input button_id="button-b" input_id="search-b"></dda-search-input>
    `);

    const ids = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-search-input .dda-search-field')).map((el) => el.id)
    );

    expect(ids).toEqual(['search-a', 'search-b']);
  });
});

// F-016: same systemic error-labelling gap as dda-input.
describe('dda-search-input F-016 error labelling', () => {
  it('has no aria-invalid/aria-describedby when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input button_id="button" input_id="search-a"></dda-search-input>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-search-input .dda-search-field');
      return { invalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an existing error element with the error text and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-search-input button_id="button" input_id="search-a" error_message="No results"></dda-search-input>'
    );

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-search-input .dda-search-field');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id));
      return {
        invalid: el.getAttribute('aria-invalid'),
        ids,
        allExist: texts.every((t) => !!t),
        containsError: texts.some((t) => t?.textContent?.includes('No results')),
      };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.allExist).toBe(true);
    expect(result.containsError).toBe(true);
  });
});

// WCAG 1.1.1/4.1.2: the icon-only clear button was named only by its icon
// ligature ("close"), and the search icon's "search" text was exposed.
describe('dda-search-input clear button name', () => {
  it('hides every Material icon from assistive technology', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-search-input input_id="search" button_id="button"></dda-search-input>`);

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-search-input i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });

  it('names the clear button "Clear search" by default', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-search-input input_id="search" button_id="button"></dda-search-input>`);

    const name = await page.evaluate(() => document.querySelector('dda-search-input .icon-close').getAttribute('aria-label'));

    expect(name).toBe('Clear search');
  });

  it('uses clear_button_label when set', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-search-input input_id="search" button_id="button" clear_button_label="Clear the field"></dda-search-input>`);

    const name = await page.evaluate(() => document.querySelector('dda-search-input .icon-close').getAttribute('aria-label'));

    expect(name).toBe('Clear the field');
  });

  it('keeps button_aria_label ahead of clear_button_label', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-search-input input_id="search" button_id="button" button_aria_label="Reset" clear_button_label="Clear the field"></dda-search-input>`);

    const name = await page.evaluate(() => document.querySelector('dda-search-input .icon-close').getAttribute('aria-label'));

    expect(name).toBe('Reset');
  });
});

// WCAG 1.4.3: the global `::placeholder` colour (#8E9191) was 3.18:1 on the
// white field. input.css now uses --dda-on-surface-variant-40 on the field.
// Chromium's getComputedStyle(el, '::placeholder') returns the element's own
// colour, so readPlaceholderColors resolves the winning ::placeholder rule.
describe('dda-search-input placeholder contrast (WCAG 1.4.3)', () => {
  for (const theme of [undefined, 'dark'] as const) {
    const label = theme ? 'dark' : 'light';

    it(`placeholder clears 4.5:1 against the field background in ${label} theme`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-search-input input_id="search" button_id="button"></dda-search-input>`);
      if (theme) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        await page.waitForChanges();
      }

      const colors = await page.evaluate(readPlaceholderColors, { field: 'dda-search-input .dda-search-field' });

      expect(contrastRatio(colors.placeholder, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

// WAVE "Orphaned form label" / "Missing form label" (WCAG 1.3.1 / 4.1.2):
// without input_id the label got for="" and the search input had no id, so they
// were not connected. The component now generates a per-instance id.
describe('dda-search-input label association without input_id', () => {
  it('links the label to the search input with a generated id', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input label="Label"></dda-search-input>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-search-input .dda-input-label') as HTMLLabelElement;
      const field = document.querySelector('dda-search-input input.dda-search-field') as HTMLElement;
      return { htmlFor: label.htmlFor, id: field.id };
    });

    expect(result.htmlFor).not.toBe('');
    expect(result.htmlFor).toBe(result.id);
  });

  it('links helper text with aria-describedby when input_id is not set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-search-input label="Label" helper_text="Helper text"></dda-search-input>');

    const texts = await page.evaluate(() => {
      const field = document.querySelector('dda-search-input input.dda-search-field');
      const ids = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return ids.map((id) => document.getElementById(id)?.textContent?.trim() ?? null);
    });

    expect(texts.length).toBe(1);
    expect(texts[0]).toContain('Helper text');
  });

  it('gives two instances different ids', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-search-input label="First"></dda-search-input>
      <dda-search-input label="Second"></dda-search-input>
    `);

    const result = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('dda-search-input'));
      return hosts.map((host) => {
        const label = host.querySelector('.dda-input-label') as HTMLLabelElement;
        const field = host.querySelector('input.dda-search-field') as HTMLElement;
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
    await page.setContent('<dda-search-input input_id="my-field" label="Label"></dda-search-input>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-search-input .dda-input-label') as HTMLLabelElement;
      const field = document.querySelector('dda-search-input input.dda-search-field') as HTMLElement;
      return { htmlFor: label.htmlFor, id: field.id };
    });

    expect(result.id).toBe('my-field');
    expect(result.htmlFor).toBe('my-field');
  });
});
