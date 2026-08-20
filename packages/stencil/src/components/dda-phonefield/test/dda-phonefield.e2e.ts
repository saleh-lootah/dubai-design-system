import { newE2EPage } from '@stencil/core/testing';

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
