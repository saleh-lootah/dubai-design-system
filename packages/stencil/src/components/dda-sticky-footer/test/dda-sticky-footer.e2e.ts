import { newE2EPage } from '@stencil/core/testing';

// A tall spacer makes the document scrollable so window.scrollTo() actually
// moves window.scrollY and fires native 'scroll' events for the component's
// own handleScroll listener to react to.
const content = (extra = '') => `
  <div style="height: 3000px;"></div>
  <dda-sticky-footer ${extra}></dda-sticky-footer>
`;

describe('dda-sticky-footer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(content());

    const el = await page.find('dda-sticky-footer');
    expect(el).toHaveClass('hydrated');
  });

  // F-006: dda-sticky-footer shipped with shadow: true, a 0-byte
  // dda-sticky-footer.css, and its styleUrls line that would have pulled in
  // global.css commented out. No CSS could reach the markup at all.
  it('renders in the light DOM so global stylesheets can reach it (no shadow root)', async () => {
    const page = await newE2EPage();
    await page.setContent(content());

    const hasShadowRoot = await page.evaluate(() => {
      const el = document.querySelector('dda-sticky-footer');
      return !!(el && el.shadowRoot);
    });

    expect(hasShadowRoot).toBe(false);
  });

  // F-006: `.dda-footer { position: fixed; ... }` lives only in
  // global/templates/dda-footer-main.css, which was unreachable from the
  // shadow root — the footer was never actually fixed to the viewport.
  it('is fixed to the bottom of the viewport (global/templates/dda-footer-main.css reaches it)', async () => {
    const page = await newE2EPage();
    await page.setContent(content());

    const styles = await page.evaluate(() => {
      const el = document.querySelector('dda-sticky-footer .dda-footer');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return { position: cs.position, bottom: cs.bottom, width: cs.width };
    });

    expect(styles).not.toBeNull();
    expect(styles.position).toBe('fixed');
    expect(styles.bottom).toBe('0px');
  });

  // F-006: the `hidden` class the component's own scroll-direction state
  // toggles (dda-sticky-footer.tsx:65-66,82-85,91) had no CSS defining it
  // anywhere, so the show/hide-on-scroll behavior had no visible effect.
  it('the .hidden class produces a real visual change (slides the footer off screen)', async () => {
    const page = await newE2EPage();
    await page.setContent(content());

    const shownRect = await page.evaluate(() => {
      const el = document.querySelector('dda-sticky-footer .dda-footer');
      return el.getBoundingClientRect().top;
    });

    await page.evaluate(() => {
      document.querySelector('dda-sticky-footer .dda-footer').classList.add('hidden');
    });

    // .dda-footer carries `transition: transform 300ms ease-in-out`, so the
    // computed transform only reaches its target value once the transition
    // finishes — poll instead of reading it on the very next tick.
    await page.waitForFunction(
      () => {
        const el = document.querySelector('dda-sticky-footer .dda-footer');
        return el && getComputedStyle(el).transform !== 'matrix(1, 0, 0, 1, 0, 0)';
      },
      { timeout: 5000 },
    );

    const hiddenRect = await page.evaluate(() => {
      const el = document.querySelector('dda-sticky-footer .dda-footer');
      return el.getBoundingClientRect().top;
    });

    // translateY(100%) on a 64px-tall fixed footer moves its top edge down by
    // its own height — a real, measurable, on-screen change, not a no-op class.
    expect(hiddenRect).toBeGreaterThan(shownRect);
  });

  // F-006: confirm the component's own scroll-direction state machine actually
  // drives that visible change end-to-end — scrolling down hides the footer,
  // scrolling back up reveals it again.
  it('hides on scroll down and reappears on scroll up', async () => {
    const page = await newE2EPage();
    await page.setContent(content());

    const getClass = async () =>
      page.evaluate(() => {
        const el = document.querySelector('dda-sticky-footer .dda-footer');
        return el ? el.className : null;
      });

    expect(await getClass()).not.toContain('hidden');

    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForFunction(
      () => {
        const el = document.querySelector('dda-sticky-footer .dda-footer');
        return el && el.className.includes('hidden');
      },
      { timeout: 5000 },
    );
    expect(await getClass()).toContain('hidden');

    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForFunction(
      () => {
        const el = document.querySelector('dda-sticky-footer .dda-footer');
        return el && !el.className.includes('hidden');
      },
      { timeout: 5000 },
    );
    expect(await getClass()).not.toContain('hidden');
  });

  // Regression this task's own fix could have introduced: transform: translateY(100%)
  // moves the footer off screen, but the ~dozen <a> elements inside it stay in the
  // DOM. Without inert/aria-hidden they would remain focusable and exposed to
  // assistive tech even while invisible — a keyboard user tabbing past would land on
  // links they cannot see. Before the shadow-DOM fix this could not happen, because
  // `hidden` had no effect at all; it is only reachable now that the class does
  // something. This asserts "hidden" and "unreachable" stay coupled.
  it('removes the hidden footer from the focus order and from assistive tech', async () => {
    const page = await newE2EPage();
    // A real href is required — an <a> with no href is never in the default
    // focus order at all, which would make this test pass for the wrong reason.
    await page.setContent(content('happiness-icon-href="#happy"'));

    const footer = await page.find('dda-sticky-footer .dda-footer');

    // Visible state: reachable, and not marked hidden from AT.
    expect(footer.getAttribute('aria-hidden')).toBe('false');
    expect(footer.getAttribute('inert')).toBe(null);

    const canFocusWhileVisible = await page.evaluate(() => {
      const link = document.querySelector('dda-sticky-footer .dda-footer a');
      (link as HTMLElement).focus();
      return document.activeElement === link;
    });
    expect(canFocusWhileVisible).toBe(true);

    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForFunction(
      () => {
        const el = document.querySelector('dda-sticky-footer .dda-footer');
        return el && el.className.includes('hidden');
      },
      { timeout: 5000 },
    );

    const hiddenFooter = await page.find('dda-sticky-footer .dda-footer');
    expect(hiddenFooter.getAttribute('aria-hidden')).toBe('true');
    expect(hiddenFooter.getAttribute('inert')).not.toBe(null);

    // The real proof: attempting to focus a link inside the hidden footer must fail.
    const canFocusWhileHidden = await page.evaluate(() => {
      document.body.focus();
      const link = document.querySelector('dda-sticky-footer .dda-footer a');
      (link as HTMLElement).focus();
      return document.activeElement === link;
    });
    expect(canFocusWhileHidden).toBe(false);
  });
});
