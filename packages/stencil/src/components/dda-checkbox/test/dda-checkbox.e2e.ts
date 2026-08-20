import { newE2EPage } from '@stencil/core/testing';

describe('dda-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-checkbox title_text="Subscribe" input_id="cb1"></dda-checkbox>');

    const el = await page.find('dda-checkbox');
    expect(el).toHaveClass('hydrated');
  });

  it('shows its title and supporting text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-checkbox title_text="Subscribe" supporting="Weekly digest" input_id="cb1"></dda-checkbox>');

    const el = await page.find('dda-checkbox');
    expect(el.textContent).toContain('Subscribe');
    expect(el.textContent).toContain('Weekly digest');
  });

  it('starts unchecked and is not checked just because the element rendered', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-checkbox title_text="Subscribe" input_id="cb1"></dda-checkbox>');

    const checked = await page.evaluate(() => (document.querySelector('dda-checkbox input') as HTMLInputElement).checked);
    expect(checked).toBe(false);
  });

  // WCAG 2.1.1 / 4.1.2. A real user tabs to the control, toggles it with the
  // keyboard, and the checked state must actually flip - not merely exist as
  // an attribute the component happened to declare.
  it('can be reached with Tab and toggled with Space, and the state actually changes', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-checkbox title_text="Subscribe" input_id="cb1"></dda-checkbox>');

    await page.keyboard.press('Tab');
    const focusedIsInput = await page.evaluate(() => {
      const input = document.querySelector('dda-checkbox input');
      return document.activeElement === input;
    });
    expect(focusedIsInput).toBe(true);

    await page.keyboard.press('Space');
    await page.waitForChanges();

    const checkedAfter = await page.evaluate(() => (document.querySelector('dda-checkbox input') as HTMLInputElement).checked);
    expect(checkedAfter).toBe(true);

    await page.keyboard.press('Space');
    await page.waitForChanges();

    const checkedAfterSecondPress = await page.evaluate(() => (document.querySelector('dda-checkbox input') as HTMLInputElement).checked);
    expect(checkedAfterSecondPress).toBe(false);
  });

  // WCAG 4.1.2. The control's accessible name must resolve to the visible
  // title, via the <label for> association - not merely be present as text
  // somewhere on the page.
  it('gives the input an accessible name matching the visible title', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-checkbox title_text="Subscribe" input_id="cb1"></dda-checkbox>');

    const input = await page.find('dda-checkbox input');
    expect(input.getAttribute('id')).toBe('cb1');

    const labelFor = await page.evaluate(() => {
      const label = document.querySelector('dda-checkbox label');
      return label ? label.getAttribute('for') : null;
    });
    expect(labelFor).toBe('cb1');
  });

  it('builds a class from the size and style_type props', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-checkbox title_text="Subscribe" input_id="cb1" size="lg" style_type="round"></dda-checkbox>');

    const inner = await page.find('dda-checkbox .dda-checkbox-container');
    expect(inner).toHaveClass('dda-checkbox-lg');
    expect(inner).toHaveClass('dda-checkbox-round');
  });
});
