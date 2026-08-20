import { newE2EPage } from '@stencil/core/testing';

// F-009: .dda-header is `position: fixed; top: 0; z-index: 6`
// (dda-header.css) with no scroll-padding/scroll-margin anywhere in the
// codebase. A keyboard user who follows an in-page link (a "skip to
// content" link, or any same-page anchor) lands on a target the browser
// aligns flush with the top of the viewport — directly under the fixed
// header, hiding what they just landed on (WCAG 2.4.11).
//
// Chromium's default *focus*-triggered auto-scroll uses a "nearest edge"
// heuristic that does not reliably land an element flush at the top, so it
// does not reproduce this reliably. In-page anchor navigation does: it is
// well-defined browser behaviour (and exactly what "skip to content" links
// and same-page nav links use), and it is the standard trigger for this
// exact class of bug.
const page1 = (extra = '') => `
  <a href="#target" id="skiplink">Skip to content</a>
  <dda-header
    first-logo-src="logo.svg"
    first-logo-white-src="logo-white.svg"
    first-logo-alt="Gov"
    second-logo-src="logo2.svg"
    second-logo-white-src="logo2-white.svg"
    second-logo-alt="Entity"
    login-link="/login"
    ${extra}
  ></dda-header>
  <div style="height: 2000px;"></div>
  <a href="#" id="target" tabindex="0">Target link</a>
  <div style="height: 2000px;"></div>
`;

// A keyboard user tabbing to the skip link and activating it with Enter.
async function jumpViaSkipLink(page) {
  const skiplink = await page.find('#skiplink');
  await skiplink.focus();
  await page.keyboard.press('Enter');
  await page.waitForChanges();

  // dda-header's own handleScroll hides `.dda-menu-container` and swaps in
  // a shrunk "white" state once the page scrolls down past 50px — real,
  // unrelated behaviour, not part of this fix. A one-way anchor jump always
  // crosses that threshold, so left alone every test here would measure the
  // shrunk header, not the full-height header the fix has to protect
  // against. Nudge the scroll position back up slightly, which flips
  // handleScroll's direction check and restores the header to its real,
  // full height (the worst case) before measuring.
  await page.evaluate(() => window.scrollTo(0, Math.max(0, window.scrollY - 10)));
  await page.waitForChanges();
}

describe('dda-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(page1());

    const el = await page.find('dda-header');
    expect(el).toHaveClass('hydrated');
  });

  // The finding's core claim: no scroll-padding-top/scroll-margin-top
  // anywhere reachable from this component.
  it('sets a real scroll-padding-top on the root, sized to clear the fixed header', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(page1());

    const scrollPaddingTop = await page.evaluate(() => getComputedStyle(document.documentElement).scrollPaddingTop);
    expect(scrollPaddingTop).toMatch(/^\d+px$/);
    expect(parseFloat(scrollPaddingTop)).toBeGreaterThan(0);
  });

  it('does not let the fixed header cover the target of an in-page jump on desktop', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(page1());

    await jumpViaSkipLink(page);

    const rects = await page.evaluate(() => {
      const header = document.querySelector('.dda-header');
      const target = document.getElementById('target');
      return {
        active: document.activeElement ? document.activeElement.id : '',
        headerBottom: header.getBoundingClientRect().bottom,
        targetTop: target.getBoundingClientRect().top,
      };
    });

    expect(rects.active).toBe('target');
    // The jump target must be visible below the fixed header, not underneath it.
    expect(rects.targetTop).toBeGreaterThanOrEqual(rects.headerBottom);
  });

  it('does not let the fixed header cover the target of an in-page jump on mobile', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 375, height: 700 });
    await page.setContent(page1());

    await jumpViaSkipLink(page);

    const rects = await page.evaluate(() => {
      const header = document.querySelector('.dda-header');
      const target = document.getElementById('target');
      return {
        active: document.activeElement ? document.activeElement.id : '',
        headerBottom: header.getBoundingClientRect().bottom,
        targetTop: target.getBoundingClientRect().top,
      };
    });

    expect(rects.active).toBe('target');
    expect(rects.targetTop).toBeGreaterThanOrEqual(rects.headerBottom);
  });
});
