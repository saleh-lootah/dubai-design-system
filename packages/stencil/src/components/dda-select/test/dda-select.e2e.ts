import { newE2EPage } from '@stencil/core/testing';

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
