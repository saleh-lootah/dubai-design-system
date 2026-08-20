import { newE2EPage } from '@stencil/core/testing';

describe('dda-link-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-link-button>Click me</dda-link-button>');

    const element = await page.find('dda-link-button');
    expect(element).toHaveClass('hydrated');
  });

  // Task 9d: dda-link-button shares dda-button.css's btn-color-* classes
  // (styleUrls: ['../../global/dda-button.css', ...]), so it inherits the
  // same F-019/F-020/F-021 defects on its own <a>. default-primary and
  // disabled are enough to prove the shared fix reaches this component too.
  const variants = ['default-primary', 'disabled'];

  for (const button_color of variants) {
    it(`shows no focus ring before focus (${button_color})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-link-button button_color="${button_color}">Click me</dda-link-button>`);

      const resting = await page.evaluate(() => {
        const a = document.querySelector('dda-link-button a') as HTMLElement;
        const s = getComputedStyle(a);
        return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
      });

      expect(resting.outlineStyle).toBe('none');
      expect(resting.boxShadow).toBe('none');
    });

    it(`shows a real focus ring under keyboard focus (${button_color})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-link-button button_color="${button_color}">Click me</dda-link-button>`);

      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        return { tag: el.tagName, boxShadow: s.boxShadow };
      });

      expect(focused).not.toBeNull();
      expect(focused.tag).toBe('A');
      expect(focused.boxShadow).not.toBe('none');
    });
  }
});
