import { newE2EPage } from '@stencil/core/testing';

// F-004: dda-segmented-tabs rendered a row of buttons with no onClick, no
// @State, and no selection tracking anywhere in the file. Clicking a segment
// did nothing at all — not a keyboard-vs-mouse gap, the component had no
// interactivity. These tests first prove that (RED), then verify the real
// behaviour: a mutually-exclusive toggle-button group with role="group" and
// aria-pressed (not role="tablist"/"tab" — there are no associated
// tabpanels, so that relationship would be a lie), a default selection, a
// click handler, keyboard operability via native <button> semantics, and a
// segmentChange event a consumer can react to.

const ITEMS = '["All","Recent","Saved"]';

describe('dda-segmented-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    const el = await page.find('dda-segmented-tabs');
    expect(el).toHaveClass('hydrated');
  });

  it('has role="group" with an accessible name', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}' aria_label="Filter results"></dda-segmented-tabs>`);

    const group = await page.find('dda-segmented-tabs .dda-segmented-group');
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Filter results');
  });

  it('does not use the tab pattern — no role="tablist"/"tab" anywhere', async () => {
    // A tablist whose tabs control no tabpanel announces a relationship to a
    // screen-reader user that does not exist. This component has no panels
    // and cannot know about any, so it must not claim the tab pattern.
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    const tablist = await page.find('dda-segmented-tabs [role="tablist"]');
    const tab = await page.find('dda-segmented-tabs [role="tab"]');
    expect(tablist).toBeNull();
    expect(tab).toBeNull();
  });

  it('selects the first segment by default, exclusively', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    const buttons = await page.findAll('dda-segmented-tabs button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[0].className).toContain('active');
    expect(buttons[1].className).not.toContain('active');
  });

  it('moves selection to the clicked segment (mouse baseline)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    const buttons = await page.findAll('dda-segmented-tabs button');
    await buttons[1].click();
    await page.waitForChanges();

    const refreshed = await page.findAll('dda-segmented-tabs button');
    expect(refreshed[0].getAttribute('aria-pressed')).toBe('false');
    expect(refreshed[1].getAttribute('aria-pressed')).toBe('true');
    expect(refreshed[2].getAttribute('aria-pressed')).toBe('false');
    expect(refreshed[1].className).toContain('active');
  });

  it('emits segmentChange with the selected index on click', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    // The spy must be attached after setContent, because setContent
    // replaces the document and discards any earlier listener.
    const changeSpy = await page.spyOnEvent('segmentChange');

    const buttons = await page.findAll('dda-segmented-tabs button');
    await buttons[2].click();
    await page.waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail(2);
  });

  it('is reachable by Tab and selectable with Enter', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    const changeSpy = await page.spyOnEvent('segmentChange');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedText = await page.evaluate(() => (document.activeElement ? document.activeElement.textContent : null));
    expect(focusedText).toBe('Recent');

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail(1);
    const buttons = await page.findAll('dda-segmented-tabs button');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('is selectable with Space as well', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    const changeSpy = await page.spyOnEvent('segmentChange');

    const buttons = await page.findAll('dda-segmented-tabs button');
    await buttons[2].focus();
    await page.keyboard.press('Space');
    await page.waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail(2);
  });

  it('honours a non-zero default selection via selected_index', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}' selected_index="2"></dda-segmented-tabs>`);

    const buttons = await page.findAll('dda-segmented-tabs button');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
  });

  it('remains interactive for icon-heuristic items (the "fo" branch)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='["format_align_left","format_align_center"]'></dda-segmented-tabs>`);

    const changeSpy = await page.spyOnEvent('segmentChange');
    const buttons = await page.findAll('dda-segmented-tabs button');
    await buttons[1].click();
    await page.waitForChanges();

    expect(changeSpy).toHaveReceivedEventDetail(1);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });
});
