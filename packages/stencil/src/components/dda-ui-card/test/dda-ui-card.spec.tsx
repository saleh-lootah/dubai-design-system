import { newSpecPage } from '@stencil/core/testing';
import { DdaUiCard } from '../dda-ui-card';

describe('dda-ui-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DdaUiCard],
      html: `<dda-ui-card></dda-ui-card>`,
    });
    expect(page.root).toEqualHtml(`
      <dda-ui-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dda-ui-card>
    `);
  });
});
