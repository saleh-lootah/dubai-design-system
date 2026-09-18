import { newE2EPage } from '@stencil/core/testing';
import { readPlaceholderColors } from '../../../utils/placeholder-color';
import { contrastRatio } from '../../../utils/contrast';

// Task 9d — F-021: `.dda-validation-error .dda-input-field` and
// `.dda-input-disabled .dda-input-field` (global/input.css) both set
// `box-shadow: none` unconditionally, at equal specificity to and later in
// the file than `.dda-input-field:focus`'s ring — so it wins by cascade
// regardless of focus state. Neither story sets the native `disabled`
// attribute on the real <input>, so it stays a real, reachable Tab stop
// with no visible focus indicator at all.
describe('dda-input focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input input_id="input"></dda-input>');

    const element = await page.find('dda-input');
    expect(element).toHaveClass('hydrated');
  });

  it('shows no focus ring before focus (validation_type=error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input input_id="input" validation_type="error"></dda-input>');

    const resting = await page.evaluate(() => {
      const input = document.querySelector('dda-input input') as HTMLElement;
      const s = getComputedStyle(input);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (validation_type=error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input input_id="input" validation_type="error"></dda-input>');

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
    await page.setContent('<dda-input input_id="input" input_status="disabled"></dda-input>');

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

// F-016: error text was a plain sibling <span> with no id, and the <input>
// carried no aria-describedby/aria-invalid, so a screen-reader user tabbing
// into an errored field heard the label only, never the error.
describe('dda-input F-016 error labelling', () => {
  it('has no aria-invalid and no aria-describedby when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input input_id="input"></dda-input>');

    const result = await page.evaluate(() => {
      const input = document.querySelector('dda-input input');
      return {
        invalid: input.getAttribute('aria-invalid'),
        describedby: input.getAttribute('aria-describedby'),
      };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an error element that exists and holds the error text, and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input input_id="input" error_message="Required field"></dda-input>');

    const result = await page.evaluate(() => {
      const input = document.querySelector('dda-input input');
      const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id)?.textContent?.trim() ?? null);
      return { invalid: input.getAttribute('aria-invalid'), ids, texts };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.ids.every((id) => id.length > 0)).toBe(true);
    expect(result.texts).toContain('Required field');
    expect(result.texts.every((t) => t !== null)).toBe(true);
  });

  it('references both helper text and error message, in reading order, when both are present', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-input input_id="input" helper_text="Use digits only" error_message="Required field"></dda-input>'
    );

    const result = await page.evaluate(() => {
      const input = document.querySelector('dda-input input');
      const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id)?.textContent?.trim() ?? null);
      return { texts };
    });

    expect(result.texts).toEqual(['Use digits only', 'Required field']);
  });

  it('gives two field instances distinct, non-colliding error ids', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-input input_id="input-a" error_message="Error A"></dda-input>
      <dda-input input_id="input-b" error_message="Error B"></dda-input>
    `);

    const result = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('dda-input input'));
      return inputs.map((input) => {
        const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        return ids.map((id) => document.getElementById(id)?.textContent?.trim());
      });
    });

    expect(result[0]).toEqual(['Error A']);
    expect(result[1]).toEqual(['Error B']);
  });
});

// F-023 (A1/A2/Decision 1): the disabled field's label used to fail 4.5:1
// against the page body in light theme (3.18:1), and the field's own text
// failed against its own background in both themes (2.60:1, since the
// background was the raw, non-theme-aware --dda-neutral-92). Asserts the
// resulting ratios, not the token names now behind them.
describe('dda-input disabled-state text contrast (F-023)', () => {
  const render = async (page, theme?: 'dark') => {
    await page.setContent(
      '<dda-input type="disabled" input_id="d" label="Disabled label" helper_text="Helper text"></dda-input>',
    );
    if (theme) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.waitForChanges();
    }
  };

  it('label clears 4.5:1 against the page background in light theme', async () => {
    const page = await newE2EPage();
    await render(page);

    const colors = await page.evaluate(() => {
      const label = document.querySelector('dda-input .dda-input-label') as HTMLElement;
      return { color: getComputedStyle(label).color, background: getComputedStyle(document.body).backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('label clears 4.5:1 against the page background in dark theme', async () => {
    const page = await newE2EPage();
    await render(page, 'dark');

    const colors = await page.evaluate(() => {
      const label = document.querySelector('dda-input .dda-input-label') as HTMLElement;
      return { color: getComputedStyle(label).color, background: getComputedStyle(document.body).backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it("field text clears 4.5:1 against its own disabled background in light theme", async () => {
    const page = await newE2EPage();
    await render(page);

    const colors = await page.evaluate(() => {
      const input = document.querySelector('dda-input .dda-input-field') as HTMLElement;
      const s = getComputedStyle(input);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it("field text clears 4.5:1 against its own disabled background in dark theme", async () => {
    const page = await newE2EPage();
    await render(page, 'dark');

    const colors = await page.evaluate(() => {
      const input = document.querySelector('dda-input .dda-input-field') as HTMLElement;
      const s = getComputedStyle(input);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });
});

// WCAG 1.4.3: the global `::placeholder` colour (#8E9191) was 3.18:1 on the
// white field. input.css now uses --dda-on-surface-variant-40 on the field.
// Chromium's getComputedStyle(el, '::placeholder') returns the element's own
// colour, so readPlaceholderColors resolves the winning ::placeholder rule.
describe('dda-input placeholder contrast (WCAG 1.4.3)', () => {
  for (const theme of [undefined, 'dark'] as const) {
    const label = theme ? 'dark' : 'light';

    it(`placeholder clears 4.5:1 against the field background in ${label} theme`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-input input_id="input" placeholder="Enter text"></dda-input>`);
      if (theme) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        await page.waitForChanges();
      }

      const colors = await page.evaluate(readPlaceholderColors, { field: 'dda-input input' });

      expect(contrastRatio(colors.placeholder, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

// WAVE "Orphaned form label" / "Missing form label" (WCAG 1.3.1 / 4.1.2):
// without input_id the label got for="" and the field had no id, so they
// were not connected. The component now generates a per-instance id.
describe('dda-input label association without input_id', () => {
  it('links the label to the field with a generated id', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input label="Label"></dda-input>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-input .dda-input-label') as HTMLLabelElement;
      const field = document.querySelector('dda-input input') as HTMLElement;
      return { htmlFor: label.htmlFor, id: field.id };
    });

    expect(result.htmlFor).not.toBe('');
    expect(result.htmlFor).toBe(result.id);
  });

  it('links helper text with aria-describedby when input_id is not set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input label="Label" helper_text="Helper text"></dda-input>');

    const texts = await page.evaluate(() => {
      const field = document.querySelector('dda-input input');
      const ids = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return ids.map((id) => document.getElementById(id)?.textContent?.trim() ?? null);
    });

    expect(texts.length).toBe(1);
    expect(texts[0]).toContain('Helper text');
  });

  it('gives two instances different ids', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-input label="First"></dda-input>
      <dda-input label="Second"></dda-input>
    `);

    const result = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('dda-input'));
      return hosts.map((host) => {
        const label = host.querySelector('.dda-input-label') as HTMLLabelElement;
        const field = host.querySelector('input') as HTMLElement;
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
    await page.setContent('<dda-input input_id="my-field" label="Label"></dda-input>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-input .dda-input-label') as HTMLLabelElement;
      const field = document.querySelector('dda-input input') as HTMLElement;
      return { htmlFor: label.htmlFor, id: field.id };
    });

    expect(result.id).toBe('my-field');
    expect(result.htmlFor).toBe('my-field');
  });
});

// WCAG 1.3.5: fields that collect data about the user must name their purpose.
describe('dda-input autocomplete', () => {
  it('passes autocomplete to the inner input', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input input_id="email" type="email" autocomplete="email"></dda-input>');

    expect(await page.$eval('dda-input input', (input) => input.getAttribute('autocomplete'))).toBe('email');
  });

  it('sets no autocomplete attribute by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-input input_id="name"></dda-input>');

    expect(await page.$eval('dda-input input', (input) => input.hasAttribute('autocomplete'))).toBe(false);
  });
});
