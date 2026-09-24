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

// The toolbar items are search, accessibility, language and login; the accessibility panel has its own dda-buttons.
const LANGUAGE_BUTTON = '.dda-toolbar-menu > ul > li:nth-child(3) dda-button';

describe('dda-header accessibility', () => {
  const megaMenu = JSON.stringify([
    { label: 'Services', menuLabel: 'Services', href: '#', subMenu: [{ title: 'Licence', description: 'Renew', icon: 'badge', href: '/licence' }] },
  ]);
  const setup = async (attrs = '', width = 1280) => {
    const page = await newE2EPage();
    await page.setViewport({ width, height: 800 });
    await page.setContent(`<dda-header ${attrs}></dda-header>`);
    await page.waitForChanges();
    return page;
  };

  it('names the hamburger menu button "Menu" by default', async () => {
    const page = await setup('hamburger_menu_button_name="menu"', 390);

    const button = await page.evaluate(() => {
      const el = document.querySelector('.hamburger-menu-btn');
      return { text: el.textContent.trim(), name: el.getAttribute('name') };
    });

    expect(button).toEqual({ text: 'Menu', name: 'menu' });
  });

  it('uses menu_button_label as the hamburger menu button text', async () => {
    const page = await setup('menu_button_label="Main menu"', 390);

    const text = await page.evaluate(() => document.querySelector('.hamburger-menu-btn .hamburger-menu-text').textContent);
    expect(text).toBe('Main menu');
  });

  it('hides every Material icon it renders from assistive tech, and keeps icon-only controls named', async () => {
    const page = await setup(`quick-links='${megaMenu}' read-speaker-link="https://app.readspeaker.com/"`);

    const result = await page.evaluate(() => {
      const icons = Array.from(document.querySelectorAll('dda-header i'))
        // dda-button and dda-link-button render their own icons; their own tests cover them.
        .filter(icon => !icon.parentElement.closest('dda-button, dda-link-button'));
      return {
        count: icons.length,
        notHidden: icons.filter(icon => icon.getAttribute('aria-hidden') !== 'true').map(icon => icon.outerHTML),
        unnamedControls: icons
          .map(icon => icon.closest('button, a'))
          .filter(control => control && !control.getAttribute('aria-label') && !control.textContent.replace(/close|search|accessibility|volume_up|badge/g, '').trim())
          .map(control => control.outerHTML),
      };
    });

    expect(result.count).toBeGreaterThan(0);
    expect(result.notHidden).toEqual([]);
    expect(result.unnamedControls).toEqual([]);
  });

  it('marks both language buttons as Arabic by default', async () => {
    const page = await setup('language_text="العربية"');

    const langs = await page.evaluate(
      (languageButton: string) => ({
        desktop: document.querySelector(languageButton).getAttribute('lang'),
        desktopInner: document.querySelector(`${languageButton} button`).closest('[lang]').getAttribute('lang'),
        side: document.querySelector('.dda-toolbar-menu-sidemenu li:nth-child(2) button').getAttribute('lang'),
      }),
      LANGUAGE_BUTTON,
    );

    expect(langs).toEqual({ desktop: 'ar', desktopInner: 'ar', side: 'ar' });
  });

  it('uses language_text and language_lang in the side menu language button', async () => {
    const page = await setup('language_text="English" language_lang="en"');

    const side = await page.evaluate(() => {
      const button = document.querySelector('.dda-toolbar-menu-sidemenu li:nth-child(2) button');
      return { text: button.textContent.trim(), lang: button.getAttribute('lang') };
    });

    expect(side).toEqual({ text: 'English', lang: 'en' });
  });

  it('falls back to العربية as the language button text', async () => {
    const page = await setup();

    const texts = await page.evaluate(
      (languageButton: string) => ({
        desktop: document.querySelector(languageButton).textContent.trim(),
        side: document.querySelector('.dda-toolbar-menu-sidemenu li:nth-child(2) button').textContent.trim(),
      }),
      LANGUAGE_BUTTON,
    );

    expect(texts).toEqual({ desktop: 'العربية', side: 'العربية' });
  });

  it('does not render a ReadSpeaker link without read-speaker-link', async () => {
    const page = await setup();

    const count = await page.evaluate(() => document.querySelectorAll('dda-header .readspeaker, dda-header .rsbtn').length);
    expect(count).toBe(0);
  });

  it('renders the ReadSpeaker link with its href when read-speaker-link is set', async () => {
    const page = await setup('read-speaker-link="https://app.readspeaker.com/listen"');

    const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('dda-header a.readspeaker')).map(a => a.getAttribute('href')));
    expect(hrefs.length).toBe(2);
    hrefs.forEach(href => expect(href).toBe('https://app.readspeaker.com/listen'));
  });

  it('links the logos to first-logo-href and second-logo-href', async () => {
    const page = await setup('first-logo-href="/gov" second-logo-href="/entity"');

    const hrefs = await page.evaluate(() => ({
      first: Array.from(document.querySelectorAll('dda-header a.govt-logo')).map(a => a.getAttribute('href')),
      second: Array.from(document.querySelectorAll('dda-header a.entt-logo')).map(a => a.getAttribute('href')),
    }));

    // Desktop and side-menu first logo; desktop and mobile second logo.
    expect(hrefs).toEqual({ first: ['/gov', '/gov'], second: ['/entity', '/entity'] });
  });

  it('links the logos to / by default', async () => {
    const page = await setup();

    const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll('dda-header a.govt-logo, dda-header a.entt-logo')).map(a => a.getAttribute('href')));
    expect(hrefs.length).toBe(4);
    hrefs.forEach(href => expect(href).toBe('/'));
  });
});

describe('dda-header transparent gradient', () => {
  it('does not block clicks on content under the gradient', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 844, height: 390 });
    await page.setContent(`
      <style>body { margin: 0; }</style>
      <div class="transparent">
        <dda-header></dda-header>
        <button id="cta" style="position: absolute; top: 200px; left: 20px; height: 30px;">Apply</button>
      </div>
    `);
    await page.waitForChanges();

    const hit = await page.evaluate(() => {
      const cta = document.getElementById('cta').getBoundingClientRect();
      const gradient = getComputedStyle(document.querySelector('.dda-header'), '::before');
      return {
        gradientHeight: parseFloat(gradient.height),
        topElement: document.elementFromPoint(cta.left + cta.width / 2, cta.top + cta.height / 2)?.id,
      };
    });

    // The gradient still reaches over the button, but the click goes to the button.
    expect(hit.gradientHeight).toBeGreaterThan(200);
    expect(hit.topElement).toBe('cta');
  });
});

describe('dda-header transparent style on scroll', () => {
  const setup = async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(`
      <div class="transparent">
        <dda-header></dda-header>
        <div style="height: 3000px;"></div>
      </div>
    `);
    await page.waitForChanges();
    return page;
  };
  const headerBackground = (page: E2EPage) => page.evaluate(() => getComputedStyle(document.querySelector('.dda-header')).backgroundColor);
  const scrollTo = async (page: E2EPage, y: number) => {
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForFunction(top => window.scrollY === top, {}, y);
    await page.waitForChanges();
  };

  it('is transparent at the top of the page', async () => {
    const page = await setup();
    expect(await page.find('dda-header')).not.toHaveClass('dda-scrolled');
    expect(await headerBackground(page)).toBe('rgba(0, 0, 0, 0)');
  });

  it('uses the standard style below the top, also while scrolling back up', async () => {
    const page = await setup();
    await scrollTo(page, 600);
    // Scroll up a little: the header shows its menu again, but must stay standard.
    await scrollTo(page, 500);
    expect(await page.find('dda-header')).toHaveClass('dda-scrolled');
    expect(await headerBackground(page)).not.toBe('rgba(0, 0, 0, 0)');
  });

  it('is transparent again back at the top', async () => {
    const page = await setup();
    await scrollTo(page, 600);
    await scrollTo(page, 0);
    expect(await page.find('dda-header')).not.toHaveClass('dda-scrolled');
    expect(await headerBackground(page)).toBe('rgba(0, 0, 0, 0)');
  });
});

// For each link in the open third-level panel: is the link the top element at its own center?
async function leafVisibility(page: E2EPage) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('.dda-default-subsubmenu.is-visible li a')).map(a => {
      const r = a.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { label: a.textContent.trim(), visible: !!hit && (hit === a || a.contains(hit)) };
    }),
  );
}

describe('dda-header 3.x dropdown menus', () => {
  const links = JSON.stringify([
    { type: 'dda_default_submenu', headerMenuLabel: 'Home', url: '/', children: [] },
    {
      type: 'dda_default_submenu',
      headerMenuLabel: 'About',
      url: '#',
      children: [
        { type: 'dda_default_submenu', headerMenuLabel: 'Strategy', url: '/strategy', children: [] },
        { type: 'dda_default_submenu', headerMenuLabel: 'Policies', url: '#', children: [{ headerMenuLabel: 'Quality', url: '/quality', children: [] }] },
      ],
    },
  ]);
  const open = async (dir: 'ltr' | 'rtl') => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setContent(`<div dir="${dir}"><dda-header quick-links='${links}'></dda-header></div>`);
    await page.waitForChanges();
    return page;
  };

  it('shows the labels and opens the dropdown on click', async () => {
    const page = await open('ltr');
    const labels = await page.$$eval('.dda-mega-menu > li > a', els => els.map(e => e.textContent.trim()));
    expect(labels).toEqual(['Home', 'About']);
    const about = await page.find('.dda-mega-menu > li:nth-child(2) > a');
    expect(await about.getAttribute('aria-expanded')).toBe('false');
    await about.click();
    await page.waitForChanges();
    expect(await about.getAttribute('aria-expanded')).toBe('true');
    const menu = await page.find('.dda-default-submenu');
    expect(await about.getAttribute('aria-controls')).toBe(menu.id);
    expect(menu.id).not.toBe('');
    expect((await menu.getComputedStyle()).display).toBe('block');
    const items = await page.$$eval('.dda-default-submenu > ul > li > a', els => els.map(e => e.textContent.trim()));
    expect(items).toEqual(['Strategy', 'Policies']);
  });

  it('opens the third level toward the inline end, mirrored in RTL', async () => {
    for (const dir of ['ltr', 'rtl'] as const) {
      const page = await open(dir);
      await (await page.find('.dda-mega-menu > li:nth-child(2) > a')).click();
      await page.waitForChanges();
      await (await page.find('.dda-default-submenu a.has-submenu')).click();
      await page.waitForChanges();
      const side = await page.evaluate(() => {
        const parent = document.querySelector('.dda-default-submenu > ul').getBoundingClientRect();
        const sub = document.querySelector('.dda-default-subsubmenu').getBoundingClientRect();
        return sub.left >= parent.right - 1 ? 'right' : sub.right <= parent.left + 1 ? 'left' : 'overlap';
      });
      expect(side).toBe(dir === 'ltr' ? 'right' : 'left');
      // Real visibility: the top element at the center of each third-level link must be that link.
      // A scroll container around the fly-out clips it, and then elementFromPoint returns <html>.
      expect(await leafVisibility(page)).toEqual([{ label: 'Quality', visible: true }]);
      // The panel starts level with the link that opened it.
      const gap = await page.evaluate(() => {
        const opener = document.querySelector('.dda-default-submenu a.has-submenu').getBoundingClientRect();
        const sub = document.querySelector('.dda-default-subsubmenu').getBoundingClientRect();
        return Math.abs(sub.top - opener.top);
      });
      expect(gap).toBeLessThan(1);
    }
  });

  it('closes the dropdown on Escape', async () => {
    const page = await open('ltr');
    await (await page.find('.dda-mega-menu > li:nth-child(2) > a')).click();
    await page.waitForChanges();
    await page.keyboard.press('Escape');
    await page.waitForChanges();
    expect((await (await page.find('.dda-default-submenu')).getComputedStyle()).display).toBe('none');
  });

  // Regression: renderMega renders a .megamenu-content element for every mega item, open or not,
  // so an outside-click check that looks for ".megamenu-content" first always finds one whenever a
  // mega item exists anywhere in quick-links, and never falls through to check the 3.x dropdown at
  // all. With that bug, clicking the dropdown's own second-level link is wrongly treated as a click
  // outside every menu and closes the dropdown before the fly-out can show.
  it('keeps an open 3.x dropdown open (including a second-level click) when a mega menu item also exists', async () => {
    const mixedLinks = JSON.stringify([
      {
        type: 'dda_default_submenu',
        headerMenuLabel: 'About',
        url: '#',
        children: [{ type: 'dda_default_submenu', headerMenuLabel: 'Policies', url: '#', children: [{ headerMenuLabel: 'Quality', url: '/quality', children: [] }] }],
      },
      { type: 'dda_main_megamenu', headerMenuLabel: 'Services', url: '#', children: [{ title: 'Pay', items: [{ headerMenuLabel: 'Fines', url: '/fines' }] }] },
    ]);
    const page = await newE2EPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setContent(`<dda-header quick-links='${mixedLinks}'></dda-header>`);
    await page.waitForChanges();

    await (await page.find('.dda-mega-menu > li:nth-child(1) > a')).click();
    await page.waitForChanges();
    await (await page.find('.dda-default-submenu a.has-submenu')).click();
    await page.waitForChanges();
    expect((await (await page.find('.dda-default-submenu')).getComputedStyle()).display).toBe('block');
    expect((await (await page.find('.dda-default-subsubmenu')).getComputedStyle()).display).toBe('block');

    // A real outside click, far below the header, still closes it.
    await page.mouse.click(700, 850);
    await page.waitForChanges();
    expect((await (await page.find('.dda-default-submenu')).getComputedStyle()).display).toBe('none');
  });
});
