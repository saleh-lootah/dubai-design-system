import type { Page } from 'playwright';

const INTERACTIVE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * WCAG 2.2 - 2.5.8 Target Size (Minimum).
 * A target must be at least 24x24 CSS px, unless the spacing exception applies:
 * a 24px circle on each undersized target must not touch another target's circle.
 * Offscreen/inert content (e.g. carousel slides marked inert + aria-hidden) is
 * excluded, matching checkKeyboardReach's exclusion below - otherwise inert
 * content sharing coordinate space with visible content could pollute the
 * spacing-exception math.
 */
export async function checkTargetSize(page: Page, storyId: string) {
  const bad = await page.$$eval(INTERACTIVE, els => {
    const boxes = els
      .filter(el => !el.closest('[inert]') && !el.closest('[aria-hidden="true"]'))
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

interface StyleSnapshot {
  key: string;
  bg: string;
  border: string;
  color: string;
}

/**
 * WCAG 2.1.1 Keyboard and 2.4.7 Focus Visible.
 *
 * Tabs through every reachable interactive element and checks two things in
 * the same pass, accumulating both instead of throwing on the first:
 *  - every element is actually reached (2.1.1)
 *  - the focused element - or one of its ancestors, since the ring is often
 *    painted on a wrapper (e.g. `.dda-input-field-group`), not the control
 *    itself - shows a visible outline or box-shadow (2.4.7)
 *
 * Identity: class/id/tag alone are not a unique key in this library - several
 * components render sibling controls that share a class with no id (e.g.
 * dda-pagination's page-number buttons, dda-breadcrumb's links). Keying the
 * "reached" Set on that string collapsed distinct Tab stops into one entry
 * and undercounted reachability. Every candidate is instead stamped with a
 * unique `data-wcag-probe` attribute for the duration of the check (removed
 * afterwards, so the DOM is left as found) and the Set is keyed on that.
 *
 * `disabled` elements are excluded from `expected`: WCAG 2.1.1 does not
 * require an inoperable control to be reachable, and browsers correctly skip
 * them in the tab order.
 *
 * Shadow DOM: a few components (e.g. dda-footer) render with an open shadow
 * root. `document.activeElement`, read from the top document, only ever
 * resolves to the outermost shadow host in that case (focus retargeting) -
 * not the real element that has focus - even though Tab genuinely moves
 * focus among the elements inside. Every read of "what's currently focused"
 * below drills through nested `shadowRoot.activeElement` to find the true
 * target, and the ancestor walk for the focus ring crosses back out of a
 * shadow root via its host so ancestors of a shadow-DOM component are still
 * inspected. `expected`/probe-stamping already worked correctly here because
 * Playwright's own selector engine (unlike native `querySelectorAll`)
 * pierces open shadow roots.
 *
 * When no outline/box-shadow is found anywhere in the ancestor chain, the
 * element's background-color/border-color/color are compared against their
 * unfocused baseline. A colour-only change (no outline, no box-shadow found)
 * is not treated as an automatic failure: WCAG 2.4.7 accepts a sufficiently
 * contrasting colour change on its own, and contrast is outside what this
 * tool can assess. That case is reported separately via console.warn as
 * "needs manual contrast check" rather than thrown as a failure. Only a
 * genuinely unchanged element - no indicator, no colour change at all - is a
 * real 2.4.7 failure.
 *
 * Timing: some components apply their focus ring through a Stencil @State
 * class toggle (e.g. dda-phonefield's `is_focused` -> `.dda-input-focus`,
 * consumed by a `.dda-input-focus .dda-input-field-group` CSS rule) instead
 * of a `:focus` pseudo-class. That re-render is scheduled asynchronously, so
 * each Tab press is followed by a two-animation-frame wait before any style
 * is read - otherwise the check races ahead of the class update and sees
 * the pre-focus style, misreporting a real indicator as missing.
 */
export async function checkKeyboardReach(page: Page, storyId: string) {
  const expected = await page.$$eval(INTERACTIVE, els => {
    let n = 0;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0;
      const reachable =
        visible &&
        !el.closest('[inert]') &&
        !el.closest('[aria-hidden="true"]') &&
        !(el as unknown as { disabled?: boolean }).disabled;
      if (reachable) {
        el.setAttribute('data-wcag-probe', String(n));
        n++;
      }
    });
    return n;
  });

  if (expected === 0) return;

  const baseline: StyleSnapshot[] = await page.$$eval('[data-wcag-probe]', els =>
    els.map(el => {
      const key = el.getAttribute('data-wcag-probe') as string;
      const s = getComputedStyle(el);
      return { key, bg: s.backgroundColor, border: s.borderColor, color: s.color };
    }),
  );
  const baselineByKey = new Map(baseline.map(b => [b.key, b]));

  await page.evaluate(() => {
    // document.activeElement only sees as far as the outermost shadow host
    // (delegatesFocus retargeting); drill down to blur the element that is
    // really focused.
    let el = document.activeElement as HTMLElement | null;
    while (el && (el as unknown as { shadowRoot?: ShadowRoot }).shadowRoot?.activeElement) {
      el = (el as unknown as { shadowRoot: ShadowRoot }).shadowRoot.activeElement as HTMLElement;
    }
    el?.blur();
  });

  const seen = new Set<string>();
  // Native compound inputs (type="date", type="time") have internal segments
  // (day/month/year, hour/minute) that Tab moves between without changing
  // document.activeElement - the same DOM node is revisited several times in
  // a row, and Chromium can report a transient unstyled frame on one of
  // those revisits even though the ring is genuinely shown. So track, per
  // element key, whether a ring was seen on *any* visit rather than judging
  // each visit in isolation - classification happens once after the loop.
  const seenByKey = new Map<string, { label: string; everHasRing: boolean; everChanged: boolean }>();

  for (let i = 0; i < expected + 5; i++) {
    await page.keyboard.press('Tab');
    // Several components apply their focus ring via a Stencil @State-driven
    // class (e.g. dda-phonefield's `is_focused` -> `.dda-input-focus`) rather
    // than a CSS :focus pseudo-class. That re-render is scheduled async
    // (Stencil batches DOM writes via requestAnimationFrame), so reading
    // computed style in the same tick as the Tab keypress can race ahead of
    // it and see the pre-focus style. Wait two animation frames to let the
    // re-render land before inspecting anything.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const info = await page.evaluate(() => {
      // Some components (e.g. dda-footer) render with an open shadow root.
      // document.activeElement stops at the outermost shadow host in that
      // case (focus retargeting) and never reveals which real element inside
      // has focus, even though Tab genuinely moves focus among them. Drill
      // down through nested shadowRoot.activeElement to find the true target.
      let el = document.activeElement as HTMLElement | null;
      while (el && (el as unknown as { shadowRoot?: ShadowRoot }).shadowRoot?.activeElement) {
        el = (el as unknown as { shadowRoot: ShadowRoot }).shadowRoot.activeElement as HTMLElement;
      }
      if (!el || el === document.body) return null;

      // Walk from the focused element up to the story root looking for an
      // outline or box-shadow - the ring is often painted on a wrapper, not
      // the focusable element itself. Cross back out of a shadow root via
      // its host when the parent chain runs out, so ancestors of a
      // shadow-DOM component are still inspected.
      const root = document.getElementById('storybook-root') || document.body;
      let hasRing = false;
      let node: HTMLElement | null = el;
      while (node) {
        const s = getComputedStyle(node);
        const outlineVisible = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
        const shadowVisible = s.boxShadow !== 'none';
        if (outlineVisible || shadowVisible) {
          hasRing = true;
          break;
        }
        if (node === root) break;
        if (node.parentElement) {
          node = node.parentElement;
        } else {
          const rootNode = node.getRootNode();
          node = rootNode instanceof ShadowRoot ? (rootNode.host as HTMLElement) : null;
        }
      }

      const s = getComputedStyle(el);
      return {
        key: el.getAttribute('data-wcag-probe'),
        label: `${el.tagName}.${el.className}#${el.id}`,
        hasRing,
        bg: s.backgroundColor,
        border: s.borderColor,
        color: s.color,
      };
    });
    if (!info) break;
    if (info.key) seen.add(info.key);

    const base = info.key ? baselineByKey.get(info.key) : undefined;
    const changed = !!base && (base.bg !== info.bg || base.border !== info.border || base.color !== info.color);
    const entryKey = info.key ?? info.label;
    const existing = seenByKey.get(entryKey);
    if (existing) {
      existing.everHasRing = existing.everHasRing || info.hasRing;
      existing.everChanged = existing.everChanged || changed;
    } else {
      seenByKey.set(entryKey, { label: info.label, everHasRing: info.hasRing, everChanged: changed });
    }
  }

  const noIndicator: string[] = [];
  const needsManual: string[] = [];
  for (const { label, everHasRing, everChanged } of seenByKey.values()) {
    if (everHasRing) continue;
    if (everChanged) {
      needsManual.push(label);
    } else {
      noIndicator.push(label);
    }
  }

  // Leave the DOM as found. Playwright's selector engine pierces open shadow
  // roots (native querySelectorAll does not), matching how the probes were
  // stamped above - otherwise probes inside a shadow-DOM component (e.g.
  // dda-footer) would be left behind.
  await page.$$eval('[data-wcag-probe]', els => els.forEach(el => el.removeAttribute('data-wcag-probe')));

  if (needsManual.length) {
    console.warn(
      `${storyId}: WCAG 2.4.7 focus visible NEEDS-MANUAL-CHECK - colour changes on focus but no outline/box-shadow ` +
        `was found anywhere in the ancestor chain (contrast not assessed by this tool): ${needsManual.join('; ')}`,
    );
  }

  const issues: string[] = [];
  if (seen.size < expected) {
    issues.push(`WCAG 2.1.1 keyboard - reached ${seen.size} of ${expected} interactive elements by Tab`);
  }
  if (noIndicator.length) {
    issues.push(`WCAG 2.4.7 focus visible - no focus indicator on ${noIndicator.join('; ')}`);
  }

  if (issues.length) {
    throw new Error(`${storyId}: ${issues.join(' | ')}`);
  }
}
