import { newE2EPage } from '@stencil/core/testing';

describe('dda-ui-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-ui-card></dda-ui-card>');

    const element = await page.find('dda-ui-card');
    expect(element).toHaveClass('hydrated');
  });
});
