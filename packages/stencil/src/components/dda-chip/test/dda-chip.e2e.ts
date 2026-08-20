import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';

describe('dda-chip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip>Tag</dda-chip>');

    const el = await page.find('dda-chip');
    expect(el).toHaveClass('hydrated');
  });

  it('dismisses on click (mouse baseline)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip show_close_icon="true">Tag</dda-chip>');

    // The spy must be attached after setContent, because setContent
    // replaces the document and discards any earlier listener.
    const clickSpy = await page.spyOnEvent('click');

    const close = await page.find('dda-chip .chip-close');
    await close.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });

  // F-003: the close control was a span with onClick and no
  // tabindex/role/onKeyDown — it is the chip's only dismiss mechanism when
  // show_close_icon is set, so a keyboard user could never dismiss a chip.
  it('is reachable by Tab and dismissible with Enter', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip show_close_icon="true">Tag</dda-chip>');

    const clickSpy = await page.spyOnEvent('click');

    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => (document.activeElement ? document.activeElement.tagName : null));
    expect(focusedTag).toBe('BUTTON');

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });

  it('is dismissible with Space as well', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip show_close_icon="true">Tag</dda-chip>');

    const clickSpy = await page.spyOnEvent('click');

    const close = await page.find('dda-chip .chip-close');
    await close.focus();
    await page.keyboard.press('Space');
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });

  it('gives the close control an accessible name', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip show_close_icon="true">Tag</dda-chip>');

    const close = await page.find('dda-chip .chip-close');
    expect(close.getAttribute('aria-label')).not.toBeNull();
  });
});

// F-023 (B3): `.dda-chip-grey`'s background was the raw, theme-invariant
// `--dda-neutral-variant-94`, paired with the theme-flipping text alias
// `--dda-on-surface-variant-30` used on the icon glyph — 1.46:1 in dark
// before the fix.
describe('dda-chip grey icon contrast (F-023)', () => {
  it('clears 4.5:1 in light theme', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip bg_color="grey" icon="close" show_close_icon="true">Tag</dda-chip>');

    const colors = await page.evaluate(() => {
      const chip = document.querySelector('dda-chip .dda-chip') as HTMLElement;
      const icon = document.querySelector('dda-chip .dda-chip > i') as HTMLElement;
      return { color: getComputedStyle(icon).color, background: getComputedStyle(chip).backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('clears 4.5:1 in dark theme', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-chip bg_color="grey" icon="close" show_close_icon="true">Tag</dda-chip>');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForChanges();

    const colors = await page.evaluate(() => {
      const chip = document.querySelector('dda-chip .dda-chip') as HTMLElement;
      const icon = document.querySelector('dda-chip .dda-chip > i') as HTMLElement;
      return { color: getComputedStyle(icon).color, background: getComputedStyle(chip).backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });
});
