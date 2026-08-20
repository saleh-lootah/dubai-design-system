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
