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

  // WCAG 1.1.1 / 4.1.2: an icon-only segment was named by its raw ligature
  // ("format_align_left"). The icon is now hidden and the button is named.
  it('hides the icon and names icon-only segments from icon_labels', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='["format_align_left","format_align_center"]' icon_labels='["Align left","Align center"]'></dda-segmented-tabs>`);

    const segments = await page.$$eval('dda-segmented-tabs button', (els: Element[]) =>
      els.map(el => ({ label: el.getAttribute('aria-label'), iconHidden: el.querySelector('i').getAttribute('aria-hidden') })),
    );
    expect(segments).toEqual([
      { label: 'Align left', iconHidden: 'true' },
      { label: 'Align center', iconHidden: 'true' },
    ]);
  });

  it('falls back to the item text without underscores when icon_labels is not set', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='["format_align_left","format_align_center"]'></dda-segmented-tabs>`);

    const labels = await page.$$eval('dda-segmented-tabs button', (els: Element[]) => els.map(el => el.getAttribute('aria-label')));
    expect(labels).toEqual(['format align left', 'format align center']);
  });

  it('does not add aria-label to text segments', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}' icon_labels='["x","y","z"]'></dda-segmented-tabs>`);

    const labels = await page.$$eval('dda-segmented-tabs button', (els: Element[]) => els.map(el => el.getAttribute('aria-label')));
    expect(labels).toEqual([null, null, null]);
  });

  // `items` was JSON.parse'd once in componentWillLoad with no guard: a
  // missing or invalid value threw, and later changes to `items` or
  // `selected_index` were ignored.
  it('renders no segments and logs no errors when the items attribute is missing', async () => {
    const page = await newE2EPage();
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(String(err)));
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await page.setContent('<dda-segmented-tabs></dda-segmented-tabs>');
    await page.waitForChanges();

    const el = await page.find('dda-segmented-tabs');
    expect(el).toHaveClass('hydrated');
    expect(await page.findAll('dda-segmented-tabs button')).toHaveLength(0);
    expect(errors).toEqual([]);
  });

  it('renders no segments and logs no errors when items is invalid JSON', async () => {
    const page = await newE2EPage();
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(String(err)));
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await page.setContent(`<dda-segmented-tabs items='not json'></dda-segmented-tabs>`);
    await page.waitForChanges();

    const el = await page.find('dda-segmented-tabs');
    expect(el).toHaveClass('hydrated');
    expect(await page.findAll('dda-segmented-tabs button')).toHaveLength(0);
    expect(errors).toEqual([]);
  });

  it('re-renders when items changes after load', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);
    expect(await page.findAll('dda-segmented-tabs button')).toHaveLength(3);

    await page.$eval('dda-segmented-tabs', (el: HTMLDdaSegmentedTabsElement, value: string) => (el.items = value), '["One","Two","Three","Four"]');
    await page.waitForChanges();

    const labels = await page.$$eval('dda-segmented-tabs button', (els: Element[]) => els.map(el => el.textContent));
    expect(labels).toEqual(['One', 'Two', 'Three', 'Four']);
  });

  it('moves the selection when selected_index changes after load', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}'></dda-segmented-tabs>`);

    await page.$eval('dda-segmented-tabs', (el: HTMLDdaSegmentedTabsElement) => (el.selected_index = 2));
    await page.waitForChanges();

    const pressed = await page.$$eval('dda-segmented-tabs button', (els: Element[]) => els.map(el => el.getAttribute('aria-pressed')));
    expect(pressed).toEqual(['false', 'false', 'true']);
  });

  it('keeps the selection when items changes and the selected index is still in range', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}' selected_index="1"></dda-segmented-tabs>`);

    await page.$eval('dda-segmented-tabs', (el: HTMLDdaSegmentedTabsElement, value: string) => (el.items = value), '["A","B"]');
    await page.waitForChanges();

    const pressed = await page.$$eval('dda-segmented-tabs button', (els: Element[]) => els.map(el => el.getAttribute('aria-pressed')));
    expect(pressed).toEqual(['false', 'true']);
  });

  it('selects the first segment when items shrinks below the selected index', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-segmented-tabs items='${ITEMS}' selected_index="2"></dda-segmented-tabs>`);

    await page.$eval('dda-segmented-tabs', (el: HTMLDdaSegmentedTabsElement, value: string) => (el.items = value), '["A","B"]');
    await page.waitForChanges();

    const pressed = await page.$$eval('dda-segmented-tabs button', (els: Element[]) => els.map(el => el.getAttribute('aria-pressed')));
    expect(pressed).toEqual(['true', 'false']);
  });
});

describe('dda-segmented-tabs non-string items', () => {
  it('renders numeric items as text instead of throwing', async () => {
    const page = await newE2EPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setContent(`<dda-segmented-tabs items='[2024, 2025]'></dda-segmented-tabs>`);
    await page.waitForChanges();

    const labels = await page.evaluate(() => Array.from(document.querySelectorAll('dda-segmented-tabs button')).map(button => button.textContent.trim()));
    expect(labels).toEqual(['2024', '2025']);
    expect(errors).toEqual([]);
  });
});
