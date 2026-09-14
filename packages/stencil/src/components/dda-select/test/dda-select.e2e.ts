import { newE2EPage } from '@stencil/core/testing';
import type { E2EPage } from '@stencil/core/testing';
import type { Page } from 'puppeteer';

// Task 9d — F-021: dda-select's trigger button carries class
// `dda-input-field dda-select-header`, so it routes through the same
// `.dda-validation-error`/`.dda-input-disabled` box-shadow:none clobber as
// dda-input. Neither story sets the native `disabled` attribute on the
// real <button> (dda-select.tsx never wires `this.disabled` onto it), so it
// stays a real, reachable Tab stop.
describe('dda-select focus indicator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\'></dda-select>');

    const element = await page.find('dda-select');
    expect(element).toHaveClass('hydrated');
  });

  it('shows no focus ring before focus (error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\' error="error"></dda-select>');

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-select .dda-select-header') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (error)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\' error="error"></dda-select>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('dda-select-header');
    expect(focused.boxShadow).not.toBe('none');
  });

  it('shows no focus ring before focus (disabled=true)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\' disabled="true"></dda-select>');

    const resting = await page.evaluate(() => {
      const el = document.querySelector('dda-select .dda-select-header') as HTMLElement;
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, boxShadow: s.boxShadow };
    });

    expect(resting.outlineStyle).toBe('none');
    expect(resting.boxShadow).toBe('none');
  });

  it('shows a real focus ring under keyboard focus (disabled=true)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\' disabled="true"></dda-select>');

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return { cls: el.className, boxShadow: s.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('dda-select-header');
    expect(focused.boxShadow).not.toBe('none');
  });
});

// F-016: same systemic error-labelling gap; here the "field" is the trigger
// button, not a native <input>.
describe('dda-select F-016 error labelling', () => {
  it('has no aria-invalid/aria-describedby on the trigger when there is no error or helper text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-select button_id="button" options=\'["Option 1"]\'></dda-select>');

    const result = await page.evaluate(() => {
      const trigger = document.querySelector('dda-select .dda-select-header');
      return { invalid: trigger.getAttribute('aria-invalid'), describedby: trigger.getAttribute('aria-describedby') };
    });

    expect(result.invalid).toBeNull();
    expect(result.describedby).toBeNull();
  });

  it('points aria-describedby at an existing error element with the error text and sets aria-invalid=true', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<dda-select button_id="button" options=\'["Option 1"]\' error_message="Pick one"></dda-select>'
    );

    const result = await page.evaluate(() => {
      const trigger = document.querySelector('dda-select .dda-select-header');
      const ids = (trigger.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      const texts = ids.map((id) => document.getElementById(id));
      return {
        invalid: trigger.getAttribute('aria-invalid'),
        ids,
        allExist: texts.every((t) => !!t),
        containsError: texts.some((t) => t?.textContent?.includes('Pick one')),
      };
    });

    expect(result.invalid).toBe('true');
    expect(result.ids.length).toBeGreaterThan(0);
    expect(result.allExist).toBe(true);
    expect(result.containsError).toBe(true);
  });
});

// Task 9e — F-014: dda-select is a custom combobox-like widget that had no
// aria-haspopup, aria-expanded, or aria-controls on the trigger, and no
// role="listbox"/"option" on the popup — a screen reader user had no idea
// the button opened a list, whether it was open, or what was selected.
// Repair: the ARIA 1.2 "select-only combobox" listbox pattern —
// aria-haspopup="listbox"/aria-expanded on the trigger, role="listbox" on
// the popup with role="option"/aria-selected on each item, plus the
// keyboard behaviour that role implies (ArrowDown/Up open and move focus
// among options, Home/End jump to the ends, Enter/Space select and close
// returning focus to the trigger, Escape closes without selecting and
// returns focus to the trigger). aria-controls is only ever rendered while
// the listbox is actually mounted, because the popup is conditionally
// rendered (unmounted, not just hidden) when closed — an aria-controls
// pointing at an id with nothing behind it is worse than none at all.
const OPTIONS = '["Small","Medium","Large"]';

describe('dda-select listbox pattern (F-014)', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    const element = await page.find('dda-select');
    expect(element).toHaveClass('hydrated');
  });

  it('trigger advertises the popup via aria-haspopup and aria-expanded, closed by default', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    const trigger = await page.find('dda-select .dda-select-header');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    // Closed: the listbox isn't mounted, so aria-controls must not point at
    // a dangling id.
    expect(trigger.getAttribute('aria-controls')).toBeNull();
  });

  it('opening sets aria-expanded=true and aria-controls to the real, mounted listbox id', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    const trigger = await page.find('dda-select .dda-select-header');
    await trigger.click();
    await page.waitForChanges();

    const refreshedTrigger = await page.find('dda-select .dda-select-header');
    expect(refreshedTrigger.getAttribute('aria-expanded')).toBe('true');
    const controlsId = refreshedTrigger.getAttribute('aria-controls');
    expect(controlsId).not.toBeNull();

    const listbox = await page.find(`dda-select #${controlsId}`);
    expect(listbox).not.toBeNull();
    expect(listbox.getAttribute('role')).toBe('listbox');
  });

  it('each option carries role="option" and aria-selected reflecting the real selection', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}' selected="Medium"></dda-select>`);

    const trigger = await page.find('dda-select .dda-select-header');
    await trigger.click();
    await page.waitForChanges();

    const options = await page.findAll('dda-select [role="option"]');
    expect(options).toHaveLength(3);
    expect(options[0].getAttribute('aria-selected')).toBe('false');
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    expect(options[2].getAttribute('aria-selected')).toBe('false');
  });

  it('ArrowDown from the trigger opens the list and moves focus to the first option', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    const focusedText = await page.evaluate(() => (document.activeElement ? document.activeElement.textContent.trim() : null));
    expect(focusedText).toBe('Small');

    const trigger = await page.find('dda-select .dda-select-header');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  // Final-fix-wave: `.dda-input-dropdown-item:focus-visible` was paired
  // with `:hover` (same background-color, `outline: 0`) — a 1.13:1
  // background-only change, indistinguishable from a stray pointer resting
  // on the item. Fix: `:focus-visible` now gets the shared double
  // box-shadow ring (white + dark), split out of the `:hover` pairing so
  // the two states are visually distinct. This asserts the *computed*
  // outcome, not that a CSS rule with the right selector merely exists —
  // it fails against the pre-fix rule (boxShadow stays 'none' under
  // focus-visible there).
  it('gives the focused option a real, computed focus indicator distinct from hover', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { boxShadow: s.boxShadow, outlineStyle: s.outlineStyle };
    });

    expect(focused.boxShadow).not.toBe('none');
    expect(focused.boxShadow).toMatch(/rgb/);

    // The hover-only background must not be the entire story: a mouse
    // hovering a *different*, non-focused option should not carry the same
    // box-shadow ring the focused option has.
    const hoveredOnlyBoxShadow = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.dda-input-dropdown-item')) as HTMLElement[];
      const nonFocused = items.find((el) => el !== document.activeElement);
      return nonFocused ? getComputedStyle(nonFocused).boxShadow : null;
    });
    expect(hoveredOnlyBoxShadow).toBe('none');
  });

  it('gives the focused option the same real focus indicator in dark theme', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForChanges();

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    const focused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      return getComputedStyle(el).boxShadow;
    });

    expect(focused).not.toBe('none');
    expect(focused).toMatch(/rgb/);
  });

  it('ArrowDown/ArrowUp move focus between options without wrapping past the ends', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown'); // opens, focuses "Small"
    await page.waitForChanges();
    await page.keyboard.press('ArrowDown'); // -> "Medium"
    await page.waitForChanges();

    let focusedText = await page.evaluate(() => document.activeElement.textContent.trim());
    expect(focusedText).toBe('Medium');

    await page.keyboard.press('ArrowDown'); // -> "Large"
    await page.waitForChanges();
    await page.keyboard.press('ArrowDown'); // already last, stays
    await page.waitForChanges();

    focusedText = await page.evaluate(() => document.activeElement.textContent.trim());
    expect(focusedText).toBe('Large');

    await page.keyboard.press('ArrowUp'); // -> back to "Medium"
    await page.waitForChanges();
    focusedText = await page.evaluate(() => document.activeElement.textContent.trim());
    expect(focusedText).toBe('Medium');
  });

  it('Home/End jump focus to the first/last option', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();

    await page.keyboard.press('End');
    await page.waitForChanges();
    let focusedText = await page.evaluate(() => document.activeElement.textContent.trim());
    expect(focusedText).toBe('Large');

    await page.keyboard.press('Home');
    await page.waitForChanges();
    focusedText = await page.evaluate(() => document.activeElement.textContent.trim());
    expect(focusedText).toBe('Small');
  });

  it('Enter on an option selects it, closes the list, and returns focus to the trigger', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown'); // focus "Small"
    await page.waitForChanges();
    await page.keyboard.press('ArrowDown'); // focus "Medium"
    await page.waitForChanges();
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    const trigger = await page.find('dda-select .dda-select-header');
    expect(trigger.textContent.trim()).toContain('Medium');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    const focusedCls = await page.evaluate(() => (document.activeElement as HTMLElement).className);
    expect(focusedCls).toContain('dda-select-header');

    const listbox = await page.find('dda-select [role="listbox"]');
    expect(listbox).toBeNull();
  });

  it('Escape on an option closes the list without changing the selection, and returns focus to the trigger', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}' selected="Small"></dda-select>`);

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown'); // opens, focuses selected "Small"
    await page.waitForChanges();
    await page.keyboard.press('ArrowDown'); // focus moves to "Medium" (not selected)
    await page.waitForChanges();
    await page.keyboard.press('Escape');
    await page.waitForChanges();

    const trigger = await page.find('dda-select .dda-select-header');
    expect(trigger.textContent.trim()).toContain('Small'); // unchanged
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    const focusedCls = await page.evaluate(() => (document.activeElement as HTMLElement).className);
    expect(focusedCls).toContain('dda-select-header');
  });

  it('mouse click on an option still selects and closes (baseline unaffected)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);

    const trigger = await page.find('dda-select .dda-select-header');
    await trigger.click();
    await page.waitForChanges();

    const options = await page.findAll('dda-select [role="option"]');
    await options[2].click();
    await page.waitForChanges();

    const refreshedTrigger = await page.find('dda-select .dda-select-header');
    expect(refreshedTrigger.textContent.trim()).toContain('Large');
    expect(refreshedTrigger.getAttribute('aria-expanded')).toBe('false');
  });
});

// WCAG 1.1.1/4.1.2: the arrow icon's ligature text ("keyboard_arrow_down")
// was part of the trigger's accessible name.
describe('dda-select decorative icons', () => {
  it('hides every Material icon from assistive technology', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="select" label="City" options='["Dubai","Sharjah"]'></dda-select>`);

    const icons = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dda-select i.material-icons')).map((i) => i.getAttribute('aria-hidden')),
    );

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((hidden) => expect(hidden).toBe('true'));
  });

  it('keeps the icon ligature out of the trigger name when the list is open', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="select" label="City" options='["Dubai","Sharjah"]'></dda-select>`);
    await page.click('dda-select .dda-select-header');
    await page.waitForChanges();

    const hidden = await page.evaluate(() => document.querySelector('dda-select .dda-select-header i').getAttribute('aria-hidden'));

    expect(hidden).toBe('true');
  });
});

describe('dda-select selectionChange', () => {
  it('emits the picked option on mouse click', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);
    const spy = await page.spyOnEvent('selectionChange');

    await page.click('dda-select .dda-select-header');
    await page.waitForChanges();
    const options = await page.findAll('dda-select [role="option"]');
    await options[1].click();
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventTimes(1);
    expect(spy).toHaveReceivedEventDetail({ value: 'Medium' });
    const el = await page.find('dda-select');
    expect(await el.getProperty('selected')).toBe('Medium');
  });

  it('emits the picked option on Enter', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);
    const spy = await page.spyOnEvent('selectionChange');

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown'); // opens, focuses "Small"
    await page.waitForChanges();
    await page.keyboard.press('End'); // focus "Large"
    await page.waitForChanges();
    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventTimes(1);
    expect(spy).toHaveReceivedEventDetail({ value: 'Large' });
  });

  it('emits the picked option on Space', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}'></dda-select>`);
    const spy = await page.spyOnEvent('selectionChange');

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown'); // opens, focuses "Small"
    await page.waitForChanges();
    await page.keyboard.press('Space');
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventTimes(1);
    expect(spy).toHaveReceivedEventDetail({ value: 'Small' });
  });

  it('does not emit when the user closes the list with Escape', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}' selected="Small"></dda-select>`);
    const spy = await page.spyOnEvent('selectionChange');

    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    await page.keyboard.press('Escape');
    await page.waitForChanges();

    expect(spy).not.toHaveReceivedEvent();
  });

  it('does not emit when the user picks the option that is already selected', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" options='${OPTIONS}' selected="Medium"></dda-select>`);
    const spy = await page.spyOnEvent('selectionChange');

    await page.click('dda-select .dda-select-header');
    await page.waitForChanges();
    const options = await page.findAll('dda-select [role="option"]');
    await options[1].click();
    await page.waitForChanges();

    expect(spy).not.toHaveReceivedEvent();
  });
});

// WCAG 1.3.1/4.1.2 (WAVE "Orphaned form label"): without button_id the label
// got for="" and the list id became "undefined-listbox". label[for] also
// replaced the trigger text as its name, so the selected value was not announced.
describe('dda-select label wiring', () => {
  const readWiring = () =>
    Array.from(document.querySelectorAll('dda-select')).map((host) => {
      const label = host.querySelector('label.dda-input-label');
      const trigger = host.querySelector('.dda-select-header');
      return {
        labelId: label.id,
        labelFor: label.getAttribute('for'),
        triggerId: trigger.id,
        labelledBy: trigger.getAttribute('aria-labelledby'),
      };
    });

  // Name of the trigger from Chrome's accessibility tree.
  const triggerName = async (page: E2EPage) => {
    const puppeteerPage = page as unknown as Page;
    const trigger = await puppeteerPage.$('dda-select .dda-select-header');
    const snapshot = await puppeteerPage.accessibility.snapshot({ root: trigger, interestingOnly: false });
    return snapshot?.name;
  };

  it('generates unique, non-empty ids when button_id is not set', async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<dda-select label="City" options='${OPTIONS}' helper_text="Pick one"></dda-select><dda-select label="Size" options='${OPTIONS}'></dda-select>`,
    );

    const wiring = await page.evaluate(readWiring);

    expect(wiring).toHaveLength(2);
    wiring.forEach((w) => {
      expect(w.triggerId).toBeTruthy();
      expect(w.labelId).toBe(`${w.triggerId}-label`);
      expect(w.labelledBy).toBe(`${w.triggerId}-label ${w.triggerId}`);
      expect(w.labelFor).toBeNull();
      expect(`${w.triggerId} ${w.labelId} ${w.labelledBy}`).not.toContain('undefined');
    });
    expect(wiring[0].triggerId).not.toBe(wiring[1].triggerId);

    const describedBy = await page.evaluate(() => document.querySelector('dda-select .dda-select-header').getAttribute('aria-describedby'));
    expect(describedBy).toBe(`${wiring[0].triggerId}-helper`);
  });

  it('builds the listbox id from the generated id', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select label="City" options='${OPTIONS}'></dda-select>`);

    await page.click('dda-select .dda-select-header');
    await page.waitForChanges();

    const result = await page.evaluate(() => {
      const trigger = document.querySelector('dda-select .dda-select-header');
      const controls = trigger.getAttribute('aria-controls');
      return { triggerId: trigger.id, controls, listboxRole: document.getElementById(controls)?.getAttribute('role') };
    });

    expect(result.controls).toBe(`${result.triggerId}-listbox`);
    expect(result.controls).not.toContain('undefined');
    expect(result.listboxRole).toBe('listbox');
  });

  it('uses button_id when it is set', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" label="Size" options='${OPTIONS}'></dda-select>`);

    const wiring = await page.evaluate(readWiring);

    expect(wiring).toEqual([{ labelId: 'size-label', labelFor: null, triggerId: 'size', labelledBy: 'size-label size' }]);
  });

  it('does not add aria-labelledby when there is no visible label', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="size" aria_label="Size" options='${OPTIONS}'></dda-select>`);

    const attrs = await page.evaluate(() => {
      const trigger = document.querySelector('dda-select .dda-select-header');
      return { labelledBy: trigger.getAttribute('aria-labelledby'), label: trigger.getAttribute('aria-label') };
    });

    expect(attrs).toEqual({ labelledBy: null, label: 'Size' });
  });

  it('names the trigger with the label and the current text', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select label="Size" options='${OPTIONS}'></dda-select>`);

    expect(await triggerName(page)).toBe('Size Select an option');

    await page.click('dda-select .dda-select-header');
    await page.waitForChanges();
    const options = await page.findAll('dda-select [role="option"]');
    await options[2].click();
    await page.waitForChanges();

    expect(await triggerName(page)).toBe('Size Large');
  });

  it('opens the list and focuses the trigger when the label is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select label="Size" options='${OPTIONS}'></dda-select>`);

    await page.click('dda-select label.dda-input-label');
    await page.waitForChanges();

    const result = await page.evaluate(() => ({
      expanded: document.querySelector('dda-select .dda-select-header').getAttribute('aria-expanded'),
      focusedCls: (document.activeElement as HTMLElement).className,
    }));

    expect(result.expanded).toBe('true');
    expect(result.focusedCls).toContain('dda-select-header');
  });
});
