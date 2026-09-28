import { newE2EPage } from '@stencil/core/testing';

describe('dda-scroll-icon motion', () => {
  const animationOf = async (reduce: boolean) => {
    const page = await newE2EPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
    await page.setContent(`<dda-scroll-icon></dda-scroll-icon>`);
    await page.waitForChanges();
    return page.$eval('.dda-scroll-icon-scroll-dot', e => getComputedStyle(e).animationName);
  };

  it('moves the dot when motion is allowed', async () => {
    expect(await animationOf(false)).toBe('dda-scroll-icon-sm');
  });

  it('does not move the dot under reduced motion', async () => {
    expect(await animationOf(true)).toBe('none');
  });
});
