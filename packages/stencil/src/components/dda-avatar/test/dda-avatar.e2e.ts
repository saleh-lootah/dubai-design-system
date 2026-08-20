import { newE2EPage } from '@stencil/core/testing';

const avatar = (attrs = '') => `<dda-avatar type="text" text="AB" options='["Option 1","Option 2"]' ${attrs}></dda-avatar>`;

describe('dda-avatar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-avatar></dda-avatar>');

    const el = await page.find('dda-avatar');
    expect(el).toHaveClass('hydrated');
  });

  it('opens the dropdown on click (mouse baseline)', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const trigger = await page.find('dda-avatar button');
    await trigger.click();
    await page.waitForChanges();

    const list = await page.find('dda-avatar .dda-input-dropdown-list');
    expect(list).not.toBeNull();
  });

  // F-002: the dropdown-toggle root was a plain div with onClick and no
  // tabindex/role/onKeyDown — a keyboard-only user could never open it.
  it('is reachable by Tab and opens the dropdown on Enter', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => (document.activeElement ? document.activeElement.tagName : null));
    expect(focusedTag).toBe('BUTTON');

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    const list = await page.find('dda-avatar .dda-input-dropdown-list');
    expect(list).not.toBeNull();
  });

  it('opens the dropdown on Space as well', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();

    const list = await page.find('dda-avatar .dda-input-dropdown-list');
    expect(list).not.toBeNull();
  });

  it('reflects aria-expanded on the trigger', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const trigger = await page.find('dda-avatar button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await trigger.click();
    await page.waitForChanges();

    const triggerAfter = await page.find('dda-avatar button');
    expect(triggerAfter.getAttribute('aria-expanded')).toBe('true');
  });

  it('gives the trigger an accessible name', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const trigger = await page.find('dda-avatar button');
    expect(trigger.getAttribute('aria-label')).not.toBeNull();
  });
});
