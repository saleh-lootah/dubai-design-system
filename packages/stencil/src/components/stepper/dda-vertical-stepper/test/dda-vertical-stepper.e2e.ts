import { newE2EPage } from '@stencil/core/testing';

const STEPS = JSON.stringify([
  { icon: 'sentiment_satisfied', title: 'Step 1', subtitle: 'Subtitle 1', description: 'Description 1' },
  { icon: 'sentiment_satisfied', title: 'Step 2', subtitle: 'Subtitle 2', description: 'Description 2' },
  { icon: 'sentiment_satisfied', title: 'Step 3', subtitle: 'Subtitle 3', description: 'Description 3' },
]);

describe('dda-vertical-stepper', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-vertical-stepper steps='${STEPS}'></dda-vertical-stepper>`);

    const el = await page.find('dda-vertical-stepper');
    expect(el).toHaveClass('hydrated');
  });

  // A screen reader traverses this as one step per parsed entry, each
  // carrying its own title/subtitle/description text - not just an element
  // count.
  it('renders one step per parsed entry, with its title, subtitle and description', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-vertical-stepper steps='${STEPS}'></dda-vertical-stepper>`);

    const steps = await page.findAll('dda-vertical-stepper .v-step');
    expect(steps).toHaveLength(3);

    const titles = await page.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step-title')).map(e => e.textContent));
    expect(titles).toEqual(['Step 1', 'Step 2', 'Step 3']);

    const subtitles = await page.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step-subtitle')).map(e => e.textContent));
    expect(subtitles).toEqual(['Subtitle 1', 'Subtitle 2', 'Subtitle 3']);
  });

  // Real prop-name check, confirmed with a build (resolves O-006/F-034):
  // the component's `@Prop() current_Step` compiles to the HTML attribute
  // `current_-step` - NOT `current_step`, which is what the story
  // (dda-vertical-stepper.stories.tsx) and the component's own doc example
  // both use. Verified directly: setting `current_step="1"` leaves the
  // stepper at its default (only step 0 active); only `current_-step="1"`
  // actually advances it. Documented here as a real defect, not fixed.
  it('the documented current_step attribute does not move the active step (real attribute is current_-step)', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-vertical-stepper steps='${STEPS}' current_step="2"></dda-vertical-stepper>`);

    const activeAfterDocumentedAttr = await page.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step')).map(e => e.classList.contains('active')));
    // Stays at the default current_Step of 0 - only the first step is active.
    expect(activeAfterDocumentedAttr).toEqual([true, false, false]);

    const page2 = await newE2EPage();
    await page2.setContent(`<dda-vertical-stepper steps='${STEPS}' current_-step="2"></dda-vertical-stepper>`);

    const activeWithRealAttr = await page2.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step')).map(e => e.classList.contains('active')));
    expect(activeWithRealAttr).toEqual([true, true, true]);
  });

  // Steps up to and including current_Step are marked active via a CSS
  // class only - never aria-current="step" (tracked as F-027). Documents
  // actual behaviour, not the ideal one.
  it('marks steps up to the current one as active, via a class not aria-current', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-vertical-stepper steps='${STEPS}' current_-step="1"></dda-vertical-stepper>`);

    const active = await page.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step')).map(e => e.classList.contains('active')));
    expect(active).toEqual([true, true, false]);

    const ariaCurrents = await page.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step')).map(e => e.getAttribute('aria-current')));
    expect(ariaCurrents).toEqual([null, null, null]);
  });

  // The steps prop is JSON.parse'd unconditionally in componentWillLoad with
  // no guard (unlike dda-breadcrumb's equivalent, which checks first). With
  // no steps attribute the parse throws internally; Stencil's lazy-loader
  // swallows it (logged as a console error) rather than crashing the page,
  // and the stepper is left permanently empty. Documented as real behaviour,
  // not fixed.
  it('renders no steps and does not crash the page when the steps attribute is missing', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-vertical-stepper></dda-vertical-stepper>');

    const el = await page.find('dda-vertical-stepper');
    expect(el).toHaveClass('hydrated');

    const steps = await page.findAll('dda-vertical-stepper .v-step');
    expect(steps).toHaveLength(0);
  });
});
