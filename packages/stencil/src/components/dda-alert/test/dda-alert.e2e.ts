import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';

// F-012: dda-alert carried no `role` attribute anywhere (grepped, zero
// matches), so a screen reader user was never notified when an alert was
// inserted into the page. Repair: the root element's role follows the
// `variation` prop rather than being fixed — `role="alert"` (assertive,
// interrupts) for the urgent case, `role="status"` (polite) for the rest,
// matching the findings doc's guidance that error suits `alert` and
// confirmations suit `status`.

describe('dda-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Heads up" description="Something happened"></dda-alert>');

    const el = await page.find('dda-alert');
    expect(el).toHaveClass('hydrated');
  });

  it('carries a role on the root element for every variation (F-012 baseline)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="info" title_text="Info" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).not.toBeNull();
  });

  it('uses role="alert" (assertive) for the error variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="error" title_text="Failed" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('alert');
  });

  it('uses role="status" (polite) for the success variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="success" title_text="Saved" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });

  it('uses role="status" (polite) for the info variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="info" title_text="FYI" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });

  it('uses role="status" (polite) for the warning variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="warning" title_text="Careful" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });

  it('defaults to role="status" when no variation is set (default is "info")', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Default" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });
});

// Audit: the close button was named "close" (the icon ligature) and the
// title was always an <h4>, which broke the page heading order.
describe('dda-alert names and headings', () => {
  it('names the close button "Close" by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Heads up" description="d"></dda-alert>');

    const close = await page.find('dda-alert .dda-alert-close');
    expect(close.getAttribute('aria-label')).toBe('Close');
  });

  it('names the close button from close_button_label', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Heads up" description="d" close_button_label="Dismiss alert"></dda-alert>');

    const close = await page.find('dda-alert .dda-alert-close');
    expect(close.getAttribute('aria-label')).toBe('Dismiss alert');
  });

  it('hides every decorative icon from assistive tech', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Heads up" description="d"></dda-alert>');

    const hidden = await page.evaluate(() => Array.from(document.querySelectorAll('dda-alert i')).map(i => i.getAttribute('aria-hidden')));
    expect(hidden.length).toBe(2);
    expect(hidden).toEqual(['true', 'true']);
  });

  it('renders the title as an h4 by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Heads up" description="d"></dda-alert>');

    const tag = await page.evaluate(() => document.querySelector('dda-alert .alert-title').tagName);
    expect(tag).toBe('H4');
  });

  it('renders the title at heading_level', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Heads up" description="d" heading_level="2"></dda-alert>');

    const tag = await page.evaluate(() => document.querySelector('dda-alert .alert-title').tagName);
    expect(tag).toBe('H2');
  });

  it('clamps heading_level to 1-6', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert id="high" title_text="A" heading_level="9"></dda-alert><dda-alert id="low" title_text="B" heading_level="0"></dda-alert>');

    const tags = await page.evaluate(() => [document.querySelector('#high .alert-title').tagName, document.querySelector('#low .alert-title').tagName]);
    expect(tags).toEqual(['H6', 'H1']);
  });

  it('keeps the title size when heading_level changes', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert id="a" title_text="A"></dda-alert><dda-alert id="b" title_text="B" heading_level="2"></dda-alert>');

    const sizes = await page.evaluate(() =>
      ['#a', '#b'].map(id => {
        const style = getComputedStyle(document.querySelector(`${id} .alert-title`));
        return `${style.fontSize} ${style.fontWeight} ${style.lineHeight} ${style.margin}`;
      }),
    );
    expect(sizes[1]).toBe(sizes[0]);
  });
});

// F-023 Decision 2: info and warning were the two semantic palettes whose
// dark-theme "-40 text on -variant-95 fill" recipe fell short — info at
// 4.05:1 (needs 4.5:1) and warning at 2.08:1 (needs 3:1 for the 24px title,
// 4.5:1 for the description). Error and success already passed and are
// left untouched (checked here as a non-regression control).
describe('dda-alert dark-theme contrast (F-023 Decision 2)', () => {
  const renderDark = async (page, variation: string) => {
    await page.setContent(`<dda-alert variation="${variation}" title_text="Title text" description="Description text"></dda-alert>`);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForChanges();
  };

  const readColors = page =>
    page.evaluate(() => {
      const title = document.querySelector('dda-alert .alert-title') as HTMLElement;
      const description = document.querySelector('dda-alert .alert-description') as HTMLElement;
      const alert = document.querySelector('dda-alert .dda-alert') as HTMLElement;
      return {
        title: getComputedStyle(title).color,
        description: getComputedStyle(description).color,
        background: getComputedStyle(alert).backgroundColor,
      };
    });

  for (const variation of ['info', 'warning']) {
    it(`${variation}: title clears 3:1 (24px) in dark theme`, async () => {
      const page = await newE2EPage();
      await renderDark(page, variation);
      const colors = await readColors(page);
      expect(contrastRatio(colors.title, colors.background)).toBeGreaterThanOrEqual(3);
    });

    it(`${variation}: description clears 4.5:1 in dark theme`, async () => {
      const page = await newE2EPage();
      await renderDark(page, variation);
      const colors = await readColors(page);
      expect(contrastRatio(colors.description, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }

  // Non-regression control: error/success were already passing and
  // Decision 2 deliberately left their dark-theme values untouched.
  for (const variation of ['error', 'success']) {
    it(`${variation}: description still clears 4.5:1 in dark theme (unchanged)`, async () => {
      const page = await newE2EPage();
      await renderDark(page, variation);
      const colors = await readColors(page);
      expect(contrastRatio(colors.description, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
