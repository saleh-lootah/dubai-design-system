import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';

const avatar = (attrs = '') => `<dda-avatar type="text" text="AB" options='["Option 1","Option 2"]' ${attrs}></dda-avatar>`;

describe('dda-avatar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-avatar></dda-avatar>');

    const el = await page.find('dda-avatar');
    expect(el).toHaveClass('hydrated');
  });

  // F-002's repair (a real <button class="avatar-trigger">) was applied
  // unconditionally, with no options prop consulted — so a decorative
  // avatar with no options became a Tab stop announcing "Avatar options"
  // and opening a menu reading "No options available". Fix: the trigger is
  // only a <button> when parsedOptions.length > 0; otherwise it's a plain,
  // non-interactive <div class="avatar-trigger">. This test fails against
  // the unconditional-button code and passes against the fix.
  it('exposes no focusable control when there are no options', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-avatar type="photo" src="x.png"></dda-avatar>');

    await page.keyboard.press('Tab');
    const focusLandedInsideAvatar = await page.evaluate(() => {
      const active = document.activeElement;
      const avatar = document.querySelector('dda-avatar');
      return !!(active && avatar && avatar.contains(active));
    });
    expect(focusLandedInsideAvatar).toBe(false);

    const trigger = await page.find('dda-avatar .avatar-trigger');
    expect(trigger).not.toBeNull();
    expect(trigger.tagName).toBe('DIV');

    const button = await page.find('dda-avatar button.avatar-trigger');
    expect(button).toBeNull();
  });

  // The dropdown list must not precede the trigger in DOM order — that
  // would put it before the trigger in tab order (Shift-Tab would reach
  // menu items; Tab would leave the component before ever reaching the
  // trigger that opens them).
  it('renders the trigger before the dropdown list in DOM order', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const trigger = await page.find('dda-avatar button.avatar-trigger');
    await trigger.click();
    await page.waitForChanges();

    const order = await page.evaluate(() => {
      const root = document.querySelector('dda-avatar > div.dda-avatar') as HTMLElement;
      const children = Array.from(root.children).map(c => c.className);
      const triggerIndex = children.findIndex(c => c.includes('avatar-trigger'));
      const listIndex = children.findIndex(c => c.includes('dda-input-dropdown-list'));
      return { triggerIndex, listIndex };
    });
    expect(order.triggerIndex).toBeGreaterThanOrEqual(0);
    expect(order.listIndex).toBeGreaterThanOrEqual(0);
    expect(order.triggerIndex).toBeLessThan(order.listIndex);
  });

  // F-002's repair must not change the published custom element's DOM shape:
  // the original root was <dda-avatar><div class="dda-avatar">...</div></dda-avatar>,
  // and it still is — only a button was added inside that div, wrapping the
  // photo/icon/text.
  it('keeps the original div.dda-avatar as the custom element\'s direct child', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const root = await page.find('dda-avatar > div.dda-avatar');
    expect(root).not.toBeNull();
  });

  it('opens the dropdown on click (mouse baseline)', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const trigger = await page.find('dda-avatar button.avatar-trigger');
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

    const trigger = await page.find('dda-avatar button.avatar-trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await trigger.click();
    await page.waitForChanges();

    const triggerAfter = await page.find('dda-avatar button.avatar-trigger');
    expect(triggerAfter.getAttribute('aria-expanded')).toBe('true');
  });

  it('gives the trigger an accessible name', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const trigger = await page.find('dda-avatar button.avatar-trigger');
    expect(trigger.getAttribute('aria-label')).not.toBeNull();
  });

  // .dda-input-dropdown-list is position:absolute and relies on div.dda-avatar
  // remaining its nearest positioned ancestor.
  it('keeps div.dda-avatar as the dropdown list\'s positioned ancestor', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const trigger = await page.find('dda-avatar button.avatar-trigger');
    await trigger.click();
    await page.waitForChanges();

    const offsetParentClass = await page.evaluate(() => {
      const list = document.querySelector('dda-avatar .dda-input-dropdown-list') as HTMLElement;
      return list.offsetParent ? (list.offsetParent as HTMLElement).className : null;
    });
    expect(offsetParentClass).toContain('dda-avatar');
  });

  // Behaviour change disclosed in the task report: decorative badges are
  // siblings of the trigger button (not nested inside it, since interactive
  // content can't sit inside a button's accessible name), so a click that
  // lands precisely on a badge no longer bubbles up and toggles the dropdown.
  it('does not toggle when a decorative badge is clicked directly', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar('design="notification" notification_number="3"'));

    const badge = await page.find('dda-avatar .notification-circle');
    await badge.click();
    await page.waitForChanges();

    const trigger = await page.find('dda-avatar button.avatar-trigger');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});

// F-023 (B2): `.avatar-type-text`'s background was the theme-flipping
// `--dda-color-primary-40`, which lightens in dark theme, paired with fixed
// raw white text — 2.30:1 in dark before the fix.
describe('dda-avatar text-type contrast (F-023)', () => {
  it('clears 4.5:1 in light theme', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());

    const colors = await page.evaluate(() => {
      const bg = document.querySelector('dda-avatar .avatar-type-text') as HTMLElement;
      const text = document.querySelector('dda-avatar .avatar-main-text') as HTMLElement;
      return { color: getComputedStyle(text).color, background: getComputedStyle(bg).backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('clears 4.5:1 in dark theme', async () => {
    const page = await newE2EPage();
    await page.setContent(avatar());
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForChanges();

    const colors = await page.evaluate(() => {
      const bg = document.querySelector('dda-avatar .avatar-type-text') as HTMLElement;
      const text = document.querySelector('dda-avatar .avatar-main-text') as HTMLElement;
      return { color: getComputedStyle(text).color, background: getComputedStyle(bg).backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });
});
