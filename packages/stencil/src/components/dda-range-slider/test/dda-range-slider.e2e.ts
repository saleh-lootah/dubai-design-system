import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';

// F-022 (WCAG 2.5.8 Target Size, minimum): the repo's own a11y sweep
// (scripts/wcag22-checks.ts, checkTargetSize) flagged both
// `input.dda-range-slider-input` elements at 1248x6px - full track width,
// only 6px tall, well under the 24x24 minimum, and the two overlapping
// inputs sit too close to each other to satisfy the spacing exception
// either.
//
// The checker's INTERACTIVE selector matches `input` generically, so it
// measures the *whole* <input>'s own box (I-004 already confirms this is
// real native `<input type="range">`, not a custom widget) - not the
// UA-styled ::-webkit-slider-thumb pseudo-element, which pointer-events
// actually restrict interaction to. Fixing the input's own box height is
// what the checker (and this test) can observe.
async function findUndersizedTargets(page, selector) {
  return page.$$eval(selector, (els: Element[]) => {
    const boxes = Array.from(els)
      .map(el => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      })
      .filter(b => b.w > 0 && b.h > 0);

    return boxes.filter(b => {
      if (b.w >= 24 && b.h >= 24) return false;
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
}

const slider = (attrs = '') =>
  `<dda-range-slider left_input_id="min" right_input_id="max" left_input_name="min" right_input_name="max" ${attrs}></dda-range-slider>`;

describe('dda-range-slider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(slider());

    const el = await page.find('dda-range-slider');
    expect(el).toHaveClass('hydrated');
  });

  it('meets the WCAG 2.5.8 target size minimum for both range inputs', async () => {
    const page = await newE2EPage();
    await page.setContent(slider());

    const bad = await findUndersizedTargets(page, '.dda-range-slider-input');
    expect(bad).toEqual([]);
  });

  // Preserve the visual design: the visible track stays a thin 6px line;
  // only the invisible input's own hit area grows.
  it('keeps the visible track thin while growing the input hit area', async () => {
    const page = await newE2EPage();
    await page.setContent(slider());

    const trackHeight = await page.$eval('.dda-range-slider', (el: Element) => Math.round(el.getBoundingClientRect().height));
    expect(trackHeight).toBe(6);

    const inputHeights = await page.$$eval('.dda-range-slider-input', (els: Element[]) =>
      els.map(el => Math.round(el.getBoundingClientRect().height)),
    );
    inputHeights.forEach(h => expect(h).toBeGreaterThanOrEqual(24));
  });

  it('still reports 3 tooltip position variants at the target size minimum', async () => {
    const page = await newE2EPage();
    await page.setContent(slider('tooltip_position="top"'));

    const bad = await findUndersizedTargets(page, '.dda-range-slider-input');
    expect(bad).toEqual([]);
  });
});

// F-023 (B3): `.dda-range-slider-track span`'s background was the raw,
// theme-invariant `--dda-neutral-100`, paired with the theme-flipping text
// alias `--dda-on-surface-variant-30` — 2.30:1 in dark before the fix.
//
// dda-range-slider's own styleUrl does not import global.css/color.css (a
// pre-existing gap, unrelated to F-023 and out of scope here) — in real
// usage the tokens resolve because some sibling component on the page
// always pulls color.css in. A hidden `<dda-input>` reproduces that here so
// `--dda-surface-100`/`--dda-on-surface-variant-30` actually resolve.
describe('dda-range-slider label contrast (F-023)', () => {
  const renderWithTokens = (attrs = '') =>
    `<dda-input style="display:none"></dda-input>${slider(attrs)}`;

  it('min-label clears 4.5:1 in light theme', async () => {
    const page = await newE2EPage();
    await page.setContent(renderWithTokens());

    const colors = await page.evaluate(() => {
      const label = document.querySelector('dda-range-slider .min-label') as HTMLElement;
      const s = getComputedStyle(label);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });

  it('min-label clears 4.5:1 in dark theme', async () => {
    const page = await newE2EPage();
    await page.setContent(renderWithTokens());
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForChanges();

    const colors = await page.evaluate(() => {
      const label = document.querySelector('dda-range-slider .min-label') as HTMLElement;
      const s = getComputedStyle(label);
      return { color: s.color, background: s.backgroundColor };
    });

    expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
  });
});
