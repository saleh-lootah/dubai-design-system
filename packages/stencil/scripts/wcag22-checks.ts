import type { Page } from 'playwright';

const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * WCAG 2.2 - 2.5.8 Target Size (Minimum).
 * A target must be at least 24x24 CSS px, unless the spacing exception applies:
 * a 24px circle on each undersized target must not touch another target's circle.
 */
export async function checkTargetSize(page: Page, storyId: string) {
  const bad = await page.$$eval(INTERACTIVE, els => {
    const boxes = els
      .map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName.toLowerCase(), cls: el.className, x: r.x, y: r.y, w: r.width, h: r.height };
      })
      .filter(b => b.w > 0 && b.h > 0); // ignore hidden targets

    return boxes.filter(b => {
      if (b.w >= 24 && b.h >= 24) return false;
      // Spacing exception: measure centre to centre against every other target.
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      return boxes.some(o => {
        if (o === b) return false;
        const ox = o.x + o.w / 2;
        const oy = o.y + o.h / 2;
        return Math.hypot(cx - ox, cy - oy) < 24;
      });
    });
  });

  if (bad.length) {
    const list = bad.map(b => `${b.tag}.${b.cls} ${Math.round(b.w)}x${Math.round(b.h)}`).join('; ');
    throw new Error(`${storyId}: WCAG 2.5.8 target size - ${bad.length} target(s) too small and too close: ${list}`);
  }
}

/**
 * WCAG 2.1.1 Keyboard and 2.4.7 Focus Visible.
 * Tab through the story. Every interactive element must be reachable,
 * and the focused element must show a visible focus indicator.
 */
export async function checkKeyboardReach(page: Page, storyId: string) {
  const expected = await page.$$eval(INTERACTIVE, els =>
    els.filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && !el.closest('[inert]') && !el.closest('[aria-hidden="true"]');
    }).length,
  );
  if (expected === 0) return;

  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());

  const seen = new Set<string>();
  let noIndicator: string | null = null;

  for (let i = 0; i < expected + 5; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const hasRing = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
      const hasShadow = s.boxShadow !== 'none';
      return {
        key: el.tagName + '.' + el.className + '#' + el.id,
        visible: hasRing || hasShadow,
      };
    });
    if (!info) break;
    seen.add(info.key);
    if (!info.visible && noIndicator === null) noIndicator = info.key;
  }

  if (seen.size < expected) {
    throw new Error(`${storyId}: WCAG 2.1.1 keyboard - reached ${seen.size} of ${expected} interactive elements by Tab`);
  }
  if (noIndicator) {
    throw new Error(`${storyId}: WCAG 2.4.7 focus visible - no focus indicator on ${noIndicator}`);
  }
}
