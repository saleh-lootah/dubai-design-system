import { newE2EPage } from '@stencil/core/testing';

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
