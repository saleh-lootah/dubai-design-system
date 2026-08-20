import { newE2EPage } from '@stencil/core/testing';

// Task 9d — F-021: dda-select's trigger button carries class
// `dda-input-field dda-select-header`, so it routes through the same
// `.dda-validation-error`/`.dda-input-disabled` box-shadow:none clobber as
// dda-input. Neither story sets the native `disabled` attribute on the
// real <button> (dda-select.tsx never wires `this.disabled` onto it), so it
// stays a real, reachable Tab stop.
describe('dda-select focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\'></dda-select>');

    const element = await page.find('dda-select');
    expect(element).toHaveClass('hydrated');
  });

  it('shows no focus ring before focus (error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\' error="error"></dda-select>');

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-select .dda-select-header') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\' error="error"></dda-select>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('dda-select-header');
    expect(focused.boxShadow).not.toBe('none');
  });

  it('shows a real focus ring under keyboard focus (disabled=true)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\' disabled="true"></dda-select>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('dda-select-header');
    expect(focused.boxShadow).not.toBe('none');
  });
});
