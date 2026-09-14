import { newE2EPage } from '@stencil/core/testing';
import type { ElementHandle, Page } from 'puppeteer';
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

// WAVE "Orphaned form label" / "Missing form label" (WCAG 1.3.1 / 4.1.2):
// without input_id both labels got for="" and the file input had no id. The
// component now generates a per-instance id.
describe('dda-attach-file label association without input_id', () => {
  it('links the label and the "Choose File" control to the file input with a generated id', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file label="Attach"></dda-attach-file>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-attach-file .dda-input-label') as HTMLLabelElement;
      const choose = document.querySelector('dda-attach-file .dda-file-choose') as HTMLLabelElement;
      const input = document.querySelector('dda-attach-file input[type="file"]') as HTMLInputElement;
      return { labelFor: label.htmlFor, chooseFor: choose.htmlFor, id: input.id };
    });

    expect(result.labelFor).not.toBe('');
    expect(result.labelFor).toBe(result.id);
    expect(result.chooseFor).toBe(result.id);
  });

  it('gives two instances different ids', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-attach-file label="First"></dda-attach-file>
      <dda-attach-file label="Second"></dda-attach-file>
    `);

    const result = await page.evaluate(() => {
      const hosts = Array.from(document.querySelectorAll('dda-attach-file'));
      return hosts.map((host) => {
        const label = host.querySelector('.dda-input-label') as HTMLLabelElement;
        const input = host.querySelector('input[type="file"]') as HTMLInputElement;
        return { htmlFor: label.htmlFor, id: input.id };
      });
    });

    expect(result.length).toBe(2);
    expect(result[0].id).not.toBe('');
    expect(result[1].id).not.toBe('');
    expect(result[0].id).not.toBe(result[1].id);
    expect(result[0].htmlFor).toBe(result[0].id);
    expect(result[1].htmlFor).toBe(result[1].id);
  });

  it('uses input_id when it is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file input_id="my-file" label="Attach"></dda-attach-file>');

    const result = await page.evaluate(() => {
      const label = document.querySelector('dda-attach-file .dda-input-label') as HTMLLabelElement;
      const input = document.querySelector('dda-attach-file input[type="file"]') as HTMLInputElement;
      return { htmlFor: label.htmlFor, id: input.id };
    });

    expect(result.id).toBe('my-file');
    expect(result.htmlFor).toBe('my-file');
  });
});

// WCAG 2.1.1 / 4.1.2: the file input was display:none, so a keyboard or
// screen-reader user could not reach it. It is now visually hidden but
// focusable, and the visible "Choose File" control shows the focus ring.
describe('dda-attach-file keyboard access', () => {
  it('Tab from a preceding button focuses the file input', async () => {
    const page = await newE2EPage();
    await page.setContent('<button id="before">Before</button><dda-attach-file label="Attach"></dda-attach-file>');

    await page.focus('#before');
    await page.keyboard.press('Tab');

    const result = await page.evaluate(() => {
      const el = document.activeElement as HTMLInputElement;
      return {
        tag: el?.tagName,
        type: el?.getAttribute('type'),
        insideComponent: !!el?.closest('dda-attach-file'),
      };
    });

    expect(result.tag).toBe('INPUT');
    expect(result.type).toBe('file');
    expect(result.insideComponent).toBe(true);
  });

  it('does not hide the file input with display:none', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file label="Attach"></dda-attach-file>');

    const display = await page.evaluate(() => {
      const input = document.querySelector('dda-attach-file input[type="file"]') as HTMLElement;
      return getComputedStyle(input).display;
    });

    expect(display).not.toBe('none');
  });

  it('shows a focus ring on the "Choose File" control while the file input has keyboard focus', async () => {
    const page = await newE2EPage();
    await page.setContent('<button id="before">Before</button><dda-attach-file label="Attach"></dda-attach-file>');

    const resting = await page.evaluate(() => {
      const choose = document.querySelector('dda-attach-file .dda-file-choose') as HTMLElement;
      const s = getComputedStyle(choose);
      return { boxShadow: s.boxShadow };
    });

    await page.focus('#before');
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => {
      const choose = document.querySelector('dda-attach-file .dda-file-choose') as HTMLElement;
      const s = getComputedStyle(choose);
      return { boxShadow: s.boxShadow, outlineStyle: s.outlineStyle };
    });

    expect(resting.boxShadow).toBe('none');
    expect(focused.boxShadow !== 'none' || focused.outlineStyle !== 'none').toBe(true);
  });

  it('renders no aria-label attribute on the file input when aria_label is not set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file label="Attach"></dda-attach-file>');

    const hasAriaLabel = await page.evaluate(() => {
      const input = document.querySelector('dda-attach-file input[type="file"]');
      return input.hasAttribute('aria-label');
    });

    expect(hasAriaLabel).toBe(false);
  });

  it('renders aria-label on the file input when aria_label is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file aria_label="Upload CV"></dda-attach-file>');

    const ariaLabel = await page.evaluate(() => {
      const input = document.querySelector('dda-attach-file input[type="file"]');
      return input.getAttribute('aria-label');
    });

    expect(ariaLabel).toBe('Upload CV');
  });
});

describe('dda-attach-file names without a visible label', () => {
  it('names the file input "Choose file" when there is no label or aria_label', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file></dda-attach-file>');

    expect(await page.evaluate(() => document.querySelector('dda-attach-file input[type="file"]').getAttribute('aria-label'))).toBe('Choose file');
  });

  it('names the remove button after the chosen file', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-attach-file label="Attach"></dda-attach-file>');
    const input = await (page as unknown as Page).$('dda-attach-file input[type="file"]');
    await (input as ElementHandle<HTMLInputElement>).uploadFile(__filename);
    await page.waitForChanges();

    const name = await page.evaluate(() => document.querySelector('dda-attach-file .remove-file').getAttribute('aria-label'));
    expect(name).toMatch(/^Remove .+\.e2e\.[jt]s$/);
  });
});
