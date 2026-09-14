import { newE2EPage } from '@stencil/core/testing';

describe('dda-ui-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card></dda-ui-card>');

    const element = await page.find('dda-ui-card');
    expect(element).toHaveClass('hydrated');
  });

  // Audit: the title was always an <h1> (a services page had 13 of them).
  it('renders the title as an h3 by default', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card maintitle="Apply for a permit"></dda-ui-card>');

    const tag = await page.evaluate(() => document.querySelector('dda-ui-card .dda-card-title').tagName);
    expect(tag).toBe('H3');
  });

  it('renders the title at heading_level', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card maintitle="Apply for a permit" heading_level="2"></dda-ui-card>');

    const tag = await page.evaluate(() => document.querySelector('dda-ui-card .dda-card-title').tagName);
    expect(tag).toBe('H2');
  });

  it('clamps heading_level to 1-6', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card id="high" maintitle="A" heading_level="7"></dda-ui-card><dda-ui-card id="low" maintitle="B" heading_level="-1"></dda-ui-card>');

    const tags = await page.evaluate(() => [document.querySelector('#high .dda-card-title').tagName, document.querySelector('#low .dda-card-title').tagName]);
    expect(tags).toEqual(['H6', 'H1']);
  });

  it('hides the card icon and the link arrow from assistive tech', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card icon="description" maintitle="Permit" link="/start" linktext="Start service"></dda-ui-card>');

    const result = await page.evaluate(() => ({
      icon: document.querySelector('dda-ui-card .dda-card-icon i').getAttribute('aria-hidden'),
      arrow: document.querySelector('dda-ui-card .dda-card-link i').getAttribute('aria-hidden'),
    }));
    expect(result).toEqual({ icon: 'true', arrow: 'true' });
  });

  it('names the link from its text only, not the arrow ligature', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card maintitle="Permit" link="/start" linktext="Start service"></dda-ui-card>');

    const link = await page.find('dda-ui-card .dda-card-link');
    const name = await page.evaluate(() => {
      const a = document.querySelector('dda-ui-card .dda-card-link');
      const clone = a.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[aria-hidden="true"]').forEach(el => el.remove());
      return clone.textContent.trim();
    });
    expect(link).not.toBeNull();
    expect(name).toBe('Start service');
  });

  it('emits linkClick when the user clicks the link, and keeps the navigation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card maintitle="Permit" link="#start" linktext="Start service"></dda-ui-card>');
    const spy = await page.spyOnEvent('linkClick');

    await page.click('dda-ui-card .dda-card-link');
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventTimes(1);
    expect(await page.evaluate(() => location.hash)).toBe('#start');
  });

  it('does not navigate when a linkClick listener calls preventDefault on detail', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card maintitle="Permit" link="#start" linktext="Start service"></dda-ui-card>');
    await page.evaluate(() => {
      document.querySelector('dda-ui-card').addEventListener('linkClick', (event: CustomEvent<MouseEvent>) => event.detail.preventDefault());
    });
    const spy = await page.spyOnEvent('linkClick');

    await page.click('dda-ui-card .dda-card-link');
    await page.waitForChanges();

    expect(spy).toHaveReceivedEventTimes(1);
    expect(await page.evaluate(() => location.hash)).toBe('');
  });

  it('does not emit linkClick when the user clicks the card outside the link', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card maintitle="Permit" link="#start" linktext="Start service"></dda-ui-card>');
    const spy = await page.spyOnEvent('linkClick');

    await page.click('dda-ui-card .dda-card-title');
    await page.waitForChanges();

    expect(spy).not.toHaveReceivedEvent();
  });
});
