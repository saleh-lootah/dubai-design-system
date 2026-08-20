import { newE2EPage } from '@stencil/core/testing';

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
