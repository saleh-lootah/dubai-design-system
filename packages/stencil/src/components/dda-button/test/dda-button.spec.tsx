import { newSpecPage } from '@stencil/core/testing';
import { DdaButton } from '../dda-button';

// dda-button uses shadow: false, so it renders into the light DOM.
const render = (html: string) => newSpecPage({ components: [DdaButton], html });

describe('dda-button', () => {
  it('renders a button with the default classes', async () => {
    const page = await render(`<dda-button></dda-button>`);

    const button = page.root.querySelector('button');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toBe('dda-btn btn-color-primary');
  });

  it('adds the custom class', async () => {
    const page = await render(`<dda-button custom_class="custom-class"></dda-button>`);

    expect(page.root.querySelector('button')).toHaveClasses(['dda-btn', 'btn-color-primary', 'custom-class']);
  });

  it('builds a class for each style prop', async () => {
    const page = await render(`<dda-button button_color="error" size="lg" button_shape="circle" gap="2"></dda-button>`);

    expect(page.root.querySelector('button')).toHaveClasses(['btn-color-error', 'btn-size-lg', 'btn-shape-circle', 'dda-gap-2']);
  });

  it('renders the start icon and the end icon', async () => {
    const page = await render(`<dda-button start_icon="sentiment_satisfied" end_icon="arrow_forward"></dda-button>`);

    const icons = page.root.querySelectorAll('button i');
    expect(icons.length).toBe(2);
    expect(icons[0].textContent).toBe('sentiment_satisfied');
    expect(icons[1].textContent).toBe('arrow_forward');
  });

  it('renders no icon when no icon prop is set', async () => {
    const page = await render(`<dda-button></dda-button>`);

    expect(page.root.querySelectorAll('button i').length).toBe(0);
  });

  it('sets the disabled state, the id, the name and the label', async () => {
    const page = await render(`<dda-button disabled="true" button_id="save" button_name="save-btn" aria_label="Save"></dda-button>`);

    const button = page.root.querySelector('button');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.getAttribute('id')).toBe('save');
    expect(button.getAttribute('name')).toBe('save-btn');
    expect(button.getAttribute('aria-label')).toBe('Save');
  });

  it('uses the given button type', async () => {
    const page = await render(`<dda-button type="submit"></dda-button>`);

    expect(page.root.querySelector('button').getAttribute('type')).toBe('submit');
  });
});
