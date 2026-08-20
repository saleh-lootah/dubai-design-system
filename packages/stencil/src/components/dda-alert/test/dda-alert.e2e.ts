import { newE2EPage } from '@stencil/core/testing';

// F-012: dda-alert carried no `role` attribute anywhere (grepped, zero
// matches), so a screen reader user was never notified when an alert was
// inserted into the page. Repair: the root element's role follows the
// `variation` prop rather than being fixed — `role="alert"` (assertive,
// interrupts) for the urgent case, `role="status"` (polite) for the rest,
// matching the findings doc's guidance that error suits `alert` and
// confirmations suit `status`.

describe('dda-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Heads up" description="Something happened"></dda-alert>');

    const el = await page.find('dda-alert');
    expect(el).toHaveClass('hydrated');
  });

  it('carries a role on the root element for every variation (F-012 baseline)', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="info" title_text="Info" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).not.toBeNull();
  });

  it('uses role="alert" (assertive) for the error variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="error" title_text="Failed" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('alert');
  });

  it('uses role="status" (polite) for the success variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="success" title_text="Saved" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });

  it('uses role="status" (polite) for the info variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="info" title_text="FYI" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });

  it('uses role="status" (polite) for the warning variation', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert variation="warning" title_text="Careful" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });

  it('defaults to role="status" when no variation is set (default is "info")', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-alert title_text="Default" description="d"></dda-alert>');

    const root = await page.find('dda-alert .dda-alert');
    expect(root.getAttribute('role')).toBe('status');
  });
});
