import { newE2EPage } from '@stencil/core/testing';

describe('dda-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button></dda-button>');

    const element = await page.find('dda-button');
    expect(element).toHaveClass('hydrated');
  });

  it('renders with text', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button>Click me</dda-button>');

    const element = await page.find('dda-button');
    expect(element.textContent).toEqual('Click me');
  });

  it('renders with custom class', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button custom-class="custom-class"></dda-button>');

    const button = await page.find('dda-button >>> button');
    expect(button).toHaveClass('custom-class');
  });

  it('triggers click event', async () => {
    const page = await newE2EPage();
    const clickSpy = await page.spyOnEvent('click');

    await page.setContent('<dda-button>Click me</dda-button>');
    const button = await page.find('dda-button >>> button');
    await button.click();

    expect(clickSpy).toHaveReceivedEvent();
  });
});
