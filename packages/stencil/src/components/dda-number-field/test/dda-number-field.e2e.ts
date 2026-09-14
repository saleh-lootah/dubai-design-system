import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';
import { readPlaceholderColors } from '../../../utils/placeholder-color';

// F-016: same systemic error-labelling gap as dda-input — error text was a
// plain sibling <span> with no id, and the <input> carried no
// aria-describedby/aria-invalid.
describe('dda-number-field F-016 error labelling', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-number-field input_id="input"></dda-number-field>');

    const element = await page.find('dda-number-field');
    expect(element).toHaveClass('hydrated');
  });

  it('has no aria-invalid/aria-describedby when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-number-field input_id="input"></dda-number-field>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-number-field input');
      return { invalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an existing error element with the error text and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-number-field input_id="input" error_message="Amount too high"></dda-number-field>');

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-number-field input');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id));
      return {
        invalid: el.getAttribute('aria-invalid'),
        ids,
        allExist: texts.every((t) => !!t),
        containsError: texts.some((t) => t?.textContent?.includes('Amount too high')),
      };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.allExist).toBe(true);
    expect(result.containsError).toBe(true);
  });

  it('references both helper text and error message, in reading order, when both are present', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-number-field input_id="input" helper_text="Digits only" error_message="Amount too high"></dda-number-field>'
    );

    const result = await page.evaluate(() => {
      const el = document.querySelector('dda-number-field input');
      const ids = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      return ids.map((id) => document.getElementById(id)?.textContent?.trim());
    });

    expect(result).toEqual(['Digits only', 'Amount too high']);
  });
});

describe('dda-number-field layout', () => {
  it('fits a narrow container', async () => {
    const page = await newE2EPage();
    await page.setContent(`<div style="width: 274px"><dda-number-field></dda-number-field></div>`);

    const overflow = await page.evaluate(() => {
      const cell = document.querySelector('div').getBoundingClientRect();
      return Array.from(document.querySelectorAll('dda-number-field *'))
        .filter(el => el.getBoundingClientRect().right > cell.right + 0.5)
        .map(el => el.className || el.localName);
    });

    expect(overflow).toEqual([]);
  });
});

// WCAG 1.1.1/4.1.2: the dropdown toggle was announced with the icon ligature
// ("keyboard_arrow_down") and had no name that said what it does.
describe('dda-number-field dropdown toggle accessible name', () => {
  it('hides every Material icon from assistive technology', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-number-field input_id="input" placeholder="Enter amount" currencies='["AED","USD"]'></dda-number-field>`);

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-number-field i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });

  it('hides every Material icon from assistive technology (list open)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-number-field input_id="input" placeholder="Enter amount" currencies='["AED","USD"]'></dda-number-field>`);

    await page.click('dda-number-field .dda-dropdown-select');
    await page.waitForChanges();

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-number-field i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });

  it('names the toggle "Choose currency: USD" by default', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-number-field input_id="input" placeholder="Enter amount" currencies='["AED","USD"]'></dda-number-field>`);

    const name = await page.evaluate(() => document.querySelector('dda-number-field .dda-dropdown-select').getAttribute('aria-label'));

    expect(name).toBe('Choose currency: USD');
  });

  it('uses toggle_button_label when set', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-number-field input_id="input" currencies='["AED","USD"]' selected_currency="AED" toggle_button_label="Currency"></dda-number-field>`);

    const name = await page.evaluate(() => document.querySelector('dda-number-field .dda-dropdown-select').getAttribute('aria-label'));

    expect(name).toBe('Currency: AED');
  });

  it('sets aria-expanded on the toggle, false by default and true when open', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-number-field input_id="input" placeholder="Enter amount" currencies='["AED","USD"]'></dda-number-field>`);

    const before = await page.evaluate(() => document.querySelector('dda-number-field .dda-dropdown-select').getAttribute('aria-expanded'));
    await page.click('dda-number-field .dda-dropdown-select');
    await page.waitForChanges();
    const after = await page.evaluate(() => document.querySelector('dda-number-field .dda-dropdown-select').getAttribute('aria-expanded'));

    expect(before).toBe('false');
    expect(after).toBe('true');
  });
});

// WCAG 1.4.3: the global `::placeholder` colour (#8E9191) was 3.18:1 on the
// white field. input.css now uses --dda-on-surface-variant-40 on the field.
// Chromium's getComputedStyle(el, '::placeholder') returns the element's own
// colour, so readPlaceholderColors resolves the winning ::placeholder rule.
describe('dda-number-field placeholder contrast (WCAG 1.4.3)', () => {
  for (const theme of [undefined, 'dark'] as const) {
    const label = theme ? 'dark' : 'light';

    it(`placeholder clears 4.5:1 against the field background in ${label} theme`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-number-field input_id="input" placeholder="Enter amount" currencies='["AED","USD"]'></dda-number-field>`);
      if (theme) {
        await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
        await page.waitForChanges();
      }

      const colors = await page.evaluate(readPlaceholderColors, { field: 'dda-number-field .dda-field-group-input', background: 'dda-number-field .dda-input-field-group' });

      expect(contrastRatio(colors.placeholder, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
