import { newE2EPage } from '@stencil/core/testing';

// F-011 (WCAG 1.4.13, 2.1.1): dda-tooltip only ever showed its content on
// `:hover` (dda-tooltip.css). A keyboard user who tabs to the trigger never
// saw it at all - a gap broader than any single 1.4.13 sub-criterion. Of
// the three 1.4.13 sub-criteria: hoverable and persistent already held
// structurally (the box is a DOM descendant of the hover container, and
// nothing auto-hides it); dismissible without moving the pointer/focus did
// not - there was no Escape handling anywhere.

// position="top" renders the tooltip box above the trigger. Some top
// padding keeps it inside the viewport so Puppeteer can hover it directly.
const tooltip = (extra = '') => `
  <div style="padding-top: 100px;">
    <dda-tooltip title_text="Menu" description="Open the menu" position="top" ${extra}>
      <button id="trigger" type="button">Trigger</button>
    </dda-tooltip>
  </div>
`;

// .dda-tooltip-box carries `transition: opacity 0.3s`, so a programmatic
// focus/keypress can be measured mid-transition. Poll for the settled
// state instead of reading computed style on the very next tick.
async function waitForTooltip(page, expectedVisible, selector = 'dda-tooltip .dda-tooltip-box') {
  await page.waitForFunction(
    (sel, expected) => {
      const box = document.querySelector(sel);
      if (!box) return false;
      const cs = getComputedStyle(box);
      const visible = cs.visibility === 'visible' && parseFloat(cs.opacity) > 0.5;
      return visible === expected;
    },
    { timeout: 2000 },
    selector,
    expectedVisible,
  );
}

async function isVisible(page, selector = 'dda-tooltip .dda-tooltip-box') {
  return page.evaluate(sel => {
    const box = document.querySelector(sel);
    if (!box) return false;
    const cs = getComputedStyle(box);
    return cs.visibility === 'visible' && parseFloat(cs.opacity) > 0.5;
  }, selector);
}

describe('dda-tooltip', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    const el = await page.find('dda-tooltip');
    expect(el).toHaveClass('hydrated');
  });

  it('the slotted trigger is focusable (a precondition for showing on focus)', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    const focused = await page.evaluate(() => {
      const btn = document.getElementById('trigger');
      btn.focus();
      return document.activeElement === btn;
    });
    expect(focused).toBe(true);
  });

  it('is hidden before the trigger is interacted with', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    expect(await isVisible(page)).toBe(false);
  });

  it('shows on hover (existing behaviour, must not regress)', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    const trigger = await page.find('#trigger');
    await trigger.hover();

    await waitForTooltip(page, true);
    expect(await isVisible(page)).toBe(true);
  });

  // The core gap: keyboard focus alone must reveal the tooltip.
  it('shows when the trigger is reached by keyboard (Tab), not just by hover', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    await page.keyboard.press('Tab');
    const focusedTrigger = await page.evaluate(() => document.activeElement && document.activeElement.id === 'trigger');
    expect(focusedTrigger).toBe(true);

    await waitForTooltip(page, true);
    expect(await isVisible(page)).toBe(true);
  });

  // WCAG 1.4.13 dismissible: Escape hides it without moving focus or the pointer.
  it('dismisses on Escape without moving focus off the trigger', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    await page.keyboard.press('Tab');
    await waitForTooltip(page, true);

    await page.keyboard.press('Escape');
    await waitForTooltip(page, false);

    expect(await isVisible(page)).toBe(false);
    const stillFocused = await page.evaluate(() => document.activeElement && document.activeElement.id === 'trigger');
    expect(stillFocused).toBe(true);
  });

  // The tooltip must reappear on a fresh interaction after being dismissed,
  // not stay permanently suppressed.
  it('shows again after the trigger loses and regains focus following an Escape dismissal', async () => {
    const page = await newE2EPage();
    await page.setContent(`${tooltip()}<button id="elsewhere">Elsewhere</button>`);

    await page.keyboard.press('Tab');
    await waitForTooltip(page, true);

    await page.keyboard.press('Escape');
    await waitForTooltip(page, false);

    await page.evaluate(() => document.getElementById('elsewhere').focus());
    await page.waitForChanges();
    await page.evaluate(() => document.getElementById('trigger').focus());

    await waitForTooltip(page, true);
    expect(await isVisible(page)).toBe(true);
  });

  // WCAG 1.4.13 hoverable: the pointer can move from the trigger onto the
  // tooltip content itself without it disappearing.
  it('stays visible when the pointer moves onto the tooltip content (hoverable)', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    const trigger = await page.find('#trigger');
    await trigger.hover();
    await waitForTooltip(page, true);

    const box = await page.find('dda-tooltip .dda-tooltip-box');
    await box.hover();
    await page.waitForChanges();

    expect(await isVisible(page)).toBe(true);
  });

  // WCAG 1.4.13 persistent: nothing auto-hides it while focus/hover remain.
  it('stays visible over time while focused (persistent, no auto-hide)', async () => {
    const page = await newE2EPage();
    await page.setContent(tooltip());

    await page.keyboard.press('Tab');
    await waitForTooltip(page, true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(await isVisible(page)).toBe(true);
  });
});
