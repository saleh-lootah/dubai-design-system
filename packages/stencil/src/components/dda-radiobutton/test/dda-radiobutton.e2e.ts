import { newE2EPage } from '@stencil/core/testing';

describe('dda-radiobutton', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-radiobutton title_text="Small" input_id="r1" group_name="size"></dda-radiobutton>');

    const el = await page.find('dda-radiobutton');
    expect(el).toHaveClass('hydrated');
  });

  it('shows its title and supporting text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-radiobutton title_text="Small" supporting="Fits most" input_id="r1" group_name="size"></dda-radiobutton>');

    const el = await page.find('dda-radiobutton');
    expect(el.textContent).toContain('Small');
    expect(el.textContent).toContain('Fits most');
  });

  // WCAG 2.1.1 / 4.1.2. Tab to the control, select it with the keyboard, and
  // the checked state must actually flip.
  it('can be reached with Tab and selected with Space, and the state actually changes', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-radiobutton title_text="Small" input_id="r1" group_name="size"></dda-radiobutton>');

    await page.keyboard.press('Tab');
    const focusedIsInput = await page.evaluate(() => document.activeElement === document.querySelector('dda-radiobutton input'));
    expect(focusedIsInput).toBe(true);

    const checkedBefore = await page.evaluate(() => (document.querySelector('dda-radiobutton input') as HTMLInputElement).checked);
    expect(checkedBefore).toBe(false);

    await page.keyboard.press('Space');
    await page.waitForChanges();

    const checkedAfter = await page.evaluate(() => (document.querySelector('dda-radiobutton input') as HTMLInputElement).checked);
    expect(checkedAfter).toBe(true);
  });

  // Two radios that share a group_name render inputs with a matching native
  // `name`, so the browser enforces mutual exclusion within the group - only
  // one input is ever checked at a time. This is native <input type="radio">
  // behaviour, not something the component implements itself.
  it('shares a native name across a group, so selecting one clears the other', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-radiobutton title_text="Small" input_id="r1" group_name="size" checked></dda-radiobutton>
      <dda-radiobutton title_text="Large" input_id="r2" group_name="size"></dda-radiobutton>
    `);

    const names = await page.evaluate(() => Array.from(document.querySelectorAll('dda-radiobutton input')).map(i => (i as HTMLInputElement).name));
    expect(names[0]).toBe('size');
    expect(names[1]).toBe('size');

    let checked = await page.evaluate(() => Array.from(document.querySelectorAll('dda-radiobutton input')).map(i => (i as HTMLInputElement).checked));
    expect(checked).toEqual([true, false]);

    await page.evaluate(() => {
      const inputs = document.querySelectorAll('dda-radiobutton input');
      (inputs[1] as HTMLInputElement).click();
    });
    await page.waitForChanges();

    checked = await page.evaluate(() => Array.from(document.querySelectorAll('dda-radiobutton input')).map(i => (i as HTMLInputElement).checked));
    expect(checked).toEqual([false, true]);
  });

  // WCAG 4.1.2. The control's accessible name must resolve to the visible
  // title via the <label for> association.
  it('gives the input an accessible name matching the visible title', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-radiobutton title_text="Small" input_id="r1" group_name="size"></dda-radiobutton>');

    const input = await page.find('dda-radiobutton input');
    expect(input.getAttribute('id')).toBe('r1');

    const labelFor = await page.evaluate(() => {
      const label = document.querySelector('dda-radiobutton label');
      return label ? label.getAttribute('for') : null;
    });
    expect(labelFor).toBe('r1');
  });

  it('builds a class from the size and variants props', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-radiobutton title_text="Small" input_id="r1" group_name="size" size="lg" variants="outlined"></dda-radiobutton>');

    const inner = await page.find('dda-radiobutton .dda-radio-container');
    expect(inner).toHaveClass('dda-radio-lg');
    expect(inner).toHaveClass('dda-radio-outlined');
  });
});
