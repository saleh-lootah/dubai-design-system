import { newE2EPage } from '@stencil/core/testing';

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
