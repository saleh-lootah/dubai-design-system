import { newE2EPage } from '@stencil/core/testing';

describe('dda-accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-accordion></dda-accordion>');

    const el = await page.find('dda-accordion');
    expect(el).toHaveClass('hydrated');
  });

  it('opens on click (mouse baseline)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-accordion header_text="Section" body_description="Body text"></dda-accordion>');

    const header = await page.find('dda-accordion .accordion-header');
    await header.click();
    await page.waitForChanges();

    const body = await page.find('dda-accordion .accordion-body');
    expect(body).not.toBeNull();
  });

  // F-001: the header was a plain div with onClick and no tabindex/role/onKeyDown —
  // a keyboard-only user could never reach it, let alone open it.
  it('is reachable by Tab and opens on Enter', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-accordion header_text="Section" body_description="Body text"></dda-accordion>');

    await page.keyboard.press('Tab');
    const focusedClass = await page.evaluate(() => (document.activeElement ? document.activeElement.className : null));
    expect(focusedClass).toContain('accordion-header');

    await page.keyboard.press('Enter');
    await page.waitForChanges();

    const header = await page.find('dda-accordion .accordion-header');
    expect(header.getAttribute('aria-expanded')).toBe('true');

    const body = await page.find('dda-accordion .accordion-body');
    expect(body).not.toBeNull();
  });

  it('opens on Space as well', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-accordion header_text="Section" body_description="Body text"></dda-accordion>');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForChanges();

    const header = await page.find('dda-accordion .accordion-header');
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });

  it('reflects aria-expanded when closed', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-accordion header_text="Section" body_description="Body text"></dda-accordion>');

    const header = await page.find('dda-accordion .accordion-header');
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });
});
