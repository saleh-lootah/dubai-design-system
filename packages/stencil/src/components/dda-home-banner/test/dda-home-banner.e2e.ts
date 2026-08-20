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
});
