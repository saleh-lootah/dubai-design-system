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

  // O-006/F-034: the prop was only `current_Step`, whose HTML attribute is
  // `current_-step`, so the documented `current_step` attribute did nothing.
  // `current_step` is now a real prop; `current_-step` keeps working.
  it('moves the active step with the documented current_step attribute and the legacy current_-step', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-vertical-stepper steps='${STEPS}' current_step="1"></dda-vertical-stepper>`);

    const activeAfterDocumentedAttr = await page.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step')).map(e => e.classList.contains('active')));
    expect(activeAfterDocumentedAttr).toEqual([true, true, false]);

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

  // `steps` was JSON.parse'd once in componentWillLoad with no guard: a
  // missing or invalid value threw (logged as a console error) and later
  // changes were ignored. It is now parsed safely and on every change.
  it('renders no steps and logs no errors when the steps attribute is missing', async () => {
    const page = await newE2EPage();
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(String(err)));
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await page.setContent('<dda-vertical-stepper></dda-vertical-stepper>');
    await page.waitForChanges();

    const el = await page.find('dda-vertical-stepper');
    expect(el).toHaveClass('hydrated');

    const steps = await page.findAll('dda-vertical-stepper .v-step');
    expect(steps).toHaveLength(0);
    expect(errors).toEqual([]);
  });

  it('renders no steps and logs no errors when steps is invalid JSON', async () => {
    const page = await newE2EPage();
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(String(err)));
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    await page.setContent(`<dda-vertical-stepper steps='not json'></dda-vertical-stepper>`);
    await page.waitForChanges();

    const el = await page.find('dda-vertical-stepper');
    expect(el).toHaveClass('hydrated');
    expect(await page.findAll('dda-vertical-stepper .v-step')).toHaveLength(0);
    expect(errors).toEqual([]);
  });

  it('re-renders when steps changes after load', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-vertical-stepper steps='${STEPS}'></dda-vertical-stepper>`);
    expect(await page.findAll('dda-vertical-stepper .v-step')).toHaveLength(3);

    const next = JSON.stringify([
      { icon: 'person', title: 'New 1', subtitle: 'Subtitle 1', description: 'Description 1' },
      { icon: 'folder', title: 'New 2', subtitle: 'Subtitle 2', description: 'Description 2' },
    ]);
    await page.$eval('dda-vertical-stepper', (el: HTMLDdaVerticalStepperElement, value: string) => (el.steps = value), next);
    await page.waitForChanges();

    expect(await page.findAll('dda-vertical-stepper .v-step')).toHaveLength(2);
    const titles = await page.evaluate(() => Array.from(document.querySelectorAll('dda-vertical-stepper .v-step-title')).map(e => e.textContent));
    expect(titles).toEqual(['New 1', 'New 2']);
  });
});
