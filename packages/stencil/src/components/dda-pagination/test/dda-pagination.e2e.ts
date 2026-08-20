import { newE2EPage } from '@stencil/core/testing';

// F-022 (WCAG 2.5.8 Target Size, minimum): the repo's own a11y sweep
// (scripts/wcag22-checks.ts, checkTargetSize) flagged the `full` pagination
// variant - `.dda-pagination-full button` dots at 10x10px with an 8px gap,
// 18px centre-to-centre - as both too small (< 24x24) and too close to
// satisfy the spacing exception (a 24px circle centred on each undersized
// target must not intersect another target's circle).
//
// This mirrors that checker's exact rule so a pass here means the real
// sweep passes too, not just an approximation of it.
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

describe('dda-pagination', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-pagination type="full" total_pages="8"></dda-pagination>');

    const el = await page.find('dda-pagination');
    expect(el).toHaveClass('hydrated');
  });

  it('meets the WCAG 2.5.8 target size minimum for the full (dot) pagination variant', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-pagination type="full" total_pages="8"></dda-pagination>');

    const bad = await findUndersizedTargets(page, '.dda-pagination-full button');
    expect(bad).toEqual([]);
  });

  // Preserve the visual design: the dots themselves must still be small
  // (this is a target-size fix via spacing, not a "make the dot bigger" fix).
  it('keeps the dots visually small (10x10) while fixing the hit-area spacing', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-pagination type="full" total_pages="8"></dda-pagination>');

    const sizes = await page.$$eval('.dda-pagination-full button', (els: Element[]) =>
      els.map(el => {
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      }),
    );

    expect(sizes.length).toBe(8);
    sizes.forEach(s => {
      expect(s.w).toBe(10);
      expect(s.h).toBe(10);
    });
  });
});
