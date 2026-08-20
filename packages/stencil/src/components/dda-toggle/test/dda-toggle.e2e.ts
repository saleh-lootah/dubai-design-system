import { newE2EPage } from '@stencil/core/testing';

describe('dda-toggle', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-toggle input_id="t1" aria_label="Notifications"></dda-toggle>');

    const el = await page.find('dda-toggle');
    expect(el).toHaveClass('hydrated');
  });

  it('starts unchecked and is not checked just because the element rendered', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-toggle input_id="t1" aria_label="Notifications"></dda-toggle>');

    const checked = await page.evaluate(() => (document.querySelector('dda-toggle input') as HTMLInputElement).checked);
    expect(checked).toBe(false);
  });

  it('starts checked when the checked prop is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-toggle input_id="t1" aria_label="Notifications" checked></dda-toggle>');

    const checked = await page.evaluate(() => (document.querySelector('dda-toggle input') as HTMLInputElement).checked);
    expect(checked).toBe(true);
  });

  // WCAG 2.1.1 / 4.1.2. A real user tabs to the control and toggles it with
  // the keyboard; the checked state must actually flip, not merely be
  // declared present.
  it('can be reached with Tab and toggled with Space, and the state actually changes', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-toggle input_id="t1" aria_label="Notifications"></dda-toggle>');

    await page.keyboard.press('Tab');
    const focusedIsInput = await page.evaluate(() => document.activeElement === document.querySelector('dda-toggle input'));
    expect(focusedIsInput).toBe(true);

    await page.keyboard.press('Space');
    await page.waitForChanges();

    const checkedAfter = await page.evaluate(() => (document.querySelector('dda-toggle input') as HTMLInputElement).checked);
    expect(checkedAfter).toBe(true);

    await page.keyboard.press('Space');
    await page.waitForChanges();

    const checkedAfterSecondPress = await page.evaluate(() => (document.querySelector('dda-toggle input') as HTMLInputElement).checked);
    expect(checkedAfterSecondPress).toBe(false);
  });

  // WCAG 4.1.2. The accessible name must resolve, via aria-label since the
  // component has no title-text prop of its own (the "Radio Button Title"
  // text baked into its markup is not a real accessible-name mechanism).
  it('gives the input an accessible name from aria_label', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-toggle input_id="t1" aria_label="Notifications"></dda-toggle>');

    const input = await page.find('dda-toggle input');
    expect(input.getAttribute('aria-label')).toBe('Notifications');
  });

  it('builds a class from the size prop', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-toggle input_id="t1" aria_label="Notifications" size="lg"></dda-toggle>');

    const label = await page.find('dda-toggle .dda-toggle-btn');
    expect(label).toHaveClass('dda-toggle-lg');
  });
});
