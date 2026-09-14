import { newSpecPage } from '@stencil/core/testing';
import { DdaToggle } from '../dda-toggle';

const render = (html: string) => newSpecPage({ components: [DdaToggle], html });

describe('dda-toggle', () => {
  it('renders the title and supporting text from props', async () => {
    const page = await render(`<dda-toggle input_id="t1" title_text="Notifications" supporting="Email me updates"></dda-toggle>`);

    expect(page.root.querySelector('.toggle-title').textContent).toBe('Notifications');
    expect(page.root.querySelector('.toggle-supporting').textContent).toBe('Email me updates');
  });

  it('renders no placeholder text when no title is set', async () => {
    const page = await render(`<dda-toggle input_id="t1" aria_label="Notifications"></dda-toggle>`);

    expect(page.root.textContent).not.toContain('Radio Button Title');
    expect(page.root.querySelector('.toggle-title')).toBeNull();
    expect(page.root.querySelector('.toggle-supporting')).toBeNull();
  });

  it('renders the title without supporting text', async () => {
    const page = await render(`<dda-toggle input_id="t1" title_text="Notifications"></dda-toggle>`);

    expect(page.root.querySelector('.toggle-title').textContent).toBe('Notifications');
    expect(page.root.querySelector('.toggle-supporting')).toBeNull();
  });
});
