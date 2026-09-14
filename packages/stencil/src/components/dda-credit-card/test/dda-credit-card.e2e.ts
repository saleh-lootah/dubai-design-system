import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../utils/contrast';

const card = (design: string) => `<dda-credit-card design="${design}" balance="AED 1,000" name="A B" card_number="1234567890123456" card_type=""></dda-credit-card>`;

describe('dda-credit-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(card('default'));

    const el = await page.find('dda-credit-card');
    expect(el).toHaveClass('hydrated');
  });

  // card_number was sliced unconditionally, so a card without it threw
  // during render and never showed.
  it('renders without errors when card_number is not set', async () => {
    const page = await newE2EPage();
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(String(err)));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.setContent('<dda-credit-card balance="AED 1,000" name="A B"></dda-credit-card>');

    const el = await page.find('dda-credit-card');
    expect(el).toHaveClass('hydrated');

    const number = await page.find('dda-credit-card .dda-card-number');
    expect(number.textContent.trim()).toBe('****');
    expect(errors).toEqual([]);
  });

  it('shows the last four characters of card_number', async () => {
    const page = await newE2EPage();
    await page.setContent(card('default'));

    const number = await page.find('dda-credit-card .dda-card-number');
    expect(number.textContent).toBe('**** 3456');
  });

  // The image was always rendered, so an empty card_type showed as a broken image.
  it('renders no card type image when card_type is not set', async () => {
    const page = await newE2EPage();
    await page.setContent(card('default'));

    const img = await page.find('dda-credit-card img');
    expect(img).toBeNull();
  });

  it('renders the card type image with the card_type URL when set', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-credit-card name="A B" card_number="1234" card_type="/images/card-type.svg"></dda-credit-card>');

    const img = await page.find('dda-credit-card img.card-type-icon');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/images/card-type.svg');
  });
});

// F-023 (B2): both the green and dark variants' backgrounds were the
// theme-flipping `--dda-color-primary-40` / `--dda-on-surface-variant-30`,
// which lighten in dark theme, paired with fixed raw white text —
// 2.30:1 (green) / 1.70:1 (dark) before the fix.
describe('dda-credit-card variant contrast (F-023)', () => {
  for (const design of ['green', 'dark']) {
    it(`${design}: card name text clears 4.5:1 in light theme`, async () => {
      const page = await newE2EPage();
      await page.setContent(card(design));

      const colors = await page.evaluate(d => {
        const container = document.querySelector(`dda-credit-card .dda-credit-card-${d}`) as HTMLElement;
        const name = document.querySelector('dda-credit-card .dda-card-name') as HTMLElement;
        return {
          color: getComputedStyle(name).color,
          background: getComputedStyle(container).backgroundColor,
        };
      }, design);

      expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
    });

    it(`${design}: card name text clears 4.5:1 in dark theme`, async () => {
      const page = await newE2EPage();
      await page.setContent(card(design));
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      await page.waitForChanges();

      const colors = await page.evaluate(d => {
        const container = document.querySelector(`dda-credit-card .dda-credit-card-${d}`) as HTMLElement;
        const name = document.querySelector('dda-credit-card .dda-card-name') as HTMLElement;
        return {
          color: getComputedStyle(name).color,
          background: getComputedStyle(container).backgroundColor,
        };
      }, design);

      expect(contrastRatio(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
