import { newE2EPage } from '@stencil/core/testing';
import { contrastRatio } from '../../utils/contrast';
import { emulateForcedColors, readFocusRing, tabTo } from '../../utils/focus-ring';

// WCAG 2.4.7 / 1.4.11 (5.3.5): an external audit flagged dda-select's focus
// indicator. Every field built on input.css set `outline: none` on focus and
// showed only a 1px teal border and a halo that is 1.16:1 on white (1.31:1
// on #191C1C). Windows forced-colors mode drops the halo and paints every
// border one colour, so focus did not show there at all. Keyboard focus now
// draws a 2px outline 2px outside the field.

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

// `ring` is the element that draws the ring: the field itself, or, for the
// phone and number fields, the bordered group around their input.
const FIELDS = [
  { tag: 'dda-input', html: '<dda-input input_id="f"></dda-input>', ring: 'dda-input .dda-input-field' },
  { tag: 'dda-textarea', html: '<dda-textarea input_id="f"></dda-textarea>', ring: 'dda-textarea .dda-input-field' },
  { tag: 'dda-select', html: `<dda-select button_id="f" options='["Option 1"]'></dda-select>`, ring: 'dda-select .dda-select-header' },
  { tag: 'dda-dropdown', html: `<dda-dropdown button_id="f" options='["Option 1"]'></dda-dropdown>`, ring: 'dda-dropdown .dda-dropdown-header' },
  { tag: 'dda-search-input', html: '<dda-search-input input_id="f"></dda-search-input>', ring: 'dda-search-input .dda-input-field' },
  { tag: 'dda-creditcard-field', html: '<dda-creditcard-field input_id="f"></dda-creditcard-field>', ring: 'dda-creditcard-field .dda-input-field' },
  { tag: 'dda-number-field', html: '<dda-number-field input_id="f"></dda-number-field>', ring: 'dda-number-field .dda-input-field-group' },
  { tag: 'dda-phonefield', html: '<dda-phonefield input_id="f"></dda-phonefield>', ring: 'dda-phonefield .dda-input-field-group' },
];

describe('field focus ring', () => {
  for (const field of FIELDS) {
    for (const theme of [undefined, 'dark'] as const) {
      const label = theme ? 'dark' : 'light';

      it(`${field.tag}: keyboard focus draws a 2px ring that clears 3:1 against the page in ${label} theme`, async () => {
        const page = await newE2EPage();
        await page.setContent(field.html);
        if (theme) {
          await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
          await page.waitForChanges();
        }

        const resting = await page.evaluate(readFocusRing, field.ring);
        expect(resting.outlineStyle).toBe('none');

        await tabTo(page, 'f');
        const ring = await page.evaluate(readFocusRing, field.ring);

        expect(ring.outlineStyle).toBe('solid');
        expect(ring.outlineWidth).toBeGreaterThanOrEqual(2);
        expect(contrastRatio(ring.outlineColor, ring.pageBackground)).toBeGreaterThanOrEqual(3);
      });
    }

    it(`${field.tag}: keyboard focus still draws the ring in forced-colors mode`, async () => {
      const page = await newE2EPage();
      await emulateForcedColors(page);
      await page.setContent(field.html);

      await tabTo(page, 'f');
      const ring = await page.evaluate(readFocusRing, field.ring);

      // box-shadow is gone, which shows the emulation is on.
      expect(ring.boxShadow).toBe('none');
      expect(ring.outlineStyle).toBe('solid');
      expect(ring.outlineColor).not.toBe(TRANSPARENT);
    });
  }

  for (const tag of ['dda-input', 'dda-select']) {
    it(`${tag}: .light-mode clears 3:1 against a light page`, async () => {
      const page = await newE2EPage();
      const ring = tag === 'dda-input' ? 'dda-input .dda-input-field' : 'dda-select .dda-select-header';
      await page.setContent(
        tag === 'dda-input'
          ? '<dda-input input_id="f" component_mode="light-mode"></dda-input>'
          : `<dda-select button_id="f" options='["Option 1"]' component_mode="light-mode"></dda-select>`,
      );

      await tabTo(page, 'f');
      const focused = await page.evaluate(readFocusRing, ring);

      expect(focused.outlineStyle).toBe('solid');
      expect(contrastRatio(focused.outlineColor, focused.pageBackground)).toBeGreaterThanOrEqual(3);
    });
  }

  it('dda-select: a mouse click on the trigger shows no ring', async () => {
    const page = await newE2EPage();
    await page.setContent(`<dda-select button_id="f" options='["Option 1"]'></dda-select>`);

    await page.click('dda-select .dda-select-header');
    await page.waitForChanges();
    const clicked = await page.evaluate(() => {
      const el = document.querySelector('dda-select .dda-select-header') as HTMLElement;
      return { focused: el === document.activeElement, outlineStyle: getComputedStyle(el).outlineStyle };
    });

    expect(clicked.focused).toBe(true);
    expect(clicked.outlineStyle).toBe('none');
  });

  it('dda-phonefield: a filled field that does not have focus shows no ring', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-phonefield input_id="f"></dda-phonefield><button id="next">Next</button>');

    await tabTo(page, 'f');
    await page.keyboard.type('501234567');
    await tabTo(page, 'next');
    const container = await page.evaluate(() => document.querySelector('dda-phonefield .dda-input-container').className);
    const ring = await page.evaluate(readFocusRing, 'dda-phonefield .dda-input-field-group');

    expect(container).toContain('dda-input-focus-filled');
    expect(ring.outlineStyle).toBe('none');
  });
});

// Error and disabled fields keep the white+dark box-shadow ring. It carries a
// transparent outline, so it is one ring normally and still shows in
// forced-colors mode, where the box-shadow is dropped.
describe('field focus ring in the error and disabled states', () => {
  const STATES = [
    { name: 'dda-input error', html: '<dda-input input_id="f" validation_type="error"></dda-input>' },
    { name: 'dda-input disabled', html: '<dda-input input_id="f" input_status="disabled"></dda-input>' },
    { name: 'dda-select error', html: `<dda-select button_id="f" options='["Option 1"]' error="error"></dda-select>` },
    { name: 'dda-select disabled', html: `<dda-select button_id="f" options='["Option 1"]' disabled="true"></dda-select>` },
    { name: 'dda-number-field error', html: '<dda-number-field input_id="f" validation_type="error"></dda-number-field>' },
  ];

  for (const state of STATES) {
    it(`${state.name}: shows one ring, not the teal outline as well`, async () => {
      const page = await newE2EPage();
      await page.setContent(state.html);

      await tabTo(page, 'f');
      const ring = await page.evaluate(readFocusRing, '#f');

      expect(ring.boxShadow).not.toBe('none');
      expect(ring.outlineColor).toBe(TRANSPARENT);
    });

    it(`${state.name}: still shows a ring in forced-colors mode`, async () => {
      const page = await newE2EPage();
      await emulateForcedColors(page);
      await page.setContent(state.html);

      await tabTo(page, 'f');
      const ring = await page.evaluate(readFocusRing, '#f');

      expect(ring.boxShadow).toBe('none');
      expect(ring.outlineStyle).toBe('solid');
      expect(ring.outlineColor).not.toBe(TRANSPARENT);
    });
  }

  it('dda-number-field error: the group around the input draws no second ring', async () => {
    const page = await newE2EPage();
    await page.setContent('<dda-number-field input_id="f" validation_type="error"></dda-number-field>');

    await tabTo(page, 'f');
    const group = await page.evaluate(readFocusRing, 'dda-number-field .dda-input-field-group');

    expect(group.outlineStyle).toBe('none');
  });

  it('dda-select: a focused option still shows a ring in forced-colors mode', async () => {
    const page = await newE2EPage();
    await emulateForcedColors(page);
    await page.setContent(`<dda-select button_id="f" options='["Option 1","Option 2"]'></dda-select>`);

    await tabTo(page, 'f');
    await page.keyboard.press('ArrowDown');
    await page.waitForChanges();
    const option = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { role: el.getAttribute('role'), outlineStyle: s.outlineStyle, outlineColor: s.outlineColor, boxShadow: s.boxShadow };
    });

    expect(option.role).toBe('option');
    expect(option.boxShadow).toBe('none');
    expect(option.outlineStyle).toBe('solid');
    expect(option.outlineColor).not.toBe(TRANSPARENT);
  });
});
