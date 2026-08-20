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
