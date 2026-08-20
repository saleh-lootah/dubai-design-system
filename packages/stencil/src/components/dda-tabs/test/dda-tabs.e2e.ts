import { newE2EPage } from '@stencil/core/testing';

// F-010: dda-tabs implemented no WAI tabs pattern on any axis — no
// role="tablist"/"tab", aria-selected reflected only a CSS class, no
// arrow-key handling. But dda-tabs renders no panel and references none:
// it is a row of buttons that emits a `tabClick` index and leaves whatever
// "panel" exists entirely to the consumer (see dda-tabs.stories.tsx /
// dda-tabs-docs.mdx — neither shows a panel). Per the ruling applied
// earlier to dda-segmented-tabs: role="tablist"/"tab"/"tabpanel" require
// panels the component actually owns or references. Claiming that pattern
// here would announce a tab/tabpanel relationship that does not exist —
// worse than no ARIA at all. So this repair follows the same honest
// alternative dda-segmented-tabs used: role="group" with an accessible
// name, aria-pressed reflecting the real selection state, and native
// button keyboard operability (Tab order, Enter/Space activation) — no
// invented roving-tabindex/arrow-key behaviour that only the tab pattern
// calls for.

const TEXTS = '["Overview","Pricing","FAQ"]';

describe('dda-tabs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-tabs tab_texts='${TEXTS}'></dda-tabs>`);

    const el = await page.find('dda-tabs');
    expect(el).toHaveClass('hydrated');
  });

  it('has role="group" with an accessible name on the container', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-tabs tab_texts='${TEXTS}' aria_label="Site sections"></dda-tabs>`);

    const container = await page.find('dda-tabs .dda-tabs-container');
    expect(container.getAttribute('role')).toBe('group');
    expect(container.getAttribute('aria-label')).toBe('Site sections');
  });

  it('does not use the tab pattern — no role="tablist"/"tab"/"tabpanel" anywhere (dda-tabs owns no panel)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-tabs tab_texts='${TEXTS}'></dda-tabs>`);

    expect(await page.find('dda-tabs [role="tablist"]')).toBeNull();
    expect(await page.find('dda-tabs [role="tab"]')).toBeNull();
    expect(await page.find('dda-tabs [role="tabpanel"]')).toBeNull();
  });

  it('marks the active tab with a real aria-pressed state, not just a CSS class', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-tabs tab_texts='${TEXTS}'></dda-tabs>`);

    const buttons = await page.findAll('dda-tabs button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[0].className).toContain('active');
  });

  it('moves aria-pressed and the active class to the clicked tab, and emits tabClick', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-tabs tab_texts='${TEXTS}'></dda-tabs>`);

    // Spy must be attached after setContent — setContent replaces the
    // document and discards any earlier listener.
    const clickSpy = await page.spyOnEvent('tabClick');

    const buttons = await page.findAll('dda-tabs button');
    await buttons[1].click();
    await page.waitForChanges();

    const refreshed = await page.findAll('dda-tabs button');
    expect(refreshed[0].getAttribute('aria-pressed')).toBe('false');
    expect(refreshed[1].getAttribute('aria-pressed')).toBe('true');
    expect(refreshed[1].className).toContain('active');
    expect(clickSpy).toHaveReceivedEventDetail(1);
  });

  it('is reachable by Tab and activatable with Enter (native button semantics)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-tabs tab_texts='${TEXTS}'></dda-tabs>`);

    const clickSpy = await page.spyOnEvent('tabClick');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedText = await page.evaluate(() => (document.activeElement ? document.activeElement.textContent : null));
    expect(focusedText).toBe('Pricing');

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEventDetail(1);
    const buttons = await page.findAll('dda-tabs button');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });
});
