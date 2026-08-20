import { newE2EPage } from '@stencil/core/testing';

// Task 9d — F-021: same `.dda-validation-error .dda-input-field` box-shadow:
// none clobber as dda-input, on the credit-card number <input>.
describe('dda-creditcard-field focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-creditcard-field input_id="input"></dda-creditcard-field>');

    const element = await page.find('dda-creditcard-field');
    expect(element).toHaveClass('hydrated');
  });

  it('shows no focus ring before focus (validation_type=error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-creditcard-field input_id="input" validation_type="error"></dda-creditcard-field>');

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-creditcard-field input') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (validation_type=error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-creditcard-field input_id="input" validation_type="error"></dda-creditcard-field>');

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

// F-016: same systemic error-labelling gap as dda-input.
describe('dda-creditcard-field F-016 error labelling', () => {
  it('has no aria-invalid/aria-describedby when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-creditcard-field input_id="input"></dda-creditcard-field>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-creditcard-field input');
      return { invalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an existing error element with the error text and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-creditcard-field input_id="input" error_message="Invalid card number"></dda-creditcard-field>'
    );

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-creditcard-field input');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id));
      return {
        invalid: el.getAttribute('aria-invalid'),
        ids,
        allExist: texts.every((t) => !!t),
        containsError: texts.some((t) => t?.textContent?.includes('Invalid card number')),
      };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.allExist).toBe(true);
    expect(result.containsError).toBe(true);
  });
});

// F-018: card number is exactly the field type WCAG 1.3.5 calls out for
// autocomplete="cc-number" — no autocomplete prop existed at all.
describe('dda-creditcard-field F-018 autocomplete', () => {
  it('defaults the input to autocomplete="cc-number"', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-creditcard-field input_id="input"></dda-creditcard-field>');

    const autocomplete = await page.evaluate(
      () => document.querySelector('dda-creditcard-field input').getAttribute('autocomplete')
    );

    expect(autocomplete).toBe('cc-number');
  });

  it('lets a consumer override autocomplete', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-creditcard-field input_id="input" autocomplete="off"></dda-creditcard-field>');

    const autocomplete = await page.evaluate(
      () => document.querySelector('dda-creditcard-field input').getAttribute('autocomplete')
    );

    expect(autocomplete).toBe('off');
  });
});
