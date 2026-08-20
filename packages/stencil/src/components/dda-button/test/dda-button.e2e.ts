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

  // shadow: false, so the button is in the light DOM. A `>>>` piercing
  // selector finds nothing here. The prop is custom_class, not custom-class.
  it('renders with custom class', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button custom_class="custom-class"></dda-button>');

    const button = await page.find('dda-button button');
    expect(button).toHaveClass('custom-class');
  });

  it('triggers click event', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-button>Click me</dda-button>');

    // The spy must be attached after setContent, because setContent
    // replaces the document and discards any earlier listener.
    const clickSpy = await page.spyOnEvent('click');

    const button = await page.find('dda-button button');
    await button.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });
});
