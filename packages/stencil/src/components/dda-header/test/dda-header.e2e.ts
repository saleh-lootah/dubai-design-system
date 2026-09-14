import { E2EPage, newE2EPage } from '@stencil/core/testing';
import type { Page } from 'puppeteer';

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

describe('dda-header side menu scroll lock', () => {
  const items = JSON.stringify(Array.from({ length: 40 }, (_, i) => ({ label: `Link ${i + 1}`, href: '#', subMenu: [] })));
  const setup = async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 390, height: 700 });
    await page.setContent(`
      <dda-header side-menu-items='${items}'></dda-header>
      <div style="height: 4000px;"></div>
    `);
    await page.waitForChanges();
    return page;
  };
  const openMenu = async page => {
    await page.click('.hamburger-menu-btn');
    await page.waitForChanges();
  };
  const wheelAt = async (page, x: number, y: number) => {
    await page.mouse.move(x, y);
    await page.mouse.wheel({ deltaY: 600 });
    await new Promise(resolve => setTimeout(resolve, 300));
  };

  it('stops the page scrolling while the menu is open', async () => {
    const page = await setup();
    await openMenu(page);

    // The overlay beside the 375px-wide menu is the only page area left to scroll on.
    await wheelAt(page, 385, 400);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  it('still scrolls the menu itself while it is open', async () => {
    const page = await setup();
    await openMenu(page);

    await wheelAt(page, 150, 400);

    const scroll = await page.evaluate(() => ({ menu: document.querySelector('.dda-sidemenu-content').scrollTop, page: window.scrollY }));
    expect(scroll.menu).toBeGreaterThan(0);
    expect(scroll.page).toBe(0);
  });

  it('lets the page scroll again after the menu closes', async () => {
    const page = await setup();
    await openMenu(page);
    await page.click('.side-nav-close-btn');
    await page.waitForChanges();

    await wheelAt(page, 200, 400);

    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  it('releases the lock when the header is removed while the menu is open', async () => {
    const page = await setup();
    await openMenu(page);
    await page.evaluate(() => document.querySelector('dda-header').remove());
    await page.waitForChanges();

    expect(await page.evaluate(() => document.documentElement.classList.contains('dda-scroll-lock'))).toBe(false);
    await wheelAt(page, 200, 400);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
});

// Stencil's E2EPage type omits Puppeteer's waitForNavigation, which the page does provide.
const waitForNavigation = (page: E2EPage) => (page as unknown as Page).waitForNavigation();

describe('dda-header search', () => {
  const desktop = async (attrs = '') => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(`<dda-header ${attrs}></dda-header>`);
    await page.waitForChanges();
    return page;
  };
  const typeAndSubmit = async (page, selector: string, text: string) => {
    await page.focus(selector);
    await page.keyboard.type(text);
    await page.keyboard.press('Enter');
    await page.waitForChanges();
  };

  it('emits searchSubmit with the trimmed query when Enter is pressed, and stays on the page without search_action', async () => {
    const page = await desktop();
    const url = page.url();
    const spy = await page.spyOnEvent('searchSubmit');

    await typeAndSubmit(page, '.dda-search input', '  permits ');

    expect(spy).toHaveReceivedEventDetail({ query: 'permits' });
    expect(page.url()).toBe(url);
  });

  it('does not emit for an empty query', async () => {
    const page = await desktop();
    const spy = await page.spyOnEvent('searchSubmit');

    await typeAndSubmit(page, '.dda-search input', '   ');

    expect(spy).not.toHaveReceivedEvent();
  });

  it('navigates to search_action with the query when the event is not cancelled', async () => {
    const page = await desktop('search_action="/results.html" search_input_name="term"');

    await page.focus('.dda-search input');
    await page.keyboard.type('driving licence');
    await Promise.all([waitForNavigation(page), page.keyboard.press('Enter')]);

    const url = new URL(page.url());
    expect(url.pathname).toBe('/results.html');
    expect(url.searchParams.get('term')).toBe('driving licence');
  });

  it('uses q as the query parameter by default', async () => {
    const page = await desktop('search_action="/results.html"');

    await page.focus('.dda-search input');
    await page.keyboard.type('visa');
    await Promise.all([waitForNavigation(page), page.keyboard.press('Enter')]);

    expect(new URL(page.url()).searchParams.get('q')).toBe('visa');
  });

  it('does not navigate when a listener cancels searchSubmit', async () => {
    const page = await desktop('search_action="/results.html"');
    const url = page.url();
    await page.evaluate(() => document.querySelector('dda-header').addEventListener('searchSubmit', event => event.preventDefault()));

    await typeAndSubmit(page, '.dda-search input', 'visa');
    await new Promise(resolve => setTimeout(resolve, 300));

    expect(page.url()).toBe(url);
  });

  it('gives each header its own search input id, linked to its label', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-header></dda-header><dda-header></dda-header>');
    await page.waitForChanges();

    const ids = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.dda-search')).map(search => ({
        id: search.querySelector('input').id,
        labelFor: search.querySelector('label').htmlFor,
      })),
    );

    expect(ids[0].id).not.toBe(ids[1].id);
    ids.forEach(({ id, labelFor }) => {
      expect(id).not.toBe('');
      expect(labelFor).toBe(id);
    });
  });

  describe('on mobile', () => {
    const mobile = async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 390, height: 800 });
      await page.setContent('<dda-header></dda-header>');
      await page.waitForChanges();
      return page;
    };
    const state = page =>
      page.evaluate(() => {
        const button = document.querySelector('.dda-mobile-search button');
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        return {
          expanded: button.getAttribute('aria-expanded'),
          panelVisible: !!panel && getComputedStyle(panel).display !== 'none',
          focusInPanel: !!panel && panel.contains(document.activeElement) && document.activeElement.tagName === 'INPUT',
          focusOnButton: document.activeElement === button,
        };
      });

    it('opens a search field from the search button and moves focus into it', async () => {
      const page = await mobile();
      expect(await state(page)).toMatchObject({ expanded: 'false', panelVisible: false });

      await page.click('.dda-mobile-search button');
      await page.waitForChanges();

      expect(await state(page)).toMatchObject({ expanded: 'true', panelVisible: true, focusInPanel: true });
    });

    it('submits from the mobile field', async () => {
      const page = await mobile();
      const spy = await page.spyOnEvent('searchSubmit');
      await page.click('.dda-mobile-search button');
      await page.waitForChanges();

      await page.keyboard.type('housing');
      await page.keyboard.press('Enter');
      await page.waitForChanges();

      expect(spy).toHaveReceivedEventDetail({ query: 'housing' });
    });

    it('closes with Escape and returns focus to the search button', async () => {
      const page = await mobile();
      await page.click('.dda-mobile-search button');
      await page.waitForChanges();

      await page.keyboard.press('Escape');
      await page.waitForChanges();

      expect(await state(page)).toMatchObject({ expanded: 'false', panelVisible: false, focusOnButton: true });
    });

    it('closes with the close button and returns focus to the search button', async () => {
      const page = await mobile();
      await page.click('.dda-mobile-search button');
      await page.waitForChanges();

      await page.click('.dda-mobile-search-close');
      await page.waitForChanges();

      expect(await state(page)).toMatchObject({ expanded: 'false', panelVisible: false, focusOnButton: true });
    });
  });
});
