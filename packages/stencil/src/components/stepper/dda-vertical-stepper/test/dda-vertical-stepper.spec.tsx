import { newSpecPage } from '@stencil/core/testing';
import { DdaVerticalStepper } from '../dda-vertical-stepper';

const STEPS = JSON.stringify([
  { icon: 'looks_one', title: 'Step 1', subtitle: 'Subtitle 1', description: 'Description 1' },
  { icon: 'looks_two', title: 'Step 2', subtitle: 'Subtitle 2', description: 'Description 2' },
  { icon: 'looks_3', title: 'Step 3', subtitle: 'Subtitle 3', description: 'Description 3' },
]);

const activeSteps = (root: HTMLElement) => Array.from(root.querySelectorAll('.v-step')).map(step => step.classList.contains('active'));

describe('dda-vertical-stepper', () => {
  it('marks steps up to current_step as active', async () => {
    const page = await newSpecPage({
      components: [DdaVerticalStepper],
      html: `<dda-vertical-stepper steps='${STEPS}' current_step="1"></dda-vertical-stepper>`,
    });

    expect(activeSteps(page.root)).toEqual([true, true, false]);
  });

  it('still accepts the current_Step property', async () => {
    const page = await newSpecPage({ components: [DdaVerticalStepper], html: `<dda-vertical-stepper steps='${STEPS}'></dda-vertical-stepper>` });
    (page.root as any).current_Step = 2;
    await page.waitForChanges();

    expect(activeSteps(page.root)).toEqual([true, true, true]);
  });
});
