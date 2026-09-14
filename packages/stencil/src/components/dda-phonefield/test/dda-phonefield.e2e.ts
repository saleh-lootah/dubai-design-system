import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';
import { readPlaceholderColors } from '../../../utils/placeholder-color';

// F-016: same systemic error-labelling gap as dda-input, applied to the
// phone number <input> (not the country-code trigger button).
describe('dda-phonefield F-016 error labelling', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-phonefield input_id="input" button_id="button"></dda-phonefield>');

    const element = await page.find('dda-phonefield');
    expect(element).toHaveClass('hydrated');
  });

  it('has no aria-invalid/aria-describedby when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-phonefield input_id="input" button_id="button"></dda-phonefield>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-phonefield .dda-field-group-input');
      return { invalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an existing error element with the error text and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-phonefield input_id="input" button_id="button" error_message="Invalid phone number"></dda-phonefield>'
    );

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-phonefield .dda-field-group-input');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id));
      return {
        invalid: el.getAttribute('aria-invalid'),
        ids,
        allExist: texts.every((t) => !!t),
        containsError: texts.some((t) => t?.textContent?.includes('Invalid phone number')),
      };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.allExist).toBe(true);
    expect(result.containsError).toBe(true);
  });
});

// F-018: telephone is exactly the field type WCAG 1.3.5 calls out for
// autocomplete="tel" — no autocomplete prop existed at all.
describe('dda-phonefield F-018 autocomplete', () => {
  it('defaults the phone input to autocomplete="tel"', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-phonefield input_id="input" button_id="button"></dda-phonefield>');

    const autocomplete = await page.evaluate(
      () => document.querySelector('dda-phonefield .dda-field-group-input').getAttribute('autocomplete')
    );

    expect(autocomplete).toBe('tel');
  });

  it('lets a consumer override autocomplete', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-phonefield input_id="input" button_id="button" autocomplete="tel-national"></dda-phonefield>'
    );

    const autocomplete = await page.evaluate(
      () => document.querySelector('dda-phonefield .dda-field-group-input').getAttribute('autocomplete')
    );

    expect(autocomplete).toBe('tel-national');
  });
});

describe('dda-phonefield layout', () => {
  it('fits a narrow container', async () => {
    const page = await newE2EPage();
    await page.setContent(`<div style="width: 274px"><dda-phonefield></dda-phonefield></div>`);

    const overflow = await page.evaluate(() => {
      const cell = document.querySelector('div').getBoundingClientRect();
      return Array.from(document.querySelectorAll('dda-phonefield *'))
        .filter(el => el.getBoundingClientRect().right > cell.right + 0.5)
        .map(el => el.className || el.localName);
    });

    expect(overflow).toEqual([]);
  });
});

// WCAG 1.1.1/4.1.2: the dropdown toggle was announced with the icon ligature
// ("keyboard_arrow_down") and had no name that said what it does.
describe('dda-phonefield dropdown toggle accessible name', () => {
  it('hides every Material icon from assistive technology', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-phonefield input_id="input" button_id="button"></dda-phonefield>`);

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-phonefield i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });

  it('hides every Material icon from assistive technology (list open)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-phonefield input_id="input" button_id="button"></dda-phonefield>`);

    await page.click('dda-phonefield .dda-dropdown-select');
    await page.waitForChanges();

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-phonefield i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });

  it('names the toggle "Choose country code: +971" by default', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-phonefield input_id="input" button_id="button"></dda-phonefield>`);

    const name = await page.evaluate(() => document.querySelector('dda-phonefield .dda-dropdown-select').getAttribute('aria-label'));

    expect(name).toBe('Choose country code: +971');
  });

  it('uses toggle_button_label when set', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-phonefield input_id="input" button_id="button" toggle_button_label="Country code"></dda-phonefield>`);

    const name = await page.evaluate(() => document.querySelector('dda-phonefield .dda-dropdown-select').getAttribute('aria-label'));

    expect(name).toBe('Country code: +971');
  });

  it('sets aria-expanded on the toggle, false by default and true when open', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-phonefield input_id="input" button_id="button"></dda-phonefield>`);

    const before = await page.evaluate(() => document.querySelector('dda-phonefield .dda-dropdown-select').getAttribute('aria-expanded'));
    await page.click('dda-phonefield .dda-dropdown-select');
    await page.waitForChanges();
    const after = await page.evaluate(() => document.querySelector('dda-phonefield .dda-dropdown-select').getAttribute('aria-expanded'));

    expect(before).toBe('false');
    expect(after).toBe('true');
  });
});

// WCAG 1.4.3: the global `::placeholder` colour (#8E9191) was 3.18:1 on the
// white field. input.css now uses --dda-on-surface-variant-40 on the field.
// Chromium's getComputedStyle(el, '::placeholder') returns the element's own
// colour, so readPlaceholderColors resolves the winning ::placeholder rule.
describe('dda-phonefield placeholder contrast (WCAG 1.4.3)', () => {
  for (const theme of [undefined, 'dark'] as const) {
    const label = theme ? 'dark' : 'light';

    it(`placeholder clears 4.5:1 against the field background in ${label} theme`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-phonefield input_id="input" button_id="button"></dda-phonefield>`);
      if (theme) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        await page.waitForChanges();
      }

      const colors = await page.evaluate(readPlaceholderColors, { field: 'dda-phonefield .dda-field-group-input', background: 'dda-phonefield .dda-input-field-group' });

      expect(contrastRatio(colors.placeholder, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
