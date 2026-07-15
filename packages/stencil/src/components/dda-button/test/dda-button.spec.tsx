import { newSpecPage } from '@stencil/core/testing';
import { DdaButton } from '../dda-button';

describe('dda-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DdaButton],
      html: `<dda-button></dda-button>`,
    });
    expect(page.root).toEqualHtml(`
      <dda-button>
        <mock:shadow-root>
          <button class="dda-btn dda-btn-primary">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </dda-button>
    `);
  });

  it('renders with custom class', async () => {
    const page = await newSpecPage({
      components: [DdaButton],
      html: `<dda-button custom-class="custom-class"></dda-button>`,
    });
    expect(page.root).toEqualHtml(`
      <dda-button custom-class="custom-class">
        <mock:shadow-root>
          <button class="dda-btn dda-btn-primary custom-class">
            <slot></slot>
          </button>
        </mock:shadow-root>
      </dda-button>
    `);
  });

  it('renders with icons', async () => {
    const page = await newSpecPage({
      components: [DdaButton],
      html: `<dda-button start_icon="sentiment_satisfied" end_icon="arrow_forward"></dda-button>`,
    });
    expect(page.root).toEqualHtml(`
      <dda-button start_icon="sentiment_satisfied" end_icon="arrow_forward">
        <mock:shadow-root>
          <button class="dda-btn dda-btn-primary">
            <i class="material-icons  material-symbols-outlined"></i>
            <slot></slot>
            <i class="material-icons  material-symbols-outlined"></i>
          </button>
        </mock:shadow-root>
      </dda-button>
    `);
  });
});
