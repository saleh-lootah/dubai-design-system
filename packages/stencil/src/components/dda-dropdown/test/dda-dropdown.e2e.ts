import { newE2EPage } from '@stencil/core/testing';

// Task 9d — F-021: `.dda-dropdown-container.bg-transparent .dda-dropdown-header`
// (global/input.css) sets `box-shadow: none` unconditionally at higher
// specificity (3 classes) than the base `.dda-input-field:focus` ring (2
// classes) it shares via its `dda-input-field` class, so the ring never
// renders on the `type="bg-transparent"` variant regardless of focus state.
describe('dda-dropdown focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-dropdown button_id="dropdown" options=\'["Option 1"]\'></dda-dropdown>');

    const element = await page.find('dda-dropdown');
    expect(element).toHaveClass('hydrated');
  });

  it('shows no focus ring before focus (type=bg-transparent)', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-dropdown button_id="dropdown" options=\'["Option 1"]\' type="bg-transparent"></dda-dropdown>',
    );

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-dropdown .dda-dropdown-header') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (type=bg-transparent)', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-dropdown button_id="dropdown" options=\'["Option 1"]\' type="bg-transparent"></dda-dropdown>',
    );

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('dda-dropdown-header');
    expect(focused.boxShadow).not.toBe('none');
  });
});

// WCAG 1.1.1/4.1.2: "more_vert" and "keyboard_arrow_down" ligature text was
// announced as part of the button name, and the icon-only button had no name.
describe('dda-dropdown accessible name', () => {
  it('hides every Material icon from assistive technology', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-dropdown button_id="dropdown" options='["Option 1"]'></dda-dropdown>`);

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-dropdown i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });

  it('names the icon-only button "Show options" by default', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-dropdown button_id="dropdown" icon_mode="true" options='["Option 1"]'></dda-dropdown>`);

    const name = await page.evaluate(() => document.querySelector('dda-dropdown .dda-dropdown-header').getAttribute('aria-label'));

    expect(name).toBe('Show options');
  });

  it('uses toggle_button_label, and aria_label wins over it', async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<dda-dropdown button_id="a" icon_mode="true" toggle_button_label="More actions" options='["Option 1"]'></dda-dropdown>` +
        `<dda-dropdown button_id="b" icon_mode="true" toggle_button_label="More actions" aria_label="File actions" options='["Option 1"]'></dda-dropdown>`,
    );

    const names = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-dropdown .dda-dropdown-header')).map((b) => b.getAttribute('aria-label')),
    );

    expect(names).toEqual(['More actions', 'File actions']);
  });

  it('sets aria-expanded on the button, false by default and true when open', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-dropdown button_id="dropdown" icon_mode="true" options='["Option 1"]'></dda-dropdown>`);

    const before = await page.evaluate(() => document.querySelector('dda-dropdown .dda-dropdown-header').getAttribute('aria-expanded'));
    await page.click('dda-dropdown .dda-dropdown-header');
    await page.waitForChanges();
    const after = await page.evaluate(() => document.querySelector('dda-dropdown .dda-dropdown-header').getAttribute('aria-expanded'));

    expect(before).toBe('false');
    expect(after).toBe('true');
  });
});

describe('dda-dropdown optionSelect', () => {
  const OPTIONS = '["Edit","Download","Delete"]';

  it('emits the picked option and updates selected', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-dropdown button_id="dropdown" options='${OPTIONS}'></dda-dropdown>`);
    const spy = await page.spyOnEvent('optionSelect');

    await page.click('dda-dropdown .dda-dropdown-header');
    await page.waitForChanges();
    const items = await page.findAll('dda-dropdown .dda-input-dropdown-list .dda-input-dropdown-item');
    expect(items).toHaveLength(3);
    await items[1].click();
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventTimes(1);
    expect(spy).toHaveReceivedEventDetail({ value: 'Download' });
    const el = await page.find('dda-dropdown');
    expect(await el.getProperty('selected')).toBe('Download');
  });

  it('emits when the user picks with the keyboard (Enter on an option)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-dropdown button_id="dropdown" icon_mode="true" options='${OPTIONS}'></dda-dropdown>`);
    const spy = await page.spyOnEvent('optionSelect');

    await page.click('dda-dropdown .dda-dropdown-header');
    await page.waitForChanges();
    await page.focus('dda-dropdown .dda-input-dropdown-list .dda-input-dropdown-item:last-child');
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventDetail({ value: 'Delete' });
  });

  it('does not emit when the user only opens and closes the list', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-dropdown button_id="dropdown" options='${OPTIONS}'></dda-dropdown>`);
    const spy = await page.spyOnEvent('optionSelect');

    await page.click('dda-dropdown .dda-dropdown-header');
    await page.waitForChanges();
    await page.click('dda-dropdown .dda-dropdown-header');
    await page.waitForChanges();

    expect(spy).not.toHaveReceivedEvent();
  });
});
