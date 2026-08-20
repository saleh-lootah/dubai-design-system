import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../../../utils/contrast';

// F-023: three separate pairings on this component.
// - Decision 1 (A1): the default (neither completed nor active) step's
//   subtitle/description used `--dda-neutral-60` — 3.18:1 against the page
//   body in light theme before the fix.
// - Row C: the default step's title (`--dda-neutral-variant-30`) and the
//   completed/active step's subtitle (`--dda-neutral-0`) and description
//   (`--dda-neutral-variant-30`) hardcoded near-black with no dark-theme
//   override at all — 1.22:1 / 1.84:1 against the dark page body before the
//   fix.
const STEPS = JSON.stringify([
  { title: 'Step 1', subtitle: 'Subtitle 1', description: 'Description 1' },
  { title: 'Step 2', subtitle: 'Subtitle 2', description: 'Description 2' },
  { title: 'Step 3', subtitle: 'Subtitle 3', description: 'Description 3' },
]);

describe('dda-horizontal-stepper', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-horizontal-stepper steps='${STEPS}' current_step="1"></dda-horizontal-stepper>`);

    const el = await page.find('dda-horizontal-stepper');
    expect(el).toHaveClass('hydrated');
  });
});

describe('dda-horizontal-stepper text contrast (F-023)', () => {
  const render = async (page, theme?: 'dark') => {
    await page.setContent(`<dda-horizontal-stepper steps='${STEPS}' current_step="1"></dda-horizontal-stepper>`);
    if (theme) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.waitForChanges();
    }
  };

  const readStep = (page, index: number) =>
    page.evaluate((i) => {
      const steps = document.querySelectorAll('dda-horizontal-stepper .h-step');
      const step = steps[i] as HTMLElement;
      const bg = getComputedStyle(document.body).backgroundColor;
      const title = step.querySelector('.h-step-title') as HTMLElement;
      const subtitle = step.querySelector('.h-step-subtitle') as HTMLElement;
      const description = step.querySelector('.h-step-description') as HTMLElement;
      return {
        title: getComputedStyle(title).color,
        subtitle: getComputedStyle(subtitle).color,
        description: getComputedStyle(description).color,
        background: bg,
      };
    }, index);

  for (const theme of [undefined, 'dark'] as const) {
    const label = theme ? 'dark' : 'light';

    it(`default step (index 2): title, subtitle and description all clear 4.5:1 in ${label} theme`, async () => {
      const page = await newE2EPage();
      await render(page, theme);
      const colors = await readStep(page, 2);

      expect(contrastRatio(colors.title, colors.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(colors.subtitle, colors.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(colors.description, colors.background)).toBeGreaterThanOrEqual(4.5);
    });

    it(`completed step (index 0): subtitle and description clear 4.5:1 in ${label} theme`, async () => {
      const page = await newE2EPage();
      await render(page, theme);
      const colors = await readStep(page, 0);

      expect(contrastRatio(colors.subtitle, colors.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(colors.description, colors.background)).toBeGreaterThanOrEqual(4.5);
    });

    it(`active step (index 1): subtitle and description clear 4.5:1 in ${label} theme`, async () => {
      const page = await newE2EPage();
      await render(page, theme);
      const colors = await readStep(page, 1);

      expect(contrastRatio(colors.subtitle, colors.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(colors.description, colors.background)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
