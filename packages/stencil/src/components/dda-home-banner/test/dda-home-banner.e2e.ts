import { newE2EPage } from '@stencil/core/testing';

const slide = (n: number) => `
  <slide>
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Slide ${n}" />
    <div class="slide-wrap">
      <div class="slide-content">
        <h2>Title ${n}</h2>
        <a href="#cta-${n}" id="cta-${n}">Call to action ${n}</a>
      </div>
    </div>
  </slide>`;

const banner = (attrs = '') => `<dda-home-banner ${attrs}>${slide(1)}${slide(2)}${slide(3)}</dda-home-banner>`;

describe('dda-home-banner', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const el = await page.find('dda-home-banner');
    expect(el).toHaveClass('hydrated');
  });

  // The reported defect: without this class none of the layout CSS matched,
  // so the banner collapsed into normal document flow.
  it('applies the home-slider class to itself', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const el = await page.find('dda-home-banner');
    expect(el).toHaveClass('home-slider');
  });

  it('keeps a consumer-supplied home-slider class', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-home-banner class="home-slider">${slide(1)}</dda-home-banner>`);

    const el = await page.find('dda-home-banner');
    expect(el).toHaveClass('home-slider');
  });

  it('exposes the carousel to assistive tech', async () => {
    const page = await newE2EPage();
    await page.setContent(banner('aria_label="Featured"'));

    const el = await page.find('dda-home-banner');
    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-roledescription')).toBe('carousel');
    expect(el.getAttribute('aria-label')).toBe('Featured');
  });

  it('renders one dot per slide with accessible names', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const dots = await page.findAll('dda-home-banner .dots');
    expect(dots.length).toBe(3);
    expect(dots[0].getAttribute('aria-label')).toBe('Go to slide 1');
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[1].getAttribute('aria-current')).toBeNull();
  });

  it('advances with the next button', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const next = await page.find('dda-home-banner .next');
    expect(next.getAttribute('aria-label')).toBe('Next slide');

    await next.click();
    await page.waitForChanges();

    const dots = await page.findAll('dda-home-banner .dots');
    expect(dots[1].getAttribute('aria-current')).toBe('true');
    expect(dots[0].getAttribute('aria-current')).toBeNull();
  });

  it('wraps backwards from the first slide', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const prev = await page.find('dda-home-banner .prev');
    await prev.click();
    await page.waitForChanges();

    const dots = await page.findAll('dda-home-banner .dots');
    expect(dots[2].getAttribute('aria-current')).toBe('true');
  });

  it('jumps to a slide when its dot is clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const dots = await page.findAll('dda-home-banner .dots');
    await dots[2].click();
    await page.waitForChanges();

    const after = await page.findAll('dda-home-banner .dots');
    expect(after[2].getAttribute('aria-current')).toBe('true');
  });

  // Offscreen slides must not be reachable by keyboard or read out.
  it('marks non-current slides inert and hidden', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const slides = await page.findAll('dda-home-banner slide');
    expect(slides.length).toBe(3);

    expect(slides[0].getAttribute('aria-hidden')).toBe('false');
    expect(slides[0].getAttribute('inert')).toBeNull();

    expect(slides[1].getAttribute('aria-hidden')).toBe('true');
    expect(slides[1].getAttribute('inert')).not.toBeNull();
    expect(slides[2].getAttribute('inert')).not.toBeNull();
  });

  it('moves inert along with the current slide', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const next = await page.find('dda-home-banner .next');
    await next.click();
    await page.waitForChanges();

    const slides = await page.findAll('dda-home-banner slide');
    expect(slides[0].getAttribute('inert')).not.toBeNull();
    expect(slides[1].getAttribute('inert')).toBeNull();
  });

  it('labels each slide for screen readers', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const slides = await page.findAll('dda-home-banner slide');
    expect(slides[0].getAttribute('role')).toBe('group');
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(slides[1].getAttribute('aria-label')).toBe('Slide 2 of 3');
  });

  it('keeps a keyboard user out of offscreen calls to action', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    // inert elements cannot receive focus, even programmatically.
    const focusedId = await page.evaluate(() => {
      const cta = document.querySelector('#cta-3') as HTMLElement;
      cta.focus();
      return document.activeElement ? document.activeElement.id : '';
    });
    expect(focusedId).not.toBe('cta-3');
  });

  // WCAG 2.2.2 — automatically moving content needs a way to stop it.
  it('shows no pause control unless autoplay is on', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const pause = await page.find('dda-home-banner .pause');
    expect(pause).toBeNull();
  });

  it('shows a pause control when autoplay is on', async () => {
    const page = await newE2EPage();
    await page.setContent(banner('autoplay="true"'));

    const pause = await page.find('dda-home-banner .pause');
    expect(pause).not.toBeNull();
    expect(pause.getAttribute('aria-label')).toBe('Pause slideshow');
  });

  it('toggles the pause control between pause and play', async () => {
    const page = await newE2EPage();
    await page.setContent(banner('autoplay="true"'));

    const pause = await page.find('dda-home-banner .pause');
    await pause.click();
    await page.waitForChanges();

    const toggled = await page.find('dda-home-banner .pause');
    expect(toggled.getAttribute('aria-label')).toBe('Play slideshow');
  });

  it('treats autoplay="false" as off', async () => {
    const page = await newE2EPage();
    await page.setContent(banner('autoplay="false"'));

    const pause = await page.find('dda-home-banner .pause');
    expect(pause).toBeNull();
  });

  it('announces the current slide', async () => {
    const page = await newE2EPage();
    await page.setContent(banner());

    const status = await page.find('dda-home-banner [role="status"]');
    expect(status.textContent.trim()).toBe('Slide 1 of 3');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });

  it('picks up slides added after load', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-home-banner>${slide(1)}</dda-home-banner>`);

    expect((await page.findAll('dda-home-banner .dots')).length).toBe(1);

    await page.evaluate(() => {
      const el = document.querySelector('dda-home-banner');
      const s = document.createElement('slide');
      s.innerHTML = '<div class="slide-wrap"><div class="slide-content"><h2>Added</h2></div></div>';
      el.appendChild(s);
    });
    await page.waitForChanges();

    expect((await page.findAll('dda-home-banner .dots')).length).toBe(2);
  });

  // Task 9d — F-019: a slotted <dda-button button_color="default-primary">
  // CTA (the real usage in dda-home-banner.stories.tsx:12) is a normal
  // reachable Tab stop (shadow: false) that renders dda-button's own global
  // CSS, not dda-home-banner's already-correct `.slider-nav *:focus-visible`
  // ring (home-banner.css:182-187). It inherited the malformed
  // `outline: <color>` shorthand from dda-button.css before this fix.
  it('shows a real focus ring on a slotted dda-button CTA', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <dda-home-banner>
        <slide>
          <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Slide 1" />
          <div class="slide-wrap">
            <div class="slide-content">
              <h2>Title 1</h2>
              <dda-button button_color="default-primary" size="lg">Call to action</dda-button>
            </div>
          </div>
        </slide>
      </dda-home-banner>`);
    await page.waitForChanges();

    // Tab through whatever the banner puts ahead of the CTA (nav controls,
    // dots) until the slotted button itself is reached.
    let focused: { cls: string; boxShadow: string } | null = null;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        return { cls: el.className, boxShadow: s.boxShadow };
      });
      if (focused && focused.cls.includes('btn-color-default-primary')) break;
    }

    expect(focused).not.toBeNull();
    expect(focused.cls).toContain('btn-color-default-primary');
    expect(focused.boxShadow).not.toBe('none');
  });

  it('warns when it contains no <slide> elements', async () => {
    const page = await newE2EPage();
    const warnings: string[] = [];
    page.on('console', m => m.type() === 'warning' && warnings.push(m.text()));
    await page.setContent('<dda-home-banner><div class="card">Card</div></dda-home-banner>');
    await page.waitForChanges();

    expect(warnings.some(w => w.includes('dda-home-banner') && w.includes('<slide>'))).toBe(true);
  });

  it('does not warn when it contains <slide> elements', async () => {
    const page = await newE2EPage();
    const warnings: string[] = [];
    page.on('console', m => m.type() === 'warning' && warnings.push(m.text()));
    await page.setContent('<dda-home-banner><slide><p>One</p></slide></dda-home-banner>');
    await page.waitForChanges();

    expect(warnings.filter(w => w.includes('dda-home-banner'))).toEqual([]);
  });

  // Audit: the ::before gradient covers only the bottom and fades out, so
  // white slide text measured 2.1-3.1:1 over a real photo. The component
  // now paints its own scrim on .slide-wrap, behind .slide-content.
  it('paints a scrim gradient behind the slide text', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(banner());

    const backgroundImage = await page.evaluate(() => getComputedStyle(document.querySelector('dda-home-banner .slide-wrap')).backgroundImage);
    expect(backgroundImage).toContain('gradient');
  });

  it('keeps the scrim on narrow screens', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 400, height: 800 });
    await page.setContent(banner());

    const backgroundImage = await page.evaluate(() => getComputedStyle(document.querySelector('dda-home-banner .slide-wrap')).backgroundImage);
    expect(backgroundImage).toContain('gradient');
  });

  it('mirrors the scrim for right-to-left pages', async () => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(`<div dir="rtl">${banner()}</div><div id="ltr">${banner()}</div>`);

    const images = await page.evaluate(() => Array.from(document.querySelectorAll('dda-home-banner')).map(el => getComputedStyle(el.querySelector('.slide-wrap')).backgroundImage));
    expect(images[0]).toContain('gradient');
    expect(images[0]).not.toBe(images[1]);
  });
});

describe('dda-home-banner slide text size', () => {
  const sizes = async (width: number, height: number) => {
    const page = await newE2EPage();
    await page.setViewport({ width, height });
    await page.setContent(`
      <dda-home-banner>
        <slide><div class="slide-wrap"><div class="slide-content"><h2>Digital services</h2><p>Apply online</p></div></div></slide>
      </dda-home-banner>
      <p id="base">Base</p>
    `);
    await page.waitForChanges();
    return page.evaluate(() => {
      const px = (sel: string) => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize);
      return { title: px('.slide-content h2'), subtitle: px('.slide-content p'), base: px('#base') };
    });
  };

  it('keeps the display-size title on a landscape laptop screen', async () => {
    const { title, subtitle, base } = await sizes(1366, 900);

    // --dda-fs-display-sm is 2.25em; the old landscape rule forced 1.2rem.
    expect(title).toBeCloseTo(base * 2.25, 0);
    expect(subtitle).toBeGreaterThan(base);
  });

  it('shrinks the title on a short landscape screen, such as a phone on its side', async () => {
    const { title, base } = await sizes(844, 390);

    expect(title).toBeLessThan(base * 2.25);
  });
});

describe('dda-home-banner slide controls and the quick-link cards', () => {
  // The home layout: the banner fills the viewport and the quick-link cards sit over its bottom,
  // raised by the sticky footer height that dda-sticky-footer publishes.
  const layout = async (width: number, height: number) => {
    const page = await newE2EPage();
    await page.setViewport({ width, height });
    await page.setContent(`
      <style>:root { --dda-sticky-footer-height: 64px; } .home-intros { position: relative; }</style>
      <div class="home-intros">
        <dda-home-banner>
          <slide><div class="slide-wrap"><div class="slide-content"><h2>One</h2></div></div></slide>
          <slide><div class="slide-wrap"><div class="slide-content"><h2>Two</h2></div></div></slide>
        </dda-home-banner>
        <div class="quick-links-wrap"><div class="quick-links"><a class="link-item" href="#">Card</a></div></div>
      </div>
    `);
    await page.waitForChanges();
    return page.evaluate(() => ({
      navBottom: document.querySelector('.slider-nav').getBoundingClientRect().bottom,
      cardsTop: document.querySelector('.quick-links .link-item').getBoundingClientRect().top,
    }));
  };

  for (const [width, height] of [
    [1920, 1080],
    [1366, 900],
    [1280, 720],
  ]) {
    it(`keeps the slide controls above the cards at ${width}x${height}`, async () => {
      const { navBottom, cardsTop } = await layout(width, height);

      // Leave room for the cards' 12px hover lift.
      expect(navBottom).toBeLessThanOrEqual(cardsTop - 12);
    });
  }
});

describe('dda-home-banner scroll icon', () => {
  const banner = (extra = '') => `
    <dda-home-banner ${extra}>
      <slide><div class="slide-wrap"><div class="slide-content"><h2>One</h2></div></div></slide>
      <slide><div class="slide-wrap"><div class="slide-content"><h2>Two</h2></div></div></slide>
    </dda-home-banner>`;
  const icon = async (width: number, extra = '') => {
    const page = await newE2EPage();
    await page.setViewport({ width, height: 900 });
    await page.setContent(banner(extra));
    await page.waitForChanges();
    return page.evaluate(() => {
      const wrap = document.querySelector('.slider-nav .dda-mouse-scroll');
      if (!wrap) return null;
      const next = document.querySelector('.slider-nav .next');
      return {
        display: getComputedStyle(wrap).display,
        hidden: wrap.getAttribute('aria-hidden'),
        afterNext: !!(next.compareDocumentPosition(wrap) & Node.DOCUMENT_POSITION_FOLLOWING),
        hasIcon: !!wrap.querySelector('dda-scroll-icon .dda-scroll-icon-scroll'),
      };
    });
  };

  it('shows the icon after the next button on desktop, hidden from assistive technology', async () => {
    expect(await icon(1440)).toEqual({ display: 'flex', hidden: 'true', afterNext: true, hasIcon: true });
  });

  it('hides the icon at 992px and below', async () => {
    expect((await icon(390)).display).toBe('none');
  });

  it('shows the icon at 992px and below with show_scroll_icon_mobile', async () => {
    expect((await icon(390, 'show_scroll_icon_mobile')).display).toBe('flex');
  });

  it('keeps the icon on desktop with show_scroll_icon_mobile', async () => {
    expect((await icon(1440, 'show_scroll_icon_mobile')).display).toBe('flex');
  });

  it('renders no icon with show_scroll_icon="false"', async () => {
    expect(await icon(1440, 'show_scroll_icon="false"')).toBeNull();
  });
});

// <slide> is not a valid HTML element (no hyphen, not standard), so HTML checkers reject it.
// <div class="dda-slide"> is valid; <slide> keeps working for existing pages.
describe('dda-home-banner slide markup', () => {
  const content = (tag: string) => [1, 2, 3].map(n => (tag === 'div' ? `<div class="dda-slide"><h2>Slide ${n}</h2></div>` : `<slide><h2>Slide ${n}</h2></slide>`)).join('');
  const state = async (tag: string) => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(`<dda-home-banner>${content(tag)}</dda-home-banner>`);
    await page.waitForChanges();
    return page.evaluate(() => {
      const slides = Array.from(document.querySelectorAll('dda-home-banner .dda-slide, dda-home-banner slide'));
      return {
        dots: document.querySelectorAll('.slider-nav .dots').length,
        roles: slides.map(s => s.getAttribute('aria-roledescription')),
        hidden: slides.map(s => s.getAttribute('aria-hidden')),
        height: Math.round(slides[0].getBoundingClientRect().height),
      };
    });
  };

  it('accepts <div class="dda-slide"> slides', async () => {
    expect(await state('div')).toEqual({ dots: 3, roles: ['slide', 'slide', 'slide'], hidden: ['false', 'true', 'true'], height: 800 });
  });

  it('still accepts <slide> slides', async () => {
    expect(await state('slide')).toEqual({ dots: 3, roles: ['slide', 'slide', 'slide'], hidden: ['false', 'true', 'true'], height: 800 });
  });
});

// On laptop screens (768px tall and less) the slide text was centred in the full banner height, so
// it ran into the slide controls, which sit at a fixed distance above the bottom.
describe('dda-home-banner slide text and controls', () => {
  const gap = async (width: number, height: number, dir = 'ltr') => {
    const page = await newE2EPage();
    await page.setViewport({ width, height });
    // A page with dda-sticky-footer has this set; it raises the controls above the fixed bar.
    await page.setContent(`<style>:root { --dda-sticky-footer-height: 64px; }</style><div dir="${dir}"><dda-home-banner>
      <div class="dda-slide"><div class="slide-wrap"><div class="slide-content">
        <h2>Government services in one place</h2><p>Pay, renew and apply online.</p><a class="dda-btn" href="#">Browse services</a>
      </div></div></div>
      <div class="dda-slide"><div class="slide-wrap"><div class="slide-content"><h2>Two</h2></div></div></div>
    </dda-home-banner></div>`);
    await page.waitForChanges();
    return page.evaluate(() => {
      const text = document.querySelector('.dda-slide .slide-content').getBoundingClientRect();
      const nav = document.querySelector('.slider-nav').getBoundingClientRect();
      return { textToNav: Math.round(nav.top - text.bottom), textTop: Math.round(text.top) };
    });
  };

  for (const [w, h] of [
    [1280, 720],
    [1366, 768],
    [1536, 864],
    [1920, 1080],
  ]) {
    it(`keeps the slide text at least 16px above the controls at ${w}x${h}`, async () => {
      const { textToNav, textTop } = await gap(w, h);
      expect(textToNav).toBeGreaterThanOrEqual(16);
      // ...and below the fixed header area.
      expect(textTop).toBeGreaterThanOrEqual(150);
    });
  }
});

// 3.x mirrored the arrow icons in RTL. In 5.x the row reversed but the icons did not, so the
// arrows pointed inward: "> o o <".
describe('dda-home-banner arrows in RTL', () => {
  const arrows = async (dir: string) => {
    const page = await newE2EPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setContent(`<div dir="${dir}"><dda-home-banner><div class="dda-slide"><h2>One</h2></div><div class="dda-slide"><h2>Two</h2></div></dda-home-banner></div>`);
    await page.waitForChanges();
    return page.evaluate(() =>
      ['.prev', '.next'].map(sel => {
        const button = document.querySelector(`.slider-nav ${sel}`);
        // The arrow points right when its icon is chevron_right and not mirrored, or chevron_left and mirrored.
        const icon = button.querySelector('i');
        const mirrored = new DOMMatrix(getComputedStyle(icon).transform).a < 0;
        const pointsRight = (icon.textContent.trim() === 'chevron_right') !== mirrored;
        return { x: Math.round(button.getBoundingClientRect().x), pointsRight };
      }),
    );
  };

  it('points the arrows outward in LTR: previous on the left points left', async () => {
    const [prev, next] = await arrows('ltr');
    expect(prev.x).toBeLessThan(next.x);
    expect([prev.pointsRight, next.pointsRight]).toEqual([false, true]);
  });

  it('points the arrows outward in RTL: previous on the right points right', async () => {
    const [prev, next] = await arrows('rtl');
    expect(prev.x).toBeGreaterThan(next.x);
    expect([prev.pointsRight, next.pointsRight]).toEqual([true, false]);
  });
});

// The track was moved with `left`, but in RTL the slides run from the right edge, so the banner
// opened on the last slide while the dots and the announcement said "Slide 1 of 3", and Next
// went backwards.
describe('dda-home-banner slide on screen', () => {
  for (const dir of ['ltr', 'rtl']) {
    it(`shows the current slide in ${dir.toUpperCase()}`, async () => {
      const page = await newE2EPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.setContent(`<div dir="${dir}">${banner()}</div>`);
      await page.waitForChanges();

      // The slide whose left edge is at the left of the viewport: the one on screen.
      const onScreen = () =>
        page.evaluate(() => {
          const index = Array.from(document.querySelectorAll('dda-home-banner slide')).findIndex(s => Math.abs(s.getBoundingClientRect().left) < 2);
          return { slide: index + 1, status: document.querySelector('dda-home-banner [role="status"]').textContent };
        });
      // Wait out the 0.7s slide transition.
      const settle = () => new Promise(resolve => setTimeout(resolve, 900));

      expect(await onScreen()).toEqual({ slide: 1, status: 'Slide 1 of 3' });

      await page.click('dda-home-banner .next');
      await settle();
      expect(await onScreen()).toEqual({ slide: 2, status: 'Slide 2 of 3' });

      await page.click('dda-home-banner .prev');
      await page.click('dda-home-banner .prev');
      await settle();
      expect(await onScreen()).toEqual({ slide: 3, status: 'Slide 3 of 3' });
    });
  }
});
