import { newE2EPage } from '@stencil/core/testing';

// Task 9d — F-021: `.dda-dropdown-container.bg-transparent .dda-dropdown-header`
// (global/input.css) sets `box-shadow: none` unconditionally at higher
// specificity (3 classes) than the base `.dda-input-field:focus` ring (2
// classes) it shares via its `dda-input-field` class, so the ring never
// renders on the `type="bg-transparent"` variant regardless of focus state.
describe('dda-dropdown focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-dropdown button_id="dropdown" options=\'["Option 1"]\'></dda-dropdown>');

    const element = await page.find('dda-dropdown');
    expect(element).toHaveClass('hydrated');
  });

  it('shows no focus ring before focus (type=bg-transparent)', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-dropdown button_id="dropdown" options=\'["Option 1"]\' type="bg-transparent"></dda-dropdown>',
    );

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-dropdown .dda-dropdown-header') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (type=bg-transparent)', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-dropdown button_id="dropdown" options=\'["Option 1"]\' type="bg-transparent"></dda-dropdown>',
    );

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('dda-dropdown-header');
    expect(focused.boxShadow).not.toBe('none');
  });
});
