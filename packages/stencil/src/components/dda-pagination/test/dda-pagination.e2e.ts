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

  // WCAG 1.1.1 / 2.5.3 / 4.1.2: the arrow ligatures were read as part of the
  // button names ("arrow_back Prev", "Next arrow_forward").
  for (const type of ['simple-slider', 'buttons', 'text', 'text-pages', 'button-text', 'buttons-pages']) {
    it(`hides every arrow icon from assistive technology (${type})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-pagination type="${type}" total_pages="5" current_page="2"></dda-pagination>`);

      const hidden = await page.$$eval('dda-pagination i.material-icons', (els: Element[]) => els.map(el => el.getAttribute('aria-hidden')));
      expect(hidden.length).toBe(2);
      hidden.forEach(value => expect(value).toBe('true'));
    });
  }

  // WCAG 4.1.2: with the icon hidden, arrow-only buttons need a real name.
  for (const type of ['text', 'text-pages', 'button-text', 'buttons-pages']) {
    it(`names the arrow-only previous and next buttons by default (${type})`, async () => {
      const page = await newE2EPage();
      await page.setContent(`<dda-pagination type="${type}" total_pages="5" current_page="2"></dda-pagination>`);

      const prev = await page.find('dda-pagination button.prev');
      const next = await page.find('dda-pagination button.next');
      expect(prev.getAttribute('aria-label')).toBe('Previous page');
      expect(next.getAttribute('aria-label')).toBe('Next page');
    });
  }

  it('uses previous_button_label and next_button_label when set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-pagination type="text-pages" total_pages="5" current_page="2" previous_button_label="Go back" next_button_label="Go forward"></dda-pagination>');

    const prev = await page.find('dda-pagination button.prev');
    const next = await page.find('dda-pagination button.next');
    expect(prev.getAttribute('aria-label')).toBe('Go back');
    expect(next.getAttribute('aria-label')).toBe('Go forward');
  });

  it('keeps the visible text as the name of the Prev and Next buttons (simple-slider)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-pagination type="simple-slider" total_pages="5" current_page="2"></dda-pagination>');

    const prev = await page.find('dda-pagination button.prev');
    const next = await page.find('dda-pagination button.next');
    expect(prev.getAttribute('aria-label')).toBeNull();
    expect(next.getAttribute('aria-label')).toBeNull();
  });

  // WCAG 4.1.2: the current page was only a CSS class.
  it('marks only the current page button with aria-current="page" and names each page', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-pagination type="text-pages" total_pages="5" current_page="3"></dda-pagination>');

    const pages = await page.$$eval('dda-pagination button:not(.prev):not(.next)', (els: Element[]) =>
      els.map(el => ({ label: el.getAttribute('aria-label'), current: el.getAttribute('aria-current') })),
    );

    expect(pages).toEqual([
      { label: 'Page 1', current: null },
      { label: 'Page 2', current: null },
      { label: 'Page 3', current: 'page' },
      { label: 'Page 4', current: null },
      { label: 'Page 5', current: null },
    ]);
  });

  it('moves aria-current to the page the user selects', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-pagination type="full" total_pages="4" current_page="1"></dda-pagination>');

    const buttons = await page.findAll('dda-pagination .dda-pagination-full button');
    await buttons[2].click();
    await page.waitForChanges();

    const current = await page.$$eval('dda-pagination .dda-pagination-full button', (els: Element[]) => els.map(el => el.getAttribute('aria-current')));
    expect(current).toEqual([null, null, 'page', null]);
  });
});
