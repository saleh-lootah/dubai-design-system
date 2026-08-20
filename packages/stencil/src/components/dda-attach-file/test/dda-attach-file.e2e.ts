import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';

// F-016: same systemic error-labelling gap as dda-input, applied to the
// file <input> (rendered only while no file is selected).
describe('dda-attach-file F-016 error labelling', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file input_id="input" button_id="button"></dda-attach-file>');

    const element = await page.find('dda-attach-file');
    expect(element).toHaveClass('hydrated');
  });

  it('has no aria-invalid/aria-describedby when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file input_id="input" button_id="button"></dda-attach-file>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-attach-file input[type="file"]');
      return { invalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an existing error element with the error text and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-attach-file input_id="input" button_id="button" error_message="File is required"></dda-attach-file>'
    );

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-attach-file input[type="file"]');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id));
      return {
        invalid: el.getAttribute('aria-invalid'),
        ids,
        allExist: texts.every((t) => !!t),
        containsError: texts.some((t) => t?.textContent?.includes('File is required')),
      };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.allExist).toBe(true);
    expect(result.containsError).toBe(true);
  });
});

// F-023: three separate pairings on this component, all now fixed.
// - A4: `.dda-input-disabled .dda-file-choose`'s own background override
//   was a third raw token (--dda-neutral-95), distinct from A2's
//   --dda-neutral-92 — 2.80:1 in both themes before the fix.
// - B1: `.dda-file-choose`'s default (non-disabled) background was raw
//   --dda-neutral-100 against theme-flipping text — 2.30:1 in dark before
//   the fix.
describe('dda-attach-file contrast (F-023)', () => {
  const renderDisabled = async (page, theme?: 'dark') => {
    await page.setContent(
      '<dda-attach-file input_type="disabled" input_id="f" button_id="b" label="Attach"></dda-attach-file>',
    );
    if (theme) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.waitForChanges();
    }
  };

  it('A4: disabled file-choose text clears 4.5:1 against its own background in light theme', async () => {
    const page = await newE2EPage();
    await renderDisabled(page);

    const colors = await page.evaluate(() => {
      const el = document.querySelector('dda-attach-file .dda-file-choose') as HTMLElement;
      const s = getComputedStyle(el);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('A4: disabled file-choose text clears 4.5:1 against its own background in dark theme', async () => {
    const page = await newE2EPage();
    await renderDisabled(page, 'dark');

    const colors = await page.evaluate(() => {
      const el = document.querySelector('dda-attach-file .dda-file-choose') as HTMLElement;
      const s = getComputedStyle(el);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('B1: enabled file-choose text clears 4.5:1 against its own background in dark theme', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file input_id="f" button_id="b" label="Attach"></dda-attach-file>');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForChanges();

    const colors = await page.evaluate(() => {
      const el = document.querySelector('dda-attach-file .dda-file-choose') as HTMLElement;
      const s = getComputedStyle(el);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('B1: enabled file-choose text clears 4.5:1 against its own background in light theme (unchanged)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file input_id="f" button_id="b" label="Attach"></dda-attach-file>');

    const colors = await page.evaluate(() => {
      const el = document.querySelector('dda-attach-file .dda-file-choose') as HTMLElement;
      const s = getComputedStyle(el);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });
});
