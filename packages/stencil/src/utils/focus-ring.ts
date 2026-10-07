// Shared e2e helper for the form fields' focus-ring specs (WCAG 2.4.7 /
// 1.4.11). Not consumed by any component.
import type { E2EPage } from '@stencil/core/testing';

export interface FocusRing {
  outlineStyle: string;
  /** In px. */
  outlineWidth: number;
  outlineColor: string;
  boxShadow: string;
  /** The page background, which an outline drawn outside the field sits on. */
  pageBackground: string;
}

/**
 * Reads the outline and box-shadow of the element `selector` matches. Pass
 * the function itself to `page.evaluate()`. It runs in the browser, so it
 * must stay self-contained: no imports, no closures, no async.
 */
export function readFocusRing(selector: string): FocusRing {
  const el = document.querySelector(selector) as HTMLElement;
  if (!el) {
    throw new Error(`focus-ring.ts: no element for "${selector}"`);
  }
  const s = getComputedStyle(el);
  return {
    outlineStyle: s.outlineStyle,
    outlineWidth: parseFloat(s.outlineWidth),
    outlineColor: s.outlineColor,
    boxShadow: s.boxShadow,
    pageBackground: getComputedStyle(document.body).backgroundColor,
  };
}

/**
 * Presses Tab until the element with `id` has focus, the way a keyboard user
 * reaches it, so `:focus-visible` matches. Fails if it takes more than 10.
 */
export async function tabTo(page: E2EPage, id: string): Promise<void> {
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(target => document.activeElement?.id === target, id)) {
      await page.waitForChanges();
      return;
    }
  }
  throw new Error(`focus-ring.ts: Tab never reached #${id}`);
}

/**
 * Chromium's forced-colors emulation, as in DevTools > Rendering > "Emulate
 * CSS media feature forced-colors". It forces colours as Windows high
 * contrast mode does: box-shadow computes to `none`, and border and outline
 * colours, transparent ones included, become system colours. Sent over CDP
 * because Puppeteer 21's emulateMediaFeatures() rejects `forced-colors`.
 */
export async function emulateForcedColors(page: E2EPage): Promise<void> {
  const session = await page.createCDPSession();
  await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
}
